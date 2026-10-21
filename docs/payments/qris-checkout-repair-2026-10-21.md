# DOKU checkout link repair, 21 October 2026

## Confirmed issue

The owner reached the generic checkout error after creating the first Rp1,000 production order. DOKU's pending invoice email supplied a genuine `checkout.doku.com/checkout-link-v2/` URL, while both the application and the checkout-finish RPC allowed only legacy `jokul.doku.com` in production. This is a confirmed blocking incompatibility. The original successful create-response headers were not retained, so no claim is made about which original validation threw first.

The integration intentionally requests only Mandiri VA and QRIS. Its labels are a supported-method list, not discovery of every active merchant channel. Other channels remain outside this patch; accepting them without corresponding notification/settlement support would risk paid orders staying locked.

## Live evidence and owner instructions

- Merchant keys remain secret; signed production Check Status returned HTTP 200, exact invoice/Rp1,000, correct original checkout request ID, `ORDER_GENERATED` / `PENDING`, and no selected channel.
- One owner-approved diagnostic replay used the exact original invoice/request ID. DOKU returned HTTP 400 `REQUEST ID ALREADY USED`; no new order or payment was created.
- Owner explicitly chose to continue from the existing email link rather than authorize a new checkout request ID. No replacement link was generated.
- The existing email link was opened read-only on the genuine provider origin. Its invoice and Rp1,000 amount match the application's pending order. The bearer URL is absent from source, this report and public artifacts.
- That exact verified URL was restored atomically to the existing pending order and its checkout state marked ready. Status stays pending and entitlement count stays zero. No payment was performed, and no ebook access was granted by this repair.
- Cloudflare's historical telemetry API returned 403 for the existing OAuth permission. A temporary privileged diagnostic endpoint was initially rejected by automatic approval review, then explicitly authorized by the owner with a 20-minute expiry. It is removed from the final Worker; its token is deleted after deployment.

## Changes

- Strict production URL allowlists now accept exactly `jokul.doku.com` and `checkout.doku.com`; sandbox isolation, HTTPS, no userinfo/custom ports and spoof-host rejection remain.
- One migration replaces only the checkout-finish function's hostname check. It remains SECURITY INVOKER, service-role only, with the existing lease check. Saving a URL does not settle payment.
- Checkout failures now log safe enum codes and response status/hostname only. Customer messages distinguish provider rejection from an unresolved prior checkout; a missing URL no longer implies payment is being verified.
- A signed `ORDER_GENERATED/PENDING` result with no channel is an ordinary pending observation. A SUCCESS still requires the existing channel allowlist before settlement.
- Provider response HMAC remains mandatory. Request echo metadata is not accepted as a substitute. Fixed-URL API requests reject redirects.

## Validation

- Production `checkout.doku.com` signed-response and existing-URL reuse regression tests pass; no new provider call for a saved valid URL. Unsigned echo, bad signature, wrong amount and spoofed URL remain rejected.
- Seventeen host allowlist cases pass.
- Embedded PostgreSQL migration/locking/price/entitlement/refund/privilege suite passes, including current production URL persistence without settlement and rejection of spoofed/sandbox/userinfo URLs.
- QRIS replay/concurrency/HMAC suite: 22 checks pass. Checkout handler and reconciliation handler suites pass, including PENDING with no selected channel and no grant.
- Hosted migration applied; direct verification confirms current host support, SECURITY INVOKER, no anon/buyer execute privilege, service-role execute privilege.
- Next webpack and TypeScript pass, 187 static pages. Changed-file lint passes. Provider-generated completed payment/notification/private-PDF download remains unverified until the owner's real test succeeds.

Final Worker deployment and hosted verification are recorded below after rollout.
