# Email confirmation, checkout selection and Chikki detail

Release branch: `codex/auth-confirmation-checkout`. Price remains IDR 59,000.

## Changes

- Signup uses the production `/auth/confirm` redirect. The Indonesian confirmation page supports explicit email-OTP confirmation and remotely validates legacy implicit callbacks. Credentials are removed from the URL immediately, kept in memory only, and never used to persist a login session. Missing/expired links have useful recovery navigation. The page is noindex and uses no-referrer.
- Indonesian confirmation and magic-link HTML are versioned under `supabase/templates/`. Confirmation links carry their token hash in the fragment and require a button press, preventing a GET-only mail scanner from consuming the OTP. Existing magic-login flow retains Supabase's ConfirmationURL.
- Checkout exposes QRIS, the owner's documented active bank/VA and retail options, plus a hosted all-methods choice. DOKU still determines final merchant and amount eligibility. Wallet/paylater options remain subject to the hosted page's additional requirements. The application does not infer service activation from a generic product name.
- A selected method is bound to the existing checkout lease in a service-role-only RPC. Repeated requests preserve the invoice/request ID and saved URL. Changing method on an in-flight order is rejected. Unknown provider outcomes are not blindly retried. A previous missing URL must be continued through its DOKU email or resolved through the existing order lifecycle.
- Checkout responses follow DOKU's documented HTTPS contract, where HTTP response HMAC is optional and embedded headers are request echoes. Supplied HTTP HMAC and echoed request metadata are verified when present; invoice, amount, currency and checkout host are checked. This response creates a payment page only. Settlement/webhook signature checks, fulfillment and entitlements remain unchanged.
- Chikki's thin-bezel laptop opens a lazy-loaded 1448px detail image, zoom 50–400%, pan, reset, keyboard controls, native dialog focus and scroll restoration. Mobile and desktop controls retain the concept-image disclosure.
- Public changelog includes these fixes and the preceding site experience release.

## Database and configuration

Migration `20261021074807_doku_checkout_method_binding.sql` was applied to production. RLS remains enabled on the state table. New RPC execute rights were verified: anon false, authenticated false, service_role true. No existing order or entitlement was modified by the migration.

Supabase Site URL was corrected from localhost to `https://khadafidaffa.com`. Redirect allowlist includes `/auth/confirm`, `/login` and login returnTo. The owner installed Gmail SMTP; dashboard persistence was verified with host smtp.gmail.com, port 587 and sender name Khadafi. The stored password was neither read nor copied.

Template persistence and live release identity are recorded below after deployment. SMTP configuration alone does not prove email delivery.

## Validation

- Email-confirmation unit tests cover malformed, missing, expired, unsupported and legacy inputs, with no success without remote confirmed-user proof.
- DOKU response/policy tests cover single-bank selection, all-method omission, QRIS kill switch, QA isolation, optional response metadata, invalid supplied signatures, wrong invoice/amount/host and safe saved-URL reuse.
- Existing QRIS safety, channel, scheduler, commerce and commerce-experience tests passed. Embedded PostgreSQL lifecycle tests passed 15 checks, including method lease locking, concurrent requests, service-only execution, URL reuse and unchanged entitlements.
- Browser fixtures cover callback cleanup, explicit verification, no session persistence, expired states, visible method serialization and server pricing, changelog, and Chikki lazy-image/zoom/pan/reset/Escape/focus behavior at 390px and 1440px.
- All browser auth requests and order submissions in these fixture tests are intercepted. No real email, provider checkout request or payment is performed by those tests.
- Targeted TypeScript and ESLint results, production build logs, screenshots and deployment artifacts are retained in ignored `artifacts/auth-checkout/`.

Existing Supabase advisor findings were not changed by this release. No new public function execution permission was added.

Contract references: [DOKU backend integration](https://developers.doku.com/accept-payments/doku-checkout/integration-guide/backend-integration), [DOKU supported methods](https://developers.doku.com/accept-payments/doku-checkout/configuration/supported-payment-methods), [Supabase redirects](https://supabase.com/docs/guides/auth/redirect-urls), [Supabase email templates](https://supabase.com/docs/guides/auth/auth-email-templates).

## Release evidence

Pending final production build, deployment and template persistence verification.
