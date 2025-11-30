using System.Text.Json;
using Serilog;

namespace OmniSightAPI.Services
{
    public interface IWorkflowService
    {
        Task<string> ExecuteWorkflowAsync(string n8nWorkflowId, string triggerType, Dictionary<string, object> workflowData, Dictionary<string, string> parameters);
    }

    public class WorkflowService : IWorkflowService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger _logger;

        public WorkflowService(IHttpClientFactory httpClientFactory, ILogger logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        public async Task<string> ExecuteWorkflowAsync(
            string n8nWorkflowId,
            string triggerType,
            Dictionary<string, object> workflowData,
            Dictionary<string, string> parameters)
        {
            return triggerType switch
            {
                "webhook" => await ExecuteWebhookWorkflow(n8nWorkflowId, workflowData, parameters),
                "manual" => await ExecuteManualWorkflow(n8nWorkflowId, workflowData, parameters),
                "schedule" => await ExecuteScheduleWorkflow(n8nWorkflowId, parameters),
                _ => await ExecuteManualWorkflow(n8nWorkflowId, workflowData, parameters)
            };
        }

        private async Task<string> ExecuteWebhookWorkflow(
            string n8nWorkflowId,
            Dictionary<string, object> workflowData,
            Dictionary<string, string> parameters)
        {
            var httpClient = _httpClientFactory.CreateClient("n8n");

            try
            {
                _logger.Information("Executing webhook workflow. WorkflowId: {N8nWorkflowId}, ParametersCount: {ParametersCount}",
                    n8nWorkflowId, parameters.Count);

                // STEP 1: Try to extract webhook path from workflow data
                string webhookPath = ExtractWebhookPathFromWorkflowData(workflowData);

                // STEP 2: If not found, fetch workflow details from n8n
                if (string.IsNullOrEmpty(webhookPath))
                {
                    _logger.Debug("Webhook path not found in workflow data, fetching from n8n API. WorkflowId: {N8nWorkflowId}",
                        n8nWorkflowId);

                    try
                    {
                        var getResponse = await httpClient.GetAsync($"/api/v1/workflows/{n8nWorkflowId}");
                        if (getResponse.IsSuccessStatusCode)
                        {
                            var content = await getResponse.Content.ReadAsStringAsync();
                            var json = JsonSerializer.Deserialize<JsonElement>(content);

                            JsonElement fetchedNodes;
                            if (json.TryGetProperty("data", out var data) && data.TryGetProperty("nodes", out fetchedNodes))
                            {
                                _logger.Debug("Found nodes inside data.nodes");
                            }
                            else if (json.TryGetProperty("nodes", out fetchedNodes))
                            {
                                _logger.Debug("Found nodes at root level");
                            }
                            else
                            {
                                _logger.Warning("No nodes found in n8n API response. WorkflowId: {N8nWorkflowId}", n8nWorkflowId);
                                fetchedNodes = default;
                            }

                            if (fetchedNodes.ValueKind == JsonValueKind.Array)
                            {
                                foreach (var node in fetchedNodes.EnumerateArray())
                                {
                                    if (node.TryGetProperty("type", out var type) &&
                                        type.GetString() == "n8n-nodes-base.webhook")
                                    {
                                        if (node.TryGetProperty("parameters", out var p) && p.TryGetProperty("path", out var pathProp))
                                        {
                                            webhookPath = pathProp.GetString();
                                            _logger.Information("Extracted webhook path from n8n API. WorkflowId: {N8nWorkflowId}, Path: {WebhookPath}",
                                                n8nWorkflowId, webhookPath);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            _logger.Warning("Failed to fetch workflow from n8n. WorkflowId: {N8nWorkflowId}, Status: {StatusCode}",
                                n8nWorkflowId, getResponse.StatusCode);
                        }
                    }
                    catch (Exception fetchEx)
                    {
                        _logger.Warning(fetchEx, "Exception fetching workflow from n8n. WorkflowId: {N8nWorkflowId}", n8nWorkflowId);
                    }
                }

                if (string.IsNullOrEmpty(webhookPath))
                {
                    _logger.Error("Could not determine webhook path for workflow. WorkflowId: {N8nWorkflowId}", n8nWorkflowId);
                    return null;
                }

                // Normalize path (remove leading/trailing slashes)
                webhookPath = webhookPath.Trim('/');
                _logger.Debug("Using webhook path. WorkflowId: {N8nWorkflowId}, Path: {WebhookPath}", n8nWorkflowId, webhookPath);

                var payload = new Dictionary<string, object>();
                foreach (var param in parameters)
                    payload[param.Key] = param.Value;

                // Use test endpoint first, then production
                var testWebhookUrl = $"/webhook-test/{webhookPath}";
                var prodWebhookUrl = $"/webhook/{webhookPath}";

                _logger.Debug("Trying test webhook. WorkflowId: {N8nWorkflowId}, Url: {TestWebhookUrl}",
                    n8nWorkflowId, testWebhookUrl);
                try
                {
                    var testResponse = await httpClient.PostAsJsonAsync(testWebhookUrl, payload);
                    var testContent = await testResponse.Content.ReadAsStringAsync();
                    _logger.Debug("Test webhook response. WorkflowId: {N8nWorkflowId}, Status: {StatusCode}",
                        n8nWorkflowId, testResponse.StatusCode);
                    if (testResponse.IsSuccessStatusCode)
                    {
                        // Try extract executionId if returned
                        try
                        {
                            var json = JsonSerializer.Deserialize<JsonElement>(testContent);
                            if (json.TryGetProperty("executionId", out var execId))
                                return execId.GetString();
                        }
                        catch { }
                        return Guid.NewGuid().ToString("N");
                    }
                }
                catch (Exception testEx)
                {
                    _logger.Warning(testEx, "Test webhook exception. WorkflowId: {N8nWorkflowId}", n8nWorkflowId);
                }

                _logger.Debug("Trying production webhook. WorkflowId: {N8nWorkflowId}, Url: {ProdWebhookUrl}",
                    n8nWorkflowId, prodWebhookUrl);
                try
                {
                    var prodResponse = await httpClient.PostAsJsonAsync(prodWebhookUrl, payload);
                    var prodContent = await prodResponse.Content.ReadAsStringAsync();
                    _logger.Debug("Production webhook response. WorkflowId: {N8nWorkflowId}, Status: {StatusCode}",
                        n8nWorkflowId, prodResponse.StatusCode);
                    if (prodResponse.IsSuccessStatusCode)
                    {
                        try
                        {
                            var json = JsonSerializer.Deserialize<JsonElement>(prodContent);
                            if (json.TryGetProperty("executionId", out var execId))
                                return execId.GetString();
                        }
                        catch { }
                        return Guid.NewGuid().ToString("N");
                    }
                }
                catch (Exception prodEx)
                {
                    _logger.Warning(prodEx, "Production webhook exception. WorkflowId: {N8nWorkflowId}", n8nWorkflowId);
                }

                _logger.Error("Both webhook endpoints failed. WorkflowId: {N8nWorkflowId}, Path: {WebhookPath}",
                    n8nWorkflowId, webhookPath);
                return null;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception in ExecuteWebhookWorkflow. WorkflowId: {N8nWorkflowId}", n8nWorkflowId);
                return null;
            }
        }

        private async Task<string> ExecuteManualWorkflow(
            string n8nWorkflowId,
            Dictionary<string, object> workflowData,
            Dictionary<string, string> parameters)
        {
            var httpClient = _httpClientFactory.CreateClient("n8n");

            try
            {
                _logger.Information("Executing manual trigger workflow. WorkflowId: {N8nWorkflowId}, ParametersCount: {ParametersCount}",
                    n8nWorkflowId, parameters.Count);

                var triggerData = new Dictionary<string, object>();
                foreach (var param in parameters)
                    triggerData[param.Key] = param.Value;

                // METHOD 1: Try /api/v1/workflows/{id}/run or /api/v1/workflows/run endpoints
                try
                {
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
                        runData = new
                        {
                            // Manual trigger injection
                            startData = new { destinationNode = "Manual Trigger" },
                            executionData = new
                            {
                                contextData = new { },
                                nodeExecutionStack = new[]
                                {
                                    new
                                    {
                                        node = new { name = "Manual Trigger", type = "n8n-nodes-base.manualTrigger" },
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

                    _logger.Debug("Sending run payload to /api/v1/workflows/run. WorkflowId: {N8nWorkflowId}", n8nWorkflowId);
                    var runResponse = await httpClient.PostAsJsonAsync($"/api/v1/workflows/run", runPayload);
                    var runContent = await runResponse.Content.ReadAsStringAsync();
                    _logger.Debug("Run response. WorkflowId: {N8nWorkflowId}, Status: {StatusCode}", n8nWorkflowId, runResponse.StatusCode);

                    if (runResponse.IsSuccessStatusCode)
                    {
                        try
                        {
                            var json = JsonSerializer.Deserialize<JsonElement>(runContent);
                            if (json.TryGetProperty("data", out var data) && data.TryGetProperty("executionId", out var execId))
                                return execId.GetString();
                        }
                        catch { }
                        return Guid.NewGuid().ToString("N");
                    }

                    _logger.Warning("/run endpoint failed. WorkflowId: {N8nWorkflowId}, Response: {Response}",
                        n8nWorkflowId, runContent);
                }
                catch (Exception runEx)
                {
                    _logger.Warning(runEx, "/run method exception. WorkflowId: {N8nWorkflowId}", n8nWorkflowId);
                }

                // METHOD 2: Activate & trigger via webhook-test (fallback)
                try
                {
                    var getWorkflowResponse = await httpClient.GetAsync($"/api/v1/workflows/{n8nWorkflowId}");
                    if (getWorkflowResponse.IsSuccessStatusCode)
                    {
                        // Activate
                        var activateResp = await httpClient.PatchAsJsonAsync($"/api/v1/workflows/{n8nWorkflowId}", new { active = true });
                        if (activateResp.IsSuccessStatusCode)
                        {
                            _logger.Information("Workflow activated for manual trigger. WorkflowId: {N8nWorkflowId}", n8nWorkflowId);
                            await Task.Delay(500, CancellationToken.None); // let n8n initialize

                            var triggerUrl = $"/webhook-test/{n8nWorkflowId}";
                            var webhookResponse = await httpClient.PostAsJsonAsync(triggerUrl, triggerData);
                            var webhookContent = await webhookResponse.Content.ReadAsStringAsync();
                            _logger.Debug("Webhook trigger response. WorkflowId: {N8nWorkflowId}, Status: {StatusCode}",
                                n8nWorkflowId, webhookResponse.StatusCode);
                            if (webhookResponse.IsSuccessStatusCode)
                                return Guid.NewGuid().ToString("N");
                        }
                    }
                }
                catch (Exception webhookEx)
                {
                    _logger.Warning(webhookEx, "Webhook method exception. WorkflowId: {N8nWorkflowId}", n8nWorkflowId);
                }

                // METHOD 3: Attempt direct execute endpoint
                try
                {
                    var directPayload = new { data = new[] { new { json = triggerData } } };
                    var directResponse = await httpClient.PostAsJsonAsync($"/api/v1/workflows/{n8nWorkflowId}/execute", directPayload);
                    var directContent = await directResponse.Content.ReadAsStringAsync();
                    _logger.Debug("Direct execute response. WorkflowId: {N8nWorkflowId}, Status: {StatusCode}",
                        n8nWorkflowId, directResponse.StatusCode);
                    if (directResponse.IsSuccessStatusCode)
                        return Guid.NewGuid().ToString("N");
                }
                catch (Exception directEx)
                {
                    _logger.Warning(directEx, "Direct execution exception. WorkflowId: {N8nWorkflowId}", n8nWorkflowId);
                }

                _logger.Information("Manual execution fallbacks exhausted. WorkflowId: {N8nWorkflowId}, workflow ready for manual trigger in n8n UI",
                    n8nWorkflowId);
                return null;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error executing manual workflow. WorkflowId: {N8nWorkflowId}", n8nWorkflowId);
                return null;
            }
        }

        private async Task<string> ExecuteScheduleWorkflow(
            string n8nWorkflowId,
            Dictionary<string, string> parameters)
        {
            var httpClient = _httpClientFactory.CreateClient("n8n");

            try
            {
                _logger.Information("Executing schedule workflow. WorkflowId: {N8nWorkflowId}", n8nWorkflowId);
                var triggerData = new Dictionary<string, object>();
                foreach (var param in parameters) triggerData[param.Key] = param.Value;

                var testPayload = new { triggerData = new[] { new { json = triggerData } } };
                _logger.Debug("Test payload prepared. WorkflowId: {N8nWorkflowId}", n8nWorkflowId);

                var testResponse = await httpClient.PostAsJsonAsync($"/api/v1/workflows/{n8nWorkflowId}/test", testPayload);
                var testContent = await testResponse.Content.ReadAsStringAsync();
                _logger.Debug("Test response. WorkflowId: {N8nWorkflowId}, Status: {StatusCode}",
                    n8nWorkflowId, testResponse.StatusCode);

                if (testResponse.IsSuccessStatusCode)
                {
                    try
                    {
                        var result = JsonSerializer.Deserialize<JsonElement>(testContent);
                        if (result.TryGetProperty("id", out var idProp))
                            return idProp.ValueKind == JsonValueKind.Number ? idProp.GetInt64().ToString() : idProp.GetString();

                        if (result.TryGetProperty("executionId", out var execId))
                            return execId.ValueKind == JsonValueKind.Number ? execId.GetInt64().ToString() : execId.GetString();
                    }
                    catch { }
                    return Guid.NewGuid().ToString("N");
                }

                // fallback direct execute
                var executeResponse = await httpClient.PostAsync($"/api/v1/workflows/{n8nWorkflowId}/execute", null);
                var executeContent = await executeResponse.Content.ReadAsStringAsync();
                _logger.Debug("Direct execute response. WorkflowId: {N8nWorkflowId}, Status: {StatusCode}",
                    n8nWorkflowId, executeResponse.StatusCode);
                if (executeResponse.IsSuccessStatusCode)
                {
                    try
                    {
                        var result = JsonSerializer.Deserialize<JsonElement>(executeContent);
                        if (result.TryGetProperty("data", out var data) && data.TryGetProperty("executionId", out var execId))
                            return execId.GetString();
                    }
                    catch { }
                    return Guid.NewGuid().ToString("N");
                }

                _logger.Information("Schedule workflow tested/activated and will run according to its schedule. WorkflowId: {N8nWorkflowId}",
                    n8nWorkflowId);
                return null;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error executing schedule workflow. WorkflowId: {N8nWorkflowId}", n8nWorkflowId);
                return null;
            }
        }

        private static string? ExtractWebhookPathFromWorkflowData(Dictionary<string, object> workflowData)
        {
            try
            {
                if (!workflowData.ContainsKey("nodes")) return null;

                if (workflowData["nodes"] is List<object> nodes)
                {
                    foreach (var nodeObj in nodes)
                    {
                        if (nodeObj is Dictionary<string, object> node)
                        {
                            var nodeType = node.GetValueOrDefault("type")?.ToString();
                            if (nodeType == "n8n-nodes-base.webhook")
                            {
                                if (node.ContainsKey("parameters") && node["parameters"] is Dictionary<string, object> parameters)
                                {
                                    if (parameters.ContainsKey("path"))
                                    {
                                        var path = parameters["path"]?.ToString();
                                        return path;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Log.ForContext(typeof(WorkflowService)).Warning(ex, "Error extracting webhook path from workflow data");
            }

            return null;
        }
    }
}
