using Dapper;
using Microsoft.Data.SqlClient;
using System.Text.Json;
using System.Text.RegularExpressions;
using OmniSightAPI.Models;
using OmniSightAPI.Services;
using OmniSightAPI.Helpers;

namespace OmniSightAPI.Endpoints
{
    public static class WorkflowEndpoints
    {
        public static void MapWorkflowEndpoints(this IEndpointRouteBuilder endpoints)
        {
            var group = endpoints.MapGroup("/api/workflows")
                .WithTags("Workflows");

            group.MapPost("/create-and-execute", CreateAndExecuteWorkflow)
                .WithName("CreateAndExecuteWorkflow")
                .WithSummary("Create and execute a workflow from a template");
        }

        private static async Task<IResult> CreateAndExecuteWorkflow(
            CreateWorkflowFromTemplateRequest request,
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            IN8nService n8nService,
            IWorkflowService workflowService,
            IEncryptionService encryptionService)
        {
            try
            {
                Console.WriteLine($"🚀 Creating workflow from template: {request.TemplateId}");
                Console.WriteLine($"🔐 Received Credentials Keys: {string.Join(", ", request.Credentials.Keys)}");
                Console.WriteLine($"📝 Received Parameters Keys: {string.Join(", ", request.Parameters.Keys)}");

                var connectionString = configuration.GetConnectionString("DefaultConnection")
                                      ?? "Server=(localdb)\\MSSQLLocalDB;Database=OmniSight;Trusted_Connection=true;TrustServerCertificate=true;";

                using var connection = new SqlConnection(connectionString);
                await connection.OpenAsync();

                var userId = await GetOrCreateDefaultUser(connection);

                var template = await GetTemplate(connection, request.TemplateId);
                if (template == null)
                {
                    return Results.NotFound(new { error = $"Template '{request.TemplateId}' not found" });
                }

                Console.WriteLine($"✅ Template found: {template.name}");

                var credentialMappings = await ProcessCredentials(
                    connection,
                    request.Credentials,
                    userId,
                    template.name.ToString(),
                    n8nService,
                    encryptionService
                );

                if (request.Credentials.Count > 0 && credentialMappings.Count == 0)
                {
                    return Results.Problem("No credentials were successfully created in n8n. Cannot proceed.");
                }

                var templateJson = template.template_json.ToString();
                var workflowData = JsonSerializer.Deserialize<JsonElement>(templateJson);

                var newWorkflow = WorkflowHelpers.CreateWorkflowFromTemplate(
                    workflowData,
                    credentialMappings,
                    request.Parameters,
                    request.CustomName,
                    template.id.ToString()
                );

                var newWorkflowId = Guid.NewGuid().ToString();
                var workflowName = request.CustomName ?? $"{template.name} - {DateTime.Now:yyyyMMdd-HHmmss}";

                string n8nWorkflowId = await n8nService.SaveWorkflowAsync(newWorkflow, workflowName);
                Console.WriteLine($"✅ Workflow saved to n8n: {n8nWorkflowId}");

                await SaveWorkflowToDatabase(
                    connection,
                    newWorkflowId,
                    userId,
                    template.id.ToString(),
                    workflowName,
                    template.description?.ToString() ?? "Created from template",
                    newWorkflow,
                    n8nWorkflowId
                );

                Console.WriteLine($"✅ Workflow saved to database: {newWorkflowId}");

                long? executionId = null;
                if (!string.IsNullOrEmpty(n8nWorkflowId) && n8nWorkflowId != "n8n_unavailable")
                {
                    executionId = await ExecuteWorkflow(
                        connection,
                        n8nWorkflowId,
                        newWorkflowId,
                        userId,
                        workflowName,
                        newWorkflow,
                        request.Parameters,
                        workflowService
                    );
                }

                var responseStatus = n8nWorkflowId == "n8n_unavailable" ? "created_without_n8n" :
                                   executionId.HasValue ? "executing" : "saved_and_activated";

                var response = new CreateWorkflowResponse
                {
                    WorkflowName = workflowName,
                    N8nWorkflowId = n8nWorkflowId ?? "not_saved_to_n8n",
                    Status = responseStatus,
                    ExecutionId = executionId?.ToString(),
                    CreatedAt = DateTime.UtcNow
                };

                Console.WriteLine($"📤 Returning response: {JsonSerializer.Serialize(response)}");
                return Results.Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error: {ex.Message}");
                Console.WriteLine($"❌ Stack: {ex.StackTrace}");
                return Results.Problem($"Error creating workflow: {ex.Message}");
            }
        }

        private static async Task<string> GetOrCreateDefaultUser(SqlConnection connection)
        {
            var getUserIdSql = "SELECT TOP 1 id FROM [OmniSight].[dbo].[users] ORDER BY created_at";
            var userId = await connection.QueryFirstOrDefaultAsync<string>(getUserIdSql);

            if (string.IsNullOrEmpty(userId))
            {
                userId = Guid.NewGuid().ToString();
                await connection.ExecuteAsync(@"
                    INSERT INTO [OmniSight].[dbo].[users] (id, email, first_name, last_name, is_pending, role, created_at, updated_at) 
                    VALUES (@Id, @Email, @FirstName, @LastName, @IsPending, @Role, GETDATE(), GETDATE())",
                    new
                    {
                        Id = userId,
                        Email = "default@omnisight.com",
                        FirstName = "Default",
                        LastName = "User",
                        IsPending = false,
                        Role = "user"
                    });
            }

            return userId;
        }

        private static async Task<dynamic> GetTemplate(SqlConnection connection, string templateId)
        {
            var findTemplateSql = @"
                SELECT [id], [name], [description], [template_json], [required_credentials]
                FROM [OmniSight].[dbo].[workflow_templates] 
                WHERE [id] = @TemplateId";

            return await connection.QueryFirstOrDefaultAsync<dynamic>(findTemplateSql, new { TemplateId = templateId });
        }

        /// <summary>
        /// Process incoming credentials payload:
        ///  - parse credential payload into key-value pairs
        ///  - encrypt sensitive fields and store encrypted JSON in DB
        ///  - create credential in n8n and produce multiple mapping keys so templates can match them
        /// </summary>
        private static async Task<Dictionary<string, string>> ProcessCredentials(
            SqlConnection connection,
            Dictionary<string, JsonElement> credentials,
            string userId,
            string templateName,
            IN8nService n8nService,
            IEncryptionService encryptionService)
        {
            var credentialMappings = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

            foreach (var credentialPair in credentials)
            {
                var incomingKey = credentialPair.Key; // key from the frontend request
                var credValue = credentialPair.Value;

                Console.WriteLine($"🔐 Processing credential (incoming key): {incomingKey}");

                var credentialData = CredentialHelpers.ParseCredentialData(credValue);
                if (credentialData == null)
                {
                    Console.WriteLine($"⚠️ Failed to parse credential '{incomingKey}', skipping");
                    continue;
                }

                // Normalize payload values to string
                var normalizedCredentialData = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
                foreach (var kv in credentialData)
                {
                    if (kv.Value == null)
                        normalizedCredentialData[kv.Key] = string.Empty;
                    else
                        normalizedCredentialData[kv.Key] = kv.Value.ToString();
                }

                // Choose a friendly credential name:
                // prefer "name" field in payload, otherwise use the incoming key
                var credentialName = normalizedCredentialData.ContainsKey("name") && !string.IsNullOrWhiteSpace(normalizedCredentialData["name"])
                    ? normalizedCredentialData["name"]
                    : incomingKey;

                // Encrypt sensitive fields before saving to DB
                var encryptedCredentialData = EncryptSensitiveFields(normalizedCredentialData, encryptionService);

                var credentialId = Guid.NewGuid().ToString();
                try
                {
                    await connection.ExecuteAsync(@"
                        INSERT INTO [OmniSight].[dbo].[credentials] (
                            [id], [name], [type], [user_id], [credential_data], [created_at], [updated_at]
                        ) 
                        VALUES (@Id, @Name, @Type, @UserId, @CredentialData, GETDATE(), GETDATE())",
                        new
                        {
                            Id = credentialId,
                            Name = $"{credentialName} - {templateName}",
                            Type = incomingKey,
                            UserId = userId,
                            CredentialData = JsonSerializer.Serialize(encryptedCredentialData)
                        });

                    Console.WriteLine($"✅ Credential saved to database (encrypted): {credentialId} (name: {credentialName})");
                }
                catch (Exception dbEx)
                {
                    Console.WriteLine($"❌ Failed to insert credential row for {credentialName}: {dbEx.Message}");
                    // Skip creating in n8n if DB fails
                    continue;
                }

                // Try to create credential in n8n using normalized plaintext values
                try
                {
                    Console.WriteLine($"📤 Creating n8n credential (type: {incomingKey}, name: {credentialName}) with payload:");
                    Console.WriteLine(JsonSerializer.Serialize(normalizedCredentialData));

                    var n8nCredentialId = await n8nService.CreateCredentialAsync(
                        incomingKey,
                        normalizedCredentialData,
                        $"{credentialName} - {templateName} - {DateTime.Now:HHmmss}"
                    );

                    if (!string.IsNullOrEmpty(n8nCredentialId))
                    {
                        // Add multiple mapping keys to increase chance template nodes match:
                        //  - original incomingKey
                        //  - friendly credentialName
                        //  - normalized forms (lowercase, no-spaces)
                        //  - short types derived from the incomingKey / credentialName (e.g. smtp, oauth2, api)
                        var keysToMap = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
                        {
                            incomingKey,
                            credentialName
                        };

                        keysToMap.Add(incomingKey.ToLowerInvariant());
                        keysToMap.Add(credentialName.ToLowerInvariant());
                        keysToMap.Add(Regex.Replace(incomingKey.ToLowerInvariant(), @"\s+", ""));
                        keysToMap.Add(Regex.Replace(credentialName.ToLowerInvariant(), @"\s+", ""));

                        // attempt to derive short types
                        var shortType = DeriveShortCredentialType(incomingKey) ?? DeriveShortCredentialType(credentialName);
                        if (!string.IsNullOrWhiteSpace(shortType))
                        {
                            keysToMap.Add(shortType);
                        }

                        // Also add mapping by common placeholders seen in templates, eg smtpCredentialId
                        var placeholderVariants = new[]
                        {
                            $"{shortType}CredentialId",
                            $"{shortType}Id",
                            $"{shortType}credentialid",
                            $"{shortType}id"
                        };

                        foreach (var ph in placeholderVariants)
                            keysToMap.Add(ph);

                        foreach (var k in keysToMap)
                        {
                            if (!string.IsNullOrWhiteSpace(k) && !credentialMappings.ContainsKey(k))
                            {
                                credentialMappings[k] = n8nCredentialId;
                            }
                        }

                        Console.WriteLine($"✅ Credential created in n8n with ID: {n8nCredentialId} (mapped to keys: {string.Join(", ", keysToMap)})");
                    }
                    else
                    {
                        Console.WriteLine($"❌ n8nService returned no ID for credential '{credentialName}'");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"❌ Exception creating credential in n8n for '{credentialName}': {ex.Message}");
                    Console.WriteLine(ex.StackTrace);
                }
            }

            return credentialMappings;
        }

        private static string DeriveShortCredentialType(string input)
        {
            if (string.IsNullOrWhiteSpace(input)) return null;

            var lower = input.ToLowerInvariant();
            if (lower.Contains("smtp") || lower.Contains("email")) return "smtp";
            if (lower.Contains("oauth")) return "oauth2";
            if (lower.Contains("gmail") || lower.Contains("google")) return "oauth2";
            if (lower.Contains("api") || lower.Contains("apikey") || lower.Contains("apiKey".ToLower())) return "api";
            if (lower.Contains("http") && lower.Contains("basic")) return "httpBasicAuth";
            if (lower.Contains("http") && lower.Contains("header")) return "httpHeaderAuth";
            if (lower.Contains("smtpaccount") || lower.Contains("smtpaccount".ToLower())) return "smtp";
            // fallback: non-null normalized alphanum
            var cleaned = Regex.Replace(lower, @"[^a-z0-9]", "");
            return cleaned.Length > 0 ? cleaned : null;
        }

        private static Dictionary<string, string> EncryptSensitiveFields(
            Dictionary<string, string> credentialData,
            IEncryptionService encryptionService)
        {
            var encryptedData = new Dictionary<string, string>();

            var sensitiveFields = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                "password", "secret", "apiKey", "accessToken", "refreshToken",
                "clientSecret", "privateKey", "token", "key", "apikey", "user", "username"
            };

            foreach (var kvp in credentialData)
            {
                if (sensitiveFields.Contains(kvp.Key))
                {
                    try
                    {
                        encryptedData[kvp.Key] = encryptionService.Encrypt(kvp.Value);
                        Console.WriteLine($"🔒 Encrypted field: {kvp.Key}");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"❌ Encryption failed for field {kvp.Key}: {ex.Message}");
                        encryptedData[kvp.Key] = kvp.Value;
                    }
                }
                else
                {
                    encryptedData[kvp.Key] = kvp.Value;
                }
            }

            return encryptedData;
        }

        private static async Task SaveWorkflowToDatabase(
            SqlConnection connection,
            string workflowId,
            string userId,
            string templateId,
            string workflowName,
            string description,
            Dictionary<string, object> workflowData,
            string n8nWorkflowId)
        {
            var workflowJson = JsonSerializer.Serialize(workflowData);
            var nodes = WorkflowHelpers.ExtractNodes(workflowData);
            var connections = WorkflowHelpers.ExtractConnections(workflowData);
            var settings = WorkflowHelpers.ExtractSettings(workflowData);
            var staticData = WorkflowHelpers.ExtractStaticData(workflowData);

            await connection.ExecuteAsync(@"
                INSERT INTO [OmniSight].[dbo].[workflows] (
                    [id], [user_id], [template_id], [name], [description], [workflow_json],
                    [nodes], [connections], [save_execution_progress], [save_manual_executions],
                    [save_data_error_execution], [save_data_success_execution], [execution_timeout],
                    [error_workflow], [timezone], [execution_order], [static_data], [shared_workflows],
                    [status], [n8n_workflow_id], [created_at], [updated_at]
                ) 
                VALUES (
                    @Id, @UserId, @TemplateId, @Name, @Description, @WorkflowJson,
                    @Nodes, @Connections, @SaveExecutionProgress, @SaveManualExecutions,
                    @SaveDataErrorExecution, @SaveDataSuccessExecution, @ExecutionTimeout,
                    @ErrorWorkflow, @Timezone, @ExecutionOrder, @StaticData, @SharedWorkflows,
                    @Status, @N8nWorkflowId, GETDATE(), GETDATE()
                )",
                new
                {
                    Id = workflowId,
                    UserId = userId,
                    TemplateId = templateId,
                    Name = workflowName,
                    Description = description,
                    WorkflowJson = workflowJson,
                    Nodes = nodes,
                    Connections = connections,
                    SaveExecutionProgress = settings.saveExecutionProgress ?? false,
                    SaveManualExecutions = settings.saveManualExecutions ?? false,
                    SaveDataErrorExecution = settings.saveDataErrorExecution ?? "none",
                    SaveDataSuccessExecution = settings.saveDataSuccessExecution ?? "all",
                    ExecutionTimeout = settings.executionTimeout ?? 3600,
                    ErrorWorkflow = settings.errorWorkflow ?? "",
                    Timezone = settings.timezone ?? "UTC",
                    ExecutionOrder = settings.executionOrder ?? "v1",
                    StaticData = staticData,
                    SharedWorkflows = "[]",
                    Status = "active",
                    N8nWorkflowId = n8nWorkflowId
                });
        }

        private static async Task<long?> ExecuteWorkflow(
            SqlConnection connection,
            string n8nWorkflowId,
            string workflowId,
            string userId,
            string workflowName,
            Dictionary<string, object> workflowData,
            Dictionary<string, string> parameters,
            IWorkflowService workflowService)
        {
            try
            {
                Console.WriteLine($"⏳ Waiting 2 seconds for workflow to be ready...");
                await Task.Delay(2000);

                Console.WriteLine($"🎯 === STARTING WORKFLOW EXECUTION ===");

                var triggerType = WorkflowHelpers.DetectWorkflowTriggerType(workflowData);
                Console.WriteLine($"🎯 Trigger type detected: {triggerType}");

                if (workflowName.Contains("BitCoin") || workflowName.Contains("Bitcoin"))
                {
                    Console.WriteLine($"💡 TEMPORARY OVERRIDE: Forcing webhook execution for Bitcoin workflow");
                    triggerType = "webhook";
                }

                string n8nExecutionId = await workflowService.ExecuteWorkflowAsync(
                    n8nWorkflowId,
                    triggerType,
                    workflowData,
                    parameters
                );

                if (!string.IsNullOrEmpty(n8nExecutionId))
                {
                    Console.WriteLine($"✅ Execution ID obtained: {n8nExecutionId}");

                    var executionId = await RecordExecution(
                        connection,
                        n8nExecutionId,
                        workflowId,
                        userId,
                        "running"
                    );

                    Console.WriteLine($"✅ Execution recorded in database with ID: {executionId}");
                    return executionId;
                }
                else
                {
                    Console.WriteLine($"❌ No execution ID returned from workflow service");

                    var fallbackExecutionId = await RecordExecution(
                        connection,
                        "unknown",
                        workflowId,
                        userId,
                        "unknown"
                    );

                    Console.WriteLine($"⚠️ Created fallback execution record with ID: {fallbackExecutionId}");
                    return fallbackExecutionId;
                }
            }
            catch (Exception execEx)
            {
                Console.WriteLine($"❌ EXCEPTION during execution: {execEx.Message}");
                Console.WriteLine($"Stack: {execEx.StackTrace}");

                try
                {
                    var errorExecutionId = await RecordExecution(
                        connection,
                        "error",
                        workflowId,
                        userId,
                        "error"
                    );
                    Console.WriteLine($"⚠️ Recorded error execution with ID: {errorExecutionId}");
                }
                catch (Exception recordEx)
                {
                    Console.WriteLine($"❌ Failed to record error execution: {recordEx.Message}");
                }

                return null;
            }
        }

        private static async Task<long> RecordExecution(
            SqlConnection connection,
            string n8nExecutionId,
            string workflowId,
            string userId,
            string status)
        {
            long executionId;
            if (long.TryParse(n8nExecutionId, out executionId))
            {
                Console.WriteLine($"✅ Using n8n execution ID: {executionId}");
            }
            else
            {
                executionId = (DateTime.UtcNow.Ticks % 1000000000000L) * 10000 + new Random().Next(1000, 9999);
                Console.WriteLine($"⚠️ Generated fallback execution ID: {executionId}");
            }

            await connection.ExecuteAsync(@"
                INSERT INTO [OmniSight].[dbo].[executions] 
                (id, workflow_id, data, finished, status, mode, started_at, custom_data) 
                VALUES (@Id, @WorkflowId, @Data, @Finished, @Status, @Mode, @StartedAt, @CustomData)",
                new
                {
                    Id = executionId,
                    WorkflowId = workflowId,
                    Data = "{}",
                    Finished = false,
                    Status = status == "completed" || status == "finished" ? "success" : "running",
                    Mode = "manual",
                    StartedAt = DateTime.UtcNow,
                    CustomData = JsonSerializer.Serialize(new { n8nExecutionId })
                });

            return executionId;
        }
    }
}
