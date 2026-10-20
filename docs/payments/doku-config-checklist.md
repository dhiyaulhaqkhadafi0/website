# Konfigurasi DOKU — tanpa nilai secrets

| Variabel | Sandbox | Production |
|---|---|---|
| DOKU_CLIENT_ID, DOKU_SECRET_KEY | Secret khusus sandbox pada Worker staging | Secret live khusus Worker khadafi; hanya setelah izin |
| DOKU_IS_PRODUCTION | false | true |
| DOKU_SITE_ORIGIN | HTTPS staging yang benar-benar sehat | https://khadafidaffa.com |
| NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Database staging isolated / lokal loopback | Khadafi Web existing |
| DOKU_SANDBOX_SUPABASE_URL | Allowlist tepat database staging | Tidak dipakai |
| DOKU_STAGING_ONLY | true pada Worker staging | false/tidak diisi |
| SUPABASE_SERVICE_ROLE_KEY | Staging only secret | Existing private production secret |
| DOKU_PRODUCTION_APPROVED | false | false sampai persetujuan deploy/config |
| DOKU_ENABLED, PAYMENTS_ENABLED | false sampai validasi | false selama P0 belum lulus |
| DOKU_PUBLIC_SALES_APPROVED | Tidak diperlukan | false sampai bukti live E2E dan izin pembukaan |
| DOKU_QRIS_ENABLED | false sampai tersedia | false sampai ACTIVE |
| DOKU_QRIS_STATUS | Sesuai hasil sandbox | UPDATING (konfirmasi user), jangan ubah ke ACTIVE tanpa bukti |
| DOKU_RECONCILE_ENABLED | false sampai scheduler dapat diuji | Aktif hanya setelah konfigurasi/izin; boleh tetap aktif saat sales kill switch off |
| DOKU_RECONCILE_TOKEN | Secret random >=32 byte | Secret berbeda, jangan taruh URL |
| DOKU_QA_ENABLED / DOKU_QA_LIVE_APPROVED | false / false default | false / false; persetujuan test terpisah |
| DOKU_QA_USER_IDS / DOKU_QA_PRODUCT_ID | UUID allowlist dan draft QA | Hanya UUID admin yang disetujui dan draft QA dengan file dummy |
| DOKU_QA_FREE_ENABLED | false default | false; uji Rp0 juga perlu izin untuk mutasi production |
| COMMERCE_GUEST_CHECKOUT_ENABLED | false | false sampai recovery email diuji |

Default konfigurasi staging: wrangler.doku-staging.jsonc, Worker khadafi-doku-staging, self binding staging, bucket khadafi-doku-staging-cache. Ini template, **resource belum dibuat**. Tidak memakai bucket/self binding production. Build dengan env staging eksplisit; guard Supabase menolak fallback production.

## Mengisi secrets setelah staging tersedia

1. Pastikan Worker staging benar, database isolated, domain HTTPS sehat, flag pembayaran OFF. Inventaris saat audit belum menemukan Worker DOKU.
2. Dashboard Cloudflare -> Workers & Pages -> Worker staging -> Settings -> Variables and Secrets. Tambahkan dua encrypted secrets bernama DOKU_CLIENT_ID dan DOKU_SECRET_KEY memakai nilai **sandbox** dari DOKU Back Office. Jangan tempel nilainya ke chat/PR/log.
3. Alternatif terminal lokal: jalankan `./scripts/configure-doku-sandbox-secrets.ps1`. Input disembunyikan, script menolak Worker khadafi dan Worker staging yang belum ada. Script ini belum dijalankan dengan kredensial.
4. Script/secret put dapat menerbitkan versi staging; jalankan hanya untuk Worker staging yang disetujui. Tidak mengubah production.
5. Jangan memakai command argument yang berisi nilai secret. Jangan commit .env/.dev.vars, token provider, checkout URL, VA atau signed download URL.

## Notification URL

Route: `/api/commerce/doku/webhook`, POST, tanpa login, signature wajib. URL lengkap = DOKU_SITE_ORIGIN + route. Request-Target HMAC memakai path persis tersebut, tanpa trailing slash/query/rewrite.

Sandbox Back Office: Settings -> Payment Settings -> Virtual Account (Non-SNAP) -> Mandiri VA -> Configure -> Notification URL. QRIS: konfigurasi Notification URL per channel yang benar-benar tersedia; pastikan integrasi Checkout Non-SNAP, bukan memindahkan backend ke Direct SNAP. Periksa Integration -> HTTP Notification untuk event asli dan HTTP response. Override notification di Checkout tidak dianggap pengganti konfigurasi channel. Jika Configure tidak tersedia, pemilik perlu meminta support mengaktifkan/mengonfirmasi URL channel.

QRIS Checkout memakai payment_method_types QRIS. Sampel notifikasi resmi menyebut channel.id QRIS_DOKU; header HMAC Non-SNAP diverifikasi melalui route existing. Status Check memakai environment sesuai order, GET HMAC tanpa Digest. Referensi resmi ada dalam test-evidence.

Hasil audit nama secret production (read-only): DOKU_CLIENT_ID/DOKU_SECRET_KEY/DOKU_RECONCILE_TOKEN belum ada; SUPABASE_SERVICE_ROLE_KEY ada. Jangan menyalin nilai secret production ke staging. Nilai binding existing tidak dibaca.
