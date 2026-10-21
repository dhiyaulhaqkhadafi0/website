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

Deployment and live verification evidence will be recorded after release.
