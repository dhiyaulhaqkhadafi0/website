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

Both Indonesian templates and subjects were saved in Supabase, then reloaded to verify persistence. Confirmation uses `Konfirmasi email akun Khadafi`; magic link uses `Tautan masuk akun Khadafi`. SMTP configuration alone does not prove email delivery; no real test email was sent in this run. Emails sent before the redirect correction retain their old localhost destination and must be replaced by a fresh confirmation request.

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

- Application source: `a39e10ced842fc506dde7e7e89ca9d77f32f4dfb`, pushed to GitHub on the release branch.
- Next production build: `-8giQposKiPbe112nChCV`, 189 generated pages; TypeScript and targeted ESLint passed. OpenNext completed successfully despite the previously observed Windows package-copy warnings.
- Public preflight scanned 688 files against two known local server credentials: zero matches. This is a bounded check, not a claim to know every production secret.
- Uploaded all 152 build cache objects before Worker activation.
- Production Worker version: `ca5b69ab-aed9-4e73-8839-8c25a7ac2b99`, deployed with `--keep-vars`. Payment flags, production secrets, R2/images/self binding and five-minute reconciliation cron were preserved.
- Live checks at `https://khadafidaffa.com` passed at 390px and 1440px: product/checkout IDR 59,000; 17 visible payment choices; anonymous checkout still requires login; checkout is configured; homepage, freelance, monetization and sitemap return 200; unsigned webhook/order requests fail closed; private QA/diagnostic endpoints return 404; `/BUILD_ID` matches the local release; no browser errors.
- The complete callback/checkout-serialization/Chikki browser fixture suite also passed against the live deployment. Provider verification and order POSTs were intercepted, so this does not claim live signup delivery or a new DOKU payment.
- Read-only inspection of the previously affected IDR 59,000 order still showed pending/unknown without a saved URL. It was neither reset nor charged again. Its existing DOKU email is the continuation path; the new response handling does not reconstruct a previously discarded URL.
- Evidence: `artifacts/auth-checkout/deploy.log`, `public-preflight.json`, `cache-upload.json`, `commerce-live-verification.json`, `browser-results.json`, UI screenshots and `email-template-saved.jpg` (ignored local artifacts).
