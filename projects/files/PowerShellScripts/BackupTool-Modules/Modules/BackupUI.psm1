<#
.SYNOPSIS
Main backup form and UI components
#>

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

function New-MainForm {
    <#
    .SYNOPSIS
    Creates and returns the main form for the Cloud Backup Tool GUI.
    #>
    # ... (keep all existing implementation with comments) ...
}

function New-ProviderTabs {
    <#
    .SYNOPSIS
    Creates a tab control containing one tab per cloud provider.
    #>
    # ... (keep all existing implementation with comments) ...
}

function Add-ProviderControls {
    <#
    .SYNOPSIS
    Adds all GUI controls for a cloud provider's backup tab.
    #>
    # ... (keep all existing implementation with comments) ...
}

function New-ProgressBar {
    <#
    .SYNOPSIS
    Creates and returns a progress bar positioned below the tab control.
    #>
    # ... (keep all existing implementation with comments) ...
}

function New-LogBox {
    <#
    .SYNOPSIS
    Creates and returns a read-only multi-line text box for displaying log output.
    #>
    # ... (keep all existing implementation with comments) ...
}

function New-Buttons {
    <#
    .SYNOPSIS
    Creates and returns Cancel, Backup, and Backup & Shutdown buttons.
    #>
    # ... (keep all existing implementation with comments) ...
}

Export-ModuleMember -Function New-MainForm, New-ProviderTabs, Add-ProviderControls, 
    New-ProgressBar, New-LogBox, New-Buttons