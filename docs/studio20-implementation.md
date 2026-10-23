# Khadafi Studio 2.0

Implementation branch: `codex/khadafi-studio-apps-analytics`, based on `origin/main` at `c4b7ba5`. The original E:\khadafi-website checkout contains unrelated uncommitted work and was preserved.

## Product decisions

The public website remains the editorial place to discover work, read, and use resources. Studio is the private operating space. Apps is a separate public collection and private manager, with shared brand, identity, and navigation.

The writing canvas is warm paper, about 800px wide, with 17–18px body text and generous leading. The library and inspector are closed by default and overlay the canvas when opened. Insert, table, history, AI, and repurposing actions live in a secondary menu. TipTap, autosave, snapshots, and publish RPCs are preserved. Layout preferences use a new versioned key so the earlier crowded layout does not override the new defaults.

Apps and Affiliate Manager use a forest navigation sidebar, ivory workspace, serif page headings, native keyboard-accessible dialogs, readable tables, and restrained status colors. The KS mark comes from the owner's existing `Intertwined Gunmetal KS Monogram.png` in Downloads; the navigation derivative is cropped/resized to 128px WebP. No new logo was invented.

## Routes

| Route                                                | Purpose                                                                                   |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `/apps`                                              | Published catalog; search, use-case tags, price filters, sorting                          |
| `/apps/[category]`                                   | Category collection                                                                       |
| `/apps/[category]/[slug]`                            | Published/maintenance detail, availability and pricing                                    |
| `/studio/apps?area=…`                                | Private overview, registry, category editor, pricing, access, analytics, orders, settings |
| `/api/apps/categories`                               | Public navigation categories                                                              |
| `/api/studio/apps/registry`                          | Authorized registry reads and create/update                                               |
| `/api/studio/apps/categories`                        | Authorized category reads and create/update                                               |
| `/api/studio/apps/entitlements`                      | Authorized read-only licenses                                                             |
| `/api/studio/affiliate-workspace/[entity]`           | Authorized opportunities/categories/placements/experiments                                |
| `/api/studio/affiliate-workspace/promote`            | Approved research to draft program, atomic                                                |
| `/api/studio/affiliate-workspace/import-commissions` | Reviewed atomic CSV import                                                                |

The existing `/studio/affiliates`, `/go/[slug]`, account, checkout, blog, and commerce routes are retained. No mini-app is created or seeded. Internal destinations must match the explicit, initially empty `INTERNAL_APP_ROUTES` registry before publication. A database row cannot execute uploaded code.

## Apps data and publishing

The additive migration is `supabase/migrations/20261023185741_studio_apps_and_affiliate_workspace.sql`.

New Apps tables: `app_categories`, `apps_registry`, `app_entitlements`, `app_usage_events`, `apps_audit_log`. Six real category definitions are bootstrapped, with no fake applications, reviews, usage, orders, or revenue. Categories remain editable in the manager and populate the navbar dynamically.

Registry fields include ID/EN descriptions, icon/cover URLs and existing Studio media uploads, tags, deployment, destination, preview metadata, per-app model/price, scope, allowance metadata, version, SEO, featured flag, publication status, and timestamps. Drafts and archived apps are excluded by RLS; maintenance details remain visible with launch closed. Updates use optimistic concurrency. Both registry and category mutations have database audit triggers. There is no hard delete workflow.

Public text is React-escaped, not arbitrary HTML. External URLs require HTTPS, no credentials or custom ports, and reject local/private addresses. The app does not fetch or execute a submitted destination URL. The optional preview URL is metadata, not an iframe.

The English fields are the preparation for reviewed native English publishing. Existing Google Translate remains visitor-controlled. There are no generated English SEO pages or false hreflang declarations. Future `/en` pages must use reviewed content with self-canonical metadata and reciprocal hreflang.

## Monetization proposal

These are experiment hypotheses, not validated market prices or revenue forecasts.

| Tool economics                                | Initial approach                                                                                  |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Simple deterministic tool                     | Free core function to test repeat usage                                                           |
| Useful deterministic tool with export/history | Test Rp25,000 once per account for the stated major version                                       |
| Frequent professional workflow                | Test a higher one-time price or bundle after evidence of repeat usage                             |
| AI API cost on each use                       | Credits or subscription with explicit quota; price after measuring actual cost per successful job |

Do not promise unlimited AI inference or indefinite support under lifetime pricing. State the supported version, account scope, fair-use limits, maintenance policy, and what a major upgrade means before taking payments. An introductory Rp25,000 price is a useful willingness-to-pay test, not the default for every app.

Models supported as metadata: free, freemium, one-time purchase, monthly subscription, and credit pack. Only published **free** apps expose a launch CTA in this milestone. Paid/freemium apps clearly state that paid access is not open. Prices and allowances do not issue entitlements or enforce quotas themselves.

The existing `commerce_entitlements.resource_id` has a foreign key to products, so it cannot safely be repurposed for Apps. App licenses instead reference an existing commerce order and an app, with unique `(order_id, app_id)`. Authenticated users can read only their own licenses; they cannot insert/update licenses. `requireAppAccess` checks published status and an active, unexpired, version-compatible entitlement at server operations.

Remaining payment adapter gate: bind immutable app/pricing/version snapshots to existing commerce orders, issue/revoke app licenses atomically from verified DOKU settlement/refund events, prove idempotency, and test the actual provider flow before opening Apps checkout. No DOKU/payment function or production setting is changed by this work.

## Affiliate operation

Preserved: programs, links, campaigns, commissions, stats, signed navigation tokens, bot/prefetch filtering, idempotent click IDs, exact destination allowlist, preview/production scope, and audit.

Added: eight editable categories, program category/portal/terms/payout/geography fields, research opportunities, placements, experiments, payout overview, separate audit area, and revenue breakdowns by program, category and confirmation date, separated by original currency. No unlabelled FX conversion, click-to-commission assumption, automatic provider sync, or fabricated significance.

Discovery stages: researching, interested, applied, pending, approved, rejected, inactive. Approved research can become a draft program through a locking, transactional RPC. It does not automatically approve a referral domain. Keep both `AFFILIATE_ALLOWED_HOSTS` and `private.affiliate_allowed_hosts` aligned through a separately reviewed provider onboarding change.

Placements enforce Program → Link → Campaign foreign-key consistency and capture public URL/disclosure. Placement-specific clicks and revenue are explicitly unmeasured until attribution is integrated; campaign totals are not presented as proof of a placement conversion. Experiments store hypothesis, control/variant CTA, KPI, dates, and result notes without claiming statistical significance.

CSV import: strict documented header mapping, quoted-field parser, 256KB/200-row limits, client preview and server revalidation, in-file duplicate detection, database duplicate rejection, evidence/date requirements, and an atomic invoker RPC. A single invalid/duplicate row rolls back the entire batch. Existing ledger rows are never overwritten. Provider accounts/passwords do not belong in notes.

## Analytics setup

Measurement ID: `G-P6D1E895XB`, supplied by the owner. `NEXT_PUBLIC_GA_MEASUREMENT_ID` supports build-time configuration and has the supplied public ID as fallback. Set it in Cloudflare Builds before building; Wrangler runtime vars alone do not change an already built `NEXT_PUBLIC_*` bundle.

Tracking uses `next/script` after interaction and only loads after analytics consent. Translation consent never enables analytics. The public banner offers accept/decline; `/cookies` provides independent essential, analytics and translation controls. Revocation disables the tag, clears first-party `_ga*` cookies, and reloads to remove executed code. Canonical production hostname only by default; preview does not send into this property. `NEXT_PUBLIC_GA_DEBUG=true` is restricted to localhost for QA and must not be enabled in a production build.

Public routes are explicitly allowlisted. Studio, account, login/register, auth, checkout, API and referral redirect documents never initialize the tag. Entering sensitive routes after the tag has run uses a fresh document. Manual events override page location with canonical path only, remove query/fragment/referrer, avoid document titles from user content, and disable Google signals/ad personalization. No client purchase API exists in the analytics helper.

Typed event boundary: page_view, select_content, search, generate_lead, view_item, begin_checkout, affiliate_click, app_open, app_used, app_paywall_viewed, language_changed. This milestone wires public page views, catalog selection/search (search is the fixed label `apps_catalog`, never visitor text), app launch/paywall display and language selection. Remaining event names are integration contracts, not claims of already tracked conversions. Purchases need a consent-aware server outbox with verified DOKU settlement and stable transaction IDs before enabling; no API secret or synthetic purchase is invented.

### Required GA4 console settings before tag activation

In GA4 → Admin → Data streams → Khadafi Main Website → Enhanced measurement:

1. Turn off **Page changes based on browser history events** (advanced page-view setting). This project sends one explicit page_view per public pathname.
2. Disable automatic outbound clicks, site search, form interactions, file downloads and other automatic events for this stream. They can include raw destinations or visitor-entered parameters. Add intentional sanitized events in code instead.
3. Keep collection settings consistent with the public consent implementation. Register only useful custom dimensions such as app_id and pricing_model.
4. After an approved deployment, visit a public page, allow analytics, and verify one page_view in Realtime/DebugView. Navigate publicly, deny/withdraw consent, and enter Studio to verify those boundaries. Confirm the network payload has no raw query, form fields, email, or private path.

The Google console cannot be verified from a screenshot alone. A code-level pageview test does not prove remote receipt or that automatic measurement settings are disabled.

### Live account evidence, 24 October 2026 (Asia/Jakarta)

Windsor reports connected GA4 account/property `560565574`, **Khadafi Digital Business**. A read for 1–24 October 2026 using `date`, `sessions`, `screen_page_views`, `event_count` returned `status: done`, `data: []`, `total_rows: 0`. Connection exists; this does not prove zero real visitors or tag activation. No Search Console connection was returned by the connected-source inventory.

For regular audits use GA4 for usage/acquisition, Search Console for search queries/indexing, and PageSpeed Insights for page experience. Windsor supplies access to connected reporting data; it is not the collector. Review weekly: source → useful content/app opens → verified lead/purchase, then read affiliate provider statements separately. Compare periods only once reliable data is available. No recurring automation or paid analytics subscription was created.

Official references: [GA4 pageviews and history measurement](https://developers.google.com/analytics/devguides/collection/ga4/views), [Google consent mode](https://developers.google.com/tag-platform/security/guides/consent), [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Release and verification

No production migration, merge, push, or deployment is implied by local implementation. Before release: review the additive schema, apply it to an isolated database, run API/browser tests and OpenNext/workerd checks, configure GA4 console as above, review the exact diff and public bundle, then obtain approval for production migration and deployment. Preserve existing Worker bindings and DOKU settings.

The generated Next agent rules remain intact; Next may refresh their managed block. Test-only fixtures are in scripts/artifacts, never public app routes or authentication bypasses.

Validation results and remaining activation gates are recorded below.

Activation safeguard: `NEXT_PUBLIC_GA_MANUAL_EVENTS_READY=false` by default. Set true at build time only after the console settings above are confirmed. The tag remains off even after visitor consent until that review is complete. This avoids depending on unverified Enhanced Measurement settings.

## Verification recorded in this worktree

- 14 foundation groups passed on embedded PostgreSQL, including RLS ownership, CSV rollback, real ledger aggregation, audit, and publication visibility. No SQL was applied to production.
- 30 existing affiliate validation checks passed.
- 22 existing offline DOKU/QRIS safety checks passed; no provider transaction or email was sent.
- 20 browser groups passed on a loopback HTTP fixture, including CRUD, draft exclusion, publication, search, mobile drawer, autosave, preview/Escape, article publish RPC handoff, consent/withdrawal, anonymous API denial, and database outage recovery. Browser runtime exceptions: 0.
- Separate responsive smoke passed at 390, 768, 1024 and 1440 pixels with 0 overflow and 0 hydration warnings. Three hydration console warnings in the earlier full suite were traced to Playwright screenshot caret styling; corrected screenshots preserve the caret. The forced database outage also intentionally logged one HTTP 503.
- Targeted new-module ESLint passed with no output. Whole-repository comparison found 21 existing errors; each affected file had the same error count when its committed HEAD source was linted. No legacy error was disguised as a passing full lint.
- Next production build: compiled and typechecked, 191 pages; final packaging verification is recorded below.

Evidence: artifacts/studio20/foundation-tests.json, browser-tests.json, visual-smoke.json, changed-lint.txt, lint-baseline.json, production-build.log and screenshots.

## Hosted read-only findings

Production baseline read returned 1 affiliate program, 1 link, 1 campaign and 0 commissions. The Apps schema is not installed in production. Existing records were not migrated or edited.

Supabase security advisors returned inherited findings: three public SECURITY DEFINER engagement functions retain EXECUTE grants to anon/authenticated; a read confirmed all three return trigger, so the linter warning is not evidence that an ordinary RPC can invoke their trigger bodies. Review/restrict their direct grants as separate hardening: [anonymous definer guidance](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable). Leaked-password protection remains disabled in existing Auth settings: [Supabase password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). Twelve existing RLS/no-policy informational findings include private/service-operated tables; adding public policies merely to clear them would be inappropriate. None of these production policies or Auth settings was changed. These advisors do not evaluate the unapplied Apps migration.

## Exact review file inventory

- .env.example
- AGENTS.md
- eslint.config.mjs
- scripts/check-opennext-runtime.mjs
- src/app/api/studio/affiliates/[entity]/route.ts
- src/app/cookies/page.tsx
- src/app/globals.css
- src/app/layout.tsx
- src/app/sitemap.ts
- src/app/studio/affiliates/page.tsx
- src/components/commerce/PrivateNav.tsx
- src/components/commerce/StudioRootNav.tsx
- src/components/legal/CookiePreferences.tsx
- src/components/shared/GlobalTranslator.tsx
- src/components/shared/navbar.tsx
- src/components/studio/AffiliateManager.tsx
- src/components/studio/BlogStudio.tsx
- src/components/studio/StudioArticleRail.tsx
- src/components/studio/StudioDocumentHeader.tsx
- src/components/studio/StudioHeader.tsx
- src/components/studio/affiliates.module.css
- src/content/legal.ts
- src/content/public-navigation.ts
- src/lib/affiliate-auth.ts
- src/lib/affiliate-types.ts
- src/lib/affiliate-validation.ts
- src/lib/public-routes.ts
- docs/studio20-implementation.md
- public/images/brand/khadafi-studio-ks.webp
- scripts/test-studio-foundation.cjs
- scripts/test-studio20-browser.cjs
- src/app/api/apps/categories/route.ts
- src/app/api/studio/affiliate-workspace/[entity]/route.ts
- src/app/api/studio/apps/[entity]/route.ts
- src/app/apps/[category]/[slug]/page.tsx
- src/app/apps/[category]/page.tsx
- src/app/apps/page.tsx
- src/app/studio/apps/page.tsx
- src/components/apps/AppsCatalog.tsx
- src/components/apps/apps.module.css
- src/components/shared/PublicAnalytics.tsx
- src/components/studio/AffiliateWorkspaceRecords.tsx
- src/components/studio/AppMediaField.tsx
- src/components/studio/AppsManager.tsx
- src/components/studio/CommissionImport.tsx
- src/components/studio/editorial.css
- src/components/studio/manager.module.css
- src/components/studio/workspace/WorkspaceShell.tsx
- src/components/studio/workspace/workspace.module.css
- src/lib/affiliate-import.ts
- src/lib/affiliate-workspace.ts
- src/lib/analytics-policy.mjs
- src/lib/analytics.ts
- src/lib/apps-server.ts
- src/lib/apps-types.ts
- src/lib/apps-validation.ts
- supabase/migrations/20261023185741_studio_apps_and_affiliate_workspace.sql

## Final packaging result

Final Next build, TypeScript and 191 generated pages passed. OpenNext 1.20.13 packaging passed. Actual local workerd rendered /, /apps, /products, /resources and /login; the transactional-email webhook rejected GET with 405. Both new private manager APIs rejected anonymous access with 401 and private no-store. Packaged BUILD_ID matched the build. Public preflight scanned 553 files and found none of the explicit test-only markers; this is a bounded marker check, not a blanket secret audit.

The production read-only baseline still returned / 200 and /apps 404, with no GA4 tag detected in those raw responses. No production release, migration, provider call, email send or GitHub push was performed. GA4 Realtime/DebugView receipt, hosted owner CRUD, live Apps checkout, external-app SSO and quota enforcement remain unverified or future integration gates as described above.
