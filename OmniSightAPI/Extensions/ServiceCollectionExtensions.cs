using FluentValidation;
using OmniSightAPI.Services;
using OmniSightAPI.Validators;
using Serilog;

namespace OmniSightAPI.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Register services with Serilog logger
        services.AddScoped<IN8nService>(sp => 
            new N8nService(
                sp.GetRequiredService<IHttpClientFactory>(),
                Log.ForContext<N8nService>()));
        
        services.AddScoped<IWorkflowService>(sp => 
            new WorkflowService(
                sp.GetRequiredService<IHttpClientFactory>(),
                Log.ForContext<WorkflowService>()));
        services.AddScoped<IEncryptionService, EncryptionService>();
        services.AddScoped<NodeMetadataService>();

        return services;
    }

    public static IServiceCollection AddValidation(this IServiceCollection services)
    {
        services.AddValidatorsFromAssemblyContaining<CreateWorkflowFromTemplateRequestValidator>();
        return services;
    }

    public static IServiceCollection AddN8nHttpClient(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHttpClient("n8n", client =>
        {
            var n8nConfig = configuration.GetSection("N8n");
            var baseUrl = n8nConfig["BaseUrl"] ?? "http://localhost:5678";
            var apiKey = n8nConfig["ApiKey"];
            var timeout = n8nConfig.GetValue<int>("TimeoutSeconds", 30);

            client.BaseAddress = new Uri(baseUrl);
            client.Timeout = TimeSpan.FromSeconds(timeout);

            if (!string.IsNullOrEmpty(apiKey))
            {
                client.DefaultRequestHeaders.Add("X-N8N-API-KEY", apiKey);
            }
        });

        return services;
    }
}

