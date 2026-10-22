# Temporary public Rp1,000 production test

On 23 October 2026 (Jakarta), the owner explicitly requested that Ebook Formula Profitable Blueprint display and charge Rp1,000 on the public production checkout, with a GitHub push and production deployment. Restore Rp59,000 only after the owner confirms the real-money test succeeded. This supersedes the earlier instruction to keep the original public price unchanged during private QA preparation.

The price is authoritative in `commerce_products`; the catalog, product detail and checkout read it from the server. Apply the guarded pricing operation in `formula-test-price-2026-10-23.sql` only to the published, non-QA IDR product. Preserve the original private file, every existing order's immutable price snapshot, payment state and entitlements. No automatic restoration is scheduled.

The checkout API rejects a pending order whose saved total differs from the current product price before handing off to DOKU. It neither rewrites that order nor creates a replacement provider session. Existing paid orders still return their purchased access. The regression suite covers Rp59,000-to-Rp1,000 and the reverse transition, the actual server Rp1,000 amount despite a forged client amount, and paid-order resumption.

The agent does not submit a real payment. The owner signs in to the production checkout, opens the official DOKU payment page, verifies the final amount and pays from their own QRIS/GoPay app. Readiness, a generated checkout page, provider-confirmed success and private-file fulfillment are distinct results; only signed provider notifications/reconciliation may grant payment-based access.

Release and live evidence will be recorded after deployment. The separate private QA product and its disabled runtime flags are unchanged.
