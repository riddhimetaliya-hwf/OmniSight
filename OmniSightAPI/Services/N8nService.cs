using System.Text.Json;

namespace OmniSightAPI.Services
{
    public interface IN8nService
    {
        Task<string> CreateCredentialAsync(string credentialType, Dictionary<string, string> credentialData, string credentialName);
        Task<string> SaveWorkflowAsync(Dictionary<string, object> workflow, string workflowName);
        Task<bool> ActivateWorkflowAsync(string n8nWorkflowId);
    }
    public class N8nService : IN8nService
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public N8nService(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }
        public async Task<string> CreateCredentialAsync(
            string credentialType,
            Dictionary<string, string> credentialData,
            string credentialName)
        {
            try
            {
                var httpClient = _httpClientFactory.CreateClient("n8n");
                var n8nCredType = MapToN8nCredentialType(credentialType);
                var n8nData = BuildN8nCredentialData(credentialType, credentialData);

                var n8nCredential = new
                {
                    name = credentialName,
                    type = n8nCredType,
                    data = n8nData
                };

                Console.WriteLine($"📤 Creating n8n credential of type: {n8nCredType}");

                var response = await httpClient.PostAsJsonAsync("/api/v1/credentials", n8nCredential);
                var responseContent = await response.Content.ReadAsStringAsync();

                Console.WriteLine($"📥 n8n response status: {response.StatusCode}");

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
                }

                Console.WriteLine($"❌ n8n credential creation failed: {responseContent}");
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Exception creating n8n credential: {ex.Message}");
                return null;
            }
        }

        public async Task<string> SaveWorkflowAsync(Dictionary<string, object> workflow, string workflowName)
        {
            try
            {
                var httpClient = _httpClientFactory.CreateClient("n8n");

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

                        await Task.Delay(1000);
                        await ActivateWorkflowAsync(workflowId);

                        return workflowId;
                    }
                }

                Console.WriteLine($"❌ Failed to save workflow: {responseContent}");
                return "n8n_unavailable";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error saving workflow to n8n: {ex.Message}");
                return "n8n_unavailable";
            }
        }

        public async Task<bool> ActivateWorkflowAsync(string n8nWorkflowId)
        {
            try
            {
                var httpClient = _httpClientFactory.CreateClient("n8n");

                var activationPayload = new { active = true };
                var response = await httpClient.PostAsJsonAsync($"/api/v1/workflows/{n8nWorkflowId}/activate", activationPayload);

                Console.WriteLine($"📥 Activation response: {response.StatusCode}");

                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"✅ Workflow {n8nWorkflowId} activated successfully");
                    return true;
                }

                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"⚠️ Failed to activate workflow: {errorContent}");
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"⚠️ Error activating workflow: {ex.Message}");
                return false;
            }
        }

        private static string MapToN8nCredentialType(string credentialType)
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

        private static Dictionary<string, object> BuildN8nCredentialData(string credentialType, Dictionary<string, string> data)
        {
            var type = credentialType.ToLower();

            if (type.Contains("smtp") || type.Contains("email"))
            {
                int.TryParse(data.GetValueOrDefault("port", "465"), out var port);
                bool.TryParse(data.GetValueOrDefault("secure", "false"), out var secure);

                return new Dictionary<string, object>
                {
                    ["user"] = data.GetValueOrDefault("user", ""),
                    ["password"] = data.GetValueOrDefault("password", ""),
                    ["host"] = data.GetValueOrDefault("host", "smtp.gmail.com"),
                    ["port"] = port,
                    ["secure"] = secure
                };
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
    }
}