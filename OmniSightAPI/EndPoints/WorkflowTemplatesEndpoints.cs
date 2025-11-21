using Dapper;
using Microsoft.Data.SqlClient;
using OmniSightAPI.Models;

namespace OmniSightAPI.Endpoints
{
    public static class WorkflowTemplateEndpoints
    {
        public static void MapWorkflowTemplateEndpoints(this IEndpointRouteBuilder endpoints)
        {
            var group = endpoints.MapGroup("/api/workflow-templates")
                .WithTags("Workflow Templates");

            group.MapGet("", GetWorkflowTemplates)
                .WithName("GetWorkflowTemplates")
                .WithSummary("Get all published workflow templates");
        }

        private static async Task<IResult> GetWorkflowTemplates(IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection")
                                  ?? "Server=(localdb)\\MSSQLLocalDB;Database=OmniSight;Trusted_Connection=true;TrustServerCertificate=true;";

            try
            {
                using var connection = new SqlConnection(connectionString);

                var sql = @"
                    SELECT [id] as Id, [name] as Name, [description] as Description, 
                           [category] as Category, [template_json] as TemplateJson, 
                           [required_credentials] as RequiredCredentials, [integrations] as Integrations, 
                           [icon] as Icon, [is_published] as IsPublished, [usage_count] as UsageCount, 
                           [created_at] as CreatedAt, [updated_at] as UpdatedAt
                    FROM [OmniSight].[dbo].[workflow_templates] 
                    WHERE [is_published] = 1
                    ORDER BY [created_at] DESC";

                var templates = await connection.QueryAsync<WorkflowTemplate>(sql);
                return Results.Ok(templates);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Database error: {ex.Message}");
                return Results.Problem($"Database error: {ex.Message}");
            }
        }
    }
}
