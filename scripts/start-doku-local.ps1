# Minimal Supabase for Khadafi DOKU browser checkout: DB + Auth + REST + Storage + Kong.
# No Studio, Analytics, Realtime, Inbucket, or optional services. NOT production.
param(
  [string]$StagingRoot = "E:\khadafi-doku-staging-db"
)
$ErrorActionPreference = "Stop"
$cfg = Join-Path $StagingRoot "supabase\config.toml"
if (-not (Test-Path -LiteralPath $cfg) -or
    (Get-Content -LiteralPath $cfg -Raw) -notmatch '(?m)^\s*project_id\s*=\s*["'']khadafi-doku-staging-db["'']') {
  throw "STOP: This is not the dedicated Khadafi local staging workspace."
}
$os = Get-CimInstance Win32_OperatingSystem
$free = [Math]::Round($os.FreePhysicalMemory / 1MB, 2)
Write-Host ("Free physical RAM: {0} GB" -f $free)
if ($free -lt 2.5) {
  throw "Too little free RAM for Auth/REST/Storage. Close browser tabs and other apps, then try again (aim >=2.5GB)."
}
$info = & docker info --format '{{.ServerVersion}}' 2>$null
if ($LASTEXITCODE -ne 0 -or -not $info) {
  throw "Docker Desktop Engine is not running."
}
$running = @(& docker ps --format '{{.Names}}')
if ($running | Where-Object { $_ -match '^supabase_' -and $_ -notmatch 'khadafi-doku-staging-db$' }) {
  throw "Other Supabase containers are running; stop them separately after safeguarding their data. Never prune volumes."
}
Push-Location $StagingRoot
try {
  Write-Host "Starting MINIMAL Khadafi local stack. Database volume is retained..." -ForegroundColor Cyan
  # Do not print Supabase CLI raw output because it may include development API keys.
  $output = & npx --yes supabase@latest start -x "realtime,imgproxy,mailpit,postgres-meta,studio,edge-runtime,logflare,vector,supavisor" 2>&1
  if ($LASTEXITCODE -ne 0) {
    throw "Supabase start failed. Inspect Docker health and free RAM. Local volumes were NOT deleted."
  }
} finally { Pop-Location }
Write-Host "PASS: Minimal Khadafi Supabase services started." -ForegroundColor Green
Write-Host "Keep REST/Auth/Storage access local. Do not expose ports 54321/54322 on the public internet."
Write-Host "Next: scripts/prepare-doku-local-env.ps1 (writes gitignored .env.local)."
