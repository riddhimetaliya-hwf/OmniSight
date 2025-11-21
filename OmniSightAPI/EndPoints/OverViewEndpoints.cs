using Dapper;
using Microsoft.Data.SqlClient;
using OmniSightAPI.Helpers;

namespace OmniSightAPI.Endpoints
{
    public static class OverviewEndpoints
    {
        public static void MapOverviewEndpoints(this IEndpointRouteBuilder endpoints)
        {
            var group = endpoints.MapGroup("/api/overview")
                .WithTags("Overview");

            group.MapGet("/all", GetOverviewData)
                .WithName("GetOverviewData")
                .WithSummary("Get complete overview data for dashboard");
        }

        private static async Task<IResult> GetOverviewData(IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection")
                                  ?? "Server=(localdb)\\MSSQLLocalDB;Database=OmniSight;Trusted_Connection=true;TrustServerCertificate=true;";

            try
            {
                using var connection = new SqlConnection(connectionString);

                // Call the stored procedure
                var result = await connection.QueryMultipleAsync(
                    "GetOverviewData",
                    commandType: System.Data.CommandType.StoredProcedure
                );

                // Read the multiple result sets in correct order
                var statsResult = await result.ReadFirstOrDefaultAsync();
                var executionsResult = (await result.ReadAsync<dynamic>()).ToList();
                var activitiesResult = (await result.ReadAsync<dynamic>()).ToList();
                var logsResult = (await result.ReadAsync<dynamic>()).ToList();

                // Transform stats to match frontend expectations
                var stats = new
                {
                    activeWorkflows = (int)(statsResult?.TotalWorkflows ?? 0),
                    completedToday = (int)(statsResult?.TodayExecutions ?? 0),
                    pendingTasks = (int)(statsResult?.RunningExecutions ?? 0),
                    alerts = (int)(statsResult?.RecentFailures ?? 0)
                };

                // Transform executions to match frontend
                var executions = executionsResult.Select(e => new
                {
                    id = e.Id?.ToString() ?? "",
                    workflowName = e.WorkflowName?.ToString() ?? "Unknown Workflow",
                    status = e.ExecutionStatus?.ToString()?.ToLower() ?? "unknown",
                    timestamp = FormattingHelpers.FormatTimestamp(e.Timestamp),
                    duration = FormattingHelpers.FormatDuration(e.DurationSeconds),
                    triggerType = e.TriggerType?.ToString() ?? "manual",
                    errorMessage = e.ExecutionStatus?.ToString() == "failed" ? "Execution failed" : null,
                    nodesPassed = 0,
                    totalNodes = 0
                }).ToList();

                // Create user map for activities
                var userMap = new Dictionary<string, dynamic>();
                try
                {
                    var users = await connection.QueryAsync("SELECT id, email, first_name, last_name FROM [OmniSight].[dbo].[users]");
                    foreach (var user in users)
                    {
                        userMap[user.id.ToString()] = user;
                    }
                }
                catch (Exception userEx)
                {
                    Console.WriteLine($"⚠️ Could not load users: {userEx.Message}");
                }

                // Transform activities to match frontend
                var activities = activitiesResult.Select(a => new
                {
                    id = a.Id?.ToString() ?? "",
                    type = a.ActivityType?.ToString() ?? "workflow_executed",
                    timestamp = FormattingHelpers.FormatActivityTimestamp(a.Timestamp),
                    user = UserHelpers.GetUserInfo(a.UserId?.ToString(), userMap),
                    description = a.Description?.ToString() ?? "Executed workflow",
                    target = a.Target?.ToString()
                }).ToList();

                // Transform logs to match frontend
                var logs = logsResult.Select(l => new
                {
                    id = l.Id?.ToString() ?? "",
                    timestamp = FormattingHelpers.FormatLogTimestamp(l.Timestamp),
                    level = l.Level?.ToString() ?? "info",
                    message = LogHelpers.GetLogMessage(l.Status?.ToString(), l.WorkflowName?.ToString()),
                    workflowName = l.WorkflowName?.ToString() ?? "Unknown Workflow",
                    executionId = l.Id?.ToString() ?? "",
                    details = new
                    {
                        metadata = new
                        {
                            duration = l.DurationSeconds,
                            status = l.Status?.ToString(),
                            customData = l.CustomData?.ToString()
                        }
                    }
                }).ToList();

                var overviewData = new
                {
                    stats,
                    executions,
                    activities,
                    logs
                };

                Console.WriteLine($"✅ Overview data fetched: {stats.activeWorkflows} workflows, {executions.Count} executions, {activities.Count} activities, {logs.Count} logs");
                return Results.Ok(overviewData);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error fetching overview data: {ex.Message}");
                Console.WriteLine($"❌ Stack trace: {ex.StackTrace}");
                return Results.Problem($"Database error: {ex.Message}");
            }
        }
    }
}