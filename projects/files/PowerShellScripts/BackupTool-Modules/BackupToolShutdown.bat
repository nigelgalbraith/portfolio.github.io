@echo off
:: Get the folder of this script
set SCRIPT_DIR=%~dp0

:: Run the PowerShell GUI backup script and wait
powershell.exe -ExecutionPolicy Bypass -NoProfile -WindowStyle Normal -File "%SCRIPT_DIR%BackupTool.ps1"

