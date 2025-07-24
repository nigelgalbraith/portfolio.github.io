# CLOUD STORAGE BACKUP TOOL #

# ============ CONSTANTS ============ 
# Paths
$SETTINGSPATH = "$PSScriptRoot\data\backupSettings.json"
$PROVIDERSPATH = "$PSScriptRoot\data\cloudProviders.json"

# Log File
$LOGFOLDER = "$PSScriptRoot\logs"
$LOGFILENAME = "backup_{0}.log" -f (Get-Date -Format "yyyyMMdd_HHmmss")
$LOGFILEPATH = Join-Path $LOGFOLDER $LOGFILENAME
$LOGS_TO_KEEP = 10

# Layout
$LAYOUT = @{
    # Form
    FormWidth         = 710
    FormHeight        = 850
    StartPosition     = 'CenterScreen'

    # Fonts
    DefaultFont       = 'Microsoft Sans Serif, 8pt'
    HeaderFont        = 'Microsoft Sans Serif, 10pt, style=Bold'
    LogFont           = 'Consolas, 9pt'

    # Tab Control
    TabControlX       = 10
    TabControlY       = 10
    TabControlWidth   = 690
    TabControlHeight  = 390

    # Label/TextBox/Browse
    LabelWidth        = 150
    TextBoxWidth      = 390
    BrowseButtonWidth = 80
    ControlHeight     = 20

    # Explain Labels
    ExplainLabelWidth     = 650
    ExplainLabelHeight    = 40
    ExplainTextColor      = 'DarkBlue'
    ModeExplainTextColor  = 'DarkGreen'

    # GroupBoxes
    GroupBoxWidth     = 320
    GroupBoxHeight    = 45

    # Log Box
    LogBoxY           = 490
    LogBoxHeight      = 280
    LogBoxBackColor   = 'Black'
    LogBoxForeColor   = 'Lime'

    # Progress Bar
    ProgressBarY      = 400
    ProgressBarHeight = 20

    # Buttons
    BtnHeight         = 30
    BtnSpacing        = 20
    BtnCancelWidth    = 120
    BtnBackupWidth    = 150
    BtnShutdownWidth  = 200
    ButtonsStartY     = 440

    # Defaults
    DefaultFrequencies = @('Daily', 'Weekly', 'Monthly')
    DefaultKeepCount   = 2

    # Combo box
    ComboBoxWidth = 100

    # Numeric box
    NumericWidth = 100
}


# Robocopy Parameters
$COPYSETTINGS = @{
    RobocopyRetries    = 3
    RobocopyWait       = 5
    RobocopyThreads    = 8
    PostBackupDelay    = 3
}
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
    if ($allLogs.Count -gt 10) {
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
        [string]$source,
        [string]$dest,
        [string]$mode,
        $logBox,
        $progressBar,
        $copySettings
    )

    # Common Robocopy arguments
    $baseArgs = @(
        "/Z",                                   # Use restartable mode
        "/R:$($copySettings.RobocopyRetries)",  # Number of retry attempts on failure
        "/W:$($copySettings.RobocopyWait)",     # Wait time between retries
        "/MT:$($copySettings.RobocopyThreads)", # Multithreaded copy
        "/TEE",                                 # Output to both console and log
        "/NDL",                                 # No directory listing
        "/NFL"                                  # No file listing
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
        $paths,
        $logBox,
        $copySettings
    )

    # Log initial status
    Write-Log -logBox $logBox -message "Monitoring sync status..."

    while ($true) {
        $allClear = $true

        foreach ($path in $paths) {
            # Skip if path doesn't exist
            if (-not (Test-Path $path)) { continue }

            # Look for recently modified files within the SYNC_WAIT_SECONDS window
            $recent = Get-ChildItem -Path $path -Recurse -Force -ErrorAction SilentlyContinue |
                      Where-Object { $_.LastWriteTime -gt (Get-Date).AddSeconds(-$SYNC_WAIT_SECONDS) }

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
        Start-Sleep -Seconds $copySettings.SyncCheckInterval
    }

    # Log completion
    Write-Log -logBox $logBox -message "All sync operations completed"
}


# ============ USER INTERFACE FUNCTIONS ============

# Creates and returns the main form for the Cloud Backup Tool GUI.
function New-MainForm {
    param ($layout)

    # Create a new Windows Form
    $form = New-Object Windows.Forms.Form

    # Set form title
    $form.Text = "Cloud Backup Tool"

    # Set form dimensions
    $form.Size = New-Object Drawing.Size($layout.FormWidth, $layout.FormHeight)

    # Center the form on the screen
    $form.StartPosition = $layout.StartPosition

    # Apply default font
    $form.Font = $layout.DefaultFont

    return $form
}


# Creates a tab control containing one tab per provider, each populated with its configured input controls.
function New-ProviderTabs {
    param (
        $providers,
        $settings,
        [ref]$controlMap,
        $layout 
    )

    # Create the main tab control
    $tabControl = New-Object Windows.Forms.TabControl

    # Set size and position of the tab control using layout values
    $tabControl.Size = New-Object Drawing.Size($layout.TabControlWidth, $layout.TabControlHeight)
    $tabControl.Location = New-Object Drawing.Point($layout.TabControlX, $layout.TabControlY)

    foreach ($entry in $providers.Providers.GetEnumerator()) {
        # Create a tab page for the provider
        $tab = New-Object Windows.Forms.TabPage
        $tab.Text = $entry.Value.Label

        # Add provider-specific controls to the tab
        $controls = Add-ProviderControls -tab $tab -prefix $entry.Value.Prefix -settings $settings.$($entry.Key) -layout $layout
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
        $layout
    )

    $controls = @{}
    $y = 10

    # Header label
    $lblHeader = New-Object Windows.Forms.Label
    $lblHeader.Text = $tab.Text
    $lblHeader.Font = $layout.HeaderFont
    $lblHeader.Location = New-Object Drawing.Point(10, $y)
    $lblHeader.Size = New-Object Drawing.Size(300, 25)
    $tab.Controls.Add($lblHeader)
    $y += 30

    # Source and Destination path rows
    foreach ($type in @("Source", "Dest")) {
        $row = New-LabelTextBrowseRow -label "$($tab.Text) $type" -value $settings.$type -y $y -layout $layout
        $tab.Controls.AddRange(@($row.Label, $row.TextBox, $row.Button))
        $controls["Txt${prefix}${type}"] = $row.TextBox
        $y += 30
    }

    # Backup Type group
    $grpType = New-Object Windows.Forms.GroupBox
    $grpType.Text = "Backup Type"
    $grpType.Location = New-Object Drawing.Point(10, $y)
    $grpType.Size = New-Object Drawing.Size($layout.GroupBoxWidth, $layout.GroupBoxHeight)
    $tab.Controls.Add($grpType)

    # Radio buttons: File vs Zip
    $rdoFile = New-Object Windows.Forms.RadioButton
    $rdoFile.Text = "File Backup"
    $rdoFile.Location = New-Object Drawing.Point(10, 15)
    $grpType.Controls.Add($rdoFile)
    $controls["Rdo${prefix}File"] = $rdoFile

    $rdoZip = New-Object Windows.Forms.RadioButton
    $rdoZip.Text = "Zip Backup"
    $rdoZip.Location = New-Object Drawing.Point(120, 15)
    $grpType.Controls.Add($rdoZip)
    $controls["Rdo${prefix}Zip"] = $rdoZip
    $y += 55

    # Explanation label (below backup type)
    $lblExplain = New-Object Windows.Forms.Label
    $lblExplain.Text = ""
    $lblExplain.Location = New-Object Drawing.Point(10, $y)
    $lblExplain.Size = New-Object Drawing.Size($layout.ExplainLabelWidth, $layout.ExplainLabelHeight)
    $lblExplain.TextAlign = 'TopLeft'
    $lblExplain.ForeColor = $layout.ExplainTextColor
    $tab.Controls.Add($lblExplain)
    $controls["Lbl${prefix}Explain"] = $lblExplain
    $y += 25

    # File Mode group (Mirror / Append)
    $grpMode = New-Object Windows.Forms.GroupBox
    $grpMode.Text = "File Mode"
    $grpMode.Location = New-Object Drawing.Point(10, $y)
    $grpMode.Size = New-Object Drawing.Size($layout.GroupBoxWidth, $layout.GroupBoxHeight)
    $tab.Controls.Add($grpMode)
    $controls["Grp${prefix}Mode"] = $grpMode

    $rdoMirror = New-Object Windows.Forms.RadioButton
    $rdoMirror.Text = "Mirror"
    $rdoMirror.Location = New-Object Drawing.Point(10, 15)
    $grpMode.Controls.Add($rdoMirror)
    $controls["Rdo${prefix}Mirror"] = $rdoMirror

    $rdoAppend = New-Object Windows.Forms.RadioButton
    $rdoAppend.Text = "Append"
    $rdoAppend.Location = New-Object Drawing.Point(120, 15)
    $grpMode.Controls.Add($rdoAppend)
    $controls["Rdo${prefix}Append"] = $rdoAppend
    $y += 55

    # File Mode explanation
    $lblModeExplain = New-Object Windows.Forms.Label
    $lblModeExplain.Text = ""
    $lblModeExplain.Location = New-Object Drawing.Point(10, $y)
    $lblModeExplain.Size = New-Object Drawing.Size($layout.ExplainLabelWidth, $layout.ExplainLabelHeight)
    $lblModeExplain.TextAlign = 'TopLeft'
    $lblModeExplain.ForeColor = $layout.ModeExplainTextColor
    $tab.Controls.Add($lblModeExplain)
    $controls["Lbl${prefix}ModeExplain"] = $lblModeExplain
    $y += 25

    # Zip frequency label and dropdown
    $lblFreq = New-Object Windows.Forms.Label
    $lblFreq.Text = "Frequency:"
    $lblFreq.Location = New-Object Drawing.Point(10, $y)
    $tab.Controls.Add($lblFreq)

    $cmbFreq = New-Object Windows.Forms.ComboBox
    $cmbFreq.Items.AddRange($layout.DefaultFrequencies)
    $cmbFreq.DropDownStyle = 'DropDownList'
    $cmbFreq.SelectedItem = $settings.Freq
    $cmbFreq.Location = New-Object Drawing.Point(160, $y)
    $cmbFreq.Size = New-Object Drawing.Size($layout.ComboBoxWidth, $layout.ControlHeight)
    $tab.Controls.Add($cmbFreq)
    $controls["Cmb${prefix}Freq"] = $cmbFreq
    $y += 30

    # Zip name label and textbox
    $lblName = New-Object Windows.Forms.Label
    $lblName.Text = "Zip Backup Name:"
    $lblName.Location = New-Object Drawing.Point(10, $y)
    $tab.Controls.Add($lblName)

    $txtName = New-Object Windows.Forms.TextBox
    $txtName.Text = $settings.Name
    $txtName.Location = New-Object Drawing.Point(160, $y)
    $txtName.Size = New-Object Drawing.Size($layout.TextBoxWidth, $layout.ControlHeight)

    $tab.Controls.Add($txtName)
    $controls["Txt${prefix}ZipName"] = $txtName
    $y += 30

    # Zip retention count
    $lblKeep = New-Object Windows.Forms.Label
    $lblKeep.Text = "Zips to keep:"
    $lblKeep.Location = New-Object Drawing.Point(10, $y)
    $tab.Controls.Add($lblKeep)

    $numKeep = New-Object Windows.Forms.NumericUpDown
    $numKeep.Value = if ($settings.Keep) { $settings.Keep } else { $layout.default_keep_count }
    $numKeep.Location = New-Object Drawing.Point(160, $y)
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
            $keep = if ($keepBox) { $keepBox.Value } else { $layout.default_keep_count }

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
        [string]$label,
        [string]$value,
        [int]$y,
        $layout
    )

    # Create label
    $lbl = New-Object Windows.Forms.Label
    $lbl.Text = "${label}:"
    $lbl.Location = New-Object Drawing.Point(10, $y)
    $lbl.Size = New-Object Drawing.Size($layout.LabelWidth, $layout.ControlHeight)

    # Create textbox with default value
    $txtBox = New-Object Windows.Forms.TextBox
    $txtBox.Text = $value
    $txtBox.Location = New-Object Drawing.Point(160, $y)
    $txtBox.Size = New-Object Drawing.Size($layout.TextBoxWidth, $layout.ControlHeight)

    # Create browse button linked to the textbox
    $btn = New-Object Windows.Forms.Button
    $btn.Text = "Browse"
    $btn.Location = New-Object Drawing.Point(560, $y)
    $btn.Size = New-Object Drawing.Size($layout.BrowseButtonWidth, $layout.ControlHeight)
    $btn.Tag = $txtBox

    # Open folder browser dialog on click
    $btn.Add_Click({
        $folder = Browse-Folder -initialPath $this.Tag.Text
        if ($folder) { $this.Tag.Text = $folder }
    })

    # Return references to the row elements
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
    param ($layout)

    # Create progress bar control
    $progressBar = New-Object Windows.Forms.ProgressBar

    # Set location relative to tab control
    $progressBar.Location = New-Object Drawing.Point($layout.TabControlX, $layout.ProgressBarY)

    # Set size slightly narrower than the tab control
    $progressBar.Size = New-Object Drawing.Size($($layout.TabControlWidth - 20), $layout.ProgressBarHeight)


    # Define min and max range
    $progressBar.Minimum = 0
    $progressBar.Maximum = 100

    return $progressBar
}


# Creates and returns a read-only multi-line text box for displaying log output.
function New-LogBox {
    param ($layout)

    # Create the log text box
    $logBox = New-Object Windows.Forms.TextBox

    # Enable multiline with vertical scroll
    $logBox.Multiline = $true
    $logBox.ScrollBars = "Vertical"
    $logBox.ReadOnly = $true

    # Apply visual styling
    $logBox.BackColor = $layout.LogBoxBackColor
    $logBox.ForeColor = $layout.LogBoxForeColor
    $logBox.Font      = $layout.LogFont

    # Set position and size
    $logBox.Location = New-Object Drawing.Point($layout.TabControlX, $layout.LogBoxY)
    $logBox.Size     = New-Object Drawing.Size(($layout.TabControlWidth - 10), $layout.LogBoxHeight)

    return $logBox
}


# Creates and returns Cancel, Backup, and Backup & Shutdown buttons centered at the bottom of the form.
function New-Buttons {
    param ($layout)

    # Calculate total button width and center position
    $totalWidth = $layout.BtnCancelWidth + $layout.BtnSpacing + $layout.BtnBackupWidth + $layout.BtnSpacing + $layout.BtnShutdownWidth
    $startX = [math]::Floor(($layout.FormWidth - $totalWidth) / 2)

    # Create Cancel button
    $btnCancel = New-Object Windows.Forms.Button
    $btnCancel.Text = "Cancel"
    $btnCancel.Size = New-Object Drawing.Size($layout.BtnCancelWidth, $layout.BtnHeight)
    $btnCancel.Location = New-Object Drawing.Point($startX, $layout.ButtonsStartY)

    # Create Backup button
    $btnBackup = New-Object Windows.Forms.Button
    $btnBackup.Text = "Backup"
    $btnBackup.Size = New-Object Drawing.Size($layout.BtnBackupWidth, $layout.BtnHeight)
    $btnBackup.Location = New-Object Drawing.Point(($startX + $layout.BtnCancelWidth + $layout.BtnSpacing), $layout.ButtonsStartY)

    # Create Backup & Shutdown button
    $btnShutdown = New-Object Windows.Forms.Button
    $btnShutdown.Text = "Backup && Shutdown"
    $btnShutdown.Size = New-Object Drawing.Size($layout.BtnShutdownWidth, $layout.BtnHeight)
    $btnShutdown.Location = New-Object Drawing.Point(
        ($startX + $layout.BtnCancelWidth + $layout.BtnSpacing + $layout.BtnBackupWidth + $layout.BtnSpacing),
        $layout.ButtonsStartY
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
        $jobs,
        $gui,
        $copySettings
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
                -copySettings $CopySettings
        }
    }

    # Gather destination paths and monitor sync status
    $destPaths = $jobs.Dest | Where-Object { -not [string]::IsNullOrEmpty($_) }
    if ($destPaths) {
        Wait-ForSyncCompletion -paths $destPaths -logBox $gui.LogBox -interval $CopySettings.SyncCheckInterval
    }

    # Log completion and wait before closing
    Write-Log -logBox $gui.LogBox -message "Backup process completed"
    Start-Sleep -Seconds $CopySettings.PostBackupDelay
}


# ============ APPLICATION ENTRY POINT ============

# Entry point for the Cloud Backup Tool GUI; initializes components, loads settings, and handles events.
function Main {
    try {
        # Load cloud provider definitions and existing settings
        $cloud_providers = Load-CloudProviders -jsonPath $PROVIDERSPATH
        $settings = Initialize-BackupSettings -settingsPath $SETTINGSPATH -providers $cloud_providers

        # Create main form and UI components
        $form        = New-MainForm -layout $LAYOUT
        $controlMap  = @{}
        $tabControl  = New-ProviderTabs -providers $cloud_providers -settings $settings -controlMap ([ref]$controlMap) -layout $LAYOUT
        $progressBar = New-ProgressBar -layout $LAYOUT
        $logBox      = New-LogBox -layout $LAYOUT
        $buttons     = New-Buttons -layout $LAYOUT

        # Add components to form
        $form.Controls.Add($tabControl)
        $form.Controls.Add($progressBar)
        $form.Controls.Add($logBox)
        $form.Controls.Add($buttons.Cancel)
        $form.Controls.Add($buttons.Backup)
        $form.Controls.Add($buttons.Shutdown)

        # Create GUI object with references to all key components
        $gui = [PSCustomObject]@{
            Form        = $form
            LogBox      = $logBox
            ProgressBar = $progressBar
            BtnCancel   = $buttons.Cancel
            BtnBackup   = $buttons.Backup
            BtnShutdown = $buttons.Shutdown
        }

        # Add provider-specific controls to the GUI object
        foreach ($key in $controlMap.Keys) {
            $gui | Add-Member -MemberType NoteProperty -Name $key -Value $controlMap[$key]
        }

        # Cancel button: close the form
        $gui.BtnCancel.Add_Click({ 
            $gui.Form.Close() 
        })

        # Backup button: validate and run backup
        $gui.BtnBackup.Add_Click({
            Save-CurrentSettings -gui $gui -providers $cloud_providers -settingsPath $SETTINGSPATH
            $jobs = Build-BackupJobs -gui $gui -cloud_providers $cloud_providers

            $result = Get-ValidBackupJobs -jobs $jobs -cloud_providers $cloud_providers -logBox $gui.LogBox
            $validJobs = $result.ValidJobs
            $errors = $result.Errors

            # Handle validation errors
            if ($errors.Count -gt 0) {
                foreach ($err in $errors) {
                    Write-Log -logBox $gui.LogBox -message $err -Error
                }
                Write-Log -logBox $gui.LogBox -message "One or more jobs are invalid. Backup cancelled." -Error
                return
            }

            # Run backup and close the form
            Start-BackupProcess -jobs $validJobs -gui $gui -copySettings $CopySettings
            $gui.Form.Close()
        })

        # Backup & Shutdown button: same as above, then shut down the system
        $gui.BtnShutdown.Add_Click({
            Save-CurrentSettings -gui $gui -providers $cloud_providers -settingsPath $SETTINGSPATH
            $jobs = Build-BackupJobs -gui $gui -cloud_providers $cloud_providers

            $result = Get-ValidBackupJobs -jobs $jobs -cloud_providers $cloud_providers -logBox $gui.LogBox
            $validJobs = $result.ValidJobs
            $errors = $result.Errors

            # Handle validation errors
            if ($errors.Count -gt 0) {
                foreach ($err in $errors) {
                    Write-Log -logBox $gui.LogBox -message $err -Error
                }
                Write-Log -logBox $gui.LogBox -message "One or more jobs are invalid. Backup cancelled." -Error
                return
            }

            # Run backup, then shut down the system
            Start-BackupProcess -jobs $validJobs -gui $gui -copySettings $CopySettings
            Write-Log -logBox $gui.LogBox -message "Initiating system shutdown..."
            Stop-Computer -Force
        })

        # Show the GUI window
        [void]$form.ShowDialog()
    }
    catch {
        # Show fatal error message box if initialization fails
        [System.Windows.Forms.MessageBox]::Show("Fatal error: $($_.Exception.Message)", "Error", 'OK', 'Error')
    }
}


# Start the application
Main