namespace OmniSightAPI.Helpers
{
    public static class LogHelpers
    {
        public static string GetLogMessage(string status, string workflowName)
        {
            if (string.IsNullOrEmpty(workflowName))
                workflowName = "Unknown Workflow";

            return status?.ToLower() switch
            {
                "success" => $"Workflow '{workflowName}' executed successfully",
                "failed" => $"Workflow '{workflowName}' execution failed",
                "running" => $"Workflow '{workflowName}' is currently running",
                _ => $"Workflow '{workflowName}' execution recorded"
            };
        }
    }
}
