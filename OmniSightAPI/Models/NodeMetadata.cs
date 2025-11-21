public class NodeMetadata
{
    public Guid Id { get; set; }
    public string node_type { get; set; }
    public string display_name { get; set; }
    public string category { get; set; }
    public string description { get; set; }
    public int version { get; set; }
    public string inputs { get; set; }
    public string outputs { get; set; }
    public string icon_url { get; set; }
    public string credential_requirements { get; set; }
    public string properties_schema { get; set; }
    public bool is_trigger { get; set; }
    public DateTime created_at { get; set; }
    public DateTime updated_at { get; set; }
}
