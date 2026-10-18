# LOW-RAM OPTION: DOKU browser simulator smoke test (no Docker)

If the machine has only ~1 GB RAM free, do not run minimal Supabase + Next.js. Instead, use `scripts/open-doku-sandbox-checkout.mjs`, which reuses DOKU's authenticated API and the exact strict URL host validator. It requires only Node 24 and temporary Sandbox credentials; the DOKU checkout link stays in memory, not on screen or disk.

```powershell
git -C "E:\khadafi-doku-feature" fetch origin feature/doku-sandbox-checkout
git -C "E:\khadafi-doku-feature" switch --detach origin/feature/doku-sandbox-checkout
$env:DOKU_CLIENT_ID = Read-Host "Sandbox Client ID"
$secret = Read-Host "Sandbox Active Secret Key" -AsSecureString
try {
  $env:DOKU_SECRET_KEY = [System.Net.NetworkCredential]::new("", $secret).Password
  node "E:\khadafi-doku-feature\scripts\open-doku-sandbox-checkout.mjs"
} finally {
  Remove-Item Env:\DOKU_CLIENT_ID -ErrorAction SilentlyContinue
  Remove-Item Env:\DOKU_SECRET_KEY -ErrorAction SilentlyContinue
  Remove-Variable secret -ErrorAction SilentlyContinue
}
```

The script will display a one-time `http://127.0.0.1:<random-port>/open/<random-id>` link. Open this LOCAL link in Chrome within ten minutes; the local process redirects the browser once to the authenticated Sandbox checkout link on `staging.doku.com` / `sandbox.doku.com`.

Only use payment channels enabled in this merchant's Sandbox account. If Mandiri VA appears, take its SANDBOX VA number to the official DOKU Mandiri Payment Simulator, never an actual bank app. If the merchant doesn't offer Mandiri, do not invent a VA or attempt real payment.

**This is only a DOKU hosted-page and Payment Simulator smoke test. It does NOT create a `commerce_orders` record and has NO app webhook/entitlement**, so do not claim full purchase, callback, access to digital files or webhook passed. DOKU can send notifications only to a separately configured public Notification URL, and this path creates no app order or callback. Keep production worker and database unchanged. Stop here once payment simulator results are recorded; finish full E2E later on a machine/staging host with enough resources.

---

# Khadafi Studio — DOKU Sandbox Local E2E Operator Guide

Status: **prepared in draft PR only**. Do NOT assume HTTP webhook, real VA simulation, Cloudflare Tunnel, or download E2E have passed. No production database or merchant configuration was changed by the scripts.

## Safety first

- Feature worktree `E:\khadafi-doku-feature`, local Supabase workspace `E:\khadafi-doku-staging-db`.
- Preserve existing Docker volumes (including Chikki). Never prune, reset, unlink, or copy production service-role credentials.
- Do not merge PR or configure DOKU Sandbox on the production worker `khadafi`.
- NEVER post `.env.local`, `supabase status` keys, DOKU Secret Key, payment URL, or webhook signatures.
- The proposed public hostname `doku-staging.khadafidaffa.com` is NOT automatically created; requires explicit Cloudflare Tunnel / DNS configuration. Do not change the root/production domain.
- Expose ONLY relay on localhost port 8788 to the named tunnel (it forwards POST `/api/commerce/doku/webhook` to Next at loopback port 3000). Other paths return 404. Never expose 54321, 54322, 54323, or the whole Next.js app.
- Avoid testing with a real bank / wallet / QR payment. DOKU Payment Simulator only, if VA method enabled in merchant Sandbox.

## Stage A — Local Supabase (no payment enabled)

1. Close heavy apps / excess Chrome tabs. The scripts require at least 2.5 GB free physical RAM to start Auth+REST+Storage+Postgres; this is not a guarantee against memory shortages.
2. Start Docker Desktop and wait for healthy engine.
3. In PowerShell update feature branch:

```powershell
git -C "E:\khadafi-doku-feature" fetch origin feature/doku-sandbox-checkout
git -C "E:\khadafi-doku-feature" switch --detach origin/feature/doku-sandbox-checkout
& "E:\khadafi-doku-feature\scripts\start-doku-local.ps1"
```

The command uses the existing 4 migration local volume, NOT production or new cloud projects. If low RAM, it stops before attempting Docker startup. It excludes Studio, Realtime, Analytics and other optional services but retains DB, Auth, REST, Storage and Kong. Docker local dev ports may bind `0.0.0.0` on Windows; firewall must block outside access. Don't share `supabase status` output because it contains test keys.

4. Generate isolated gitignored app config without manually copying secret keys:

```powershell
& "E:\khadafi-doku-feature\scripts\prepare-doku-local-env.ps1"
```

The script **refuses to overwrite** `.env.local`. Verify file is not tracked by Git. This config sets `DOKU_ENABLED=false`, exact local Supabase URL, Sandbox mode and a placeholder public staging hostname.

5. Create dummy e-book, not the real product:

```powershell
Set-Location "E:\khadafi-doku-feature"
node --env-file=.env.local scripts/seed-doku-local-ebook.mjs
```

Expected PASS: synthetic Rp59,000 test e-book and generated private dummy PDF stored ONLY on local Supabase. Safe to rerun if previous attempt stopped midway. It does not generate an order/payment yet.

6. Start app in a separate PowerShell terminal (remain running):

```powershell
& "E:\khadafi-doku-feature\scripts\start-doku-local-next.ps1"
```

Browse `http://localhost:3000/checkout/ebook-formula-profitable-blueprint-test`. Before enabling Sandbox checkout, checkout button should be disabled.

## Stage B — Prepare external webhook without exposing app or DB

1. In another terminal run:

```powershell
node "E:\khadafi-doku-feature\scripts\doku-webhook-relay.mjs"
```

Only `127.0.0.1:8788` accepts POST `/api/commerce/doku/webhook`. Run against loopback manually to confirm other endpoints return 404.

2. Using Cloudflare Zero Trust **Tunnels**, create a named tunnel (requires an account and domain under Cloudflare DNS) with only one published hostname: `doku-staging.khadafidaffa.com` -> `http://127.0.0.1:8788`. Do not route production root DNS to the tunnel; do not expose :3000 or :54321/:54322.
3. Verify public endpoint availability by POSTing an intentionally unsigned JSON body to `https://doku-staging.khadafidaffa.com/api/commerce/doku/webhook`. Expect **401 Invalid DOKU signature**, which establishes HTTPS routing but does NOT mark any order paid.
4. Configure the **DOKU SANDBOX** Back Office notification URL (for the selected Sandbox channel) to exactly that HTTPS URL. DOKU rejects localhost and ngrok notification domains. If channel notification settings cannot be updated, stop and review DOKU documentation before any payment simulation.
5. Only after verified named tunnel, run:

```powershell
& "E:\khadafi-doku-feature\scripts\enable-doku-local-sandbox.ps1"
```

Enter Sandbox Client ID / **Active Secret Key privately**. The script requires exact local Supabase, staging hostname, sandbox mode and explicit confirmation. It writes only gitignored local `.env.local`; restart Next dev after enabling.

## Stage C — E2E simulation without real funds (NOT YET TESTED)

1. Browse LOCAL `http://localhost:3000/checkout/ebook-formula-profitable-blueprint-test`; use an invented test name/email (not personal data) and complete checkout.
2. The browser should redirect to a checkout on `staging.doku.com` or `sandbox.doku.com`. Do not use real payment apps.
3. If Mandiri VA is offered on THIS merchant Sandbox, copy the test-only VA to the official DOKU Payment Simulator -> Mandiri VA -> Inquiry -> Payment. Otherwise select an actually enabled simulator channel. Never assume a listed simulator method is enabled for this merchant.
4. DOKU should POST a signed SUCCESS to the tunnel -> 8788 relay -> localhost:3000 webhook -> local Supabase RPC; then the order becomes `paid` and the private dummy PDF is downloadable exactly once per entitlement.
5. Validate wrong-signature POST returns 401 and unpaid order grants no file. Test duplicate payment notification only with a previously authenticated test notification, never expose credentials.
6. Record observations and debug only on local branches; the remote Cloudflare build success alone does not count as E2E.
7. Stop the tunnel and relay, stop Next.js (Ctrl+C), then from local workspace:
```powershell
npx --yes supabase@latest stop --project-id khadafi-doku-staging-db
```
Volumes remain; no `--no-backup`.

## Production rollout

Production requires independent merchant approval, real key activation, settlement checks, signed notification validation, staging E2E success and a reviewed PR/production migration. Sandbox never writes to real Supabase and can remain separate as long as needed.
