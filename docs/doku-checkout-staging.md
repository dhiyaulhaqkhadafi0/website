# Khadafi Studio — DOKU Checkout Sandbox Integration

**Status:** PR / staging only. The existing production merchant is still under verification. Do not deploy as a real payment system until merchant onboarding, card/QRIS activation, settlement verification, and E2E tests are complete.

## Current behavior

- Free orders still use the existing commerce RPC and entitlement flow.
- Paid orders use the new service-role-only DOKU RPC and the Checkout API.
- Backend signs each request with HMAC-SHA256 and verifies the returned invoice, amount and checkout URL host.
- A notification to POST /api/commerce/doku/webhook must pass DOKU signature verification *over the unmodified request body*.
- Only a signed transaction.status=SUCCESS with matching invoice/amount for a DOKU order invokes commerce_set_payment_doku.
- Signed FAILED notifications are ignored for Checkout, since buyers may retry using another payment method.
- Success page redirect never grants access; existing private file endpoints require an entitlement.
- Historical Midtrans webhook remains in place for older Midtrans orders only.

## Required DOKU merchant setup

1. Confirm with DOKU support that **DOKU Checkout API** is available for this Personal merchant (Payment Link / Digital Catalog being marked ACTIVE does not prove that API access is enabled).
2. Create a separate **Sandbox** DOKU Back Office account if necessary.
3. In Sandbox Back Office, open **Integrations > API Keys** to obtain the sandbox Client ID and Secret Key.
4. Set the **Notification URL** on the relevant Sandbox payment channels to the public HTTPS endpoint described below. Do not use localhost or an authenticated page.
5. Enable only payment channels that have actually been approved for the merchant. Do not request BCA VA under Personal if ineligible.
6. Later, confirm international Visa/Mastercard acceptance separately.

References:
- https://developers.doku.com/accept-payments/doku-checkout/integration-guide/backend-integration
- https://developers.doku.com/get-started-with-doku-api/retrieve-payment-credential
- https://developers.doku.com/get-started-with-doku-api/notification/setup-notification-url
- https://developers.doku.com/get-started-with-doku-api/notification/best-practice

## Deploy to isolated preview/staging (not live)

Use a **separate staging Supabase project**, not the live commerce database, for payment simulations and test accounts. Never use real customer data or production service role keys in an untrusted preview.

Review and apply migration:
supabase/migrations/20261018094500_doku_checkout_sandbox.sql

Add the following variables as **server-side runtime secrets/config** on the staging Cloudflare Worker:

- SUPABASE_SERVICE_ROLE_KEY (staging project only; secret)
- DOKU_CLIENT_ID (Sandbox Client ID; secret or secured configuration)
- DOKU_SECRET_KEY (Sandbox Secret Key; always secret)
- DOKU_ENABLED=true
- DOKU_IS_PRODUCTION=false
- DOKU_SITE_ORIGIN=https://YOUR-PUBLIC-HTTPS-STAGING-DOMAIN

Never commit credentials. DOKU_SITE_ORIGIN must equal the HTTP Host used by the checkout page. Sandbox intentionally rejects https://khadafidaffa.com as its site origin.

The webhook to register in DOKU Sandbox is:

https://YOUR-PUBLIC-HTTPS-STAGING-DOMAIN/api/commerce/doku/webhook

The callback result is generated as:
https://YOUR-PUBLIC-HTTPS-STAGING-DOMAIN/checkout/success?order=<UUID>

## Sandbox validation (must pass before production rollout)

1. Product is published in staging with a private e-book asset; free products still work.
2. Guest + signed-in paid checkout create a DOKU order and valid sandbox.doku.com checkout URL.
3. Refresh/retry uses the same order idempotency key, not a duplicate purchase.
4. Unpaid/cancelled browser return never grants a download entitlement.
5. Bogus/missing signature is rejected (HTTP 401), and wrong amount/invoice is rejected.
6. Correct signed SUCCESS grants access exactly once and returns HTTP 2xx.
7. Duplicate SUCCESS is idempotent.
8. Signed FAILED event is ignored and the buyer can retry within DOKU Checkout.
9. Order history, guest cookie access, private download, and founder order visibility work.
10. Run lint, typecheck, build, and integration tests; manually test desktop and mobile.
11. Check the DOKU merchant dashboard for payment confirmation and settlement eligibility.
12. Make sure credentials, personal details and tokens do not appear in logs.

**Production rollout gate:** Only after merchant and bank settlement are verified, the Notification URL is reachable, and all Sandbox tests pass. Production requires DOKU_IS_PRODUCTION=true, DOKU_PRODUCTION_APPROVED=true, DOKU_SITE_ORIGIN=https://khadafidaffa.com and the separately issued Production keys.

Do not merge/deploy this PR solely on the basis of static code review.
