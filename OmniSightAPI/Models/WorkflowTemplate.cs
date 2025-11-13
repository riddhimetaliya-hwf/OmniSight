using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OmniSightAPI.Models
{
    [Table("workflow_templates", Schema = "dbo")]
    public class WorkflowTemplate
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Category { get; set; }
        public string TemplateJson { get; set; } = string.Empty;
        public string? RequiredCredentials { get; set; }
        public string? Integrations { get; set; }
        public string? Icon { get; set; }
        public bool IsPublished { get; set; }
        public int UsageCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}