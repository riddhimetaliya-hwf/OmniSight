using FluentValidation;
using Microsoft.OpenApi.Models;
using OmniSightAPI.Endpoints;
using OmniSightAPI.EndPoints;
using OmniSightAPI.Extensions;
using Serilog;

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/omnisight-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

// Use Serilog for logging
builder.Host.UseSerilog();

try
{
    builder.Configuration.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
}
catch (Exception ex)
{
    Log.Warning(ex, "Could not load appsettings.json");
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

// Register application services, validation, and HTTP clients
builder.Services.AddApplicationServices();
builder.Services.AddValidation();
builder.Services.AddN8nHttpClient(builder.Configuration);

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
app.MapCredentialEndpoints();

Log.Information("🚀 OmniSight API Starting...");
Log.Information("📍 Environment: {Environment}", app.Environment.EnvironmentName);
Log.Information("🌐 CORS Policy: {Policy}", app.Environment.IsDevelopment() ? "Development (with credentials)" : "AllowAll");

try
{
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}