# Khadafi Digital Product Store — MVP

Implementasi 4 Oktober 2026. Produk pertama: **Formula Profitable Blueprint**, **Rp59.000 / IDR**. Produk tersimpan sebagai **draft** di Supabase karena PDF final belum ditemukan. Cover baru tersedia di `public/products/formula-profitable-blueprint-cover.webp` (900 × 1.350, sekitar 112 KB) dan versi PNG resolusi penuh.

## Yang ditemukan dan diubah

Stack existing: Next.js 16.3.3, Supabase, Blog Studio berbasis email/password, OpenNext Cloudflare, Worker `khadafi`. Sebelumnya belum ada domain commerce. Integrasi ini menggunakan proyek Supabase dan identitas Auth yang sama. Blog Studio tetap tersedia di `/studio`; login dipusatkan ke `/login`. UI commerce mengikuti charcoal, warm ivory, dan sage, dengan light/dark mode yang memakai preferensi tema homepage.

Public navigation dan footer Products sekarang menuju `/products`. Footer, homepage, blog, resources, freelance, serta community tetap memakai implementasi existing. Data commerce sepenuhnya dari database; tidak ada katalog produk contoh atau pesanan contoh di production. Cover judul pertama ditampilkan sebagai pengumuman “Sedang disiapkan”; draft database dan isi file tidak terbuka ke publik.

## Routes

| Area | Routes |
|---|---|
| Storefront | `/products`, `/products/[slug]` |
| Shared authentication | `/login`, `/register` |
| Checkout | `/checkout/[slug]`, `/checkout/success?order=UUID` |
| Customer | `/account`, `/account/library`, `/account/orders` |
| Private Studio | `/studio`, `/studio/products`, `/studio/products/new`, `/studio/products/[id]`, `/studio/orders`, `/studio/customers` |
| Owner preview | `/products/[slug]?preview=1` — requires server-verified Studio authorization |
| Commerce APIs | `/api/commerce/orders`, `/api/commerce/download`, `/api/commerce/webhook` |
| Studio APIs | `/api/studio/products`, `/api/studio/products/[id]`, `/api/studio/products/[id]/files`, `/api/studio/commerce` |
| Session bridge | `/api/auth/session` |

Studio CMS supports create/edit, category, IDR price, public cover upload, private PDF/ZIP upload, description, included items, audience, text preview, SEO, featured flag, draft/publish/archive. Save the draft before uploading product files. Publishing is rejected by a database trigger if no private file is registered.

Customer Library lists active owned products, including archived products the customer still owns. The API returns expiring download links only after checking ownership and expiry. Orders keep historical product name/price and customer identity snapshots; Customers is an aggregation by the same Auth user ID, not another identity system.

## Database and applied migrations

Setup source: `supabase_commerce.sql`. Applied to existing project `mykgtajanxczdnzekycl` through Supabase MCP:

1. `khadafi_commerce_foundation`
2. `khadafi_commerce_explicit_privileges`

Tables:

- `commerce_products`: public product content, price, SEO and status.
- `commerce_product_files`: private storage paths, names and version extension.
- `commerce_orders`: user identity, customer snapshot, total, status, provider, payment reference and idempotency key.
- `commerce_order_items`: historical name and unit price.
- `commerce_entitlements`: normalized resource type, resource ID, source order, state and expiry.

Private bucket: `commerce-files`, maximum 50 MB per PDF/ZIP. Existing `blog-media` is reused for public cover images. File upload and file metadata require existing Studio allowlist authorization.

Do not rerun the standalone setup SQL against a database where these objects already exist. The migrations are already applied; the file documents/bootstrap the schema for a fresh environment.

## Security decisions

- Every commerce table enables RLS. Public visitors can read published products only.
- Existing `private.is_blog_admin()` allowlist enforces owner access through `studio_access()` after the homepage migration. It checks the verified `auth.users` identity by `auth.uid()`. Server and RLS use the same database permission; `BLOG_ADMIN_EMAIL` is no longer the authorization source. User-editable `user_metadata` is used only for display name, never permissions.
- Private layouts validate Supabase `getUser()` server-side. Studio APIs independently require owner authorization. APIs use bearer tokens; a same-origin validated bridge creates a short-lived HttpOnly, SameSite=Lax, HTTPS-only production cookie for server rendering.
- Login reuse preserves Supabase browser session refresh. An expired server cookie returns through the shared login, which refreshes/synchronizes the existing browser session.
- A small Proxy overwrites the internal return-path header so direct private-page login returns to the original page. It does not decide authorization.
- Mutating customer commerce APIs never trust cookies alone, browser-supplied roles, user IDs, emails, prices or paid statuses.
- Trusted order/fulfillment SQL functions use SECURITY INVOKER and are executable only by `service_role`. Explicit grants remove inherited TRUNCATE/REFERENCES/TRIGGER privileges from public client roles.
- Order creation, order items and free entitlements are one database transaction. Per-customer idempotency keys and advisory locks prevent duplicate order creation. New orders are limited to 5 per hour per user.
- Midtrans request uses the database order total and an `Idempotency-Key`. Server credentials are never sent to browser code.
- Webhook verifies the SHA-512 signature in constant time, then retrieves canonical transaction status directly from Midtrans. The signature does not cover every notification field, so the webhook never trusts the notification's status alone.
- Atomic fulfillment locks the order, checks amount/provider/reference, grants entitlement once, prevents paid → pending downgrade, and revokes the matching order's entitlements on full refund.
- Browser success redirect never writes payment state. It reads only the authenticated customer's order.
- Download requires a valid active entitlement, then signs private file URLs for 900 seconds. Responses carrying customer data or signed URLs use `private, no-store`.
- Studio/account/checkout/auth pages are noindex; robots excludes them. Sitemap includes only published products. Draft previews are noindex.

## Cloudflare configuration — exact names

Worker: **khadafi**. Go to Workers & Pages → khadafi → Settings → Variables and Secrets.

| Name | Type | Production value/action |
|---|---|---|
| `MIDTRANS_SERVER_KEY` | **Secret** | Server Key from the **Production** Midtrans dashboard. User supplies this privately in Cloudflare. |
| `MIDTRANS_IS_PRODUCTION` | Environment variable (or Secret) | `true` for production; `false` for local Sandbox testing. |
| `MIDTRANS_ENABLED` | Environment variable (or Secret) | Keep `false` until the ebook, merchant channels, and verified payment flow are ready. Set `true` to open checkout. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret**, already present | Existing project's server-only key. Required for atomic checkout, webhook and signed downloads. |
| `BLOG_ADMIN_EMAIL` | Legacy setting | No longer grants access after the homepage migration; verified identities must be in the protected `blog_admin_emails` allowlist. |
| `NEXT_PUBLIC_SUPABASE_URL` | Existing public configuration | Existing Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Existing public configuration | Existing publishable key. |

**`MIDTRANS_CLIENT_KEY` is not required or read by this implementation.** It uses Snap **redirect**, without snap.js/browser SDK. If a future popup integration is added, a Client Key will be needed; it must never substitute for the Server Key.

No `NEXT_PUBLIC_MIDTRANS_SERVER_KEY` variable. No production key in source control, build logs or chat. Production checkout also requires `MIDTRANS_IS_PRODUCTION=true` to prevent accidentally exposing Sandbox checkout to customers.

Current checked Cloudflare secrets: existing Supabase/Studio secrets are configured; Midtrans keys were not configured during implementation. Midtrans checkout therefore stays closed.

## Midtrans Dashboard configuration

1. Complete merchant activation and enable the payment channels intended for launch in **Production**. Availability depends on the merchant account and Midtrans activation.
2. Choose **Production**, then obtain the production **Server Key** from **Settings → Access Keys**. Put it in Cloudflare `MIDTRANS_SERVER_KEY`.
3. Under **Settings → Configuration**, set **Payment Notification URL** to:

   **https://khadafidaffa.com/api/commerce/webhook**

4. Set **Finish Redirect URL** to **https://khadafidaffa.com/checkout/success**. The application supplies a transaction-specific `callbacks.finish` with `?order=UUID`, allowing the customer to view their own order.
5. Set **Unfinish Redirect URL** and **Error Redirect URL**, if these fields are exposed by the dashboard, to **https://khadafidaffa.com/account/orders**.
6. Test the complete Sandbox flow locally with a Sandbox Server Key and `MIDTRANS_IS_PRODUCTION=false`. Verify that an unpaid redirect does not grant access, an authenticated notification grants once, duplicate notifications are safe, and refund revokes only the matching purchase.
7. After the real PDF and production credentials are ready, test one real low-value transaction, check the provider notification log and server order status, confirm Library/download, then open checkout with `MIDTRANS_ENABLED=true`.

Reference: [Midtrans Snap integration](https://docs.midtrans.com/docs/snap-snap-integration-guide), [webhook verification](https://docs.midtrans.com/docs/https-notification-webhooks), [API headers and idempotency](https://docs.midtrans.com/reference/api-headers).

## First-product launch checklist

1. Sign in at `/login` with the existing owner account.
2. Open `/studio/products` → **Formula Profitable Blueprint**.
3. Price is already **59000**, currency **IDR**. Fill actual short description, description, included contents, audience and any preview text from the finished ebook.
4. Upload the final PDF into private product storage. No public PDF URL is necessary.
5. Configure Midtrans secrets and notification URL as above.
6. Verify payment and fulfillment; change status to **Published** and save when ready.
7. Storefront, product detail, SEO and sitemap automatically use the published database row.

The ebook file was not located by filename search in drive E. No unrelated private documents were opened or uploaded. The product remains draft, and production visitors see an honest preparation state.

## Validation

- `node scripts/check-commerce.cjs`: 11 security regression checks pass.
- `scripts/check-commerce-database.sql`: real database transaction/ownership/RLS/payment tests pass; all test fixture mutations are rolled back.
- Targeted ESLint: all new commerce code passes.
- TypeScript and Next.js production compilation pass.
- OpenNext Cloudflare build completes. Its Windows workerd package-copy warnings were followed by actual local Worker HTTP checks.
- Existing editorial and freelance discovery regression scripts pass.
- Local Worker: Products and Blog return 200; anonymous Account/Studio redirect to login; Studio API returns 401; draft product returns 404.
- Public storefront tested at desktop and mobile in light/dark modes, with no horizontal overflow and a fully loaded cover. No public Studio links.
- Full repository ESLint has existing failures in unrelated/shared legacy components; do not describe full lint as passing.
- Supabase security advisors report no commerce-specific finding. Existing blog trigger-function/auth notices remain outside this release scope.
- Live Midtrans payment, actual ebook fulfillment and production owner/customer browser transactions remain unverified until the user supplies the key and final PDF.

## Extension points and limits

No fake Community/Services/Subscription/Coupon UI. Existing Auth identity and resource-oriented entitlements provide clean future extension points. Service engagements and community memberships should reference the same Auth user ID.

Transactional email is not connected because there is no configured commerce email provider. Add a transactionally inserted outbox inside the successful payment RPC, keyed uniquely by order/event, then process receipts/access notifications after commit. Never dispatch a purchase receipt from the browser redirect.

MVP currently supports one product per checkout, whole refunds, PDF/ZIP bundles, and text previews. It does not offer advanced analytics, coupons, automated tax invoices, partial-refund accounting, version retirement UI, or provider reconciliation jobs. Studio Orders shows the latest 250 orders; Customers summarizes up to the latest 1,000 orders and is not a complete financial report.

Session storage, password policy and email confirmation follow the existing Supabase project. Enable signup confirmation and set Site URL to `https://khadafidaffa.com`, with `https://khadafidaffa.com/login` allowed as an auth redirect. No auth provider or identity was migrated.

Local dev now uses `.next-dev` while production uses `.next`, keeping QA and deploy output separate. Loopback fixtures in `scripts/commerce-fixture.cjs` are never imported into the application or production deployment.
