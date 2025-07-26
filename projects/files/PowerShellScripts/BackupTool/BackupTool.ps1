# CLOUD STORAGE BACKUP TOOL #

# CONSTANTS
$CONFIG_PATH = "$PSScriptRoot\config\mainConfig.json"

# ============ DEPENDENCIES ============
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.IO.Compression.FileSystem
# ======================================

# ============ SETTINGS FUNCTIONS ============


function Write-Log {
    <#
    .SYNOPSIS
    Writes a timestamped log message to both the GUI log box and a log file.

    .DESCRIPTION
    This function formats a log message with a timestamp and optional error prefix,
    appends it to a TextBox in the GUI, and writes it to a log file on disk.
    It also performs basic log rotation by keeping only a limited number of recent logs.
    #>

    param (
        [System.Windows.Forms.TextBox]$logBox,  # The GUI log output box
        [string]$message,                       # The log message to write
        [switch]$Error                          # Whether the message is an error
    )

    # Format the log message with timestamp and prefix
    $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $prefix = if ($Error) { "[ERROR]" } else { "[INFO]" }
    $fullMessage = "[$timestamp] $prefix $message"

    # Append the message to the GUI TextBox
    $logBox.AppendText("$fullMessage`r`n")
    $logBox.SelectionStart = $logBox.Text.Length
    $logBox.ScrollToCaret()
    [System.Windows.Forms.Application]::DoEvents()

    # Ensure the log folder exists
    if (-not (Test-Path $logFolder)) {
        New-Item -Path $logFolder -ItemType Directory | Out-Null
    }

    # Append the message to the log file on disk
    Add-Content -Path $logFilePath -Value $fullMessage

    # Perform log rotation (keep only the newest $logs_to_keep log files)
    $allLogs = Get-ChildItem -Path $logFolder -Filter "backup_*.log" | Sort-Object LastWriteTime -Descending
    if ($allLogs.Count -gt $logs_to_keep) {
        $allLogs | Select-Object -Skip $logs_to_keep | Remove-Item -Force
    }
}


function Convert-ToHashtable {
    <#
    .SYNOPSIS
    Recursively converts a PSCustomObject into a native PowerShell hashtable.

    .DESCRIPTION
    This function is used to convert data returned from ConvertFrom-Json (which is typically a PSCustomObject)
    into a native PowerShell hashtable structure. It ensures that nested objects and arrays are also converted,
    allowing full hashtable features like .Keys and .GetEnumerator().
    #>

    param ([object]$InputObject)

    # Handle objects by building a hashtable of their properties
    if ($InputObject -is [System.Management.Automation.PSCustomObject]) {
        $hashtable = @{}
        foreach ($property in $InputObject.PSObject.Properties) {
            $hashtable[$property.Name] = Convert-ToHashtable $property.Value
        }
        return $hashtable
    }

    # Convert collections (e.g., arrays) recursively, excluding strings
    elseif ($InputObject -is [System.Collections.IEnumerable] -and -not ($InputObject -is [string])) {
        return $InputObject | ForEach-Object { Convert-ToHashtable $_ }
    }

    # Return primitive values (e.g., string, int, bool) as-is
    else {
        return $InputObject
    }
}


function Load-JsonFile {
    <#
    .SYNOPSIS
    Loads a JSON file and converts it into a PowerShell object.

    .DESCRIPTION
    This function reads the content of a JSON file from the specified path and converts it 
    into a PowerShell object using ConvertFrom-Json. It is typically used in combination with 
    Convert-ToHashtable when hashtable behavior is needed for enumeration or key access.
    #>

    param (
        [string]$JsonPath
    )

    # Check that the specified JSON file exists
    if (-not (Test-Path $JsonPath)) {
        throw "JSON file not found at $JsonPath"
    }

    # Read the file content and convert the JSON into a PowerShell object
    $raw = Get-Content $JsonPath -Raw | ConvertFrom-Json

    return $raw
}



function Initialize-BackupSettings {
    <#
    .SYNOPSIS
    Loads existing backup settings from file or initializes default settings from cloud provider definitions.

    .DESCRIPTION
    This function attempts to load user-specific backup settings from a JSON file. 
    If the file does not exist, it builds and returns a new settings hashtable using the 
    "Default" values defined in the provided cloud provider definitions.
    #>

    param (
        [string]$settingsPath,  # Path to the user backup settings JSON file
        $providers              # Hashtable of cloud providers (e.g., Google, Dropbox, etc.)
    )
    
    # If the settings file exists, load and return it
    if (Test-Path $settingsPath) {
        return Get-Content $settingsPath -Raw | ConvertFrom-Json
    }
    
    # Otherwise, create new settings based on provider defaults
    $defaults = @{}
    foreach ($key in $providers.Providers.Keys) {
        $defaults[$key] = $providers.Providers[$key].Default
    }

    return $defaults
}


function Save-CurrentSettings {
    <#
    .SYNOPSIS
    Saves current GUI backup settings for each cloud provider to a JSON file.

    .DESCRIPTION
    This function collects user-selected backup configuration values from the GUI controls
    for each defined cloud provider (e.g., source path, destination, zip mode, etc.)
    and saves the resulting settings to a JSON file for persistence between sessions.
    #>

    param (
        $gui,             # The hashtable of GUI controls (TextBoxes, RadioButtons, etc.)
        $providers,       # The loaded cloud provider definitions (must include .Prefix for each)
        $settingsPath     # The output path where backup settings should be saved
    )

    $settings = @{}

    # Loop through each provider and extract values from GUI fields based on the provider's prefix
    foreach ($key in $providers.Providers.Keys) {
        $prefix = $providers.Providers[$key].Prefix

        $settings[$key] = @{
            Source = $gui."Txt${prefix}Source".Text              # Source folder path
            Dest   = $gui."Txt${prefix}Dest".Text                # Destination folder path
            Zip    = $gui."Rdo${prefix}Zip".Checked              # Whether zip backup is selected
            Mirror = $gui."Rdo${prefix}Mirror".Checked           # Whether mirror mode is selected
            Append = $gui."Rdo${prefix}Append".Checked           # Whether append mode is selected
            Name   = $gui."Txt${prefix}ZipName".Text             # Zip filename pattern
            Freq   = $gui."Cmb${prefix}Freq".SelectedItem        # Backup frequency
            Keep   = $gui."Num${prefix}Keep".Value               # Number of zip backups to retain
        }
    }

    # Convert settings to JSON and save to the specified path
    $settings | ConvertTo-Json -Depth 10 | Set-Content -Path $settingsPath
}


# ============ BACKUP OPERATIONS ============

function Get-ValidBackupJobs {
    <#
    .SYNOPSIS
    Validates backup jobs and returns both valid jobs and any errors encountered.

    .DESCRIPTION
    This function iterates through a collection of backup jobs and verifies that required fields
    (such as source and destination paths) are not empty, that the paths exist, and that the destination 
    is allowed according to the provider’s predefined list. It returns a structured object containing
    the list of valid jobs and any validation error messages for display or logging.
    #>

    param (
        $jobs,                # The list of backup jobs (each with keys like Source, Dest, Key)
        $cloud_providers,     # Cloud provider definitions (should contain .Providers[Key].Destinations)
        $logBox               # (Optional) GUI log box - not used here but available for future extension
    )

    $validJobs = @()  # Store jobs that pass all validation checks
    $errors = @()     # Collect error messages for reporting

    foreach ($job in $jobs) {
        # Check for missing provider key
        if (-not $job.Key) {
            $errors += "Job with no provider key skipped."
            continue
        }

        # Check if source or destination is blank
        if ([string]::IsNullOrWhiteSpace($job.Source) -or [string]::IsNullOrWhiteSpace($job.Dest)) {
            $errors += "Job '$($job.Key)': Source or destination is blank."
            continue
        }

        # Split multiple paths
        $sourcePaths = $job.Source -split ';' | Where-Object { $_ -ne '' }

        # Track valid/invalid sources
        $validPaths = @()
        $invalidPaths = @()

        foreach ($path in $sourcePaths) {
            if (Test-Path $path) {
                $validPaths += $path
            } else {
                $invalidPaths += $path
            }
        }

        # If none of the paths exist, flag as an error
        if ($validPaths.Count -eq 0) {
            $errors += "Job '$($job.Key)': None of the source paths exist: $($job.Source)"
            continue
        }

        # (Optional) Warn if only some paths are bad
        if ($invalidPaths.Count -gt 0) {
            Write-Warning "Job '$($job.Key)': Some source paths do not exist: $($invalidPaths -join '; ')"
        }

        # Ensure destination path exists
        if (-not (Test-Path $job.Dest)) {
            $errors += "Job '$($job.Key)': Destination path does not exist: $($job.Dest)"
            continue
        }

        # Ensure destination is among the provider's approved destinations
        $provider = $cloud_providers.Providers[$job.Key]
        $matches = $provider.Destinations | Where-Object { $_ -eq $job.Dest }

        if (-not $matches) {
            $expected = $provider.Destinations -join ", "
            $errors += "Job '$($job.Key)': Destination must include one of: $expected"
            continue
        }

        # Job passed all checks — add to valid list
        $validJobs += $job
    }

    # Return both valid jobs and errors in a structured object
    return [PSCustomObject]@{
        ValidJobs = $validJobs
        Errors    = $errors
    }
}


function Build-BackupJobs {
    <#
    .SYNOPSIS
    Builds a list of backup job objects from GUI input fields.

    .DESCRIPTION
    This function loops through all defined cloud providers and creates a backup job object 
    for each provider where a source path is specified in the GUI. It gathers values from 
    related form controls (e.g., destination path, zip mode, frequency) and assembles them 
    into a structured object that represents a pending backup task.
    #>

    param (
        $gui,               # The GUI control hashtable containing user input fields
        $cloud_providers    # The loaded cloud provider definitions (including .Prefix for each)
    )

    $jobs = @()  # Initialize the job list

    foreach ($key in $cloud_providers.Providers.Keys) {
        $prefix = $cloud_providers.Providers[$key].Prefix
        $source = $gui."Txt${prefix}Source".Text
        
        # Only include jobs where a source path is provided
        if (-not [string]::IsNullOrWhiteSpace($source)) {
            $jobs += [PSCustomObject]@{
                Key       = $key                                   # Cloud provider key (e.g., Google, Dropbox)
                Source    = $source                                # Source folder path for backup
                Dest      = $gui."Txt${prefix}Dest".Text           # Destination folder path
                Zip       = $gui."Rdo${prefix}Zip".Checked         # Whether to perform a zip backup
                Mirror    = $gui."Rdo${prefix}Mirror".Checked      # Whether to mirror files (sync exact copy)
                Append    = $gui."Rdo${prefix}Append".Checked      # Whether to append new files only
                ZipName   = $gui."Txt${prefix}ZipName".Text        # Zip file name pattern
                Frequency = $gui."Cmb${prefix}Freq".SelectedItem   # Backup frequency (e.g., daily, weekly)
                Keep      = $gui."Num${prefix}Keep".Value          # Number of zip backups to retain
            }
        }
    }

    return $jobs
}


function Invoke-FileCopyOperation {
    <#
    .SYNOPSIS
    Executes a Robocopy file copy operation in either Mirror or Append mode, for multiple paths.

    .DESCRIPTION
    This function prepares and launches Robocopy processes to copy files/folders from source(s) 
    to the destination directory. It supports:
    - "Mirror" mode (exact replica with deletions)
    - "Append" mode (add/update only)

    Accepts semicolon-separated paths and handles each one independently.
    #>

    param (
        [string]$source,            # Semicolon-separated source paths
        [string]$dest,              # Destination directory for backup
        [string]$mode,              # "Mirror" or "Append"
        $logBox,                    # TextBox for GUI logging
        $progressBar,               # Progress bar for GUI feedback
        [int]$retries,              # Retry attempts
        [int]$wait,                 # Wait between retries
        [int]$threads               # Robocopy multithread count
    )

    # --- Base robocopy arguments ---
    $baseArgs = @(
        "/Z",                         # Restartable mode
        "/R:$retries",               # Retry count
        "/W:$wait",                  # Wait time
        "/MT:$threads",              # Multithreading
        "/TEE",                      # Output to console and log
        "/NDL",                      # Suppress directory list
        "/NFL"                       # Suppress file list
    )

    # --- Mode-specific arguments ---
    $modeArgs = if ($mode -eq "Mirror") { "/MIR" } else { "/E /XX" }

    # --- Split input source into array ---
    $sourcePaths = $source -split ';'

    foreach ($src in $sourcePaths) {
        if (-not (Test-Path $src)) { continue }

        $isDir = (Get-Item $src).PSIsContainer

        if ($isDir) {
            $destPath = Join-Path $dest (Split-Path $src -Leaf)
            $robocopySource = $src
            $robocopyDest   = $destPath
            $extraArgs = @()
        } else {
            # Mirror parent folder and exclude the file (if Mirror mode)
            $parentDir = Split-Path $src -Parent
            $folderName = Split-Path $parentDir -Leaf
            $destPath = Join-Path $dest $folderName
            $robocopySource = $parentDir
            $robocopyDest   = $destPath
            $extraArgs = if ($mode -eq "Mirror") { @("/IF", "/XF", "`"$src`"") } else { @() }
        }

        $allArgs = @("`"$robocopySource`"", "`"$robocopyDest`"") + $baseArgs + $modeArgs + $extraArgs

        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = "robocopy.exe"
        $psi.Arguments = $allArgs -join " "
        $psi.RedirectStandardOutput = $true
        $psi.UseShellExecute = $false
        $psi.CreateNoWindow = $true

        Write-Log -logBox $logBox -message "Starting $mode operation from $robocopySource to $robocopyDest"

        $process = Start-ProcessWithOutput -processStartInfo $psi -logBox $logBox -progressBar $progressBar

        Write-Log -logBox $logBox -message "$mode operation completed (Exit code: $($process.ExitCode))"
    }
}



function Start-ProcessWithOutput {
    <#
    .SYNOPSIS
    Starts a background process, logs output to the GUI, and updates a progress bar.

    .DESCRIPTION
    This function launches a background process using the specified StartInfo configuration.
    It reads the process's standard output line-by-line, logs each line to a GUI text box,
    and provides visual feedback by incrementally updating a progress bar. It returns the 
    completed process object after execution finishes.
    #>

    param (
        $processStartInfo,   # A fully configured System.Diagnostics.ProcessStartInfo object
        $logBox,             # TextBox control to which output lines will be logged
        $progressBar         # ProgressBar control to visually indicate task progress
    )

    # Create and configure a new Process instance
    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $processStartInfo

    # Start the external process
    $null = $process.Start()

    $count = 0

    # Read output line-by-line and log it to the GUI
    while (-not $process.StandardOutput.EndOfStream) {
        $line = $process.StandardOutput.ReadLine()                          # Read a line of output
        Write-Log -logBox $logBox -message $line                            # Log the output line
        Update-Progress -progressBar $progressBar -value (++$count % 100)  # Animate progress bar
    }

    # Wait for process to exit and finalize progress bar
    $process.WaitForExit()
    Update-Progress -progressBar $progressBar -value 100

    return $process
}


function Update-Progress {
    <#
    .SYNOPSIS
    Updates the GUI progress bar value and refreshes the UI.

    .DESCRIPTION
    This function sets the progress bar to a specified value, ensuring it does not exceed 100%.
    It also processes any pending Windows Forms events using `DoEvents()` to keep the GUI 
    responsive during long-running tasks such as file copying or compression.
    #>

    param (
        $progressBar,        # The Windows Forms ProgressBar control to update
        [int]$value          # The new value to assign to the progress bar
    )

    # Clamp the progress value to a maximum of 100 to prevent UI errors
    $progressBar.Value = [Math]::Min(100, $value)

    # Force the GUI to process pending events and stay responsive
    [System.Windows.Forms.Application]::DoEvents()
}



function Invoke-ZipOperation {
    <#
    .SYNOPSIS
    Performs a zip backup operation with retention and error handling.

    .DESCRIPTION
    This function creates a compressed `.zip` archive of a specified source folder.
    It uses the frequency (e.g., Daily, Weekly) to generate a suffix for the zip filename,
    deletes any existing archive with the same name, and then creates a new one.
    After completion, it enforces a retention policy by limiting the number of zip files
    retained in the destination directory. Errors are logged and shown to the user.
    #>

    param (
        [string]$source,       # The folder to back up
        [string]$dest,         # The folder where the zip should be saved
        [string]$zipName,      # Base name for the zip archive
        [string]$frequency,    # Frequency (Daily, Weekly, Monthly) to determine zip suffix
        [int]$keepCount,       # Number of zip files to retain
        $logBox                # GUI log textbox for status messages
    )

    try {
        # Generate suffix based on frequency (e.g., "2025-07-26-daily")
        $suffix = Get-ZipSuffix -frequency $frequency

        # Combine name and suffix to form full zip file path
        $zipPath = Join-Path $dest "$zipName-$suffix.zip"
        
        # Log the beginning of the zip operation
        Write-Log -logBox $logBox -message "Starting zip operation for $source"

        # Remove an existing zip file with the same name if it exists
        Remove-ExistingZip -zipPath $zipPath -logBox $logBox

        # Create the new zip archive
        Create-ZipArchive -source $source -destination $zipPath

        # Log success
        Write-Log -logBox $logBox -message "Successfully created zip: $zipPath"

        # Apply retention: delete older zip files beyond the keep count
        Manage-BackupRetention -dest $dest -zipName $zipName -keepCount $keepCount -logBox $logBox

    } catch {
        # Log the error and show a message box
        Write-Log -logBox $logBox -message "ERROR during zip operation: $($_.Exception.Message)" -Error
        [System.Windows.Forms.MessageBox]::Show(
            "Zip operation failed: $($_.Exception.Message)", 
            "Error", 
            'OK', 
            'Error'
        )
    }
}


function Get-ZipSuffix {
    <#
    .SYNOPSIS
    Returns a suffix string for zip file names based on backup frequency.

    .DESCRIPTION
    This function generates a string suffix to append to backup zip filenames
    based on the specified frequency. This helps identify and differentiate 
    archives by their scheduling pattern:
    - Daily → 3-letter weekday (e.g., Mon)
    - Weekly → Start date of the current week (Sunday, yyyy-MM-dd)
    - Monthly → 3-letter month abbreviation (e.g., Jan)
    If an unrecognized frequency is provided, it returns a default "Backup" string.
    #>

    param (
        [string]$frequency  # Frequency type: Daily, Weekly, or Monthly
    )

    switch ($frequency) {
        # Use 3-letter day of week for daily backups (e.g., Mon, Tue)
        "Daily"   { return (Get-Date).DayOfWeek.ToString().Substring(0,3) }

        # Use the start date of the current week (Sunday)
        "Weekly"  { return (Get-Date).AddDays(-([int](Get-Date).DayOfWeek)).ToString("yyyy-MM-dd") }

        # Use 3-letter month abbreviation (e.g., Jan, Feb)
        "Monthly" { return (Get-Date).ToString("MMM") }

        # Default fallback if frequency is invalid or missing
        default   { return "Backup" }
    }
}

function Remove-ExistingZip {
    <#
    .SYNOPSIS
    Removes an existing zip file if it already exists.

    .DESCRIPTION
    This function checks whether a zip archive already exists at the specified path.
    If it does, the file is forcefully deleted. This is typically called before creating
    a new backup archive to prevent conflicts or duplicates. The deletion is also logged
    to the GUI via the provided log box.
    #>

    param (
        [string]$zipPath,   # Full path of the zip file to check and remove
        $logBox             # GUI text box for logging messages
    )

    # Check if the zip file already exists
    if (Test-Path $zipPath) {
        # Log the removal
        Write-Log -logBox $logBox -message "Removing existing zip: $zipPath"

        # Forcefully delete the existing zip file
        Remove-Item $zipPath -Force
    }
}


function Create-ZipArchive {
    <#
    .SYNOPSIS
    Creates a zip archive from a source directory using optimal compression.

    .DESCRIPTION
    This function uses .NET's built-in `System.IO.Compression.ZipFile` class to create
    a `.zip` file from the specified source directory. It applies optimal compression
    and does not include the root folder in the archive. The resulting zip is saved to
    the provided destination path.
    #>

    param (
        [string]$source,        # Path to the folder to zip
        [string]$destination    # Full path where the zip archive should be created
    )

    # Create the zip archive using optimal compression
    [System.IO.Compression.ZipFile]::CreateFromDirectory($source, $destination, 'Optimal', $false)
}


function Manage-BackupRetention {
    <#
    .SYNOPSIS
    Enforces a retention policy by deleting older zip backups beyond the keep count.

    .DESCRIPTION
    This function helps manage disk space and backup hygiene by retaining only the most 
    recent N backup zip files in the destination folder. It searches for all zip files 
    that match a specific name pattern (e.g., "BackupName-*.zip"), sorts them by 
    modification date (newest first), and removes any extras beyond the keep count.
    #>

    param (
        [string]$dest,         # Destination folder containing zip backups
        [string]$zipName,      # Base name of the zip files (e.g., "MyBackup")
        [int]$keepCount,       # Number of recent backups to retain
        $logBox                # GUI text box for logging status
    )

    # Get zip files matching the naming pattern, sorted by newest first
    $zips = Get-ChildItem $dest -Filter "$zipName-*.zip" | Sort-Object LastWriteTime -Descending

    # If there are more backups than allowed, remove the oldest ones
    if ($zips.Count -gt $keepCount) {
        $zips | Select-Object -Skip $keepCount | Remove-Item -Force

        # Log the enforcement action
        Write-Log -logBox $logBox -message "Enforced retention policy (kept $keepCount backups)"
    }
}


function Wait-ForSyncCompletion {
    <#
    .SYNOPSIS
    Waits until no recent file changes are detected in the specified paths.

    .DESCRIPTION
    This function monitors one or more directories for ongoing file sync activity,
    such as uploads to cloud storage providers. It checks for recently modified files
    within a specified time window and waits until no such activity is detected across
    all given paths. Logging is provided for each check and upon completion.
    #>

    param (
        $paths,                     # Array of paths to monitor for changes
        $logBox,                    # TextBox control to display sync status updates
        [int]$intervalSeconds,      # Delay between sync status checks (e.g., 3 seconds)
        [int]$waitSeconds           # Look-back time window for "recent" file activity (e.g., 10 seconds)
    )

    # Log the beginning of the sync monitoring process
    Write-Log -logBox $logBox -message "Monitoring sync status..."

    while ($true) {
        $allClear = $true

        foreach ($path in $paths) {
            # Skip this path if it doesn't exist
            if (-not (Test-Path $path)) { continue }

            # Find files recently modified within the defined wait window
            $recent = Get-ChildItem -Path $path -Recurse -Force -ErrorAction SilentlyContinue |
                      Where-Object { $_.LastWriteTime -gt (Get-Date).AddSeconds(-$waitSeconds) }

            # If recent files are found, log and pause before next check
            if ($recent) {
                $allClear = $false
                Write-Log -logBox $logBox -message "Active sync detected in $path"
                break
            }
        }

        # Exit loop if all paths show no recent activity
        if ($allClear) { break }

        # Wait before performing another sync check
        Start-Sleep -Seconds $intervalSeconds
    }

    # Log that sync appears complete
    Write-Log -logBox $logBox -message "All sync operations completed"
}


# ============ USER INTERFACE FUNCTIONS ============

function New-MainForm {
    <#
    .SYNOPSIS
    Creates and returns the main form for the Cloud Backup Tool GUI.

    .DESCRIPTION
    This function initializes the main Windows Forms GUI window for the Cloud Backup Tool.
    It sets the window title, dimensions, starting position, and font based on provided parameters.
    The resulting form object is returned for use in constructing the rest of the GUI.
    #>

    param (
        [int]$formWidth,             # Width of the main form (in pixels)
        [int]$formHeight,            # Height of the main form (in pixels)
        [string]$startPosition,      # Form start position (e.g., 'CenterScreen', 'Manual')
        [string]$defaultFont         # Font to use throughout the form (e.g., 'Microsoft Sans Serif, 8pt')
    )

    # Create a new instance of a Windows Form
    $form = New-Object Windows.Forms.Form

    # Set the form's title text
    $form.Text = "Cloud Backup Tool"

    # Set the form's width and height
    $form.Size = New-Object Drawing.Size($formWidth, $formHeight)

    # Define where the form appears on screen when launched
    $form.StartPosition = $startPosition

    # Set the default font for all controls on the form
    $form.Font = $defaultFont

    # Return the form object for further customization or display
    return $form
}


function New-ProviderTabs {
    <#
    .SYNOPSIS
    Creates a tab control containing one tab per cloud provider.

    .DESCRIPTION
    This function builds a tabbed interface where each tab corresponds to a different cloud provider
    (e.g., Google Drive, Dropbox). Each tab is populated with input controls such as text fields,
    radio buttons, and dropdowns using the provider's prefix and saved user settings.

    A shared control map reference is updated with all control references for later access (e.g., Save/Load).
    #>

    param (
        $providers,                    # Hashtable of cloud provider definitions
        $settings,                     # User backup settings keyed by provider name
        [ref]$controlMap,              # Reference to a hashtable to store control references
        [int]$tabWidth,                # Width of the tab control
        [int]$tabHeight,               # Height of the tab control
        [int]$tabX,                    # X-position of the tab control on the form
        [int]$tabY,                    # Y-position of the tab control on the form
        $providerLayout                # Layout hashtable passed to Add-ProviderControls
    )

    # Create the main tab control container
    $tabControl = New-Object Windows.Forms.TabControl
    $tabControl.Size = New-Object Drawing.Size($tabWidth, $tabHeight)
    $tabControl.Location = New-Object Drawing.Point($tabX, $tabY)

    # Loop through each provider and create a tab
    foreach ($entry in $providers.Providers.GetEnumerator()) {
        $tab = New-Object Windows.Forms.TabPage
        $tab.Text = $entry.Value.Label  # Use label (e.g., "Dropbox", "Google Drive")

        # Populate controls on the tab using provider-specific logic
        $controls = Add-ProviderControls `
            -tab $tab `
            -prefix $entry.Value.Prefix `
            -settings $settings.$($entry.Key) `
            -layout $providerLayout

        # Add the tab to the main control
        $tabControl.TabPages.Add($tab)

        # Store created control references into shared map for later access
        foreach ($key in $controls.Keys) {
            $controlMap.Value[$key] = $controls[$key]
        }
    }

    return $tabControl
}


function Add-ProviderControls {
    <#
    .SYNOPSIS
    Adds all GUI controls for a cloud provider’s backup tab.

    .DESCRIPTION
    This function dynamically generates and adds all necessary GUI elements to a tab page for a specific
    cloud provider, based on its prefix and settings. Controls include source/destination path inputs,
    backup type selectors (zip or file), file mode options (mirror/append), and zip configuration fields.
    
    It returns a hashtable of all created control references, indexed by standardized control names for
    later access by other parts of the application (such as Save/Load logic or backup execution).
    #>

    param (
        $tab,                          # The tab page to populate with controls
        [string]$prefix,               # Provider prefix (used to name controls)
        $settings,                     # Default or loaded user settings for this provider
        [hashtable]$layout             # Layout definitions for spacing and control sizes
    )

    $controls = @{ }
    $y = $layout.XLeftMargin

    # ---- Header Label ----
    $lblHeader = New-Object Windows.Forms.Label
    $lblHeader.Text = $tab.Text
    $lblHeader.Font = $layout.HeaderFont
    $lblHeader.Location = New-Object Drawing.Point($layout.XLeftMargin, $y)
    $lblHeader.Size = New-Object Drawing.Size($layout.HeaderWidth, $layout.HeaderHeight)
    $tab.Controls.Add($lblHeader)
    $y += $layout.YLineSpacing

    # ---- Source and Destination Paths ----
    foreach ($type in @("Source", "Dest")) {
        $isSource = ($type -eq "Source")
        $row = New-LabelTextBrowseRow `
            -label "$($tab.Text) $type" `
            -value $settings.$type `
            -y $y `
            -labelWidth $layout.LabelWidth `
            -textBoxWidth $layout.TextBoxWidth `
            -browseButtonWidth $layout.BrowseButtonWidth `
            -controlHeight $layout.ControlHeight `
            -labelX $layout.LabelX `
            -textBoxX $layout.TextBoxX `
            -buttonX $layout.BrowseButtonX `
            -multiSelect:$isSource

        $tab.Controls.AddRange(@($row.Label, $row.TextBox, $row.Button))
        $controls["Txt${prefix}${type}"] = $row.TextBox
        $y += $layout.YLineSpacing
    }

    # ---- Backup Type Group (Zip/File) ----
    $grpType = New-Object Windows.Forms.GroupBox
    $grpType.Text = "Backup Type"
    $grpType.Location = New-Object Drawing.Point($layout.XLeftMargin, $y)
    $grpType.Size = New-Object Drawing.Size($layout.GroupBoxWidth, $layout.GroupBoxHeight)
    $tab.Controls.Add($grpType)

    $rdoFile = New-Object Windows.Forms.RadioButton
    $rdoFile.Text = "File Backup"
    $rdoFile.Location   = New-Object Drawing.Point($layout.XLeftMargin, $layout.InnerRadioY)
    $grpType.Controls.Add($rdoFile)
    $controls["Rdo${prefix}File"] = $rdoFile

    $rdoZip = New-Object Windows.Forms.RadioButton
    $rdoZip.Text = "Zip Backup"
    $rdoZip.Location    = New-Object Drawing.Point($layout.XLabelOffset, $layout.InnerRadioY)
    $grpType.Controls.Add($rdoZip)
    $controls["Rdo${prefix}Zip"] = $rdoZip
    $y += $layout.GroupBoxHeight + $layout.YSmallSpacing

    # ---- Zip/File Explanation Label ----
    $lblExplain = New-Object Windows.Forms.Label
    $lblExplain.Text = ""
    $lblExplain.Location = New-Object Drawing.Point($layout.XLeftMargin, $y)
    $lblExplain.Size = New-Object Drawing.Size($layout.ExplainLabelWidth, $layout.ExplainLabelHeight)
    $lblExplain.TextAlign = 'TopLeft'
    $lblExplain.ForeColor = $layout.ExplainTextColor
    $tab.Controls.Add($lblExplain)
    $controls["Lbl${prefix}Explain"] = $lblExplain
    $y += $layout.YSmallSpacing

    # ---- File Mode Group (Mirror/Append) ----
    $grpMode = New-Object Windows.Forms.GroupBox
    $grpMode.Text = "File Mode"
    $grpMode.Location = New-Object Drawing.Point($layout.XLeftMargin, $y)
    $grpMode.Size = New-Object Drawing.Size($layout.GroupBoxWidth, $layout.GroupBoxHeight)
    $tab.Controls.Add($grpMode)
    $controls["Grp${prefix}Mode"] = $grpMode

    $rdoMirror = New-Object Windows.Forms.RadioButton
    $rdoMirror.Text = "Mirror"
    $rdoMirror.Location = New-Object Drawing.Point($layout.XLeftMargin, $layout.InnerRadioY)
    $grpMode.Controls.Add($rdoMirror)
    $controls["Rdo${prefix}Mirror"] = $rdoMirror

    $rdoAppend = New-Object Windows.Forms.RadioButton
    $rdoAppend.Text = "Append"
    $rdoAppend.Location = New-Object Drawing.Point($layout.XLabelOffset, $layout.InnerRadioY)
    $grpMode.Controls.Add($rdoAppend)
    $controls["Rdo${prefix}Append"] = $rdoAppend
    $y += $layout.GroupBoxHeight + $layout.YSmallSpacing

    # ---- Mirror/Append Explanation Label ----
    $lblModeExplain = New-Object Windows.Forms.Label
    $lblModeExplain.Text = ""
    $lblModeExplain.Location = New-Object Drawing.Point($layout.XLeftMargin, $y)
    $lblModeExplain.Size = New-Object Drawing.Size($layout.ExplainLabelWidth, $layout.ExplainLabelHeight)
    $lblModeExplain.TextAlign = 'TopLeft'
    $lblModeExplain.ForeColor = $layout.ModeExplainTextColor
    $tab.Controls.Add($lblModeExplain)
    $controls["Lbl${prefix}ModeExplain"] = $lblModeExplain
    $y += $layout.YSmallSpacing

    # ---- Frequency Dropdown ----
    $lblFreq = New-Object Windows.Forms.Label
    $lblFreq.Text = "Frequency:"
    $lblFreq.Location = New-Object Drawing.Point($layout.XLeftMargin, $y)
    $tab.Controls.Add($lblFreq)

    $cmbFreq = New-Object Windows.Forms.ComboBox
    $cmbFreq.Items.AddRange($layout.DefaultFrequencies)
    $cmbFreq.DropDownStyle = 'DropDownList'
    $cmbFreq.SelectedItem = $settings.Freq
    $cmbFreq.Location = New-Object Drawing.Point($layout.XLabelOffset, $y)
    $cmbFreq.Size = New-Object Drawing.Size($layout.ComboBoxWidth, $layout.ControlHeight)
    $tab.Controls.Add($cmbFreq)
    $controls["Cmb${prefix}Freq"] = $cmbFreq
    $y += $layout.YLineSpacing

    # ---- Zip Name ----
    $lblName = New-Object Windows.Forms.Label
    $lblName.Text = "Zip Backup Name:"
    $lblName.Location = New-Object Drawing.Point($layout.XLeftMargin, $y)
    $tab.Controls.Add($lblName)

    $txtName = New-Object Windows.Forms.TextBox
    $txtName.Text = $settings.Name
    $txtName.Location = New-Object Drawing.Point($layout.XLabelOffset, $y)
    $txtName.Size = New-Object Drawing.Size($layout.TextBoxWidth, $layout.ControlHeight)
    $tab.Controls.Add($txtName)
    $controls["Txt${prefix}ZipName"] = $txtName
    $y += $layout.YLineSpacing

    # ---- Zip Retention Count ----
    $lblKeep = New-Object Windows.Forms.Label
    $lblKeep.Text = "Zips to keep:"
    $lblKeep.Location = New-Object Drawing.Point($layout.XLeftMargin, $y)
    $tab.Controls.Add($lblKeep)

    $numKeep = New-Object Windows.Forms.NumericUpDown
    $numKeep.Value = if ($settings.Keep) { $settings.Keep } else { $layout.DefaultKeepCount }
    $numKeep.Location = New-Object Drawing.Point($layout.XLabelOffset, $y)
    $numKeep.Size = New-Object Drawing.Size($layout.NumericWidth, $layout.ControlHeight)
    $tab.Controls.Add($numKeep)
    $controls["Num${prefix}Keep"] = $numKeep

    # ---- Configure Initial State and Behaviors ----
    $zipControls = @($lblFreq, $cmbFreq, $lblName, $txtName, $lblKeep, $numKeep)
    $rdoFile.Tag = @{ Label = $lblExplain; ZipControls = $zipControls; ModeGroup = $grpMode; ModeLabel = $lblModeExplain }
    $rdoZip.Tag = $rdoFile.Tag

    if ($settings.Zip) {
        $rdoZip.Checked = $true
        $grpMode.Visible = $false
        $lblExplain.Text = "Zip Backup:`nCompresses the source folder into a zip archive and stores it."
        $zipControls | ForEach-Object { $_.Visible = $true }
    } else {
        $rdoFile.Checked = $true
        $grpMode.Visible = $true
        $lblExplain.Text = "File Backup:`nUses Robocopy to mirror or append files to the destination folder."
        $zipControls | ForEach-Object { $_.Visible = $false }

        if ($settings.Mirror) {
            $rdoMirror.Checked = $true
            $lblModeExplain.Text = "Mirror:`nDestination will exactly match the source (files deleted if missing in source)."
        } else {
            $rdoAppend.Checked = $true
            $lblModeExplain.Text = "Append:`nAdds new files and overwrites changed ones without deleting anything in the destination."
        }
    }

    # ---- Event Handlers for Zip/File Selection ----
    $rdoFile.Add_CheckedChanged({
        if ($this.Checked) {
            $this.Tag.Label.Text = "File Backup:`nUses Robocopy to mirror or append files to the destination folder."
            $this.Tag.ModeGroup.Visible = $true
            $this.Tag.ModeLabel.Visible = $true
            $this.Tag.ZipControls | ForEach-Object { $_.Visible = $false }
        }
    })

    $rdoZip.Add_CheckedChanged({
        if ($this.Checked) {
            $zipName = $this.Tag.ZipControls | Where-Object { $_ -is [System.Windows.Forms.TextBox] } | Select-Object -First 1
            $freqBox = $this.Tag.ZipControls | Where-Object { $_ -is [System.Windows.Forms.ComboBox] } | Select-Object -First 1
            $keepBox = $this.Tag.ZipControls | Where-Object { $_ -is [System.Windows.Forms.NumericUpDown] } | Select-Object -First 1

            $name = if ($zipName) { $zipName.Text } else { "<name>" }
            $freq = if ($freqBox) { $freqBox.SelectedItem } else { "Daily" }
            $keep = if ($keepBox) { $keepBox.Value } else { $layout.DefaultKeepCount }

            $suffix = switch ($freq) {
                "Daily"   { (Get-Date).DayOfWeek.ToString().Substring(0,3) }
                "Weekly"  { (Get-Date).AddDays(-([int](Get-Date).DayOfWeek)).ToString("yyyy-MM-dd") }
                "Monthly" { (Get-Date).ToString("MMM") }
            }

            $this.Tag.Label.Text = "Zip Backup:`nThis will overwrite the file '$name-$suffix.zip' in the destination folder.`nLatest $keep backup$(if ($keep -ne 1) {'s'} else {''}) will be kept."
            $this.Tag.ModeGroup.Visible = $false
            $this.Tag.ModeLabel.Visible = $false
            $this.Tag.ZipControls | ForEach-Object { $_.Visible = $true }
        }
    })

    # ---- File Mode Description Update ----
    $rdoMirror.Tag = $lblModeExplain
    $rdoMirror.Add_CheckedChanged({
        if ($this.Checked) {
            $this.Tag.Text = "Mirror:`nDestination will exactly match the source (files deleted if missing in source)."
        }
    })

    $rdoAppend.Tag = $lblModeExplain
    $rdoAppend.Add_CheckedChanged({
        if ($this.Checked) {
            $this.Tag.Text = "Append:`nAdds new files and overwrites changed ones without deleting anything in the destination."
        }
    })

    return $controls
}


function Show-MultiFolderFilePicker {
    Add-Type -AssemblyName System.Windows.Forms
    Add-Type -AssemblyName System.Drawing

    $form = New-Object Windows.Forms.Form
    $form.Text = "Select Files and Folders"
    $form.Size = New-Object Drawing.Size(600, 500)
    $form.StartPosition = "CenterScreen"

    $treeView = New-Object Windows.Forms.TreeView
    $treeView.CheckBoxes = $true
    $treeView.Location = New-Object Drawing.Point(10, 10)
    $treeView.Size = New-Object Drawing.Size(560, 410)
    $form.Controls.Add($treeView)

    # OK Button
    $btnOK = New-Object Windows.Forms.Button
    $btnOK.Text = "OK"
    $btnOK.Location = New-Object Drawing.Point(390, 430)
    $btnOK.Anchor = 'Bottom,Right'
    $btnOK.Add_Click({
        $form.DialogResult = 'OK'
        $form.Close()
    })
    $form.Controls.Add($btnOK)

    # Cancel Button
    $btnCancel = New-Object Windows.Forms.Button
    $btnCancel.Text = "Cancel"
    $btnCancel.Location = New-Object Drawing.Point(480, 430)
    $btnCancel.Anchor = 'Bottom,Right'
    $btnCancel.Add_Click({
        $form.DialogResult = 'Cancel'
        $form.Close()
    })
    $form.Controls.Add($btnCancel)

    # Lazy-load child folders
    function Load-TreeChildren {
        param($node)
        $path = $node.Tag
        try {
            $node.Nodes.Clear()  # clear dummy

            Get-ChildItem -Path $path -Directory -Force -ErrorAction SilentlyContinue | ForEach-Object {
                $child = New-Object Windows.Forms.TreeNode
                $child.Text = $_.Name
                $child.Tag = $_.FullName
                $child.Nodes.Add('Loading...') | Out-Null
                $node.Nodes.Add($child)
            }

            Get-ChildItem -Path $path -File -Force -ErrorAction SilentlyContinue | ForEach-Object {
                $file = New-Object Windows.Forms.TreeNode
                $file.Text = $_.Name
                $file.Tag = $_.FullName
                $node.Nodes.Add($file)
            }
        } catch {}
    }

    $treeView.add_BeforeExpand({
        param($s, $e)
        $node = $e.Node
        if ($node.Nodes.Count -eq 1 -and $node.Nodes[0].Text -eq 'Loading...') {
            Load-TreeChildren $node
        }
    })

    # Root drives - Fixed this part to properly set the Tag property
    [System.IO.DriveInfo]::GetDrives() | Where-Object { $_.IsReady } | ForEach-Object {
        $root = New-Object Windows.Forms.TreeNode
        $root.Text = $_.Name
        $root.Tag = $_.RootDirectory.FullName  # This is the critical fix
        $root.Nodes.Add('Loading...') | Out-Null
        $treeView.Nodes.Add($root)
    }

    # Get checked items
    function Get-CheckedPaths {
        param($nodes)
        $all = @()
        foreach ($node in $nodes) {
            if ($node.Checked -and $node.Tag -and ($node.Tag -is [string])) {
                $all += $node.Tag
            }
            if ($node.Nodes.Count -gt 0) {
                $all += Get-CheckedPaths $node.Nodes
            }
        }
        return $all
    }

    # Show form and return checked paths
    $result = $form.ShowDialog()
    if ($result -eq [System.Windows.Forms.DialogResult]::OK) {
        return Get-CheckedPaths $treeView.Nodes
    } else {
        return @()
    }
}


function New-LabelTextBrowseRow {
    <#
    .SYNOPSIS
    Creates a labeled text box with a browse button for folder selection.

    .DESCRIPTION
    Generates a row of GUI controls including a label, a text box (pre-filled with a given value),
    and a browse button that opens a folder browser dialog. The browse button is linked to update
    the text box with the selected folder path.

    This function returns a hashtable containing references to the label, textbox, and button, so
    they can be inserted into a layout or stored for future access.
    #>

    param (
        [string]$label,             # The label text to display beside the textbox
        [string]$value,             # Initial text value for the textbox
        [int]$y,                    # Vertical Y position for this row
        [int]$labelWidth,           # Width of the label control
        [int]$textBoxWidth,         # Width of the textbox control
        [int]$browseButtonWidth,    # Width of the browse button control
        [int]$controlHeight,        # Height for all controls in this row
        [int]$labelX,               # X position of the label
        [int]$textBoxX,             # X position of the textbox
        [int]$buttonX,               # X position of the browse button
        [bool]$multiSelect = $true
    )

    # ---- Create the Label ----
    $lbl = New-Object Windows.Forms.Label
    $lbl.Text = "${label}:"
    $lbl.Location = New-Object Drawing.Point($labelX, $y)
    $lbl.Size = New-Object Drawing.Size($labelWidth, $controlHeight)

    # ---- Create the TextBox ----
    $txtBox = New-Object Windows.Forms.TextBox
    $txtBox.Text = $value
    $txtBox.Location = New-Object Drawing.Point($textBoxX, $y)
    $txtBox.Size = New-Object Drawing.Size($textBoxWidth, $controlHeight)

    # ---- Create the Browse Button ----
    $btn = New-Object Windows.Forms.Button
    $btn.Text = "Browse"
    $btn.Location = New-Object Drawing.Point($buttonX, $y)
    $btn.Size = New-Object Drawing.Size($browseButtonWidth, $controlHeight)
    $btn.Tag = @{ TextBox = $txtBox; Multi = $multiSelect }

    # ---- On Click: Open Folder Dialog and Update TextBox ---     
    $btn.Add_Click({
        $txtBox = $this.Tag["TextBox"]
        $useMulti = $this.Tag["Multi"]

        if ($useMulti) {
            $paths = Show-MultiFolderFilePicker
            if ($paths.Count -gt 0) {
                # Filter out any non-string or empty paths
                $validPaths = $paths | Where-Object { $_ -and ($_ -is [string]) -and $_.Trim() }
                if ($validPaths.Count -gt 0) {
                    $txtBox.Text = ($validPaths -join ';')
                }
            }
        } else {
            $folder = Browse-Folder -initialPath $txtBox.Text
            if ($folder) { $txtBox.Text = $folder }
        }
    })
    return @{ Label = $lbl; TextBox = $txtBox; Button = $btn }
}


function Browse-Folder {
    <#
    .SYNOPSIS
    Opens a folder browser dialog and returns the selected path.

    .DESCRIPTION
    This function creates and displays a standard Windows folder browser dialog,
    allowing the user to select a directory. If an initial path is provided and
    exists, the dialog will open to that location. The selected folder path is
    returned if the user confirms; otherwise, $null is returned.
    #>

    param (
        $initialPath  # Optional starting folder for the dialog
    )

    # ---- Create the Folder Browser Dialog ----
    $dialog = New-Object System.Windows.Forms.FolderBrowserDialog

    # ---- Set initial folder if path is valid ----
    if ($initialPath -and (Test-Path $initialPath)) {
        $dialog.SelectedPath = $initialPath
    }

    # ---- Show the dialog and return the selected path if confirmed ----
    if ($dialog.ShowDialog() -eq "OK") {
        return $dialog.SelectedPath
    }

    # ---- Return null if the user cancelled ----
    return $null
}


function New-ProgressBar {
    <#
    .SYNOPSIS
    Creates and returns a progress bar positioned below the tab control.

    .DESCRIPTION
    This function initializes a new Windows Forms progress bar at a specified location
    with defined width and height. It is typically used to visually indicate progress 
    during file copy or zip operations in the Cloud Backup Tool.
    #>

    param (
        [int]$x,       # X position of the progress bar
        [int]$y,       # Y position (usually beneath tab control)
        [int]$width,   # Width of the progress bar
        [int]$height   # Height of the progress bar
    )

    # ---- Create and configure the progress bar control ----
    $progressBar = New-Object Windows.Forms.ProgressBar

    $progressBar.Location = New-Object Drawing.Point($x, $y)
    $progressBar.Size     = New-Object Drawing.Size($width, $height)

    # Set progress range from 0 to 100%
    $progressBar.Minimum = 0
    $progressBar.Maximum = 100

    return $progressBar
}


function New-LogBox {
    <#
    .SYNOPSIS
    Creates and returns a read-only multi-line text box for displaying log output.

    .DESCRIPTION
    This function initializes a Windows Forms TextBox configured for multiline log output.
    It supports vertical scrolling, custom colors, and fonts, and is read-only to prevent user edits.
    Intended for use in the GUI as a live log display during backup operations.
    #>

    param (
        [int]$x,                  # X position (usually aligned with tab control)
        [int]$y,                  # Y position of the log box
        [int]$width,              # Width of the log box
        [int]$height,             # Height of the log box
        [string]$backColor,       # Background color (e.g., 'Black')
        [string]$foreColor,       # Foreground/text color (e.g., 'White')
        [string]$font             # Font specification (e.g., 'Consolas, 9pt')
    )

    # ---- Create and configure the log output box ----
    $logBox = New-Object Windows.Forms.TextBox

    $logBox.Multiline  = $true                  # Allow multiple lines
    $logBox.ScrollBars = "Vertical"             # Add vertical scrollbar
    $logBox.ReadOnly   = $true                  # Prevent user editing

    # ---- Apply appearance settings ----
    $logBox.BackColor = $backColor              # Set background color
    $logBox.ForeColor = $foreColor              # Set text color
    $logBox.Font      = $font                   # Set font

    # ---- Position and size ----
    $logBox.Location = New-Object Drawing.Point($x, $y)
    $logBox.Size     = New-Object Drawing.Size($width, $height)

    return $logBox
}


function New-Buttons {
    <#
    .SYNOPSIS
    Creates and returns Cancel, Backup, and Backup & Shutdown buttons centered at the bottom of the form.

    .DESCRIPTION
    This function calculates button positions based on form width and provided dimensions, then
    generates three Windows Forms buttons: Cancel, Backup, and Backup & Shutdown. These buttons
    are returned as a hashtable so event handlers can be assigned elsewhere in the application.
    #>

    param (
        [int]$formWidth,        # Total width of the main form (used to center the button group)
        [int]$buttonHeight,     # Height of each button
        [int]$startY,           # Y-position of the button row
        [int]$cancelWidth,      # Width of the Cancel button
        [int]$backupWidth,      # Width of the Backup button
        [int]$shutdownWidth,    # Width of the Backup & Shutdown button
        [int]$spacing           # Horizontal space between buttons
    )

    # ---- Calculate total width of all buttons plus spacing ----
    $totalWidth = $cancelWidth + $spacing + $backupWidth + $spacing + $shutdownWidth

    # ---- Center button group on the form ----
    $startX = [math]::Floor(($formWidth - $totalWidth) / 2)

    # ---- Create Cancel button ----
    $btnCancel = New-Object Windows.Forms.Button
    $btnCancel.Text = "Cancel"
    $btnCancel.Size = New-Object Drawing.Size($cancelWidth, $buttonHeight)
    $btnCancel.Location = New-Object Drawing.Point($startX, $startY)

    # ---- Create Backup button ----
    $btnBackup = New-Object Windows.Forms.Button
    $btnBackup.Text = "Backup"
    $btnBackup.Size = New-Object Drawing.Size($backupWidth, $buttonHeight)
    $btnBackup.Location = New-Object Drawing.Point(($startX + $cancelWidth + $spacing), $startY)

    # ---- Create Backup & Shutdown button ----
    $btnShutdown = New-Object Windows.Forms.Button
    $btnShutdown.Text = "Backup && Shutdown"
    $btnShutdown.Size = New-Object Drawing.Size($shutdownWidth, $buttonHeight)
    $btnShutdown.Location = New-Object Drawing.Point(
        ($startX + $cancelWidth + $spacing + $backupWidth + $spacing),
        $startY
    )

    # ---- Return all buttons in a hashtable for easy referencing ----
    return @{
        Cancel   = $btnCancel
        Backup   = $btnBackup
        Shutdown = $btnShutdown
    }
}


# ============ MAIN WORKFLOW ============

function Start-BackupProcess {
    <#
    .SYNOPSIS
    Executes all backup jobs (zip or file) and waits for sync completion.

    .DESCRIPTION
    This function iterates over a list of backup jobs and performs either a zip backup
    or a file copy (Mirror or Append) depending on each job's settings. After processing
    all jobs, it monitors the destination folders for ongoing sync activity (e.g., cloud sync)
    and waits until all operations are complete. It uses GUI components for logging and progress display.
    #>

    param (
        $jobs,          # List of backup jobs (built from GUI input)
        $gui,           # Reference to the GUI components (LogBox, ProgressBar, etc.)
        $copySettings   # Copy-related settings (retries, wait, threads, post-backup delay, etc.)
    )

    foreach ($job in $jobs) {
        if ($job.Zip) {
            # ---- Run ZIP backup ----
            Invoke-ZipOperation -source $job.Source -dest $job.Dest `
                -zipName $job.ZipName -frequency $job.Frequency `
                -keepCount $job.Keep -logBox $gui.LogBox
        } else {
            # ---- Run FILE backup (Mirror or Append) ----
            $mode = if ($job.Mirror) { "Mirror" } else { "Append" }

            Invoke-FileCopyOperation -source $job.Source -dest $job.Dest `
                -mode $mode -logBox $gui.LogBox -progressBar $gui.ProgressBar `
                -retries $copySettings.RobocopyRetries `
                -wait    $copySettings.RobocopyWait `
                -threads $copySettings.RobocopyThreads
        }
    }

    # ---- Monitor all destination folders for sync activity (e.g., Google Drive, Dropbox) ----
    $destPaths = $jobs.Dest | Where-Object { -not [string]::IsNullOrEmpty($_) }

    if ($destPaths) {
        Wait-ForSyncCompletion -paths $destPaths -logBox $gui.LogBox `
            -intervalSeconds $copySettings.SyncCheckInterval `
            -waitSeconds     $copySettings.SyncWaitSeconds
    }

    # ---- Final log message and optional delay before exiting or shutting down ----
    Write-Log -logBox $gui.LogBox -message "Backup process completed"
    Start-Sleep -Seconds $copySettings.PostBackupDelay
}


# ============ APPLICATION ENTRY POINT ============

# Entry point for the Cloud Backup Tool GUI; initializes components, loads settings, and handles events.
function Main {
    <#
    .SYNOPSIS
    Launches the Cloud Backup Tool GUI.

    .DESCRIPTION
    Entry point for initializing configuration, creating UI components, and wiring up backup logic.
    This function sets up the full form layout, loads provider definitions and user settings, 
    and attaches actions for Backup, Cancel, and Shutdown operations.
    #>
    try {
        # ------------------------------
        # LOAD CONFIGURATION AND RESOURCES
        # ------------------------------

        $config = Convert-ToHashtable (Load-JsonFile -JsonPath $CONFIG_PATH)

        # Generate log file name with timestamp
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $config.Logging.LogFile = "backup_$timestamp.log"

        # Extract key paths and values
        $logFolder    = $config.Locations.LogFolder
        $logFilename  = $config.Logging.LogFile
        $logFilePath  = Join-Path $logFolder $logFilename
        $logs_to_keep = $config.Logging.LogsToKeep

        # Load cloud providers and current saved settings
        $cloud_providers = Convert-ToHashtable (Load-JsonFile -jsonPath $config.Locations.ProviderPath)
        $settings = Initialize-BackupSettings -settingsPath $config.Locations.SettingsPath -providers $cloud_providers

        # ------------------------------
        # EXTRACT UI LAYOUT DEFINITIONS
        # ------------------------------

        $form_layout = @{
            formWidth     = $config.Form.Width
            formHeight    = $config.Form.Height
            startPosition = $config.Form.StartPosition
            defaultFont   = $config.Fonts.Default
        }

        $tab_layout = @{
            tabWidth  = $config.Widths.TabControl
            tabHeight = $config.Heights.TabControl
            tabX      = $config.Positions.TabX
            tabY      = $config.Positions.TabY
        }

        $provider_layout = @{
            XLeftMargin           = $config.Margins.Left
            XLabelOffset          = $config.Offset.LabelX
            YLineSpacing          = $config.Spacing.YLine
            YSmallSpacing         = $config.Spacing.YSmall
            LabelWidth            = $config.Widths.Label
            TextBoxWidth          = $config.Widths.TextBox
            BrowseButtonWidth     = $config.Widths.BrowseButton
            ControlHeight         = $config.Heights.Control
            GroupBoxWidth         = $config.Widths.GroupBox
            GroupBoxHeight        = $config.Heights.GroupBox
            HeaderWidth           = $config.Widths.Header
            HeaderHeight          = $config.Heights.Header
            ExplainLabelWidth     = $config.Widths.ExplainLabel
            ExplainLabelHeight    = $config.Heights.ExplainLabel
            ComboBoxWidth         = $config.Widths.ComboBox
            NumericWidth          = $config.Widths.Numeric
            ModeExplainTextColor  = $config.Colors.ModeExplainText
            ExplainTextColor      = $config.Colors.ExplainText
            DefaultFrequencies    = $config.Defaults.Frequencies
            DefaultKeepCount      = $config.Defaults.KeepCount
            HeaderFont            = $config.Fonts.Header
            InnerRadioY           = $config.Offsets.InnerRadioY
            LabelX                = $config.Positions.LabelX
            TextBoxX              = $config.Positions.TextBoxX
            BrowseButtonX         = $config.Positions.BrowseButtonX
        }

        $progress_layout = @{
            X      = $config.Positions.TabX
            Y      = $config.Positions.ProgressY
            Width  = $config.Widths.TabControl - 20
            Height = $config.Heights.ProgressBar
        }

        $logbox_layout = @{
            X         = $config.Positions.TabX
            Y         = $config.Positions.LogBoxY
            Width     = $config.Widths.TabControl - 10
            Height    = $config.Heights.LogBox
            BackColor = $config.Colors.LogBoxBack
            ForeColor = $config.Colors.LogBoxFore
            Font      = $config.Fonts.Log
        }

        $button_layout = @{
            formWidth     = $config.Form.Width
            buttonHeight  = $config.Heights.Button
            startY        = $config.Positions.ButtonsY
            cancelWidth   = $config.Widths.BtnCancel
            backupWidth   = $config.Widths.BtnBackup
            shutdownWidth = $config.Widths.BtnShutdown
            spacing       = $config.Spacing.Btn
        }

        $robocopy_settings = @{
            Retries           = $config.Robocopy.Retries
            Wait              = $config.Robocopy.Wait
            Threads           = $config.Robocopy.Threads
            PostBackupDelay   = $config.Robocopy.PostBackupDelay
            SyncCheckInterval = $config.Robocopy.SyncCheckInterval
        }

        # ------------------------------
        # CREATE UI COMPONENTS
        # ------------------------------

        $form       = New-MainForm @form_layout
        $controlMap = @{}

        $tabControl = New-ProviderTabs `
            -providers $cloud_providers `
            -settings $settings `
            -controlMap ([ref]$controlMap) `
            @tab_layout `
            -providerLayout $provider_layout

        $progressBar = New-ProgressBar @progress_layout
        $logBox      = New-LogBox @logbox_layout
        $buttons     = New-Buttons @button_layout

        # Add components to the form
        $form.Controls.AddRange(@(
            $tabControl, $progressBar, $logBox,
            $buttons.Cancel, $buttons.Backup, $buttons.Shutdown
        ))

        # ------------------------------
        # CREATE GUI CONTEXT OBJECT
        # ------------------------------

        $gui = [PSCustomObject]@{
            Form        = $form
            LogBox      = $logBox
            ProgressBar = $progressBar
            BtnCancel   = $buttons.Cancel
            BtnBackup   = $buttons.Backup
            BtnShutdown = $buttons.Shutdown
        }

        # Add all control references (e.g., TxtGDriveSource) to GUI
        foreach ($key in $controlMap.Keys) {
            $gui | Add-Member -MemberType NoteProperty -Name $key -Value $controlMap[$key]
        }

        # ------------------------------
        # WIRE UP BUTTON EVENTS
        # ------------------------------

        # Cancel button: closes the form
        $gui.BtnCancel.Add_Click({ $gui.Form.Close() })

        # Backup button
        $gui.BtnBackup.Add_Click({
            Save-CurrentSettings -gui $gui -providers $cloud_providers -settingsPath $config.Locations.SettingsPath
            $jobs    = Build-BackupJobs -gui $gui -cloud_providers $cloud_providers
            $result  = Get-ValidBackupJobs -jobs $jobs -cloud_providers $cloud_providers -logBox $gui.LogBox
            $valid   = $result.ValidJobs
            $errors  = $result.Errors

            if ($errors.Count -gt 0) {
                foreach ($err in $errors) { Write-Log -logBox $gui.LogBox -message $err -Error }
                Write-Log -logBox $gui.LogBox -message "One or more jobs are invalid. Backup cancelled." -Error
                return
            }

            Start-BackupProcess -jobs $valid -gui $gui -copySettings $robocopy_settings
            $gui.Form.Close()
        })

        # Backup + Shutdown button
        $gui.BtnShutdown.Add_Click({
            Save-CurrentSettings -gui $gui -providers $cloud_providers -settingsPath $config.Locations.SettingsPath
            $jobs    = Build-BackupJobs -gui $gui -cloud_providers $cloud_providers
            $result  = Get-ValidBackupJobs -jobs $jobs -cloud_providers $cloud_providers -logBox $gui.LogBox
            $valid   = $result.ValidJobs
            $errors  = $result.Errors

            if ($errors.Count -gt 0) {
                foreach ($err in $errors) { Write-Log -logBox $gui.LogBox -message $err -Error }
                Write-Log -logBox $gui.LogBox -message "One or more jobs are invalid. Backup cancelled." -Error
                return
            }

            Start-BackupProcess -jobs $valid -gui $gui -copySettings $robocopy_settings
            Write-Log -logBox $gui.LogBox -message "Initiating system shutdown..."
            Stop-Computer -Force
        })

        # ------------------------------
        # DISPLAY THE FORM
        # ------------------------------
        [void]$form.ShowDialog()
    }
    catch {
        [System.Windows.Forms.MessageBox]::Show("Fatal error: $($_.Exception.Message)", "Error", 'OK', 'Error')
    }
}


# Start the application
Main