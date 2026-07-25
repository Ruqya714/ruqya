$ErrorActionPreference = 'Stop'

$source = 'C:\Users\ammar\AppData\Local\Docker\wsl\disk\docker_data.vhdx'
$targetDirectory = 'E:\DockerDesktop'
$target = Join-Path $targetDirectory 'docker_data.vhdx'
$log = Join-Path $targetDirectory 'move-status.txt'

if (-not (Test-Path -LiteralPath $source)) { throw "Docker storage was not found at $source." }
if (Test-Path -LiteralPath $target) { throw "A Docker storage file already exists at $target." }

New-Item -ItemType Directory -Path $targetDirectory -Force | Out-Null
Set-Content -LiteralPath $log -Value "Started: $(Get-Date -Format o)"
Get-Process -ErrorAction SilentlyContinue |
    Where-Object { $_.ProcessName -match 'Docker|com\.docker' } |
    Stop-Process -Force
wsl --shutdown
Start-Sleep -Seconds 5

try {
    Move-Item -LiteralPath $source -Destination $target
    Add-Content -LiteralPath $log -Value 'Storage file moved.'
    New-Item -ItemType SymbolicLink -Path $source -Target $target | Out-Null
    Add-Content -LiteralPath $log -Value "Completed: $(Get-Date -Format o)"
}
catch {
    Add-Content -LiteralPath $log -Value "Failed: $($_.Exception.Message)"
    if ((Test-Path -LiteralPath $target) -and -not (Test-Path -LiteralPath $source)) {
        Move-Item -LiteralPath $target -Destination $source -ErrorAction SilentlyContinue
        Add-Content -LiteralPath $log -Value 'Rollback completed.'
    }
    throw
}
