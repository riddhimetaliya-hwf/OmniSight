namespace OmniSightAPI.Constants;

public static class ApplicationConstants
{
    public const string N8nUnavailable = "n8n_unavailable";
    public const string DefaultConnectionString = "Server=(localdb)\\MSSQLLocalDB;Database=OmniSight;Trusted_Connection=true;TrustServerCertificate=true;";
    
    public static class ErrorCodes
    {
        public const string ValidationError = "VALIDATION_ERROR";
        public const string NotFound = "NOT_FOUND";
        public const string InternalServerError = "INTERNAL_SERVER_ERROR";
        public const string N8nUnavailable = "N8N_UNAVAILABLE";
        public const string CredentialCreationFailed = "CREDENTIAL_CREATION_FAILED";
    }
}

