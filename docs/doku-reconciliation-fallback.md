## Offline regression fix — status amount vs. DB order total (2026-10-19)

The user's first `node scripts/test-doku-reconciliation.mjs` execution on commit `40765d6` passed its initial authenticated fake Sandbox Check Status response, then failed at `AssertionError: Missing expected rejection`. The problem was a faulty assertion, **not evidence of unauthorized entitlement**: the status API helper authentically returns a positive integer amount (including a valid signed value different from the expected product price); only the reconciliation layer has access to the local database order total and must reject the mismatch before calling the privileged RPC.

The updated test now checks:
- Fake signed status amount 59,001 can be parsed and returned (no unwarranted rejection);
- Real reconciliation engine compares it with the local order total 59,000, records a failed match, grants no entitlement, and **does not call the privileged settlement function**.
- Bad HMAC, HTTP, invoice, currency and invalid status remain rejected immediately.

The feature code and production remain unchanged; this was a test-only fix on the draft branch. Re-run using updated draft HEAD; this test must pass on the user's laptop before proceeding to staging database E2E.

---

# Khadafi Studio — DOKU Sandbox reconciliation fallback

**Scope:** feature branch `feature/doku-sandbox-checkout`, draft PR #4 only. Prepared for isolated local staging; NOT activated in Cloudflare production or any database.

## Why this exists

Official Mandiri VA Sandbox simulator and DOKU signed **Check Status API** confirmed that test invoices were `SUCCESS`, even though DOKU Back Office Notification Center had no record of an outgoing HTTP Notification for those invoices. This does **not** prove any webhook reached the application. This server-side fallback is designed to recover a missed notification without trusting browser redirects.

Official DOKU documentation for GET /orders/v1/status/{invoice}: https://developers.doku.com/get-started-with-doku-api/check-status-api/non-snap (wait at least 60 seconds after payment).

## Implemented in draft PR

- `src/lib/doku-status-check.ts`: queries ONLY `https://api-sandbox.doku.com/orders/v1/status/{invoice}`, authenticates the **request and response HMAC** for GET with no Digest, requires exact invoice/amount/IDR where specified and a recognized transaction status. No gateway secret is returned to client or logs.
- `src/lib/doku-reconciliation.ts`: pure engine, processes maximum 10 rows per run. A row must have provider `doku`, status `pending`, safe DOKU Sandbox checkout URL, a positive integer total, and age between 3 minutes and 7 days. **Only signed `SUCCESS` from `VIRTUAL_ACCOUNT_BANK_MANDIRI` with exact invoice and amount** proceeds. All other statuses remain locked. Failures are counted, never treated as paid.
- `src/app/api/internal/commerce/doku/reconcile/route.ts`: disabled-by-default **POST** endpoint for a private scheduler/operator only. Requires:
  - `DOKU_RECONCILE_ENABLED=true`
  - `DOKU_LOCAL_STAGING_ONLY=true`, `DOKU_IS_PRODUCTION=false`, `DOKU_PRODUCTION_APPROVED` not true.
  - `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321` (or `localhost:54321`), with isolated staging Supabase.
  - `DOKU_SITE_ORIGIN=https://doku-staging.khadafidaffa.com`.
  - Existing `dokuConfigured()` (explicit `DOKU_ENABLED=true`, Sandbox API credentials).
  - A private `DOKU_RECONCILE_TOKEN` of >= 32 characters; `Authorization: Bearer <token>` constant-time comparison.
  - Request `Host` must be `localhost:3000` or `127.0.0.1:3000`. Never expose this endpoint via Cloudflare tunnel.
  - A local service-role key present only on the server.
- Reconciliation uses exactly the existing `commerce_set_payment_doku(p_order, p_total, p_reference)` privileged DB RPC, the same one used by the verified webhook handler. The DB function checks the original DOKU order and amount and inserts entitlement idempotently, so webhook + reconciliation cannot issue duplicate entitlement.
- API output contains **aggregate counters only** (`checked`, `paid`, `pending`, `skipped`, `failed`), no invoice, customer identity, VA, secrets, full DOKU checkout links or PDF link.

This endpoint is **prepared, not running automatically yet**. After actual staging end-to-end passes, schedule an authenticated local POST every 5–10 minutes in the isolated staging environment; no scheduler, token, webhook route, Cloudflare production deployment, or production DB changes are configured by this PR.

## Offline test (no Docker, no DOKU API, no money)

In PowerShell after fetching the feature worktree:

```powershell
node "E:\khadafi-doku-feature\scripts\test-doku-reconciliation.mjs"
```

This verifies signed fake Check Status SUCCESS; invalid signature/amount/currency/invoice/HTTP status; no entitlement for PENDING, FAILED, EXPIRED, REFUNDED, TIMEOUT or REDIRECT; unknown payment provider/unsafe checkout URL; immature/old orders; wrong Mandiri channel; simulated DB failure; idempotency; and batch limit. It does NOT verify the real Supabase DB, actual protected PDF, or DOKU notifications. Existing local SQL rollback test and 15 webhook HTTP tests remain separate.

## Safe operational rollout (future, not yet executed)

1. Get DOKU Support to trace missing Sandbox HTTP Notifications; no need for more simulated payments until explained.
2. Run staging Supabase + Next.js only with adequate RAM (or an isolated hosted staging stack). Preserve local Chikki Docker volumes. Validate the local-only gates and `DOKU_RECONCILE_TOKEN` (do not commit or share token).
3. Seed only synthetic Rp59,000 product/PDF, create a proper DOKU-linked local order, and perform one official Mandiri Simulator test. Verify that private entitlement is *not* granted before payment, then that a signed Check Status fallback can mark it paid **after >=3 minutes** even if webhook is missing.
4. Check an authenticated user/guest receives the correct private PDF, test duplicate calls and fraudulent invoice/amount/signature. No blind trust in browser `/checkout/success`.
5. Only after these tests are genuinely completed, schedule the *private* reconcile POST. Do not use the publicly routable `127.0.0.1:8788` webhook test tunnel for internal reconciliation.
6. Remove/disable the temporary public Cloudflare Tunnel route when finished investigating; close Node listener. Never touch production secrets/worker/DB until separately reviewed and authorized.

**Limitations:** This feature is currently Sandbox + local-staging only and *will not* run on production. It is not an active polling job, not a replacement for DOKU support debugging, and not proof that digital downloads have passed end-to-end.
