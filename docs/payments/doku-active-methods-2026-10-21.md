# DOKU active checkout methods, 21 October 2026

## Real payment confirmed

The owner's Rp1,000 test order is paid. A read-only query confirmed a DOKU notification inbox entry with status SUCCESS and channel QRIS_DOKU, received at 04:02:51 UTC, and exactly one entitlement. The owner's screenshots also show provider success and the product in their library. These observations supersede the pending-payment limitation in the earlier checkout-repair report. Downloading the private original PDF was not independently tested in this release.

## Checkout changes

Public production Checkout previously sent an explicit Mandiri/QRIS filter. New sessions now omit `payment.payment_method_types`, allowing DOKU to display the merchant's available, active and amount-eligible methods. The application explains that buyers choose on the DOKU page instead of displaying a fixed two-method list. Private QA remains QRIS-only; sandbox restrictions and the explicit QRIS kill switch remain in place. The temporary product price remains Rp1,000.

DOKU's [backend integration guide](https://developers.doku.com/accept-payments/doku-checkout/integration-guide/backend-integration) documents this omission behavior. [Method limits](https://docs.doku.com/accept-payments/payment-methods/requirements-and-limitations) still apply: not every active service in the merchant dashboard is a payment method eligible for a Rp1,000 Checkout transaction. Payment Link, Digital Catalog and Accept Order are services, not payment choices. The provider is the source of truth for the options in each new session. Existing saved sessions retain the options with which they were created; this release does not regenerate any invoice or URL.

Signed notifications, scheduled reconciliation and the service-only settlement RPC now accept a shared explicit registry of Checkout channels, including additional virtual accounts, wallets, retail and paylater methods. Unknown channels, wrong amount/invoice/environment, unsigned events and duplicate/conflicting replays remain guarded. Card payments request SALE; a SUCCESS authorization cannot unlock the ebook. Card sale/capture types are checked before settlement in both notification and reconciliation paths.

## Validation before deployment

- TypeScript and targeted ESLint passed; only existing unused-parameter warnings in the legacy reconciliation test were reported.
- Signed checkout tests verify absence of the public production filter, SALE mode, QRIS-only private QA, the QRIS kill switch, exact server price, response signature and hostname checks, and saved-session reuse without a provider request.
- All 31 documented channel IDs/aliases passed signed notification tests; SQL and application registries match exactly. Card authorization, unknown channels, invalid signatures and wrong currency are rejected.
- Embedded PostgreSQL applied the complete migration chain. Each channel settled exactly once under duplicate delivery; unknown/NULL channels failed. Existing price/environment/replay/refund/lease checks and service-only privileges passed.
- Existing webhook HTTP, HMAC, host and reconciliation suites passed. The signed status parser preserves transaction type and the actual scheduled route accepts additional methods while rejecting card authorization.

No additional production order, checkout session or payment was created during verification. The owner's completed session cannot demonstrate the new provider method picker; a fresh legitimate checkout is required for that final provider UI check.

## Hosted database

The `doku_checkout_active_channels` migration applied successfully to the Khadafi production project. A read-only check confirmed SECURITY INVOKER, empty search_path, service_role execution enabled and anon/authenticated execution disabled. Additional wallet/BNI channel identifiers are present in the hosted function. The original order remains paid at Rp1,000 with exactly one entitlement.

Security advisors retain the existing [RLS-without-policy informational notices](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy) for server-only payment tables and unrelated blog/Auth warnings. No new public settlement privilege was introduced.

## Production release and verification

- Application source `f1e9b2c` is pushed to `codex/doku-qris-go-live-v2` on GitHub. Main was not moved.
- Next.js and OpenNext builds both exited 0. Known Windows package-copy diagnostics appeared during OpenNext packaging; live route/browser checks below passed.
- Public preflight checked 671 assets/cache files against the two available local private credentials, with zero matches. This does not claim coverage of unknown merchant secret values.
- Build `NLeeVa7RVCagb5vgUZWV6`: 151/151 R2 cache entries uploaded. The first upload encountered an expired OAuth session (401); Wrangler refreshed the existing session and the retry succeeded.
- Worker `bea00c80-3689-47c6-90f3-67589bdfeafc` deployed to production with the existing secrets, bindings, sales gates and five-minute reconciliation schedule preserved. Prior normal release was `5e22f622-3436-40f1-9929-44ff3b3cbb74`.
- At 04:23:20 UTC, Chrome verified the product and checkout at 390 and 1440 pixels: Rp1,000 visible, method-choice instructions rendered, fixed Mandiri badge absent, checkout configured, login required and no horizontal overflow or uncaught browser errors. Screenshots were visually inspected.
- Homepage, Freelance, monetization directory and sitemap return 200; AdSense metadata remains present. Unsigned webhook and anonymous order requests return 401. Private payment QA and the removed temporary diagnostic endpoint return 404. Public `/BUILD_ID` matches the new build.
- These checks create no production order or payment. The provider's new-session picker and successful payments on additional channels remain unverified with real transactions. The existing real QRIS SUCCESS and single entitlement were verified separately above.

Sanitized evidence is kept in ignored `artifacts/payments/doku-active-methods-live-verification.json`, `doku-active-methods-public-preflight.json`, `doku-active-methods-cache-upload.json`, `doku-active-methods-next-build.log`, `doku-active-methods-opennext-build.log`, `doku-active-methods-deploy.log` and the mobile/desktop screenshots. No merchant key or bearer payment URL is included in this report.
