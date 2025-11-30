using System.Text.Json;
using Serilog;

namespace OmniSightAPI.Helpers
{
    public static class CredentialHelpers
    {
        private static readonly ILogger _logger = Log.ForContext(typeof(CredentialHelpers));

        public static Dictionary<string, string>? ParseCredentialData(JsonElement credValue)
        {
            try
            {
                _logger.Debug("Parsing credential data. ValueKind: {ValueKind}", credValue.ValueKind);

                if (credValue.ValueKind == JsonValueKind.Object)
                {
                    var credentialData = new Dictionary<string, string>();
                    foreach (var prop in credValue.EnumerateObject())
                    {
                        var propValue = prop.Value.ValueKind switch
                        {
                            JsonValueKind.Number => prop.Value.GetInt32().ToString(),
                            JsonValueKind.True or JsonValueKind.False => prop.Value.GetBoolean().ToString().ToLowerInvariant(),
                            _ => prop.Value.GetString() ?? string.Empty
                        };

                        credentialData[prop.Name] = propValue;
                    }
                    _logger.Debug("Parsed structured credential. FieldCount: {FieldCount}", credentialData.Count);
                    return credentialData;
                }
                
                if (credValue.ValueKind == JsonValueKind.String)
                {
                    _logger.Debug("Parsed simple string credential");
                    return new Dictionary<string, string>
                    {
                        ["value"] = credValue.GetString() ?? string.Empty
                    };
                }

                _logger.Warning("Unknown credential value kind. ValueKind: {ValueKind}", credValue.ValueKind);
                return null;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error parsing credential data");
                return null;
            }
        }
    }
}