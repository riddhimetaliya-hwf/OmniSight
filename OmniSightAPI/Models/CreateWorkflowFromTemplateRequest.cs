using System.Text.Json;

namespace OmniSightAPI.Models;

public class CreateWorkflowFromTemplateRequest
{
    public string TemplateId { get; set; } = string.Empty;
    public Dictionary<string, JsonElement> Credentials { get; set; } = new();
    public Dictionary<string, string> Parameters { get; set; } = new();
    public string? CustomName { get; set; }
    public bool ExecuteImmediately { get; set; } = true;
    public string? ScheduleType { get; set; } 
    public DateTime? ScheduledTime { get; set; }
    public string? CronExpression { get; set; } 

}