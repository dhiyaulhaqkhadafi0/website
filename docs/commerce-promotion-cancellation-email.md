# Production commerce: promotions, cancellation, transaction email

## Pricing

The Formula Profitable Blueprint selling price is Rp59,000. Its owner-confirmed
regular price is Rp298,000. `commerce_products` stores the selling price,
comparison price, enabled flag and display label. The shared price component is
used by the catalog, Shop, product page, checkout and Studio. Savings are computed
from these values; checkout continues to charge the server-side selling price.

`/studio/promotions` provides previews and version-checked saves. Studio access,
same-origin checks, product RLS and database constraints protect updates. Disabling
the promotion hides the comparison; it does not silently change the selling price.
Existing order totals are immutable price snapshots.

## Cancellation

Pending DOKU orders expose cancellation in buyer history, order detail and checkout
recovery. Confirmation is explicit. The API authenticates the owner, leases the
request and checks signed provider status before attempting the official
`POST /checkout/v3/cancellations`. A successful POST alone never closes the local
order: signed status must match invoice, amount and environment. Ambiguous requests
are reconciled instead of blindly replayed. Paid orders are protected; a valid
SUCCESS received during cancellation still issues one entitlement.

DOKU requires merchant Order Cancellation activation. Supported channels are QRIS
and eligible Virtual Accounts; excluded banks and other channels show an honest
message. Buying a different product uses a separate intent. A confirmed cancellation
clears only its mapped browser intent. No real buyer orders were cancelled as an
automated production test.

Legacy intents older than 24 hours with no saved checkout URL and an unknown
checkout state can be closed locally only after their owner requests cancellation
and the provider status call returns not-found. This is expressly labelled local
closure, not proof of provider cancellation or absence of funds. The provider state
stays unknown and remains in reconciliation; a later signed SUCCESS still wins.

Reference: https://developers.doku.com/accept-payments/doku-checkout/order-and-notification-handling/cancel-order-api

## Email

Account confirmation remains in Khadafi's Supabase Auth project. The short
`supabase/templates/confirmation.html` preserves the manual fragment-based
confirmation flow so a scanner GET does not consume the token. The owner applies
this body in Supabase Email Templates. Chikki configuration is outside this release.

DOKU paid/cancelled status transitions create a unique durable transaction email
outbox item. The existing five-minute Worker cron claims a maximum of three jobs,
sends through a provider adapter and records controlled outcomes. Only SMTP DATA
acceptance marks a message sent. Delivery failures retry with backoff, capped at five
attempts; expired leases recover after crashes. A stable Message-ID reduces duplicate
messages, but SMTP cannot guarantee exactly-once delivery after an ambiguous failure.
The outbox and attempt log are service-only with RLS and no buyer/anonymous grants.

Worker configuration:

- `TRANSACTION_EMAIL_ENABLED=true` (repository configuration; disable to pause sends).
- `SMTP_USER`: existing Gmail sender username (Worker variable or secret).
- `SMTP_FROM`: same Gmail address. Gmail From spoofing is rejected.
- `SMTP_PASS`: Gmail App Password, **Worker Secret only**, never Git or chat.
- `SMTP_HOST`: optional, defaults to `smtp.gmail.com`; TLS on port 465.
- Existing `SUPABASE_SERVICE_ROLE_KEY` remains a server secret.

The SMTP dependency is pinned. Transport logs are disabled; application logs contain
only opaque queue IDs and controlled error classes. Credentials, recipients, message
bodies and raw SMTP responses are not logged. Migrating to a professional SMTP
provider changes adapter/environment configuration, not checkout or settlement logic.

SMTP acceptance proves submission to Gmail, not delivery to the recipient's inbox.
Inbox placement must be checked on the receiving account. Gmail authentication and
reputation are controlled by Google; adding domain DNS records cannot authenticate a
personal `gmail.com` sender as `khadafidaffa.com`.

Hosted test, 23 October 2026: the receipt for the owner's approved Rp1,000 payment
was accepted by Gmail SMTP on its first attempt. The owner subsequently confirmed
that both this receipt and a fresh account-confirmation email reached Spam. The
provided confirmation headers show SPF PASS, DKIM PASS (`gmail.com`) and DMARC PASS.
Inbox placement therefore remains unresolved; do not report it as fixed. The
SMTP credentials and authentication path work. Further remediation requires sender
reputation/filter investigation or a separately configured professional domain
sender, followed by another receiving-inbox test. Do not weaken email confirmation
or change Chikki to work around filtering.

## Framework security

The release updates Next.js and eslint-config-next to 16.4.2 after newly published
advisories affected 16.3.8. A fresh production-dependency audit reports no high or
critical findings, with six moderate findings remaining in selector/frontmatter
dependency chains. This is not a claim that all development advisories are resolved.

References: https://supabase.com/docs/guides/auth/auth-smtp and
https://support.google.com/mail/answer/81126

## Verification

- `scripts/test-doku-safety-db.cjs`: embedded PostgreSQL; settlement, ownership,
  cancellation races, promotion constraints, service-only access, outbox retry and
  crash recovery. Set `PGLITE_MODULE` when PGlite is installed outside this checkout.
- `scripts/test-cancellation-promotions.cjs`: offline HTTP/signature and API guards.
- `scripts/test-transaction-email.mjs`: TLS configuration, sender alignment, private
  content and accepted-only email audit. No SMTP network calls.
- `scripts/test-promotions-cancel-browser.cjs`: loopback fixture, synthetic auth,
  intercepted writes; desktop/mobile and dark/light. Removes its fixture on exit.
- Existing Checkout handoff, signed reconciliation and workerd regressions.
- Full Next production build, OpenNext bundle, public artifact preflight and live
  HTTP/browser verification. Hosted email acceptance is recorded separately.
