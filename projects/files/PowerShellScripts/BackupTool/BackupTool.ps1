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
# ===================================


# ===============================
# LOAD CLOUD PROVIDER CONFIG
# ===============================
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


# ===================================
# LOAD BACKUP SETTINGS FROM JSON FILE
# ===================================
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


# =======================================
# SAVE CURRENT GUI FIELD VALUES TO JSON
# =======================================
function Save-Settings($gui, $providers, $settingsPath) {
    $settings = @{}

    # Loop through each provider and collect form values
    foreach ($key in $providers.Providers.Keys) {
        $prefix = $providers.Providers[$key].Prefix

        # Collect values from GUI controls using the prefix
        $settings[$key] = @{
            Source = $gui."Txt${prefix}Source".Text
            Dest   = $gui."Txt${prefix}Dest".Text
            Zip    = $gui."Chk${prefix}Zip".Checked
            Name   = $gui."Txt${prefix}ZipName".Text
            Freq   = $gui."Cmb${prefix}Freq".SelectedItem
            Keep   = $gui."Num${prefix}Keep".Value
        }
    }

    # Convert settings to JSON and write to disk
    $settings | ConvertTo-Json -Depth 10 | Set-Content -Path $settingsPath -Encoding UTF8
}


# ===============================
# OPENS A FOLDER SELECTION DIALOG
# ===============================
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


# ==========================================
# RETURNS A SUFFIX BASED ON BACKUP FREQUENCY
# USED TO CREATE UNIQUE ZIP FILENAMES
# ==========================================
function Get-ZipSuffix($frequency) {
    switch ($frequency) {
        "Daily" {
            # e.g., "Mon", "Tue"
            return (Get-Date).DayOfWeek.ToString().Substring(0,3)
        }
        "Weekly" {
            # e.g., "2025-07-22" — start of the week (Monday)
            return (Get-Date).AddDays(-(Get-Date).DayOfWeek.value__).ToString("yyyy-MM-dd")
        }
        "Monthly" {
            # e.g., "Jul"
            return (Get-Date).ToString("MMM")
        }
    }
}


# ===========================================================
# WAITS FOR CLOUD SYNC TO FINISH BY MONITORING WRITE ACTIVITY
# PREVENTS SHUTDOWN WHILE FILES ARE STILL SYNCING
# ===========================================================
function Wait-ForSync($paths, $logBox) {
    $logBox.AppendText("Checking sync status...`r`n")

    while ($true) {
        $allClear = $true

        foreach ($path in $paths) {
            # Skip non-existent paths
            if (-not (Test-Path $path)) { continue }

            # Get recently modified files in the last 10 seconds
            $recent = Get-ChildItem -Path $path -Recurse -Force -ErrorAction SilentlyContinue |
                      Where-Object { $_.LastWriteTime -gt (Get-Date).AddSeconds(-10) }

            if ($recent.Count -gt 0) {
                # If there’s recent activity, sync is not complete
                $allClear = $false
                $logBox.AppendText("Waiting for sync to settle in: $path`r`n")
                break
            }
        }

        # Exit loop if all paths are clear
        if ($allClear) { break }

        # Wait before checking again
        Start-Sleep -Seconds 5
    }

    $logBox.AppendText("Sync complete.`r`n")
}

# =================
# BACKUP CORE LOGIC
# =================
function Perform-Backup {
    param (
        [string]$source,        # Source folder to back up
        [string]$dest,          # Destination folder to copy/zip to
        [bool]$zip,             # Whether to zip the backup
        [string]$zipName,       # Name prefix for the zip file
        [string]$frequency,     # Zip suffix frequency (Daily/Weekly/Monthly)
        [int]$keepCount,        # Number of zip backups to retain
        $logBox,                # TextBox for logging messages to the GUI
        $progressBar,           # ProgressBar control to show progress
        $providers,             # All provider configuration data
        [string]$providerKey    # Key identifying which provider this job uses
    )

    # If the source path is empty, skip validation (nothing to back up)
    if ([string]::IsNullOrWhiteSpace($source)) {
        $provider = $providers.Providers[$providerKey]
        $logBox.AppendText("No source path provided. Skipping job for provider '$($provider.Label)'.`r`n")
        return
    }

    $logBox.AppendText("Backing up from '$source' to '$dest'`r`n")

    # Validate source path
    if (-not (Test-Path $source)) {
        $logBox.AppendText("ERROR: Source path '$source' does not exist.`r`n")
        [System.Windows.Forms.MessageBox]::Show("Source path '$source' does not exist.", "Backup Error", 'OK', 'Error')
        return
    }


    # Get provider data from key
    $provider = $providers.Providers[$providerKey]

    # Check if destination is within allowed paths for the provider
    $isAllowed = $false
    foreach ($allowed in $provider.Destinations) {
        if ($dest -like "*$allowed*") {
            $isAllowed = $true
            break
        }
    }

    # If destination is not valid, show a warning and exit
    if (-not $isAllowed) {
        $allowedPaths = $provider.Destinations -join ", "
        $msg = "Destination '$dest' is not allowed for provider '$($provider.Label)'.`n" +
               "Valid destination paths: $allowedPaths.`nBackup skipped for safety."
        $logBox.AppendText("ERROR: $msg`r`n")
        [System.Windows.Forms.MessageBox]::Show($msg, "Backup Skipped", 'OK', 'Warning')
        return
    }

    # ====== PERFORM ZIP BACKUP ======
    if ($zip) {
        # Generate suffix based on backup frequency
        $suffix = Get-ZipSuffix $frequency
        $zipPath = Join-Path $dest "$zipName-$suffix.zip"

        # Remove existing zip if present
        if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

        # List all files to be zipped in the log
        $logBox.AppendText("Zipping the following files:`r`n")
        Get-ChildItem -Path $source -Recurse -Force | ForEach-Object {
            $logBox.AppendText("$($_.FullName)`r`n")
        }

        try {
            # Load .NET ZipFile class and zip the folder
            Add-Type -AssemblyName System.IO.Compression.FileSystem
            [System.IO.Compression.ZipFile]::CreateFromDirectory($source, $zipPath, 'Optimal', $false)
            $logBox.AppendText("Created zip (full folder): $zipPath`r`n")
        }
        catch {
            # If zipping fails, report error
            $logBox.AppendText("ERROR during zip: $_`r`n")
            [System.Windows.Forms.MessageBox]::Show("Error during zip: $_", "Zip Failed", 'OK', 'Error')
            return
        }

        # Prune older zip backups to keep only the most recent ones
        $zips = Get-ChildItem $dest -Filter "$zipName-*.zip" | Sort-Object LastWriteTime -Descending
        if ($zips.Count -gt $keepCount) {
            $zips | Select-Object -Skip $keepCount | Remove-Item -Force
            $logBox.AppendText("Deleted old backups.`r`n")
        }
    }

    # ====== PERFORM ROBOCOPY BACKUP ======
    else {
        $logBox.AppendText("Running Robocopy...`r`n")

        # Prepare and configure the Robocopy process
        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = "robocopy.exe"
        $psi.Arguments = "`"$source`" `"$dest`" /E /XX /Z /R:3 /W:5 /MT:8 /TEE /NDL /NFL"
        $psi.RedirectStandardOutput = $true
        $psi.UseShellExecute = $false
        $psi.CreateNoWindow = $true

        $process = New-Object System.Diagnostics.Process
        $process.StartInfo = $psi
        $null = $process.Start()

        # Read Robocopy output line by line and update progress bar
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

        # Wait for robocopy to finish
        $process.WaitForExit()
        $progressBar.Value = 100
        $logBox.AppendText("Robocopy finished with exit code $($process.ExitCode)`r`n")
    }
}




# ===============================
# GUI TAB BUILDER FOR EACH CLOUD
# ===============================
function Add-PathSection {
    param (
        $tab,                    # The TabPage control this section will be added to
        [string]$prefix,         # Unique prefix used to name controls
        [string]$title,          # Title label for the section
        $settings,               # Settings object containing default values
        [int]$topBase            # Starting vertical position offset
    )

    # Helper function: creates a label, textbox, and browse button row
    function AddLabelTextboxBrowse($label, $top, $value) {
        # Create label for the field
        $lbl = New-Object Windows.Forms.Label
        $lbl.Text = "${label}:"; $lbl.Location = "10,$top"; $lbl.Size = '150,20'

        # Create textbox for folder input
        $txtBox = New-Object Windows.Forms.TextBox
        $txtBox.Text = $value; $txtBox.Size = '390,20'; $txtBox.Location = "160,$top"

        # Create 'Browse' button to open folder dialog
        $btn = New-Object Windows.Forms.Button
        $btn.Text = "Browse"; $btn.Size = '80,20'; $btn.Location = "560,$top"

        # Link the button to the textbox using the Tag property
        $btn.Tag = $txtBox
        $btn.Add_Click({
            $txt = $this.Tag
            $folder = Browse-Folder $txt.Text
            if ($folder) { $txt.Text = $folder }
        })

        # Add all three controls to the tab
        $tab.Controls.AddRange(@($lbl, $txtBox, $btn))
        return $txtBox
    }

    # Start vertical layout at provided base Y coordinate
    $y = $topBase

    # Add title heading
    $tab.Controls.Add((New-Object Windows.Forms.Label -Property @{
        Text = $title
        Font = 'Microsoft Sans Serif, 10pt, style=Bold'
        Location = "10,$y"; Size = '300,25'
    }))
    $y += 30

    # Add Source and Destination path rows with browse buttons
    $txtSource = AddLabelTextboxBrowse "$title Source" $y $settings.Source; $y += 30
    $txtDest   = AddLabelTextboxBrowse "$title Destination" $y $settings.Dest; $y += 30

    # Add Zip Backup checkbox
    $chkZip = New-Object Windows.Forms.CheckBox
    $chkZip.Text = "Zip Backup"
    $chkZip.Checked = $settings.Zip
    $chkZip.Location = "10,$y"
    $tab.Controls.Add($chkZip); $y += 30

    # Add Frequency dropdown (Daily, Weekly, Monthly)
    $tab.Controls.Add((New-Object Windows.Forms.Label -Property @{ Text = "Frequency:"; Location = "10,$y" }))
    $cmbFreq = New-Object Windows.Forms.ComboBox
    $cmbFreq.Items.AddRange(@("Daily", "Weekly", "Monthly"))
    $cmbFreq.Size = '100,20'
    $cmbFreq.Location = "160,$y"
    $cmbFreq.DropDownStyle = 'DropDownList'
    $cmbFreq.SelectedItem = $settings.Freq
    $tab.Controls.Add($cmbFreq); $y += 30

    # Add input for zip backup name
    $tab.Controls.Add((New-Object Windows.Forms.Label -Property @{ Text = "Zip Backup Name:"; Location = "10,$y" }))
    $txtName = New-Object Windows.Forms.TextBox
    $txtName.Text = $settings.Name
    $txtName.Location = "160,$y"; $txtName.Size = '390,20'
    $tab.Controls.Add($txtName); $y += 30

    # Add numeric control to choose how many zip backups to keep
    $tab.Controls.Add((New-Object Windows.Forms.Label -Property @{ Text = "Zips to keep:"; Location = "10,$y" }))
    $numKeep = New-Object Windows.Forms.NumericUpDown
    $numKeep.Value = $settings.Keep
    $numKeep.Size = '100,20'
    $numKeep.Location = "160,$y"
    $tab.Controls.Add($numKeep)

    # Return a hashtable of all created controls for later access
    return @{
        "Txt${prefix}Source"  = $txtSource
        "Txt${prefix}Dest"    = $txtDest
        "Chk${prefix}Zip"     = $chkZip
        "Cmb${prefix}Freq"    = $cmbFreq
        "Txt${prefix}ZipName" = $txtName
        "Num${prefix}Keep"    = $numKeep
    }
}


# ======================
# GUI FORM CONSTRUCTOR
# ======================
function New-BackupForm($providers, $settings) {
    # Create main form window
    $form = New-Object Windows.Forms.Form
    $form.Text = "Backup and Logoff"
    $form.Size = "700,740"
    $form.StartPosition = "CenterScreen"

    # Create a tab control to hold one tab per cloud provider
    $tabControl = New-Object Windows.Forms.TabControl
    $tabControl.Size = "690,300"
    $tabControl.Location = "10,10"

    # Hashtable to store all dynamically created controls (textboxes, checkboxes, etc.)
    $controlMap = @{}

    # Loop through each cloud provider from the loaded configuration
    foreach ($entry in $providers.Providers.GetEnumerator()) {
        $key    = $entry.Key        # Provider key, e.g., "GoogleDrive"
        $data   = $entry.Value      # Provider config object
        $prefix = $data.Prefix      # Prefix used to uniquely name the controls
        $label  = $data.Label       # User-friendly display name for the tab

        # Create a new tab for this provider
        $tab = New-Object Windows.Forms.TabPage
        $tab.Text = $label

        # Add UI controls (source, destination, zip options, etc.) for this provider
        $controls = Add-PathSection -tab $tab -prefix $prefix -title $label -settings $settings.$key -topBase 10

        # Add the completed tab to the tab control
        $tabControl.TabPages.Add($tab)

        # Merge generated controls into the master controlMap
        $controls.GetEnumerator() | ForEach-Object {
            $controlMap["$($_.Key)"] = $_.Value
        }
    }

    # Centered positions
    $formWidth = 700
    $buttonSpacing = 20
    $buttonWidth1 = 150
    $buttonWidth2 = 180
    $totalWidth = $buttonWidth1 + $buttonSpacing + $buttonWidth2
    $startX = [math]::Floor(($formWidth - $totalWidth) / 2)

    # Quick Shutdown Button
    $btnQuick = New-Object Windows.Forms.Button
    $btnQuick.Text = "Quick Shutdown"
    $btnQuick.Size = "$buttonWidth1,30"
    $btnQuick.Location = "$startX,330"

    # Backup and Shutdown Button
    $btnBackup = New-Object Windows.Forms.Button
    $btnBackup.Text = "Backup and Shutdown"
    $btnBackup.Size = "$buttonWidth2,30"
    $btnBackup.Location = "$($startX + $buttonWidth1 + $buttonSpacing),330"

    # Progress Bar
    $progressBar = New-Object Windows.Forms.ProgressBar
    $progressBar.Location = "10,370"
    $progressBar.Size = "680,20"
    $progressBar.Minimum = 0
    $progressBar.Maximum = 100

    # Log Box
    $logBox = New-Object Windows.Forms.TextBox
    $logBox.Multiline = $true
    $logBox.ScrollBars = "Vertical"
    $logBox.ReadOnly = $true
    $logBox.BackColor = "Black"
    $logBox.ForeColor = "Lime"
    $logBox.Font = "Consolas, 9pt"
    $logBox.Location = "10,400"
    $logBox.Size = "680,280"

    # Add all major controls to the form
    $form.Controls.AddRange(@($tabControl, $logBox, $progressBar, $btnQuick, $btnBackup))

    # Return a combined object of all created controls for external reference
    return ($controlMap + @{
        Form = $form
        LogBox = $logBox
        ProgressBar = $progressBar
        BtnQuick = $btnQuick
        BtnBackup = $btnBackup
    })
}

# =========
# MAIN LOOP
# =========
function Main {
    # Load cloud provider configuration from JSON
    $cloud_providers = Load-CloudProviders $PROVIDERSPATH

    # Load saved backup settings or apply defaults
    $settings = Load-Settings -providers $cloud_providers -settingsPath $SETTINGSPATH

    # Build the GUI form and cast it as a PowerShell object with properties (controls, buttons, etc.)
    $gui = New-Object PSObject -Property (New-BackupForm -providers $cloud_providers -settings $settings)

    # Handle "Quick Shutdown" — just close the form without doing any backup
    $gui.BtnQuick.Add_Click({ $gui.Form.Close() })

    # Handle "Backup and Shutdown" button click
    $gui.BtnBackup.Add_Click({

        # Save the current form settings back to the settings JSON file
        Save-Settings -gui $gui -providers $cloud_providers -settingsPath $SETTINGSPATH

        # Prepare list of backup jobs (one per provider) using control values
        $jobs = @()
        foreach ($key in $cloud_providers.Providers.Keys) {
            $prefix = $cloud_providers.Providers[$key].Prefix
            $jobs += @{
                key  = $key  # Track which provider this job belongs to
                src  = $gui."Txt${prefix}Source".Text
                dst  = $gui."Txt${prefix}Dest".Text
                zip  = $gui."Chk${prefix}Zip".Checked
                name = $gui."Txt${prefix}ZipName".Text
                freq = $gui."Cmb${prefix}Freq".SelectedItem
                keep = $gui."Num${prefix}Keep".Value
            }
        }

        # Run each job by calling the Perform-Backup function
        foreach ($job in $jobs) {
            Perform-Backup -source $job.src -dest $job.dst -zip:$job.zip `
                -zipName $job.name -frequency $job.freq -keepCount $job.keep `
                -logBox $gui.LogBox -progressBar $gui.ProgressBar `
                -providers $cloud_providers -providerKey $job.key
        }

        # Gather destination paths and wait for cloud sync to settle before closing
        $pathsToCheck = @()
        foreach ($key in $cloud_providers.Providers.Keys) {
            $prefix = $cloud_providers.Providers[$key].Prefix
            $destPath = $gui."Txt${prefix}Dest".Text

            if ($destPath) {
                $pathsToCheck += $destPath
            } else {
                $gui.LogBox.AppendText("Skipping sync check for provider '$($cloud_providers.Providers[$key].Label)' — no destination path provided.`r`n")
            }
        }
        Wait-ForSync -paths $pathsToCheck -logBox $gui.LogBox

        # Notify user and exit
        $gui.LogBox.AppendText("Backup finished. Exiting...`r`n")
        Start-Sleep -Seconds 3
        $gui.Form.Close()
    })

    # Show the form and wait for user interaction
    [void]$gui.Form.ShowDialog()
}


# ==== START ====
Main
