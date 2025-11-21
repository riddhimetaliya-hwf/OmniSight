using Microsoft.OpenApi.Models;
using OmniSightAPI.Endpoints;
using OmniSightAPI.EndPoints;
using OmniSightAPI.Services;

var builder = WebApplication.CreateBuilder(args);

try
{
    builder.Configuration.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
}
catch (Exception ex)
{
    Console.WriteLine($"Warning: Could not load appsettings.json: {ex.Message}");
}

// Add services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "OmniSight API", Version = "v1" });
});

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });

    options.AddPolicy("Development", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:3000",
                "http://localhost:5174",
                "http://localhost:8080",
                "https://localhost:5173",
                "https://localhost:3000",
                "https://localhost:5174",
                "https://localhost:7104"
              )
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Register services
builder.Services.AddScoped<IN8nService, N8nService>();
builder.Services.AddScoped<IWorkflowService, WorkflowService>();
builder.Services.AddScoped<IEncryptionService, EncryptionService>();
builder.Services.AddScoped<NodeMetadataService>();

// Configure n8n HttpClient
builder.Services.AddHttpClient("n8n", client =>
{
    var n8nConfig = builder.Configuration.GetSection("N8n");
    var baseUrl = n8nConfig["BaseUrl"] ?? "http://localhost:5678";
    var apiKey = n8nConfig["ApiKey"];
    var timeout = n8nConfig.GetValue<int>("TimeoutSeconds", 30);

    client.BaseAddress = new Uri(baseUrl);
    client.Timeout = TimeSpan.FromSeconds(timeout);

    if (!string.IsNullOrEmpty(apiKey))
    {
        client.DefaultRequestHeaders.Add("X-N8N-API-KEY", apiKey);
        Console.WriteLine($"✅ n8n API key configured");
    }
    else
    {
        Console.WriteLine($"⚠️ n8n API key not found");
    }
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Apply CORS
app.UseCors("Development");

// Root redirect
app.MapGet("/", () => Results.Redirect("/swagger")).ExcludeFromDescription();

// Map all endpoint groups
app.MapWorkflowTemplateEndpoints();
app.MapWorkflowEndpoints();
app.MapOverviewEndpoints();
app.MapNodeMetadataEndpoints();

Console.WriteLine("🚀 OmniSight API Starting...");
Console.WriteLine($"📍 Environment: {app.Environment.EnvironmentName}");
Console.WriteLine($"🌐 CORS Policy: {(app.Environment.IsDevelopment() ? "Development (with credentials)" : "AllowAll")}");

app.Run();