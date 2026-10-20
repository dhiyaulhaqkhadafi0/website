# Read-only preflight for local DOKU + Supabase testing on Windows.
# Safe: no images are pulled, no files are deleted, and no services are started.
$ErrorActionPreference = "Continue"
Write-Host "=== Khadafi Studio: local staging preflight (read-only) ==="
Write-Host "--- Drives ---"
Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" |
  Select-Object DeviceID,
    @{Name="FreeGB";Expression={[math]::Round($_.FreeSpace/1GB,2)}},
    @{Name="TotalGB";Expression={[math]::Round($_.Size/1GB,2)}} |
  Format-Table -AutoSize

Write-Host "--- RAM ---"
Get-CimInstance Win32_ComputerSystem |
  Select-Object @{Name="TotalRAM_GB";Expression={[math]::Round($_.TotalPhysicalMemory/1GB,2)}} |
  Format-Table -AutoSize

Write-Host "--- Docker daemon ---"
try {
  docker info --format 'DockerRootDir={{.DockerRootDir}} ServerVersion={{.ServerVersion}}' 2>&1
  docker system df 2>&1
} catch { Write-Host $_.Exception.Message }
Write-Host "--- WSL distributions ---"
wsl --list --verbose 2>&1

Write-Host "--- Existing WSL/Docker VHDX files (metadata only) ---"
$locations = @("$env:LOCALAPPDATA\Docker", "$env:LOCALAPPDATA\Packages")
Get-ChildItem -Path $locations -Recurse -Filter *.vhdx -File -ErrorAction SilentlyContinue |
  Sort-Object Length -Descending |
  Select-Object @{Name="SizeGB";Expression={[math]::Round($_.Length/1GB,2)}},FullName |
  Format-Table -AutoSize

Write-Host "--- Node / Supabase CLI availability ---"
node --version 2>&1
npx --version 2>&1
Get-Command supabase -ErrorAction SilentlyContinue | Select-Object Source,Name |
  Format-Table -AutoSize

Write-Host "--- End: no changes made ---"
