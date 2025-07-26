# CLOUD STORAGE BACKUP TOOL #

# ============ CONSTANTS ============ 

$CONFIG = @{
    Locations = @{
        SettingsPath = "$PSScriptRoot\config\backupSettings.json"
        ProviderPath = "$PSScriptRoot\config\cloudProviders.json"
        LogFolder    = "$PSScriptRoot\logs"
    }

    Logging = @{
        LogsToKeep = 10
        LogFile    = "backup_{0}.log" -f (Get-Date -Format "yyyyMMdd_HHmmss")
    }

    Form = @{
        Width         = 710
        Height        = 850
        StartPosition = 'CenterScreen'
    }

    Fonts = @{
        Default = 'Microsoft Sans Serif, 8pt'
        Header  = 'Microsoft Sans Serif, 10pt, style=Bold'
        Log     = 'Consolas, 9pt'
    }

    Widths = @{
        BrowseButton = 80
        BtnCancel    = 120
        BtnBackup    = 150
        BtnShutdown  = 200
        Label        = 150
        TextBox      = 390
        TabControl   = 690
        ExplainLabel = 650
        Numeric      = 100
        ComboBox     = 100
        GroupBox     = 320
        Header       = 300
    }

    Heights = @{
        TabControl    = 390
        ExplainLabel  = 40
        GroupBox      = 45
        LogBox        = 280
        ProgressBar   = 20
        Button        = 30
        Control       = 20
        Header        = 25
    }

    Positions = @{
        TabX      = 10
        TabY      = 10
        ProgressY = 400
        LogBoxY   = 490
        ButtonsY  = 440
    }

    Colors = @{
        ExplainText     = 'DarkBlue'
        ModeExplainText = 'DarkGreen'
        LogBoxBack      = 'Black'
        LogBoxFore      = 'Lime'
    }

    Defaults = @{
        Frequencies = @('Daily', 'Weekly', 'Monthly')
        KeepCount   = 2
    }

    Spacing = @{
        Btn    = 20
        YGroup = 55
        YLine  = 30
        YSmall = 20
    }

    Margins = @{
        Left = 10
    }

    Offset = @{
        LabelX = 160
    }

    Robocopy = @{
        Retries           = 3
        Wait              = 5
        Threads           = 8
        PostBackupDelay   = 3
        SyncCheckInterval = 10
    }
}

# Log path constants
$LOGFOLDER     = $CONFIG.Locations.LogFolder
$LOGFILENAME   = $CONFIG.Logging.LogFile
$LOGFILEPATH   = Join-Path $LOGFOLDER $LOGFILENAME
$LOGS_TO_KEEP  = $CONFIG.Logging.LogsToKeep

# ===================================

# ============ DEPENDENCIES ============
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.IO.Compression.FileSystem
# ======================================

# ============ SETTINGS FUNCTIONS ============

# Writes a timestamped log message to a GUI text box and a rotating log file (max 10), with optional error flag.
function Write-Log {
    param (
        [System.Windows.Forms.TextBox]$logBox,
        [string]$message,
        [switch]$Error
    )

    $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $prefix = if ($Error) { "[ERROR]" } else { "[INFO]" }
    $fullMessage = "[$timestamp] $prefix $message"

    # GUI logging
    $logBox.AppendText("$fullMessage`r`n")
    $logBox.SelectionStart = $logBox.Text.Length
    $logBox.ScrollToCaret()
    [System.Windows.Forms.Application]::DoEvents()

    # File logging
    if (-not (Test-Path $LOGFOLDER)) {
        New-Item -Path $LOGFOLDER -ItemType Directory | Out-Null
    }
    Add-Content -Path $LOGFILEPATH -Value $fullMessage

    # Log rotation
    $allLogs = Get-ChildItem -Path $LOGFOLDER -Filter "backup_*.log" | Sort-Object LastWriteTime -Descending
    if ($allLogs.Count -gt $LOGS_TO_KEEP) {
        $allLogs | Select-Object -Skip $LOGS_TO_KEEP | Remove-Item -Force
    }
}



# Loads cloud provider settings from a JSON file into a hashtable.
function Load-CloudProviders {
    param ($jsonPath)
    
    # Validate file exists
    if (-not (Test-Path $jsonPath)) {
        throw "Cloud providers file not found at $jsonPath"
    }

    # Read and parse JSON
    $raw = Get-Content $jsonPath -Raw | ConvertFrom-Json

    # Convert properties to hashtable
    $providers = @{}
    foreach ($prop in $raw.PSObject.Properties) {
        $providers[$prop.Name] = $prop.Value
    }

    # Return wrapped in a hashtable for consistency
    return @{ Providers = $providers }
}


# Loads existing backup settings from a file or initializes defaults from cloud provider definitions.
function Initialize-BackupSettings {
    param (
        [string]$settingsPath, 
        $providers             
    )
    
    # If settings file exists, load and return it
    if (Test-Path $settingsPath) {
        return Get-Content $settingsPath -Raw | ConvertFrom-Json
    }
    
    # Otherwise, initialize default settings for each provider
    $defaults = @{}
    foreach ($key in $providers.Providers.Keys) {
        $defaults[$key] = $providers.Providers[$key].Default
    }

    return $defaults
}


# Saves current GUI backup settings for each cloud provider to a JSON file.
function Save-CurrentSettings {
    param (
        $gui,           
        $providers,      
        $settingsPath    
    )

    $settings = @{}
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

    # Convert settings to JSON and save to file
    $settings | ConvertTo-Json -Depth 10 | Set-Content -Path $settingsPath
}


# ============ BACKUP OPERATIONS ============

# Validates backup jobs by checking keys, paths, and destination rules, returning valid jobs and error messages.
function Get-ValidBackupJobs {
    param (
        $jobs,               
        $cloud_providers,    
        $logBox             
    )

    $validJobs = @()  # Store valid jobs
    $errors = @()     # Store error messages

    foreach ($job in $jobs) {
        # Check for missing provider key
        if (-not $job.Key) {
            $errors += "Job with no provider key skipped."
            continue
        }

        # Ensure source and destination fields are filled in
        if ([string]::IsNullOrWhiteSpace($job.Source) -or [string]::IsNullOrWhiteSpace($job.Dest)) {
            $errors += "Job '$($job.Key)': Source or destination is blank."
            continue
        }

        # Ensure source path exists
        if (-not (Test-Path $job.Source)) {
            $errors += "Job '$($job.Key)': Source path does not exist: $($job.Source)"
            continue
        }

        # Ensure destination path exists
        if (-not (Test-Path $job.dest)) {
            $errors += "Job '$($job.Key)': dest path does not exist: $($job.dest)"
            continue
        }

        # Check if destination is among provider's approved destinations
        $provider = $cloud_providers.Providers[$job.Key]
        $matches = $provider.Destinations | Where-Object { $_ -eq $job.Dest }

        if (-not $matches) {
            $expected = $provider.Destinations -join ", "
            $errors += "Job '$($job.Key)': Destination must include one of: $expected"
            continue
        }

        # Job passed all checks
        $validJobs += $job
    }

    # Return valid jobs and all collected errors
    return [PSCustomObject]@{
        ValidJobs = $validJobs
        Errors    = $errors
    }
}


# Returns true if all backup jobs are valid and the job list is not empty.
function Are-AllJobsValid {
    param (
        $jobs,
        $validJobs
    )

    # Return false if there are no jobs to validate
    if ($jobs.Count -eq 0) {
        return $false
    }

    # True only if all jobs are valid
    return $validJobs.Count -eq $jobs.Count
}


# Builds a list of backup job objects from GUI input fields, one per cloud provider with a source path set.
function Build-BackupJobs {
    param (
        $gui,
        $cloud_providers
    )

    $jobs = @()

    foreach ($key in $cloud_providers.Providers.Keys) {
        $prefix = $cloud_providers.Providers[$key].Prefix
        $source = $gui."Txt${prefix}Source".Text

        # Only create a job if a source path is specified
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


# Executes a Robocopy file copy operation in the specified mode (Mirror or Append), with logging and progress feedback.
function Invoke-FileCopyOperation {
    param (
        [string]$source,            # Source directory to back up
        [string]$dest,              # Destination directory for backup
        [string]$mode,              # File mode: "Mirror" or "Append"
        $logBox,                    # TextBox for GUI logging
        $progressBar,               # Progress bar for UI feedback
        [int]$retries,              # Number of retry attempts on failure
        [int]$wait,                 # Wait time between retries
        [int]$threads               # Number of threads for multithreaded copy
    )

    # Common Robocopy arguments
    $baseArgs = @(
        "/Z",                          # Use restartable mode
        "/R:$retries",                # Retry count
        "/W:$wait",                   # Wait time between retries
        "/MT:$threads",               # Multithreaded copy
        "/TEE",                       # Output to both console and log
        "/NDL",                       # No directory listing
        "/NFL"                        # No file listing
    )

    # Mode-specific arguments
    $modeArgs = if ($mode -eq "Mirror") { "/MIR" } else { "/E /XX" }

    # Combine arguments and quote paths
    $allArgs = @("`"$source`"", "`"$dest`"") + $baseArgs + $modeArgs

    # Configure process startup
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = "robocopy.exe"
    $psi.Arguments = $allArgs -join " "
    $psi.RedirectStandardOutput = $true
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true

    # Start and monitor the copy process
    Write-Log -logBox $logBox -message "Starting $mode operation from $source to $dest"
    $process = Start-ProcessWithOutput -processStartInfo $psi -logBox $logBox -progressBar $progressBar
    Write-Log -logBox $logBox -message "$mode operation completed (Exit code: $($process.ExitCode))"
}



# Starts a background process, logs each line of output to the GUI, and updates a progress bar.
function Start-ProcessWithOutput {
    param (
        $processStartInfo,
        $logBox,
        $progressBar
    )

    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $processStartInfo
    $null = $process.Start()

    $count = 0
    # Read output line-by-line, Log each line to GUI, Animate progress bar
    while (-not $process.StandardOutput.EndOfStream) {
        $line = $process.StandardOutput.ReadLine()                         
        Write-Log -logBox $logBox -message $line                          
        Update-Progress -progressBar $progressBar -value (++$count % 100) 
    }

    # Ensure progress bar completes
    $process.WaitForExit()
    Update-Progress -progressBar $progressBar -value 100                  
    return $process
}


# Updates the GUI progress bar value and processes pending UI events.
function Update-Progress {
    param (
        $progressBar,
        [int]$value
    )

    # Clamp the progress value to a maximum of 100
    $progressBar.Value = [Math]::Min(100, $value)

    # Process pending UI events to keep the interface responsive
    [System.Windows.Forms.Application]::DoEvents()
}


# Performs a zip backup operation with retention management and error handling.
function Invoke-ZipOperation {
    param (
        [string]$source,
        [string]$dest,
        [string]$zipName,
        [string]$frequency,
        [int]$keepCount,
        $logBox
    )

    try {
        # Generate suffix based on frequency (e.g., daily, weekly)
        $suffix = Get-ZipSuffix -frequency $frequency

        # Construct full path for the zip file
        $zipPath = Join-Path $dest "$zipName-$suffix.zip"
        
        # Log start of zip operation
        Write-Log -logBox $logBox -message "Starting zip operation for $source"

        # Remove any existing zip with the same name
        Remove-ExistingZip -zipPath $zipPath -logBox $logBox

        # Create new zip archive
        Create-ZipArchive -source $source -destination $zipPath

        # Confirm success in log
        Write-Log -logBox $logBox -message "Successfully created zip: $zipPath"

        # Manage how many zip files to retain
        Manage-BackupRetention -dest $dest -zipName $zipName -keepCount $keepCount -logBox $logBox

    } catch {
        # Log and show any error that occurred during the process
        Write-Log -logBox $logBox -message "ERROR during zip operation: $($_.Exception.Message)" -Error
        [System.Windows.Forms.MessageBox]::Show("Zip operation failed: $($_.Exception.Message)", "Error", 'OK', 'Error')
    }
}


# Returns a suffix string for zip file names based on backup frequency.
function Get-ZipSuffix {
    param ([string]$frequency)

    switch ($frequency) {
        # Use 3-letter day of week for daily backups (e.g., Mon, Tue)
        "Daily"   { return (Get-Date).DayOfWeek.ToString().Substring(0,3) }

        # Use the start of the current week (Sunday) for weekly backups
        "Weekly"  { return (Get-Date).AddDays(-([int](Get-Date).DayOfWeek)).ToString("yyyy-MM-dd") }

        # Use abbreviated month name for monthly backups (e.g., Jan, Feb)
        "Monthly" { return (Get-Date).ToString("MMM") }

        # Default fallback suffix
        default   { return "Backup" }
    }
}

# Removes an existing zip file if it already exists.
function Remove-ExistingZip {
    param (
        [string]$zipPath,
        $logBox
    )

    # Check if the zip file already exists
    if (Test-Path $zipPath) {
        # Log the removal
        Write-Log -logBox $logBox -message "Removing existing zip: $zipPath"

        # Forcefully delete the existing zip file
        Remove-Item $zipPath -Force
    }
}


# Creates a zip archive from a source directory using optimal compression.
function Create-ZipArchive {
    param (
        [string]$source,
        [string]$destination
    )

    # Create the zip file from the source directory
    [System.IO.Compression.ZipFile]::CreateFromDirectory($source, $destination, 'Optimal', $false)
}


# Enforces a retention policy by deleting older zip backups beyond the keep count.
function Manage-BackupRetention {
    param (
        [string]$dest,
        [string]$zipName,
        [int]$keepCount,
        $logBox
    )

    # Get matching zip files sorted by last modified time (newest first)
    $zips = Get-ChildItem $dest -Filter "$zipName-*.zip" | Sort-Object LastWriteTime -Descending

    # If more than the allowed number of backups exist, remove the oldest
    if ($zips.Count -gt $keepCount) {
        $zips | Select-Object -Skip $keepCount | Remove-Item -Force

        # Log retention enforcement
        Write-Log -logBox $logBox -message "Enforced retention policy (kept $keepCount backups)"
    }
}


# Waits until no recent file changes are detected in the specified paths, indicating sync is complete.
function Wait-ForSyncCompletion {
    param (
        $paths,                     # Paths to monitor for sync activity
        $logBox,                    # TextBox for logging status
        [int]$intervalSeconds,      # Delay between sync checks (e.g., 3 sec)
        [int]$waitSeconds           # Look-back window for recent file changes
    )

    # Log initial status
    Write-Log -logBox $logBox -message "Monitoring sync status..."

    while ($true) {
        $allClear = $true

        foreach ($path in $paths) {
            # Skip if path doesn't exist
            if (-not (Test-Path $path)) { continue }

            # Look for recently modified files within the wait window
            $recent = Get-ChildItem -Path $path -Recurse -Force -ErrorAction SilentlyContinue |
                      Where-Object { $_.LastWriteTime -gt (Get-Date).AddSeconds(-$waitSeconds) }

            # If recent activity is found, log it and delay the next check
            if ($recent) {
                $allClear = $false
                Write-Log -logBox $logBox -message "Active sync detected in $path"
                break
            }
        }

        # Exit loop if all paths are clear of recent activity
        if ($allClear) { break }

        # Wait before rechecking
        Start-Sleep -Seconds $intervalSeconds
    }

    # Log completion
    Write-Log -logBox $logBox -message "All sync operations completed"
}



# ============ USER INTERFACE FUNCTIONS ============

# Creates and returns the main form for the Cloud Backup Tool GUI.
# Creates and returns the main form for the Cloud Backup Tool GUI.
function New-MainForm {
    param (
        [int]$formWidth,             # Width of the main form
        [int]$formHeight,            # Height of the main form
        [string]$startPosition,      # Start position (e.g., 'CenterScreen')
        [string]$defaultFont         # Default font string (e.g., 'Microsoft Sans Serif, 8pt')
    )

    # Create a new Windows Form
    $form = New-Object Windows.Forms.Form

    # Set form title
    $form.Text = "Cloud Backup Tool"

    # Set form dimensions
    $form.Size = New-Object Drawing.Size($formWidth, $formHeight)

    # Center the form on the screen
    $form.StartPosition = $startPosition

    # Apply default font
    $form.Font = $defaultFont

    return $form
}


# Creates a tab control containing one tab per provider, each populated with its configured input controls.
function New-ProviderTabs {
    param (
        $providers,                    # Cloud provider definitions
        $settings,                    # Provider-specific user settings
        [ref]$controlMap,             # Reference to control map for storing UI references
        [int]$tabWidth,               # Width of the tab control
        [int]$tabHeight,              # Height of the tab control
        [int]$tabX,                   # X position of the tab control
        [int]$tabY,                   # Y position of the tab control
        $providerLayout               # Layout hashtable to pass into Add-ProviderControls
    )

    # Create the main tab control
    $tabControl = New-Object Windows.Forms.TabControl

    # Set size and position of the tab control using layout values
    $tabControl.Size = New-Object Drawing.Size($tabWidth, $tabHeight)
    $tabControl.Location = New-Object Drawing.Point($tabX, $tabY)

    foreach ($entry in $providers.Providers.GetEnumerator()) {
        # Create a tab page for the provider
        $tab = New-Object Windows.Forms.TabPage
        $tab.Text = $entry.Value.Label

        # Add provider-specific controls to the tab
        $controls = Add-ProviderControls `
            -tab $tab `
            -prefix $entry.Value.Prefix `
            -settings $settings.$($entry.Key) `
            -layout $providerLayout  # Still pass full layout to Add-ProviderControls for now

        $tabControl.TabPages.Add($tab)

        # Store references to created controls in the shared map
        foreach ($key in $controls.Keys) {
            $controlMap.Value[$key] = $controls[$key]
        }
    }

    return $tabControl
}



# Adds all GUI controls for a cloud provider's tab and returns a map of control references.
function Add-ProviderControls {
    param (
        $tab,
        [string]$prefix,
        $settings,
        [hashtable]$layout  # Still passing a subset layout with only required values
    )

    $controls = @{ }
    $y = $layout.XLeftMargin

    # Header label
    $lblHeader = New-Object Windows.Forms.Label
    $lblHeader.Text = $tab.Text
    $lblHeader.Font = $layout.HeaderFont
    $lblHeader.Location = New-Object Drawing.Point($layout.XLeftMargin, $y)
    $lblHeader.Size = New-Object Drawing.Size($layout.HeaderWidth, $layout.HeaderHeight)
    $tab.Controls.Add($lblHeader)
    $y += $layout.YLineSpacing

    # Source and Destination path rows
    foreach ($type in @("Source", "Dest")) {
        $row = New-LabelTextBrowseRow `
            -label "$($tab.Text) $type" `
            -value $settings.$type `
            -y $y `
            -labelWidth $layout.LabelWidth `
            -textBoxWidth $layout.TextBoxWidth `
            -browseButtonWidth $layout.BrowseButtonWidth `
            -controlHeight $layout.ControlHeight

        $tab.Controls.AddRange(@($row.Label, $row.TextBox, $row.Button))
        $controls["Txt${prefix}${type}"] = $row.TextBox
        $y += $layout.YLineSpacing
    }

    # Backup Type group
    $grpType = New-Object Windows.Forms.GroupBox
    $grpType.Text = "Backup Type"
    $grpType.Location = New-Object Drawing.Point($layout.XLeftMargin, $y)
    $grpType.Size = New-Object Drawing.Size($layout.GroupBoxWidth, $layout.GroupBoxHeight)
    $tab.Controls.Add($grpType)

    # Radio buttons: File vs Zip
    $rdoFile = New-Object Windows.Forms.RadioButton
    $rdoFile.Text = "File Backup"
    $rdoFile.Location = New-Object Drawing.Point($layout.XLeftMargin, 15)
    $grpType.Controls.Add($rdoFile)
    $controls["Rdo${prefix}File"] = $rdoFile

    $rdoZip = New-Object Windows.Forms.RadioButton
    $rdoZip.Text = "Zip Backup"
    $rdoZip.Location = New-Object Drawing.Point($layout.XLabelOffset, 15)
    $grpType.Controls.Add($rdoZip)
    $controls["Rdo${prefix}Zip"] = $rdoZip
    $y += $layout.GroupBoxHeight + $layout.YSmallSpacing

    # Explanation label (below backup type)
    $lblExplain = New-Object Windows.Forms.Label
    $lblExplain.Text = ""
    $lblExplain.Location = New-Object Drawing.Point($layout.XLeftMargin, $y)
    $lblExplain.Size = New-Object Drawing.Size($layout.ExplainLabelWidth, $layout.ExplainLabelHeight)
    $lblExplain.TextAlign = 'TopLeft'
    $lblExplain.ForeColor = $layout.ExplainTextColor
    $tab.Controls.Add($lblExplain)
    $controls["Lbl${prefix}Explain"] = $lblExplain
    $y += $layout.YSmallSpacing

    # File Mode group (Mirror / Append)
    $grpMode = New-Object Windows.Forms.GroupBox
    $grpMode.Text = "File Mode"
    $grpMode.Location = New-Object Drawing.Point($layout.XLeftMargin, $y)
    $grpMode.Size = New-Object Drawing.Size($layout.GroupBoxWidth, $layout.GroupBoxHeight)
    $tab.Controls.Add($grpMode)
    $controls["Grp${prefix}Mode"] = $grpMode

    $rdoMirror = New-Object Windows.Forms.RadioButton
    $rdoMirror.Text = "Mirror"
    $rdoMirror.Location = New-Object Drawing.Point($layout.XLeftMargin, 15)
    $grpMode.Controls.Add($rdoMirror)
    $controls["Rdo${prefix}Mirror"] = $rdoMirror

    $rdoAppend = New-Object Windows.Forms.RadioButton
    $rdoAppend.Text = "Append"
    $rdoAppend.Location = New-Object Drawing.Point($layout.XLabelOffset, 15)
    $grpMode.Controls.Add($rdoAppend)
    $controls["Rdo${prefix}Append"] = $rdoAppend
    $y += $layout.GroupBoxHeight + $layout.YSmallSpacing

    # File Mode explanation
    $lblModeExplain = New-Object Windows.Forms.Label
    $lblModeExplain.Text = ""
    $lblModeExplain.Location = New-Object Drawing.Point($layout.XLeftMargin, $y)
    $lblModeExplain.Size = New-Object Drawing.Size($layout.ExplainLabelWidth, $layout.ExplainLabelHeight)
    $lblModeExplain.TextAlign = 'TopLeft'
    $lblModeExplain.ForeColor = $layout.ModeExplainTextColor
    $tab.Controls.Add($lblModeExplain)
    $controls["Lbl${prefix}ModeExplain"] = $lblModeExplain
    $y += $layout.YSmallSpacing

    # Zip frequency label and dropdown
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

    # Zip name label and textbox
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

    # Zip retention count
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

    # Configure toggle behavior between file and zip backup modes
    $zipControls = @($lblFreq, $cmbFreq, $lblName, $txtName, $lblKeep, $numKeep)
    $rdoFile.Tag = @{ Label = $lblExplain; ZipControls = $zipControls; ModeGroup = $grpMode; ModeLabel = $lblModeExplain }
    $rdoZip.Tag = $rdoFile.Tag

    # Initial state based on settings
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

    # File/Zip radio button change events
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

    # File mode radio button change events
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


# Creates a labeled text box with an attached Browse button for folder selection.
function New-LabelTextBrowseRow {
    param (
        [string]$label,             # Label text (e.g., "Source")
        [string]$value,             # Initial value of the textbox
        [int]$y,                    # Y-position for the row
        [int]$labelWidth,           # Width of the label
        [int]$textBoxWidth,         # Width of the textbox
        [int]$browseButtonWidth,    # Width of the browse button
        [int]$controlHeight         # Height of controls in the row
    )

    # Create label
    $lbl = New-Object Windows.Forms.Label
    $lbl.Text = "${label}:"
    $lbl.Location = New-Object Drawing.Point(10, $y)
    $lbl.Size = New-Object Drawing.Size($labelWidth, $controlHeight)

    # Create textbox with default value
    $txtBox = New-Object Windows.Forms.TextBox
    $txtBox.Text = $value
    $txtBox.Location = New-Object Drawing.Point(160, $y)
    $txtBox.Size = New-Object Drawing.Size($textBoxWidth, $controlHeight)

    # Create browse button linked to the textbox
    $btn = New-Object Windows.Forms.Button
    $btn.Text = "Browse"
    $btn.Location = New-Object Drawing.Point(560, $y)
    $btn.Size = New-Object Drawing.Size($browseButtonWidth, $controlHeight)
    $btn.Tag = $txtBox

    # Open folder browser dialog on click
    $btn.Add_Click({
        $folder = Browse-Folder -initialPath $this.Tag.Text
        if ($folder) { $this.Tag.Text = $folder }
    })

    return @{ Label = $lbl; TextBox = $txtBox; Button = $btn }
}



# Opens a folder browser dialog and returns the selected path, or null if cancelled.
function Browse-Folder {
    param ($initialPath)

    # Create the folder browser dialog
    $dialog = New-Object System.Windows.Forms.FolderBrowserDialog

    # Set the initial path if it exists
    if ($initialPath -and (Test-Path $initialPath)) {
        $dialog.SelectedPath = $initialPath
    }

    # Show dialog and return selected path if user clicks OK
    if ($dialog.ShowDialog() -eq "OK") {
        return $dialog.SelectedPath
    }

    # Return null if dialog was cancelled
    return $null
}


# Creates and returns a progress bar positioned below the tab control.
function New-ProgressBar {
    param (
        [int]$x,             # X position of the progress bar
        [int]$y,             # Y position (below tab control)
        [int]$width,         # Width of the progress bar
        [int]$height         # Height of the progress bar
    )

    # Create progress bar control
    $progressBar = New-Object Windows.Forms.ProgressBar

    # Set location and size
    $progressBar.Location = New-Object Drawing.Point($x, $y)
    $progressBar.Size = New-Object Drawing.Size($width, $height)

    # Define min and max range
    $progressBar.Minimum = 0
    $progressBar.Maximum = 100

    return $progressBar
}


# Creates and returns a read-only multi-line text box for displaying log output.
function New-LogBox {
    param (
        [int]$x,                  # X position (usually aligned with tab control)
        [int]$y,                  # Y position of the log box
        [int]$width,              # Width of the log box
        [int]$height,             # Height of the log box
        [string]$backColor,       # Background color
        [string]$foreColor,       # Foreground (text) color
        [string]$font             # Font specification (e.g., 'Consolas, 9pt')
    )

    # Create the log text box
    $logBox = New-Object Windows.Forms.TextBox

    # Enable multiline with vertical scroll
    $logBox.Multiline = $true
    $logBox.ScrollBars = "Vertical"
    $logBox.ReadOnly = $true

    # Apply visual styling
    $logBox.BackColor = $backColor
    $logBox.ForeColor = $foreColor
    $logBox.Font      = $font

    # Set position and size
    $logBox.Location = New-Object Drawing.Point($x, $y)
    $logBox.Size     = New-Object Drawing.Size($width, $height)

    return $logBox
}

# Creates and returns Cancel, Backup, and Backup & Shutdown buttons centered at the bottom of the form.
function New-Buttons {
    param (
        [int]$formWidth,
        [int]$buttonHeight,
        [int]$startY,
        [int]$cancelWidth,
        [int]$backupWidth,
        [int]$shutdownWidth,
        [int]$spacing
    )

    # Calculate total button width and center position
    $totalWidth = $cancelWidth + $spacing + $backupWidth + $spacing + $shutdownWidth
    $startX = [math]::Floor(($formWidth - $totalWidth) / 2)

    # Create Cancel button
    $btnCancel = New-Object Windows.Forms.Button
    $btnCancel.Text = "Cancel"
    $btnCancel.Size = New-Object Drawing.Size($cancelWidth, $buttonHeight)
    $btnCancel.Location = New-Object Drawing.Point($startX, $startY)

    # Create Backup button
    $btnBackup = New-Object Windows.Forms.Button
    $btnBackup.Text = "Backup"
    $btnBackup.Size = New-Object Drawing.Size($backupWidth, $buttonHeight)
    $btnBackup.Location = New-Object Drawing.Point(($startX + $cancelWidth + $spacing), $startY)

    # Create Backup & Shutdown button
    $btnShutdown = New-Object Windows.Forms.Button
    $btnShutdown.Text = "Backup && Shutdown"
    $btnShutdown.Size = New-Object Drawing.Size($shutdownWidth, $buttonHeight)
    $btnShutdown.Location = New-Object Drawing.Point(
        ($startX + $cancelWidth + $spacing + $backupWidth + $spacing),
        $startY
    )

    # Return button references in a hashtable
    return @{
        Cancel   = $btnCancel
        Backup   = $btnBackup
        Shutdown = $btnShutdown
    }
}


# ============ MAIN WORKFLOW ============

# Executes all backup jobs (zip or file) and waits for sync completion before finishing.
function Start-BackupProcess {
    param (
        $jobs,          # List of backup jobs (built from GUI input)
        $gui,           # Reference to the GUI components (LogBox, ProgressBar, etc.)
        $copySettings   # Copy-related settings (retries, wait, threads, post-backup delay, etc.)
    )

    foreach ($job in $jobs) {
        if ($job.Zip) {
            # Run zip-based backup
            Invoke-ZipOperation -source $job.Source -dest $job.Dest `
                -zipName $job.ZipName -frequency $job.Frequency `
                -keepCount $job.Keep -logBox $gui.LogBox
        } else {
            # Determine file copy mode and run file-based backup
            $mode = if ($job.Mirror) { "Mirror" } else { "Append" }

            Invoke-FileCopyOperation -source $job.Source -dest $job.Dest `
                -mode $mode -logBox $gui.LogBox -progressBar $gui.ProgressBar `
                -retries $copySettings.RobocopyRetries `
                -wait    $copySettings.RobocopyWait `
                -threads $copySettings.RobocopyThreads
        }
    }

    # Gather destination paths and monitor sync status
    $destPaths = $jobs.Dest | Where-Object { -not [string]::IsNullOrEmpty($_) }
    if ($destPaths) {
        Wait-ForSyncCompletion -paths $destPaths -logBox $gui.LogBox `
            -intervalSeconds $copySettings.SyncCheckInterval `
            -waitSeconds     $copySettings.SyncWaitSeconds
    }

    # Log completion and wait before closing
    Write-Log -logBox $gui.LogBox -message "Backup process completed"
    Start-Sleep -Seconds $copySettings.PostBackupDelay
}



# ============ APPLICATION ENTRY POINT ============

# Entry point for the Cloud Backup Tool GUI; initializes components, loads settings, and handles events.
function Main {
    try {
        # Load cloud provider definitions and existing settings
        $cloud_providers = Load-CloudProviders -jsonPath $CONFIG.Locations.ProviderPath
        $settings = Initialize-BackupSettings -settingsPath $CONFIG.Locations.SettingsPath -providers $cloud_providers

        # Extract layout subsets from CONFIG
        $form_layout = @{
            formWidth     = $CONFIG.Form.Width
            formHeight    = $CONFIG.Form.Height
            startPosition = $CONFIG.Form.StartPosition
            defaultFont   = $CONFIG.Fonts.Default
        }

        $tab_layout = @{
            tabWidth  = $CONFIG.Widths.TabControl
            tabHeight = $CONFIG.Heights.TabControl
            tabX      = $CONFIG.Positions.TabX
            tabY      = $CONFIG.Positions.TabY
        }

        $provider_layout = @{
            XLeftMargin           = $CONFIG.Margins.Left
            XLabelOffset          = $CONFIG.Offset.LabelX
            YLineSpacing          = $CONFIG.Spacing.YLine
            YSmallSpacing         = $CONFIG.Spacing.YSmall
            LabelWidth            = $CONFIG.Widths.Label
            TextBoxWidth          = $CONFIG.Widths.TextBox
            BrowseButtonWidth     = $CONFIG.Widths.BrowseButton
            ControlHeight         = $CONFIG.Heights.Control
            GroupBoxWidth         = $CONFIG.Widths.GroupBox
            GroupBoxHeight        = $CONFIG.Heights.GroupBox
            HeaderWidth           = $CONFIG.Widths.Header
            HeaderHeight          = $CONFIG.Heights.Header
            ExplainLabelWidth     = $CONFIG.Widths.ExplainLabel
            ExplainLabelHeight    = $CONFIG.Heights.ExplainLabel
            ModeExplainTextColor  = $CONFIG.Colors.ModeExplainText
            ExplainTextColor      = $CONFIG.Colors.ExplainText
            ComboBoxWidth         = $CONFIG.Widths.ComboBox
            NumericWidth          = $CONFIG.Widths.Numeric
            DefaultFrequencies    = $CONFIG.Defaults.Frequencies
            DefaultKeepCount      = $CONFIG.Defaults.KeepCount
            HeaderFont            = $CONFIG.Fonts.Header
        }

        $progress_layout = @{
            X       = $CONFIG.Positions.TabX
            Y       = $CONFIG.Positions.ProgressY
            Width   = $CONFIG.Widths.TabControl - 20
            Height  = $CONFIG.Heights.ProgressBar
        }

        $logbox_layout = @{
            X         = $CONFIG.Positions.TabX
            Y         = $CONFIG.Positions.LogBoxY
            Width     = $CONFIG.Widths.TabControl - 10
            Height    = $CONFIG.Heights.LogBox
            BackColor = $CONFIG.Colors.LogBoxBack
            ForeColor = $CONFIG.Colors.LogBoxFore
            Font      = $CONFIG.Fonts.Log
        }

        $button_layout = @{
            formWidth     = $CONFIG.Form.Width
            buttonHeight  = $CONFIG.Heights.Button
            startY        = $CONFIG.Positions.ButtonsY
            cancelWidth   = $CONFIG.Widths.BtnCancel
            backupWidth   = $CONFIG.Widths.BtnBackup
            shutdownWidth = $CONFIG.Widths.BtnShutdown
            spacing       = $CONFIG.Spacing.Btn
        }

        $robocopy_settings = @{
            Retries           = $CONFIG.Robocopy.Retries
            Wait              = $CONFIG.Robocopy.Wait
            Threads           = $CONFIG.Robocopy.Threads
            PostBackupDelay   = $CONFIG.Robocopy.PostBackupDelay
            SyncCheckInterval = $CONFIG.Robocopy.SyncCheckInterval
        }

        # Create main form and UI components
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

        # Add components to form
        $form.Controls.Add($tabControl)
        $form.Controls.Add($progressBar)
        $form.Controls.Add($logBox)
        $form.Controls.Add($buttons.Cancel)
        $form.Controls.Add($buttons.Backup)
        $form.Controls.Add($buttons.Shutdown)

        # Create GUI object
        $gui = [PSCustomObject]@{
            Form        = $form
            LogBox      = $logBox
            ProgressBar = $progressBar
            BtnCancel   = $buttons.Cancel
            BtnBackup   = $buttons.Backup
            BtnShutdown = $buttons.Shutdown
        }

        foreach ($key in $controlMap.Keys) {
            $gui | Add-Member -MemberType NoteProperty -Name $key -Value $controlMap[$key]
        }

        # Cancel button event
        $gui.BtnCancel.Add_Click({ $gui.Form.Close() })

        # Backup button event
        $gui.BtnBackup.Add_Click({
            Save-CurrentSettings -gui $gui -providers $cloud_providers -settingsPath $CONFIG.Locations.SettingsPath
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

        # Backup & Shutdown button event
        $gui.BtnShutdown.Add_Click({
            Save-CurrentSettings -gui $gui -providers $cloud_providers -settingsPath $CONFIG.Locations.SettingsPath
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

        # Display the form
        [void]$form.ShowDialog()
    }
    catch {
        [System.Windows.Forms.MessageBox]::Show("Fatal error: $($_.Exception.Message)", "Error", 'OK', 'Error')
    }
}


# Start the application
Main