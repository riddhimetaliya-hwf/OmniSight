using Dapper;
using Microsoft.Data.SqlClient;
using OmniSightAPI.Services;
using Serilog;
using System.Text.Json;

namespace OmniSightAPI.Helpers
{
    public static class CredentialDecryptionHelper
    {
        private static readonly ILogger _logger = Log.ForContext(typeof(CredentialDecryptionHelper));

        public static Dictionary<string, string> DecryptSensitiveFields(
            string encryptedCredentialJson,
            IEncryptionService encryptionService)
        {
            var encryptedData = JsonSerializer.Deserialize<Dictionary<string, string>>(encryptedCredentialJson);
            if (encryptedData == null)
            {
                _logger.Warning("Encrypted credential JSON is null or invalid");
                return new Dictionary<string, string>();
            }

            var decryptedData = new Dictionary<string, string>();

            // Define which fields should be decrypted
            var sensitiveFields = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                "password", "secret", "apiKey", "accessToken", "refreshToken",
                "clientSecret", "privateKey", "token", "key", "apikey"
            };

            foreach (var kvp in encryptedData)
            {
                // Decrypt if it's a sensitive field
                if (sensitiveFields.Contains(kvp.Key))
                {
                    try
                    {
                        decryptedData[kvp.Key] = encryptionService.Decrypt(kvp.Value);
                        _logger.Debug("Decrypted sensitive field. FieldName: {FieldName}", kvp.Key);
                    }
                    catch (Exception ex)
                    {
                        _logger.Warning(ex, "Failed to decrypt field. FieldName: {FieldName}, keeping encrypted value", kvp.Key);
                        // Keep encrypted value if decryption fails (for debugging)
                        decryptedData[kvp.Key] = kvp.Value;
                    }
                }
                else
                {
                    // Keep non-sensitive fields as-is
                    decryptedData[kvp.Key] = kvp.Value;
                }
            }

            return decryptedData;
        }

        public static async Task<Dictionary<string, string>?> GetDecryptedCredential(
            SqlConnection connection,
            string credentialId,
            IEncryptionService encryptionService)
        {
            var sql = @"
                SELECT [credential_data] 
                FROM [OmniSight].[dbo].[credentials] 
                WHERE [id] = @Id";

            var credentialJson = await connection.QueryFirstOrDefaultAsync<string>(
                sql,
                new { Id = credentialId }
            );

            if (string.IsNullOrEmpty(credentialJson))
            {
                return null;
            }

            return DecryptSensitiveFields(credentialJson, encryptionService);
        }
    }
}
