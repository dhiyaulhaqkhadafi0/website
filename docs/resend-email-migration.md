# Migrasi email Khadafi: Gmail → Resend

Lingkup hanya `khadafidaffa.com`, Worker `khadafi`, Supabase `mykgtajanxczdnzekycl`.
Konfigurasi Chikki tidak termasuk dan tidak diubah. Status awal: Gmail SMTP menerima
email, SPF/DKIM/DMARC PASS, tetapi pemilik menemukan konfirmasi akun dan bukti
pembelian di Spam. Mengganti template saja belum menyelesaikan penempatan inbox.

## Biaya dan alamat

[Resend Free](https://resend.com/pricing) saat audit 23 Oktober 2026 menyediakan
3.000 email/bulan, maksimal 100/hari, 3 domain, dan 1 endpoint webhook. Kuota juga
harus mencakup email autentikasi Supabase. Jangan menaikkan paket berbayar otomatis.

- From: `Khadafi <notifications@khadafidaffa.com>`.
- Reply-To setelah uji penerimaan berhasil: `support@khadafidaffa.com`.
- Penerusan support: Cloudflare Email Routing ke Gmail pemilik yang telah
  diverifikasi; alamat tujuan tidak ditulis di konfigurasi publik.
- Sebelum penerusan terbukti menerima email, uji Resend memakai Reply-To Gmail
  yang sudah ada. Jangan mengaktifkan Reply-To support hanya berdasarkan DNS.

Verifikasi 23 Oktober 2026: tujuan Gmail diverifikasi; Cloudflare Email Routing
berstatus ready, MX/SPF publik terpasang, dan aturan khusus support aktif. Pemilik
menguji dari Gmail keduanya dan mengonfirmasi pesan masuk ke inbox utama Gmail
tujuan. Ini membuktikan penerusan support, bukan pengiriman keluar Resend.

## Gerbang migrasi

Worker tetap `TRANSACTION_EMAIL_PROVIDER=smtp`. Memasang kode, migrasi basis data,
atau Secret Resend **tidak memindahkan email pelanggan ke Resend**.

1. Buat domain **Sending** `khadafidaffa.com` di Resend Free. Nonaktifkan pelacakan
   klik/open untuk email autentikasi dan transaksi. Hindari mengaktifkan inbound
   Resend pada root domain yang dipakai Cloudflare Email Routing.
2. Tambahkan DNS sesuai nilai **persis** dari halaman domain Resend. DKIM dan
   Return-Path berbeda per akun/region; jangan memakai contoh key atau MX tebakan.
   DKIM biasanya selector khusus provider dan SPF/MX Return-Path di subdomain
   terpisah. Jangan mengganti MX root Cloudflare. Tidak boleh ada dua record
   `v=spf1` pada hostname yang sama; gabungkan mekanisme hanya jika provider
   benar-benar memakai hostname yang sama.
3. Jika belum ada DMARC, mulai TXT `_dmarc` dengan
   `v=DMARC1; p=none; adkim=r; aspf=r`. Jangan menimpa kebijakan yang sudah ada.
   Tambahkan alamat laporan `rua` hanya setelah mailbox laporan tersedia.
   Kebijakan enforcement diperketat setelah hasil autentikasi terukur.
4. Tunggu status domain Resend **Verified**, lalu periksa DNS publik. Buat key
   **Sending access**, dibatasi domain Khadafi, dan simpan sebagai Worker Secret
   `RESEND_API_KEY`. Jangan menulis key di Git, chat, browser client, atau log.
   Pertahankan `SMTP_PASS`, `SMTP_USER`, `SMTP_FROM` untuk fallback terkendali.
5. Buat webhook Resend:
   `https://khadafidaffa.com/api/commerce/email/resend/webhook`.
   Pilih `email.sent`, `email.delivered`, `email.delivery_delayed`, `email.bounced`,
   `email.complained`, `email.failed`, `email.suppressed`. Simpan signing secret
   sebagai Worker Secret `RESEND_WEBHOOK_SECRET`. Endpoint menolak request tanpa
   signature valid dan hanya mengakui event sesudah commit basis data.
6. Setelah verifikasi domain dibuktikan, aktifkan `RESEND_DOMAIN_VERIFIED=true`
   dan `RESEND_TESTS_ENABLED=true`. **Pertahankan default SMTP.** Operator memasukkan
   job service-only `delivery_probe`, provider `resend`, tanpa order, hanya ke
   alamat uji milik pemilik yang sudah disetujui. Tidak ada endpoint publik untuk
   membuat email uji, tidak ada pembelian atau tagihan yang dibuat.
7. Periksa acceptance API, callback delivered, SPF/DKIM/DMARC dan folder inbox
   secara nyata pada minimal dua alamat. Delivered tidak membuktikan primary
   inbox. Uji email ke support dan pastikan diteruskan ke Gmail. Baru kemudian
   set `RESEND_REPLY_TO_VERIFIED=true`.
8. Cutover pelanggan hanya sesudah semua pengujian berhasil: set
   `RESEND_PRODUCTION_APPROVED=true` dan ubah konfigurasi release
   `TRANSACTION_EMAIL_PROVIDER=resend`. Deploy, periksa email transaksi baru dan
   entitlement. Jangan mengulang pembayaran lama untuk mengetes email.

## Supabase Auth: tahap terpisah

Jangan mengganti SMTP Supabase sebelum pengujian Resend di atas berhasil.
Sesudah gerbang terpenuhi, buka proyek **Khadafi Web** → Authentication → Emails
→ SMTP Settings, isi provider Resend: host `smtp.resend.com`, port `465`, username
`resend`, password key Sending Resend dari penyimpanan aman, sender email
`notifications@khadafidaffa.com`, sender name `Khadafi`. Jangan mengganti template
token, Site URL atau flow `/auth/confirm` yang telah bekerja. Kirim konfirmasi
baru ke akun uji dan buktikan autentikasi serta konfirmasi akun berhasil.

## Retry, idempotency dan kegagalan

- Event pembayaran terverifikasi membuat satu job transaksi per order/kind;
  email gagal tidak mencabut akses produk dan tidak mengubah status pembayaran.
- Provider dipin pada percobaan pertama. Pergantian default hanya berlaku bagi
  job baru. Job Gmail/Resend yang sudah dipin tetap ditangani provider asal.
- Resend memakai `Idempotency-Key` dari ID outbox. Body disimpan sebelum request
  jaringan dan dipakai kembali tanpa perubahan meski Reply-To/nama produk berubah.
- Lease mencegah worker konkuren; crash/timeout dipulihkan dengan backoff, maksimal
  lima percobaan. Retry Resend dihentikan sesudah 23 jam sejak percobaan pertama
  agar tidak melewati jendela deduplikasi provider 24 jam. Job yang ambigu perlu
  pemeriksaan operator, **tidak otomatis dialihkan ke Gmail**.
- Auth invalid, payload ditolak, atau konflik idempotency menghentikan retry;
  rate limit/transport ditangani sebagai kegagalan sementara. Pantau kuota gratis.
- Webhook diverifikasi HMAC SHA-256 atas raw body dengan toleransi waktu 5 menit,
  dedup ID+hash, dan urutan status yang mempertahankan bounce/complaint.
- Log hanya memuat ID outbox, provider, dan kelas hasil. Recipient/body tersimpan
  di tabel service-only ber-RLS; tidak ditampilkan dalam log publik.

## Rollback terkendali

Jika provider baru bermasalah, hentikan canary, kembalikan default **job baru** ke
`smtp` dan deploy dengan `--keep-vars`. Jangan menghapus Secret Gmail dan jangan
mereset provider/attempt/job Resend yang mungkin sudah diterima. Periksa provider
message ID, webhook, dan idempotency sebelum tindakan manual. Supabase Auth
dirollback terpisah melalui SMTP Settings menggunakan konfigurasi Gmail lama.

## Validasi otomatis

`node scripts/test-provider-email.mjs` memeriksa gating, request deterministik,
idempotency, error aman, tanpa fallback silang, signature Svix resmi, raw body,
timestamp, batas payload, dan commit-before-ack.

`scripts/test-doku-safety-db.cjs` menggunakan PostgreSQL lokal PGlite untuk
memeriksa RLS/privilege, pinning, payload immutable, fencing, retry window,
callback mendahului response, duplicate/conflict dan urutan event. Tes ini tidak
menyatakan email production sudah terkirim atau masuk inbox.
