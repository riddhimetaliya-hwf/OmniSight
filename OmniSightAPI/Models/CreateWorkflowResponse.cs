namespace OmniSightAPI.Models;
public class CreateWorkflowResponse
{
    public string WorkflowName { get; set; } = string.Empty;
    public string N8nWorkflowId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? ExecutionId { get; set; }
    public DateTime CreatedAt { get; set; }
}