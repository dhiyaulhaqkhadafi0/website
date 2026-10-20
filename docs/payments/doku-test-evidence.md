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
| DIGITAL_DELIVERY | PASS CI terisolasi; BLOCKED provider/live | Next.js asli -> event sintetis signed -> Supabase PostgreSQL -> satu entitlement -> private PDF PASS pada CI baru; bukan pembayaran DOKU asli |
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
- Lint source berubah PASS tanpa error/warning pada pemeriksaan terarah. TypeScript PASS. Next webpack build PASS dengan 187 halaman. OpenNext build dan Worker dry-run PASS; workerd lokal sembilan route serta scheduled handler default OFF PASS.

Artefak lokal di `artifacts/payments/` (ignored): sql-verification.json, browser-verification.json, worker-inventory.json, https-readiness.json, lint/typecheck/build logs dan screenshot actual catalog/gallery. Tidak mengunggah secrets/checkout URL/signed URL.

## Temuan selama pengujian

- Test fixture produk perlu draft -> file private -> publish sesuai guard existing; diperbaiki, guard tidak dibypass.
- Pembesaran mockup sempat menutupi tombol preview: z-index tombol diperbaiki, QA ulang PASS.
- Read-only privilege audit menemukan service_role tidak punya SELECT auth.users/admin allowlist. Lookup QA dipindah ke helper sempit `private.commerce_payment_qa_email`, fixed search_path, service-only execute, tidak diekspos Data API. Tidak memberi service_role broad SELECT Auth.
- Bundel artikel pada checkout baru memiliki perbedaan newline teks Windows. Regenerasi melalui script existing (tanpa perubahan artikel) membuat check PASS; tidak ada perubahan naskah pada diff.
- Fixture `check-commerce-experience.cjs` sudah disesuaikan ke adapter DOKU; tujuh kelompok keamanan guest cookie/private download/RLS/free/refund PASS pada PostgreSQL embedded.

## Referensi primer yang diperiksa

- [Backend Checkout, termasuk payment_method_types QRIS](https://developers.doku.com/accept-payments/doku-checkout/integration-guide/backend-integration)
- [Notifikasi Non-SNAP, Mandiri dan QRIS_DOKU](https://developers.doku.com/get-started-with-doku-api/notification/http-notification-sample-non-snap)
- [Konfigurasi notification per channel](https://developers.doku.com/get-started-with-doku-api/notification/setup-notification-url)
- [Retry resmi 30 menit, 6 jam dan 12 jam](https://developers.doku.com/get-started-with-doku-api/notification/retry-notification)
- [Check Status Non-SNAP](https://developers.doku.com/get-started-with-doku-api/check-status-api/non-snap)
- [Supabase private storage access control](https://supabase.com/docs/guides/storage/security/access-control)

Tidak menyimpulkan kesiapan settlement, status ACTIVE, ketersediaan QRIS sandbox, biaya issuer, email delivery, hosted cron, atau payment E2E dari unit/fixture tests.

## CI baru pada source 16dc842 — PASS

- [DOKU Sandbox Offline Verification](https://github.com/dhiyaulhaqkhadafi0/website/actions/runs/39456186506): completed/success.
- [DOKU Isolated SQL Entitlement Test](https://github.com/dhiyaulhaqkhadafi0/website/actions/runs/39456186543): completed/success, job 118743559736; lima migrasi curated, PostgreSQL/Auth/Storage disposable, checkout contract, safety migration, endpoint Next.js asli, private-PDF E2E serta cleanup semua success.
- Log CI 2026-10-20T16:20:17Z menunjukkan unsigned/forged/wrong-target ditolak; invoice/amount salah ditolak; SUCCESS sintetis -> PAID + satu entitlement meski retry; buyer lain/anon/forged cookie ditolak; buyer berhak/receipt guest sah dapat mengunduh PDF dummy; signed URL mempunyai expiry <=900 detik; revocation memblokir URL baru.
- CI memakai standard ubuntu-24.04 pada repository public, tanpa secrets provider atau proyek Supabase cloud baru. Fixture HMAC inert tidak digunakan sebagai pengganti credentials DOKU sandbox yang hilang. Ini bukan bukti webhook berasal dari DOKU.
- Scan 833 calon file Git terhadap dua private credentials lokal: nol kecocokan. Pemeriksaan hanya memilih nama KEY/SECRET/TOKEN/PASSWORD; model name bukan secret. Private source PDF tidak disalin ke public/repo.
- PDF ebook asli terkonfirmasi metadata keberadaannya pada bucket privat; isi PDF asli tidak dibaca karena credential service-role lokal tidak tersedia. Service-role production ada sebagai nama secret Worker, nilainya tidak dibaca/diekspor. Unduhan ebook asli setelah pembayaran live tetap belum diuji.

## Production tetap tidak berubah

Read-only Worker metadata: DOKU_CLIENT_ID, DOKU_SECRET_KEY dan DOKU_RECONCILE_TOKEN belum terdaftar pada Worker khadafi; SUPABASE_SERVICE_ROLE_KEY ada. Tidak membuktikan validitas nilai binding. Worker aktif tetap `5c1ff734-95fd-4c63-9e91-eb6a6398381c` dengan 100% traffic, versi Freelance sebelum tugas DOKU ini. Tidak ada deployment atau migrasi production maupun uang asli yang dibelanjakan.

Draft PR: https://github.com/dhiyaulhaqkhadafi0/website/pull/5. Base `codex/freelance-business-hub`; source DOKU lama berasal dari PR #4 terbaru. Tidak merge ke main atau ke branch production. Lima dokumen payment ini menjadi laporan operasional terbaru; catatan DOKU lama dipertahankan sebagai histori.

## Pemeriksaan tambahan penutup

- `scripts/test-doku-job.cjs`: PASS pada endpoint rekonsiliasi aplikasi yang sama dengan scheduled service binding: auth token termasuk unicode ditolak aman, flag nonaktif 404, QRIS dapat diproses saat public sales OFF, HMAC failure/amount/channel mismatch tidak settle, DB failure dijadwalkan ulang, per-order lease diselesaikan. Semua I/O provider/DB pada contract test ini inert; SQL nyata dan private-PDF dibuktikan terpisah oleh CI.
- Checkout production read-only: HTTP 200, pemberitahuan checkout belum dibuka, tombol `Lanjut bayar` disabled. Tidak diklik, tidak membuat order.
- Semua tiga gambar galeri asli dibuka pada mobile/desktop, object-fit contain terverifikasi; screenshot zoom 100%/150% serta fokus tetap dalam native dialog PASS.
- PowerShell secret setup script lolos parsing tanpa menjalankan secure prompt. CLI init menyiapkan lima migrasi lokal, tidak start Docker/SQL. Client ID dan Secret Key sama-sama hidden; payments OFF default.
- Label metode checkout mengikuti adapter: Mandiri VA; QRIS hanya muncul saat flag QRIS aktif. E-wallet yang belum ditawarkan adapter tidak ditampilkan.
- Peringatan copy paket unist/vfile OpenNext Windows muncul, tetapi build adapter pertama dan kedua exit 0; workerd/dry-run lulus. Packaging final diulang setelah menghentikan workerd lokal karena lock folder EPERM. Tidak menganggap log sukses sebelum exit 0.

## Gate final source aplikasi cc37e08

- Source aplikasi: `cc37e0853fa4753d00f5676d5ec0c9d312759dbb`; build `-L17PPakW4LKYbrzLWttk`.
- Next webpack/typecheck: exit 0, 187 halaman. OpenNext: exit 0. Wrangler deploy --dry-run: exit 0, tidak upload/deploy. Log final: next-accepted-build.log, opennext-accepted-build.log, worker-accepted-dry-run.log.
- Browser pada build production lokal final: 12 layout PASS, nol uncaught errors, Ctrl-wheel mencegah default browser zoom dan label menjadi 125%, reset/keyboard/focus serta proteksi endpoint PASS. Lihat browser-verification.json dan browser-accepted.log.
- Scan 671 assets/cache publik terhadap dua private credentials lokal: nol kecocokan; productionDeployed=false. Lihat final-manifest.json.
- CI backend terbaru `6711869ab59eae4f77488260074e451ec8f30403`: [offline success](https://github.com/dhiyaulhaqkhadafi0/website/actions/runs/39458802327), [SQL/Next/private-PDF success](https://github.com/dhiyaulhaqkhadafi0/website/actions/runs/39458802124), job 118752534316 termasuk tes endpoint rekonsiliasi sebenarnya. Perubahan aplikasi setelah commit ini hanya galeri Ctrl-wheel, diuji lint/browser/build final di atas.
- Tiga negative checks script secrets PASS: Worker production ditolak, env lokal hilang ditolak, database production ditolak sebelum prompt. Tidak memasukkan secrets.
- Verifikasi production penutup: Worker `5c1ff734-95fd-4c63-9e91-eb6a6398381c` masih menerima 100% traffic; tidak berubah dari sebelum tugas ini. Checkout existing disabled. No deployment/migration/live payment.

**Kesimpulan: implementasi lokal dan QA aplikasi PASS; NO-GO untuk penjualan publik sampai sandbox asli, staging/scheduler hosted, QRIS ACTIVE dan satu pembayaran live yang disetujui terbukti.** Semua status provider asli pada tabel awal tetap BLOCKED/NOT_TESTED. Tidak ada klaim GO-LIVE READY.

## Lint repository penuh — FAIL (21 Oktober 2026 WIB)

`node node_modules/eslint/bin/eslint.js .` selesai dengan exit 1: **21 error dan 86 warning** pada pemeriksaan awal penuh. Ke-21 error terdapat dalam **17 file baseline yang sama persis dengan commit gabungan awal `393c4d9`**, bukan file yang diubah patch payment. Dibuktikan dengan `git diff 393c4d9 -- <setiap file error>` yang kosong; artefak lint-scope-verification.json menyimpan daftar lengkap. Contoh: ArticleEngagementBar.tsx:29 (setState in effect), StudioTableToolbar.tsx:60 (prefer-const), EditorialFigure.ts:4 dan gemini-provider.ts:66 (explicit any).

Tiga warning milik diff dibersihkan: wrapper memakai named default object, import tak terpakai di SQL test dihapus, counter HTTP test kini memastikan event unsigned tidak pernah mencapai persistence. Lint **seluruh file JS/TS yang berubah terhadap `393c4d9`** kemudian exit 0 tanpa warning/error (patch-lint-final.log). HTTP contract test tetap PASS, dan wrapper final kembali lolos Wrangler dry-run. Perubahan pembersihan ini tidak mengubah aplikasi Next yang sudah dibangun; hanya deklarasi export ekuivalen dan tes.

Jadi status yang benar: **PATCH_LINT=PASS**, **REPOSITORY_LINT=FAIL_LEGACY**. Tidak mengklaim repository-wide lint bersih; tidak memperluas refactor ke blog/Studio unrelated. Ini dicatat sebagai temuan terpisah dalam NO-GO report, selain external provider/staging gates.
