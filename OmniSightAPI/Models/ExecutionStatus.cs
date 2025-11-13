namespace OmniSightAPI.Models
{
    public class ExecutionStatus
    {
        public long Id { get; set; }
        public string WorkflowId { get; set; } = string.Empty;
        public bool Finished { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Mode { get; set; } = string.Empty;
        public DateTime StartedAt { get; set; }
        public DateTime? StoppedAt { get; set; }
    }
}