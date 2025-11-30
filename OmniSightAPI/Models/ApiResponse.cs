namespace OmniSightAPI.Models;

/// <summary>
/// Standardized API response wrapper for successful operations
/// </summary>
public class ApiResponse<T>
{
    public bool Success { get; set; } = true;
    public T? Data { get; set; }
    public string? Message { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    public static ApiResponse<T> CreateSuccess(T data, string? message = null)
    {
        return new ApiResponse<T>
        {
            Success = true,
            Data = data,
            Message = message,
            Timestamp = DateTime.UtcNow
        };
    }
}

/// <summary>
/// Standardized API error response
/// </summary>
public class ApiErrorResponse
{
    public bool Success { get; set; } = false;
    public string Message { get; set; } = string.Empty;
    public string? ErrorCode { get; set; }
    public Dictionary<string, string[]>? ValidationErrors { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    public static ApiErrorResponse CreateError(string message, string? errorCode = null)
    {
        return new ApiErrorResponse
        {
            Success = false,
            Message = message,
            ErrorCode = errorCode,
            Timestamp = DateTime.UtcNow
        };
    }

    public static ApiErrorResponse CreateValidationError(Dictionary<string, string[]> validationErrors)
    {
        return new ApiErrorResponse
        {
            Success = false,
            Message = "Validation failed",
            ErrorCode = "VALIDATION_ERROR",
            ValidationErrors = validationErrors,
            Timestamp = DateTime.UtcNow
        };
    }
}

