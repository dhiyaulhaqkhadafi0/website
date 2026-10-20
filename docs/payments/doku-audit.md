# Audit DOKU Go-Live V2

Status: **NO-GO untuk penjualan publik**. Implementasi lokal dilanjutkan; tidak deploy, migrasi production, mengaktifkan test live, atau membayar uang asli.

## Sumber kebenaran

- Primary `E:/khadafi-website` sangat dirty. Tidak diubah; worktree terisolasi `.release/doku-go-live-v2`, branch `codex/doku-qris-go-live-v2`.
- `E:/khadafi-doku-feature`: clean, detached `d024af1`; tertinggal dari PR #4.
- PR #4 aktual: open/draft, tidak merge; HEAD `7d6527164ac9405dddb878db6db9c0bfd6389759`, bukan `ac429db`. Source terbaru digabungkan dengan rilis Freelance yang sudah production (`070e916`), tanpa menimpa kedua checkout.
- Read-only Supabase Khadafi: satu produk published `Ebook Formula Profitable Blueprint`, Rp59.000 IDR. Satu PDF private ada di Storage (23.208.642 byte, application/pdf, versi 1). Ini bukti metadata keberadaan, bukan bukti pembelian/download live.
- Semua enam tabel commerce existing mempunyai RLS. Bucket commerce-files private. Fungsi DOKU belum ada di database production; tidak dimigrasikan pada audit ini.
- User mengonfirmasi QRIS masih UPDATING. Sandbox keys sebelumnya hanya environment sementara dan sudah dihapus; tidak tersedia untuk penggunaan ulang.
- Read-only inventaris Cloudflare: chikki-preview, chikki-web, khadafi. Tidak ada Worker staging DOKU, termasuk nama usulan khadafi-doku-staging; daftar secrets nama tersebut gagal not found. Tidak ada nilai secret dibaca/dicetak.
- HTTPS POST unsigned: doku-staging.khadafidaffa.com/api/commerce/doku/webhook -> 502; production -> 404. Tidak ada pembayaran/state mutation dari pemeriksaan ini.

## Temuan dan perbaikan

| Prioritas | Lokasi | Masalah awal / risiko | Perubahan dan bukti |
|---|---|---|---|
| P0 | src/lib/doku-security.ts, doku-webhook-handler.ts | Timestamp tanpa umur, body dibaca penuh, channel/currency/event ID belum dipersist | Streaming limit 32 KiB, HMAC raw body, Client-Id, target, window 13 jam (retry resmi sampai 12 jam), skew 5 menit, channel/currency/invoice/amount, durable inbox dengan hash dan event ID; tes QRIS/replay |
| P0 | src/app/api/commerce/doku/webhook/route.ts; migration 20261020154413 | ACK/settlement belum punya ledger event | RPC atomic event + settlement + entitlement; 2xx sesudah commit; kegagalan durable -> 503 |
| P0 | src/lib/doku-order-checkout.ts; orders/route.ts | Double click/concurrent session creation; timeout ambigu | DB lock, stable request ID, intent reusable, unknown outcome tidak direcreate, harga/owner server, body limit 4 KiB |
| P0 | src/lib/doku-config.ts; doku.ts; supabase.ts | Sandbox cloud belum aman; kill switch menonaktifkan webhook | Explicit isolated DB; menolak kedua production refs pada sandbox; checkout/public QA/processing flags dipisah; Checkout response wajib HMAC |
| P0 | internal/commerce/doku/reconcile/route.ts; cloudflare/ | Local-only manual reconciler, tanpa cron durable | Worker scheduled wrapper 5 menit, service binding + bearer, DB lease/SKIP LOCKED, backoff, timestamp/error class; Check Status Mandiri/QRIS dan paid-no-entitlement repair |
| P0 | migration 20261020154413 | Entitlement hilang pada order paid tidak dipulihkan | Settlement idempoten memperbaiki grant yang hilang; status PAID tidak diturunkan oleh FAILED/PENDING/EXPIRED |
| P0 | CheckoutForm.tsx; orders/route.ts | Guest recovery/email delivery belum terbukti | Pembelian member diutamakan, guest baru disabled default; akses receipt guest existing tetap valid. Tidak mengklaim email delivery |
| P0 | studio/commerce/payment-qa; studio/payments/qa | Belum ada test live Rp1.000 terisolasi | Draft-only QA product, confirmed admin + UUID allowlist + flags server; file payment-qa/ terpisah, QRIS-only checkout; FREE ORDER Rp0 terpisah tanpa DOKU |
| P1 | ProductGallery.tsx; commerce.module.css; shop.module.css | Zoom 100–300% tanpa preset/reset, gambar kecil, preview tertutup mockup setelah pembesaran | 50/75/100/125/150%, fit-to-view 100%, pan bounded by scroll, touch/native pinch, keyboard/focus, contain, mockup besar, hover/frame/reduced motion; 12 layout QA |
| P0 eksternal | DOKU merchant; staging infra | QRIS UPDATING; secrets/staging DB/Worker belum tersedia | BLOCKED, konfigurasi dan runbook disiapkan. Tidak mengganti dengan provider/mock transaction |

## Batas bukti

Tes unit memakai vector HMAC inert hanya di proses uji, bukan kredensial sandbox/provider yang dibuat-buat. Embedded PostgreSQL menguji SQL nyata secara lokal; fixture tidak dikirim ke cloud production. Bukti CI lama pada PR #4 bersifat historis; perubahan baru perlu CI tersendiri. Tidak ada klaim webhook berasal dari provider sebelum event asli diterima.

Lihat doku-test-evidence.md, doku-config-checklist.md dan doku-go-live-runbook.md. Semua P0 eksternal harus selesai sebelum GO-LIVE READY.
