# ImportNodeList.ps1
# PowerShell script to create node_metadata table and import nodeList.json data

param(
    [string]$ServerName = "(localdb)\MSSQLLocalDB",
    [string]$DatabaseName = "OmniSight",
    [string]$JsonFilePath = "nodeList.json"
)

# Function to write colored output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Function to test SQL connection
function Test-SqlConnection {
    try {
        $connectionString = "Server=$ServerName;Database=$DatabaseName;Trusted_Connection=true;"
        $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
        $connection.Open()
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Function to execute SQL command
function Invoke-SqlCommand {
    param(
        [string]$Query,
        [string]$ConnectionString
    )
    try {
        $connection = New-Object System.Data.SqlClient.SqlConnection($ConnectionString)
        $connection.Open()
        $command = New-Object System.Data.SqlClient.SqlCommand($Query, $connection)
        $result = $command.ExecuteNonQuery()
        $connection.Close()
        return $result
    }
    catch {
        Write-ColorOutput "Error executing SQL: $($_.Exception.Message)" "Red"
        throw
    }
}

# Function to check if table exists
function Test-TableExists {
    param(
        [string]$TableName,
        [string]$ConnectionString
    )
    try {
        $query = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '$TableName'"
        $connection = New-Object System.Data.SqlClient.SqlConnection($ConnectionString)
        $connection.Open()
        $command = New-Object System.Data.SqlClient.SqlCommand($Query, $connection)
        $result = $command.ExecuteScalar()
        $connection.Close()
        return ($result -gt 0)
    }
    catch {
        return $false
    }
}

# Main execution
try {
    Write-ColorOutput "Starting NodeList Import Process..." "Green"
    Write-ColorOutput "=====================================" "Green"
    
    # Check if JSON file exists
    if (-not (Test-Path $JsonFilePath)) {
        Write-ColorOutput "Error: JSON file not found at $JsonFilePath" "Red"
        exit 1
    }
    
    Write-ColorOutput "JSON file found: $JsonFilePath" "Yellow"
    
    # Test database connection
    Write-ColorOutput "Testing database connection..." "Yellow"
    if (-not (Test-SqlConnection)) {
        Write-ColorOutput "Error: Cannot connect to database $DatabaseName on server $ServerName" "Red"
        Write-ColorOutput "Please ensure:" "Red"
        Write-ColorOutput "1. SQL Server is running" "Red"
        Write-ColorOutput "2. Database '$DatabaseName' exists" "Red"
        Write-ColorOutput "3. You have proper permissions" "Red"
        exit 1
    }
    
    Write-ColorOutput "Database connection successful" "Green"
    
    $connectionString = "Server=$ServerName;Database=$DatabaseName;Trusted_Connection=true;"
    
    # Read JSON file
    Write-ColorOutput "Reading JSON data..." "Yellow"
    $jsonContent = Get-Content $JsonFilePath -Raw | ConvertFrom-Json
    Write-ColorOutput "JSON data loaded successfully" "Green"
    Write-ColorOutput "Found $($jsonContent.Count) nodes to import" "Yellow"
    
    # Create node_metadata table
    Write-ColorOutput "Creating node_metadata table..." "Yellow"
    
    $createTableQuery = @"
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'node_metadata')
BEGIN
    CREATE TABLE node_metadata (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        node_type NVARCHAR(255) NOT NULL,
        display_name NVARCHAR(255) NOT NULL,
        category NVARCHAR(100),
        description NVARCHAR(MAX),
        version INT DEFAULT 1,
        inputs NVARCHAR(MAX),
        outputs NVARCHAR(MAX),
        icon_url NVARCHAR(500),
        credential_requirements NVARCHAR(MAX),
        properties_schema NVARCHAR(MAX),
        is_trigger BIT DEFAULT 0,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
    )
    
    CREATE INDEX IX_node_metadata_type ON node_metadata(node_type);
    CREATE INDEX IX_node_metadata_category ON node_metadata(category);
    
    PRINT 'node_metadata table created successfully'
END
ELSE
BEGIN
    PRINT 'node_metadata table already exists'
END
"@
    
    Invoke-SqlCommand -Query $createTableQuery -ConnectionString $connectionString
    Write-ColorOutput "node_metadata table ready" "Green"
    
    # Clear existing data (optional - remove if you want to keep existing data)
    Write-ColorOutput "Clearing existing data from node_metadata..." "Yellow"
    $clearQuery = "DELETE FROM node_metadata"
    Invoke-SqlCommand -Query $clearQuery -ConnectionString $connectionString
    Write-ColorOutput "Existing data cleared" "Green"
    
    # Import nodes
    Write-ColorOutput "Importing nodes..." "Yellow"
    $importedCount = 0
    
    foreach ($node in $jsonContent) {
        try {
            # Prepare data for insertion
            $nodeType = $node.name -replace "'", "''"
            $displayName = $node.displayName -replace "'", "''"
            $category = if ($node.group -and $node.group.Length -gt 0) { $node.group[0] } else { "Uncategorized" }
            $description = if ($node.description) { $node.description -replace "'", "''" } else { $null }
            $version = if ($node.version) { $node.version } else { 1 }
            
            # Convert arrays to JSON strings
            $inputs = if ($node.inputs) { ($node.inputs | ConvertTo-Json -Compress) -replace "'", "''" } else { "[]" }
            $outputs = if ($node.outputs) { ($node.outputs | ConvertTo-Json -Compress) -replace "'", "''" } else { "[]" }
            
            $iconUrl = if ($node.iconUrl) { $node.iconUrl -replace "'", "''" } else { $null }
            
            # Convert credentials to JSON
            $credentialRequirements = if ($node.credentials) { 
                ($node.credentials | ConvertTo-Json -Compress) -replace "'", "''" 
            } else { "[]" }
            
            # Convert properties to JSON schema
            $propertiesSchema = if ($node.properties) { 
                ($node.properties | ConvertTo-Json -Compress) -replace "'", "''" 
            } else { "[]" }
            
            # Check if it's a trigger node
            $isTrigger = if ($nodeType -like "*trigger*") { 1 } else { 0 }
            
            # Build insert query
            $insertQuery = @"
INSERT INTO node_metadata (
    node_type, display_name, category, description, version,
    inputs, outputs, icon_url, credential_requirements, 
    properties_schema, is_trigger
) VALUES (
    '$nodeType', '$displayName', '$category', 
    $(if($description) { "'$description'" } else { "NULL" }),
    $version,
    '$inputs', '$outputs',
    $(if($iconUrl) { "'$iconUrl'" } else { "NULL" }),
    '$credentialRequirements',
    '$propertiesSchema',
    $isTrigger
)
"@
            
            # Execute insert
            Invoke-SqlCommand -Query $insertQuery -ConnectionString $connectionString
            $importedCount++
            
            Write-ColorOutput "  Imported: $displayName ($nodeType)" "White"
        }
        catch {
            Write-ColorOutput "  Failed to import: $($node.displayName) - $($_.Exception.Message)" "Red"
        }
    }
    
    Write-ColorOutput "=====================================" "Green"
    Write-ColorOutput "Import completed!" "Green"
    Write-ColorOutput "Total nodes processed: $($jsonContent.Count)" "Yellow"
    Write-ColorOutput "Successfully imported: $importedCount" "Green"
    Write-ColorOutput "Failed: $($jsonContent.Count - $importedCount)" "Red"
    
    # Verify import
    Write-ColorOutput "Verifying import..." "Yellow"
    $verifyQuery = "SELECT COUNT(*) as total_count FROM node_metadata"
    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $connection.Open()
    $command = New-Object System.Data.SqlClient.SqlCommand($verifyQuery, $connection)
    $finalCount = $command.ExecuteScalar()
    $connection.Close()
    
    Write-ColorOutput "Total records in node_metadata table: $finalCount" "Green"
    
}
catch {
    Write-ColorOutput "Script execution failed: $($_.Exception.Message)" "Red"
    exit 1
}

Write-ColorOutput "Script completed successfully!" "Green"