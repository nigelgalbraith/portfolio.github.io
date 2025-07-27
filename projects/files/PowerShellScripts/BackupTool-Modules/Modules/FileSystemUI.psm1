<#
.SYNOPSIS
UI components for file system interaction
#>

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

function Show-MultiFolderFilePicker {
    <#
    .SYNOPSIS
    Displays a multi-select folder and file picker TreeView.
    #>
    # ... (keep all existing implementation with comments) ...
}

function Browse-Folder {
    <#
    .SYNOPSIS
    Opens a folder browser dialog and returns the selected path.
    #>
    # ... (keep all existing implementation with comments) ...
}

function New-LabelTextBrowseRow {
    <#
    .SYNOPSIS
    Creates a labeled text box with a browse button for folder selection.
    #>
    # ... (keep all existing implementation with comments) ...
}

Export-ModuleMember -Function Show-MultiFolderFilePicker, Browse-Folder, New-LabelTextBrowseRow