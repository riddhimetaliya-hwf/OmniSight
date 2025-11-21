using System.Text.Json;

namespace OmniSightAPI.Helpers
{
    public static class CredentialHelpers
    {
        public static Dictionary<string, string> ParseCredentialData(JsonElement credValue)
        {
            try
            {
                Console.WriteLine($"📦 Credential JSON: {credValue.GetRawText()}");

                if (credValue.ValueKind == JsonValueKind.Object)
                {
                    var credentialData = new Dictionary<string, string>();
                    foreach (var prop in credValue.EnumerateObject())
                    {
                        string propValue = prop.Value.ValueKind switch
                        {
                            JsonValueKind.Number => prop.Value.GetInt32().ToString(),
                            JsonValueKind.True or JsonValueKind.False => prop.Value.GetBoolean().ToString().ToLower(),
                            _ => prop.Value.GetString() ?? ""
                        };

                        credentialData[prop.Name] = propValue;
                    }
                    Console.WriteLine($"✅ Parsed structured credential with {credentialData.Count} fields");
                    return credentialData;
                }
                else if (credValue.ValueKind == JsonValueKind.String)
                {
                    Console.WriteLine($"✅ Parsed simple string credential");
                    return new Dictionary<string, string>
                    {
                        ["value"] = credValue.GetString() ?? ""
                    };
                }
                else
                {
                    Console.WriteLine($"⚠️ Unknown credential value kind: {credValue.ValueKind}");
                    return null;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error parsing credential data: {ex.Message}");
                return null;
            }
        }
    }
}