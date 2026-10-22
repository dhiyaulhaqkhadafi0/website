# DOKU runtime recovery — 22 October 2026

## Confirmed defects

- The hosted-provider panel was a non-interactive element. It now submits the existing validated checkout form, with consent, authentication/availability gates, loading feedback, and a synchronous duplicate-submit guard.
- Production's `2024-09-23` compatibility date did not enable `Request.cache`. The application passes `cache: "no-store"` to provider requests. A real local workerd test reproduces `The 'cache' field on 'RequestInitializerDict' is not implemented` before the mocked outbound provider receives a request. Enabling `cache_option_enabled` makes the same request succeed. Both production and staging configurations now explicitly enable it. This is a runtime defect; it does not prove the individual historical provider state of an order.
- A later Git-based production deployment had a fetch-only handler and the old main-branch configuration. The verified release wrapper restores the scheduled reconciliation handler and five-minute trigger. The default branch remains a distinct snapshot; its deployment configuration must not replace the payment release unintentionally.
- Reconciliation collapsed every exception into `PROVIDER_OR_DB_ERROR`. Safe typed diagnostics now distinguish provider authentication, HTTP/not-found, signatures, payload mismatches, transport, order reads, settlement persistence, and unknown errors. Cross-realm errors retain an allowlisted code without logging arbitrary messages.
- After cache support was restored, workerd reproduced a second pre-network failure: `redirect: "error"` throws `TypeError: Invalid redirect value`. Provider calls now use `redirect: "manual"` and reject every 3xx response before reading the body. Redirects are never followed and merchant headers are never forwarded to a redirect target.
- A real-module workerd suite bundles and executes the application's checkout/status functions against a local mock. It verifies normalized copied credentials, request and response HMACs, successful checkout/status parsing, both redirect rejections, and both invalid-signature rejections: six checks, six local outbound calls, zero real provider calls and zero redirects followed.

## Verification

- Five local browser groups cover 390/1440 widths in light/dark mode, required consent, both submit controls, loading, duplicate submissions, mocked official-host navigation, and ambiguous-order recovery. Zero uncaught errors and zero real provider calls.
- Checkout response, handoff, signed reconciliation, QRIS replay/amount/environment, channel registry, scheduler and host tests pass. TypeScript, targeted lint, Next and OpenNext builds passed for the first recovery release.
- The runtime test uses only a local mock outbound service and no credentials. It asserts both committed Wrangler configurations support the cache option.
- First recovery build `x2PI9r0yaXeEVBF0DW5is`: 152/152 cache objects uploaded; public preflight scanned 537 files against two available local private values, zero matches; paid PDF remains private; no component fixture in the production route manifest.
- Recovery Worker `56ee67ad-c04b-43c0-bc83-5daf5217093b` restored the schedule. Runtime-flag Worker `71ab2747-8628-4907-8338-7191ff2c4736` adds cache support using the same application artifact. Live BUILD_ID matched the recovery build.
- The final workerd request fix is deployed as Worker `2089df72-fc85-4573-bddc-8c6c5c201a17`, build `k3sTobKr3pLWcfcpaXGgP`. Its Next.js 16.3.8 build completed all 189 pages, OpenNext packaging passed, and 152/152 incremental cache objects were uploaded. Fifteen live HTTP/image/access checks passed, and the deployed version retains both fetch and scheduled handlers plus the cache compatibility flag.
- After this deployment, the normal scheduled job reached DOKU for both historical orders. On 22 October at 14:45 UTC it received HTTP 404, recorded as `DOKU_STATUS_NOT_FOUND_UNCONFIRMED`. This replaces the pre-network transport failure; it does not authorize replacement bills or settlement.

## Private Rp1,000 preparation

The separate QA product is a non-featured draft with `is_payment_qa=true`, IDR price 1,000, and a database constraint preventing publication. Live catalog/sitemap and anonymous-role checks confirm it is hidden; public product/checkout URLs render not-found content. The original published product remains IDR 59,000 with its original private file.

Studio uploads use `<product UUID>/...`, while the old QA function required `payment-qa/...`. Migration `20261022144749_doku_qa_studio_private_file.sql` aligns that validation and requires the matching object in the private `commerce-files` bucket. It preserves the confirmed-owner check, server-only execution grants, idempotency and price rules. A database test confirmed missing files reject creation without creating any order. Security advisors reported no newly introduced findings.

A new one-page dummy PDF was generated and visually checked locally. At the latest preparation check it had not been uploaded to Studio: the QA product had zero files, zero orders and zero entitlements. Browser control failed to initialize, so authenticated Studio upload requires an owner action. QA runtime flags remain disabled. No checkout URL, provider method selection, actual payment or post-payment download has yet been verified for this new private test. This is not ready for manual payment until upload and official DOKU checkout verification complete.

## Historical orders and boundaries

Orders `929B8336` and `3EDCCA6B` remain pending/unknown without a saved provider URL. The owner reports neither Rp59,000 order appears in DOKU's transaction report; that report alone is not authoritative proof that a checkout session never existed. A temporary privileged diagnostic endpoint was proposed, rejected by automatic approval review, and declined by the owner. It was never uploaded or opened.

After the runtime flag release, only the two orders' next reconciliation times were advanced to permit one normal scheduled status check. Invoice, request ID, checkout state, price, order status and entitlements were not reset. No replacement provider session or payment was created. Unknown outcomes must not be retried blindly.

The prior Rp1,000 payment is distinct evidence. This release has not yet demonstrated a new real Rp59,000 transaction, a matching signed success event, exactly one entitlement and authenticated original-PDF download. Those remain explicit acceptance gates.

## Security and rollback

Keep exact HTTPS provider hosts, fixed API targets, redirect blocking, amount/invoice checks, supplied checkout-response HMAC verification, mandatory status HMAC verification, signed webhooks and server-side fulfillment. Never expose merchant secrets, service-role credentials, checkout tokens or buyer data in public artifacts.

Keep `cache_option_enabled` when rolling back application code that sends no-store requests. Retain the scheduled wrapper and existing secret/binding/kill-switch configuration. Do not roll back data by deleting orders or entitlements.
