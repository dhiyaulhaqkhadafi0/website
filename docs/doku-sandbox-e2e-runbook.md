## Fixed diagnostic Check Status signature mismatch (2026-10-19)

On a previously paid Rp59,000 Sandbox invoice, `scripts/check-doku-sandbox-status.mjs` returned `DOKU status response signature mismatch`. The diagnostic script had a local bug: its **GET request** signature correctly omitted `Digest`, but its **GET response** verifier incorrectly added `Digest` when calculating DOKU HMAC. Official Non-SNAP signature documentation says `Digest` is for POST; it does not belong in GET response HMAC canonicalization.

Fix in the draft branch: `scripts/lib/doku-nonsnap-get-signature.mjs` shares strict request and response GET HMAC signing/verifying without `Digest`, requires the response signature header rather than accepting it when missing, and validates client ID, request ID, response timestamp and signature in constant time. `scripts/test-doku-get-status-signature.mjs` is a synthetic offline regression test. No real app entitlement/database/webhook code was changed.

Run in PowerShell after syncing the feature branch:

```powershell
node "E:\khadafi-doku-feature\scripts\test-doku-get-status-signature.mjs"
```

Then retry the read-only status command using the **same existing, paid Sandbox invoice**. Do NOT simulate another payment or restart the Node webhook process. If the Check Status API still rejects the response signature, stop and collect ONLY harmless diagnostics such as which expected response headers are present, never expose raw headers, body with VA information, checkout URLs or secret keys. Never bypass HMAC verification to mark a sale paid.

---

## BLOCKER: real Sandbox payment SUCCESS but webhook not delivered (second test)

User-provided evidence after the optional `override_notification_url` was added: official Mandiri VA Simulator shows **Payment Success** on another Rp59,000 sandbox order, while the new local in-memory order (`541689cd...`, truncated) remained **PENDING / NO**. Node logs confirmed the new Checkout creation included `additional_info.override_notification_url`, but still showed **no incoming webhook requests after payment**. Prior DOKU Back Office screenshots showed a paid Mandiri Checkout and an empty Notification Center for the exact invoice. Public unsigned POST to the tunnel was logged as HTTP 401 by the Node process, proving public routing works. Conclusion: real signed webhook delivery has **not** been observed or verified. Do not claim automatic entitlement; production is unchanged.

**Stop making new Sandbox payments.** DOKU's official **Non-SNAP GET Check Status API** is a documented fallback: `https://api-sandbox.doku.com/orders/v1/status/{invoice}`, using GET HMAC without Digest; DOKU recommends waiting 60 seconds after payment. Use `scripts/check-doku-sandbox-status.mjs` on an **existing** paid `KS...` invoice to check the provider status without exposing secrets or creating a new charge.

Open a separate PowerShell terminal while the current Node smoke server remains running:

```powershell
$env:DOKU_CLIENT_ID = Read-Host "DOKU Sandbox Client ID"
$secret = Read-Host "Sandbox Active Secret Key" -AsSecureString
$env:DOKU_SANDBOX_INVOICE = Read-Host "Existing paid KS... invoice from DOKU Checkout Orders"
try {
    $env:DOKU_SECRET_KEY = [System.Net.NetworkCredential]::new("", $secret).Password
    node "E:\khadafi-doku-feature\scripts\check-doku-sandbox-status.mjs"
} finally {
    Remove-Item Env:\DOKU_CLIENT_ID,Env:\DOKU_SECRET_KEY,Env:\DOKU_SANDBOX_INVOICE -ErrorAction SilentlyContinue
    Remove-Variable secret -ErrorAction SilentlyContinue
}
```

**Strict limitations:** This read-only API check can independently confirm DOKU's stored status, NOT repair the webhook or update local memory, Supabase, entitlement or PDF. The next phase needs DOKU to trace whether notifications were generated, what endpoint they targeted, what HTTP delivery code was seen, and whether Sandbox Notification Center should show the events.

Escalate via official [DOKU Merchant Support](https://www.doku.com/customer-support) or [DOKU Help Center](https://help.doku.com/id/support/home): provide merchant client ID, Sandbox environment, test invoice (privately to DOKU only), date/time, Rp59,000, Mandiri VA channel, the preconfigured staging notification URL, Checkout API optional `additional_info.override_notification_url`, and report that no webhook reached the test endpoint and Notification Center has no entry. Share **NO active secret key, virtual account credentials, or checkout access URL**. Do not reconfigure production, merge PR, or change real customer data.

---

## DOKU Back Office confirms SUCCESS, Notification Center has no record (2026-10-19 WIB)

User-provided screenshots of DOKU Sandbox show that one Checkout order of Rp59,000:
- appears in Reports > Checkout Orders with status **Lunas**;
- shows Mandiri VA transaction history **SUCCESS**, local time 2026-10-19 00:51:26 WIB;
- has no `order.callback_url` (shown as `-`), which is browser navigation, NOT the HTTP Notification URL and is optional for Mandiri;
- shows no record when searching HTTP Notification Center by invoice;
- remains `PENDING / NO` in local in-memory dashboard.

A manual **unsigned POST** to the public staging webhook through Cloudflare returns **401 Invalid DOKU signature** *and logs HTTP status 401 in the active local Node process*, confirming Cloudflare -> local webhook routing and signature rejection work. This does NOT prove real DOKU notification delivery.

The Sandbox Mandiri Non-SNAP API v1.1 Payment Notification URL was visibly configured to the correct dedicated HTTPS staging endpoint. Existing test Checkout requests omitted the optional `additional_info.override_notification_url`. Per official DOKU Checkout docs this may override per-channel Notification URL if the same notification path was configured in Back Office. This is only a **diagnostic experiment**, not proven to fix any root cause. In commit 61d90b3 the standalone *Sandbox-only* smoke test now sets `additional_info.override_notification_url` to the exact pre-registered HTTPS staging webhook path; NO production files were changed.

**Next choice:** Since no original DOKU notification appears in Back Office, contact DOKU technical support with the paid Sandbox invoice and timeline to trace delivery, before repeating further paid simulations. If repeating one final no-money Sandbox experiment, restart the Node smoke server after syncing the branch, create a fresh local test order, confirm explicit override was requested, simulate Mandiri VA again once, and inspect HTTP Notification Center + local logs. Restart loses old in-memory order and must never be mistaken for a production payment. Do not expose keys or URLs with checkout tokens. Production stays unchanged; draft PR remains unmerged.

---

## Checkout API PASS but browser stayed on localhost — fixed in commit f12c58d

Observed two local server log lines `PASS: new Rp59000 DOKU Sandbox Checkout created` but no browser redirect. The API and invoice validation worked; two **unpaid** test checkout orders were created in the temporary memory store. The original HTML had a 10-second meta refresh that could interrupt the form, and a `form-action 'self'` CSP that can block a browser's cross-site redirect chain.

The revised script removes automatic meta refresh and makes POST `/checkout` show an explicit **Buka Pembayaran DOKU Sandbox** button on a success page. That button follows a unique, one-time `/open/{token}` localhost link that redirects via GET to the validated DOKU HTTPS checkout, keeping the sensitive payment URL only in Node memory. The link expires after ten minutes. Local dashboard status may be refreshed manually.

To apply the update, stop only the Node test process with Ctrl+C (Cloudflare Tunnel service remains healthy), fetch/switch feature branch to the latest draft commit, and restart the Node script with Sandbox credentials. Do NOT pay a previous invoice: restarting loses the old in-memory test orders. Make ONE new checkout and click the explicit open-payment link once; keep Node running through the Mandiri VA simulation so the signed webhook can settle that exact test order. The original production Worker and databases are unaffected.

---

## Browser checkout 'Access was denied' (localhost) — fix

The dashboard root `GET http://127.0.0.1:8789/` returned HTTP 200; the user reported `Access was denied` after clicking the `Create Rp59.000 Sandbox checkout` button **without a browser redirect or any terminal log**. The initial localhost dashboard POST handler was rejecting the form when its `Origin` header was absent or `null` (possible under browser privacy/referrer settings). The handler now uses a **random hidden CSRF token per server start**, validates loopback IP and Host, and rejects cross-site Fetch Metadata, without requiring Origin to be present; it logs sanitized rejection reasons to help diagnosis.

To apply the change:
1. Keep the Cloudflare Tunnel Windows service running. On the Node console, press **Ctrl+C** to stop the existing script (this does not touch the saved DOKU Sandbox Notification URL).
2. Run `git -C "E:\khadafi-doku-feature" fetch origin feature/doku-sandbox-checkout` then `git -C "E:\khadafi-doku-feature" switch --detach origin/feature/doku-sandbox-checkout`.
3. Re-run `doku-live-webhook-smoke.mjs` with **SANDBOX** credentials entered privately as above. Do not post secrets in chat.
4. Open `http://127.0.0.1:8789/` in Chrome directly and reload to obtain the fresh CSRF form token. Click Create Checkout ONCE. The local terminal should log `PASS: new Rp59000 DOKU Sandbox Checkout created` and Chrome should redirect to the `staging.doku.com` checkout.
5. If it still fails, capture only HTTP status and sanitized `REJECTED local checkout` or `FAILED: checkout creation` log, never a complete DOKU payment URL or credentials.

Do not make another simulated payment until this browser button successfully creates a new in-memory test order and the public webhook relay remains healthy.

---

## LIVE DOKU-signed webhook smoke test (low RAM, no database)

The user has reported **PASS: 15 HTTP webhook contract tests**. Those are synthetic test signatures, NOT actual DOKU delivery.

The separate `scripts/doku-live-webhook-smoke.mjs` now provides a low-RAM real-notification test using the **same HMAC verification and HTTP handler** as the Next.js route, and an isolated in-memory test order store. It binds:
- `127.0.0.1:8788`: ONLY `POST /api/commerce/doku/webhook` (everything else is 404). Route ONLY this port through a dedicated, authenticated admin-managed Cloudflare Tunnel public hostname `doku-staging.khadafidaffa.com`, with NO Cloudflare Access login challenge on the DOKU notification endpoint.
- `127.0.0.1:8789`: local-only human status page + manual new Sandbox checkout. Do NOT publish this port.

From an updated feature worktree, no Docker needed:

```powershell
$env:DOKU_CLIENT_ID = Read-Host "Sandbox Client ID"
$secret = Read-Host "Sandbox Active Secret Key" -AsSecureString
try {
  $env:DOKU_SECRET_KEY = [System.Net.NetworkCredential]::new("", $secret).Password
  node "E:\khadafi-doku-feature\scripts\doku-live-webhook-smoke.mjs"
} finally {
  Remove-Item Env:\DOKU_CLIENT_ID -ErrorAction SilentlyContinue
  Remove-Item Env:\DOKU_SECRET_KEY -ErrorAction SilentlyContinue
  Remove-Variable secret -ErrorAction SilentlyContinue
}
```

Leave terminal open. Verify `http://127.0.0.1:8789/` is local status UI and the webhook port rejects GET (404) and unsigned POST (401). Do NOT click Create Checkout until the named tunnel is healthy, the HTTPS webhook URL returns 401 to unsigned POST, and **the DOKU SANDBOX Back Office Mandiri VA Notification URL** is configured to exactly `https://doku-staging.khadafidaffa.com/api/commerce/doku/webhook`. Do not change production merchant/worker settings.

Once ready, create a NEW Rp59,000 Checkout using the button on the local dashboard. It sends only to `api-sandbox.doku.com`, validates order/amount/strict hostname, and redirects to hosted DOKU. Pick Mandiri VA and use the official sandbox simulator. The server marks the synthetic order PAID in memory only when an authentically signed DOKU SUCCESS arrives. Watch terminal and local dashboard.

**Limits:** No Supabase orders, no real e-book entitlements, no real customer data, no real money, no production changes. This test is a genuine DOKU notification-delivery check, but still NOT full commerce E2E. Do not claim live webhook success until test has run and its output confirms it. Do not reuse earlier paid checkout: it was created before the webhook was connected and is not part of this in-memory test order.

After the test, STOP (Ctrl+C) the Node server and `cloudflared` and remove/disable the dedicated tunnel route to eliminate unintended public exposure.

---

## NEXT: HTTP webhook contract (low RAM, no Docker)

After DOKU confirmed the sandbox Mandiri VA payment, the next step is **not** to repeat the payment. A shared pure HTTP handler (`src/lib/doku-webhook-handler.ts`) is called by the real Next.js route `/api/commerce/doku/webhook`.

Run this in PowerShell:

```powershell
git -C "E:\khadafi-doku-feature" fetch origin feature/doku-sandbox-checkout
git -C "E:\khadafi-doku-feature" switch --detach origin/feature/doku-sandbox-checkout
node "E:\khadafi-doku-feature\scripts\test-doku-webhook-http.mjs"
```

This binds an ephemeral **loopback-only** Node HTTP server and exercises the same handler using synthetic HMAC-signed Mandiri VA JSON and an injected fake order store. It covers unsigned or tampered notifications, status handling, wrong invoice/amount, retries after database errors, a valid SUCCESS, duplicate SUCCESS, and protection of an unrelated unpaid order. It needs no real merchant credentials, Supabase API, cloud resources, DOKU account, payments, or production changes.

Expected end line after the test has actually passed:
`SUCCESS: 15 HTTP webhook contract tests passed; no database or live gateway used.`

**Important limit:** Passing this test does not prove DOKU's real notification reaches the website, nor that the real PostgreSQL RPC and private PDF work together. Those remain blocked by staging runtime availability/host RAM and require a subsequent isolated end-to-end test. Do not merge the draft PR solely on this result.

---

## Sandbox payment milestone — 2026-10-18 (user-verified screenshots)

**PASS — DOKU hosted Checkout and Mandiri VA Payment Simulator** using the standalone low-RAM script `scripts/open-doku-sandbox-checkout.mjs`. The user observed:

- DOKU Sandbox hosted checkout at `staging.doku.com` with Rp59,000 and Mandiri VA issued;
- successful inquiry of the test VA at the official DOKU Mandiri VA simulator, matching Rp59,000;
- simulator displayed **Payment Success**;
- DOKU hosted Checkout displayed **Payment Successful**, matching Rp59,000 and Virtual Account Mandiri.

**No real money was transferred.** Do not store or reproduce the test VA, full invoice, access URLs, API credentials, or screenshots in repository text.

**Not yet validated:** DOKU webhook delivered to a Khadafi endpoint, signed notification parsing, local/isolated commerce order transitions, private PDF access and full app/DB end-to-end. The standalone script generated a DOKU invoice without creating any application order. Do not merge the draft PR or deploy Sandbox config to production.

**Resource blocker:** 8 GB Windows host with only ~0.56–1.05 GB free RAM during Supabase startup; do not force the full local stack. Consider an isolated staging runtime or offline webhook HTTP contract test as a next incremental step. Preserve local database volumes.

---

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
