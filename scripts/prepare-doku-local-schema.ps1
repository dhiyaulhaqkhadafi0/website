# Creates a *local-only* curated commerce migration chain for DOKU Sandbox.
# Does not connect to Supabase Cloud, run SQL, create containers or delete files.
param(
    [string]$StagingRoot = "E:\khadafi-doku-staging-db"
)
$ErrorActionPreference = "Stop"
$RepositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Config = Join-Path $StagingRoot "supabase\config.toml"
if (-not (Test-Path -LiteralPath $Config)) {
    throw "Supabase init belum ada di workspace: $Config"
}
$Migrations = Join-Path $StagingRoot "supabase\migrations"
if ((Test-Path -LiteralPath $Migrations) -and
    @(Get-ChildItem -LiteralPath $Migrations -File -ErrorAction SilentlyContinue).Count -gt 0) {
    throw "Folder migrasi tidak kosong. Tolong audit isinya lebih dulu: $Migrations"
}
$Sources = @{
    "20261018000100_doku_local_commerce_base.sql" = "supabase_commerce.sql"
    "20261018000200_doku_local_guest_media.sql" = "supabase/migrations/20261017051124_commerce_media_guest_checkout.sql"
    "20261018000300_doku_local_payment.sql" = "supabase/migrations/20261018094500_doku_checkout_sandbox.sql"
}
foreach ($source in $Sources.Values) {
    if (-not (Test-Path -LiteralPath (Join-Path $RepositoryRoot $source))) {
        throw "File repo belum tersedia: $source. Pastikan branch feature/doku-sandbox-checkout."
    }
}
$AdminBootstrap = @'
-- Staging-only minimum prerequisite for the Commerce RLS policies.
-- Mirrors the founder-check dependency without copying production customers.
create schema if not exists private;
revoke all on schema private from public;
create table if not exists public.blog_admin_emails (
 email text primary key check (email=lower(email)),
 created_at timestamptz not null default now()
);
alter table public.blog_admin_emails enable row level security;
create policy "No direct access to blog admins" on public.blog_admin_emails
 for all using (false) with check (false);
revoke all on public.blog_admin_emails from public,anon,authenticated;
create or replace function private.is_blog_admin()
 returns boolean language sql stable security definer set search_path=''
 as $$
  select exists (
    select 1 from public.blog_admin_emails
    where email=lower(coalesce(auth.jwt()->>'email',''))
  )
 $$;
revoke all on function private.is_blog_admin() from public;
grant usage on schema private to anon,authenticated;
grant execute on function private.is_blog_admin() to anon,authenticated;
'@
New-Item -ItemType Directory -Path $Migrations -Force | Out-Null
$OutAdmin = Join-Path $Migrations "20261018000000_doku_local_admin_prerequisite.sql"
[System.IO.File]::WriteAllText($OutAdmin, $AdminBootstrap, [System.Text.UTF8Encoding]::new($false))
foreach ($entry in $Sources.GetEnumerator()) {
    $Destination = Join-Path $Migrations $entry.Key
    Copy-Item -LiteralPath (Join-Path $RepositoryRoot $entry.Value) -Destination $Destination -ErrorAction Stop
}
Write-Host "Prepared exactly 4 LOCAL migrations (not executed):" -ForegroundColor Green
Get-ChildItem -LiteralPath $Migrations -File |
  Sort-Object Name | Select-Object Name,Length | Format-Table -AutoSize
Write-Host "Next: inspect migrations and Docker resources; do not run db reset or start yet."
