# Runbook Go-Live DOKU V2

## Keadaan saat ini

**NO-GO — production tetap tidak diubah.** QRIS UPDATING, tidak ada credentials sandbox persisten, Worker staging tidak ada, domain staging 502, migration DOKU belum di production. Tidak membuat proyek berbayar atau memakai proyek Chikki sebagai staging. Saldo GoPay pengguna tidak disentuh.

## Sandbox tanpa biaya layanan baru

1. Gunakan Supabase disposable pada standard GitHub runner public repo untuk tes aplikasi; ini tidak memerlukan proyek cloud ketiga atau credentials provider. Tes ini tetap synthetic, bukan provider webhook.
2. Untuk provider sandbox asli, perlukan backend isolated yang hidup pada HTTPS stabil. Alternatif tanpa SaaS baru: Supabase lokal + Next lokal dan tunnel webhook existing ketika Docker/laptop mampu. Docker daemon saat audit tidak tersedia. Jangan memakai Supabase production sebagai jalan pintas.
3. Setelah staging HTTPS/DB tersedia, pemilik memasukkan sandbox secrets sendiri melalui config-checklist. DOKU_IS_PRODUCTION=false, DOKU_ENABLED=false, PAYMENTS_ENABLED=false sampai preflight. Tidak mengganti nilai yang hilang dengan dummy/provider live.
4. Aktifkan sandbox hanya setelah konfigurasi tervalidasi, buat order test dengan file dummy, pilih Mandiri VA di official simulator, amati HTTP Notification asli, signature, event commit, PAID satu kali, entitlement dan unduh PDF.
5. QRIS sandbox hanya jika muncul di Checkout dan simulator tersedia. Jika tidak, catat BLOCKED/channel unavailable. Uji kehilangan webhook: abaikan delivery pada test isolated lalu biarkan cron yang benar-benar aktif menyelesaikan order; jangan mencatat kontrak unit sebagai hosted cron PASS.

## Approval deployment production

Persetujuan baru dibutuhkan setelah patch, migrasi additive, CI/build, sandbox dan rollback dapat direview. Tidak menjalankan langkah berikut pada pekerjaan persiapan ini.

- Backup database dan catat versi Worker aktif; review migration 20261018094500 serta 20261020154413. Terapkan additive pada database Khadafi hanya setelah izin. Jangan menjalankan bulk db push/reset terhadap semua migrasi repository.
- Order sandbox existing harus dipisahkan, bukan diimpor ke production. Legacy DOKU order tanpa state harus ditelaah dan dibackfill berdasarkan environment/invoice yang terbukti; jangan mengasumsikannya production.
- Deploy source yang diuji dengan public checkout OFF, secrets live runtime terpisah, notifications HTTPS per channel, scheduler aktif yang diuji. Pertahankan binding existing dan cache build sebelumnya. Jangan mengirim sandbox keys ke Worker production.
- Pastikan QRIS dashboard **ACTIVE**, merchant live benar, QRIS tersedia saat create Checkout live, nominal Rp1.000 diterima, dan notification URL/channel benar. Email APPROVED tidak cukup.

## Satu tes live Rp1.000 — hanya setelah izin khusus

1. Pemilik menyetujui deployment/config terlebih dahulu dan secara terpisah menyetujui inisiasi checkout live serta pembayaran Rp1.000.
2. Siapkan draft DOKU Live Payment QA dengan is_payment_qa=true, price=1000 dan PDF dummy di payment-qa/ pada private commerce-files. Jangan memakai ebook jualan asli. Produk tidak dapat dipublish karena constraint DB.
3. Server allowlist hanya UUID admin terkonfirmasi. DOKU_QA_ENABLED=true, DOKU_QA_LIVE_APPROVED=true, DOKU_QRIS_ENABLED=true dan status ACTIVE. Public DOKU_ENABLED/PAYMENTS_ENABLED/DOKU_PUBLIC_SALES_APPROVED tetap OFF. Halaman privat /studio/payments/qa menampilkan tombol khusus QRIS. FREE ORDER Rp0 terpisah, tidak pernah dikirim ke gateway.
4. Pemilik memeriksa invoice serta **total akhir di layar GoPay <= saldo Rp1.353**. Jika fee/minimum issuer melebihi saldo atau status belum ACTIVE: hentikan. Tidak menjanjikan settlement net Rp1.000.
5. Pemilik sendiri scan dan memasukkan PIN/OTP. Codex tidak membayar atau memasukkan PIN/OTP. Batasi satu pembayaran, tidak retry charge.
6. Amati event provider signed atau Check Status signed, order PAID dan satu grant, unduh dummy PDF sebagai pemilik; user lain/anonymous tetap ditolak. Periksa dashboard/log provider dan scheduler tanpa browser pembeli.
7. Matikan DOKU_QA_ENABLED, DOKU_QA_LIVE_APPROVED, DOKU_QA_FREE_ENABLED; archive draft dan cabut test grant bila perlu tanpa menghapus ledger. Jangan menghapus paid history.
8. Hanya setelah semua P0 PASS dan izin membuka penjualan, set public sales approved + payments enabled. Lakukan smoke pada domain utama. Tetap NO-GO jika live E2E belum terbukti.

## Rollback

Matikan flag penjualan terlebih dahulu, pertahankan pemrosesan pembayaran yang sudah diterima. Rollback Worker ke versi yang dicatat sebelum deploy; jangan drop tabel/event baru atau menghapus order/grant. Jalankan rekonsiliasi/recovery yang sudah diaudit untuk in-flight order. Source lama tanpa handler DOKU tidak boleh menjadi satu-satunya pemroses order yang sudah menerima pembayaran.

## Jalur lokal yang sudah disiapkan

Folder ignored `artifacts/payments/khadafi-doku-staging-db/supabase` sudah berisi config CLI dan tepat lima migrasi curated; Docker/SQL belum dijalankan. Tidak menggunakan dua database cloud production.

Setelah Docker Desktop tersedia dan resource laptop mencukupi, dari worktree DOKU V2:

```powershell
$stageRoot = Join-Path $PWD 'artifacts/payments/khadafi-doku-staging-db'
./scripts/start-doku-local.ps1 -StagingRoot $stageRoot
./scripts/prepare-doku-local-env.ps1 -StagingRoot $stageRoot -FeatureRoot $PWD
./scripts/enable-doku-local-sandbox.ps1 -FeatureRoot $PWD
```

Perintah terakhir kini **hanya mengisi** dua sandbox keys melalui input tersembunyi dan membiarkan DOKU_ENABLED/PAYMENTS_ENABLED=false. Tidak menjalankan script ini dengan credentials pada audit. Setelah HTTPS webhook benar-benar menolak unsigned POST dengan 401, konfigurasi tervalidasi, dan operator siap melakukan simulasi, opsi `-EnableAfterValidation` dapat dipakai untuk aktivasi **sandbox lokal**. Tidak dipakai untuk production. Start Next memakai `./scripts/start-doku-local-next.ps1 -FeatureRoot $PWD`; relay/tunnel hanya boleh membuka route webhook, bukan API Auth/REST/Storage.

Jika memilih Worker staging, gunakan script configure-doku-sandbox-secrets.ps1 setelah Worker dan database staging isolated tersedia. Jangan membuat proyek berbayar baru untuk melewati blocker ini.
