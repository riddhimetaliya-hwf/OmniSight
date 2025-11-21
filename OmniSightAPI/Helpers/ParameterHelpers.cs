using System.Text.Json;

namespace OmniSightAPI.Helpers
{
    public static class ParameterHelpers
    {
        public static void UpdateParametersRecursive(
            JsonElement current,
            Dictionary<string, string> userParams,
            Dictionary<string, object> result,
            string currentPath,
            string nodeName = "")
        {
            foreach (var prop in current.EnumerateObject())
            {
                var fullPath = string.IsNullOrEmpty(currentPath) ? prop.Name : $"{currentPath}.{prop.Name}";

                if (userParams.ContainsKey(fullPath))
                {
                    result[prop.Name] = userParams[fullPath];
                    Console.WriteLine($"📝 Set parameter {fullPath} = {userParams[fullPath]}");
                }
                else if (IsEmailParameter(prop.Name))
                {
                    var matchingParam = FindMatchingEmailParameter(prop.Name, userParams);
                    if (!string.IsNullOrEmpty(matchingParam.Key))
                    {
                        result[prop.Name] = matchingParam.Value;
                        Console.WriteLine($"📧 Set email parameter {prop.Name} = {matchingParam.Value}");
                    }
                    else
                    {
                        result[prop.Name] = prop.Value;
                    }
                }
                else if (prop.Value.ValueKind == JsonValueKind.Object)
                {
                    var nestedDict = new Dictionary<string, object>();
                    UpdateParametersRecursive(prop.Value, userParams, nestedDict, fullPath, nodeName);
                    result[prop.Name] = nestedDict;
                }
                else
                {
                    result[prop.Name] = prop.Value;
                }
            }
        }

        private static bool IsEmailParameter(string paramName)
        {
            var name = paramName.ToLower();
            return name.Contains("email") || name == "to" || name == "from";
        }

        private static KeyValuePair<string, string> FindMatchingEmailParameter(
            string paramName,
            Dictionary<string, string> userParams)
        {
            var paramKey = paramName.ToLower();

            return userParams.FirstOrDefault(kv =>
                kv.Key.ToLower().Contains(paramKey) ||
                (paramKey == "from" && kv.Key.ToLower().Contains("fromemail")) ||
                (paramKey == "to" && kv.Key.ToLower().Contains("toemail"))
            );
        }
    }
}