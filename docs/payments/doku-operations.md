# Operasional pembayaran DOKU

## Pending / webhook hilang

Cron 5 menit memanggil endpoint internal melalui WORKER_SELF_REFERENCE dan bearer token, bukan URL publik berisi token. Klaim maksimal 10 state yang due, lease 5 menit dan SKIP LOCKED mencegah worker paralel memeriksa order sama. Pemeriksaan pertama minimal 3 menit umur order; backoff 2 menit sampai 1 jam; observasi sampai 7 hari. Interval tidak menyimpulkan waktu bayar; provider yang masih belum mencerminkan pembayaran akan diperiksa lagi >=60 detik kemudian.

State menyimpan environment, invoice, checkout request ID, attempts, last_checked_at, next_check_at, lease dan error_class. Ringkasan log hanya checked/paid/pending/failed; tidak ada email, VA, URL rahasia atau raw body. Event inbox menyimpan hash/status/channel/order, bukan raw payload/PII.

Checkout creating/unknown yang responsenya hilang tidak membuat session/invoice baru secara otomatis. Operator memeriksa ledger + Check Status; jangan mengubah unknown menjadi new sebelum membuktikan tidak ada session/payment. UI mengarahkan pembeli memeriksa pesanan, bukan membayar ulang.

## Paid tetapi akses hilang

Reconciler juga mengambil paid yang tidak mempunyai baris entitlement untuk item order. Hanya SUCCESS dari Check Status dengan HMAC, environment, invoice, IDR, nominal dan channel cocok yang dapat menjalankan settlement ulang. RPC atomic akan memasukkan grant yang hilang, tanpa duplikat. Grant revoked tidak diaktifkan kembali secara otomatis. Failed retry tidak mengubah order paid. Setelah 7 hari, perlu penanganan operator berdasar bukti provider; jangan menjalankan SQL manual PAID atas bukti screenshot/redirect.

## Refund/dispute

Notifikasi signed REFUNDED/DISPUTED yang cocok dicatat, mencabut grants pada order tersebut dan menandai paid sebagai refunded serta REVIEW_REQUIRED. Ini kebijakan fail closed untuk akses; tidak menyatakan settlement/pengembalian dana telah selesai di bank. Pembelian lain tidak dicabut. Review manual perlu memeriksa provider dan kontrak refund. SUCCESS yang terlambat tidak menghidupkan kembali order refunded. Signed URL yang sudah diterbitkan tetap bearer link hingga kedaluwarsa 15 menit; pencabutan langsung memblokir penerbitan URL baru, bukan membatalkan URL lama.

## Kill switch dan recovery

PAYMENTS_ENABLED=false dan DOKU_ENABLED=false menutup checkout publik baru. Jangan hapus credentials/izin processing ketika masih ada order diterima: webhook/reconciliation menggunakan konfigurasi processing terpisah. DOKU_QA_ENABLED=false mematikan endpoint QA; DOKU_QA_LIVE_APPROVED=false menutup tes live secara terpisah. Jangan menghapus paid order, inbox atau grants ketika rollback source.

Guest baru OFF sampai email recovery terbukti. Member mengakses /account/library setelah login. Receipt guest existing tetap divalidasi cookie signed order-specific dan entitlement pada setiap penerbitan URL. Tidak ada klaim email/receipt terkirim pada audit ini.
