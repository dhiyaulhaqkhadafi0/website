# Studio & Shop — implementation plan

Base: production source 6fc1068; isolated checkout .release/ecosystem-design, branch codex/studio-shop. Primary checkout remains untouched.

Audit: Next 16.3.3/OpenNext/Cloudflare; Supabase shared Auth, Customer /account, Founder /studio. One real original product exists: Formula Profitable Blueprint, draft, IDR 59000, genuine cover but zero private files. No service-inquiry table exists. Existing affiliate manager/referral tracking remains separate and intact.

1. Create one typed discovery model joining published commerce products, verified non-affiliate editorial tool recommendations and three service offers. Do not fabricate commission links or make the unfinished ebook purchasable.
2. Build a spacious editorial storefront, contextual original/recommended collections, genuine ebook cover and clearly labeled service/tool illustrations, restrained hover/reduced motion, large search, URL state, intelligent filters and accessible mobile dialog.
3. Add curated product details and three service detail pages with actual scope, deliverables, exclusions, process and inquiry form. Preserve original product URLs/owner preview/checkout.
4. Prepare a local-only Supabase inquiry migration with RLS, owner-only reads/updates, service-only atomic submission, duplicate protection and bounded rate limits. Integrate a validated origin-checked API and existing Founder shell. Test actual database persistence locally. Do not apply migration to hosted production.
5. Verify TypeScript, changed-file lint, security/regression checks, production build and browser QA across mobile/tablet/desktop, dark/ivory, keyboard, filters, failure/retry/success forms. Produce A-H report and screenshots.

The attached master prompt explicitly scopes this new Shop iteration to local implementation/testing and a readiness report. No deployment, remote push, production migration or payment activation is part of this iteration.

Authorization update, 16 October 2026: user explicitly requested 'lanjutkan hingga selesai kemudian deploy'. Complete local QA, apply the tested inquiry migration, deploy production, synchronize GitHub under prior explicit synchronization authorization, and verify the live release. Paid checkout and unfinished products remain closed.
