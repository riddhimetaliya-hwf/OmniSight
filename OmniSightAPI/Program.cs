using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.OpenApi.Models;
using System.Text.Json;
using OmniSightAPI.Models;

var builder = WebApplication.CreateBuilder(args);

try
{
    builder.Configuration.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
}
catch (Exception ex)
{
    Console.WriteLine($"Warning: Could not load appsettings.json: {ex.Message}");
}

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "OmniSight API", Version = "v1" });
});

// FIXED: Enhanced CORS configuration to allow your frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });

    // Add specific policy for localhost development
    options.AddPolicy("Development", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:3000",
                "http://localhost:5174",
                "http://localhost:8080",
                "https://localhost:5173",
                "https://localhost:3000",
                "https://localhost:5174",
                "https://localhost:7104"
              )
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

builder.Services.AddHttpClient("n8n", client =>
{
    var n8nConfig = builder.Configuration.GetSection("N8n");
    var baseUrl = n8nConfig["BaseUrl"] ?? "http://localhost:5678";
    var apiKey = n8nConfig["ApiKey"];
    var timeout = n8nConfig.GetValue<int>("TimeoutSeconds", 30);

    client.BaseAddress = new Uri(baseUrl);
    client.Timeout = TimeSpan.FromSeconds(timeout);

    if (!string.IsNullOrEmpty(apiKey))
    {
        client.DefaultRequestHeaders.Add("X-N8N-API-KEY", apiKey);
        Console.WriteLine($"✅ n8n API key configured");
    }
    else
    {
        Console.WriteLine($"⚠️ n8n API key not found");
    }
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// FIXED: Apply CORS before other middleware
app.UseCors("Development");

//app.UseHttpsRedirection();

app.MapGet("/", () => Results.Redirect("/swagger")).ExcludeFromDescription();

// WORKFLOW TEMPLATES ENDPOINT
app.MapGet("/api/workflow-templates", async (IConfiguration configuration) =>
{
    var connectionString = configuration.GetConnectionString("DefaultConnection")
                          ?? "Server=(localdb)\\MSSQLLocalDB;Database=OmniSight;Trusted_Connection=true;TrustServerCertificate=true;";

    try
    {
        using var connection = new SqlConnection(connectionString);

        var sql = @"
            SELECT [id] as Id, [name] as Name, [description] as Description, 
                   [category] as Category, [template_json] as TemplateJson, 
                   [required_credentials] as RequiredCredentials, [integrations] as Integrations, 
                   [icon] as Icon, [is_published] as IsPublished, [usage_count] as UsageCount, 
                   [created_at] as CreatedAt, [updated_at] as UpdatedAt
            FROM [OmniSight].[dbo].[workflow_templates] 
            WHERE [is_published] = 1
            ORDER BY [created_at] DESC";

        var templates = await connection.QueryAsync<WorkflowTemplate>(sql);
        return Results.Ok(templates);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Database error: {ex.Message}");
    }
})
.WithName("GetWorkflowTemplates");

app.MapPost("/api/workflows/create-and-execute", async (
    CreateWorkflowFromTemplateRequest request,
    IHttpClientFactory httpClientFactory,
    IConfiguration configuration) =>
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

        // Get or create user
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

        // Get template
        var findTemplateSql = @"
            SELECT [id], [name], [description], [template_json], [required_credentials]
            FROM [OmniSight].[dbo].[workflow_templates] 
            WHERE [id] = @TemplateId";

        var template = await connection.QueryFirstOrDefaultAsync<dynamic>(findTemplateSql, new { request.TemplateId });

        if (template == null)
        {
            return Results.NotFound(new { error = $"Template '{request.TemplateId}' not found" });
        }

        Console.WriteLine($"✅ Template found: {template.name}");

        // Process credentials
        var credentialMappings = new Dictionary<string, string>();

        foreach (var credentialPair in request.Credentials)
        {
            var credType = credentialPair.Key;
            var credValue = credentialPair.Value;

            Console.WriteLine($"🔐 Processing credential: {credType}");
            Console.WriteLine($"📦 Credential JSON: {credValue.GetRawText()}");

            Dictionary<string, string> credentialData;

            if (credValue.ValueKind == JsonValueKind.Object)
            {
                credentialData = new Dictionary<string, string>();
                foreach (var prop in credValue.EnumerateObject())
                {
                    string propValue;
                    if (prop.Value.ValueKind == JsonValueKind.Number)
                    {
                        propValue = prop.Value.GetInt32().ToString();
                    }
                    else if (prop.Value.ValueKind == JsonValueKind.True || prop.Value.ValueKind == JsonValueKind.False)
                    {
                        propValue = prop.Value.GetBoolean().ToString().ToLower();
                    }
                    else
                    {
                        propValue = prop.Value.GetString() ?? "";
                    }

                    credentialData[prop.Name] = propValue;
                }
                Console.WriteLine($"✅ Parsed structured credential with {credentialData.Count} fields");
            }
            else if (credValue.ValueKind == JsonValueKind.String)
            {
                credentialData = new Dictionary<string, string>
                {
                    ["value"] = credValue.GetString() ?? ""
                };
                Console.WriteLine($"✅ Parsed simple string credential");
            }
            else
            {
                Console.WriteLine($"⚠️ Unknown credential value kind: {credValue.ValueKind}, skipping");
                continue;
            }

            // Save to database
            var credentialId = Guid.NewGuid().ToString();
            var insertCredentialSql = @"
                INSERT INTO [OmniSight].[dbo].[credentials] (
                    [id], [name], [type], [user_id], [credential_data], [created_at], [updated_at]
                ) 
                VALUES (@Id, @Name, @Type, @UserId, @CredentialData, GETDATE(), GETDATE())";

            await connection.ExecuteAsync(insertCredentialSql, new
            {
                Id = credentialId,
                Name = $"{credType} - {template.name}",
                Type = credType,
                UserId = userId,
                CredentialData = JsonSerializer.Serialize(credentialData)
            });

            Console.WriteLine($"✅ Credential saved to database: {credentialId}");

            // Create in n8n
            try
            {
                var n8nCredentialId = await CreateCredentialInN8n(
                    httpClientFactory,
                    credType,
                    credentialData,
                    $"{credType} - {template.name} - {DateTime.Now:HHmmss}"
                );

                if (!string.IsNullOrEmpty(n8nCredentialId))
                {
                    credentialMappings[credType] = n8nCredentialId;
                    Console.WriteLine($"✅ Credential created in n8n with ID: {n8nCredentialId}");
                }
                else
                {
                    Console.WriteLine($"❌ Failed to create credential in n8n");
                    return Results.Problem("Failed to create credentials in n8n. Please check n8n is running and API key is correct.");
                }
            }
            catch (Exception credEx)
            {
                Console.WriteLine($"❌ Error creating n8n credential: {credEx.Message}");
                Console.WriteLine($"❌ Stack trace: {credEx.StackTrace}");
                return Results.Problem($"Failed to create credentials in n8n: {credEx.Message}");
            }
        }

        if (request.Credentials.Count > 0 && credentialMappings.Count == 0)
        {
            return Results.Problem("No credentials were successfully created in n8n. Cannot proceed.");
        }

        // Parse template and create workflow
        var templateJson = template.template_json.ToString();
        var workflowData = JsonSerializer.Deserialize<JsonElement>(templateJson);

        var newWorkflow = CreateWorkflowFromTemplate(
            workflowData,
            credentialMappings,
            request.Parameters,
            request.CustomName,
            template.id.ToString()
        );

        var newWorkflowId = Guid.NewGuid().ToString();
        var workflowName = request.CustomName ?? $"{template.name} - {DateTime.Now:yyyyMMdd-HHmmss}";

        // Save to n8n
        string n8nWorkflowId = null;
        try
        {
            n8nWorkflowId = await SaveWorkflowToN8n(httpClientFactory, newWorkflow, workflowName);
            Console.WriteLine($"✅ Workflow saved to n8n: {n8nWorkflowId}");
        }
        catch (Exception n8nEx)
        {
            Console.WriteLine($"❌ Failed to save to n8n: {n8nEx.Message}");
            n8nWorkflowId = "n8n_unavailable";
        }

        // Save to database
        var workflowJson = JsonSerializer.Serialize(newWorkflow);
        var nodes = ExtractNodes(newWorkflow);
        var connections = ExtractConnections(newWorkflow);
        var settings = ExtractSettings(newWorkflow);
        var staticData = ExtractStaticData(newWorkflow);

        var insertWorkflowSql = @"
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
            )";

        await connection.ExecuteAsync(insertWorkflowSql, new
        {
            Id = newWorkflowId,
            UserId = userId,
            TemplateId = template.id.ToString(),
            Name = workflowName,
            Description = template.description?.ToString() ?? "Created from template",
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

        Console.WriteLine($"✅ Workflow saved to database: {newWorkflowId}");

        long? executionId = null;
        if (!string.IsNullOrEmpty(n8nWorkflowId) && n8nWorkflowId != "n8n_unavailable")
        {
            try
            {
                Console.WriteLine($"⏳ Waiting 2 seconds for workflow to be ready...");
                await Task.Delay(2000);

                Console.WriteLine($"🎯 === STARTING WORKFLOW EXECUTION ===");

                // Determine workflow trigger type
                var triggerType = DetectWorkflowTriggerType(newWorkflow);

                Console.WriteLine($"🎯 Trigger type detected: {triggerType}");
                Console.WriteLine($"📋 Workflow name: {workflowName}");

                // TEMPORARY FIX: Force webhook for Bitcoin Alert
                if (workflowName.Contains("BitCoin") || workflowName.Contains("Bitcoin"))
                {
                    Console.WriteLine($"💡 TEMPORARY OVERRIDE: Forcing webhook execution for Bitcoin workflow");
                    triggerType = "webhook";
                }

                string n8nExecutionId = null;

                switch (triggerType)
                {
                    case "webhook":
                        Console.WriteLine($"✅ === CALLING WEBHOOK EXECUTION ===");

                        // ENHANCED: Add more debugging
                        Console.WriteLine($"📋 Workflow ID: {n8nWorkflowId}");
                        Console.WriteLine($"📋 Parameters count: {request.Parameters.Count}");
                        foreach (var param in request.Parameters)
                        {
                            Console.WriteLine($"  📋 {param.Key} = {param.Value}");
                        }

                        n8nExecutionId = await ExecuteWebhookWorkflow(
                            httpClientFactory,
                            n8nWorkflowId,
                            request.Parameters,
                            newWorkflow
                        );

                        Console.WriteLine($"📊 ExecuteWebhookWorkflow returned: {n8nExecutionId ?? "NULL"}");
                        break;

                    case "manual":
                        Console.WriteLine($"✅ Calling ExecuteManualWorkflow...");
                        n8nExecutionId = await ExecuteManualWorkflow(
                            httpClientFactory,
                            n8nWorkflowId,
                            newWorkflow,
                            request.Parameters
                        );
                        Console.WriteLine($"📊 ExecuteManualWorkflow returned: {n8nExecutionId ?? "NULL"}");
                        break;

                    case "schedule":
                        Console.WriteLine($"✅ Calling ExecuteScheduleWorkflow...");
                        n8nExecutionId = await ExecuteScheduleWorkflow(
                            httpClientFactory,
                            n8nWorkflowId,
                            request.Parameters
                        );
                        Console.WriteLine($"📊 ExecuteScheduleWorkflow returned: {n8nExecutionId ?? "NULL"}");
                        break;

                    default:
                        Console.WriteLine($"⚠️ Unknown trigger type: {triggerType}");
                        break;
                }

                if (!string.IsNullOrEmpty(n8nExecutionId))
                {
                    Console.WriteLine($"✅ Execution ID obtained: {n8nExecutionId}");
                    executionId = await RecordExecution(connection, n8nExecutionId, newWorkflowId, userId, "running");
                    Console.WriteLine($"✅ Execution recorded in database with ID: {executionId}");
                }
                else
                {
                    Console.WriteLine($"❌ No execution ID returned - workflow created but not executed");
                    Console.WriteLine($"💡 Workflow is active at: http://localhost:5678/workflow/{n8nWorkflowId}");

                    // Print the curl command for manual testing
                    var webhookPath = "bitcoin-alert"; // Hardcoded for now
                    var payload = JsonSerializer.Serialize(request.Parameters);
                    Console.WriteLine($"💡 You can test the webhook manually:");
                    Console.WriteLine($"   curl -X POST http://localhost:5678/webhook-test/{webhookPath} \\");
                    Console.WriteLine($"        -H 'Content-Type: application/json' \\");
                    Console.WriteLine($"        -d '{payload}'");
                }
            }
            catch (Exception execEx)
            {
                Console.WriteLine($"❌ EXCEPTION during execution: {execEx.Message}");
                Console.WriteLine($"Stack: {execEx.StackTrace}");
            }
        }

        Console.WriteLine($"🎯 === EXECUTION PHASE COMPLETE ===");
        Console.WriteLine($"📊 Final executionId: {executionId?.ToString() ?? "NULL"}");

        var responseStatus = n8nWorkflowId == "n8n_unavailable" ? "created_without_n8n" :
                           executionId.HasValue ? "executing" : "saved_and_activated";

        Console.WriteLine($"📊 Response status: {responseStatus}");

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
})
.WithName("CreateAndExecuteWorkflow");

// OVERVIEW DATA ENDPOINT
app.MapGet("/api/overview/all", async (IConfiguration configuration) =>
{
    var connectionString = configuration.GetConnectionString("DefaultConnection")
                          ?? "Server=(localdb)\\MSSQLLocalDB;Database=OmniSight;Trusted_Connection=true;TrustServerCertificate=true;";

    try
    {
        using var connection = new SqlConnection(connectionString);

        // Call the stored procedure
        var result = await connection.QueryMultipleAsync(
            "GetOverviewData",
            commandType: System.Data.CommandType.StoredProcedure
        );

        // Read the multiple result sets in correct order
        var statsResult = await result.ReadFirstOrDefaultAsync();
        var executionsResult = (await result.ReadAsync<dynamic>()).ToList();
        var activitiesResult = (await result.ReadAsync<dynamic>()).ToList();
        var logsResult = (await result.ReadAsync<dynamic>()).ToList();

        // Transform stats to match frontend expectations
        var stats = new
        {
            activeWorkflows = (int)(statsResult?.TotalWorkflows ?? 0),
            completedToday = (int)(statsResult?.TodayExecutions ?? 0),
            pendingTasks = (int)(statsResult?.RunningExecutions ?? 0),
            alerts = (int)(statsResult?.RecentFailures ?? 0)
        };

        // Transform executions to match frontend
        var executions = executionsResult.Select(e => new
        {
            id = e.Id?.ToString() ?? "",
            workflowName = e.WorkflowName?.ToString() ?? "Unknown Workflow",
            status = e.ExecutionStatus?.ToString()?.ToLower() ?? "unknown",
            timestamp = FormatTimestamp(e.Timestamp),
            duration = FormatDuration(e.DurationSeconds),
            triggerType = e.TriggerType?.ToString() ?? "manual",
            errorMessage = e.ExecutionStatus?.ToString() == "failed" ? "Execution failed" : null,
            nodesPassed = 0,
            totalNodes = 0
        }).ToList();

        // Create user map for activities
        var userMap = new Dictionary<string, dynamic>();
        try
        {
            var users = await connection.QueryAsync("SELECT id, email, first_name, last_name FROM [OmniSight].[dbo].[users]");
            foreach (var user in users)
            {
                userMap[user.id.ToString()] = user;
            }
        }
        catch (Exception userEx)
        {
            Console.WriteLine($"⚠️ Could not load users: {userEx.Message}");
        }

        // Transform activities to match frontend
        var activities = activitiesResult.Select(a => new
        {
            id = a.Id?.ToString() ?? "",
            type = a.ActivityType?.ToString() ?? "workflow_executed",
            timestamp = FormatActivityTimestamp(a.Timestamp),
            user = GetUserInfo(a.UserId?.ToString(), userMap),
            description = a.Description?.ToString() ?? "Executed workflow",
            target = a.Target?.ToString()
        }).ToList();

        // Transform logs to match frontend
        var logs = logsResult.Select(l => new
        {
            id = l.Id?.ToString() ?? "",
            timestamp = FormatLogTimestamp(l.Timestamp),
            level = l.Level?.ToString() ?? "info",
            message = GetLogMessage(l.Status?.ToString(), l.WorkflowName?.ToString()),
            workflowName = l.WorkflowName?.ToString() ?? "Unknown Workflow",
            executionId = l.Id?.ToString() ?? "",
            details = new
            {
                metadata = new
                {
                    duration = l.DurationSeconds,
                    status = l.Status?.ToString(),
                    customData = l.CustomData?.ToString()
                }
            }
        }).ToList();

        var overviewData = new
        {
            stats,
            executions,
            activities,
            logs
        };

        Console.WriteLine($"✅ Overview data fetched: {stats.activeWorkflows} workflows, {executions.Count} executions, {activities.Count} activities, {logs.Count} logs");
        return Results.Ok(overviewData);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error fetching overview data: {ex.Message}");
        Console.WriteLine($"❌ Stack trace: {ex.StackTrace}");
        return Results.Problem($"Database error: {ex.Message}");
    }
})
.WithName("GetOverviewData");

//----------------- UPDATED HELPER FUNCTIONS FOR DYNAMIC WEBHOOK EXECUTION ------------------//

static async Task<string> ExecuteWebhookWorkflow(
    IHttpClientFactory httpClientFactory,
    string n8nWorkflowId,
    Dictionary<string, string> parameters,
    Dictionary<string, object> workflowData)
{
    var httpClient = httpClientFactory.CreateClient("n8n");

    try
    {
        Console.WriteLine($"🚀 === EXECUTING WEBHOOK WORKFLOW ===");
        Console.WriteLine($"🆔 Workflow ID: {n8nWorkflowId}");
        Console.WriteLine($"📋 Parameters: {JsonSerializer.Serialize(parameters)}");

        // STEP 1: Extract webhook path from workflow data
        string webhookPath = null;

        Console.WriteLine($"🔍 Extracting webhook path from workflow data...");
        Console.WriteLine($"🔍 Workflow data keys: {string.Join(", ", workflowData.Keys)}");

        if (workflowData.ContainsKey("nodes"))
        {
            var nodesObj = workflowData["nodes"];
            Console.WriteLine($"🔍 Nodes type: {nodesObj?.GetType().Name}");

            if (nodesObj is List<object> nodesList)
            {
                Console.WriteLine($"✅ Found {nodesList.Count} nodes");

                foreach (var nodeObj in nodesList)
                {
                    if (nodeObj is Dictionary<string, object> node)
                    {
                        var nodeType = node.GetValueOrDefault("type")?.ToString();
                        var nodeName = node.GetValueOrDefault("name")?.ToString();

                        if (nodeType == "n8n-nodes-base.webhook")
                        {
                            Console.WriteLine($"✅ Found webhook node: {nodeName}");

                            if (node.ContainsKey("parameters") && node["parameters"] is Dictionary<string, object> nodeParams)
                            {
                                Console.WriteLine($"📋 Webhook node parameter keys: {string.Join(", ", nodeParams.Keys)}");

                                if (nodeParams.ContainsKey("path"))
                                {
                                    webhookPath = nodeParams["path"]?.ToString();
                                    Console.WriteLine($"✅ Extracted webhook path: '{webhookPath}'");
                                    break;
                                }
                                else
                                {
                                    Console.WriteLine($"⚠️ Webhook node has no 'path' parameter");
                                }
                            }
                            else
                            {
                                Console.WriteLine($"⚠️ Webhook node has no parameters or parameters is not a Dictionary");
                            }
                        }
                    }
                }
            }
            else
            {
                Console.WriteLine($"⚠️ Nodes is not List<object>, it's: {nodesObj?.GetType().FullName}");
            }
        }
        else
        {
            Console.WriteLine($"⚠️ No 'nodes' key in workflow data");
        }

        // STEP 2: If path not found in workflow data, try fetching from n8n API
        if (string.IsNullOrEmpty(webhookPath))
        {
            Console.WriteLine($"💡 Path not found in workflow data, fetching from n8n API...");

            try
            {
                var getResponse = await httpClient.GetAsync($"/api/v1/workflows/{n8nWorkflowId}");

                if (getResponse.IsSuccessStatusCode)
                {
                    var content = await getResponse.Content.ReadAsStringAsync();
                    var json = JsonSerializer.Deserialize<JsonElement>(content);

                    Console.WriteLine($"✅ Retrieved workflow from n8n");

                    // Try to find nodes in the response
                    JsonElement fetchedNodes;
                    if (json.TryGetProperty("data", out var data) && data.TryGetProperty("nodes", out fetchedNodes))
                    {
                        Console.WriteLine($"✅ Found nodes in data.nodes");
                    }
                    else if (json.TryGetProperty("nodes", out fetchedNodes))
                    {
                        Console.WriteLine($"✅ Found nodes at root level");
                    }
                    else
                    {
                        Console.WriteLine($"⚠️ No nodes found in n8n API response");
                        return null;
                    }

                    // Search for webhook node
                    foreach (var node in fetchedNodes.EnumerateArray())
                    {
                        if (node.TryGetProperty("type", out var type) &&
                            type.GetString() == "n8n-nodes-base.webhook")
                        {
                            Console.WriteLine($"✅ Found webhook node in n8n response");

                            if (node.TryGetProperty("parameters", out var params_) &&
                                params_.TryGetProperty("path", out var pathProp))
                            {
                                webhookPath = pathProp.GetString();
                                Console.WriteLine($"✅ Extracted path from n8n API: '{webhookPath}'");
                                break;
                            }
                        }
                    }
                }
                else
                {
                    Console.WriteLine($"⚠️ Failed to fetch workflow from n8n: {getResponse.StatusCode}");
                }
            }
            catch (Exception fetchEx)
            {
                Console.WriteLine($"⚠️ Exception fetching from n8n: {fetchEx.Message}");
            }
        }

        // STEP 3: Validate we have a webhook path
        if (string.IsNullOrEmpty(webhookPath))
        {
            Console.WriteLine($"❌ FATAL: Could not extract webhook path");
            return null;
        }

        Console.WriteLine($"✅ Using webhook path: '{webhookPath}'");

        // STEP 4: Build webhook payload
        var payload = new Dictionary<string, object>();
        foreach (var param in parameters)
        {
            payload[param.Key] = param.Value;
        }

        Console.WriteLine($"📤 Webhook payload: {JsonSerializer.Serialize(payload)}");

        // STEP 5: Try webhook-test endpoint first (for development/testing)
        var testWebhookUrl = $"/webhook-test/{webhookPath}";
        Console.WriteLine($"🌐 Trying test webhook: {testWebhookUrl}");

        try
        {
            var testResponse = await httpClient.PostAsJsonAsync(testWebhookUrl, payload);
            var testContent = await testResponse.Content.ReadAsStringAsync();

            Console.WriteLine($"📥 Test webhook response: {testResponse.StatusCode}");

            if (testResponse.IsSuccessStatusCode)
            {
                Console.WriteLine($"✅ Test webhook executed successfully!");

                // Try to extract execution ID
                try
                {
                    var result = JsonSerializer.Deserialize<JsonElement>(testContent);
                    if (result.TryGetProperty("executionId", out var execId))
                    {
                        return execId.GetString();
                    }
                }
                catch { }

                return Guid.NewGuid().ToString("N");
            }

            Console.WriteLine($"⚠️ Test webhook failed: {testContent}");
        }
        catch (Exception testEx)
        {
            Console.WriteLine($"⚠️ Test webhook exception: {testEx.Message}");
        }

        // STEP 6: Try production webhook endpoint
        var prodWebhookUrl = $"/webhook/{webhookPath}";
        Console.WriteLine($"🌐 Trying production webhook: {prodWebhookUrl}");

        var prodResponse = await httpClient.PostAsJsonAsync(prodWebhookUrl, payload);
        var prodContent = await prodResponse.Content.ReadAsStringAsync();

        Console.WriteLine($"📥 Production response: {prodResponse.StatusCode}");

        if (prodResponse.IsSuccessStatusCode)
        {
            Console.WriteLine($"✅ Production webhook succeeded!");

            // Try to extract execution ID
            try
            {
                var result = JsonSerializer.Deserialize<JsonElement>(prodContent);
                if (result.TryGetProperty("executionId", out var execId))
                {
                    return execId.GetString();
                }
            }
            catch { }

            return Guid.NewGuid().ToString("N");
        }

        Console.WriteLine($"❌ Both webhook endpoints failed");
        Console.WriteLine($"❌ Production error: {prodContent}");

        return null;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ EXCEPTION in ExecuteWebhookWorkflow: {ex.Message}");
        Console.WriteLine($"Stack: {ex.StackTrace}");
        return null;
    }
}

static string ExtractWebhookPathFromWorkflowData(Dictionary<string, object> workflowData)
{
    try
    {
        Console.WriteLine($"🔍 Searching for webhook node in workflow data...");

        if (workflowData.ContainsKey("nodes") && workflowData["nodes"] is List<object> nodes)
        {
            Console.WriteLine($"🔍 Found {nodes.Count} nodes to search");

            foreach (var nodeObj in nodes)
            {
                if (nodeObj is Dictionary<string, object> node)
                {
                    var nodeType = node.GetValueOrDefault("type")?.ToString();
                    var nodeName = node.GetValueOrDefault("name")?.ToString() ?? "Unnamed";

                    if (nodeType == "n8n-nodes-base.webhook")
                    {
                        Console.WriteLine($"✅ Found webhook node: {nodeName}");

                        if (node.ContainsKey("parameters") && node["parameters"] is Dictionary<string, object> parameters)
                        {
                            if (parameters.ContainsKey("path"))
                            {
                                var path = parameters["path"]?.ToString();
                                Console.WriteLine($"✅ Extracted webhook path: {path}");
                                return path;
                            }
                            else
                            {
                                Console.WriteLine($"⚠️ Webhook node found but no path parameter");
                                Console.WriteLine($"📋 Available parameters: {string.Join(", ", parameters.Keys)}");
                            }
                        }
                        else
                        {
                            Console.WriteLine($"⚠️ Webhook node found but no parameters object");
                        }
                    }
                }
            }
        }
        else
        {
            Console.WriteLine($"⚠️ No nodes found in workflow data or nodes is not a list");
        }

        Console.WriteLine($"❌ No webhook path found in workflow data");
        return null;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error extracting webhook path from workflow data: {ex.Message}");
        return null;
    }
}

static string ExtractWebhookPathFromN8nResponse(JsonElement workflowDetails)
{
    try
    {
        Console.WriteLine($"🔍 Searching for webhook node in n8n response...");

        JsonElement nodes;

        // Try different response structures
        if (workflowDetails.TryGetProperty("data", out var data) && data.TryGetProperty("nodes", out nodes))
        {
            Console.WriteLine($"🔍 Found nodes in data.nodes");
        }
        else if (workflowDetails.TryGetProperty("nodes", out nodes))
        {
            Console.WriteLine($"🔍 Found nodes in root nodes property");
        }
        else
        {
            Console.WriteLine($"⚠️ No nodes found in n8n response structure");
            return null;
        }

        foreach (var node in nodes.EnumerateArray())
        {
            if (node.TryGetProperty("type", out var typeProp))
            {
                var nodeType = typeProp.GetString();

                if (nodeType == "n8n-nodes-base.webhook")
                {
                    Console.WriteLine($"✅ Found webhook node in n8n response");

                    if (node.TryGetProperty("parameters", out var parameters) &&
                        parameters.TryGetProperty("path", out var pathProp))
                    {
                        var path = pathProp.GetString();
                        Console.WriteLine($"✅ Extracted webhook path from n8n: {path}");
                        return path;
                    }
                }
            }
        }

        Console.WriteLine($"❌ No webhook node found in n8n response");
        return null;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error extracting webhook path from n8n response: {ex.Message}");
        return null;
    }
}

static string DetectWorkflowTriggerType(Dictionary<string, object> workflowData)
{
    try
    {
        Console.WriteLine($"🔍 === DETECTING WORKFLOW TRIGGER TYPE ===");

        if (!workflowData.ContainsKey("nodes"))
        {
            Console.WriteLine($"⚠️ No 'nodes' key in workflow data, defaulting to manual");
            return "manual";
        }

        var nodesObj = workflowData["nodes"];
        Console.WriteLine($"🔍 Nodes type: {nodesObj?.GetType().Name}");

        // Handle List<object> (most common)
        if (nodesObj is List<object> nodesList)
        {
            Console.WriteLine($"✅ Processing {nodesList.Count} nodes");

            foreach (var nodeObj in nodesList)
            {
                if (nodeObj is Dictionary<string, object> node)
                {
                    var nodeType = node.GetValueOrDefault("type")?.ToString();
                    var nodeName = node.GetValueOrDefault("name")?.ToString() ?? "Unnamed";

                    // Check for webhook trigger (highest priority)
                    if (nodeType == "n8n-nodes-base.webhook")
                    {
                        Console.WriteLine($"✅ WEBHOOK trigger detected at node: {nodeName}");
                        return "webhook";
                    }

                    // Check for manual trigger
                    if (nodeType == "n8n-nodes-base.manualTrigger")
                    {
                        Console.WriteLine($"✅ MANUAL trigger detected at node: {nodeName}");
                        return "manual";
                    }

                    // Check for schedule trigger
                    if (nodeType == "n8n-nodes-base.scheduleTrigger" ||
                        nodeType == "n8n-nodes-base.cronTrigger")
                    {
                        Console.WriteLine($"✅ SCHEDULE trigger detected at node: {nodeName}");
                        return "schedule";
                    }
                }
                else if (nodeObj is JsonElement jsonNode)
                {
                    if (jsonNode.TryGetProperty("type", out var typeProp))
                    {
                        var nodeType = typeProp.GetString();

                        if (nodeType == "n8n-nodes-base.webhook")
                        {
                            Console.WriteLine($"✅ WEBHOOK trigger detected (JsonElement)");
                            return "webhook";
                        }

                        if (nodeType == "n8n-nodes-base.manualTrigger")
                        {
                            Console.WriteLine($"✅ MANUAL trigger detected (JsonElement)");
                            return "manual";
                        }

                        if (nodeType == "n8n-nodes-base.scheduleTrigger" ||
                            nodeType == "n8n-nodes-base.cronTrigger")
                        {
                            Console.WriteLine($"✅ SCHEDULE trigger detected (JsonElement)");
                            return "schedule";
                        }
                    }
                }
            }
        }
        // Handle JsonElement array
        else if (nodesObj is JsonElement jsonElement && jsonElement.ValueKind == JsonValueKind.Array)
        {
            Console.WriteLine($"✅ Processing JsonElement array");

            foreach (var node in jsonElement.EnumerateArray())
            {
                if (node.TryGetProperty("type", out var typeProp))
                {
                    var nodeType = typeProp.GetString();

                    if (nodeType == "n8n-nodes-base.webhook")
                    {
                        Console.WriteLine($"✅ WEBHOOK trigger detected");
                        return "webhook";
                    }

                    if (nodeType == "n8n-nodes-base.manualTrigger")
                    {
                        Console.WriteLine($"✅ MANUAL trigger detected");
                        return "manual";
                    }

                    if (nodeType == "n8n-nodes-base.scheduleTrigger" ||
                        nodeType == "n8n-nodes-base.cronTrigger")
                    {
                        Console.WriteLine($"✅ SCHEDULE trigger detected");
                        return "schedule";
                    }
                }
            }
        }

        Console.WriteLine($"⚠️ No trigger node found, defaulting to manual");
        return "manual";
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error detecting trigger type: {ex.Message}");
        return "manual";
    }
}

//----------------- EXISTING HELPER FUNCTIONS (KEEP THESE) ------------------//
// FIXED: Working manual workflow execution that handles n8n's actual API endpoints
static async Task<string> ExecuteManualWorkflow(
    IHttpClientFactory httpClientFactory,
    string n8nWorkflowId,
    Dictionary<string, object> workflowData,
    Dictionary<string, string> parameters)
{
    var httpClient = httpClientFactory.CreateClient("n8n");

    try
    {
        Console.WriteLine($"🚀 Executing MANUAL trigger workflow: {n8nWorkflowId}");
        Console.WriteLine($"📋 Parameters to pass: {JsonSerializer.Serialize(parameters)}");

        // Prepare trigger data - this is what the Manual Trigger node will receive
        var triggerData = new Dictionary<string, object>();

        // Add all parameters to trigger data
        foreach (var param in parameters)
        {
            triggerData[param.Key] = param.Value;
            Console.WriteLine($"  ✅ Adding to trigger data: {param.Key} = {param.Value}");
        }

        // METHOD 1: Use the /run endpoint (works in most n8n versions)
        try
        {
            Console.WriteLine($"🎯 Method 1: Trying /run endpoint...");

            // Build the run payload
            var runPayload = new
            {
                workflowData = new
                {
                    id = n8nWorkflowId,
                    name = workflowData.GetValueOrDefault("name", "Workflow"),
                    nodes = workflowData.GetValueOrDefault("nodes") ?? new List<object>(),
                    connections = workflowData.GetValueOrDefault("connections") ?? new Dictionary<string, object>(),
                    active = true,
                    settings = workflowData.GetValueOrDefault("settings") ?? new Dictionary<string, object>()
                },
                // Pass trigger data directly
                runData = new
                {
                    // This structure injects data at the Manual Trigger node
                    startData = new
                    {
                        destinationNode = "Manual Trigger"
                    },
                    executionData = new
                    {
                        contextData = new { },
                        nodeExecutionStack = new[]
                        {
                            new
                            {
                                node = new
                                {
                                    name = "Manual Trigger",
                                    type = "n8n-nodes-base.manualTrigger"
                                },
                                data = new
                                {
                                    main = new[]
                                    {
                                        new[]
                                        {
                                            new { json = triggerData }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };

            Console.WriteLine($"📤 Sending run payload to /run endpoint");

            var runResponse = await httpClient.PostAsJsonAsync($"/api/v1/workflows/run", runPayload);
            var runContent = await runResponse.Content.ReadAsStringAsync();

            Console.WriteLine($"📥 Run response status: {runResponse.StatusCode}");
            Console.WriteLine($"📥 Run response body: {runContent}");

            if (runResponse.IsSuccessStatusCode)
            {
                Console.WriteLine($"✅ Workflow executed via /run endpoint!");

                try
                {
                    var result = JsonSerializer.Deserialize<JsonElement>(runContent);

                    // Try to extract execution ID
                    if (result.TryGetProperty("data", out var data))
                    {
                        if (data.TryGetProperty("executionId", out var execId))
                        {
                            return execId.GetString();
                        }
                    }
                }
                catch { }

                return Guid.NewGuid().ToString("N");
            }

            Console.WriteLine($"⚠️ /run endpoint failed: {runContent}");
        }
        catch (Exception runEx)
        {
            Console.WriteLine($"⚠️ /run method exception: {runEx.Message}");
        }

        // METHOD 2: Use the webhook trigger approach (most reliable for manual triggers)
        try
        {
            Console.WriteLine($"🎯 Method 2: Trying webhook trigger approach...");

            // First, we need to get the workflow to check if it has a webhook path
            var getWorkflowResponse = await httpClient.GetAsync($"/api/v1/workflows/{n8nWorkflowId}");

            if (getWorkflowResponse.IsSuccessStatusCode)
            {
                var workflowContent = await getWorkflowResponse.Content.ReadAsStringAsync();
                var workflowJson = JsonSerializer.Deserialize<JsonElement>(workflowContent);

                Console.WriteLine($"✅ Retrieved workflow details");

                // For manual trigger workflows, we'll use a different approach
                // Activate the workflow first
                var activateResponse = await httpClient.PatchAsJsonAsync(
                    $"/api/v1/workflows/{n8nWorkflowId}",
                    new { active = true }
                );

                if (activateResponse.IsSuccessStatusCode)
                {
                    Console.WriteLine($"✅ Workflow activated");

                    // Wait a moment for activation
                    await Task.Delay(1000);

                    // Now try to trigger it using the production webhook endpoint
                    var triggerUrl = $"/webhook-test/{n8nWorkflowId}";
                    Console.WriteLine($"🌐 Attempting to trigger via: {triggerUrl}");

                    var webhookResponse = await httpClient.PostAsJsonAsync(triggerUrl, triggerData);
                    var webhookContent = await webhookResponse.Content.ReadAsStringAsync();

                    Console.WriteLine($"📥 Webhook response: {webhookResponse.StatusCode}");
                    Console.WriteLine($"📥 Webhook content: {webhookContent}");

                    if (webhookResponse.IsSuccessStatusCode)
                    {
                        Console.WriteLine($"✅ Workflow triggered via webhook!");
                        return Guid.NewGuid().ToString("N");
                    }
                }
            }
        }
        catch (Exception webhookEx)
        {
            Console.WriteLine($"⚠️ Webhook method exception: {webhookEx.Message}");
        }

        // METHOD 3: Manual execution via n8n CLI command (fallback)
        try
        {
            Console.WriteLine($"🎯 Method 3: Using direct execution with payload...");

            // Some n8n versions support direct execution with data
            var directPayload = new
            {
                data = new[]
                {
                    new { json = triggerData }
                }
            };

            var directResponse = await httpClient.PostAsJsonAsync(
                $"/api/v1/workflows/{n8nWorkflowId}/execute",
                directPayload
            );

            var directContent = await directResponse.Content.ReadAsStringAsync();
            Console.WriteLine($"📥 Direct execute response: {directResponse.StatusCode}");
            Console.WriteLine($"📥 Direct execute content: {directContent}");

            if (directResponse.IsSuccessStatusCode)
            {
                Console.WriteLine($"✅ Direct execution succeeded!");
                return Guid.NewGuid().ToString("N");
            }
        }
        catch (Exception directEx)
        {
            Console.WriteLine($"⚠️ Direct execution exception: {directEx.Message}");
        }

        // LAST RESORT: Try activating and returning success
        // The workflow will be ready for manual trigger in n8n UI
        Console.WriteLine($"ℹ️ Workflow is created and active. User can trigger manually from n8n UI.");
        Console.WriteLine($"💡 Workflow URL: http://localhost:5678/workflow/{n8nWorkflowId}");

        return null;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error executing manual workflow: {ex.Message}");
        Console.WriteLine($"❌ Stack trace: {ex.StackTrace}");
        return null;
    }
}
static async Task<string> ExecuteScheduleWorkflow(
    IHttpClientFactory httpClientFactory,
    string n8nWorkflowId,
    Dictionary<string, string> parameters)
{
    var httpClient = httpClientFactory.CreateClient("n8n");

    try
    {
        Console.WriteLine($"🚀 Executing schedule workflow: {n8nWorkflowId}");

        var triggerData = new Dictionary<string, object>();

        foreach (var param in parameters)
        {
            if (param.Key == "fromEmail")
                triggerData["fromEmail"] = param.Value;
            else if (param.Key == "toEmail")
                triggerData["toEmail"] = param.Value;
            else if (param.Key == "emailFormat")
                triggerData["emailFormat"] = param.Value;
            else if (param.Key == "url")
                triggerData["url"] = param.Value;
        }

        var testPayload = new
        {
            triggerData = new[] { new { json = triggerData } }
        };

        Console.WriteLine($"📤 Test payload: {JsonSerializer.Serialize(testPayload)}");

        var testResponse = await httpClient.PostAsJsonAsync($"/api/v1/workflows/{n8nWorkflowId}/test", testPayload);
        var testContent = await testResponse.Content.ReadAsStringAsync();

        Console.WriteLine($"📥 Test response: {testResponse.StatusCode}");
        Console.WriteLine($"📥 Test content: {testContent}");

        if (testResponse.IsSuccessStatusCode)
        {
            Console.WriteLine($"✅ Schedule workflow test execution succeeded!");

            // Try to extract execution ID
            // Try to extract execution ID from n8n response
            try
            {
                var result = JsonSerializer.Deserialize<JsonElement>(testContent);
                Console.WriteLine($"🔍 Parsing n8n response: {testContent}");

                // Try different possible locations for execution ID
                if (result.TryGetProperty("id", out var idProp) && idProp.ValueKind == JsonValueKind.Number)
                {
                    var executionId = idProp.GetInt64().ToString();
                    Console.WriteLine($"✅ Found execution ID in 'id' field: {executionId}");
                    return executionId;
                }
                else if (result.TryGetProperty("data", out var data) && data.TryGetProperty("id", out var dataId) && dataId.ValueKind == JsonValueKind.Number)
                {
                    var executionId = dataId.GetInt64().ToString();
                    Console.WriteLine($"✅ Found execution ID in 'data.id' field: {executionId}");
                    return executionId;
                }
                else if (result.TryGetProperty("executionId", out var execId))
                {
                    var executionId = execId.ValueKind == JsonValueKind.Number ? execId.GetInt64().ToString() : execId.GetString();
                    Console.WriteLine($"✅ Found execution ID in 'executionId' field: {executionId}");
                    return executionId;
                }
                else
                {
                    Console.WriteLine($"⚠️ Could not find execution ID in response. Available properties: {string.Join(", ", result.EnumerateObject().Select(p => p.Name))}");
                }
            }
            catch (JsonException jsonEx)
            {
                Console.WriteLine($"❌ JSON parsing error: {jsonEx.Message}");
            }
            catch { }

            return Guid.NewGuid().ToString("N");
        }
        else
        {
            Console.WriteLine($"⚠️ Test execution failed: {testContent}");

            // METHOD 2: Try direct execution
            try
            {
                var executeResponse = await httpClient.PostAsync($"/api/v1/workflows/{n8nWorkflowId}/execute", null);
                var executeContent = await executeResponse.Content.ReadAsStringAsync();

                if (executeResponse.IsSuccessStatusCode)
                {
                    Console.WriteLine($"✅ Direct execution succeeded!");

                    try
                    {
                        var result = JsonSerializer.Deserialize<JsonElement>(executeContent);
                        if (result.TryGetProperty("data", out var data) && data.TryGetProperty("executionId", out var execId))
                            return execId.GetString();
                    }
                    catch (JsonException) { }

                    return Guid.NewGuid().ToString("N");
                }
            }
            catch (Exception ex2)
            {
                Console.WriteLine($"⚠️ Direct execution failed: {ex2.Message}");
            }
        }

        Console.WriteLine($"ℹ️ Schedule workflow activated - it will run automatically according to its schedule");
        return null;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error executing schedule workflow: {ex.Message}");
        return null;
    }
}

static async Task<string> CreateCredentialInN8n(
    IHttpClientFactory httpClientFactory,
    string credentialType,
    Dictionary<string, string> credentialData,
    string credentialName)
{
    try
    {
        var httpClient = httpClientFactory.CreateClient("n8n");
        var n8nCredType = MapToN8nCredentialType(credentialType);
        var n8nData = BuildN8nCredentialData(credentialType, credentialData);

        var n8nCredential = new
        {
            name = credentialName,
            type = n8nCredType,
            data = n8nData
        };

        Console.WriteLine($"📤 Creating n8n credential of type: {n8nCredType}");
        Console.WriteLine($"📤 Credential data: {JsonSerializer.Serialize(n8nData)}");

        var response = await httpClient.PostAsJsonAsync("/api/v1/credentials", n8nCredential);
        var responseContent = await response.Content.ReadAsStringAsync();

        Console.WriteLine($"📥 n8n response status: {response.StatusCode}");
        Console.WriteLine($"📥 n8n response body: {responseContent}");

        if (response.IsSuccessStatusCode)
        {
            var result = JsonSerializer.Deserialize<JsonElement>(responseContent);

            string credId = null;
            if (result.TryGetProperty("data", out var data) && data.TryGetProperty("id", out var id))
                credId = id.GetString();
            else if (result.TryGetProperty("id", out var directId))
                credId = directId.GetString();

            if (!string.IsNullOrEmpty(credId))
            {
                Console.WriteLine($"✅ n8n credential created with ID: {credId}");
                return credId;
            }
            else
            {
                Console.WriteLine($"⚠️ Could not extract credential ID from response");
                return null;
            }
        }
        else
        {
            Console.WriteLine($"❌ n8n credential creation failed: {response.StatusCode}");
            Console.WriteLine($"❌ Error response: {responseContent}");
            return null;
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Exception creating n8n credential: {ex.Message}");
        Console.WriteLine($"❌ Stack trace: {ex.StackTrace}");
        return null;
    }
}

static string MapToN8nCredentialType(string credentialType)
{
    var type = credentialType.ToLower();

    if (type.Contains("smtp") || type.Contains("email")) return "smtp";
    if (type.Contains("oauth2")) return "oAuth2Api";
    if (type.Contains("httpbasicauth")) return "httpBasicAuth";
    if (type.Contains("httpheaderauth")) return "httpHeaderAuth";
    if (type.Contains("api")) return "httpHeaderAuth";

    Console.WriteLine($"⚠️ Unknown credential type '{credentialType}', defaulting to httpHeaderAuth");
    return "httpHeaderAuth";
}

static Dictionary<string, object> BuildN8nCredentialData(string credentialType, Dictionary<string, string> data)
{
    var type = credentialType.ToLower();

    if (type.Contains("smtp") || type.Contains("email"))
    {
        int.TryParse(data.GetValueOrDefault("port", "465"), out var port);
        bool.TryParse(data.GetValueOrDefault("secure", "false"), out var secure);

        var smtpData = new Dictionary<string, object>
        {
            ["user"] = data.GetValueOrDefault("user", ""),
            ["password"] = data.GetValueOrDefault("password", ""),
            ["host"] = data.GetValueOrDefault("host", "smtp.gmail.com"),
            ["port"] = port,
            ["secure"] = secure
        };

        Console.WriteLine($"🔧 Built SMTP credential data: user={smtpData["user"]}, host={smtpData["host"]}, port={smtpData["port"]}, secure={smtpData["secure"]}");
        return smtpData;
    }
    else if (type.Contains("oauth2"))
    {
        return new Dictionary<string, object>
        {
            ["clientId"] = data.GetValueOrDefault("clientId", ""),
            ["clientSecret"] = data.GetValueOrDefault("clientSecret", ""),
            ["accessToken"] = data.GetValueOrDefault("accessToken", "")
        };
    }
    else if (type.Contains("api"))
    {
        return new Dictionary<string, object>
        {
            ["name"] = "Authorization",
            ["value"] = $"Bearer {data.GetValueOrDefault("apiKey", data.GetValueOrDefault("value", ""))}"
        };
    }
    else
    {
        return new Dictionary<string, object>
        {
            ["value"] = data.GetValueOrDefault("value", "")
        };
    }
}

static async Task<string> SaveWorkflowToN8n(IHttpClientFactory httpClientFactory, Dictionary<string, object> workflow, string workflowName)
{
    try
    {
        var httpClient = httpClientFactory.CreateClient("n8n");

        var n8nWorkflow = new
        {
            name = workflowName,
            nodes = workflow.GetValueOrDefault("nodes") ?? new List<object>(),
            connections = workflow.GetValueOrDefault("connections") ?? new Dictionary<string, object>(),
            settings = workflow.GetValueOrDefault("settings") ?? new Dictionary<string, object>(),
            staticData = workflow.GetValueOrDefault("staticData") ?? new Dictionary<string, object>()
        };

        Console.WriteLine($"📤 Saving workflow to n8n: {workflowName}");

        var response = await httpClient.PostAsJsonAsync("/api/v1/workflows", n8nWorkflow);
        var responseContent = await response.Content.ReadAsStringAsync();

        Console.WriteLine($"📥 n8n workflow response: {response.StatusCode}");
        Console.WriteLine($"📥 Response body: {responseContent}");

        if (response.IsSuccessStatusCode)
        {
            var result = JsonSerializer.Deserialize<JsonElement>(responseContent);

            string workflowId = null;
            if (result.TryGetProperty("data", out var data) && data.TryGetProperty("id", out var id))
                workflowId = id.GetString();
            else if (result.TryGetProperty("id", out var directId))
                workflowId = directId.GetString();

            if (!string.IsNullOrEmpty(workflowId))
            {
                Console.WriteLine($"✅ Workflow saved to n8n with ID: {workflowId}");

                // Now activate the workflow separately
                await Task.Delay(1000); // Brief delay before activation
                var activated = await ActivateN8nWorkflow(httpClientFactory, workflowId);

                if (activated)
                {
                    Console.WriteLine($"✅ Workflow activated successfully");
                }
                else
                {
                    Console.WriteLine($"⚠️ Workflow saved but could not be activated automatically");
                }

                return workflowId;
            }
        }

        Console.WriteLine($"❌ Failed to save workflow: {responseContent}");
        throw new Exception($"Failed to save workflow: {response.StatusCode} - {responseContent}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error saving workflow to n8n: {ex.Message}");
        throw;
    }
}

static async Task<bool> ActivateN8nWorkflow(IHttpClientFactory httpClientFactory, string n8nWorkflowId)
{
    try
    {
        var httpClient = httpClientFactory.CreateClient("n8n");

        // Use the correct activation endpoint
        var activationPayload = new { active = true };
        var response = await httpClient.PostAsJsonAsync($"/api/v1/workflows/{n8nWorkflowId}/activate", activationPayload);

        Console.WriteLine($"📥 Activation response: {response.StatusCode}");

        if (response.IsSuccessStatusCode)
        {
            Console.WriteLine($"✅ Workflow {n8nWorkflowId} activated successfully");
            return true;
        }
        else
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"⚠️ Failed to activate workflow {n8nWorkflowId}: {response.StatusCode} - {errorContent}");
            return false;
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"⚠️ Error activating workflow {n8nWorkflowId}: {ex.Message}");
        return false;
    }
}

static async Task<long> RecordExecution(SqlConnection connection, string n8nExecutionId, string workflowId, string userId, string status)
{
    // Use the n8n execution ID directly if it's numeric
    long executionId;
    if (long.TryParse(n8nExecutionId, out executionId))
    {
        Console.WriteLine($"✅ Using n8n execution ID: {executionId}");
    }
    else
    {
        // Fallback to generating our own ID
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
static Dictionary<string, object> CreateWorkflowFromTemplate(
    JsonElement template,
    Dictionary<string, string> credentialMappings,
    Dictionary<string, string> parameters,
    string customName,
    string templateId)
{
    var workflow = new Dictionary<string, object>();

    Console.WriteLine($"🔧 Creating workflow from template");
    Console.WriteLine($"🔧 Credential mappings: {string.Join(", ", credentialMappings.Select(kv => $"{kv.Key}={kv.Value}"))}");
    Console.WriteLine($"🔧 Parameters: {string.Join(", ", parameters.Select(kv => $"{kv.Key}={kv.Value}"))}");

    if (template.TryGetProperty("name", out var nameProp))
        workflow["name"] = customName ?? $"{nameProp.GetString()} - Copy";

    if (template.TryGetProperty("nodes", out var nodesProp))
    {
        var updatedNodes = UpdateNodesWithCredentialsAndParameters(nodesProp, credentialMappings, parameters);
        workflow["nodes"] = updatedNodes;
    }

    foreach (var prop in new[] { "connections", "settings", "staticData" })
    {
        if (template.TryGetProperty(prop, out var propValue))
            workflow[prop] = propValue;
    }
    workflow["id"] = Guid.NewGuid().ToString();

    return workflow;
}

static List<Dictionary<string, object>> UpdateNodesWithCredentialsAndParameters(
    JsonElement nodes,
    Dictionary<string, string> credentialMappings,
    Dictionary<string, string> parameters)
{
    var updatedNodes = new List<Dictionary<string, object>>();

    foreach (var node in nodes.EnumerateArray())
    {
        var nodeDict = new Dictionary<string, object>();
        var nodeType = node.TryGetProperty("type", out var typeEl) ? typeEl.GetString() : "";
        var nodeName = node.TryGetProperty("name", out var nameEl) ? nameEl.GetString() : "";

        Console.WriteLine($"🔧 Processing node: {nodeName} (type: {nodeType})");

        foreach (var prop in node.EnumerateObject())
        {
            nodeDict[prop.Name] = prop.Value;
        }

        if (node.TryGetProperty("credentials", out var credsProp) && credsProp.ValueKind != JsonValueKind.Null)
        {
            var updatedCreds = new Dictionary<string, object>();
            foreach (var cred in credsProp.EnumerateObject())
            {
                if (credentialMappings.ContainsKey(cred.Name))
                {
                    var n8nCredId = credentialMappings[cred.Name];
                    updatedCreds[cred.Name] = new Dictionary<string, object>
                    {
                        ["id"] = n8nCredId,
                        ["name"] = $"{cred.Name} credential"
                    };
                    Console.WriteLine($"✅ Mapped credential {cred.Name} -> n8n ID: {n8nCredId}");
                }
                else
                {
                    Console.WriteLine($"⚠️ No mapping found for credential: {cred.Name}");
                    updatedCreds[cred.Name] = cred.Value;
                }
            }

            if (updatedCreds.Any())
                nodeDict["credentials"] = updatedCreds;
        }

        if (node.TryGetProperty("parameters", out var paramsProp) && paramsProp.ValueKind != JsonValueKind.Null)
        {
            var updatedParams = new Dictionary<string, object>();
            UpdateParametersRecursive(paramsProp, parameters, updatedParams, "", nodeName);
            nodeDict["parameters"] = updatedParams;
        }

        updatedNodes.Add(nodeDict);
    }

    return updatedNodes;
}

static void UpdateParametersRecursive(
    JsonElement current,
    Dictionary<string, string> userParams,
    Dictionary<string, object> result,
    string currentPath,
    string nodeName = "")
{
    foreach (var prop in current.EnumerateObject())
    {
        var fullPath = string.IsNullOrEmpty(currentPath) ? prop.Name : $"{currentPath}.{prop.Name}";

        if (userParams.ContainsKey(fullPath))
        {
            result[prop.Name] = userParams[fullPath];
            Console.WriteLine($"📝 Set parameter {fullPath} = {userParams[fullPath]}");
        }
        // Special handling for email parameters
        else if (prop.Name.ToLower().Contains("email") || prop.Name.ToLower() == "to" || prop.Name.ToLower() == "from")
        {
            var paramKey = prop.Name.ToLower();

            // Try to find matching parameter with different naming conventions
            var matchingParam = userParams.FirstOrDefault(kv =>
                kv.Key.ToLower().Contains(paramKey) ||
                (paramKey == "from" && kv.Key.ToLower().Contains("fromemail")) ||
                (paramKey == "to" && kv.Key.ToLower().Contains("toemail"))
            );

            if (!string.IsNullOrEmpty(matchingParam.Key))
            {
                result[prop.Name] = matchingParam.Value;
                Console.WriteLine($"📧 Set email parameter {prop.Name} = {matchingParam.Value}");
            }
            else
            {
                result[prop.Name] = prop.Value;
            }
        }
        else if (prop.Value.ValueKind == JsonValueKind.Object)
        {
            var nestedDict = new Dictionary<string, object>();
            UpdateParametersRecursive(prop.Value, userParams, nestedDict, fullPath, nodeName);
            result[prop.Name] = nestedDict;
        }
        else
        {
            result[prop.Name] = prop.Value;
        }
    }
}

static string ExtractNodes(Dictionary<string, object> workflow) =>
    workflow.ContainsKey("nodes") ? JsonSerializer.Serialize(workflow["nodes"]) : "[]";

static string ExtractConnections(Dictionary<string, object> workflow) =>
    workflow.ContainsKey("connections") ? JsonSerializer.Serialize(workflow["connections"]) : "{}";

static (bool? saveExecutionProgress, bool? saveManualExecutions, string? saveDataErrorExecution,
    string? saveDataSuccessExecution, int? executionTimeout, string? errorWorkflow, string? timezone, string? executionOrder)
    ExtractSettings(Dictionary<string, object> workflow)
{
    if (workflow.ContainsKey("settings") && workflow["settings"] is Dictionary<string, object> settings)
    {
        return (
            settings.GetValueOrDefault("saveExecutionProgress") as bool? ?? false,
            settings.GetValueOrDefault("saveManualExecutions") as bool? ?? false,
            settings.GetValueOrDefault("saveDataErrorExecution")?.ToString() ?? "none",
            settings.GetValueOrDefault("saveDataSuccessExecution")?.ToString() ?? "all",
            settings.GetValueOrDefault("executionTimeout") as int? ?? 3600,
            settings.GetValueOrDefault("errorWorkflow")?.ToString() ?? "",
            settings.GetValueOrDefault("timezone")?.ToString() ?? "UTC",
            settings.GetValueOrDefault("executionOrder")?.ToString() ?? "v1"
        );
    }
    return (false, false, "none", "all", 3600, "", "UTC", "v1");
}

static string ExtractStaticData(Dictionary<string, object> workflow) =>
    workflow.ContainsKey("staticData") ? JsonSerializer.Serialize(workflow["staticData"]) : "{}";

//HELPER METHOD FOR OVERVIEW
// Helper method for log messages
static string GetLogMessage(string status, string workflowName)
{
    if (string.IsNullOrEmpty(workflowName)) workflowName = "Unknown Workflow";

    return status?.ToLower() switch
    {
        "success" => $"Workflow '{workflowName}' executed successfully",
        "failed" => $"Workflow '{workflowName}' execution failed",
        "running" => $"Workflow '{workflowName}' is currently running",
        _ => $"Workflow '{workflowName}' execution recorded"
    };
}

// Helper method to get user info (you already have this, but ensure it exists)
static object GetUserInfo(string userId, Dictionary<string, dynamic> userMap)
{
    var defaultUser = new
    {
        name = "System",
        initials = "SY",
        color = "bg-gradient-to-br from-primary to-accent"
    };

    if (userId != null && userMap.ContainsKey(userId))
    {
        var user = userMap[userId];
        var firstName = user.first_name?.ToString() ?? "";
        var lastName = user.last_name?.ToString() ?? "";
        var email = user.email?.ToString() ?? "";

        return new
        {
            name = $"{firstName} {lastName}".Trim() != "" ? $"{firstName} {lastName}".Trim() : email,
            initials = GetInitials(firstName, lastName, email),
            color = GetUserColor(email)
        };
    }

    return defaultUser;
}

// Ensure these helper methods exist (they should from your existing code)
static string GetInitials(string firstName, string lastName, string email)
{
    if (!string.IsNullOrEmpty(firstName) && !string.IsNullOrEmpty(lastName))
        return $"{firstName[0]}{lastName[0]}".ToUpper();

    if (!string.IsNullOrEmpty(firstName))
        return firstName.Length >= 2 ? firstName.Substring(0, 2).ToUpper() : firstName.ToUpper() + "X";

    if (!string.IsNullOrEmpty(email))
        return email.Substring(0, 2).ToUpper();

    return "US";
}

static string GetUserColor(string email)
{
    var colors = new[]
    {
        "bg-gradient-to-br from-blue-500 to-cyan-500",
        "bg-gradient-to-br from-purple-500 to-pink-500",
        "bg-gradient-to-br from-green-500 to-emerald-500",
        "bg-gradient-to-br from-orange-500 to-red-500",
        "bg-gradient-to-br from-primary to-accent"
    };

    var hash = email?.GetHashCode() ?? 0;
    return colors[Math.Abs(hash) % colors.Length];
}

//---------------------------------------------------------------------------------------
//-------------------------------FORMATTING HELPER METHODS-------------------------------
//---------------------------------------------------------------------------------------

static string FormatTimestamp(object timestamp)
{
    if (timestamp is DateTime dt)
    {
        return dt.ToString("MMM dd, yyyy HH:mm");
    }
    if (timestamp != null)
    {
        // Try to parse if it's a string
        if (DateTime.TryParse(timestamp.ToString(), out DateTime parsedDt))
        {
            return parsedDt.ToString("MMM dd, yyyy HH:mm");
        }
    }
    return "Unknown time";
}

static string FormatActivityTimestamp(object timestamp)
{
    if (timestamp is DateTime dt)
    {
        return dt.ToString("h:mm tt"); // Format like "2:30 PM"
    }
    if (timestamp != null)
    {
        if (DateTime.TryParse(timestamp.ToString(), out DateTime parsedDt))
        {
            return parsedDt.ToString("h:mm tt");
        }
    }
    return "Unknown time";
}

static string FormatLogTimestamp(object timestamp)
{
    if (timestamp is DateTime dt)
    {
        return dt.ToString("yyyy-MM-dd HH:mm:ss");
    }
    if (timestamp != null)
    {
        if (DateTime.TryParse(timestamp.ToString(), out DateTime parsedDt))
        {
            return parsedDt.ToString("yyyy-MM-dd HH:mm:ss");
        }
    }
    return DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
}

static string FormatDuration(object durationSeconds)
{
    if (durationSeconds is int seconds)
    {
        return FormatDurationFromSeconds(seconds);
    }
    if (durationSeconds is long longSeconds)
    {
        return FormatDurationFromSeconds((int)longSeconds);
    }
    if (durationSeconds != null && int.TryParse(durationSeconds.ToString(), out int parsedSeconds))
    {
        return FormatDurationFromSeconds(parsedSeconds);
    }
    return "0s";
}

static string FormatDurationFromSeconds(int seconds)
{
    if (seconds < 60) return $"{seconds}s";
    if (seconds < 3600) return $"{seconds / 60}m {seconds % 60}s";
    return $"{seconds / 3600}h {(seconds % 3600) / 60}m";
}

Console.WriteLine("🚀 OmniSight API Starting...");
Console.WriteLine($"📍 Environment: {app.Environment.EnvironmentName}");
Console.WriteLine($"🌐 CORS Policy: {(app.Environment.IsDevelopment() ? "Development (with credentials)" : "AllowAll")}");

app.Run();