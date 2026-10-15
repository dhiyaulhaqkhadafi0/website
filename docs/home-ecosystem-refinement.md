# Penyempurnaan ekosistem beranda — 13 Oktober 2026

## Hasil lokal

Branch kerja: `codex/home-ecosystem-refinement`. Perubahan yang sudah ada di checkout tetap dipertahankan. Snapshot diff awal tersimpan di `artifacts/home-ecosystem/baseline-tracked.patch`; snapshot beberapa source yang sebelumnya berubah ada di `baseline-sources.json`. Branch ini belum di-commit, di-push, di-merge, atau di-deploy.

Beranda kini berbahasa Indonesia dengan delapan bagian: hero, pilihan perjalanan, produk/proyek, Freelance Hub, sumber daya/artikel, profil/kemampuan/sertifikasi, newsletter, serta CTA penutup/footer. Komposisi editorial, potret asli, Work Atlas, 9 sertifikat dan 13 lencana tetap digunakan. Navbar beranda mengikuti alur halaman. Jasa, komunitas, dan Lab tetap tersedia melalui footer. Tidak ada ajakan memesan proyek di beranda.

Footer memakai tiga kelompok tautan dengan ruang antarkolom dan antarbaris yang lebih lega, enam ikon platform, serta target sentuh 44 px. URL akun disimpan satu kali di `src/content/social-links.ts` dan digunakan juga oleh structured data. Tombol memiliki hover/pressed/focus state. Reveal section, respons komposisi terhadap hover, dan kalimat hero dinamis tetap ringan. Kalimat berubah dua kali lalu berhenti; tersedia kontrol jeda, tab tersembunyi menghentikan timer, dan reduced motion dihormati. Tombol kembali ke atas berukuran 48 px dan disembunyikan saat newsletter/footer terlihat.

## Akun dan hak akses

| Tujuan | Route |
| --- | --- |
| Satu pintu masuk | `/login` |
| Pendaftaran member | `/register` |
| Ringkasan member | `/account` |
| Produk milik member | `/account/library` |
| Riwayat pembelian | `/account/orders` |
| Profil member | `/account/profile` |
| Ringkasan founder | `/studio/overview` |
| Subscriber dan persetujuan | `/studio/freelance` |
| Pengelolaan existing | `/studio`, `/studio/products`, `/studio/orders`, `/studio/customers` |

Pilihan Member/Founder pada login menentukan tujuan, tanpa memberikan izin. Tujuan internal existing tetap dipertahankan. Pendaftaran publik membawa pengguna ke akun member. Setelah login, navbar menggunakan tujuan dashboard dari server.

Pemeriksaan founder memvalidasi token lewat Supabase `getUser()`, menolak identitas anonim/email belum terverifikasi, lalu memanggil RPC `studio_access()`. RPC menggunakan allowlist `blog_admin_emails` yang sudah ada. `private.is_blog_admin()` sekarang mencocokkan **auth.uid()** dengan record **auth.users** yang emailnya terverifikasi dan diizinkan; email JWT maupun metadata client tidak memberi izin. Pemeriksaan server dan kebijakan RLS memakai sumber yang sama. `BLOG_ADMIN_EMAIL` tidak lagi menjadi otoritas izin aplikasi ini.

Member memakai query berfilter `user_id` dan RLS existing. Unduhan tetap melalui pemeriksaan entitlement server, bukan tautan file publik. Profil menampilkan nama dan email akun yang sedang aktif; pengeditan profil belum ditambahkan. Founder memperoleh jumlah nyata atau pesan data tidak tersedia, serta tautan ke modul existing. Pengelolaan lowongan/direktori, resources, pengaturan umum, LMS, dan campaign editor baru tidak dibuat.

Validasi Origin dipusatkan di `src/lib/request-origin.ts` agar permintaan browser tetap dikenali ketika Next/OpenNext memakai URL internal. Pemeriksaan mencocokkan Origin dengan Host, menolak origin asing/opaque dan HTTP non-local, serta mengabaikan forwarding header dari client.

## Newsletter

Form nama/email/persetujuan pada beranda memanggil `/api/freelance/subscribe`, menggunakan `freelance_leads` dan RPC existing. Sumber baru `homepage` memakai versi persetujuan `khadafi-updates-v1`; subscriber freelance tetap menggunakan `field-notes-v1`.

Server memvalidasi payload berukuran terbatas, nama, email, consent, honeypot, dan Origin; email dinormalisasi. RPC memeriksa secret server, mencatat sumber/waktu/versi persetujuan dan atribusi UTM, serta membatasi lima percobaan per hash jaringan per jam. Data subscriber tidak dapat dibaca anonim atau member. Token unsubscribe acak hanya disimpan sebagai hash di database.

Pesan berhasil dan tautan kelola pribadi hanya diberikan setelah insert berhasil. Duplikat tidak menimpa identitas, consent, token, atau atribusi. Subscriber yang berhenti tetap nonaktif; UI tidak mengklaim mereka sudah aktif kembali. Aktivasi ulang otomatis belum disediakan; UI mengarahkan ke Support. `/freelance/berhenti#TOKEN` meminta konfirmasi sebelum POST unsubscribe dan menghapus token dari alamat setelah berhasil.

Founder dapat memfilter sumber `homepage`, melihat status, waktu/jenis persetujuan, dan ringkasan data. Tabel memakai scrolling horizontal pada layar kecil agar halaman tidak overflow. Saat pengiriman email kelak diaktifkan, hanya gunakan subscriber aktif dan isi yang sesuai versi persetujuan. Subscriber freelance lama tidak otomatis memberikan persetujuan untuk semua topik newsletter baru.

Tidak ada pengiriman email sambutan atau kampanye dalam pekerjaan ini. Tidak ada janji mingguan, instruksi cek inbox, atau penyimpanan subscriber melalui localStorage.

## Migration dan konfigurasi sebelum hosted

Migration lokal dibuat melalui CLI Supabase:

`supabase/migrations/20261013053325_homepage_newsletter_and_studio_access.sql`

Prasyaratnya adalah schema existing dari `supabase_blog_studio.sql`, `supabase_commerce.sql`, dan `supabase_freelance.sql`. Migration menambah sumber homepage, memperbarui hasil RPC untuk unsubscribe, dan memperketat izin founder. Tidak membuat dashboard atau tabel subscriber paralel. Migration diuji dua kali pada PostgreSQL embedded tanpa kehilangan data. Migration **belum diterapkan ke hosted**; aplikasi harus dirilis bersama migration ini, sebab pemeriksaan founder akan menolak akses jika RPC belum tersedia.

Pertahankan public Supabase URL/publishable key, credential signup server existing (`FREELANCE_SIGNUP_SECRET`, dengan fallback `ENGAGEMENT_SIGNING_SECRET`), dan hash credential yang sesuai di `private.freelance_server_config`. Founder harus memiliki email terverifikasi dan tercatat pada allowlist existing. Tidak ada secret baru yang perlu dimasukkan ke browser. Konfigurasi Midtrans/produk dan PDF existing tetap merupakan persyaratan terpisah untuk commerce berbayar.

## Bukti verifikasi

- TypeScript: `npx tsc --noEmit` lulus. Direktori artifact, worktree, dan release dikecualikan dari pemeriksaan aplikasi; sebelumnya salinan contoh test di artifact meminta dependency Vitest yang bukan dependency aplikasi.
- ESLint khusus file yang berubah: lulus. ESLint keseluruhan repository tetap mencatat **31 error dan 81 warning** dari modul existing di luar perubahan ini; hasil lengkap ada di `artifacts/home-ecosystem/lint-full.json`.
- Next production build: `NEXT_PRIVATE_STANDALONE=true` dan `npx next build --webpack` lulus. Cache webpack Windows sempat menghasilkan `WasmHash` error; pengulangan setelah membersihkan hanya cache webpack berhasil. Source tidak diubah untuk menghindari error tersebut.
- OpenNext: `npx opennextjs-cloudflare build --skipNextBuild` lulus dan menghasilkan `.open-next/worker.js`. Peringatan salin package Windows muncul, namun proses selesai dengan exit 0. Ini bukti packaging, bukan bukti Worker sudah berjalan di production.
- `node scripts/check-home-database.cjs`: **10 pemeriksaan PostgreSQL embedded** lulus, termasuk penyimpanan, duplikat, unsubscribe, rate limit, izin founder/member, spoofed email, ownership transaksi/entitlement/private files, dan migration ulang.
- `node scripts/check-home-server.cjs`: **8 pemeriksaan server** lulus, termasuk Origin, penolakan izin palsu, validasi form, kegagalan penyimpanan, dan status subscriber.
- `node scripts/check-commerce.cjs`: **11 pemeriksaan keamanan commerce existing** lulus.
- `node scripts/check-home-editorial.cjs`: 34 tujuan navigasi publik, penolakan route privat, serta 24 file gambar sertifikasi/lencana lulus.
- `node scripts/check-home-browser.cjs`: **19 pemeriksaan Chrome** lulus. Beranda 360/390/768/1440 px pada dua tema tanpa overflow; menu mobile/keyboard, galeri, kembali ke atas, popup sosial, form gagal/berhasil, unsubscribe, login member, penolakan founder, profil/library, ringkasan founder, data subscriber, tujuan navbar setelah login, dan kontrol jeda diperiksa. Tidak ada uncaught browser error. Auth/produk browser memakai fixture loopback; penyimpanan subscriber menggunakan PostgreSQL embedded melalui route server aplikasi sebenarnya.
- `client-secret-scan.json`: tidak ditemukan nilai credential privat dari environment pada 121 file aset client. Ini pemeriksaan nilai yang tersedia lokal, bukan audit semua credential yang mungkin ada.
- Pemeriksaan HTTP eksternal: YouTube, TikTok, Instagram, Threads, Facebook, dan Chikki merespons 200. Judul YouTube/Instagram/Threads/Facebook cocok dengan Khadafi. LinkedIn merespons 999 untuk akses otomatis; target anchor dan popup sudah sesuai URL pengguna, tetapi isi profil LinkedIn tidak dapat diverifikasi otomatis. Hasil tersimpan di `external-links.json`.

Screenshot dan JSON hasil berada di `artifacts/home-ecosystem/`, termasuk beranda untuk setiap ukuran/tema, hero, footer desktop/mobile, dan dashboard subscriber. Semua data QA memakai alamat `.invalid` dan tidak ditulis ke Supabase hosted.

Untuk mengulangi PostgreSQL QA pada checkout baru, pasang dependency QA terpisah:

```powershell
npm install --prefix artifacts/home-ecosystem/qa-runtime --no-save --package-lock=false @electric-sql/pglite
node scripts/check-home-database.cjs
node scripts/check-home-server.cjs
```

Browser suite menggunakan Playwright bundled Codex (atau `PLAYWRIGHT_MODULE`), Chrome, fixture `node scripts/home-ecosystem-fixture.cjs` di port 3021, dan Next dev di port 3014 dengan public Supabase URL `http://127.0.0.1:3021`, publishable key fixture, dan `FREELANCE_SIGNUP_SECRET=local-fixture-secret`. Fixture tidak diimpor aplikasi dan tidak digunakan untuk production.

## Batas verifikasi

Penyimpanan dan RLS diuji pada PostgreSQL lokal, bukan pada database hosted. Login/produk di browser menggunakan identitas QA loopback, bukan akun pelanggan production. Belum ada pengujian hosted setelah migration, pengiriman email, checkout Midtrans nyata, atau runtime Worker production untuk perubahan ini. Tidak dilakukan push, merge, migration hosted, maupun deployment production.
