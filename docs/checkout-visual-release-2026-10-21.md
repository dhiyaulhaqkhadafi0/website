# Hosted checkout and visual readability

Based on production release `1d0f7d9`, isolated from the primary dirty worktree.

- Checkout no longer renders local payment-method radios. New intents request all eligible methods and redirect to DOKU after the buyer submits. Existing intents retain their stored method to preserve the payment lease and prevent duplicate provider sessions. DOKU determines final availability.
- A paid order explicitly returns `status: paid` and resumes its result page. A paid product missing its checkout URL cannot accidentally navigate to a success page. Pending orders show purchase-history and support recovery links.
- DOKU body metadata no longer has to reproduce the request date/signature bytes. This is not the HTTP response signature contract. Optional supplied client/request IDs must still match; supplied HTTP HMAC, exact invoice/amount/currency, fixed API transport and hosted-URL allowlist checks remain enforced. Tests cover provider-owned/partial body metadata and reject mismatched IDs or invalid HTTP HMAC. This compatibility defect is fixed; it was not proven to be the historical orders' failure cause.
- No payment credentials, pricing, webhook settlement rules, entitlement rules or production payment flags were changed. Two existing IDR 59,000 orders were read as pending/unknown without stored URLs. Neither was reset or resubmitted. This release does not establish successful IDR 59,000 payment and delivery.
- Support CTA opens the owner's supplied Threads profile. A prefilled direct-message URL was not established, so the requested profile fallback is used.
- Homepage has a layered navy background, fine grid/orbital lines, six linked editorial arrows and readable role text. The dark freelance section owns its text tokens in both themes.
- Learning Library has a shorter cover-to-hero gap, 20 lightweight code-drawn material thumbnails and native keyboard-accessible description disclosures. Search, topic filters and resource destinations are retained.
- Contrast fixes cover cream service cards, shop tags, checkout summary, light resource indexes, guide metadata, blog metadata, community labels and freelance visualizer instructions.

## Validation

- Local browser acceptance: 38 checks across 14 routes in both theme preferences, mobile layouts, resource thumbnails/disclosures and cover spacing, support destination, six section links, and intercepted checkout redirect/pending recovery. Zero uncaught browser errors. The checkout fixtures never submit real orders or payments.
- Final production-build browser acceptance: 36 public checks passed with zero uncaught errors. The sRGB contrast audit found zero remaining flagged text elements across the 14 tested routes in each theme (28 snapshots). This is measured coverage of those pages and visible states, not proof of every authenticated Studio state.
- Next production compile and TypeScript passed; 189 pages generated. Build ID: `_wjNOOgjS5AkeJoH6Vu-_`. Standalone packaging uses the same compiled build. Public preflight checked 537 files against two available local private values and found zero leaks; no QA route or public paid PDF was present. All 152 R2 cache objects were uploaded before activation.
- `scripts/test-checkout-handoff.cjs` proves authenticated ownership, server pricing, all-method handoff, paid-order reuse and pending/invalid-method handling with isolated dependencies.
- Existing DOKU documented-response, signed channel, status-signature and QRIS safety tests passed. The older `test-doku-checkout.cjs` remains incompatible with the preceding release's checkout-method imports/optional response-signature contract; its current replacement coverage is `test-doku-checkout-response.cjs` and the handoff test.
- ESLint found existing synchronous setState-in-effect errors in three blog files whose changes here only adjust colors. Baseline checks against the parent source retain those errors. No behavior refactor was included to silence them.
- `scripts/audit-visual-payment.cjs` defaults to public checks. To exercise the local dev-only checkout fixture, use `QA_CHECKOUT_FIXTURE=true`; it creates and removes its isolated route. Do not build concurrently with that optional fixture. Production preflight verifies the fixture route is absent.

Detailed logs, screenshots, contrast reports and deployment evidence are under ignored `artifacts/visual-payment/`.
