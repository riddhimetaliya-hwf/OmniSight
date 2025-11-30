using Microsoft.AspNetCore.Mvc;
using OmniSightAPI.Models;

namespace OmniSightAPI.Extensions;

public static class EndpointExtensions
{
    /// <summary>
    /// Returns a standardized success response
    /// </summary>
    public static IResult Success<T>(T data, string? message = null)
    {
        return Results.Ok(ApiResponse<T>.CreateSuccess(data, message));
    }

    /// <summary>
    /// Returns a standardized error response
    /// </summary>
    public static IResult Error(string message, string? errorCode = null, int statusCode = 400)
    {
        var errorResponse = ApiErrorResponse.CreateError(message, errorCode);
        return Results.Json(errorResponse, statusCode: statusCode);
    }

    /// <summary>
    /// Returns a standardized validation error response
    /// </summary>
    public static IResult ValidationError(Dictionary<string, string[]> validationErrors)
    {
        var errorResponse = ApiErrorResponse.CreateValidationError(validationErrors);
        return Results.Json(errorResponse, statusCode: 400);
    }

    /// <summary>
    /// Returns a standardized not found response
    /// </summary>
    public static IResult NotFound(string message = "Resource not found")
    {
        return Error(message, "NOT_FOUND", 404);
    }

    /// <summary>
    /// Returns a standardized internal server error response
    /// </summary>
    public static IResult InternalServerError(string message = "An internal server error occurred")
    {
        return Error(message, "INTERNAL_SERVER_ERROR", 500);
    }
}

