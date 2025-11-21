using System.Text.Json;
using Dapper;
using Microsoft.Data.SqlClient;
using OmniSightAPI.Models;
using OmniSightAPI.Services;

namespace OmniSightAPI.Endpoints
{
    public static class ExecutionEndpoints
    {
        public static void MapExecutionEndpoints(this IEndpointRouteBuilder endpoints)
        {
            var group = endpoints.MapGroup("/api/executions")
                .WithTags("Executions");

            group.MapGet("/{executionId}", GetExecutionStatus)
                .WithName("GetExecutionStatus")
                .WithSummary("Get execution status from n8n");
        }

        private static async Task<IResult> GetExecutionStatus(
            long executionId,
            IHttpClientFactory httpClientFactory,
            IN8nService n8nService,
            IConfiguration configuration)
        {
            try
            {
                var httpClient = httpClientFactory.CreateClient("n8n");

                Console.WriteLine($"🔍 Checking execution status: {executionId}");

                // Try to get execution from n8n
                var response = await httpClient.GetAsync($"/api/v1/executions/{executionId}");
                var content = await response.Content.ReadAsStringAsync();

                Console.WriteLine($"📥 n8n response: {response.StatusCode}");

                if (!response.IsSuccessStatusCode)
                {
                    // Try to get from database as fallback
                    var dbStatus = await GetExecutionFromDatabase(executionId, configuration);
                    if (dbStatus != null)
                    {
                        return Results.Ok(dbStatus);
                    }

                    return Results.NotFound(new
                    {
                        id = executionId,
                        status = "not_found",
                        finished = true,
                        error = new { message = $"Execution {executionId} not found" }
                    });
                }

                var json = JsonSerializer.Deserialize<JsonElement>(content);
                var execData = json.TryGetProperty("data", out var data) ? data : json;

                // Extract execution details
                var status = GetStringProperty(execData, "status") ?? "unknown";
                var finished = execData.TryGetProperty("finished", out var f) && f.GetBoolean();
                var startedAt = GetStringProperty(execData, "startedAt");
                var stoppedAt = GetStringProperty(execData, "stoppedAt");

                // Check for errors
                object? error = null;
                if (status == "error" || status == "failed" || status == "crashed")
                {
                    error = ExtractExecutionError(execData);
                    finished = true; // Errors mean it's done
                }

                // Update database with latest status
                await UpdateExecutionInDatabase(executionId, status, finished, error, configuration);

                var result = new
                {
                    id = executionId,
                    status,
                    finished,
                    startedAt,
                    stoppedAt,
                    error
                };

                Console.WriteLine($"📤 Returning status: {status}, finished: {finished}");
                return Results.Ok(result);
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"❌ Network error: {ex.Message}");

                // Try database fallback
                var dbStatus = await GetExecutionFromDatabase(executionId, configuration);
                if (dbStatus != null)
                {
                    return Results.Ok(dbStatus);
                }

                return Results.Ok(new
                {
                    id = executionId,
                    status = "unknown",
                    finished = false,
                    error = new { message = "Cannot connect to n8n to check status" }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error: {ex.Message}");
                return Results.Problem($"Error checking execution: {ex.Message}");
            }
        }

        private static object? ExtractExecutionError(JsonElement execData)
        {
            try
            {
                // Path 1: resultData.error
                if (execData.TryGetProperty("data", out var dataObj))
                {
                    if (dataObj.TryGetProperty("resultData", out var resultData))
                    {
                        if (resultData.TryGetProperty("error", out var errorObj))
                        {
                            return new
                            {
                                message = GetStringProperty(errorObj, "message") ?? "Execution failed",
                                nodeName = GetStringProperty(errorObj, "node"),
                                stack = GetStringProperty(errorObj, "stack")
                            };
                        }

                        // Path 2: Check runData for node-specific errors
                        if (resultData.TryGetProperty("runData", out var runData))
                        {
                            foreach (var nodeProp in runData.EnumerateObject())
                            {
                                if (nodeProp.Value.ValueKind == JsonValueKind.Array)
                                {
                                    foreach (var run in nodeProp.Value.EnumerateArray())
                                    {
                                        if (run.TryGetProperty("error", out var nodeError))
                                        {
                                            return new
                                            {
                                                message = GetStringProperty(nodeError, "message") ?? "Node execution failed",
                                                nodeName = nodeProp.Name,
                                                description = GetStringProperty(nodeError, "description")
                                            };
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Path 3: Direct error property
                if (execData.TryGetProperty("error", out var directError))
                {
                    if (directError.ValueKind == JsonValueKind.String)
                    {
                        return new { message = directError.GetString() };
                    }
                    return new
                    {
                        message = GetStringProperty(directError, "message") ?? "Execution failed"
                    };
                }

                return new { message = "Workflow execution failed" };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"⚠️ Error extracting execution error: {ex.Message}");
                return new { message = "Failed to parse error details" };
            }
        }

        private static string? GetStringProperty(JsonElement element, string propertyName)
        {
            if (element.TryGetProperty(propertyName, out var prop) && prop.ValueKind == JsonValueKind.String)
            {
                return prop.GetString();
            }
            return null;
        }

        private static async Task<object?> GetExecutionFromDatabase(long executionId, IConfiguration configuration)
        {
            try
            {
                var connectionString = configuration.GetConnectionString("DefaultConnection");
                using var connection = new SqlConnection(connectionString);
                await connection.OpenAsync();

                var execution = await connection.QueryFirstOrDefaultAsync<dynamic>(@"
                    SELECT id, status, finished, started_at, stopped_at, custom_data
                    FROM [OmniSight].[dbo].[executions]
                    WHERE id = @ExecutionId",
                    new { ExecutionId = executionId });

                if (execution == null) return null;

                object? error = null;
                if (!string.IsNullOrEmpty(execution.custom_data))
                {
                    try
                    {
                        var customData = JsonSerializer.Deserialize<JsonElement>(execution.custom_data);
                        if (customData.TryGetProperty("error", out var errorData))
                        {
                            error = new
                            {
                                message = GetStringProperty(errorData, "message"),
                                nodeName = GetStringProperty(errorData, "nodeName"),
                                type = GetStringProperty(errorData, "type")
                            };
                        }
                    }
                    catch { }
                }

                return new
                {
                    id = execution.id,
                    status = execution.status,
                    finished = execution.finished,
                    startedAt = execution.started_at?.ToString("o"),
                    stoppedAt = execution.stopped_at?.ToString("o"),
                    error
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"⚠️ Database fallback error: {ex.Message}");
                return null;
            }
        }

        private static async Task UpdateExecutionInDatabase(
            long executionId,
            string status,
            bool finished,
            object? error,
            IConfiguration configuration)
        {
            try
            {
                var connectionString = configuration.GetConnectionString("DefaultConnection");
                using var connection = new SqlConnection(connectionString);
                await connection.OpenAsync();

                var customData = error != null
                    ? JsonSerializer.Serialize(new { error })
                    : null;

                await connection.ExecuteAsync(@"
                    UPDATE [OmniSight].[dbo].[executions]
                    SET status = @Status, 
                        finished = @Finished, 
                        stopped_at = CASE WHEN @Finished = 1 THEN GETUTCDATE() ELSE stopped_at END,
                        custom_data = COALESCE(@CustomData, custom_data)
                    WHERE id = @ExecutionId",
                    new
                    {
                        ExecutionId = executionId,
                        Status = status == "success" || status == "completed" ? "success" :
                                status == "error" || status == "failed" || status == "crashed" ? "error" : status,
                        Finished = finished,
                        CustomData = customData
                    });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"⚠️ Failed to update execution in database: {ex.Message}");
            }
        }
    }
}