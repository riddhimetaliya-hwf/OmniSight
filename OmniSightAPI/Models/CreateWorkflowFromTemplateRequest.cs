using System.Text.Json;
using System.Text.Json.Serialization;

namespace OmniSightAPI.Models;

public class CreateWorkflowFromTemplateRequest
{
    [JsonPropertyName("templateId")]
    public string TemplateId { get; set; } = string.Empty;

    [JsonPropertyName("credentials")]
    public Dictionary<string, JsonElement> Credentials { get; set; } = new();

    [JsonPropertyName("parameters")]
    public Dictionary<string, string> Parameters { get; set; } = new();

    [JsonPropertyName("customName")]
    public string? CustomName { get; set; }

    // NEW: Execution options
    [JsonPropertyName("executeImmediately")]
    public bool ExecuteImmediately { get; set; } = true;

    [JsonPropertyName("scheduleType")]
    public string? ScheduleType { get; set; } // "immediate", "once", "recurring"

    [JsonPropertyName("scheduledTime")]
    public DateTime? ScheduledTime { get; set; }

    [JsonPropertyName("cronExpression")]
    public string? CronExpression { get; set; } // For recurring schedules

}