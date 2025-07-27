<#
.SYNOPSIS
Core backup operations and utilities
#>

# CONSTANTS
$SCRIPT:CONFIG_PATH = "$PSScriptRoot\..\config\mainConfig.json"

# DEPENDENCIES
Add-Type -AssemblyName System.IO.Compression.FileSystem

function Write-Log {
    <#
    .SYNOPSIS
    Writes a timestamped log message to both the GUI log box and a log file.
    #>
    # ... (keep all existing Write-Log implementation) ...
}

function Convert-ToHashtable {
    <#
    .SYNOPSIS
    Recursively converts a PSCustomObject into a native PowerShell hashtable.
    #>
    # ... (keep all existing implementation) ...
}

function Load-JsonFile {
    <#
    .SYNOPSIS
    Loads a JSON file and converts it into a PowerShell object.
    #>
    # ... (keep all existing implementation) ...
}

function Get-ValidBackupJobs {
    <#
    .SYNOPSIS
    Validates backup jobs and returns both valid jobs and any errors encountered.
    #>
    # ... (keep all existing implementation) ...
}

function Build-BackupJobs {
    <#
    .SYNOPSIS
    Builds a list of backup job objects from GUI input fields.
    #>
    # ... (keep all existing implementation) ...
}

function Invoke-FileCopyOperation {
    <#
    .SYNOPSIS
    Executes a Robocopy file copy operation in either Mirror or Append mode.
    #>
    # ... (keep all existing implementation) ...
}

function Invoke-ZipOperation {
    <#
    .SYNOPSIS
    Performs a zip backup operation with retention and error handling.
    #>
    # ... (keep all existing implementation) ...
}

# ... (include all other core backup functions with their comments) ...

Export-ModuleMember -Function Write-Log, Convert-ToHashtable, Load-JsonFile, Get-ValidBackupJobs, 
    Build-BackupJobs, Invoke-FileCopyOperation, Invoke-ZipOperation # (list all exported functions)