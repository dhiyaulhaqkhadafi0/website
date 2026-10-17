# Khadafi Studio Commerce Experience — 17 October 2026

## Verified starting point

Work is isolated in `E:\khadafi-website\.release\ecosystem-design`, branch `codex/studio-shop`, based on `1afe617` (equal to GitHub main at release preparation). The primary checkout contains unrelated work and is preserved. The attachment's Phase 0-only prompt is contextual planning material; the user's direct request authorizes implementation and production deployment.

Hosted audit found a published IDR 59,000 ebook with one private PDF. Its cover was an extensionless, nonexistent `/products/ebook-formula-profitable-blueprint-cover` path. The actual final mockup and PDF were found in Downloads. Public previews include only a table-of-contents page and one sample chapter page; the paid PDF is not copied into public assets.

## Delivered scope

- Charcoal/lavender atmosphere, warm ivory catalog, compact cards, consistent image stages, two-line excerpts, expandable summaries without grid growth, and clear offering-specific links.
- Tracing search border, paper-plane submit, Enter, existing contextual filters/URL state, and reduced-motion support.
- Original product hero with compact/expandable summary, structured safe Markdown subset, spaced paragraphs, ivory overview, grouped material accordions and complete creator name.
- Real mockup, public gallery, three thumbnails when the release media is installed, swipe, native modal preview, previous/next, keyboard navigation, zoom and focus restoration.
- Studio media editor: multiple uploads (12 maximum), MIME/size/decode/dimension checks, alt text, reordering, cover selection, removal from the listing, and preview before saving. Removal does not delete storage objects used elsewhere.
- Public guest checkout with explicit consent and no password, immutable server prices, database idempotency, session-stored retry keys, origin/body validation and atomic rate limiting before email identity creation.
- Guest checkout reuses Supabase email identity via server-only `generateLink`; generated auth links and tokens are discarded, never returned to the buyer. No authenticated session or Studio permission is granted. Email ownership must be verified for cross-device library access.
- Guest receipts use 30-day order-specific signed HttpOnly/Secure/SameSite=Lax cookies. Downloads check paid status, the exact order item and an active entitlement before signing private files for 900 seconds. Refunds remove guest access as well.
- Existing Midtrans Snap redirect, canonical signed webhook processing, atomic fulfillment, member orders/library and founder order management are retained. Pending guests can resume the provider payment page. Success redirects remain read-only.
- Passwordless email login is available for existing identities, with `shouldCreateUser=false`. Login does not create users. Authentication and checkout forms use POST and disable submit before hydration to keep personal data out of URLs.
- Homepage signature role gains a more visible metallic gradient and one restrained sweep, with a light theme and reduced-motion treatment.

## Database

Migration `20261017051124_commerce_media_guest_checkout.sql` adds `creator_name`, `gallery`, a service-only rate-limit table/RPC and repairs the known cover path. Existing orders, entitlements, prices and private files are preserved. Migration was tested on isolated PostgreSQL first. The Supabase `apply_migration` tool returned `Invalid or expired requestState` twice; direct SQL applied the same script atomically, then the exact CLI-generated version/name/statements were registered in migration history. Hosted verification confirmed RLS, anon denial and service-role execution. Advisors reported existing blog/Auth/private-table findings, with no new commerce finding.

`commerce-product-media-release.json` records the precise public media and 32 chapter labels transcribed from the original table of contents. This product data is installed only after its static assets are served by the deployed Worker. The existing private PDF and price are unchanged.

## Validation and release evidence

- `check-commerce.cjs`: 11 security regression checks pass.
- `check-commerce-experience.cjs`: 7 groups pass, including isolated PostgreSQL owner/reader RLS, atomic guest limits and full order/payment/refund/idempotency lifecycle SQL.
- Three real media items passed local browser thumbnail/navigation/zoom/Escape/focus testing. Temporary QA route and its generated type were removed before production build.
- Initial development browser passes covered 12 responsive layouts at 375/768/1440 pixels with no overflow or broken images. An early small-screen decorative overflow was fixed. A later dev run captured a Next router initialization error while HMR/source changes were occurring; final acceptance uses the stable production build.
- Changed-source ESLint passed; release scripts were checked as well. Whole-repository legacy lint is not claimed clean.
- Final stable local production acceptance: 7 interaction/privacy groups, 18 dark/light layouts, zero uncaught browser errors. A 4px tablet overview overflow found by this gate was corrected before the final successful build. Checkout form privacy is checked in the attached streamed SSR markup; payment requires JavaScript.
- Final Next build: exit 0, 96 generated pages; OpenNext bundle: exit 0. Existing Windows MDX package-copy warnings remain. Cache: 64 remote R2 entries uploaded. Public preflight: 467 files, two available private credentials checked, zero leaks, no temporary QA route and no paid PDF in public product assets.

## External configuration and honest limits

At the last checked pre-deploy state, Worker `khadafi` had Supabase and existing application secrets but no `MIDTRANS_SERVER_KEY`. The user said they would configure production Midtrans. Paid checkout must remain unavailable until `MIDTRANS_SERVER_KEY`, `MIDTRANS_IS_PRODUCTION=true`, and `MIDTRANS_ENABLED=true` are installed and merchant channels activated. Webhook URL: `https://khadafidaffa.com/api/commerce/webhook`. Never place the server key in source, public environment variables or logs.

No real payment, email delivery or hosted owner upload is claimed tested. Email receipts/invoices are not added; guests receive immediate on-page access after verified settlement and can access their library through verified email. Local server mocks prove security branches, not provider settlement or email deliverability. The paid PDF's original interior content is preserved.

Previous production Worker version captured for rollback: `92d9106c-6e72-40fe-b5d7-72552c491383`.

Deployment version, final production acceptance and payment configuration status are recorded below after release.

## Verified production release

| Evidence | Result |
|---|---|
| Domain | https://khadafidaffa.com/products |
| App source | `d48250dfaf06838b9171fcf7488a5f9959ea8ead`, pushed atomically to GitHub `main` and `codex/studio-shop` |
| Build ID | `DwJibYYpwd0_ULFCp3C9o`, verified from live `/BUILD_ID` |
| Worker version | `9c670428-eeb3-4a0c-8589-b60f8dfdf227` |
| Worker startup | 22 ms; gzip 2804.63 KiB |
| Bindings | ASSETS, IMAGES, WORKER_SELF_REFERENCE, NEXT_INC_CACHE_R2_BUCKET preserved; deploy uses `--keep-vars` |
| Public media | Mockup 443231 bytes, contents 226664 bytes, sample 136148 bytes; all live HTTP 200 before database activation |
| Hosted product | Full creator name, final mockup, two gallery entries plus primary image, 32 chapter labels; price and private file unchanged |
| Browser acceptance | 7 groups, 18 dark/light layouts, 3 real thumbnails, zero uncaught browser errors |
| HTTP acceptance | 22 checks pass: ecosystem pages, published article heading, media, auth redirects, invalid guest requests, origin and commerce no-store headers |
| Payment readiness | Live server key absent; paid checkout closed; no real transaction tested |

Final artifacts are in `artifacts/commerce-experience/production/verification.json` and `http-verification.json`. The uploaded private PDF's filename and size (23208642 bytes) match the local compressed source used for the previews. Its multipart storage ETag is not claimed to be a whole-file MD5 match.

The HTTP harness reads the rendered article H1 instead of treating Next's embedded fallback text as a visible 404. It records the legacy Studio unauthorized response's absent cache header separately; commerce responses are required and verified to include `private, no-store`. Authenticated Studio responses use their existing private response path. No production customer, test identity, order, payment or lead was created by acceptance.

Current external blocker: the user indicated they would configure Midtrans, but the last live check still returned unavailable integration and a closed checkout. Deployment is complete; production settlement, merchant channel availability and automatic email delivery remain unverified. No provider readiness is inferred from UI labels or local mocks.
