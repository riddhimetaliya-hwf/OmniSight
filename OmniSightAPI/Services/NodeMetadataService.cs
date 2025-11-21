using Dapper;
using Microsoft.Data.SqlClient;
using OmniSightAPI.Models;

namespace OmniSightAPI.Services
{
    public class NodeMetadataService
    {
        private readonly IConfiguration _config;
        private readonly string _connectionString;

        public NodeMetadataService(IConfiguration config)
        {
            _config = config;
            _connectionString = _config.GetConnectionString("DefaultConnection");
        }

        public async Task<List<NodeMetadata>> GetMetadataAsync(string nodeType)
        {
            const string sql = @"
                SELECT * 
                FROM node_metadata
                WHERE node_type = @nodeType
                ORDER BY Id ASC;
            ";

            using var conn = new SqlConnection(_connectionString);

            var result = await conn.QueryAsync<NodeMetadata>(sql, new { nodeType });

            return result.ToList();
        }
    }
}
