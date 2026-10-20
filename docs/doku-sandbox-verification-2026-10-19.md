# DOKU Sandbox Checkout — Verification snapshot (2026-10-19 WIB)

**Scope:** draft PR #4 only, `feature/doku-sandbox-checkout`. **No production DOKU credentials, production Cloudflare Worker deployment, production Supabase migration, real payments, or real customer orders.** All simulations used official DOKU Sandbox Virtual Account Mandiri simulator with Rp59,000 test payments.

## Confirmed passing

1. **DOKU Sandbox Checkout API:** authentically signed request generated hosted Checkout with matching invoice and Rp59,000 amount, strict Sandbox hostname validation.
2. **Mandiri VA simulator:** official DOKU Sandbox simulator displayed Payment Success and hosted Checkout displayed Payment Successful. The DOKU Back Office Checkout Orders report showed **Lunas**, with a Mandiri VA transaction history **SUCCESS**.
3. **Real Check Status API:** `GET https://api-sandbox.doku.com/orders/v1/status/{invoice}`, Non-SNAP GET HMAC signature, returned **transaction.status = SUCCESS**, **order.amount = 59000**, **channel.id = VIRTUAL_ACCOUNT_BANK_MANDIRI**; invoice and amount were verified to match the requested pre-existing paid test invoice. The user executed `scripts/check-doku-sandbox-status.mjs` after the `scripts/lib/doku-nonsnap-get-signature.mjs` GET response canonicalization fix, commit `33eb14d`. No real credentials or full invoice are recorded in this file.
4. **Offline signature regression:** `scripts/test-doku-get-status-signature.mjs` passed all request/response GET HMAC assertions, including tampering, absent signature, and wrong request ID.
5. **Webhook HTTP contract tests:** `scripts/test-doku-webhook-http.mjs` passed 15/15 synthetic HMAC-signed HTTP cases using the actual route handler and an in-memory store.
6. **Cloudflare Tunnel to local webhook:** separate dedicated HTTPS staging hostname routed **only** to loopback `127.0.0.1:8788`. Unsigned public POST received **401 Invalid DOKU signature** and the active local Node server logged HTTP status 401. Local dashboard remained on private loopback port `8789`.

## Outstanding blocker — actual delivery of HTTP Notification

- **Not verified:** a signed DOKU `transaction.status=SUCCESS` notification reaching the listener or changing an in-memory test order to PAID.
- Repeated actual **Sandbox** simulated payments were successful in DOKU, but corresponding local test orders stayed `PENDING / NO`.
- DOKU Back Office **Notification Center** displayed **Tidak ada data** even when filtering by the paid checkout invoice.
- Sandbox Bank Mandiri API 1.1 configuration displayed the intended `Payment Notification URL`. One additional Sandbox-only checkout request included `additional_info.override_notification_url` pointing at that same path; no notification arrived. This does NOT prove webhook delivery or disprove its configuration; needs DOKU-side tracing.
- Browser `callback_url` is distinct from payment Notification URL; absence in a Back Office report is **not** sufficient to diagnose this issue.
- No entitlement or download integration has passed against a real isolated DB. The local 8 GB laptop has insufficient free RAM to run minimal Supabase + Next.js safely; the staging SQL rollback test passed earlier, but full E2E remains outstanding.

## Recommended next actions (no additional payment until delivery is explained)

1. **Escalate to DOKU technical merchant support:** request a trace of the last paid Sandbox invoice, whether an HTTP Notification event was created, its destination URL, signature/HTTP status if attempted, and why it is absent from Notification Center. Include invoice/merchant ID **only in private support ticket**, along with payment time, amount, channel, staging notification destination, and tests (public 401 accepted, Check Status SUCCESS).
2. Preserve the signed HMAC webhook as the normal fulfillment path. Plan a **server-side status reconciliation fallback** for pending orders after an appropriate delay, using verified DOKU Check Status API response + exact invoice, amount, local order, and idempotent DB transaction before issuing one entitlement. Never infer payment from the browser callback alone.
3. Run genuine notification + order persistence + private PDF download E2E **on an isolated staging backend**, after the delivery issue is resolved. Production Worker and production database must remain unchanged until independent approval.
4. Shut down the temporary publicly routable test endpoint/tunnel route when no longer actively testing, after collecting needed diagnostics.

Official documentation:
- https://developers.doku.com/get-started-with-doku-api/check-status-api/non-snap
- https://developers.doku.com/get-started-with-doku-api/notification/retry-notification
- https://developers.doku.com/get-started-with-doku-api/notification/override-notification-url
- https://www.doku.com/customer-support
