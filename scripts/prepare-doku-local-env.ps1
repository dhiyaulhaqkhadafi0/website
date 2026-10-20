# Safe, repeatable bootstrap of a dedicated DOKU test env; never reads remote Supabase.
# Run after the KHADAFI local Supabase API services are started.
param(
  [string]$StagingRoot = "E:\khadafi-doku-staging-db",
  [string]$FeatureRoot = (Split-Path -Parent $PSScriptRoot)
)
$ErrorActionPreference = "Stop"
$configPath = Join-Path $StagingRoot "supabase\config.toml"
$envPath = Join-Path $FeatureRoot ".env.local"
if (-not (Test-Path -LiteralPath $configPath)) { throw "Staging config not found." }
if ((Get-Content -LiteralPath $configPath -Raw) -notmatch '(?m)^\s*project_id\s*=\s*["'']khadafi-doku-staging-db["'']') {
  throw "STOP: Unexpected local project id; no environment file created."
}
if (-not (Test-Path -LiteralPath (Join-Path $FeatureRoot "src\lib\doku.ts"))) {
  throw "STOP: DOKU feature worktree not found."
}
if (Test-Path -LiteralPath $envPath) {
  throw "STOP: $envPath already exists. Inspect it first; script NEVER overwrites secrets."
}
Push-Location $StagingRoot
try {
  # Capture stdout rather than printing API keys into logs or chat.
  $out = & npx --yes supabase@latest status -o env 2>&1
  if ($LASTEXITCODE -ne 0) { throw "Local Supabase status failed. Start local services first." }
} finally { Pop-Location }
$values = @{}
foreach ($line in $out) {
  $s = [string]$line
  if ($s -match '^([A-Z][A-Z_]+)=(.*)$') {
    $values[$Matches[1]] = $Matches[2].Trim().Trim('"').Trim("'")
  }
}
$api = $values['API_URL']
$anon = $values['ANON_KEY']
$service = $values['SERVICE_ROLE_KEY']
if ($api -ne "http://127.0.0.1:54321" -and $api -ne "http://localhost:54321") {
  throw "STOP: Supabase URL is not the expected local instance on port 54321."
}
if (-not $anon -or -not $service -or $anon.Length -lt 40 -or $service.Length -lt 40) {
  throw "STOP: Supabase local API keys not available; nothing written."
}
# Local-only keys and a proposed (NOT YET PROVISIONED) public origin.
# DOKU stays disabled until a separate tunnel and Sandbox keys are configured.
$lines = @(
  "# KHADAFI DOKU - LOCAL DEV ONLY. Never copy to production Cloudflare."
  "DOKU_LOCAL_STAGING_ONLY=true"
  "NEXT_PUBLIC_SUPABASE_URL=$api"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY=$anon"
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$anon"
  "SUPABASE_SERVICE_ROLE_KEY=$service"
  "DOKU_ENABLED=false"
  "PAYMENTS_ENABLED=false"
  "DOKU_IS_PRODUCTION=false"
  "DOKU_PRODUCTION_APPROVED=false"
  "# Proposed hostname; NOT active until Cloudflare tunnel is configured."
  "DOKU_SITE_ORIGIN=https://doku-staging.khadafidaffa.com"
  "DOKU_CLIENT_ID="
  "DOKU_SECRET_KEY="
  "NEXT_TELEMETRY_DISABLED=1"
)
[System.IO.File]::WriteAllText($envPath, ($lines -join [Environment]::NewLine) + [Environment]::NewLine, [System.Text.UTF8Encoding]::new($false))
Write-Host "PASS: Khadafi local Supabase-only .env.local prepared in feature worktree." -ForegroundColor Green
Write-Host "DOKU_ENABLED=false: no live checkout or public tunnel enabled." -ForegroundColor Yellow
Write-Host "Sandbox keys were not written. Do NOT share .env.local or Supabase status output."
