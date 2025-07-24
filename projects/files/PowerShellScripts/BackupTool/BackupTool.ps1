# CLOUD STORAGE BACKUP TOOL #

# ============ CONSTANTS ============ 
# Paths
$SETTINGSPATH = "$PSScriptRoot\data\backupSettings.json"
$PROVIDERSPATH = "$PSScriptRoot\data\cloudProviders.json"
$LOGFOLDER = "$PSScriptRoot\logs"
$LOGFILENAME = "backup_{0}.log" -f (Get-Date -Format "yyyyMMdd_HHmmss")
$LOGFILEPATH = Join-Path $LOGFOLDER $LOGFILENAME

# Form Dimensions
$FORM_WIDTH = 700
$FORM_HEIGHT = 850
$TAB_CONTROL_WIDTH = 690
$TAB_CONTROL_HEIGHT = 380
$LOG_BOX_HEIGHT = 280

# Control Positions
$TAB_CONTROL_X = 10
$TAB_CONTROL_Y = 10
$PROGRESS_BAR_Y = 400
$LOG_BOX_Y = 490
$BUTTONS_START_Y = 440

# Backup Settings
$DEFAULT_FREQUENCIES = @("Daily", "Weekly", "Monthly")
$DEFAULT_KEEP_COUNT = 2
$SYNC_WAIT_SECONDS = 10
$SYNC_CHECK_INTERVAL = 5
$POST_BACKUP_DELAY = 3

# UI Colors
$LOG_BOX_BACK_COLOR = "Black"
$LOG_BOX_FORE_COLOR = "Lime"
$EXPLAIN_TEXT_COLOR = "DarkBlue"
$MODE_EXPLAIN_TEXT_COLOR = "DarkGreen"

# Fonts
$HEADER_FONT = 'Microsoft Sans Serif, 10pt, style=Bold'
$LOG_FONT = 'Consolas, 9pt'
$DEFAULT_FONT = 'Microsoft Sans Serif, 8pt'

# Button Dimensions
$BTN_CANCEL_WIDTH = 120
$BTN_BACKUP_WIDTH = 150
$BTN_SHUTDOWN_WIDTH = 200
$BTN_HEIGHT = 30
$BTN_SPACING = 20

# Control Default Sizes
$LABEL_WIDTH = 150
$TEXTBOX_WIDTH = 390
$BROWSE_BTN_WIDTH = 80
$CONTROL_HEIGHT = 20
$GROUPBOX_WIDTH = 320
$GROUPBOX_HEIGHT = 45
$EXPLAIN_LABEL_WIDTH = 650
$EXPLAIN_LABEL_HEIGHT = 40

# Robocopy Parameters
$ROBOCOPY_RETRIES = 3
$ROBOCOPY_WAIT = 5
$ROBOCOPY_THREADS = 8
# ===================================

# ============ DEPENDENCIES ============
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.IO.Compression.FileSystem
# ======================================

# ============ CORE FUNCTIONS ============

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
        $allLogs | Select-Object -Skip 10 | Remove-Item -Force
    }
}

function Load-CloudProviders {
    param ($jsonPath)
    
    if (-not (Test-Path $jsonPath)) {
        throw "Cloud providers file not found at $jsonPath"
    }

    $raw = Get-Content $jsonPath -Raw | ConvertFrom-Json
    $providers = @{}
    foreach ($prop in $raw.PSObject.Properties) {
        $providers[$prop.Name] = $prop.Value
    }

    return @{ Providers = $providers }
}

function Initialize-BackupSettings {
    param (
        [string]$settingsPath,
        $providers
    )
    
    if (Test-Path $settingsPath) {
        return Get-Content $settingsPath -Raw | ConvertFrom-Json
    }
    
    $defaults = @{}
    foreach ($key in $providers.Providers.Keys) {
        $defaults[$key] = $providers.Providers[$key].Default
    }
    return $defaults
}

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

    $settings | ConvertTo-Json -Depth 10 | Set-Content -Path $settingsPath
}

# ============ BACKUP OPERATIONS ============
function Get-ValidBackupJobs {
    param (
        $jobs,
        $cloud_providers,
        $logBox
    )

    $validJobs = @()
    $errors = @()

    foreach ($job in $jobs) {
        if (-not $job.Key) {
            $errors += "Job with no provider key skipped."
            continue
        }

        if ([string]::IsNullOrWhiteSpace($job.Source) -or [string]::IsNullOrWhiteSpace($job.Dest)) {
            $errors += "Job '$($job.Key)': Source or destination is blank."
            continue
        }

        if (-not (Test-Path $job.Source)) {
            $errors += "Job '$($job.Key)': Source path does not exist: $($job.Source)"
            continue
        }

        $provider = $cloud_providers.Providers[$job.Key]
        $matches = $provider.Destinations | Where-Object { $_ -eq $job.Dest }

        if (-not $matches) {
            $expected = $provider.Destinations -join ", "
            $errors += "Job '$($job.Key)': Destination must include one of: $expected"
            continue
        }

        $validJobs += $job
    }

    return [PSCustomObject]@{
        ValidJobs = $validJobs
        Errors    = $errors
    }
}


function Are-AllJobsValid {
    param (
        $jobs,
        $validJobs
    )

    if ($jobs.Count -eq 0) {
        return $false
    }

    return $validJobs.Count -eq $jobs.Count
}

function Build-BackupJobs {
    param (
        $gui,
        $cloud_providers
    )

    $jobs = @()

    foreach ($key in $cloud_providers.Providers.Keys) {
        $prefix = $cloud_providers.Providers[$key].Prefix
        $source = $gui."Txt${prefix}Source".Text

        if (-not [string]::IsNullOrWhiteSpace($source)) {
            $jobs += [PSCustomObject]@{
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
    }

    return $jobs
}

function Invoke-FileCopyOperation {
    param (
        [string]$source,
        [string]$dest,
        [string]$mode,
        $logBox,
        $progressBar
    )

    $baseArgs = @(
        "/Z",
        "/R:$ROBOCOPY_RETRIES",
        "/W:$ROBOCOPY_WAIT",
        "/MT:$ROBOCOPY_THREADS",
        "/TEE",
        "/NDL",
        "/NFL"
    )

    $modeArgs = if ($mode -eq "Mirror") { "/MIR" } else { "/E /XX" }
    $allArgs = @("`"$source`"", "`"$dest`"") + $baseArgs + $modeArgs

    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = "robocopy.exe"
    $psi.Arguments = $allArgs -join " "
    $psi.RedirectStandardOutput = $true
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true

    Write-Log -logBox $logBox -message "Starting $mode operation from $source to $dest"
    $process = Start-ProcessWithOutput -processStartInfo $psi -logBox $logBox -progressBar $progressBar
    Write-Log -logBox $logBox -message "$mode operation completed (Exit code: $($process.ExitCode))"
}

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
    while (-not $process.StandardOutput.EndOfStream) {
        $line = $process.StandardOutput.ReadLine()
        Write-Log -logBox $logBox -message $line
        Update-Progress -progressBar $progressBar -value (++$count % 100)
    }

    $process.WaitForExit()
    Update-Progress -progressBar $progressBar -value 100
    return $process
}

function Update-Progress {
    param (
        $progressBar,
        [int]$value
    )
    $progressBar.Value = [Math]::Min(100, $value)
    [System.Windows.Forms.Application]::DoEvents()
}

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
        $suffix = Get-ZipSuffix -frequency $frequency
        $zipPath = Join-Path $dest "$zipName-$suffix.zip"
        
        Write-Log -logBox $logBox -message "Starting zip operation for $source"
        Remove-ExistingZip -zipPath $zipPath -logBox $logBox
        Create-ZipArchive -source $source -destination $zipPath
        Write-Log -logBox $logBox -message "Successfully created zip: $zipPath"
        Manage-BackupRetention -dest $dest -zipName $zipName -keepCount $keepCount -logBox $logBox
    } catch {
        Write-Log -logBox $logBox -message "ERROR during zip operation: $($_.Exception.Message)" -Error
        [System.Windows.Forms.MessageBox]::Show("Zip operation failed: $($_.Exception.Message)", "Error", 'OK', 'Error')
    }
}

function Get-ZipSuffix {
    param ([string]$frequency)
    switch ($frequency) {
        "Daily"   { return (Get-Date).DayOfWeek.ToString().Substring(0,3) }
        "Weekly"  { return (Get-Date).AddDays(-([int](Get-Date).DayOfWeek)).ToString("yyyy-MM-dd") }
        "Monthly" { return (Get-Date).ToString("MMM") }
        default   { return "Backup" }
    }
}

function Remove-ExistingZip {
    param (
        [string]$zipPath,
        $logBox
    )
    if (Test-Path $zipPath) {
        Write-Log -logBox $logBox -message "Removing existing zip: $zipPath"
        Remove-Item $zipPath -Force
    }
}

function Create-ZipArchive {
    param (
        [string]$source,
        [string]$destination
    )
    [System.IO.Compression.ZipFile]::CreateFromDirectory($source, $destination, 'Optimal', $false)
}

function Manage-BackupRetention {
    param (
        [string]$dest,
        [string]$zipName,
        [int]$keepCount,
        $logBox
    )
    $zips = Get-ChildItem $dest -Filter "$zipName-*.zip" | Sort-Object LastWriteTime -Descending
    if ($zips.Count -gt $keepCount) {
        $zips | Select-Object -Skip $keepCount | Remove-Item -Force
        Write-Log -logBox $logBox -message "Enforced retention policy (kept $keepCount backups)"
    }
}

function Wait-ForSyncCompletion {
    param (
        $paths,
        $logBox
    )

    Write-Log -logBox $logBox -message "Monitoring sync status..."
    while ($true) {
        $allClear = $true
        foreach ($path in $paths) {
            if (-not (Test-Path $path)) { continue }

            $recent = Get-ChildItem -Path $path -Recurse -Force -ErrorAction SilentlyContinue |
                      Where-Object { $_.LastWriteTime -gt (Get-Date).AddSeconds(-$SYNC_WAIT_SECONDS) }

            if ($recent) {
                $allClear = $false
                Write-Log -logBox $logBox -message "Active sync detected in $path"
                break
            }
        }

        if ($allClear) { break }
        Start-Sleep -Seconds $SYNC_CHECK_INTERVAL
    }
    Write-Log -logBox $logBox -message "All sync operations completed"
}

# ============ UI FUNCTIONS ============

function New-MainForm {
    $form = New-Object Windows.Forms.Form
    $form.Text = "Cloud Backup Tool"
    $form.Size = New-Object Drawing.Size($FORM_WIDTH, $FORM_HEIGHT)
    $form.StartPosition = "CenterScreen"
    $form.Font = $DEFAULT_FONT
    return $form
}

function New-ProviderTabs {
    param ($providers, $settings, [ref]$controlMap)

    $tabControl = New-Object Windows.Forms.TabControl
    $tabControl.Size = New-Object Drawing.Size($TAB_CONTROL_WIDTH, $TAB_CONTROL_HEIGHT)
    $tabControl.Location = New-Object Drawing.Point($TAB_CONTROL_X, $TAB_CONTROL_Y)

    foreach ($entry in $providers.Providers.GetEnumerator()) {
        $tab = New-Object Windows.Forms.TabPage
        $tab.Text = $entry.Value.Label
        $controls = Add-ProviderControls -tab $tab -prefix $entry.Value.Prefix -settings $settings.$($entry.Key)
        $tabControl.TabPages.Add($tab)

        foreach ($key in $controls.Keys) {
            $controlMap.Value[$key] = $controls[$key]
        }
    }

    return $tabControl
}

function Add-ProviderControls {
    param (
        $tab,
        [string]$prefix,
        $settings
    )

    $controls = @{}
    $y = 10

    # Header
    $lblHeader = New-Object Windows.Forms.Label
    $lblHeader.Text = $tab.Text
    $lblHeader.Font = $HEADER_FONT
    $lblHeader.Location = New-Object Drawing.Point(10, $y)
    $lblHeader.Size = New-Object Drawing.Size(300, 25)
    $tab.Controls.Add($lblHeader)
    $y += 30

    # Source/Destination
    foreach ($type in @("Source", "Dest")) {
        $row = New-LabelTextBrowseRow -label "$($tab.Text) $type" -value $settings.$type -y $y
        $tab.Controls.AddRange(@($row.Label, $row.TextBox, $row.Button))
        $controls["Txt${prefix}${type}"] = $row.TextBox
        $y += 30
    }

    # Backup Type
    $grpType = New-Object Windows.Forms.GroupBox
    $grpType.Text = "Backup Type"
    $grpType.Location = New-Object Drawing.Point(10, $y)
    $grpType.Size = New-Object Drawing.Size($GROUPBOX_WIDTH, $GROUPBOX_HEIGHT)
    $tab.Controls.Add($grpType)

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

    # Explanation
    $lblExplain = New-Object Windows.Forms.Label
    $lblExplain.Text = ""
    $lblExplain.Location = New-Object Drawing.Point(10, $y)
    $lblExplain.Size = New-Object Drawing.Size($EXPLAIN_LABEL_WIDTH, $EXPLAIN_LABEL_HEIGHT)
    $lblExplain.TextAlign = 'TopLeft'
    $lblExplain.ForeColor = $EXPLAIN_TEXT_COLOR
    $tab.Controls.Add($lblExplain)
    $controls["Lbl${prefix}Explain"] = $lblExplain
    $y += 25

    # File Mode
    $grpMode = New-Object Windows.Forms.GroupBox
    $grpMode.Text = "File Mode"
    $grpMode.Location = New-Object Drawing.Point(10, $y)
    $grpMode.Size = New-Object Drawing.Size($GROUPBOX_WIDTH, $GROUPBOX_HEIGHT)
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

    # Mode Explanation
    $lblModeExplain = New-Object Windows.Forms.Label
    $lblModeExplain.Text = ""
    $lblModeExplain.Location = New-Object Drawing.Point(10, $y)
    $lblModeExplain.Size = New-Object Drawing.Size($EXPLAIN_LABEL_WIDTH, $EXPLAIN_LABEL_HEIGHT)
    $lblModeExplain.TextAlign = 'TopLeft'
    $lblModeExplain.ForeColor = $MODE_EXPLAIN_TEXT_COLOR
    $tab.Controls.Add($lblModeExplain)
    $controls["Lbl${prefix}ModeExplain"] = $lblModeExplain
    $y += 25

    # Zip Settings
    $lblFreq = New-Object Windows.Forms.Label
    $lblFreq.Text = "Frequency:"
    $lblFreq.Location = New-Object Drawing.Point(10, $y)
    $tab.Controls.Add($lblFreq)

    $cmbFreq = New-Object Windows.Forms.ComboBox
    $cmbFreq.Items.AddRange($DEFAULT_FREQUENCIES)
    $cmbFreq.DropDownStyle = 'DropDownList'
    $cmbFreq.SelectedItem = $settings.Freq
    $cmbFreq.Location = New-Object Drawing.Point(160, $y)
    $cmbFreq.Size = New-Object Drawing.Size(100, $CONTROL_HEIGHT)
    $tab.Controls.Add($cmbFreq)
    $controls["Cmb${prefix}Freq"] = $cmbFreq
    $y += 30

    $lblName = New-Object Windows.Forms.Label
    $lblName.Text = "Zip Backup Name:"
    $lblName.Location = New-Object Drawing.Point(10, $y)
    $tab.Controls.Add($lblName)

    $txtName = New-Object Windows.Forms.TextBox
    $txtName.Text = $settings.Name
    $txtName.Location = New-Object Drawing.Point(160, $y)
    $txtName.Size = New-Object Drawing.Size($TEXTBOX_WIDTH, $CONTROL_HEIGHT)
    $tab.Controls.Add($txtName)
    $controls["Txt${prefix}ZipName"] = $txtName
    $y += 30

    $lblKeep = New-Object Windows.Forms.Label
    $lblKeep.Text = "Zips to keep:"
    $lblKeep.Location = New-Object Drawing.Point(10, $y)
    $tab.Controls.Add($lblKeep)

    $numKeep = New-Object Windows.Forms.NumericUpDown
    $numKeep.Value = if ($settings.Keep) { $settings.Keep } else { $DEFAULT_KEEP_COUNT }
    $numKeep.Location = New-Object Drawing.Point(160, $y)
    $numKeep.Size = New-Object Drawing.Size(100, $CONTROL_HEIGHT)
    $tab.Controls.Add($numKeep)
    $controls["Num${prefix}Keep"] = $numKeep

    # Set initial states
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

    # Event handlers
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
            $keep = if ($keepBox) { $keepBox.Value } else { $DEFAULT_KEEP_COUNT }

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

    $rdoMirror.Tag = $lblModeExplain
    $rdoMirror.Add_CheckedChanged({
        if ($this.Checked) { $this.Tag.Text = "Mirror:`nDestination will exactly match the source (files deleted if missing in source)." }
    })

    $rdoAppend.Tag = $lblModeExplain
    $rdoAppend.Add_CheckedChanged({
        if ($this.Checked) { $this.Tag.Text = "Append:`nAdds new files and overwrites changed ones without deleting anything in the destination." }
    })

    return $controls
}

function New-LabelTextBrowseRow {
    param (
        [string]$label,
        [string]$value,
        [int]$y
    )

    $lbl = New-Object Windows.Forms.Label
    $lbl.Text = "${label}:"
    $lbl.Location = New-Object Drawing.Point(10, $y)
    $lbl.Size = New-Object Drawing.Size($LABEL_WIDTH, $CONTROL_HEIGHT)

    $txtBox = New-Object Windows.Forms.TextBox
    $txtBox.Text = $value
    $txtBox.Location = New-Object Drawing.Point(160, $y)
    $txtBox.Size = New-Object Drawing.Size($TEXTBOX_WIDTH, $CONTROL_HEIGHT)

    $btn = New-Object Windows.Forms.Button
    $btn.Text = "Browse"
    $btn.Location = New-Object Drawing.Point(560, $y)
    $btn.Size = New-Object Drawing.Size($BROWSE_BTN_WIDTH, $CONTROL_HEIGHT)
    $btn.Tag = $txtBox

    $btn.Add_Click({
        $folder = Browse-Folder -initialPath $this.Tag.Text
        if ($folder) { $this.Tag.Text = $folder }
    })

    return @{ Label = $lbl; TextBox = $txtBox; Button = $btn }
}

function Browse-Folder {
    param ($initialPath)
    
    $dialog = New-Object System.Windows.Forms.FolderBrowserDialog
    if ($initialPath -and (Test-Path $initialPath)) {
        $dialog.SelectedPath = $initialPath
    }
    
    if ($dialog.ShowDialog() -eq "OK") {
        return $dialog.SelectedPath
    }
    return $null
}

function New-ProgressBar {
    $progressBar = New-Object Windows.Forms.ProgressBar
    $progressBar.Location = New-Object Drawing.Point($TAB_CONTROL_X, $PROGRESS_BAR_Y)
    $progressBar.Size = New-Object Drawing.Size($($TAB_CONTROL_WIDTH - 10), 20)
    $progressBar.Minimum = 0
    $progressBar.Maximum = 100
    return $progressBar
}

function New-LogBox {
    $logBox = New-Object Windows.Forms.TextBox
    $logBox.Multiline = $true
    $logBox.ScrollBars = "Vertical"
    $logBox.ReadOnly = $true
    $logBox.BackColor = $LOG_BOX_BACK_COLOR
    $logBox.ForeColor = $LOG_BOX_FORE_COLOR
    $logBox.Font = $LOG_FONT
    $logBox.Location = New-Object Drawing.Point($TAB_CONTROL_X, $LOG_BOX_Y)
    $logBox.Size = New-Object Drawing.Size($($TAB_CONTROL_WIDTH - 10), $LOG_BOX_HEIGHT)
    return $logBox
}

function New-Buttons {
    $totalWidth = $BTN_CANCEL_WIDTH + $BTN_SPACING + $BTN_BACKUP_WIDTH + $BTN_SPACING + $BTN_SHUTDOWN_WIDTH
    $startX = [math]::Floor(($FORM_WIDTH - $totalWidth) / 2)

    $btnCancel = New-Object Windows.Forms.Button
    $btnCancel.Text = "Cancel"
    $btnCancel.Size = New-Object Drawing.Size($BTN_CANCEL_WIDTH, $BTN_HEIGHT)
    $btnCancel.Location = New-Object Drawing.Point($startX, $BUTTONS_START_Y)

    $btnBackup = New-Object Windows.Forms.Button
    $btnBackup.Text = "Backup"
    $btnBackup.Size = New-Object Drawing.Size($BTN_BACKUP_WIDTH, $BTN_HEIGHT)
    $btnBackup.Location = New-Object Drawing.Point($($startX + $BTN_CANCEL_WIDTH + $BTN_SPACING), $BUTTONS_START_Y)

    $btnShutdown = New-Object Windows.Forms.Button
    $btnShutdown.Text = "Backup && Shutdown"
    $btnShutdown.Size = New-Object Drawing.Size($BTN_SHUTDOWN_WIDTH, $BTN_HEIGHT)
    $btnShutdown.Location = New-Object Drawing.Point($($startX + $BTN_CANCEL_WIDTH + $BTN_SPACING + $BTN_BACKUP_WIDTH + $BTN_SPACING), $BUTTONS_START_Y)

    return @{
        Cancel = $btnCancel
        Backup = $btnBackup
        Shutdown = $btnShutdown
    }
}

# ============ MAIN WORKFLOW ============

function Start-BackupProcess {
    param (
        $jobs,
        $gui
    )

    foreach ($job in $jobs) {
        if ($job.Zip) {
            Invoke-ZipOperation -source $job.Source -dest $job.Dest `
                -zipName $job.ZipName -frequency $job.Frequency `
                -keepCount $job.Keep -logBox $gui.LogBox
        } else {
            $mode = if ($job.Mirror) { "Mirror" } else { "Append" }
            Invoke-FileCopyOperation -source $job.Source -dest $job.Dest `
                -mode $mode -logBox $gui.LogBox -progressBar $gui.ProgressBar
        }
    }

    $destPaths = $jobs.Dest | Where-Object { -not [string]::IsNullOrEmpty($_) }
    if ($destPaths) {
        Wait-ForSyncCompletion -paths $destPaths -logBox $gui.LogBox
    }

    Write-Log -logBox $gui.LogBox -message "Backup process completed"
    Start-Sleep -Seconds $POST_BACKUP_DELAY
}




# ============ APPLICATION ENTRY POINT ============

function Main {
    try {
        $cloud_providers = Load-CloudProviders -jsonPath $PROVIDERSPATH
        $settings = Initialize-BackupSettings -settingsPath $SETTINGSPATH -providers $cloud_providers

        $form = New-MainForm
        $controlMap = @{}
        $tabControl = New-ProviderTabs -providers $cloud_providers -settings $settings -controlMap ([ref]$controlMap)
        $progressBar = New-ProgressBar
        $logBox = New-LogBox
        $buttons = New-Buttons

        $form.Controls.Add($tabControl)
        $form.Controls.Add($progressBar)
        $form.Controls.Add($logBox)
        $form.Controls.Add($buttons.Cancel)
        $form.Controls.Add($buttons.Backup)
        $form.Controls.Add($buttons.Shutdown)

        $gui = [PSCustomObject]@{
            Form = $form
            LogBox = $logBox
            ProgressBar = $progressBar
            BtnCancel = $buttons.Cancel
            BtnBackup = $buttons.Backup
            BtnShutdown = $buttons.Shutdown
        }

        foreach ($key in $controlMap.Keys) {
            $gui | Add-Member -MemberType NoteProperty -Name $key -Value $controlMap[$key]
        }

        $gui.BtnCancel.Add_Click({ 
            $gui.Form.Close() 
        })
        $gui.BtnBackup.Add_Click({
            Save-CurrentSettings -gui $gui -providers $cloud_providers -settingsPath $SETTINGSPATH
            $jobs = Build-BackupJobs -gui $gui -cloud_providers $cloud_providers

            $result = Get-ValidBackupJobs -jobs $jobs -cloud_providers $cloud_providers -logBox $gui.LogBox
            $validJobs = $result.ValidJobs
            $errors = $result.Errors

            if ($errors.Count -gt 0) {
                foreach ($err in $errors) {
                    Write-Log -logBox $gui.LogBox -message $err -Error
                }
                Write-Log -logBox $gui.LogBox -message "One or more jobs are invalid. Backup cancelled." -Error
                return
            }

            Start-BackupProcess -jobs $validJobs -gui $gui
            $gui.Form.Close()
        })


        $gui.BtnShutdown.Add_Click({
            Save-CurrentSettings -gui $gui -providers $cloud_providers -settingsPath $SETTINGSPATH
            $jobs = Build-BackupJobs -gui $gui -cloud_providers $cloud_providers

            $result = Get-ValidBackupJobs -jobs $jobs -cloud_providers $cloud_providers -logBox $gui.LogBox
            $validJobs = $result.ValidJobs
            $errors = $result.Errors

            if ($errors.Count -gt 0) {
                foreach ($err in $errors) {
                    Write-Log -logBox $gui.LogBox -message $err -Error
                }
                Write-Log -logBox $gui.LogBox -message "One or more jobs are invalid. Backup cancelled." -Error
                return
            }

            Start-BackupProcess -jobs $validJobs -gui $gui
            Write-Log -logBox $gui.LogBox -message "Initiating system shutdown..."
            Stop-Computer -Force
        })

        [void]$form.ShowDialog()
    }
    catch {
        [System.Windows.Forms.MessageBox]::Show("Fatal error: $($_.Exception.Message)", "Error", 'OK', 'Error')
    }
}

# Start the application
Main