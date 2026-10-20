# Evidence DOKU V2

## Status wajib dipisahkan

| Task | Status | Bukti / batas |
|---|---|---|
| SANDBOX_CHECKOUT_E2E | BLOCKED | Sandbox keys tidak tersimpan; staging HTTPS 502, Worker staging tidak ada. Histori PR #4 bukan retest provider saat ini |
| SANDBOX_MANDIRI_VA_WEBHOOK | BLOCKED | Belum ada event asli saat audit; perlu konfigurasi channel Non-SNAP dan HTTP Notification Center |
| SANDBOX_QRIS_WEBHOOK | BLOCKED | Kanal sandbox/credentials belum diverifikasi. 22 pemeriksaan QRIS inert offline PASS, bukan webhook provider |
| RECONCILIATION_CRON_AND_HMAC | BLOCKED untuk hosted cron; PASS tes lokal | Scheduler contract + HMAC GET + lease/backoff/recovery SQL PASS; deployment scheduler nyata belum tersedia/diizinkan |
| FREE_ORDER_PRODUCTION | NOT_TESTED | Tidak melakukan mutasi production. Free order lokal PostgreSQL dengan service_role PASS |
| PRODUCTION_QRIS_ACTIVATION | APPROVED_EMAIL__UPDATING_DASHBOARD | User mengonfirmasi masih UPDATING pada percakapan ini |
| LIVE_CHECKOUT_INITIATION | BLOCKED | Belum ACTIVE dan belum izin transaksi/config production |
| LIVE_PAYMENT_E2E | NOT_TESTED | Tidak membayar uang asli atau meminta PIN/OTP |
| DIGITAL_DELIVERY | PASS lokal untuk otorisasi; BLOCKED live | Tes download/expiry/IDOR commerce lama PASS; full real Supabase private-PDF CI baru akan dicatat setelah run selesai |
| CATALOG_GALLERY_ZOOM | PASS lokal | 12 layout (360/390/768/1440), preset zoom 50–150, reset, keyboard, Escape/focus; nol page errors |

## Hasil yang diperoleh langsung

- `node scripts/test-doku-webhook-signature.mjs`: PASS HMAC/invoice dengan unit vector inert.
- `node scripts/test-doku-webhook-http.mjs`: 15 HTTP contract cases PASS pada loopback, exact handler aplikasi.
- `node scripts/test-doku-checkout-host.mjs`: 12 allowlist cases PASS.
- `node scripts/test-doku-get-status-signature.mjs`: GET request/response tanpa Digest, tampering/missing signature PASS.
- `node scripts/test-doku-reconciliation.mjs`: suite sebelumnya PASS, termasuk wrong signed amount tidak mencapai settlement dan batch maksimal 10.
- `node scripts/test-doku-qris-safety.mjs`: 22 pemeriksaan PASS: format QRIS_DOKU Non-SNAP, signature invalid/Client/target/currency/invoice/amount, stale/future timestamp, 32 KiB body, durable failure, duplicate/conflicting replay, concurrent SUCCESS, late PENDING, config environment, independent public/private gates, scheduler binding/token.
- `node scripts/test-doku-checkout.cjs`: signed Checkout request/response, no amount zero/provider call, fixed request ID, strict URL, kill switch; actual orders route mengabaikan amount/status/user_id client. PASS tanpa request eksternal.
- `node scripts/test-doku-safety-db.cjs`: 11 kelompok PostgreSQL embedded PASS, termasuk fungsi dijalankan sebagai service_role, schema privileges, new migration, QA draft constraint/free order, atomic inbox/grants, lease/backoff/recovery/refund.
- `node scripts/check-commerce.cjs`: 11 pemeriksaan keamanan existing PASS; historical Midtrans callback tetap diuji, bukan provider aktif baru.
- Regresi `check-resource-library.cjs`, `check-business-hub.cjs`: PASS 11 resources, 80 paths, 24 komponen, 42 assets/checksums.
- Lint source berubah PASS tanpa error/warning pada pemeriksaan terarah. TypeScript PASS. Next webpack build PASS dengan 187 halaman. OpenNext/Worker check dicatat di bagian pembaruan di bawah setelah selesai.

Artefak lokal di `artifacts/payments/` (ignored): sql-verification.json, browser-verification.json, worker-inventory.json, https-readiness.json, lint/typecheck/build logs dan screenshot actual catalog/gallery. Tidak mengunggah secrets/checkout URL/signed URL.

## Temuan selama pengujian

- Test fixture produk perlu draft -> file private -> publish sesuai guard existing; diperbaiki, guard tidak dibypass.
- Pembesaran mockup sempat menutupi tombol preview: z-index tombol diperbaiki, QA ulang PASS.
- Read-only privilege audit menemukan service_role tidak punya SELECT auth.users/admin allowlist. Lookup QA dipindah ke helper sempit `private.commerce_payment_qa_email`, fixed search_path, service-only execute, tidak diekspos Data API. Tidak memberi service_role broad SELECT Auth.
- Bundel artikel pada checkout baru memiliki perbedaan newline teks Windows. Regenerasi melalui script existing (tanpa perubahan artikel) membuat check PASS; tidak ada perubahan naskah pada diff.
- `check-commerce-experience.cjs` masih memakai fixture Midtrans untuk create checkout dan perlu disesuaikan dengan adapter DOKU sebelum dapat menjadi regression gate baru; gate DOKU memakai suite checkout dan SQL/PDF di atas.

## Referensi primer yang diperiksa

- [Backend Checkout, termasuk payment_method_types QRIS](https://developers.doku.com/accept-payments/doku-checkout/integration-guide/backend-integration)
- [Notifikasi Non-SNAP, Mandiri dan QRIS_DOKU](https://developers.doku.com/get-started-with-doku-api/notification/http-notification-sample-non-snap)
- [Konfigurasi notification per channel](https://developers.doku.com/get-started-with-doku-api/notification/setup-notification-url)
- [Retry resmi 30 menit, 6 jam dan 12 jam](https://developers.doku.com/get-started-with-doku-api/notification/retry-notification)
- [Check Status Non-SNAP](https://developers.doku.com/get-started-with-doku-api/check-status-api/non-snap)
- [Supabase private storage access control](https://supabase.com/docs/guides/storage/security/access-control)

Tidak menyimpulkan kesiapan settlement, status ACTIVE, ketersediaan QRIS sandbox, biaya issuer, email delivery, hosted cron, atau payment E2E dari unit/fixture tests.
