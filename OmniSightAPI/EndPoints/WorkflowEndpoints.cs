using Dapper;
using FluentValidation;
using Microsoft.Data.SqlClient;
using System.Text.Json;
using System.Text.RegularExpressions;
using OmniSightAPI.Constants;
using OmniSightAPI.Extensions;
using OmniSightAPI.Helpers;
using OmniSightAPI.Models;
using OmniSightAPI.Services;
using Serilog;

namespace OmniSightAPI.Endpoints
{
    public static class WorkflowEndpoints
    {
        private static readonly ILogger _logger = Log.ForContext(typeof(WorkflowEndpoints));

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
            IValidator<CreateWorkflowFromTemplateRequest> validator,
            IConfiguration configuration,
            IN8nService n8nService,
            IWorkflowService workflowService,
            IEncryptionService encryptionService)
        {
            // Validate request
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(
                        g => g.Key,
                        g => g.Select(e => e.ErrorMessage).ToArray());
                
                return EndpointExtensions.ValidationError(errors);
            }

            try
            {
                _logger.Information("Creating workflow from template. TemplateId: {TemplateId}, CredentialsCount: {CredentialsCount}, ParametersCount: {ParametersCount}",
                    request.TemplateId, request.Credentials.Count, request.Parameters.Count);

                var connectionString = configuration.GetConnectionString("DefaultConnection")
                                      ?? ApplicationConstants.DefaultConnectionString;

                await using var connection = new SqlConnection(connectionString);
                await connection.OpenAsync();

                var userId = await GetOrCreateDefaultUserAsync(connection);

                var template = await GetTemplateAsync(connection, request.TemplateId);
                if (template == null)
                {
                    _logger.Warning("Template not found. TemplateId: {TemplateId}", request.TemplateId);
                    return EndpointExtensions.NotFound($"Template '{request.TemplateId}' not found");
                }

                _logger.Information("Template found. TemplateId: {TemplateId}, TemplateName: {TemplateName}",
                    request.TemplateId, template.name);

                var credentialMappings = await ProcessCredentialsAsync(
                    connection,
                    request.Credentials,
                    userId,
                    template.name.ToString(),
                    n8nService,
                    encryptionService
                );

                if (request.Credentials.Count > 0 && credentialMappings.Count == 0)
                {
                    _logger.Warning("No credentials were successfully created in n8n. Cannot proceed. TemplateId: {TemplateId}",
                        request.TemplateId);
                    return EndpointExtensions.Error(
                        "No credentials were successfully created in n8n. Cannot proceed.",
                        ApplicationConstants.ErrorCodes.CredentialCreationFailed);
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
                var workflowName = request.CustomName ?? $"{template.name} - {DateTime.UtcNow:yyyyMMdd-HHmmss}";

                var saveResult = await n8nService.SaveWorkflowAsync(newWorkflow, workflowName);
                var n8nWorkflowId = saveResult.WorkflowId ?? ApplicationConstants.N8nUnavailable;
                
                _logger.Information("Workflow saved to n8n. WorkflowId: {WorkflowId}, N8nWorkflowId: {N8nWorkflowId}, Success: {Success}",
                    newWorkflowId, n8nWorkflowId, saveResult.Success);
                
                if (saveResult.Errors.Count > 0)
                {
                    _logger.Warning("Workflow saved with errors. WorkflowId: {WorkflowId}, Errors: {Errors}",
                        newWorkflowId, string.Join("; ", saveResult.Errors));
                }
                
                if (saveResult.Warnings.Count > 0)
                {
                    _logger.Information("Workflow saved with warnings. WorkflowId: {WorkflowId}, Warnings: {Warnings}",
                        newWorkflowId, string.Join("; ", saveResult.Warnings));
                }

                await SaveWorkflowToDatabaseAsync(
                    connection,
                    newWorkflowId,
                    userId,
                    template.id.ToString(),
                    workflowName,
                    template.description?.ToString() ?? "Created from template",
                    newWorkflow,
                    n8nWorkflowId
                );

                _logger.Information("Workflow saved to database. WorkflowId: {WorkflowId}", newWorkflowId);

                long? executionId = null;
                if (!string.IsNullOrEmpty(n8nWorkflowId) && n8nWorkflowId != ApplicationConstants.N8nUnavailable)
                {
                    executionId = await ExecuteWorkflowAsync(
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

                var responseStatus = n8nWorkflowId == ApplicationConstants.N8nUnavailable 
                    ? "created_without_n8n" 
                    : executionId.HasValue 
                        ? "executing" 
                        : "saved_and_activated";

                var response = new CreateWorkflowResponse
                {
                    WorkflowName = workflowName,
                    N8nWorkflowId = n8nWorkflowId ?? "not_saved_to_n8n",
                    Status = responseStatus,
                    ExecutionId = executionId?.ToString(),
                    CreatedAt = DateTime.UtcNow,
                    Errors = saveResult.Errors.Count > 0 ? saveResult.Errors : null,
                    Warnings = saveResult.Warnings.Count > 0 ? saveResult.Warnings : null
                };

                _logger.Information("Workflow creation completed. WorkflowId: {WorkflowId}, Status: {Status}, Errors: {ErrorCount}, Warnings: {WarningCount}",
                    newWorkflowId, responseStatus, saveResult.Errors.Count, saveResult.Warnings.Count);
                
                return EndpointExtensions.Success(response, "Workflow created successfully");
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error creating workflow from template. TemplateId: {TemplateId}",
                    request.TemplateId);
                return EndpointExtensions.InternalServerError($"Error creating workflow: {ex.Message}");
            }
        }

        private static async Task<string> GetOrCreateDefaultUserAsync(SqlConnection connection)
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

        private static async Task<dynamic?> GetTemplateAsync(SqlConnection connection, string templateId)
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
        private static async Task<Dictionary<string, string>> ProcessCredentialsAsync(
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

                _logger.Debug("Processing credential. IncomingKey: {IncomingKey}", incomingKey);

                var credentialData = CredentialHelpers.ParseCredentialData(credValue);
                if (credentialData == null)
                {
                    _logger.Warning("Failed to parse credential. IncomingKey: {IncomingKey}, skipping", incomingKey);
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

                    _logger.Information("Credential saved to database (encrypted). CredentialId: {CredentialId}, Name: {CredentialName}",
                        credentialId, credentialName);
                }
                catch (Exception dbEx)
                {
                    _logger.Error(dbEx, "Failed to insert credential row. CredentialName: {CredentialName}", credentialName);
                    // Skip creating in n8n if DB fails
                    continue;
                }

                // Try to create credential in n8n using normalized plaintext values
                try
                {
                    _logger.Debug("Creating n8n credential. Type: {IncomingKey}, Name: {CredentialName}",
                        incomingKey, credentialName);

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

                        _logger.Information("Credential created in n8n. CredentialId: {N8nCredentialId}, MappedKeys: {MappedKeys}",
                            n8nCredentialId, string.Join(", ", keysToMap));
                    }
                    else
                    {
                        _logger.Warning("n8nService returned no ID for credential. CredentialName: {CredentialName}", credentialName);
                    }
                }
                catch (Exception ex)
                {
                    _logger.Error(ex, "Exception creating credential in n8n. CredentialName: {CredentialName}", credentialName);
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
                        _logger.Debug("Encrypted sensitive field. FieldName: {FieldName}", kvp.Key);
                    }
                    catch (Exception ex)
                    {
                        _logger.Warning(ex, "Encryption failed for field. FieldName: {FieldName}, using unencrypted value", kvp.Key);
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

        private static async Task SaveWorkflowToDatabaseAsync(
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

        private static async Task<long?> ExecuteWorkflowAsync(
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
                _logger.Debug("Waiting for workflow to be ready before execution. WorkflowId: {WorkflowId}", workflowId);
                await Task.Delay(2000, CancellationToken.None);

                _logger.Information("Starting workflow execution. WorkflowId: {WorkflowId}, N8nWorkflowId: {N8nWorkflowId}",
                    workflowId, n8nWorkflowId);

                var triggerType = WorkflowHelpers.DetectWorkflowTriggerType(workflowData);
                _logger.Debug("Trigger type detected. WorkflowId: {WorkflowId}, TriggerType: {TriggerType}",
                    workflowId, triggerType);

                if (workflowName.Contains("BitCoin", StringComparison.OrdinalIgnoreCase) || 
                    workflowName.Contains("Bitcoin", StringComparison.OrdinalIgnoreCase))
                {
                    _logger.Information("Temporary override: Forcing webhook execution for Bitcoin workflow. WorkflowId: {WorkflowId}",
                        workflowId);
                    triggerType = "webhook";
                }

                var n8nExecutionId = await workflowService.ExecuteWorkflowAsync(
                    n8nWorkflowId,
                    triggerType,
                    workflowData,
                    parameters
                );

                if (!string.IsNullOrEmpty(n8nExecutionId))
                {
                    _logger.Information("Execution ID obtained. WorkflowId: {WorkflowId}, N8nExecutionId: {N8nExecutionId}",
                        workflowId, n8nExecutionId);

                    var executionId = await RecordExecutionAsync(
                        connection,
                        n8nExecutionId,
                        workflowId,
                        userId,
                        "running"
                    );

                    _logger.Information("Execution recorded in database. WorkflowId: {WorkflowId}, ExecutionId: {ExecutionId}",
                        workflowId, executionId);
                    return executionId;
                }
                else
                {
                    _logger.Warning("No execution ID returned from workflow service. WorkflowId: {WorkflowId}", workflowId);

                    var fallbackExecutionId = await RecordExecutionAsync(
                        connection,
                        "unknown",
                        workflowId,
                        userId,
                        "unknown"
                    );

                    _logger.Warning("Created fallback execution record. WorkflowId: {WorkflowId}, ExecutionId: {ExecutionId}",
                        workflowId, fallbackExecutionId);
                    return fallbackExecutionId;
                }
            }
            catch (Exception execEx)
            {
                _logger.Error(execEx, "Exception during workflow execution. WorkflowId: {WorkflowId}", workflowId);

                try
                {
                    var errorExecutionId = await RecordExecutionAsync(
                        connection,
                        "error",
                        workflowId,
                        userId,
                        "error"
                    );
                    _logger.Warning("Recorded error execution. WorkflowId: {WorkflowId}, ExecutionId: {ExecutionId}",
                        workflowId, errorExecutionId);
                }
                catch (Exception recordEx)
                {
                    _logger.Error(recordEx, "Failed to record error execution. WorkflowId: {WorkflowId}", workflowId);
                }

                return null;
            }
        }

        private static async Task<long> RecordExecutionAsync(
            SqlConnection connection,
            string n8nExecutionId,
            string workflowId,
            string userId,
            string status)
        {
            long executionId;
            if (long.TryParse(n8nExecutionId, out executionId))
            {
                _logger.Debug("Using n8n execution ID. WorkflowId: {WorkflowId}, ExecutionId: {ExecutionId}",
                    workflowId, executionId);
            }
            else
            {
                executionId = (DateTime.UtcNow.Ticks % 1000000000000L) * 10000 + new Random().Next(1000, 9999);
                _logger.Warning("Generated fallback execution ID. WorkflowId: {WorkflowId}, ExecutionId: {ExecutionId}",
                    workflowId, executionId);
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
