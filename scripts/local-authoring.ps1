param(
    [ValidateSet('Start', 'Stop')][string]$Mode = 'Start',
    [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$workDirectory = (& node (Join-Path $PSScriptRoot 'work-directory.mjs') | Out-String).Trim()
if ($LASTEXITCODE -ne 0 -or -not [System.IO.Path]::IsPathRooted($workDirectory)) {
    throw 'Could not locate the external website working directory.'
}
$previewUrl = 'http://127.0.0.1:4323/blog/'
$identityUrl = 'http://127.0.0.1:4323/__local-authoring.json'
$wslExecutable = (Get-Command wsl.exe -ErrorAction Stop).Source
$linuxRoot = (& $wslExecutable -d Ubuntu --exec wslpath -a -u $repoRoot | Out-String).Trim()
if ($LASTEXITCODE -ne 0 -or -not $linuxRoot.StartsWith('/')) {
    throw 'Could not open the website folder through WSL Ubuntu.'
}
$linuxWork = (& $wslExecutable -d Ubuntu --exec wslpath -a -u $workDirectory | Out-String).Trim()
if ($LASTEXITCODE -ne 0 -or -not $linuxWork.StartsWith('/')) {
    throw 'Could not resolve the external working directory through WSL Ubuntu.'
}

function Read-PreviewIdentity {
    try {
        $identity = Invoke-RestMethod -Uri $identityUrl -TimeoutSec 2
        if ($identity.protocol -eq 'naahiv-local-authoring-v1' -and $identity.root -eq $linuxRoot) {
            return $identity
        }
    } catch { }
    return $null
}

if ($Mode -eq 'Stop') {
    & $wslExecutable -d Ubuntu --cd $linuxRoot --exec env "WEBSITE_WORK_DIR=$linuxWork" node scripts/local-dev.mjs stop
    if ($LASTEXITCODE -ne 0) { throw 'Could not stop this checkout''s draft preview.' }
    exit 0
}

if (-not (Read-PreviewIdentity)) {
    $statusText = & $wslExecutable -d Ubuntu --cd $linuxRoot --exec env "WEBSITE_WORK_DIR=$linuxWork" node scripts/local-dev.mjs status
    if ($LASTEXITCODE -ne 0) { throw 'Could not inspect the draft preview. Check that WSL Node and the website setup are installed.' }
    $status = ($statusText | Out-String) | ConvertFrom-Json
    $serverProcess = $null
    if (-not $status.running) {
        New-Item -ItemType Directory -Path $workDirectory -Force | Out-Null
        # A hidden foreground WSL process has no short background-start timeout.
        $arguments = @('-d', 'Ubuntu', '--cd', ('"' + $linuxRoot + '"'), '--exec', 'env', ('"WEBSITE_WORK_DIR=' + $linuxWork + '"'), 'node', 'scripts/local-dev.mjs', 'start')
        $serverProcess = Start-Process -FilePath $wslExecutable -ArgumentList $arguments -WindowStyle Hidden -PassThru `
            -RedirectStandardOutput (Join-Path $workDirectory 'local-authoring.log') `
            -RedirectStandardError (Join-Path $workDirectory 'local-authoring-error.log')
    }
    Write-Host 'Starting the draft preview. The first start also compiles the example diagrams.'
    $deadline = (Get-Date).AddMinutes(4)
    $ready = $false
    while ((Get-Date) -lt $deadline) {
        if (Read-PreviewIdentity) { $ready = $true; break }
        if ($null -ne $serverProcess) {
            $serverProcess.Refresh()
            if ($serverProcess.HasExited) { break }
        }
        Start-Sleep -Milliseconds 500
    }
    if (-not $ready) {
        throw "The draft preview did not become ready. See $workDirectory\local-authoring.log and local-authoring-error.log."
    }
}

Write-Host "Draft preview: $previewUrl"
Write-Host 'Edit a Markdown post, save it, and refresh the browser. Use Stop draft preview.cmd when finished.'
if (-not $NoBrowser) { Start-Process $previewUrl }
