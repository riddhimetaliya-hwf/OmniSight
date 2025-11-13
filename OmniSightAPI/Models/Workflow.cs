using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OmniSightAPI.Models;

[Table("workflows", Schema = "dbo")]
public class Workflow
{
    [Key]
    [Column("id")]
    public string? Id { get; set; }

    [Column("user_id")]
    public string? UserId { get; set; }

    [Column("template_id")]
    public string? TemplateId { get; set; }

    [Column("name")]
    public string? Name { get; set; }

    [Column("description")]
    public string? Description { get; set; }

    [Column("workflow_json")]
    public string? WorkflowJson { get; set; }

    [Column("nodes")]
    public string? Nodes { get; set; }

    [Column("connections")]
    public string? Connections { get; set; }

    [Column("save_execution_progress")]
    public bool SaveExecutionProgress { get; set; }

    [Column("save_manual_executions")]
    public bool SaveManualExecutions { get; set; }

    [Column("save_data_error_execution")]
    public string? SaveDataErrorExecution { get; set; } = "none";

    [Column("save_data_success_execution")]
    public string? SaveDataSuccessExecution { get; set; } = "all";

    [Column("execution_timeout")]
    public int ExecutionTimeout { get; set; } = 3600;

    [Column("error_workflow")]
    public string? ErrorWorkflow { get; set; }

    [Column("timezone")]
    public string? Timezone { get; set; } = "UTC";

    [Column("execution_order")]
    public string? ExecutionOrder { get; set; } = "v1";

    [Column("static_data")]
    public string? StaticData { get; set; }

    [Column("shared_workflows")]
    public string? SharedWorkflows { get; set; }

    [Column("status")]
    public string? Status { get; set; } = "active";

    // CRITICAL FIX: Ensure n8n_workflow_id is properly mapped
    [Column("n8n_workflow_id")]
    public string? N8nWorkflowId { get; set; }

    [Column("created_at")]
    public DateTime? CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; }
};