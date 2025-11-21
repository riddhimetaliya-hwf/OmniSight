namespace OmniSightAPI.Models;

public class Workflow
{

    public string? Id { get; set; }
    public string? UserId { get; set; }
    public string? TemplateId { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? WorkflowJson { get; set; }
    public string? Nodes { get; set; }
    public string? Connections { get; set; }
    public bool SaveExecutionProgress { get; set; }
    public bool SaveManualExecutions { get; set; }
    public string? SaveDataErrorExecution { get; set; } = "none";
    public string? SaveDataSuccessExecution { get; set; } = "all";
    public int ExecutionTimeout { get; set; } = 3600;
    public string? ErrorWorkflow { get; set; }
    public string? Timezone { get; set; } = "UTC";
    public string? ExecutionOrder { get; set; } = "v1";
    public string? StaticData { get; set; }
    public string? SharedWorkflows { get; set; }
    public string? Status { get; set; } = "active";
    public string? N8nWorkflowId { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
};