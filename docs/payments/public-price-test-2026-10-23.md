# Temporary public Rp1,000 production test

On 23 October 2026 (Jakarta), the owner explicitly requested that Ebook Formula Profitable Blueprint display and charge Rp1,000 on the public production checkout, with a GitHub push and production deployment. Restore Rp59,000 only after the owner confirms the real-money test succeeded. This supersedes the earlier instruction to keep the original public price unchanged during private QA preparation.

The price is authoritative in `commerce_products`; the catalog, product detail and checkout read it from the server. Apply the guarded pricing operation in `formula-test-price-2026-10-23.sql` only to the published, non-QA IDR product. Preserve the original private file, every existing order's immutable price snapshot, payment state and entitlements. No automatic restoration is scheduled.

The checkout API rejects a pending order whose saved total differs from the current product price before handing off to DOKU. It neither rewrites that order nor creates a replacement provider session. Existing paid orders still return their purchased access. The regression suite covers Rp59,000-to-Rp1,000 and the reverse transition, the actual server Rp1,000 amount despite a forged client amount, and paid-order resumption.

The agent does not submit a real payment. The owner signs in to the production checkout, opens the official DOKU payment page, verifies the final amount and pays from their own QRIS/GoPay app. Readiness, a generated checkout page, provider-confirmed success and private-file fulfillment are distinct results; only signed provider notifications/reconciliation may grant payment-based access.

## Applied release and verification

- Source commit `bfe8381` was pushed to `codex/checkout-visual-fix` and the existing DOKU review branch.
- Next.js 16.3.8 webpack build, TypeScript and 189-page generation passed. OpenNext packaging completed successfully. All 152/152 incremental cache objects uploaded; public preflight found no matched private credentials, public paid PDF or temporary QA fixture.
- Worker `286d8ca5-b43c-44cb-bb5c-f832eb82ea1c` deployed with existing secrets/bindings retained and the five-minute reconciliation schedule. Live build ID matches `WkOyLp2nDPsl9iLPMeb17`.
- After the guarded Worker was live, the exact published product price changed from IDR 59,000 to IDR 1,000. Before/after fingerprints of the original private file metadata and all four existing order price snapshots match. No order, payment or entitlement was created by this release operation.
- Fifteen live HTTP/image/access checks passed, including the actual product JSON-LD price and checkout price. Eight anonymous browser checks cover product/checkout, 390/1440 widths and light/dark modes: Rp1,000 is visible, Rp59,000 is absent, no horizontal overflow or uncaught browser errors, and zero order POSTs. Signed-out buyers retain the login gate.
- The owner's account already has active ebook access. A genuine new purchase test needs a buyer account that does not already own it; existing paid access is deliberately preserved.

The separate private QA product and its disabled runtime flags are unchanged. A new official DOKU checkout, real payment, verified success, single entitlement and private-file download remain manual acceptance steps. The public price stays Rp1,000 until the owner confirms success and requests restoration.

Ignored verification artifacts: `artifacts/visual-payment/public-1000-*.log`, `public-1000-browser/result.json`, and the live HTTP report. These contain no bearer checkout URLs or merchant credentials.
