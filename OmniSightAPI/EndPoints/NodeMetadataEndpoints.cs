using OmniSightAPI.Services;

namespace OmniSightAPI.EndPoints
{
    public static class NodeMetadataEndpoints
    {
        public static void MapNodeMetadataEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/node-metadata")
                           .WithTags("Node Metadata");

            group.MapGet("/{nodeType}", async (string nodeType, NodeMetadataService service) =>
            {
                var data = await service.GetMetadataAsync(nodeType);

                if (data == null || !data.Any())
                    return Results.NotFound("No metadata found");

                return Results.Ok(data);
            });
        }
    }
}
