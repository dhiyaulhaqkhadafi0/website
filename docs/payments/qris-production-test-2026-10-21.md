# QRIS production test, 21 October 2026

Owner requested production QRIS activation and a temporary Rp1,000 price for Ebook Formula Profitable Blueprint, followed by redeployment. The supplied DOKU email shows QRIS Service Information APPROVED; provider checkout availability and an actual paid transaction must still be verified separately.

The existing production application did not include the DOKU adapter. This release uses the prepared DOKU integration with the latest deployed AdSense metadata merged in, preserving the Freelance release and the existing private PDF.

## Database

- Published ebook price changed from Rp59,000 to Rp1,000 IDR, using the exact existing product and old-price predicate. Existing order price snapshots are preserved.
- Production Khadafi Web received the DOKU adapter and safety migrations only. Chikki was not modified.
- DOKU event/state tables have RLS enabled and no anon/authenticated table grants. All eight public DOKU RPCs use SECURITY INVOKER and are service-role only.
- Original PDF remains in private commerce-files storage; metadata reports application/pdf, 23,208,642 bytes. A live paid download has not been tested.

## Configuration

Production configuration enables DOKU public checkout, QRIS and five-minute reconciliation. The application still requires the genuine production DOKU_CLIENT_ID and DOKU_SECRET_KEY; it fails closed without them. Merchant keys are never committed or printed. A separate random internal reconciliation token is provisioned with the release.

Signed-in checkout is required so the owner can recover the ebook from /account/library. Guest checkout stays disabled. The DOKU notification destination is https://khadafidaffa.com/api/commerce/doku/webhook; checkout also sends that override destination.

## Verification

- Current-turn offline QRIS signature/replay/concurrency checks: 22 passed.
- Actual checkout handler contract and reconciliation handler tests passed.
- Embedded PostgreSQL applied the curated commerce migrations and passed order price, idempotency, checkout locking, exact amount, event inbox, entitlement, scheduler lease, refund and role-access checks.
- Webhook HTTP contract: 15 passed. GET signature and reconciliation decision suites passed. These use inert test vectors, not actual provider payments.
- Next webpack build and TypeScript passed, 187 static pages.
- Remaining release and hosted verification results are recorded below after deployment.

Prior preparation reports are historical; their no-deploy scope is superseded for this release by the owner's explicit production request. Genuine payment completion and fulfillment must not be inferred from a build or an enabled flag.
