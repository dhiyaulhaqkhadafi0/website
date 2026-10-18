# Opt-in, local-worktree-only sandbox activation AFTER webhook-only tunnel is verified.
# Stores DOKU Sandbox keys only in ignored .env.local, never in git/cloud worker.
param(
  [string]$FeatureRoot = "E:\khadafi-doku-feature",
  [string]$PublicOrigin = "https://doku-staging.khadafidaffa.com"
)
$ErrorActionPreference = "Stop"
$path = Join-Path $FeatureRoot ".env.local"
if (-not (Test-Path -LiteralPath $path)) { throw "Run prepare-doku-local-env.ps1 first." }
$lines = Get-Content -LiteralPath $path
$map = @{}
foreach ($line in $lines) {
  if ($line -match '^([A-Z][A-Z0-9_]+)=(.*)$') { $map[$Matches[1]] = $Matches[2] }
}
if ($map['DOKU_LOCAL_STAGING_ONLY'] -ne 'true' -or
    $map['DOKU_IS_PRODUCTION'] -ne 'false' -or
    $map['DOKU_PRODUCTION_APPROVED'] -ne 'false' -or
    $map['DOKU_ENABLED'] -ne 'false' -or
    $map['NEXT_PUBLIC_SUPABASE_URL'] -notin @('http://127.0.0.1:54321','http://localhost:54321')) {
  throw "STOP: Staging variables do not match safe local-only state."
}
$uri = [Uri]$PublicOrigin
if ($uri.Scheme -ne 'https' -or $uri.Host -ne 'doku-staging.khadafidaffa.com' -or
    $uri.AbsolutePath -ne '/' -or $uri.Query -or $uri.Fragment -or $uri.Port -ne 443) {
  throw "STOP: Use only the pre-approved HTTPS staging hostname, not production."
}
Write-Host "Ensure HTTPS $PublicOrigin/api/commerce/doku/webhook reaches ONLY local relay port 8788."
Write-Host "This stores Sandbox credentials in gitignored .env.local, NEVER in Cloudflare production."
$approval = Read-Host "Type ENABLE-SANDBOX to continue"
if ($approval -cne 'ENABLE-SANDBOX') { throw "Cancelled. No credentials written." }
$clientId = Read-Host "DOKU Sandbox Client ID"
$key = Read-Host "DOKU Sandbox Active Secret Key" -AsSecureString
$secret = [System.Net.NetworkCredential]::new("", $key).Password
try {
  if ($clientId -notmatch '^[A-Za-z0-9-]{5,100}$' -or
      $secret.Length -lt 12 -or $secret.Contains([char]10) -or $secret.Contains([char]13)) {
    throw "Credentials were not accepted; nothing written."
  }
  $updated = foreach ($line in $lines) {
    if ($line -match '^DOKU_ENABLED=') { 'DOKU_ENABLED=true' }
    elseif ($line -match '^DOKU_SITE_ORIGIN=') { "DOKU_SITE_ORIGIN=$PublicOrigin" }
    elseif ($line -match '^DOKU_CLIENT_ID=') { "DOKU_CLIENT_ID=$clientId" }
    elseif ($line -match '^DOKU_SECRET_KEY=') { "DOKU_SECRET_KEY=$secret" }
    else { $line }
  }
  [System.IO.File]::WriteAllText($path,
    ($updated -join [Environment]::NewLine) + [Environment]::NewLine,
    [System.Text.UTF8Encoding]::new($false))
  Write-Host "PASS: DOKU SANDBOX ONLY enabled in gitignored local .env.local." -ForegroundColor Green
  Write-Host "Restart local Next.js to reload credentials. Never paste env file into chat."
} finally {
  Remove-Variable secret -ErrorAction SilentlyContinue
  Remove-Variable key -ErrorAction SilentlyContinue
}
