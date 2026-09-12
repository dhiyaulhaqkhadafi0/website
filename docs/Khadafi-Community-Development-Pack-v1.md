# Khadafi Community — Development Pack v1.0

Disusun untuk Daffa Dhiyaulhaq Khadafi • 7 September 2026

Status: rancangan implementasi dan prompt kerja, bukan hasil audit repository atau implementasi. Struktur file, branch, versi dependency, route, database, dan integrasi aktual harus diverifikasi di Antigravity. Nama “Ruang Bertumbuh — bersama Khadafi” adalah nama kerja yang mudah diganti.

## 1. Arah produk

Komunitas belajar dan membangun bersama. Anggota datang melalui perjalanan Khadafi, lalu bertahan karena mendapat wawasan praktis, kemajuan dalam karya, dan hubungan dengan sesama anggota.

Janji manfaat: setiap minggu anggota menemukan satu hal berguna, mencoba satu langkah kecil, atau mendapatkan bantuan untuk maju.

Audience awal: pengikut personal journey, kreator pemula, dan orang yang menggunakan AI untuk menghasilkan karya atau produk. Tema bersama: mengubah ide menjadi hasil nyata. CEO of System menjadi perspektif konten; bahasa antarmuka tetap natural dan mudah dipahami.

Website personal menjadi rumah komunitas. Chikki, Gerakasa, dan HCFTL dapat menjadi studi kasus. Komunitas ini tidak menambah scope MVP Chikki atau menggantikan dukungan produk tersebut.

## 2. Persiapan sebelum development

### A. Yang Khadafi siapkan

| Kebutuhan | Default untuk mulai | Kapan harus final |
|---|---|---|
| Nama dan janji manfaat | Nama kerja di atas | Sebelum rilis publik |
| Kanal diskusi | Gunakan satu kanal yang sudah dipakai audience jika tersedia; jangan membuat beberapa kanal sekaligus | Sebelum membuka undangan |
| Link kanal | URL asli yang dikonfirmasi; kosongkan jika belum ada | Sebelum CTA masuk komunitas aktif |
| Materi perjalanan | Pilih 2–3 update asli yang sudah boleh dibagikan | Sebelum rilis; jika belum ada, tampilkan keadaan kosong yang jujur |
| Visual | Logo personal yang sudah ada dan 1–2 screenshot proyek milik sendiri | Saat implementasi UI |
| Kegiatan pertama | Usulan “7 Hari, 1 Karya Jadi” | Jadwal dan fasilitator harus final sebelum RSVP |
| Ritme pengelolaan | Dua pemantik diskusi per minggu, satu sesi bulanan | Sebelum pilot |
| Pengelola | Khadafi sebagai host awal; moderator tambahan setelah ada kandidat | Sebelum diskusi dibuka |
| Pengiriman update | Pilih integrasi email yang benar-benar tersedia | Sebelum menjanjikan email konfirmasi atau rangkuman |
| Informasi privasi dan aturan | Jelaskan penggunaan email, preferensi update, kontribusi publik, dan cara keluar | Sebelum mengumpulkan pendaftaran |

Tidak perlu menunggu seluruh materi untuk mengerjakan UI lokal. Konten belum siap harus memiliki status draft atau empty state; jangan diubah menjadi fakta publik.

### B. Yang Antigravity audit

- Baca AGENTS.md dan instruksi repo yang berlaku, README, package.json, lockfile, struktur route, komponen layout dan design tokens.
- Periksa git status, branch dan remote tanpa mencetak credential. Riwayat menyebut repo personal serta branch feat/blog-studio; itu petunjuk, bukan kondisi terkini.
- Temukan halaman komunitas yang sudah ada beserta tautannya. Pertahankan URL canonical yang digunakan; gunakan /community hanya jika belum ada route yang harus dipertahankan.
- Temukan pola navbar/footer, dark/light theme, typography, container, spacing, button, form, state, dan icon.
- Periksa sumber blog/journey dan aturan published snapshot agar draft tidak bocor ke halaman publik.
- Audit auth, session, admin guard, Supabase clients, schema dan migrations jika tersedia. Login anggota tidak boleh memberi akses Blog Studio.
- Periksa konfigurasi deployment Cloudflare/OpenNext yang sebenarnya, scripts build/preview, env example, dan CI.
- Catat baseline error sebelum mengedit; bedakan masalah lama dan regresi.

### C. Dokumen kerja dalam repo

Simpan pada docs/community/ atau direktori setara sesuai konvensi repo:

- audit.md: temuan aktual beserta path bukti.
- implementation-plan.md: fase, scope, dependensi dan kriteria selesai.
- tasks.md: checklist fase aktif dan status nyata.
- decisions.md: keputusan dan asumsi yang belum diverifikasi.
- content-checklist.md: copy, aset, jadwal, URL, dan kesiapan publikasi.
- qa.md: skenario, hasil, screenshot, kegagalan lama dan baru.
- handoff.md: ringkasan perubahan dan langkah lanjut.

## 3. Fondasi teknis yang direkomendasikan

Pertahankan stack repo yang sudah bekerja. Konteks sebelumnya menyebut Next.js, TypeScript, Tailwind, Supabase, dan Cloudflare/OpenNext; verifikasi seluruhnya. Jangan upgrade framework atau mengganti adapter hosting hanya demi halaman komunitas.

| Area | Fase awal | Saat dibutuhkan |
|---|---|---|
| Halaman publik | Komponen dan design tokens existing | Tetap dalam aplikasi personal |
| Konten | Modul data bertipe atau CMS existing yang sesuai | Admin pengelolaan ketika ritme konten stabil |
| Pendaftaran | Belum aktif di preview fase 1 | Endpoint server + persistence yang teruji pada fase 2 |
| Login | Tidak wajib untuk membaca halaman | Auth existing yang diperluas dengan role anggota pada fase 3 |
| Data | Hindari schema baru pada fase UI | Schema minimum sesuai alur yang sudah dibuka |
| Email | Tidak mengklaim terkirim | Integrasi nyata, preferensi dan unsubscribe |
| Analytics | Reuse jika tersedia | Event minimum tanpa email atau isi posting |
| Diskusi | Satu kanal awal | Forum native pada fase 4 bila perlu |

RLS mengatur akses per baris pada tabel yang terekspos. Service/secret key harus tetap di server; jangan taruh dalam bundle browser. Akses role membutuhkan sumber otorisasi yang tidak bisa diedit anggota. Rujukan: [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

Untuk website yang sudah memakai OpenNext, pertahankan dan uji konfigurasi tersebut. Rujukan integrasi: [OpenNext Cloudflare](https://opennext.js.org/cloudflare/get-started). Halaman ini bukan proyek migrasi hosting. Antigravity harus memeriksa dokumentasi resmi yang sesuai versi terpasang ketika benar-benar mengimplementasikan API atau mengubah integrasi.

## 4. Fase development dan kriteria selesai

### Fase 0 — Audit dan rencana berbasis repo

Output: dokumen kerja, peta route dan komponen reuse, baseline build, daftar materi yang belum siap, dan rencana perubahan per file. Tidak ada reset repo, perubahan dependency besar, atau perubahan production.

Selesai ketika route target, fondasi visual, batas akses, pola konten publik dan cara menjalankan preview diketahui. Jika ada akses tidak tersedia, catat bagian yang belum diverifikasi dan lanjutkan pekerjaan lokal yang aman.

### Fase 1 — Halaman publik, siap direview

Urutan bagian:

1. Hero: judul “Bertumbuh lewat karya, bersama.”; deskripsi “Ikuti prosesku membangun dengan AI, konten, dan produk digital—lalu temukan langkah kecil untuk perjalananmu sendiri.”
2. Sedang berlangsung: satu kegiatan aktif; jika belum ada, tampilkan rencana kegiatan dengan status jelas dan tanpa tanggal rekaan.
3. Tiga manfaat: belajar dari proses, mencoba bersama, mendapat feedback.
4. Catatan perjalanan: maksimal tiga konten asli yang sudah published.
5. Dari anggota: showcase berizin; jika kosong, undangan mengirim karya atau contoh milik Khadafi berlabel jelas.
6. Cara bergabung: alur singkat sesuai kesiapan fitur.
7. Budaya dan FAQ: pemula diterima, kritik pada karya, promosi terarah, biaya awal gratis sebagai rancangan yang dikonfirmasi sebelum launch.
8. CTA penutup yang konsisten.

Default CTA preview fase 1: “Lihat rencana kegiatan” menuju section yang benar. Jika kanal existing sudah diverifikasi, boleh ada CTA menuju kanal tersebut dengan label sesuai fungsinya. Jangan menampilkan tombol pendaftaran yang mengaku sukses tanpa menyimpan data.

Desain: editorial, hangat, premium; typography lega, satu fokus hero, visual proses asli, aksen lembut dari design system. Pisahkan teks dan visual dalam flow layout agar tidak bertabrakan. Background dekoratif boleh absolute dengan clipping lokal, tetapi konten utama tetap normal flow. Hindari tiny text, grid kartu identik di seluruh halaman, glow berlebihan, parallax berat dan statistik fiktif.

Selesai ketika desktop/mobile terbaca, seluruh CTA sesuai kenyataan, tidak ada overflow, empty state rapi, metadata publik benar, build relevan lulus atau baseline blocker dijelaskan, dan screenshot tersedia.

### Fase 2 — Pendaftaran nyata dan pilot komunitas

Form minimum: nama panggilan, email, minat utama. Tujuan 30 hari opsional. Persetujuan aturan dipisahkan dari pilihan menerima rangkuman email; rangkuman tidak dicentang otomatis.

Alur: validasi server → pembatasan percobaan → penyimpanan idempotent/deduplicated → status yang jujur → langkah berikutnya. Kegagalan pengiriman email setelah penyimpanan tidak boleh menghapus pendaftaran atau mengklaim email terkirim. Hindari respons yang membocorkan apakah email seseorang telah terdaftar.

Jika email dipakai untuk akun atau delivery, verifikasi kepemilikannya melalui mekanisme yang sesuai; sampai terverifikasi jangan hitung sebagai anggota aktif atau kirimi digest. Jika provider belum siap, tampilkan mode pendaftaran minat dengan label yang jelas dan tanpa janji undangan instan.

Admin dapat melihat pendaftaran secara privat, status, tanggal, dan minat. Pilot target usulan 20–30 orang; bukan angka anggota yang sudah ada. Kalender hanya memuat kegiatan yang tanggal dan host-nya sudah dipastikan.

Selesai ketika data terbukti tersimpan, submit ganda aman, error state berfungsi, daftar email tidak dapat dibaca publik, admin guard teruji, dan minimal satu kegiatan serta cara tindak lanjut siap. Jika email aktif, uji verifikasi, preferensi dan unsubscribe end-to-end.

### Fase 3 — Area anggota ringan

Bangun setelah pilot memiliki kegiatan berulang dan materi yang perlu dikunjungi kembali. Beranda anggota berisi langkah berikutnya, kegiatan minggu ini, update terbaru, serta materi tersimpan. Reuse auth existing jika cocok; jangan membuat akun duplikat.

Scope: onboarding singkat, profil privat secara default, kegiatan dan RSVP, materi, bookmark, preferensi update. Navigasi diskusi masih menuju kanal terverifikasi bila forum native belum dibangun. Data anggota yang dipindahkan dari pendaftaran minat harus dikaitkan hanya sesudah identitas email terverifikasi.

Selesai ketika register/login/logout/recovery sesuai metode auth bekerja, session benar pada runtime target, anggota A tidak dapat membaca atau mengubah data privat anggota B, anggota tidak dapat membuka admin/Blog Studio, dan cache tidak membocorkan konten personal.

### Fase 4 — Diskusi dan kontribusi native

Mulai jika percakapan nyata sulit ditemukan kembali, pertanyaan berulang, atau pengelolaan kanal awal sudah menjadi hambatan. Scope: thread, reply, tag Tanya/Proses/Minta Feedback, filter/search sederhana, pagination, report, hide, suspend, dan antrean pertanyaan belum terjawab. Sediakan format permintaan feedback.

Visibility: diskusi hanya anggota sebagai default; showcase publik perlu persetujuan terpisah. Aturan akses konten, status moderasi dan status anggota berlaku di server/database. Posting anggota tersuspensi dan hidden content tidak boleh lolos lewat endpoint langsung.

Selesai ketika anggota bisa berbagi dan menanggapi, feedback pertama ditangani host, laporan sampai ke moderator, dan uji kepemilikan/role/sanitasi/rate limit lulus. Tidak membangun DM, realtime chat, marketplace, atau leaderboard pada fase ini.

### Fase 5 — Pertumbuhan berdasarkan bukti

Pertimbangkan tantangan native, kelompok kecil, pendamping anggota, digest terjadwal, atau program berbayar satu per satu. Pilih dari masalah yang terukur; pembayaran memerlukan scope terpisah.

Metrik: aktivasi tujuh hari, kembali minggu berikutnya, pertanyaan terbantu, karya selesai, interaksi antaranggota, dan waktu pengelola. Definisikan event, denominator dan jendela waktu sebelum menyimpulkan. Pisahkan pendaftar, email terverifikasi, peserta dan anggota aktif. Jangan mengukur keberhasilan dari pageview saja.

## 5. Kandidat model data, bukan instruksi membuat semuanya

| Entitas | Kapan | Catatan akses |
|---|---|---|
| community_signups | Fase 2 | Privat; tidak ada SELECT publik; dedupe email; consent/version/status |
| community_events | Fase 2/3 | Hanya published untuk publik; draft untuk pengelola |
| community_memberships | Fase 3 | Referensi auth user; status/role hanya dapat diubah pengelola berwenang |
| member_profiles | Fase 3 | Minat/tujuan privat; pisahkan field profil yang opt-in publik |
| community_rsvps | Fase 3 | User melihat miliknya; pengelola event sesuai kewenangan |
| resource_bookmarks | Fase 3 | Milik pengguna saja; constraint unik user-resource |
| community_posts/replies | Fase 4 | Keanggotaan, kepemilikan dan status moderasi |
| community_reports | Fase 4 | Pelapor dapat submit; detail hanya bagi moderator berwenang |

Reuse tabel yang cocok setelah audit. Tulis migration additive, constraints dan indexes sesuai query aktual. Jangan memakai metadata yang dapat diedit user untuk role. RLS dan grant diuji bersama; penyembunyian tombol di UI bukan otorisasi.

## 6. Rencana konten pilot

Minggu 1: sambutan, tujuan anggota dan satu catatan proses asli. Minggu 2: pilih karya kecil dan bagikan hambatan. Minggu 3: jalankan “7 Hari, 1 Karya Jadi” jika host dan peserta siap. Minggu 4: bedah hasil, sorotan berizin dan evaluasi.

Setiap minggu cukup dua pemantik bermakna. Usulan target layanan internal: pertanyaan baru ditinjau dalam dua hari kerja, disesuaikan dengan kapasitas host. Jangan menjanjikan konsultasi pribadi tanpa batas.

## 7. Master advanced prompt untuk Antigravity

Salin seluruh blok berikut ke Antigravity dengan repository website personal sudah terbuka. Pada instruksi pertama, jalankan Fase 0 dan Fase 1 saja. Bagian fase lanjutan adalah konteks arsitektur.

```text
Anda bekerja sebagai senior product engineer dan product designer pada repository website personal Khadafi yang sedang saya buka.

TUJUAN
Rapihkan dan bangun halaman komunitas untuk audience yang mengikuti personal journey saya dan ingin belajar, menghasilkan karya, serta saling membantu. Berikan implementasi lokal yang nyata dan dapat direview.

KONTEKS PRODUK
- Nama kerja: Ruang Bertumbuh — bersama Khadafi. Jadikan mudah diganti.
- Janji manfaat: setiap minggu anggota menemukan satu hal berguna, mencoba satu langkah kecil, atau mendapat bantuan untuk maju.
- Tema: personal journey, AI, konten, produk digital dan sistem berkarya.
- Website personal adalah rumah komunitas; Chikki, Gerakasa dan HCFTL hanya menjadi sumber studi kasus yang relevan.
- Bahasa Indonesia natural, hangat, tegas, mudah dipahami pemula.
- Saya juga mengerjakan Chikki. Prioritaskan scope kecil yang lengkap.

BATAS EKSEKUSI TURN INI
Kerjakan Fase 0: audit; lalu Fase 1: halaman publik hingga preview dan QA selesai. Jangan hanya memberi rencana lalu berhenti meminta Proceed. Lanjutkan pekerjaan lokal yang jelas dan reversible. Fase 2–5 adalah roadmap, bukan izin membangun semua fitur sekarang.
Jangan commit, push, deploy, mengirim pesan/email, atau menerapkan migration ke production pada turn ini. Jangan mengubah data nyata. Jika ada instruksi terbaru dari saya tentang scope, ikuti instruksi tersebut.

AUDIT SEBELUM EDIT
1. Baca instruksi repo yang berlaku, README, package.json, lockfile, route, layout, tokens, auth/admin guard dan deployment config.
2. Cek branch dan git status; jaga perubahan pengguna. Jangan reset, force checkout atau stash secara otomatis. Jika perubahan bertabrakan, adaptasi patch secara terarah dan jelaskan.
3. Temukan route komunitas yang sudah ada. Pertahankan URL dan tautan existing bila relevan; jangan membuat halaman paralel yang menduplikasi fungsi. /community adalah fallback bila belum ada route.
4. Cari sumber konten blog/journey yang published. Pahami aturan draft/published snapshot sebelum reuse.
5. Verifikasi stack aktual. Riwayat menyebut Next.js, TypeScript, Tailwind, Supabase, Cloudflare/OpenNext; jangan menganggap versi/branch/path lama masih benar.
6. Temukan perintah install, lint, typecheck, build dan preview dari repo; rekam baseline. Gunakan package manager yang cocok dengan lockfile.
7. Dokumentasikan temuan dengan path nyata. Jangan mencetak secret atau isi env.

ARSITEKTUR DAN SCOPE
- Reuse komponen, tokens, auth dan sumber konten yang sesuai; hindari duplikasi sistem.
- Jangan mengganti framework, package manager, adapter hosting atau global design system.
- Fase 1 tidak memerlukan database baru, form pendaftaran aktif, auth anggota, dashboard, API email atau AI.
- Pisahkan data konten, komponen presentasi dan status kesiapan CTA. Gunakan pola repo, bukan abstraksi generik berlebihan.
- Tambahkan dependency hanya jika kebutuhan fase aktif tidak dapat dipenuhi secara wajar dengan dependency existing. Jelaskan alasan dan dampaknya.
- Scoped styles; perubahan shared component hanya bila diperlukan dan aman untuk halaman lain.

STRUKTUR HALAMAN
1. Hero: judul “Bertumbuh lewat karya, bersama.”
   Deskripsi: “Ikuti prosesku membangun dengan AI, konten, dan produk digital—lalu temukan langkah kecil untuk perjalananmu sendiri.”
   CTA default fase 1: “Lihat rencana kegiatan”, menuju section yang benar.
2. Satu kegiatan utama. Usulan pertama: “7 Hari, 1 Karya Jadi”. Tanpa jadwal terkonfirmasi, statusnya rencana, tanpa countdown atau RSVP aktif.
3. Tiga manfaat: belajar dari proses, mencoba bersama, mendapat feedback.
4. Maksimal tiga catatan perjalanan dari konten published asli. Jika tidak tersedia, gunakan empty state yang berguna.
5. Showcase anggota hanya bila ada karya dan izin yang jelas. Jika kosong, tampilkan undangan berkontribusi atau contoh karya saya dengan label contoh yang jujur.
6. Cara bergabung sesuai readiness. Link kanal hanya dari sumber yang terverifikasi; jika belum ada, jelaskan status persiapan secara singkat dan arahkan ke kegiatan/contoh manfaat.
7. Budaya dan FAQ: pemula diterima, masukan spesifik, penghargaan atas karya, promosi terarah, jadwal sesuai kesiapan.
8. CTA penutup konsisten dengan hero.

DESIGN DIRECTION
- Editorial, warm, premium, terasa dihuni manusia dan karya nyata.
- Gunakan typography, charcoal/warna netral, aksen lembut dan theme behavior existing.
- Hero memiliki satu titik fokus, hierarchy jelas, teks dengan lebar baca nyaman, dan visual pendukung yang tidak menutup judul.
- Hindari semua section menjadi grid kartu yang sama, glow berlebihan, tiny text, floating badges bertabrakan, parallax berat, dan dashboard statistik kosong.
- Layout konten utama menggunakan normal flow. Dekorasi boleh absolute hanya dengan batas dan clipping yang terkontrol.
- Mobile-first; cek lebar 360, 390, 768, 1280 dan 1440 px. Tidak ada horizontal overflow, teks terpotong atau CTA keluar viewport.
- Interaksi keyboard, focus visible, semantic headings, label yang jelas, kontras terbaca dan reduced-motion harus didukung.
- Gunakan aset milik proyek; jangan mengarang testimoni, jumlah anggota, logo partner, hasil kegiatan atau tingkat aktivitas.
- Content utama harus tetap terlihat bila animasi gagal atau reduced-motion aktif.

PERILAKU DAN KONTEN
- Setiap CTA harus menuju tujuan yang tersedia dan sesuai label.
- Jangan membuat success toast palsu, submit local-only yang diklaim tersimpan, email “terkirim” tanpa integrasi, atau fitur tampak aktif tetapi kosong.
- Loading/error/empty state hanya untuk alur yang memang ada; jangan menambah loading teatrikal pada halaman publik.
- Jangan menerbitkan draft blog, detail rahasia proyek, atau data anggota.
- Copy produk menjelaskan manfaat, bukan istilah implementasi seperti endpoint/env/migration.
- Jangan menambahkan indexable halaman placeholder dashboard.

ROADMAP UNTUK DOKUMENTASI
Fase 2: form minat/pendaftaran tersimpan, dedupe, anti-abuse, status jujur, consent terpisah, admin privat dan pilot satu kanal. Email diverifikasi bila dipakai untuk akun/delivery, dan unsubscribe jika digest aktif.
Fase 3: auth anggota, onboarding, home dengan next action, materi, bookmark, kegiatan/RSVP, profil dan preferensi; reuse auth existing dan pisahkan akses admin.
Fase 4: thread/reply, search/filter sederhana, pagination, report/hide/suspend, antrean belum terjawab, showcase berizin.
Fase 5: tantangan native, kelompok kecil, pendamping, digest atau program lanjutan berdasarkan kebutuhan terukur.
Jangan implementasikan roadmap tersebut pada turn awal.

CATATAN UNTUK FASE DATA NANTI
Verifikasi docs resmi sesuai versi terpasang sebelum memakai API. Gunakan migration additive dan environment development/staging. RLS dan grants mengikuti ownership, membership dan role aktual; role tidak bersumber dari user-editable metadata. Secret key server-only. Server harus memverifikasi otorisasi pada setiap mutasi; UI guard tidak cukup. Uji anonymous, anggota A/B, moderator/admin, suspended user, cache dan direct endpoint. Jangan melakukan cache publik pada data personal. Tidak perlu menulis SQL fase ini.

DOKUMENTASI
Buat/perbarui docs/community/audit.md, implementation-plan.md, tasks.md, decisions.md, content-checklist.md, qa.md, dan handoff.md, atau lokasi setara sesuai konvensi repo. Pisahkan fakta, asumsi, usulan dan hal yang blocked. Tandai completed hanya jika benar-benar selesai.

VALIDASI
Jalankan pemeriksaan yang relevan dari scripts repo. Uji build dan preview runtime target yang tersedia; jangan menyamakan keberhasilan next dev dengan keberhasilan preview deployment adapter.
Review screenshot desktop/mobile serta theme yang didukung, klik seluruh CTA, navigasi keyboard, empty state dan overflow. Smoke-check navbar, blog, detail artikel, Lab dan auth/Studio bila tersedia. Jangan mempublikasikan konten atau memodifikasi data sebagai bagian smoke test.
Tambahkan automated test hanya untuk behavior baru yang berisiko atau diwajibkan gate repo, bukan untuk menyalin markup presentasi. Jika tool preview tidak tersedia, laporkan visual QA belum dilakukan; jangan mengklaim pass.
Perbaiki regresi yang ditimbulkan perubahan sendiri. Catat baseline failure terpisah.

OUTPUT AKHIR
Ringkas: hasil yang sudah berjalan, file utama berubah, validasi beserta bukti, hal belum terverifikasi, materi/integrasi yang dibutuhkan untuk fase 2, dan langkah berikutnya. Sertakan path screenshot dan preview lokal bila tersedia. Tegaskan status commit/push/deploy secara faktual. Jangan mengklaim komunitas live atau pendaftaran aktif jika belum demikian.

Mulai audit repository sekarang dan lanjutkan Fase 1 sampai hasilnya siap direview.
```

## 8. Prompt lanjutan per fase

Gunakan satu blok sesuai milestone. Jangan kirim semua sekaligus.

### Revisi visual setelah screenshot

```text
Lanjutkan fase halaman publik dari keadaan repo saat ini. Baca docs/community dan cocokkan dengan screenshot/feedback yang saya lampirkan. Perbaiki masalah visual spesifik: hierarchy, hero collision, spacing, typography, CTA dan responsive. Pertahankan behavior yang sudah benar. Jangan menambah fitur atau backend. Jalankan ulang QA yang relevan, perbarui dokumen status, dan tampilkan screenshot hasil terbaru. Jika screenshot tidak tersedia, inspeksi preview sendiri; jangan menebak isi screenshot yang tidak bisa diakses.
```

### Fase 2: pendaftaran dan pilot

```text
Lanjutkan ke Fase 2 pada docs/community. Audit kesiapan schema, endpoint, email, kanal dan materi aktual. Implementasikan pendaftaran nyata pada development/staging dengan validasi server, dedupe/idempotency, pembatasan percobaan, consent digest terpisah, dan admin view privat. Jika provider email belum tersedia, gunakan mode daftar minat dengan status jujur, tanpa mengklaim undangan/email terkirim. Jangan bocorkan status email terdaftar. Buat migration sesuai workflow repo dan uji akses anonymous/admin serta retry/failure. Verifikasi docs resmi sebelum memakai API. Sediakan setup env dengan nama variabel saja. Selesaikan dan validasi bagian yang tidak blocked; laporkan credential atau URL yang benar-benar masih dibutuhkan. Jangan terapkan migration production, kirim broadcast, push atau deploy tanpa instruksi saya. Jangan mulai dashboard atau forum.
```

### Fase 3: area anggota

```text
Lanjutkan Fase 3 dari dokumen dan hasil pilot yang tersedia. Jika data pilot belum ada, tandai alasan pembangunan sebagai keputusan saya, bukan bukti kebutuhan yang dibuat-buat. Reuse auth existing; implementasikan onboarding ringan, home dengan next action, materi, bookmark, kegiatan/RSVP, profil privat dan preferensi. Kaitkan pendaftaran lama hanya setelah email terverifikasi. Pisahkan membership dari privilege admin/Blog Studio. Uji login/logout/recovery sesuai metode auth, session pada runtime target, RLS/grants, anggota A versus B, anonymous, admin guard, cache dan error states. Tulis migration additive dan handoff teruji. Jangan mulai forum, DM, realtime chat, pembayaran atau deploy production.
```

### Fase 4: diskusi dan moderasi

```text
Lanjutkan Fase 4 dengan thread/reply, tag Tanya/Proses/Minta Feedback, search/filter dan pagination sederhana, report/hide/suspend serta antrean pertanyaan belum terjawab. Diskusi member-only sebagai default dan showcase publik memerlukan izin. Uji ownership, keanggotaan, role moderator, suspended user, hidden content, sanitasi konten dan rate limit di endpoint langsung. Gunakan membership/status aktual saat otorisasi; jangan bergantung hanya pada tombol tersembunyi atau klaim lama. Sertakan panduan host untuk menyambut kontribusi pertama. Tidak ada DM, marketplace, leaderboard, AI auto-reply atau realtime chat. Verifikasi dan perbarui docs/community; jangan deploy production tanpa instruksi saya.
```

## 9. Cara memakai paket

1. Buka repository website personal di Antigravity. Jangan membuka repository Chikki untuk tugas ini.
2. Lampirkan file ini dan, jika tersedia, screenshot halaman komunitas saat ini serta aset personal yang relevan.
3. Salin master prompt bagian 7. Prompt sudah memerintahkan audit dan implementasi Fase 1 dalam satu alur.
4. Review preview dan QA. Kirim feedback visual menggunakan prompt revisi jika diperlukan.
5. Setelah halaman rapi, lengkapi kanal, kegiatan dan integrasi pendaftaran untuk Fase 2. Rilis publik memerlukan instruksi terpisah; jangan menganggap preview berarti sudah online.
6. Naik fase sesuai hasil penggunaan dan prioritas Khadafi. Dashboard merupakan milestone berikutnya, bukan syarat merilis halaman publik.

Referensi teknis diperiksa 7 September 2026. API dan dependency aktual tetap diverifikasi ulang ketika implementasi dimulai.
