using System.Text.Json;
using OmniSightAPI.Constants;
using Serilog;

namespace OmniSightAPI.Services
{
    public interface IN8nService
    {
        Task<string?> CreateCredentialAsync(string credentialType, Dictionary<string, string> credentialData, string credentialName);
        Task<WorkflowSaveResult> SaveWorkflowAsync(Dictionary<string, object> workflow, string workflowName);
        Task<bool> ActivateWorkflowAsync(string n8nWorkflowId);
    }

    public class WorkflowSaveResult
    {
        public string? WorkflowId { get; set; }
        public bool Success { get; set; }
        public List<string> Errors { get; set; } = new();
        public List<string> Warnings { get; set; } = new();
    }

    public class N8nService : IN8nService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger _logger;

        public N8nService(IHttpClientFactory httpClientFactory, ILogger logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }
        public async Task<string?> CreateCredentialAsync(
            string credentialType,
            Dictionary<string, string> credentialData,
            string credentialName)
        {
            try
            {
                var httpClient = _httpClientFactory.CreateClient("n8n");
                var n8nCredType = IsValidN8nCredentialType(credentialType) 
                    ? credentialType 
                    : MapToN8nCredentialType(credentialType);
                var n8nData = BuildN8nCredentialData(credentialType, credentialData);

                var n8nCredential = new
                {
                    name = credentialName,
                    type = n8nCredType,
                    data = n8nData
                };

                _logger.Information("Creating n8n credential. Type: {CredentialType}, Name: {CredentialName}", 
                    n8nCredType, credentialName);

                var response = await httpClient.PostAsJsonAsync("/api/v1/credentials", n8nCredential);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    var result = JsonSerializer.Deserialize<JsonElement>(responseContent);
                    var credentialId = ExtractCredentialId(result);

                    if (!string.IsNullOrEmpty(credentialId))
                    {
                        _logger.Information("Successfully created n8n credential. ID: {CredentialId}, Name: {CredentialName}", 
                            credentialId, credentialName);
                        return credentialId;
                    }

                    _logger.Warning("n8n credential creation succeeded but no ID found in response. Response: {Response}", 
                        responseContent);
                    return null;
                }

                _logger.Error("Failed to create n8n credential. Status: {StatusCode}, Response: {Response}", 
                    response.StatusCode, responseContent);
                return null;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception occurred while creating n8n credential. Type: {CredentialType}, Name: {CredentialName}", 
                    credentialType, credentialName);
                return null;
            }
        }

        private static string? ExtractCredentialId(JsonElement result)
        {
            if (result.TryGetProperty("data", out var data) && data.TryGetProperty("id", out var id))
                return id.GetString();
            
            if (result.TryGetProperty("id", out var directId))
                return directId.GetString();
            
            return null;
        }

        public async Task<WorkflowSaveResult> SaveWorkflowAsync(Dictionary<string, object> workflow, string workflowName)
        {
            var result = new WorkflowSaveResult();
            
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

                _logger.Information("Saving workflow to n8n. Name: {WorkflowName}", workflowName);

                var response = await httpClient.PostAsJsonAsync("/api/v1/workflows", n8nWorkflow);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    var jsonResult = JsonSerializer.Deserialize<JsonElement>(responseContent);
                    var workflowId = ExtractWorkflowId(jsonResult);

                    if (!string.IsNullOrEmpty(workflowId))
                    {
                        _logger.Information("Successfully saved workflow to n8n. ID: {WorkflowId}, Name: {WorkflowName}", 
                            workflowId, workflowName);

                        // Check for errors or warnings in the response
                        ExtractErrorsAndWarnings(jsonResult, result);

                        // Wait a moment for workflow to be ready before activation
                        await Task.Delay(1000, CancellationToken.None);
                        var activationResult = await ActivateWorkflowAsync(workflowId);
                        
                        if (!activationResult)
                        {
                            result.Warnings.Add("Workflow saved but activation failed. You may need to activate it manually in n8n.");
                        }

                        result.WorkflowId = workflowId;
                        result.Success = true;
                        return result;
                    }

                    _logger.Warning("Workflow save succeeded but no ID found in response. Response: {Response}", 
                        responseContent);
                    result.Errors.Add("Workflow saved but no ID was returned from n8n. Response: " + responseContent);
                    result.Success = false;
                    return result;
                }

                // Extract error message from n8n response
                var errorMessage = ExtractErrorMessage(responseContent);
                _logger.Error("Failed to save workflow to n8n. Status: {StatusCode}, Response: {Response}", 
                    response.StatusCode, responseContent);
                
                result.Errors.Add($"Failed to save workflow to n8n (Status: {response.StatusCode}): {errorMessage}");
                result.Success = false;
                return result;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception occurred while saving workflow to n8n. Name: {WorkflowName}", workflowName);
                result.Errors.Add($"Exception while saving workflow: {ex.Message}");
                result.Success = false;
                return result;
            }
        }

        private static void ExtractErrorsAndWarnings(JsonElement result, WorkflowSaveResult saveResult)
        {
            // Check for errors array
            if (result.TryGetProperty("errors", out var errors) && errors.ValueKind == JsonValueKind.Array)
            {
                foreach (var error in errors.EnumerateArray())
                {
                    var errorMessage = error.ValueKind switch
                    {
                        JsonValueKind.String => error.GetString(),
                        JsonValueKind.Object when error.TryGetProperty("message", out var msg) => msg.GetString(),
                        JsonValueKind.Object when error.TryGetProperty("error", out var err) => err.GetString(),
                        _ => error.ToString()
                    };
                    
                    if (!string.IsNullOrEmpty(errorMessage))
                        saveResult.Errors.Add(errorMessage);
                }
            }

            // Check for warnings array
            if (result.TryGetProperty("warnings", out var warnings) && warnings.ValueKind == JsonValueKind.Array)
            {
                foreach (var warning in warnings.EnumerateArray())
                {
                    var warningMessage = warning.ValueKind switch
                    {
                        JsonValueKind.String => warning.GetString(),
                        JsonValueKind.Object when warning.TryGetProperty("message", out var msg) => msg.GetString(),
                        _ => warning.ToString()
                    };
                    
                    if (!string.IsNullOrEmpty(warningMessage))
                        saveResult.Warnings.Add(warningMessage);
            }

            // Check for error message in node validation
            if (result.TryGetProperty("data", out var data) && data.ValueKind == JsonValueKind.Object)
            {
                if (data.TryGetProperty("nodes", out var nodes) && nodes.ValueKind == JsonValueKind.Array)
                {
                    foreach (var node in nodes.EnumerateArray())
                    {
                        var nodeName = node.TryGetProperty("name", out var name) ? name.GetString() : "Unknown";
                        
                        // Check for issues/errors in node
                        if (node.TryGetProperty("issues", out var issues))
                        {
                            if (issues.ValueKind == JsonValueKind.Object)
                            {
                                // Check for errors array
                                if (issues.TryGetProperty("errors", out var nodeErrors) && nodeErrors.ValueKind == JsonValueKind.Array)
                                {
                                    foreach (var nodeError in nodeErrors.EnumerateArray())
                                    {
                                        var errorMsg = nodeError.ValueKind switch
                                        {
                                            JsonValueKind.String => nodeError.GetString(),
                                            JsonValueKind.Object when nodeError.TryGetProperty("message", out var msg) => msg.GetString(),
                                            JsonValueKind.Object when nodeError.TryGetProperty("error", out var err) => err.GetString(),
                                            _ => nodeError.ToString()
                                        };
                                        
                                        if (!string.IsNullOrEmpty(errorMsg))
                                        {
                                            saveResult.Errors.Add($"Node '{nodeName}': {errorMsg}");
                                        }
                                    }
                                }
                                
                                // Check for parameter errors
                                if (issues.TryGetProperty("parameters", out var paramIssues) && paramIssues.ValueKind == JsonValueKind.Object)
                                {
                                    foreach (var param in paramIssues.EnumerateObject())
                                    {
                                        if (param.Value.ValueKind == JsonValueKind.Array)
                                        {
                                            foreach (var paramError in param.Value.EnumerateArray())
                                            {
                                                var errorMsg = paramError.ValueKind switch
                                                {
                                                    JsonValueKind.String => paramError.GetString(),
                                                    JsonValueKind.Object when paramError.TryGetProperty("message", out var msg) => msg.GetString(),
                                                    _ => paramError.ToString()
                                                };
                                                
                                                if (!string.IsNullOrEmpty(errorMsg))
                                                {
                                                    saveResult.Errors.Add($"Node '{nodeName}' - Parameter '{param.Name}': {errorMsg}");
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        
                        // Check for credential errors
                        if (node.TryGetProperty("credentials", out var credentials) && credentials.ValueKind == JsonValueKind.Object)
                        {
                            foreach (var cred in credentials.EnumerateObject())
                            {
                                if (cred.Value.ValueKind == JsonValueKind.Object)
                                {
                                    if (cred.Value.TryGetProperty("error", out var credError))
                                    {
                                        var errorMsg = credError.ValueKind switch
                                        {
                                            JsonValueKind.String => credError.GetString(),
                                            JsonValueKind.Object when credError.TryGetProperty("message", out var msg) => msg.GetString(),
                                            _ => credError.ToString()
                                        };
                                        
                                        if (!string.IsNullOrEmpty(errorMsg))
                                        {
                                            saveResult.Errors.Add($"Node '{nodeName}' - Credential '{cred.Name}': {errorMsg}");
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            // Check for workflow-level errors
            if (result.TryGetProperty("error", out var workflowError))
            {
                var errorMsg = workflowError.ValueKind switch
                {
                    JsonValueKind.String => workflowError.GetString(),
                    JsonValueKind.Object when workflowError.TryGetProperty("message", out var msg) => msg.GetString(),
                    _ => workflowError.ToString()
                };
                
                if (!string.IsNullOrEmpty(errorMsg))
                {
                    saveResult.Errors.Add($"Workflow error: {errorMsg}");
                }
            }
        }
        }

        private static string ExtractErrorMessage(string responseContent)
        {
            try
            {
                var json = JsonSerializer.Deserialize<JsonElement>(responseContent);
                
                // Try different error message locations
                if (json.TryGetProperty("message", out var message))
                    return message.GetString() ?? responseContent;
                
                if (json.TryGetProperty("error", out var error))
                {
                    if (error.ValueKind == JsonValueKind.String)
                        return error.GetString() ?? responseContent;
                    
                    if (error.ValueKind == JsonValueKind.Object && error.TryGetProperty("message", out var errorMsg))
                        return errorMsg.GetString() ?? responseContent;
                }
                
                if (json.TryGetProperty("errors", out var errors) && errors.ValueKind == JsonValueKind.Array)
                {
                    var errorMessages = new List<string>();
                    foreach (var err in errors.EnumerateArray())
                    {
                        var msg = err.ValueKind switch
                        {
                            JsonValueKind.String => err.GetString(),
                            JsonValueKind.Object when err.TryGetProperty("message", out var m) => m.GetString(),
                            _ => err.ToString()
                        };
                        if (!string.IsNullOrEmpty(msg))
                            errorMessages.Add(msg);
                    }
                    if (errorMessages.Count > 0)
                        return string.Join("; ", errorMessages);
                }
            }
            catch
            {
                // If parsing fails, return raw content
            }
            
            return responseContent;
        }

        private static string? ExtractWorkflowId(JsonElement result)
        {
            if (result.TryGetProperty("data", out var data) && data.TryGetProperty("id", out var id))
                return id.GetString();
            
            if (result.TryGetProperty("id", out var directId))
                return directId.GetString();
            
            return null;
        }

        public async Task<bool> ActivateWorkflowAsync(string n8nWorkflowId)
        {
            try
            {
                var httpClient = _httpClientFactory.CreateClient("n8n");
                var activationPayload = new { active = true };
                
                _logger.Information("Activating workflow in n8n. WorkflowId: {WorkflowId}", n8nWorkflowId);

                var response = await httpClient.PostAsJsonAsync($"/api/v1/workflows/{n8nWorkflowId}/activate", activationPayload);

                if (response.IsSuccessStatusCode)
                {
                    _logger.Information("Successfully activated workflow. WorkflowId: {WorkflowId}", n8nWorkflowId);
                    return true;
                }

                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.Warning("Failed to activate workflow. WorkflowId: {WorkflowId}, Status: {StatusCode}, Response: {Response}", 
                    n8nWorkflowId, response.StatusCode, errorContent);
                return false;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Exception occurred while activating workflow. WorkflowId: {WorkflowId}", n8nWorkflowId);
                return false;
            }
        }

        private static bool IsValidN8nCredentialType(string credentialType)
        {
            if (string.IsNullOrWhiteSpace(credentialType)) return false;
            
            // Common n8n credential types (these are the actual type names used in n8n)
            var validTypes = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                "smtp", "gmailOAuth2", "oAuth2Api", "httpBasicAuth", "httpHeaderAuth",
                "httpQueryAuth", "httpDigestAuth", "notionApi", "slackApi", "telegramApi",
                "discordApi", "twilioApi", "sendGridApi", "googleApi", "microsoftOAuth2",
                "aws", "azure", "githubApi", "gitlabApi", "bitbucketApi", "jiraApi",
                "trelloApi", "asanaApi", "airtableApi", "mongoDb", "postgres", "mysql",
                "redis", "rabbitMq", "kafka", "sftp", "ftp", "imap", "pop3"
            };
            
            return validTypes.Contains(credentialType);
        }

        private static string MapToN8nCredentialType(string credentialType)
        {
            var type = credentialType.ToLowerInvariant();

            if (type.Contains("smtp") || type.Contains("email")) return "smtp";
            if (type.Contains("oauth2")) return "oAuth2Api";
            if (type.Contains("httpbasicauth")) return "httpBasicAuth";
            if (type.Contains("httpheaderauth")) return "httpHeaderAuth";
            if (type.Contains("api")) return "httpHeaderAuth";

            // Log warning but don't use ILogger in static method - will be logged by caller
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