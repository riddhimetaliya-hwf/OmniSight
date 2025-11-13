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

        // Activate and execute
        long? executionId = null;
        if (!string.IsNullOrEmpty(n8nWorkflowId) && n8nWorkflowId != "n8n_unavailable")
        {
            try
            {
                // Wait a moment for workflow to be ready
                await Task.Delay(2000);

                // Execute the workflow using the correct method for schedule triggers
                var n8nExecutionId = await ExecuteScheduleWorkflow(
                    httpClientFactory,
                    n8nWorkflowId,
                    request.Parameters
                );

                if (!string.IsNullOrEmpty(n8nExecutionId))
                {
                    executionId = await RecordExecution(connection, n8nExecutionId, newWorkflowId, userId, "running");
                    Console.WriteLine($"✅ Execution recorded: {executionId}");
                }
                else
                {
                    Console.WriteLine($"⚠️ Workflow created but execution not triggered (schedule workflows run automatically)");
                }
            }
            catch (Exception execEx)
            {
                Console.WriteLine($"⚠️ Execution failed: {execEx.Message}");
                Console.WriteLine($"⚠️ Stack trace: {execEx.StackTrace}");
            }
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

//----------------- HELPER FUNCTIONS------------------//
static async Task<string> ExecuteManualWorkflow(
    IHttpClientFactory httpClientFactory,
    string n8nWorkflowId,
    Dictionary<string, object> workflowData,
    Dictionary<string, string> parameters)
{
    var httpClient = httpClientFactory.CreateClient("n8n");

    // METHOD 1: Try test endpoint (best for manual trigger workflows)
    try
    {
        Console.WriteLine($"🚀 Method 1: Trying test endpoint for workflow: {n8nWorkflowId}");

        var triggerData = new Dictionary<string, object>();
        foreach (var param in parameters)
        {
            triggerData[param.Key] = param.Value;
        }

        var testPayload = new { triggerData };

        var testResponse = await httpClient.PostAsJsonAsync($"/api/v1/workflows/{n8nWorkflowId}/test", testPayload);
        var testContent = await testResponse.Content.ReadAsStringAsync();

        Console.WriteLine($"📥 Test response: {testResponse.StatusCode}");

        if (testResponse.IsSuccessStatusCode)
        {
            Console.WriteLine($"✅ Test execution succeeded!");

            // Try to extract execution ID
            try
            {
                var result = JsonSerializer.Deserialize<JsonElement>(testContent);
                if (result.TryGetProperty("executionId", out var execId))
                    return execId.GetString();
                if (result.TryGetProperty("data", out var data) && data.TryGetProperty("executionId", out var dataExecId))
                    return dataExecId.GetString();
            }
            catch { }

            return Guid.NewGuid().ToString("N");
        }

        Console.WriteLine($"⚠️ Test method failed: {testContent}");
    }
    catch (Exception ex1)
    {
        Console.WriteLine($"⚠️ Test method exception: {ex1.Message}");
    }

    // METHOD 2: Try simple execute endpoint
    try
    {
        Console.WriteLine($"🚀 Method 2: Trying execute endpoint for workflow: {n8nWorkflowId}");

        var executeResponse = await httpClient.PostAsync($"/api/v1/workflows/{n8nWorkflowId}/execute", null);
        var executeContent = await executeResponse.Content.ReadAsStringAsync();

        Console.WriteLine($"📥 Execute response: {executeResponse.StatusCode}");

        if (executeResponse.IsSuccessStatusCode)
        {
            Console.WriteLine($"✅ Execute method succeeded!");

            try
            {
                var result = JsonSerializer.Deserialize<JsonElement>(executeContent);
                if (result.TryGetProperty("data", out var data) && data.TryGetProperty("executionId", out var execId))
                    return execId.GetString();
            }
            catch { }

            return Guid.NewGuid().ToString("N");
        }

        Console.WriteLine($"⚠️ Execute method failed: {executeContent}");
    }
    catch (Exception ex2)
    {
        Console.WriteLine($"⚠️ Execute method exception: {ex2.Message}");
    }

    // METHOD 3: Try run with full workflow data
    try
    {
        Console.WriteLine($"🚀 Method 3: Trying run endpoint with full data for workflow: {n8nWorkflowId}");

        var jsonData = new Dictionary<string, object>();
        foreach (var param in parameters)
        {
            jsonData[param.Key] = param.Value;
        }

        var runPayload = new
        {
            workflowData = new
            {
                id = n8nWorkflowId,
                name = workflowData.GetValueOrDefault("name", "Workflow"),
                nodes = workflowData.GetValueOrDefault("nodes") ?? new List<object>(),
                connections = workflowData.GetValueOrDefault("connections") ?? new Dictionary<string, object>(),
                settings = workflowData.GetValueOrDefault("settings") ?? new Dictionary<string, object>(),
                active = true
            },
            runData = new Dictionary<string, object>
            {
                ["Manual Trigger"] = new[] { new { json = jsonData } }
            }
        };

        var runResponse = await httpClient.PostAsJsonAsync($"/api/v1/workflows/{n8nWorkflowId}/run", runPayload);
        var runContent = await runResponse.Content.ReadAsStringAsync();

        Console.WriteLine($"📥 Run response: {runResponse.StatusCode}");
        Console.WriteLine($"📥 Run content: {runContent}");

        if (runResponse.IsSuccessStatusCode)
        {
            Console.WriteLine($"✅ Run method succeeded!");

            try
            {
                var result = JsonSerializer.Deserialize<JsonElement>(runContent);
                if (result.TryGetProperty("data", out var data) && data.TryGetProperty("executionId", out var execId))
                    return execId.GetString();
            }
            catch { }

            return Guid.NewGuid().ToString("N");
        }

        Console.WriteLine($"⚠️ Run method failed: {runContent}");
    }
    catch (Exception ex3)
    {
        Console.WriteLine($"⚠️ Run method exception: {ex3.Message}");
    }

    // All methods failed
    Console.WriteLine($"❌ All execution methods failed. Workflow is created and active, but needs manual trigger.");
    return null;
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
            try
            {
                var result = JsonSerializer.Deserialize<JsonElement>(testContent);
                if (result.TryGetProperty("executionId", out var execId))
                    return execId.GetString();
                if (result.TryGetProperty("data", out var data) && data.TryGetProperty("executionId", out var dataExecId))
                    return dataExecId.GetString();
            }
            catch (JsonException) { }

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

static async Task<bool> TryAlternativeActivation(IHttpClientFactory httpClientFactory, string n8nWorkflowId)
{
    try
    {
        var httpClient = httpClientFactory.CreateClient("n8n");

        // Method 1: Try PUT endpoint
        var putPayload = new { active = true };
        var putResponse = await httpClient.PutAsJsonAsync($"/api/v1/workflows/{n8nWorkflowId}", putPayload);

        if (putResponse.IsSuccessStatusCode)
        {
            Console.WriteLine($"✅ Workflow activated via PUT method");
            return true;
        }

        // Method 2: Try updating workflow settings
        var updatePayload = new
        {
            settings = new { active = true }
        };
        var updateResponse = await httpClient.PutAsJsonAsync($"/api/v1/workflows/{n8nWorkflowId}", updatePayload);

        if (updateResponse.IsSuccessStatusCode)
        {
            Console.WriteLine($"✅ Workflow activated via settings update");
            return true;
        }

        Console.WriteLine($"❌ All activation methods failed");
        return false;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Alternative activation failed: {ex.Message}");
        return false;
    }
}

static async Task<long> RecordExecution(SqlConnection connection, string n8nExecutionId, string workflowId, string userId, string status)
{
    var executionId = (DateTime.UtcNow.Ticks % 1000000000000L) * 10000 + new Random().Next(1000, 9999);

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