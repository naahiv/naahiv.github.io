@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\local-authoring.ps1" -Mode Stop %*
if errorlevel 1 pause
