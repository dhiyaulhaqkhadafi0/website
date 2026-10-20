param([string]$WorkerName='khadafi-doku-staging')
$ErrorActionPreference='Stop'
if($WorkerName -eq 'khadafi' -or $WorkerName -notmatch '^khadafi-doku-staging(?:-[a-z0-9-]+)?$'){throw 'Dedicated staging Worker required.'}
$taskRoot=Split-Path -Parent $PSScriptRoot
$wrangler=Join-Path $taskRoot 'node_modules/wrangler/bin/wrangler.js'
$configuration=Join-Path $taskRoot 'wrangler.doku-staging.jsonc'
# This never deploys or creates a Worker. Refuse if staging is missing.
$inventory=& node $wrangler secret list --config $configuration --name $WorkerName --format json 2>$null
if($LASTEXITCODE -ne 0){throw 'Staging Worker does not exist or cannot be inspected. Review staging infrastructure before configuring secrets.'}
foreach($name in @('DOKU_CLIENT_ID','DOKU_SECRET_KEY')){
 $secureValue=Read-Host "Masukkan $name SANDBOX (input tersembunyi)" -AsSecureString
 $pointer=[Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureValue)
 try{
  $plainValue=[Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
  if([string]::IsNullOrWhiteSpace($plainValue)){throw 'Empty sandbox secret refused.'}
  $plainValue | & node $wrangler secret put $name --config $configuration --name $WorkerName
  if($LASTEXITCODE -ne 0){throw 'Staging secret could not be stored. Leave payments disabled.'}
 }finally{
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
  $plainValue=$null;$secureValue=$null
 }
}
Write-Host 'Sandbox secret names configured. Keep DOKU_IS_PRODUCTION=false, DOKU_ENABLED=false and PAYMENTS_ENABLED=false until validation.'
