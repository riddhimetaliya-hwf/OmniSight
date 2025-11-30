using System.Text.Json;
using OmniSightAPI.Services;

namespace OmniSightAPI.Endpoints
{
    public static class CredentialEndpoints
    {
        public static void MapCredentialEndpoints(this IEndpointRouteBuilder endpoints)
        {
            var group = endpoints.MapGroup("/api/credentials")
                .WithTags("Credentials");

            group.MapPost("/types-from-workflow", GetCredentialTypesFromWorkflow)
                .WithName("GetCredentialTypesFromWorkflow")
                .WithSummary("Get credential types and fields from n8n based on workflow nodes");

            group.MapGet("/types", GetAllCredentialTypes)
                .WithName("GetAllCredentialTypes")
                .WithSummary("Get all available credential types from n8n");

            group.MapGet("/types/{credentialType}", GetCredentialTypeDetails)
                .WithName("GetCredentialTypeDetails")
                .WithSummary("Get detailed information about a specific credential type");
        }

        private static async Task<IResult> GetCredentialTypesFromWorkflow(
            WorkflowCredentialRequest request,
            IHttpClientFactory httpClientFactory)
        {
            try
            {
                var httpClient = httpClientFactory.CreateClient("n8n");
                var credentialTypes = new List<CredentialTypeInfo>();

                if (string.IsNullOrEmpty(request.WorkflowJson))
                {
                    return Results.BadRequest("Workflow JSON is required");
                }

                // Parse workflow JSON to extract nodes
                var workflow = JsonSerializer.Deserialize<JsonElement>(request.WorkflowJson);
                var nodes = new List<JsonElement>();

                if (workflow.TryGetProperty("nodes", out var nodesProperty))
                {
                    if (nodesProperty.ValueKind == JsonValueKind.Array)
                    {
                        foreach (var node in nodesProperty.EnumerateArray())
                        {
                            nodes.Add(node);
                        }
                    }
                    else if (nodesProperty.ValueKind == JsonValueKind.Object)
                    {
                        // Handle case where nodes is an object (dictionary)
                        foreach (var nodeProperty in nodesProperty.EnumerateObject())
                        {
                            nodes.Add(nodeProperty.Value);
                        }
                    }
                }

                // Extract unique credential types from nodes
                var credentialTypeSet = new HashSet<string>();
                var nodeCredentialMap = new Dictionary<string, List<string>>();

                foreach (var node in nodes)
                {
                    if (node.TryGetProperty("credentials", out var credentials))
                    {
                        var nodeName = node.TryGetProperty("name", out var nameProp) 
                            ? nameProp.GetString() 
                            : node.TryGetProperty("type", out var typeProp) 
                                ? typeProp.GetString()?.Replace("n8n-nodes-base.", "") 
                                : "Unknown";

                        if (credentials.ValueKind == JsonValueKind.Object)
                        {
                            foreach (var credProperty in credentials.EnumerateObject())
                            {
                                var credType = credProperty.Name;
                                credentialTypeSet.Add(credType);

                                if (!nodeCredentialMap.ContainsKey(credType))
                                {
                                    nodeCredentialMap[credType] = new List<string>();
                                }
                                nodeCredentialMap[credType].Add(nodeName ?? "Unknown");
                            }
                        }
                    }
                }

                // Fetch credential type details from n8n
                foreach (var credType in credentialTypeSet)
                {
                    try
                    {
                        var response = await httpClient.GetAsync($"/api/v1/credential-types/{credType}");
                        if (response.IsSuccessStatusCode)
                        {
                            var content = await response.Content.ReadAsStringAsync();
                            var credTypeData = JsonSerializer.Deserialize<JsonElement>(content);

                            var credTypeInfo = new CredentialTypeInfo
                            {
                                Name = credType,
                                DisplayName = credTypeData.TryGetProperty("displayName", out var displayName)
                                    ? displayName.GetString()
                                    : credType,
                                Properties = ExtractProperties(credTypeData),
                                Nodes = nodeCredentialMap.ContainsKey(credType) 
                                    ? nodeCredentialMap[credType].Distinct().ToList() 
                                    : new List<string>()
                            };

                            credentialTypes.Add(credTypeInfo);
                        }
                        else
                        {
                            Console.WriteLine($"⚠️ Could not fetch credential type {credType}: {response.StatusCode}");
                            // Add basic info even if fetch fails
                            credentialTypes.Add(new CredentialTypeInfo
                            {
                                Name = credType,
                                DisplayName = credType,
                                Properties = new List<CredentialProperty>(),
                                Nodes = nodeCredentialMap.ContainsKey(credType) 
                                    ? nodeCredentialMap[credType].Distinct().ToList() 
                                    : new List<string>()
                            });
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"❌ Error fetching credential type {credType}: {ex.Message}");
                    }
                }

                return Results.Ok(new { credentialTypes });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error processing workflow credentials: {ex.Message}");
                return Results.Problem($"Error processing workflow credentials: {ex.Message}");
            }
        }

        private static async Task<IResult> GetAllCredentialTypes(IHttpClientFactory httpClientFactory)
        {
            try
            {
                var httpClient = httpClientFactory.CreateClient("n8n");
                var response = await httpClient.GetAsync("/api/v1/credential-types");

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    return Results.Ok(JsonSerializer.Deserialize<JsonElement>(content));
                }

                return Results.Problem($"Failed to fetch credential types: {response.StatusCode}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error fetching credential types: {ex.Message}");
                return Results.Problem($"Error fetching credential types: {ex.Message}");
            }
        }

        private static async Task<IResult> GetCredentialTypeDetails(
            string credentialType,
            IHttpClientFactory httpClientFactory)
        {
            try
            {
                var httpClient = httpClientFactory.CreateClient("n8n");
                var response = await httpClient.GetAsync($"/api/v1/credential-types/{credentialType}");

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var credTypeData = JsonSerializer.Deserialize<JsonElement>(content);

                    var credTypeInfo = new CredentialTypeInfo
                    {
                        Name = credentialType,
                        DisplayName = credTypeData.TryGetProperty("displayName", out var displayName)
                            ? displayName.GetString()
                            : credentialType,
                        Properties = ExtractProperties(credTypeData),
                        Nodes = new List<string>()
                    };

                    return Results.Ok(credTypeInfo);
                }

                return Results.NotFound($"Credential type {credentialType} not found");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error fetching credential type details: {ex.Message}");
                return Results.Problem($"Error fetching credential type details: {ex.Message}");
            }
        }

        private static List<CredentialProperty> ExtractProperties(JsonElement credTypeData)
        {
            var properties = new List<CredentialProperty>();

            if (credTypeData.TryGetProperty("properties", out var propertiesElement))
            {
                if (propertiesElement.ValueKind == JsonValueKind.Array)
                {
                    foreach (var prop in propertiesElement.EnumerateArray())
                    {
                        properties.Add(ExtractProperty(prop));
                    }
                }
                else if (propertiesElement.ValueKind == JsonValueKind.Object)
                {
                    foreach (var prop in propertiesElement.EnumerateObject())
                    {
                        properties.Add(ExtractProperty(prop.Value, prop.Name));
                    }
                }
            }

            return properties;
        }

        private static CredentialProperty ExtractProperty(JsonElement prop, string? name = null)
        {
            var propertyName = name ?? prop.TryGetProperty("name", out var nameProp) 
                ? nameProp.GetString() 
                : prop.TryGetProperty("displayName", out var displayNameProp)
                    ? displayNameProp.GetString()
                    : "Unknown";

            return new CredentialProperty
            {
                Name = propertyName ?? "Unknown",
                DisplayName = prop.TryGetProperty("displayName", out var displayName)
                    ? displayName.GetString()
                    : propertyName,
                Type = prop.TryGetProperty("type", out var typeProp)
                    ? typeProp.GetString()
                    : "string",
                Required = prop.TryGetProperty("required", out var requiredProp)
                    ? requiredProp.GetBoolean()
                    : false,
                DefaultValue = prop.TryGetProperty("default", out var defaultProp)
                    ? defaultProp.GetString()
                    : null,
                Description = prop.TryGetProperty("description", out var descProp)
                    ? descProp.GetString()
                    : null,
                Placeholder = prop.TryGetProperty("placeholder", out var placeholderProp)
                    ? placeholderProp.GetString()
                    : null
            };
        }
    }

    public class WorkflowCredentialRequest
    {
        public string WorkflowJson { get; set; } = string.Empty;
    }

    public class CredentialTypeInfo
    {
        public string Name { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public List<CredentialProperty> Properties { get; set; } = new();
        public List<string> Nodes { get; set; } = new();
    }

    public class CredentialProperty
    {
        public string Name { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public string Type { get; set; } = "string";
        public bool Required { get; set; }
        public string? DefaultValue { get; set; }
        public string? Description { get; set; }
        public string? Placeholder { get; set; }
    }
}

