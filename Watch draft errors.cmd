@echo off
setlocal
for /f "usebackq delims=" %%I in (`node "%~dp0scripts\work-directory.mjs"`) do set "BLOG_PREVIEW_ERROR_LOG=%%I\local-authoring-error.log"
powershell.exe -NoProfile -Command "$ErrorActionPreference = 'Stop'; Write-Host 'Draft preview errors' -ForegroundColor Cyan; Write-Host 'Showing recent errors, then watching for new ones. Check the timestamps.'; Write-Host 'Old errors remain after you fix them. Save your post to retry compilation.'; Write-Host 'Press Ctrl+C or close this window to stop watching; the preview keeps running.'; Write-Host ''; if (-not (Test-Path -LiteralPath $env:BLOG_PREVIEW_ERROR_LOG -PathType Leaf)) { Write-Host 'Waiting for the log. Run Start draft preview.cmd to start the preview.'; while (-not (Test-Path -LiteralPath $env:BLOG_PREVIEW_ERROR_LOG -PathType Leaf)) { Start-Sleep -Seconds 1 } }; Get-Content -LiteralPath $env:BLOG_PREVIEW_ERROR_LOG -Encoding UTF8 -Tail 20 -Wait"
if errorlevel 1 pause
endlocal
