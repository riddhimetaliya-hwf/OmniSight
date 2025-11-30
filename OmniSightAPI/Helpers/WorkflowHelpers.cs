using System.Text.Json;
using System.Text.RegularExpressions;
using Serilog;

namespace OmniSightAPI.Helpers
{
    public static class WorkflowHelpers
    {
        private static readonly ILogger _logger = Log.ForContext(typeof(WorkflowHelpers));

        public static Dictionary<string, object> CreateWorkflowFromTemplate(
            JsonElement template,
            Dictionary<string, string> credentialMappings,
            Dictionary<string, string> parameters,
            string customName,
            string templateId)
        {
            var workflow = new Dictionary<string, object>();

            _logger.Debug("Creating workflow from template. TemplateId: {TemplateId}, CustomName: {CustomName}",
                templateId, customName);
            _logger.Debug("Credential mappings ({Count}): {Mappings}",
                credentialMappings.Count,
                string.Join(", ", credentialMappings.Select(kv => $"{kv.Key}={kv.Value}")));

            if (template.TryGetProperty("name", out var nameProp))
                workflow["name"] = customName ?? $"{nameProp.GetString()} - Copy";

            if (template.TryGetProperty("nodes", out var nodesProp))
            {
                var updatedNodes = UpdateNodesWithCredentialsAndParameters(nodesProp, credentialMappings, parameters);
                workflow["nodes"] = updatedNodes;
            }

            foreach (var prop in new[] { "connections", "settings", "staticData" })
            {
                if (template.TryGetProperty(prop, out var propValue))
                    workflow[prop] = propValue;
            }

            workflow["id"] = Guid.NewGuid().ToString();
            return workflow;
        }

        public static string DetectWorkflowTriggerType(Dictionary<string, object> workflowData)
        {
            try
            {
                if (!workflowData.ContainsKey("nodes"))
                    return "manual";

                var nodesObj = workflowData["nodes"];

                if (nodesObj is List<object> nodesList)
                {
                    foreach (var nodeObj in nodesList)
                    {
                        if (nodeObj is Dictionary<string, object> node)
                        {
                            var nodeType = node.GetValueOrDefault("type")?.ToString();

                            if (nodeType == "n8n-nodes-base.webhook")
                                return "webhook";
                            if (nodeType == "n8n-nodes-base.manualTrigger")
                                return "manual";
                            if (nodeType == "n8n-nodes-base.scheduleTrigger" || nodeType == "n8n-nodes-base.cronTrigger")
                                return "schedule";
                        }
                    }
                }

                return "manual";
            }
            catch (Exception ex)
            {
                _logger.Warning(ex, "Error detecting trigger type, defaulting to manual");
                return "manual";
            }
        }

        public static string ExtractNodes(Dictionary<string, object> workflow) =>
            workflow.ContainsKey("nodes") ? JsonSerializer.Serialize(workflow["nodes"]) : "[]";

        public static string ExtractConnections(Dictionary<string, object> workflow) =>
            workflow.ContainsKey("connections") ? JsonSerializer.Serialize(workflow["connections"]) : "{}";

        public static (bool? saveExecutionProgress, bool? saveManualExecutions, string? saveDataErrorExecution,
            string? saveDataSuccessExecution, int? executionTimeout, string? errorWorkflow, string? timezone, string? executionOrder)
            ExtractSettings(Dictionary<string, object> workflow)
        {
            if (workflow.ContainsKey("settings") && workflow["settings"] is Dictionary<string, object> settings)
            {
                return (
                    settings.GetValueOrDefault("saveExecutionProgress") as bool? ?? false,
                    settings.GetValueOrDefault("saveManualExecutions") as bool? ?? false,
                    settings.GetValueOrDefault("saveDataErrorExecution")?.ToString() ?? "none",
                    settings.GetValueOrDefault("saveDataSuccessExecution")?.ToString() ?? "all",
                    settings.GetValueOrDefault("executionTimeout") as int? ?? 3600,
                    settings.GetValueOrDefault("errorWorkflow")?.ToString() ?? "",
                    settings.GetValueOrDefault("timezone")?.ToString() ?? "UTC",
                    settings.GetValueOrDefault("executionOrder")?.ToString() ?? "v1"
                );
            }
            return (false, false, "none", "all", 3600, "", "UTC", "v1");
        }

        public static string ExtractStaticData(Dictionary<string, object> workflow) =>
            workflow.ContainsKey("staticData") ? JsonSerializer.Serialize(workflow["staticData"]) : "{}";

        private static List<Dictionary<string, object>> UpdateNodesWithCredentialsAndParameters(
            JsonElement nodes,
            Dictionary<string, string> credentialMappings,
            Dictionary<string, string> parameters)
        {
            var updatedNodes = new List<Dictionary<string, object>>();

            foreach (var node in nodes.EnumerateArray())
            {
                var nodeDict = new Dictionary<string, object>();
                var nodeName = node.TryGetProperty("name", out var nameEl) ? nameEl.GetString() ?? "" : "";

                // copy all properties first (parameters, type, id, etc.)
                foreach (var prop in node.EnumerateObject())
                {
                    // We'll replace credentials/parameters later
                    if (prop.Name == "credentials" || prop.Name == "parameters")
                        continue;

                    nodeDict[prop.Name] = prop.Value;
                }

                // --- CREDENTIALS handling: resolvers for many formats ---
                if (node.TryGetProperty("credentials", out var credsProp) && credsProp.ValueKind == JsonValueKind.Object)
                {
                    var updatedCreds = new Dictionary<string, object>(StringComparer.OrdinalIgnoreCase);

                    foreach (var credEntry in credsProp.EnumerateObject())
                    {
                        var credKey = credEntry.Name; // e.g. "smtp", "gmailOAuth2"
                        var credValue = credEntry.Value;

                        _logger.Debug("Processing credential for node. NodeName: {NodeName}, CredKey: {CredKey}",
                            nodeName, credKey);
                        _logger.Debug("Available credential mappings ({Count}): {Mappings}",
                            credentialMappings.Count, string.Join(", ", credentialMappings.Keys));

                        string resolvedN8nId = null;
                        string friendlyName = credKey;

                        // CASE 1: value is an object { id: "...", name: "..." }
                        if (credValue.ValueKind == JsonValueKind.Object)
                        {
                            var idValue = credValue.TryGetProperty("id", out var idProp) ? idProp.GetString() : null;
                            var nameValue = credValue.TryGetProperty("name", out var nameProp) ? nameProp.GetString() : null;
                            friendlyName = !string.IsNullOrWhiteSpace(nameValue) ? nameValue : friendlyName;

                            // If id is placeholder like "{{smtpCredentialId}}", extract and try to map
                            if (!string.IsNullOrWhiteSpace(idValue))
                            {
                                var placeholder = ExtractPlaceholder(idValue);
                                if (!string.IsNullOrEmpty(placeholder) && credentialMappings.TryGetValue(placeholder, out var mapIdFromPlaceholder))
                                {
                                    resolvedN8nId = mapIdFromPlaceholder;
                                }
                                else if (credentialMappings.TryGetValue(idValue, out var mapDirect))
                                {
                                    resolvedN8nId = mapDirect;
                                }
                                else if (credentialMappings.TryGetValue(credKey, out var mapByKey))
                                {
                                    resolvedN8nId = mapByKey;
                                }
                                else if (!string.IsNullOrWhiteSpace(nameValue) && credentialMappings.TryGetValue(nameValue, out var mapByName))
                                {
                                    resolvedN8nId = mapByName;
                                }
                                else
                                {
                                    // fallback: try normalized forms
                                    var normCandidates = GenerateCredentialLookupCandidates(idValue, credKey, nameValue);
                                    resolvedN8nId = FindFirstMappingMatch(normCandidates, credentialMappings);
                                }
                            }
                        }
                        // CASE 2: value is a string (maybe a placeholder)
                        else if (credValue.ValueKind == JsonValueKind.String)
                        {
                            var raw = credValue.GetString();
                            var placeholder = ExtractPlaceholder(raw);
                            if (!string.IsNullOrEmpty(placeholder) && credentialMappings.TryGetValue(placeholder, out var byPlaceholder))
                            {
                                resolvedN8nId = byPlaceholder;
                            }
                            else
                            {
                                // try mapping by credKey or raw string normalized forms
                                var candidates = GenerateCredentialLookupCandidates(raw, credKey, null);
                                resolvedN8nId = FindFirstMappingMatch(candidates, credentialMappings);
                            }
                        }

                        // If still null, try mapping by credentialKey directly
                        if (string.IsNullOrWhiteSpace(resolvedN8nId))
                        {
                            var candidates = GenerateCredentialLookupCandidates(null, credKey, null);
                            resolvedN8nId = FindFirstMappingMatch(candidates, credentialMappings);
                        }

                        // If resolved, set the credential object expected by n8n
                        if (!string.IsNullOrWhiteSpace(resolvedN8nId))
                        {
                            updatedCreds[credKey] = new Dictionary<string, object>
                            {
                                ["id"] = resolvedN8nId,
                                ["name"] = friendlyName
                            };

                            _logger.Information("Successfully mapped credential for node. NodeName: {NodeName}, CredKey: {CredKey}, N8nId: {ResolvedN8nId}",
                                nodeName, credKey, resolvedN8nId);
                        }
                        else
                        {
                            // leave original value (so nothing breaks), but log warning
                            _logger.Warning("Failed to map credential for node. NodeName: {NodeName}, CredKey: {CredKey}, Value: {Value}, AvailableKeys: {AvailableKeys}",
                                nodeName, credKey, credEntry.Value.GetRawText(), string.Join(", ", credentialMappings.Keys));
                            // Keep original value to preserve workflow structure, but it won't work without proper mapping
                            updatedCreds[credKey] = ConvertJsonElementToObject(credEntry.Value);
                        }
                    }

                    if (updatedCreds.Any())
                        nodeDict["credentials"] = updatedCreds;
                }

                // --- PARAMETERS handling: replace template placeholders (if any) using provided `parameters` dictionary ---
                if (node.TryGetProperty("parameters", out var paramsProp) && paramsProp.ValueKind != JsonValueKind.Null)
                {
                    // Convert JsonElement to nested dictionaries with primitive values where possible
                    var updatedParams = ConvertJsonElementToObject(paramsProp);

                    // Recursively replace string placeholders like "={{ $json.fromEmail }}" or exact matches referencing param keys
                    ReplaceParametersRecursive(updatedParams, parameters);

                    nodeDict["parameters"] = updatedParams;
                }

                updatedNodes.Add(nodeDict);
            }

            return updatedNodes;
        }

        /// <summary>
        /// Convert a JsonElement (object / array / primitive) into .NET objects (Dictionary/List/strings/numbers).
        /// Keeps nested structure so it can be serialized later.
        /// </summary>
        private static object ConvertJsonElementToObject(JsonElement el)
        {
            switch (el.ValueKind)
            {
                case JsonValueKind.Object:
                    var dict = new Dictionary<string, object>();
                    foreach (var p in el.EnumerateObject())
                    {
                        dict[p.Name] = ConvertJsonElementToObject(p.Value);
                    }
                    return dict;
                case JsonValueKind.Array:
                    var list = new List<object>();
                    foreach (var item in el.EnumerateArray())
                        list.Add(ConvertJsonElementToObject(item));
                    return list;
                case JsonValueKind.String:
                    return el.GetString();
                case JsonValueKind.Number:
                    if (el.TryGetInt64(out var l)) return l;
                    if (el.TryGetDouble(out var d)) return d;
                    return el.GetRawText();
                case JsonValueKind.True:
                case JsonValueKind.False:
                    return el.GetBoolean();
                case JsonValueKind.Null:
                default:
                    return null;
            }
        }

        /// <summary>
        /// Replace string placeholders in the parameters object recursively with provided parameters.
        /// It will:
        ///  - if a string equals "{{paramName}}" or contains that placeholder, replace it
        ///  - if string contains simple templates like "={{ $json.fromEmail }}" try to replace by key 'fromEmail'
        ///  - if parameter key exists directly as a key, replace exact matches
        /// </summary>
        private static void ReplaceParametersRecursive(object obj, Dictionary<string, string> parameters)
        {
            if (obj is Dictionary<string, object> dict)
            {
                var keys = dict.Keys.ToList();
                foreach (var k in keys)
                {
                    var v = dict[k];
                    if (v is string s)
                    {
                        var replaced = ReplacePlaceholdersInString(s, parameters);
                        dict[k] = replaced;
                    }
                    else
                    {
                        ReplaceParametersRecursive(v, parameters);
                    }
                }
            }
            else if (obj is List<object> list)
            {
                for (int i = 0; i < list.Count; i++)
                {
                    var v = list[i];
                    if (v is string s)
                    {
                        list[i] = ReplacePlaceholdersInString(s, parameters);
                    }
                    else
                    {
                        ReplaceParametersRecursive(v, parameters);
                    }
                }
            }
        }

        private static string ReplacePlaceholdersInString(string s, Dictionary<string, string> parameters)
        {
            if (string.IsNullOrEmpty(s)) return s;

            // exact placeholder {{param}}
            var exactMatch = Regex.Match(s, @"^\{\{\s*([^\}]+)\s*\}\}$");
            if (exactMatch.Success)
            {
                var key = exactMatch.Groups[1].Value.Trim();
                if (parameters.TryGetValue(key, out var val))
                    return val;
                // try relaxed key
                var relaxed = NormalizeKey(key);
                if (parameters.TryGetValue(relaxed, out var val2))
                    return val2;
                return s;
            }

            // n8n expression patterns like "={{ $json.fromEmail }}" -> extract fromEmail
            var n8nExpr = Regex.Match(s, @"\$json(?:\.[\s""]*([A-Za-z0-9_]+)[\s""]*)");
            if (n8nExpr.Success)
            {
                var key = n8nExpr.Groups[1].Value;
                if (parameters.TryGetValue(key, out var val))
                    return val;
            }

            // Replace any {{key}} occurrences inside the string
            var replaced = Regex.Replace(s, @"\{\{\s*([^\}]+)\s*\}\}", (m) =>
            {
                var inner = m.Groups[1].Value.Trim();
                if (parameters.TryGetValue(inner, out var v)) return v;
                var relaxed = NormalizeKey(inner);
                if (parameters.TryGetValue(relaxed, out var v2)) return v2;
                return m.Value; // keep original if not found
            });

            return replaced;
        }

        private static string ExtractPlaceholder(string raw)
        {
            if (string.IsNullOrWhiteSpace(raw)) return null;

            var m = Regex.Match(raw, @"\{\{\s*([^\}]+)\s*\}\}");
            if (m.Success)
                return m.Groups[1].Value.Trim();

            // plain pattern like smtpCredentialId or smtpCredentialId inside strings
            return raw;
        }

        private static string NormalizeKey(string key)
        {
            if (string.IsNullOrWhiteSpace(key)) return key;
            return Regex.Replace(key.ToLowerInvariant(), @"[^a-z0-9]", "");
        }

        private static IEnumerable<string> GenerateCredentialLookupCandidates(string raw, string credKey, string nameValue)
        {
            var set = new LinkedHashSet<string>();

            if (!string.IsNullOrWhiteSpace(raw)) set.Add(raw);
            if (!string.IsNullOrWhiteSpace(credKey)) set.Add(credKey);
            if (!string.IsNullOrWhiteSpace(nameValue)) set.Add(nameValue);

            if (!string.IsNullOrWhiteSpace(raw)) set.Add(raw.ToLowerInvariant());
            if (!string.IsNullOrWhiteSpace(credKey)) set.Add(credKey.ToLowerInvariant());
            if (!string.IsNullOrWhiteSpace(nameValue)) set.Add(nameValue.ToLowerInvariant());

            if (!string.IsNullOrWhiteSpace(raw)) set.Add(Regex.Replace(raw.ToLowerInvariant(), @"\s+", ""));
            if (!string.IsNullOrWhiteSpace(credKey)) set.Add(Regex.Replace(credKey.ToLowerInvariant(), @"\s+", ""));
            if (!string.IsNullOrWhiteSpace(nameValue)) set.Add(Regex.Replace(nameValue.ToLowerInvariant(), @"\s+", ""));

            // short type derivation
            var candType = DeriveShortCredentialType(credKey) ?? DeriveShortCredentialType(nameValue);
            if (!string.IsNullOrWhiteSpace(candType)) set.Add(candType);

            // placeholders variants
            if (!string.IsNullOrWhiteSpace(candType))
            {
                set.Add($"{candType}CredentialId");
                set.Add($"{candType}Id");
                set.Add($"{candType}credentialid");
                set.Add($"{candType}id");
            }

            // return distinct preserving insertion order
            return set;
        }

        private static string FindFirstMappingMatch(IEnumerable<string> candidates, Dictionary<string, string> credentialMappings)
        {
            foreach (var c in candidates)
            {
                if (string.IsNullOrWhiteSpace(c)) continue;

                if (credentialMappings.TryGetValue(c, out var id)) return id;

                var norm = NormalizeKey(c);
                if (credentialMappings.TryGetValue(norm, out var id2)) return id2;
                if (credentialMappings.TryGetValue(c.ToLowerInvariant(), out var id3)) return id3;
            }
            return null;
        }

        private static string DeriveShortCredentialType(string input)
        {
            if (string.IsNullOrWhiteSpace(input)) return null;
            var lower = input.ToLowerInvariant();
            if (lower.Contains("smtp") || lower.Contains("email")) return "smtp";
            if (lower.Contains("oauth")) return "oauth2";
            if (lower.Contains("gmail") || lower.Contains("google")) return "oauth2";
            if (lower.Contains("api") || lower.Contains("apikey")) return "api";
            if (lower.Contains("http") && lower.Contains("basic")) return "httpBasicAuth";
            if (lower.Contains("http") && lower.Contains("header")) return "httpHeaderAuth";
            var cleaned = Regex.Replace(lower, @"[^a-z0-9]", "");
            return cleaned.Length > 0 ? cleaned : null;
        }

        // Small helper: LinkedHashSet implementation (preserve insertion order)
        private class LinkedHashSet<T> : ICollection<T>
        {
            private readonly List<T> _list = new List<T>();
            private readonly HashSet<T> _set = new HashSet<T>();

            public int Count => _set.Count;
            public bool IsReadOnly => false;
            public void Add(T item) { if (_set.Add(item)) _list.Add(item); }
            public void Clear() { _set.Clear(); _list.Clear(); }
            public bool Contains(T item) => _set.Contains(item);
            public void CopyTo(T[] array, int arrayIndex) => _list.CopyTo(array, arrayIndex);
            public IEnumerator<T> GetEnumerator() => _list.GetEnumerator();
            System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator() => _list.GetEnumerator();
            public bool Remove(T item) { if (_set.Remove(item)) return _list.Remove(item); return false; }
        }
    }
}
