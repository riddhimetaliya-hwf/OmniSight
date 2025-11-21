using System.Text.Json;

namespace OmniSightAPI.Services
{
    public interface IWorkflowService
    {
        Task<string> ExecuteWorkflowAsync(string n8nWorkflowId, string triggerType, Dictionary<string, object> workflowData, Dictionary<string, string> parameters);
    }

    public class WorkflowService : IWorkflowService
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public WorkflowService(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
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
                Console.WriteLine($"🚀 === EXECUTING WEBHOOK WORKFLOW ===");
                Console.WriteLine($"🆔 Workflow ID: {n8nWorkflowId}");
                Console.WriteLine($"📋 Parameters: {JsonSerializer.Serialize(parameters)}");

                // STEP 1: Try to extract webhook path from workflow data
                string webhookPath = ExtractWebhookPathFromWorkflowData(workflowData);

                // STEP 2: If not found, fetch workflow details from n8n
                if (string.IsNullOrEmpty(webhookPath))
                {
                    Console.WriteLine($"💡 Path not found in provided workflow data, fetching from n8n API...");

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
                                Console.WriteLine($"✅ Found nodes inside data.nodes");
                            }
                            else if (json.TryGetProperty("nodes", out fetchedNodes))
                            {
                                Console.WriteLine($"✅ Found nodes at root level");
                            }
                            else
                            {
                                Console.WriteLine($"⚠️ No nodes found in n8n API response");
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
                                            Console.WriteLine($"✅ Extracted webhook path from n8n API: {webhookPath}");
                                            break;
                                        }
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

                if (string.IsNullOrEmpty(webhookPath))
                {
                    Console.WriteLine($"❌ FATAL: Could not determine webhook path for workflow {n8nWorkflowId}");
                    return null;
                }

                // Normalize path (remove leading/trailing slashes)
                webhookPath = webhookPath.Trim('/');
                Console.WriteLine($"✅ Using webhook path: '{webhookPath}'");

                var payload = new Dictionary<string, object>();
                foreach (var param in parameters)
                    payload[param.Key] = param.Value;

                // Use test endpoint first, then production
                var testWebhookUrl = $"/webhook-test/{webhookPath}";
                var prodWebhookUrl = $"/webhook/{webhookPath}";

                Console.WriteLine($"🌐 Trying test webhook: {testWebhookUrl}");
                try
                {
                    var testResponse = await httpClient.PostAsJsonAsync(testWebhookUrl, payload);
                    var testContent = await testResponse.Content.ReadAsStringAsync();
                    Console.WriteLine($"📥 Test webhook response: {testResponse.StatusCode} {testContent}");
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
                    Console.WriteLine($"⚠️ Test webhook exception: {testEx.Message}");
                }

                Console.WriteLine($"🌐 Trying production webhook: {prodWebhookUrl}");
                try
                {
                    var prodResponse = await httpClient.PostAsJsonAsync(prodWebhookUrl, payload);
                    var prodContent = await prodResponse.Content.ReadAsStringAsync();
                    Console.WriteLine($"📥 Production response: {prodResponse.StatusCode} {prodContent}");
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
                    Console.WriteLine($"⚠️ Production webhook exception: {prodEx.Message}");
                }

                Console.WriteLine($"❌ Both webhook endpoints failed for path '{webhookPath}'");
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ EXCEPTION in ExecuteWebhookWorkflow: {ex.Message}");
                Console.WriteLine($"Stack: {ex.StackTrace}");
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
                Console.WriteLine($"🚀 Executing MANUAL trigger workflow: {n8nWorkflowId}");
                Console.WriteLine($"📋 Parameters to pass: {JsonSerializer.Serialize(parameters)}");

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

                    Console.WriteLine($"📤 Sending run payload to /api/v1/workflows/run");
                    var runResponse = await httpClient.PostAsJsonAsync($"/api/v1/workflows/run", runPayload);
                    var runContent = await runResponse.Content.ReadAsStringAsync();
                    Console.WriteLine($"📥 Run response status: {runResponse.StatusCode} body: {runContent}");

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

                    Console.WriteLine($"⚠️ /run endpoint failed: {runContent}");
                }
                catch (Exception runEx)
                {
                    Console.WriteLine($"⚠️ /run method exception: {runEx.Message}");
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
                            Console.WriteLine($"✅ Workflow activated for manual trigger (id: {n8nWorkflowId})");
                            await Task.Delay(500); // let n8n initialize

                            var triggerUrl = $"/webhook-test/{n8nWorkflowId}";
                            var webhookResponse = await httpClient.PostAsJsonAsync(triggerUrl, triggerData);
                            var webhookContent = await webhookResponse.Content.ReadAsStringAsync();
                            Console.WriteLine($"📥 Webhook trigger: {webhookResponse.StatusCode} body: {webhookContent}");
                            if (webhookResponse.IsSuccessStatusCode)
                                return Guid.NewGuid().ToString("N");
                        }
                    }
                }
                catch (Exception webhookEx)
                {
                    Console.WriteLine($"⚠️ Webhook method exception: {webhookEx.Message}");
                }

                // METHOD 3: Attempt direct execute endpoint
                try
                {
                    var directPayload = new { data = new[] { new { json = triggerData } } };
                    var directResponse = await httpClient.PostAsJsonAsync($"/api/v1/workflows/{n8nWorkflowId}/execute", directPayload);
                    var directContent = await directResponse.Content.ReadAsStringAsync();
                    Console.WriteLine($"📥 Direct execute response: {directResponse.StatusCode} body: {directContent}");
                    if (directResponse.IsSuccessStatusCode)
                        return Guid.NewGuid().ToString("N");
                }
                catch (Exception directEx)
                {
                    Console.WriteLine($"⚠️ Direct execution exception: {directEx.Message}");
                }

                Console.WriteLine($"ℹ️ Manual execution fallbacks exhausted; workflow ready for manual trigger in n8n UI.");
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error executing manual workflow: {ex.Message}");
                Console.WriteLine($"❌ Stack trace: {ex.StackTrace}");
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
                Console.WriteLine($"🚀 Executing schedule workflow: {n8nWorkflowId}");
                var triggerData = new Dictionary<string, object>();
                foreach (var param in parameters) triggerData[param.Key] = param.Value;

                var testPayload = new { triggerData = new[] { new { json = triggerData } } };
                Console.WriteLine($"📤 Test payload: {JsonSerializer.Serialize(testPayload)}");

                var testResponse = await httpClient.PostAsJsonAsync($"/api/v1/workflows/{n8nWorkflowId}/test", testPayload);
                var testContent = await testResponse.Content.ReadAsStringAsync();
                Console.WriteLine($"📥 Test response: {testResponse.StatusCode} {testContent}");

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
                Console.WriteLine($"📥 Direct execute: {executeResponse.StatusCode} {executeContent}");
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

                Console.WriteLine($"ℹ️ Schedule workflow tested/activated and will run according to its schedule.");
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error executing schedule workflow: {ex.Message}");
                return null;
            }
        }

        private static string ExtractWebhookPathFromWorkflowData(Dictionary<string, object> workflowData)
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
                Console.WriteLine($"❌ Error extracting webhook path from workflow data: {ex.Message}");
            }

            return null;
        }
    }
}
