# Run Next.js local development ONLY from the dedicated feature worktree.
# Requires local .env.local; binds the app to loopback (not the LAN).
param([string]$FeatureRoot = "E:\khadafi-doku-feature")
$ErrorActionPreference = "Stop"
$cfg = Join-Path $FeatureRoot ".env.local"
if (-not (Test-Path -LiteralPath $cfg)) {
  throw "Missing isolated .env.local. Run scripts/prepare-doku-local-env.ps1 first."
}
$contents = Get-Content -LiteralPath $cfg -Raw
if ($contents -notmatch '(?m)^DOKU_LOCAL_STAGING_ONLY=true\r?$' -or
    $contents -notmatch '(?m)^DOKU_IS_PRODUCTION=false\r?$' -or
    $contents -notmatch '(?m)^NEXT_PUBLIC_SUPABASE_URL=http://(?:localhost|127\.0\.0\.1):54321\r?$') {
  throw "STOP: Unsafe environment (local-only guard missing)."
}
$binary = Join-Path $FeatureRoot "node_modules\.bin\next.cmd"
if (-not (Test-Path -LiteralPath $binary)) {
  throw "Missing Next.js node_modules. Check the existing dependency junction."
}
Push-Location $FeatureRoot
try {
  Write-Host "Running PRIVATE local Next.js on http://127.0.0.1:3000" -ForegroundColor Green
  Write-Host "Only expose the separate webhook relay :8788 through a Cloudflare Tunnel."
  & $binary dev --hostname 127.0.0.1 --port 3000
} finally { Pop-Location }
