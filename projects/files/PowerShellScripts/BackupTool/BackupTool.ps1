# ==============================================
# POWERSHELL GUI TOOL FOR CROSS-PLATFORM BACKUPS
# ==============================================

# ============ DEPENDENCIES ============
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
# ======================================

# ============ CONSTANTS ============ 
$SETTINGSPATH = "$PSScriptRoot\data\backupSettings.json"
$PROVIDERSPATH = "$PSScriptRoot\data\cloudProviders.json"
$LOGFOLDER     = "$PSScriptRoot\logs"
$LOGFILENAME   = "backup_{0}.log" -f (Get-Date -Format "yyyyMMdd_HHmmss")
$LOGFILEPATH   = Join-Path $LOGFOLDER $LOGFILENAME
# ===================================


# =============================== SETTINGS LOGIC ===============================

# Loads cloud provider data from a JSON file and returns it as a structured hashtable.
function Load-CloudProviders($jsonPath) {
    # Ensure the JSON file exists
    if (-not (Test-Path $jsonPath)) {
        throw "Cloud providers file not found at $jsonPath"
    }

    # Read and parse the JSON
    $raw = Get-Content $jsonPath -Raw | ConvertFrom-Json

    # Convert from raw object to hashtable for easier access
    $providers = @{}
    foreach ($prop in $raw.PSObject.Properties) {
        $providers[$prop.Name] = $prop.Value
    }

    # Wrap in an outer hashtable with 'Providers' key
    return @{ Providers = $providers }
}



# Loads user settings from file or returns provider defaults if file doesn't exist.
function Load-Settings($providers, $settingsPath) {
    # If settings file exists, return parsed JSON
    if (Test-Path $settingsPath) {
        return Get-Content $settingsPath -Raw | ConvertFrom-Json
    }

    # Otherwise, return defaults from the provider definitions
    $defaults = @{ }
    foreach ($key in $providers.Providers.Keys) {
        $defaults[$key] = $providers.Providers[$key].Default
    }
    return $defaults
}


# Saves current GUI input values to a JSON settings file.
function Save-Settings($gui, $providers, $settingsPath) {
    $settings = @{}

    # Loop through each provider and collect form values
    foreach ($key in $providers.Providers.Keys) {
        $prefix = $providers.Providers[$key].Prefix

        # Collect values from GUI controls using the prefix
        $settings[$key] = @{
            Source = $gui."Txt${prefix}Source".Text
            Dest   = $gui."Txt${prefix}Dest".Text
            Zip    = $gui."Rdo${prefix}Zip".Checked
            Mirror = $gui."Rdo${prefix}Mirror".Checked
            Append = $gui."Rdo${prefix}Append".Checked
            Name   = $gui."Txt${prefix}ZipName".Text
            Freq   = $gui."Cmb${prefix}Freq".SelectedItem
            Keep   = $gui."Num${prefix}Keep".Value
        }
    }

    # Convert settings to JSON and write to disk
    $settings | ConvertTo-Json -Depth 10 | Set-Content -Path $settingsPath -Encoding UTF8
}


# Logs a message to the GUI, a file, and prunes old log files.
function Write-Log {
    param (
        [System.Windows.Forms.TextBox]$logBox,
        [string]$message,
        [switch]$Error
    )

    $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $prefix = if ($Error) { "[ERROR]" } else { "[INFO]" }
    $fullMessage = "[$timestamp] $prefix $message"

    # Show in GUI
    $logBox.AppendText("$fullMessage`r`n")
    $logBox.SelectionStart = $logBox.Text.Length
    $logBox.ScrollToCaret()
    [System.Windows.Forms.Application]::DoEvents()

    # Ensure log folder exists
    if (-not (Test-Path $LOGFOLDER)) {
        New-Item -Path $LOGFOLDER -ItemType Directory | Out-Null
    }

    # Write to defined log file
    Add-Content -Path $LOGFILEPATH -Value $fullMessage

    # Prune older logs, keep only the 10 most recent
    $allLogs = Get-ChildItem -Path $LOGFOLDER -Filter "backup_*.log" | Sort-Object LastWriteTime -Descending
    if ($allLogs.Count -gt 10) {
        $allLogs | Select-Object -Skip 10 | Remove-Item -Force
    }
}


# =============================== FORM LOGIC ===============================

# Creates a label, textbox, and browse button row for selecting a folder path.
function New-LabelTextBrowseRow {
    param (
        [string]$label,   # Label text to display (e.g., "Source" or "Destination")
        [string]$value,   # Initial value to populate in the textbox
        [int]$y           # Vertical position for placing the row on the form
    )

    # Create the label and set its position and size
    $lbl = New-Object Windows.Forms.Label
    $lbl.Text = "${label}:"
    $lbl.Location = "10,$y"
    $lbl.Size = '150,20'

    # Create the textbox and prefill with the provided value
    $txtBox = New-Object Windows.Forms.TextBox
    $txtBox.Text = $value
    $txtBox.Size = '390,20'
    $txtBox.Location = "160,$y"

    # Create the "Browse" button and position it to the right of the textbox
    $btn = New-Object Windows.Forms.Button
    $btn.Text = "Browse"
    $btn.Size = '80,20'
    $btn.Location = "560,$y"
    $btn.Tag = $txtBox  # Store reference to the textbox in the button's tag

    # Define click event to open folder browser and update the textbox
    $btn.Add_Click({
        $txt = $this.Tag
        $folder = Browse-Folder $txt.Text
        if ($folder) { $txt.Text = $folder }
    })

    # Return the label, textbox, and button as a hashtable
    return @{ Label = $lbl; TextBox = $txtBox; Button = $btn }
}



# Creates a group of controls for configuring zip backup options on a tab.
function New-ZipSection {
    param (
        [System.Windows.Forms.TabPage]$tab,  # The tab page where controls will be added
        [string]$prefix,                     # Unique prefix for control names
        $settings,                           # Settings object containing saved values
        [int]$startY                         # Vertical starting position on the tab
    )

    $controls = @{}      # Hashtable to store and return the created controls
    $y = $startY         # Initialize vertical position

    # === Backup Type Group ===
    $grpType = New-Object Windows.Forms.GroupBox
    $grpType.Text = "Backup Type"
    $grpType.Location = "10,$y"
    $grpType.Size = '320,45'
    $tab.Controls.Add($grpType)

    $rdoFile = New-Object Windows.Forms.RadioButton
    $rdoFile.Text = "File Backup"
    $rdoFile.Location = "10,15"
    $grpType.Controls.Add($rdoFile)
    $controls["Rdo${prefix}File"] = $rdoFile

    $rdoZip = New-Object Windows.Forms.RadioButton
    $rdoZip.Text = "Zip Backup"
    $rdoZip.Location = "120,15"
    $grpType.Controls.Add($rdoZip)
    $controls["Rdo${prefix}Zip"] = $rdoZip

    $y += 55  # Leave space for group box


    # === File Mode Group ===
    $grpMode = New-Object Windows.Forms.GroupBox
    $grpMode.Text = "File Mode"
    $grpMode.Location = "10,$y"
    $grpMode.Size = '320,45'
    $tab.Controls.Add($grpMode)

    $rdoMirror = New-Object Windows.Forms.RadioButton
    $rdoMirror.Text = "Mirror"
    $rdoMirror.Location = "10,15"
    $grpMode.Controls.Add($rdoMirror)
    $controls["Rdo${prefix}Mirror"] = $rdoMirror

    $rdoAppend = New-Object Windows.Forms.RadioButton
    $rdoAppend.Text = "Append"
    $rdoAppend.Location = "120,15"
    $grpMode.Controls.Add($rdoAppend)
    $controls["Rdo${prefix}Append"] = $rdoAppend

    $y += 55 

    # === Default selection based on saved settings ===
    if ($settings.Zip) {
        $rdoZip.Checked = $true
    } else {
        $rdoFile.Checked = $true
        if ($settings.Mirror) {
            $rdoMirror.Checked = $true
        } else {
            $rdoAppend.Checked = $true
        }
    }

    # ========== Frequency Dropdown ==========
    $lblFreq = New-Object Windows.Forms.Label
    $lblFreq.Text = "Frequency:"
    $lblFreq.Location = "10,$y"
    $tab.Controls.Add($lblFreq)

    $cmbFreq = New-Object Windows.Forms.ComboBox
    $cmbFreq.Items.AddRange(@("Daily", "Weekly", "Monthly"))  # Add options
    $cmbFreq.Size = '100,20'
    $cmbFreq.Location = "160,$y"
    $cmbFreq.DropDownStyle = 'DropDownList'
    $cmbFreq.SelectedItem = $settings.Freq
    $tab.Controls.Add($cmbFreq)
    $controls["Cmb${prefix}Freq"] = $cmbFreq
    $y += 30

    # ========== Zip Name ==========
    $lblName = New-Object Windows.Forms.Label
    $lblName.Text = "Zip Backup Name:"
    $lblName.Location = "10,$y"
    $tab.Controls.Add($lblName)

    $txtName = New-Object Windows.Forms.TextBox
    $txtName.Text = $settings.Name
    $txtName.Location = "160,$y"
    $txtName.Size = '390,20'
    $tab.Controls.Add($txtName)
    $controls["Txt${prefix}ZipName"] = $txtName
    $y += 30

    # ========== Keep Count ==========
    $lblKeep = New-Object Windows.Forms.Label
    $lblKeep.Text = "Zips to keep:"
    $lblKeep.Location = "10,$y"
    $tab.Controls.Add($lblKeep)

    $numKeep = New-Object Windows.Forms.NumericUpDown
    $numKeep.Value = $settings.Keep
    $numKeep.Size = '100,20'
    $numKeep.Location = "160,$y"
    $tab.Controls.Add($numKeep)
    $controls["Num${prefix}Keep"] = $numKeep
    $y += 30

    return @{ Controls = $controls; EndY = $y }
}



# Adds source/destination path controls and zip backup settings to a tab for a given provider.
function Add-PathSection {
    param (
        $tab,                  # The TabPage to add controls to
        [string]$prefix,       # Prefix to namespace the control names
        [string]$title,        # Display name for the section header
        $settings,             # Settings object containing saved values
        [int]$topBase          # Starting Y position for layout
    )

    $y = $topBase

    # Add section header label
    $tab.Controls.Add((New-Object Windows.Forms.Label -Property @{
        Text = $title
        Font = 'Microsoft Sans Serif, 10pt, style=Bold'
        Location = "10,$y"
        Size = '300,25'
    }))
    $y += 30

    $controls = @{}

    # Add Source and Destination path controls using a helper function
    foreach ($type in @("Source", "Dest")) {
        $row = New-LabelTextBrowseRow -label "$title $type" -value $settings.$type -y $y
        $tab.Controls.AddRange(@($row.Label, $row.TextBox, $row.Button))
        $controls["Txt${prefix}${type}"] = $row.TextBox
        $y += 30
    }

    # Add Zip configuration controls (checkbox, name, frequency, keep count)
    $zipResult = New-ZipSection -tab $tab -prefix $prefix -settings $settings -startY $y
    $controls += $zipResult.Controls
    $y = $zipResult.EndY

    return $controls  # Return all control references for future access
}


# Creates and returns the main form window for the backup application.
function New-MainForm {
    $form = New-Object Windows.Forms.Form
    $form.Text = "Cloud Backup App"          # Title shown in the window bar
    $form.Size = "700,850"                   # Width x Height of the window
    $form.StartPosition = "CenterScreen"     # Center the window on screen
    return $form
}


# Creates a tab control with one tab per cloud provider and maps their GUI controls.
function New-ProviderTabs {
    param ($providers, $settings, [ref]$controlMap)

    $tabControl = New-Object Windows.Forms.TabControl
    $tabControl.Size = "690,380"        # Set size of the tab control
    $tabControl.Location = "10,10"      # Position within the main form

    foreach ($entry in $providers.Providers.GetEnumerator()) {
        $key    = $entry.Key
        $data   = $entry.Value
        $prefix = $data.Prefix
        $label  = $data.Label

        $tab = New-Object Windows.Forms.TabPage
        $tab.Text = $label               # Set tab label to provider name

        # Add path and zip section controls for the provider
        $controls = Add-PathSection -tab $tab -prefix $prefix -title $label -settings $settings.$key -topBase 10
        $tabControl.TabPages.Add($tab)

        # Store each control in the control map with its key
        $controls.GetEnumerator() | ForEach-Object {
            $controlMap.Value[$_.Key] = $_.Value
        }
    }

    return $tabControl
}


# Creates and returns a progress bar control for showing backup progress.
function New-ProgressBar {
    $progressBar = New-Object Windows.Forms.ProgressBar
    $progressBar.Location = "10,400"     # Position on the form
    $progressBar.Size = "680,20"         # Width and height
    $progressBar.Minimum = 0             # Minimum value
    $progressBar.Maximum = 100           # Maximum value
    return $progressBar
}


# Creates and returns a styled multiline text box for displaying log output.
function New-LogBox {
    $logBox = New-Object Windows.Forms.TextBox
    $logBox.Multiline = $true            # Allow multiple lines of text
    $logBox.ScrollBars = "Vertical"     # Add vertical scroll bar
    $logBox.ReadOnly = $true            # Prevent user editing
    $logBox.BackColor = "Black"         # Background color
    $logBox.ForeColor = "Lime"          # Text color (green-on-black style)
    $logBox.Font = "Consolas, 9pt"      # Monospaced font for log alignment
    $logBox.Location = "10,490"         # Position on form
    $logBox.Size = "680,280"            # Width and height
    return $logBox
}


# Creates and returns a hashtable containing the Cancel, Backup, and Backup + Shutdown buttons.
function New-Buttons {
    $formWidth = 700                    # Total form width for centering
    $buttonSpacing = 20                 # Space between buttons
    $buttonWidth1 = 120                 # Cancel
    $buttonWidth2 = 150                 # Backup
    $buttonWidth3 = 200                 # Backup and Shutdown
    $totalWidth = $buttonWidth1 + $buttonSpacing + $buttonWidth2 + $buttonSpacing + $buttonWidth3
    $startX = [math]::Floor(($formWidth - $totalWidth) / 2)

    # Cancel button
    $btnCancel = New-Object Windows.Forms.Button
    $btnCancel.Text = "Cancel"
    $btnCancel.Size = "$buttonWidth1,30"
    $btnCancel.Location = "$startX,440"

    # Backup button
    $btnBackup = New-Object Windows.Forms.Button
    $btnBackup.Text = "Backup"
    $btnBackup.Size = "$buttonWidth2,30"
    $btnBackup.Location = "$($startX + $buttonWidth1 + $buttonSpacing),440"

    # Backup and Shutdown button
    $btnShutdown = New-Object Windows.Forms.Button
    $btnShutdown.Text = "Backup and Shutdown"
    $btnShutdown.Size = "$buttonWidth3,30"
    $btnShutdown.Location = "$($startX + $buttonWidth1 + $buttonSpacing + $buttonWidth2 + $buttonSpacing),440"

    return @{
        Cancel      = $btnCancel
        Backup      = $btnBackup
        Shutdown    = $btnShutdown
    }
}



# Opens a folder browser dialog and returns the selected path, or $null if cancelled.
function Browse-Folder($initialPath) {
    # Create a new folder browser dialog
    $dialog = New-Object System.Windows.Forms.FolderBrowserDialog

    # Pre-select initial path if valid
    if ($initialPath -and (Test-Path $initialPath)) {
        $dialog.SelectedPath = $initialPath
    }

    # Show the dialog and return selected path if confirmed
    if ($dialog.ShowDialog() -eq "OK") {
        return $dialog.SelectedPath
    }

    # If cancelled or invalid, return null
    return $null
}


# Returns a suffix string for zip file naming based on the selected backup frequency.
function Get-ZipSuffix($frequency) {
    switch ($frequency) {
        "Daily" {
            # Use abbreviated weekday (e.g., "Mon", "Tue")
            return (Get-Date).DayOfWeek.ToString().Substring(0,3)
        }
        "Weekly" {
            # Use start date of the week (Monday) in yyyy-MM-dd format
            return (Get-Date).AddDays(-(Get-Date).DayOfWeek.value__).ToString("yyyy-MM-dd")
        }
        "Monthly" {
            # Use abbreviated month name (e.g., "Jul")
            return (Get-Date).ToString("MMM")
        }
    }
}


# =============================== BACKUP LOGIC ===============================

# Waits until all given paths show no recent file activity, indicating sync is complete.
function Wait-ForSync($paths, $logBox) {
    $logBox.AppendText("Checking sync status...`r`n")

    while ($true) {
        $allClear = $true

        foreach ($path in $paths) {
            # Skip paths that don't exist
            if (-not (Test-Path $path)) { continue }

            # Get files modified in the last 10 seconds
            $recent = Get-ChildItem -Path $path -Recurse -Force -ErrorAction SilentlyContinue |
                      Where-Object { $_.LastWriteTime -gt (Get-Date).AddSeconds(-10) }

            if ($recent.Count -gt 0) {
                # Recent changes found — assume sync still running
                $allClear = $false
                Write-Log -logBox $logBox -message "Waiting for sync to settle in: $path`r`n"
                break  # No need to check other paths yet
            }
        }

        # If no recent changes were found in any path, exit loop
        if ($allClear) { break }

        # Pause before the next check
        Start-Sleep -Seconds 5
    }

    Write-Log -logBox $logBox -message "Checking sync status..."
}


# Creates a zip archive of the source folder and manages backup retention based on frequency.
function Invoke-ZipBackup {
    param (
        [string]$source,        # Path to the folder to back up
        [string]$dest,          # Destination folder for the zip file
        [string]$zipName,       # Base name for the zip file
        [string]$frequency,     # Frequency setting (Daily, Weekly, Monthly)
        [int]$keepCount,        # Number of old zip files to keep
        $logBox                 # TextBox control to log output to the GUI
    )

    # Generate a suffix based on backup frequency (e.g., "Mon", "2025-07-22", or "Jul")
    $suffix = Get-ZipSuffix $frequency
    $zipPath = Join-Path $dest "$zipName-$suffix.zip"

    # Remove existing zip with the same name (if any)
    if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

    # Log files being zipped
    Write-Log -logBox $logBox -message "Zipping the following files:"
    Get-ChildItem -Path $source -Recurse -Force | ForEach-Object {
        Write-Log -logBox $logBox -message "$($_.FullName)`r`n"
    }

    try {
        # Load .NET zip library and create the archive
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        [System.IO.Compression.ZipFile]::CreateFromDirectory($source, $zipPath, 'Optimal', $false)
        Write-Log -logBox $logBox -message "Created zip: $zipPath`r`n"
    } catch {
        # Handle and log any zip creation error
        $errorMsg = $_.Exception.Message
        Write-Log -logBox $logBox -message "ERROR during zip: $errorMsg" -Error
        [System.Windows.Forms.MessageBox]::Show("Error during zip: $errorMsg", "Zip Failed", 'OK', 'Error')
        return
    }

    # Delete older zip files beyond the keep limit
    $zips = Get-ChildItem $dest -Filter "$zipName-*.zip" | Sort-Object LastWriteTime -Descending
    if ($zips.Count -gt $keepCount) {
        $zips | Select-Object -Skip $keepCount | Remove-Item -Force
        Write-Log -logBox $logBox -message "Deleted old backups.`r`n"
    }
}


# Performs a file-based backup using Robocopy and displays progress in the GUI.
function Invoke-FileBackup {
    param (
        [string]$source,         # Source directory path
        [string]$dest,           # Destination directory path
        $logBox,                 # TextBox control to log Robocopy output
        $progressBar             # ProgressBar control to show activity
    )

    # Notify user in GUI log
    $logBox.AppendText("Running Robocopy...`r`n")

    # Set up process start info for Robocopy with desired arguments
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = "robocopy.exe"
    $psi.Arguments = "`"$source`" `"$dest`" /MIR /Z /R:3 /W:5 /MT:8 /TEE /NDL /NFL"
    $psi.RedirectStandardOutput = $true
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true

    # Create and start the process
    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $psi
    $null = $process.Start()

    # Monitor Robocopy output and update log and progress bar
    $count = 0
    while (-not $process.StandardOutput.EndOfStream) {
        $line = $process.StandardOutput.ReadLine()
        $logBox.AppendText("$line`r`n")
        $count++
        $progressBar.Value = [Math]::Min(100, ($count % 100))  # Cycle progress bar
        $logBox.SelectionStart = $logBox.Text.Length
        $logBox.ScrollToCaret()
        [System.Windows.Forms.Application]::DoEvents()
    }

    # Wait for Robocopy to complete and finalize GUI updates
    $process.WaitForExit()
    $progressBar.Value = 100
    Write-Log -logBox $logBox -message "Robocopy (Mirror) finished with exit code $($process.ExitCode)`r`n"
    $process.Dispose()
}

function Invoke-AppendBackup {
    param (
        [string]$source,
        [string]$dest,
        $logBox,
        $progressBar
    )

    $logBox.AppendText("Running Robocopy (Append mode)...`r`n")

    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = "robocopy.exe"
    $psi.Arguments = "`"$source`" `"$dest`" /E /Z /R:3 /W:5 /MT:8 /TEE /NDL /NFL /XX"
    $psi.RedirectStandardOutput = $true
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true

    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $psi
    $null = $process.Start()

    $count = 0
    while (-not $process.StandardOutput.EndOfStream) {
        $line = $process.StandardOutput.ReadLine()
        $logBox.AppendText("$line`r`n")
        $count++
        $progressBar.Value = [Math]::Min(100, ($count % 100))
        $logBox.SelectionStart = $logBox.Text.Length
        $logBox.ScrollToCaret()
        [System.Windows.Forms.Application]::DoEvents()
    }

    $process.WaitForExit()
    $progressBar.Value = 100
    Write-Log -logBox $logBox -message "Robocopy (Append) finished with exit code $($process.ExitCode)`r`n"
    $process.Dispose()
}



# Performs a backup (zip or file copy) for the given provider. Assumes validation is already done.
function Perform-Backup {
    param (
        [string]$source,          # Path to source folder
        [string]$dest,            # Path to destination folder
        [bool]$zip,               # Whether to zip or just copy files
        [bool]$mirror,
        [bool]$append,
        [string]$zipName,         # Base name for zip files
        [string]$frequency,       # Frequency for naming (Daily, Weekly, Monthly)
        [int]$keepCount,          # How many zip backups to retain
        $logBox,                  # GUI log TextBox control
        $progressBar,             # GUI progress bar control
        $providers,               # All provider definitions (with keys and metadata)
        [string]$providerKey      # Which provider (e.g., "Google", "Dropbox")
    )

    # Abort if unknown provider key
    if (-not $providers.Providers.ContainsKey($providerKey)) {
        Write-Log -logBox $logBox -message "ERROR: Unknown provider key '$providerKey'. Backup skipped." -Error
        return
    }

    # Retrieve provider object
    $provider = $providers.Providers[$providerKey]
    Write-Log -logBox $logBox -message "Backing up from '$source' to '$dest' for provider '$($provider.Label)'"

    # === Perform Backup ===
    if ($zip) {
        Invoke-ZipBackup -source $source -dest $dest -zipName $zipName -frequency $frequency -keepCount $keepCount -logBox $logBox
    }
    elseif ($mirror) {
        Invoke-FileBackup -source $source -dest $dest -logBox $logBox -progressBar $progressBar
    }
    else {
        Invoke-AppendBackup -source $source -dest $dest -logBox $logBox -progressBar $progressBar
    }
}


# Runs backups for all configured cloud providers, saves settings, and waits for sync completion before exit.
function Run-AllBackups {
    param (
        $gui,               # GUI object containing form controls
        $cloud_providers,   # Hashtable of cloud provider configurations
        $settingsPath       # Path to the JSON settings file
    )

    # Save the current values from the GUI to the settings file
    Save-Settings -gui $gui -providers $cloud_providers -settingsPath $settingsPath

    # Build a list of backup jobs by reading values from the GUI
    $jobs = foreach ($key in $cloud_providers.Providers.Keys) {
        $prefix = $cloud_providers.Providers[$key].Prefix
        $source = $gui."Txt${prefix}Source".Text

        if ([string]::IsNullOrWhiteSpace($source)) { continue }

        [PSCustomObject]@{
            Key       = $key
            Source    = $source
            Dest      = $gui."Txt${prefix}Dest".Text
            Zip       = $gui."Rdo${prefix}Zip".Checked
            Mirror    = $gui."Rdo${prefix}Mirror".Checked
            Append    = $gui."Rdo${prefix}Append".Checked
            ZipName   = $gui."Txt${prefix}ZipName".Text
            Frequency = $gui."Cmb${prefix}Freq".SelectedItem
            Keep      = $gui."Num${prefix}Keep".Value
         }
    }

    $validJobs = @()

    # Validate all jobs — fail entirely if one is invalid (excluding blanks)
    foreach ($job in $jobs) {
        # Skip if source is empty — not considered invalid
        if ([string]::IsNullOrWhiteSpace($job.Source)) {
            continue
        }

        # Validate source path
        if (-not (Test-Path $job.Source)) {
            Write-Log -logBox $gui.LogBox -message "ERROR: Source path '$($job.Source)' does not exist for '${job.Key}'." -Error
            [System.Windows.Forms.MessageBox]::Show("Source path '$($job.Source)' does not exist for '${job.Key}'.", "Invalid Source", 'OK', 'Error')
            return
        }

        # Validate destination
        $provider = $cloud_providers.Providers[$job.Key]
        $isValid = $false
        foreach ($allowed in $provider.Destinations) {
            if ($job.Dest -like "*$allowed*") {
                $isValid = $true
                break
            }
        }

        if (-not $isValid) {
            $allowedPaths = $provider.Destinations -join ", "
            $msg = "Destination '$($job.Dest)' is not allowed for provider '$($provider.Label)'.`nValid paths must include: $allowedPaths"
            Write-Log -logBox $gui.LogBox -message $msg -Error
            [System.Windows.Forms.MessageBox]::Show($msg, "Invalid Destination", 'OK', 'Warning')
            return
        }

        # Valid job — add to list
        $validJobs += $job
    }

    # If there are no valid jobs to run, show a message and return
    if ($validJobs.Count -eq 0) {
        Write-Log -logBox $gui.LogBox -message "No valid jobs with a source path to run. Backup cancelled."
        [System.Windows.Forms.MessageBox]::Show("No valid jobs to run. All source paths were blank.", "Backup Aborted", 'OK', 'Warning')
        return
    }

    # Run each valid job by calling Perform-Backup
    foreach ($job in $validJobs) {
        Perform-Backup -source $job.Source -dest $job.Dest `
            -zip:$job.Zip -mirror:$job.Mirror -append:$job.Append `
            -zipName $job.ZipName -frequency $job.Frequency -keepCount $job.Keep `
            -logBox $gui.LogBox -progressBar $gui.ProgressBar `
            -providers $cloud_providers -providerKey $job.Key
    }

    # Build list of destination paths for sync status checking
    $pathsToCheck = foreach ($job in $validJobs) {
        if ($job.Dest) {
            $job.Dest
        } else {
            $gui.LogBox.AppendText("Skipping sync check for '${job.Key}' — no destination.`r`n")
        }
    }

    # Wait for all cloud folders to finish syncing
    Wait-ForSync -paths $pathsToCheck -logBox $gui.LogBox

    # Final message and close the form after a short delay
    $gui.LogBox.AppendText("Backup finished. Exiting...`r`n")
    Start-Sleep -Seconds 3
    $gui.Form.Close()
}


# =============================== MAIN ===============================
function Main {
    # Load cloud provider configuration and settings
    $cloud_providers = Load-CloudProviders $PROVIDERSPATH
    $settings = Load-Settings -providers $cloud_providers -settingsPath $SETTINGSPATH

    # Build the form and core controls directly (no wrapper function)
    $form        = New-MainForm
    $controlMap  = @{}
    $tabControl  = New-ProviderTabs -providers $cloud_providers -settings $settings -controlMap ([ref]$controlMap)
    $progressBar = New-ProgressBar
    $logBox      = New-LogBox
    $buttons     = New-Buttons

    # Assemble GUI
    $form.Controls.AddRange(@($tabControl, $logBox, $progressBar, $buttons.Cancel, $buttons.Backup, $buttons.Shutdown))

    # Bundle all controls into a PSObject for easy referencing
    $gui = New-Object PSObject -Property ($controlMap + @{
        Form        = $form
        LogBox      = $logBox
        ProgressBar = $progressBar
        BtnCancel   = $buttons.Cancel
        BtnBackup   = $buttons.Backup
        BtnShutdown = $buttons.Shutdown
    })

    # Cancel handler
    $gui.BtnCancel.Add_Click({ $gui.Form.Close() })

    # Backup + Shutdown handler
    $gui.BtnBackup.Add_Click({
        Run-AllBackups -gui $gui -cloud_providers $cloud_providers -settingsPath $SETTINGSPATH
    })

    # Backup + Shutdown handler
    $gui.BtnShutdown.Add_Click({
        Run-AllBackups -gui $gui -cloud_providers $cloud_providers -settingsPath $SETTINGSPATH
        Write-Log -logBox $gui.LogBox -message "Shutdown initiated after backup."
        Stop-Computer -Force
    })

        # Display form
        [void]$gui.Form.ShowDialog()
    }

# ==== START ====
Main
