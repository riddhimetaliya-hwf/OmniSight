using System.Text.Json.Serialization;

namespace OmniSightAPI.Models;
public class CreateWorkflowResponse
{
    [JsonPropertyName("workflowName")]
    public string WorkflowName { get; set; } = string.Empty;

    [JsonPropertyName("n8nWorkflowId")]
    public string N8nWorkflowId { get; set; } = string.Empty;

    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;

    [JsonPropertyName("executionId")]
    public string? ExecutionId { get; set; }

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }
}