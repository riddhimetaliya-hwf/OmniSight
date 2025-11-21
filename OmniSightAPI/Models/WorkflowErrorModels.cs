namespace OmniSightAPI.Models;
public enum WorkflowErrorType
{
    None,
    CredentialError,
    NodeExecutionError,
    WorkflowNotFound,
    WorkflowActivationError,
    WebhookError,
    TimeoutError,
    NetworkError,
    ValidationError,
    N8nUnavailable,
    UnknownError
}
public class WorkflowExecutionError
{
    public WorkflowErrorType ErrorType { get; set; } = WorkflowErrorType.None;
    public string Message { get; set; } = string.Empty;
    public string? NodeName { get; set; }
    public string? NodeType { get; set; }
    public string? CredentialType { get; set; }
    public string? Details { get; set; }
    public string? N8nErrorCode { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
public class WorkflowExecutionResult
{
    public bool Success { get; set; }
    public string? ExecutionId { get; set; }
    public string? N8nWorkflowId { get; set; }
    public WorkflowExecutionError? Error { get; set; }
    public string? RawResponse { get; set; }

    public static WorkflowExecutionResult Succeeded(string executionId, string? n8nWorkflowId = null)
    {
        return new WorkflowExecutionResult
        {
            Success = true,
            ExecutionId = executionId,
            N8nWorkflowId = n8nWorkflowId
        };
    }

    public static WorkflowExecutionResult Failed(WorkflowErrorType errorType, string message, string? details = null)
    {
        return new WorkflowExecutionResult
        {
            Success = false,
            Error = new WorkflowExecutionError
            {
                ErrorType = errorType,
                Message = message,
                Details = details
            }
        };
    }

    public static WorkflowExecutionResult FailedWithNodeError(string nodeName, string nodeType, string message, string? details = null)
    {
        return new WorkflowExecutionResult
        {
            Success = false,
            Error = new WorkflowExecutionError
            {
                ErrorType = WorkflowErrorType.NodeExecutionError,
                Message = message,
                NodeName = nodeName,
                NodeType = nodeType,
                Details = details
            }
        };
    }

    public static WorkflowExecutionResult FailedWithCredentialError(string credentialType, string message, string? details = null)
    {
        return new WorkflowExecutionResult
        {
            Success = false,
            Error = new WorkflowExecutionError
            {
                ErrorType = WorkflowErrorType.CredentialError,
                Message = message,
                CredentialType = credentialType,
                Details = details
            }
        };
    }
}
public class CreateWorkflowResponseWithError : CreateWorkflowResponse
{
    public bool Success { get; set; } = true;
    public WorkflowExecutionError? Error { get; set; }
}