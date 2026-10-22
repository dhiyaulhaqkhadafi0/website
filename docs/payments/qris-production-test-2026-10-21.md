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

## Deployment and hosted result

- OpenNext build passed, exit 0. Known Windows copy-package diagnostics appeared; hosted route checks passed afterward.
- Public preflight scanned 671 assets/cache files against the two available private local credentials: zero matches. Build ID: `1YIFgF3WoGwyvj3Umpr6A`.
- 151/151 cache entries uploaded to the new build prefix; prior release cache retained.
- Worker release `542c50c5-f23e-4aa1-be57-961a60a82311`, source `dda72bd`, deployed successfully to production, including cron `*/5 * * * *`. Existing secrets/bindings retained; separate scheduler token uploaded as a secret and its temporary local file removed.
- Browser verification: product/checkout at 390 and 1440 pixels show Rp1,000, QRIS displayed, login required, zero uncaught browser errors. Homepage, Freelance, monetization directory and sitemap return 200; AdSense verification metadata retained.
- Unsigned DOKU webhook returns 401; anonymous order request returns 401; disabled private QA endpoint returns 404. No test order or payment was created.
- **BLOCKED for live payment:** post-deploy secret inventory still lacks `DOKU_CLIENT_ID` and `DOKU_SECRET_KEY`. Browser confirms checkout is closed by the credential gate. Enabled production/QRIS configuration is not a verified live provider session. Owner was asked to install genuine production keys in Cloudflare, without sharing values in chat.
- Source release synced to GitHub branch `codex/doku-qris-go-live-v2`. Main was not moved.
- Supabase security advisors show informational [RLS enabled with no policy](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy) for the two new server-only event/state tables, intentionally with all buyer/public privileges revoked. Existing unrelated blog/Auth warnings remain outside this payment release.

Evidence: ignored `artifacts/payments/qris-1000-live-verification.json`, `qris-1000-cache-upload.json`, `qris-1000-next-build.log`, `qris-1000-opennext-build.log`, and `qris-1000-deploy-direct.log`.

## Merchant secrets installed, 21 October 2026 at 10:25 WIB

Owner confirmed installing both merchant secrets in Cloudflare. Current secret-name inventory confirms `DOKU_CLIENT_ID` and `DOKU_SECRET_KEY`; their values were not read or exported. Dashboard deployment `f9d36d0a-2149-44fb-86dd-30aa533654bb` is serving 100% traffic.

Live browser verification was repeated at 390/1440 pixels: published price is Rp1,000, QRIS is shown, checkout configuration is now available, and the closed-checkout notice is absent. Anonymous buyers must sign in. The same homepage/Freelance/sitemap and unsigned webhook/anonymous orders/disabled private QA checks pass with zero browser errors.

The missing-secret blocker above is resolved. No signed-in buyer session was available to this verifier. A real provider checkout/QR, merchant-key validity, payment SUCCESS, webhook delivery, and private ebook fulfillment have not yet been verified. Owner can now sign in and initiate the Rp1,000 QRIS payment from the production checkout. No payment was performed by the agent, and no additional code deployment was needed after the owner's secret deployment.

Prior preparation reports are historical; their no-deploy scope is superseded for this release by the owner's explicit production request. Genuine payment completion and fulfillment must not be inferred from a build or an enabled flag.
