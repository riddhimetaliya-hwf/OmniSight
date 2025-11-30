using System.Text.Json;
using Serilog;

namespace OmniSightAPI.Helpers
{
    public static class ParameterHelpers
    {
        private static readonly ILogger _logger = Log.ForContext(typeof(ParameterHelpers));

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
                    _logger.Debug("Set parameter. NodeName: {NodeName}, Path: {Path}", nodeName, fullPath);
                }
                else if (IsEmailParameter(prop.Name))
                {
                    var matchingParam = FindMatchingEmailParameter(prop.Name, userParams);
                    if (!string.IsNullOrEmpty(matchingParam.Key))
                    {
                        result[prop.Name] = matchingParam.Value;
                        _logger.Debug("Set email parameter. NodeName: {NodeName}, ParameterName: {ParameterName}",
                            nodeName, prop.Name);
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
            var name = paramName.ToLowerInvariant();
            return name.Contains("email", StringComparison.OrdinalIgnoreCase) || 
                   name == "to" || 
                   name == "from";
        }

        private static KeyValuePair<string, string> FindMatchingEmailParameter(
            string paramName,
            Dictionary<string, string> userParams)
        {
            var paramKey = paramName.ToLowerInvariant();

            return userParams.FirstOrDefault(kv =>
                kv.Key.Contains(paramKey, StringComparison.OrdinalIgnoreCase) ||
                (paramKey == "from" && kv.Key.Contains("fromemail", StringComparison.OrdinalIgnoreCase)) ||
                (paramKey == "to" && kv.Key.Contains("toemail", StringComparison.OrdinalIgnoreCase))
            );
        }
    }
}