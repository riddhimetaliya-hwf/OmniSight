# Insert-WorkflowTemplates.ps1
# PowerShell script to insert workflow JSON files into workflow_templates table

param(
    [string]$WorkflowsPath = "D:\omnisight\OmniSight-Client\workflows",
    [string]$ServerName = "(localdb)\MSSQLLocalDB",
    [string]$DatabaseName = "OmniSight"
)

# Function to test SQL connection
function Test-SqlConnection {
    param($ConnectionString)
    
    try {
        $connection = New-Object System.Data.SqlClient.SqlConnection($ConnectionString)
        $connection.Open()
        $isConnected = $connection.State -eq 'Open'
        $connection.Close()
        return $isConnected
    } catch {
        return $false
    }
}

# Function to generate GUID
function New-GuidNoDashes {
    return [System.Guid]::NewGuid().ToString("N")
}

# Function to extract required credentials from workflow nodes
function Get-RequiredCredentials {
    param($Nodes)
    
    $credentials = @()
    foreach ($node in $Nodes) {
        if ($node.credentials -and $node.credentials.PSObject.Properties.Count -gt 0) {
            foreach ($credType in $node.credentials.PSObject.Properties.Name) {
                if ($credType -notin $credentials) {
                    $credentials += $credType
                }
            }
        }
    }
    if ($credentials.Count -eq 0) {
        return "[]"
    }
    return ($credentials | ConvertTo-Json -Compress)
}

# Function to extract integrations from workflow nodes
function Get-Integrations {
    param($Nodes)
    
    $integrations = @()
    foreach ($node in $Nodes) {
        if ($node.type) {
            $integrationType = $node.type -replace '^n8n-nodes-base\.', ''
            if ($integrationType -notin $integrations -and $integrationType -ne 'manualTrigger' -and $integrationType -ne 'scheduleTrigger') {
                $integrations += $integrationType
            }
        }
    }
    if ($integrations.Count -eq 0) {
        return "[]"
    }
    return ($integrations | ConvertTo-Json -Compress)
}

# Function to determine category from workflow name and content
function Get-WorkflowCategory {
    param($WorkflowName, $Nodes)
    
    $categories = @{
        'bitcoin' = 'crypto'
        'crypto' = 'crypto'
        'price' = 'finance'
        'alert' = 'monitoring'
        'covid' = 'health'
        'stats' = 'analytics'
        'ai' = 'ai'
        'gemini' = 'ai'
        'openai' = 'ai'
        'chat' = 'ai'
        'assistant' = 'ai'
        'content' = 'marketing'
        'research' = 'research'
        'slack' = 'communication'
        'email' = 'communication'
        'monitor' = 'monitoring'
    }
    
    $nameLower = $WorkflowName.ToLower()
    foreach ($keyword in $categories.Keys) {
        if ($nameLower -like "*$keyword*") {
            return $categories[$keyword]
        }
    }
    
    return "automation"
}

# Function to get icon based on category
function Get-WorkflowIcon {
    param($Category)
    
    $icons = @{
        'crypto' = 'crypto'
        'finance' = 'finance'
        'health' = 'health'
        'analytics' = 'analytics'
        'ai' = 'ai'
        'marketing' = 'marketing'
        'research' = 'research'
        'communication' = 'communication'
        'monitoring' = 'monitoring'
        'automation' = 'automation'
    }
    
    if ($icons.ContainsKey($Category)) {
        return $icons[$Category]
    } else {
        return 'automation'
    }
}

# 🆕 NEW FUNCTION: Check if workflow already exists in database
function Test-WorkflowExists {
    param(
        [string]$WorkflowName,
        [string]$WorkflowJson,
        [System.Data.SqlClient.SqlConnection]$Connection
    )
    
    try {
        # Method 1: Check by name (exact match)
        $queryByName = "SELECT COUNT(*) FROM [OmniSight].[dbo].[workflow_templates] WHERE [name] = @Name"
        $commandByName = New-Object System.Data.SqlClient.SqlCommand($queryByName, $Connection)
        $commandByName.Parameters.AddWithValue("@Name", $WorkflowName) | Out-Null
        $countByName = [int]$commandByName.ExecuteScalar()
        
        if ($countByName -gt 0) {
            Write-Host "DUPLICATE: Workflow with name '$WorkflowName' already exists" -ForegroundColor Yellow
            return $true
        }
        
        # Method 2: Check by content hash (optional - more strict duplicate detection)
        $contentHash = (Get-FileHash -InputStream ([System.IO.MemoryStream]::new([System.Text.Encoding]::UTF8.GetBytes($WorkflowJson))) -Algorithm MD5).Hash
        
        $queryByHash = @"
        SELECT COUNT(*) FROM [OmniSight].[dbo].[workflow_templates] 
        WHERE HASHBYTES('MD5', [template_json]) = HASHBYTES('MD5', @JsonContent)
"@
        $commandByHash = New-Object System.Data.SqlClient.SqlCommand($queryByHash, $Connection)
        $commandByHash.Parameters.AddWithValue("@JsonContent", $WorkflowJson) | Out-Null
        $countByHash = [int]$commandByHash.ExecuteScalar()
        
        if ($countByHash -gt 0) {
            Write-Host "DUPLICATE: Workflow with identical content already exists" -ForegroundColor Yellow
            return $true
        }
        
        return $false
        
    } catch {
        Write-Host "WARNING: Could not check for duplicates: $($_.Exception.Message)" -ForegroundColor Yellow
        return $false
    }
}

# Function to insert workflow template into database
function Insert-WorkflowTemplate {
    param(
        [string]$FilePath,
        [System.Data.SqlClient.SqlConnection]$Connection
    )
    
    try {
        $jsonContent = Get-Content -Path $FilePath -Raw -Encoding UTF8
        $workflowData = $jsonContent | ConvertFrom-Json
        
        $fileName = [System.IO.Path]::GetFileNameWithoutExtension($FilePath)
        $name = $workflowData.name
        
        # �NEW: Check for duplicates before insertion
        if (Test-WorkflowExists -WorkflowName $name -WorkflowJson $jsonContent -Connection $Connection) {
            Write-Host "SKIPPED: Duplicate workflow '$name' - not imported" -ForegroundColor Yellow
            return $null
        }
        
        $templateId = New-GuidNoDashes
        
        if ($workflowData.PSObject.Properties.Name -contains "description") { 
            $description = $workflowData.description 
        } else { 
            $description = "Automated workflow: $name" 
        }
        
        $category = Get-WorkflowCategory -WorkflowName $name -Nodes $workflowData.nodes
        $requiredCredentials = Get-RequiredCredentials -Nodes $workflowData.nodes
        $integrations = Get-Integrations -Nodes $workflowData.nodes
        $icon = Get-WorkflowIcon -Category $category
        
        $query = @"
INSERT INTO [OmniSight].[dbo].[workflow_templates] (
    [id], [name], [description], [category], [template_json],
    [required_credentials], [integrations], [icon], 
    [is_published], [usage_count], [created_at], [updated_at]
) 
VALUES (
    @Id, @Name, @Description, @Category, @TemplateJson,
    @RequiredCredentials, @Integrations, @Icon,
    @IsPublished, @UsageCount, GETDATE(), GETDATE()
)
"@
        
        $command = New-Object System.Data.SqlClient.SqlCommand($query, $Connection)
        $command.Parameters.AddWithValue("@Id", $templateId) | Out-Null
        $command.Parameters.AddWithValue("@Name", $name) | Out-Null
        $command.Parameters.AddWithValue("@Description", $description) | Out-Null
        $command.Parameters.AddWithValue("@Category", $category) | Out-Null
        $command.Parameters.AddWithValue("@TemplateJson", $jsonContent) | Out-Null
        $command.Parameters.AddWithValue("@RequiredCredentials", $requiredCredentials) | Out-Null
        $command.Parameters.AddWithValue("@Integrations", $integrations) | Out-Null
        $command.Parameters.AddWithValue("@Icon", $icon) | Out-Null
        $command.Parameters.AddWithValue("@IsPublished", 1) | Out-Null
        $command.Parameters.AddWithValue("@UsageCount", 0) | Out-Null
        
        $rowsAffected = $command.ExecuteNonQuery()
        
        Write-Host "SUCCESS: Inserted: $name" -ForegroundColor Green
        return $templateId
        
    } catch {
        Write-Host "ERROR: Failed to insert $FilePath : $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# 🆕 NEW FUNCTION: Get existing workflow names from database
function Get-ExistingWorkflowNames {
    param([System.Data.SqlClient.SqlConnection]$Connection)
    
    try {
        $query = "SELECT [name] FROM [OmniSight].[dbo].[workflow_templates]"
        $command = New-Object System.Data.SqlClient.SqlCommand($query, $Connection)
        $reader = $command.ExecuteReader()
        
        $existingNames = @()
        while ($reader.Read()) {
            $existingNames += $reader["name"]
        }
        $reader.Close()
        
        return $existingNames
    } catch {
        Write-Host "WARNING: Could not fetch existing workflow names: $($_.Exception.Message)" -ForegroundColor Yellow
        return @()
    }
}

# Main execution
try {
    Write-Host "STARTING: Workflow template import from: $WorkflowsPath" -ForegroundColor Cyan
    
    # Check if path exists
    if (-not (Test-Path $WorkflowsPath)) {
        Write-Host "ERROR: Path not found: $WorkflowsPath" -ForegroundColor Red
        exit 1
    }
    
    # Get all JSON files
    $jsonFiles = Get-ChildItem -Path $WorkflowsPath -Filter "*.json"
    
    if ($jsonFiles.Count -eq 0) {
        Write-Host "ERROR: No JSON files found in: $WorkflowsPath" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "FOUND: $($jsonFiles.Count) workflow files" -ForegroundColor Yellow
    
    # Try different connection strings
    $connectionStrings = @(
        "Server=$ServerName;Database=$DatabaseName;Trusted_Connection=true;TrustServerCertificate=true;",
        "Server=.;Database=$DatabaseName;Trusted_Connection=true;TrustServerCertificate=true;",
        "Server=(local);Database=$DatabaseName;Trusted_Connection=true;TrustServerCertificate=true;",
        "Server=$ServerName\SQLEXPRESS;Database=$DatabaseName;Trusted_Connection=true;TrustServerCertificate=true;",
        "Server=.\SQLEXPRESS;Database=$DatabaseName;Trusted_Connection=true;TrustServerCertificate=true;"
    )
    
    $connection = $null
    $connectionString = $null
    
    foreach ($connString in $connectionStrings) {
        Write-Host "Testing connection: $connString" -ForegroundColor Gray
        if (Test-SqlConnection -ConnectionString $connString) {
            $connectionString = $connString
            Write-Host "SUCCESS: Connected using: $connString" -ForegroundColor Green
            break
        }
    }
    
    if (-not $connectionString) {
        Write-Host "ERROR: Could not connect to SQL Server. Please check:" -ForegroundColor Red
        Write-Host "1. SQL Server is running" -ForegroundColor Yellow
        Write-Host "2. Database 'OmniSight' exists" -ForegroundColor Yellow
        Write-Host "3. SQL Server Browser service is running" -ForegroundColor Yellow
        Write-Host "4. Try using SQL Server Management Studio to verify connection" -ForegroundColor Yellow
        exit 1
    }
    
    # Create database connection
    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $connection.Open()
    
    Write-Host "CONNECTED: Database connection successful" -ForegroundColor Green
    
    # 🆕 NEW: Get existing workflow names for quick filtering
    $existingWorkflowNames = Get-ExistingWorkflowNames -Connection $connection
    Write-Host "EXISTING: $($existingWorkflowNames.Count) workflows already in database" -ForegroundColor Gray
    
    $insertedCount = 0
    $failedCount = 0
    $skippedCount = 0
    $insertedTemplates = @()
    
    # Process each JSON file
    foreach ($file in $jsonFiles) {
        Write-Host "PROCESSING: $($file.Name)" -ForegroundColor Gray
        
        # 🆕 NEW: Quick pre-check by filename/name to avoid unnecessary processing
        $jsonContent = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        $workflowData = $jsonContent | ConvertFrom-Json
        $workflowName = $workflowData.name
        
        if ($existingWorkflowNames -contains $workflowName) {
            Write-Host "SKIPPED: '$workflowName' already exists in database" -ForegroundColor Yellow
            $skippedCount++
            continue
        }
        
        $templateId = Insert-WorkflowTemplate -FilePath $file.FullName -Connection $connection
        if ($templateId) {
            $insertedCount++
            $insertedTemplates += @{ Name = $file.BaseName; Id = $templateId }
        } else {
            $failedCount++
        }
    }
    
    # Close connection
    $connection.Close()
    
    # Summary
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host "IMPORT SUMMARY" -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host "SUCCESS: $insertedCount" -ForegroundColor Green
    Write-Host "SKIPPED: $skippedCount (duplicates)" -ForegroundColor Yellow
    Write-Host "FAILED: $failedCount" -ForegroundColor Red
    Write-Host "TOTAL: $($jsonFiles.Count)" -ForegroundColor White
    
    if ($insertedTemplates.Count -gt 0) {
        Write-Host "INSERTED TEMPLATES:" -ForegroundColor Cyan
        $insertedTemplates | Format-Table -Property Name, Id -AutoSize
    }
    
} catch {
    Write-Host "SCRIPT ERROR: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    if ($connection -and $connection.State -eq 'Open') {
        $connection.Close()
        Write-Host "CLOSED: Database connection closed" -ForegroundColor Gray
    }
}

Write-Host "COMPLETED: Workflow template import finished!" -ForegroundColor Green