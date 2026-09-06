# HCFTL — Iteration 4: Living Research Observatory

Panduan revisi visual dan prompt implementasi • 6 September 2026

## Dasar revisi

Deliverable ini adalah arahan implementasi untuk workspace website Khadafi yang memuat perubahan HCFTL terbaru. Belum ada perubahan source code, commit, atau deployment yang dilakukan melalui dokumen ini.

Screenshot yang diterima berukuran 127 × 2048 piksel. Komposisi besar terlihat, tetapi ukuran font asli, kontras, dan overlap per elemen belum dapat diverifikasi dari gambar sekecil ini. Screenshot menunjukkan hero terpusat, manifesto, peta lima frontier, daftar frontier terpisah, pipeline, evidence, safety, autonomy, registry, archive, dan bagian penutup.

Pemeriksaan GitHub pada sesi ini menunjukkan `LabHero.tsx` masih menggunakan hero dua kolom berbahasa Inggris dengan diagram lima node. Karena berbeda dari screenshot, versi lokal harus diperiksa sebelum mengedit. Jangan menganggap kode remote sebagai versi visual terbaru.

Sumber kode yang diperiksa:
- [Susunan halaman Lab](https://github.com/dhiyaulhaqkhadafi0/personal/blob/feat/hcftl-lab/src/app/lab/page.tsx)
- [Hero Lab](https://github.com/dhiyaulhaqkhadafi0/personal/blob/feat/hcftl-lab/src/components/lab/LabHero.tsx)

## Keputusan desain

Pertahankan karakter dark premium, judul editorial, cyan lembut, dan suasana observatorium. Perkuat identitas HCFTL sebagai lab riset terapan yang berpusat pada manusia. Fokus perbaikan adalah keterbacaan, komposisi, dan kedalaman informasi.

| Area | Perubahan yang dituju |
| --- | --- |
| Hero | Satu headline kuat, satu paragraf, satu CTA utama, satu status ringkas. Visual mendapat kolom tersendiri. |
| Identitas | Nama lengkap lab tetap terlihat; singkatan HCFTL konsisten. |
| Frontier | Peta dan penjelasan lima bidang menjadi satu pengalaman; hindari dua section yang mengulang informasi. |
| Hierarki | Maksimal tujuh bab utama; detail governance tetap tersedia melalui disclosure yang jelas. |
| Ritme | Variasikan proporsi antarbagian, dengan grid dan margin yang konsisten. |
| Status | Nyatakan tahap fondasi secara faktual; animasi dekoratif tidak menjadi indikator aktivitas riset. |

---

# Prompt siap dijalankan di Anti Gravity / Codex lokal

Lanjutkan implementasi halaman `/lab` pada website Khadafi menjadi **HCFTL Iteration 4 — Living Research Observatory**. Kerjakan perubahan sampai dapat direview melalui preview dan screenshot. Gunakan keputusan berikut sebagai arahan utama.

## 1. Temukan versi kerja yang benar

- Baca `AGENTS.md` yang berlaku, status git, branch aktif, serta diff lokal sebelum mengedit.
- Branch HCFTL yang pernah digunakan adalah `feat/hcftl-lab`. Screenshot terbaru merupakan referensi komposisi Iteration 3. Jangan menimpa perubahan lokal dengan versi GitHub yang lebih lama.
- Periksa `src/app/lab/page.tsx`, `src/lib/hcftl.ts`, komponen di `src/components/lab/`, font, stylesheet, navbar, dan konfigurasi motion yang benar-benar tersedia. Nama komponen dapat berbeda pada versi lokal.
- Catat versi dasar serta perubahan lokal yang sudah ada. Jangan reset, clean, atau membuang pekerjaan pengguna.
- Terapkan revisi pada workspace terbaru. Jika versi itu memang tidak tersedia, jelaskan perbedaannya dan siapkan pekerjaan terisolasi tanpa mengklaim melanjutkan Iteration 3 yang belum terlihat.

## 2. Hasil yang ingin dicapai

Pengunjung harus segera memahami siapa HCFTL, apa yang diteliti, dan status pengembangannya. Tampilan terasa tenang, terarah, dan berkarakter. Setiap section harus punya satu fokus dominan.

Pertahankan body copy Bahasa Indonesia yang natural. Istilah bidang riset dapat tetap memakai nama Inggris aslinya. Jangan mengubah positioning menjadi blog AI umum atau perusahaan dengan fasilitas dan hasil riset yang belum ada.

Batasi perubahan pada pengalaman Lab dan integrasi yang memang dibutuhkan. Pertahankan fungsi Blog Studio, autentikasi, AI provider, data publikasi, dan halaman lain. Jangan menambahkan backend, paket animasi baru, WebGL, atau sistem CMS untuk revisi visual ini. Gunakan stack dan aset yang tersedia.

## 3. Hero: prioritas pertama

Gunakan grid desktop dua kolom dengan pembagian awal sekitar 58:42. Kiri memuat teks; kanan memuat satu visual observatorium. Sesuaikan breakpoint dengan lebar konten nyata: dua kolom hanya jika keduanya cukup lapang. Pada tablet sempit dan mobile, susun teks lalu visual dalam alur normal.

Copy hero yang disarankan:

- Eyebrow: `HCFTL / LAB RISET INDEPENDEN`
- Identitas sekunder: `Human Centered Frontier Technology Lab`
- H1: `Teknologi frontier.` lalu `Berpusat pada manusia.`
- Deskripsi: `Mengeksplorasi AI dan sistem cerdas yang memperluas kemampuan manusia—melalui eksperimen terukur, bukti yang dapat diperiksa, dan kendali manusia yang tetap terjaga.`
- CTA utama: `Jelajahi Riset` → menuju bagian bidang riset.
- Tautan sekunder: `Cara Kami Bekerja` → menuju metode riset.
- Status ringkas: `Tahap fondasi · Merancang eksperimen pertama`, hanya jika status ini sesuai data terbaru. Bila berbeda, gunakan status faktual dari sumber lokal.

Gunakan tepat satu H1. Jadikan nama lengkap lab tetap mudah dibaca tanpa menduplikasi headline panjang. Izinkan judul membungkus secara alami pada mobile; jangan memaksa dua baris di semua viewport.

Visual kanan berupa satu instrumen abstrak berbasis SVG/CSS: inti kecil, orbit tipis, dan sedikit titik cyan. Tidak perlu label lima domain mengelilingi inti. Detail bidang riset sudah tersedia pada section berikutnya. Visual dekoratif tidak boleh memuat klaim `ONLINE`, telemetry, sinyal real time, angka acak, atau progress palsu.

Pastikan dekorasi berada di container terpisah, tidak melewati teks, CTA, atau navbar. Absolute positioning hanya untuk lapisan dekorasi di dalam container visual. Judul, paragraf, status, dan tombol tetap dalam document flow. Jangan menggunakan margin negatif untuk menyatukan visual dengan headline.

Hero desktop boleh memiliki tinggi minimum yang memberi ruang, tetapi harus tumbuh mengikuti isi. Jangan memaksa tinggi `100vh` atau memotong teks ketika layar pendek dan font diperbesar. Pada mobile, prioritaskan headline, penjelasan, dan CTA; visual cukup sekitar 220–300 px tinggi sebagai titik awal.

## 4. Susun alur menjadi tujuh bab utama

### 01 — Hero / Identitas

Gunakan struktur di atas. Integrasikan status singkat di hero atau strip tepat setelahnya. Hindari dashboard metrik nol yang mengambil fokus pembuka.

### 02 — Mengapa HCFTL Ada

Pertahankan manifesto yang sudah ditulis pengguna. Sajikan satu pernyataan utama dengan ruang kosong yang cukup, lalu penjelasan ringkas maksimal dua paragraf. Prinsip narasi: manfaat manusia, bukti yang dapat diuji, dan tanggung jawab atas dampak teknologi. Jangan mengulang keseluruhan hero.

### 03 — Lima Bidang Riset

Gabungkan fungsi peta riset dan Frontier Index menjadi satu section. Pertahankan lima domain serta deskripsi dari sumber data terbaru. Label yang pernah digunakan adalah Physical Intelligence, Collective Intelligence, Resilience Technology, Digital Twin Intelligence, dan Safe Autonomous Systems; verifikasi nama persisnya dari versi lokal.

Desktop: daftar lima pilihan di kiri, satu panel penjelasan bidang aktif di kanan. Panel berisi nama, deskripsi yang sudah ada, pertanyaan riset atau contoh yang memang tersedia, status, dan visual kecil yang relevan. Gunakan state lokal; jangan membuat lima blok ilustrasi besar yang mengulang peta.

Mobile: tampilkan lima accordion vertikal dengan teks jelas. Detail tidak boleh hanya tersedia melalui hover. Jika memakai tabs di desktop, implementasikan semantic tabs dan navigasi keyboard yang sesuai; pilihan dapat diakses dengan focus yang terlihat. Menampilkan semua detail dalam HTML tetap baik untuk keterbacaan dan akses tanpa interaksi.

Jangan menambah proyek riset atau klaim hasil demi mengisi panel. Aspirasi harus diberi label sebagai arah eksplorasi, terpisah dari eksperimen yang sedang berjalan.

### 04 — Dari Pertanyaan Menjadi Bukti

Gunakan tahapan pipeline yang benar-benar ada dalam data. Buat urutan mudah dibaca dalam grid sederhana desktop dan daftar vertikal mobile. Setiap tahap memiliki nomor, judul, dan satu kalimat penjelasan. Kurangi kurva dekoratif jika membuat hubungan antarlangkah sulit dipahami.

Tempatkan ringkasan Evidence Ladder di section ini. Simpan seluruh level dan penjelasan asli dalam disclosure `Lihat standar bukti`. Jangan memadatkan sampai perbedaan level bukti berubah makna.

### 05 — Manusia Tetap Memegang Kendali

Gabungkan pengantar safety framework dan autonomy scale. Di permukaan, tampilkan tiga prinsip ringkas yang diturunkan dari konten asli: kewenangan manusia, batas penggunaan, serta evaluasi risiko.

Sediakan disclosure terpisah untuk `Kerangka keselamatan` dan `Tingkat otonomi`. Seluruh batasan, pengecualian, dan detail substantif tetap dapat dibaca. Jangan menyembunyikan peringatan penting hanya demi memperpendek halaman. Pertahankan anchor lama jika sudah dipakai oleh navigasi atau tautan eksternal.

### 06 — Perkembangan Lab

Satukan konteks Experiment Registry dan Research Archive. Tampilkan satu status perkembangan yang jujur, milestone berikutnya yang sudah terdokumentasi, kemudian eksperimen dan hasil publik sesuai data aktual.

Jika eksperimen belum dimulai, tampilkan status tersebut dengan jelas. Jika belum ada publikasi, gunakan empty state yang tenang: `Belum ada hasil riset yang dipublikasikan.` Pertahankan proposal Experiment 001 jika memang ada, dengan label usulan atau direncanakan sesuai sumbernya. Hindari kartu raksasa bergaya sistem terkunci dan tombol yang tidak memiliki tujuan.

### 07 — Riset Terbuka / Founder

Pertahankan filosofi publikasi dan kolaborasi, lalu profil Daffa Dhiyaulhaq Khadafi dengan peran sesuai sumber asli. Gunakan kontak yang sudah tersedia. Jangan membuat alamat email, formulir, rekan institusi, atau afiliasi baru.

Pertahankan quote penutup yang sudah disetujui sebagai penutup editorial jika masih relevan. Hanya satu quote penutup; ukurannya tidak perlu menandingi hero. Tampilkan footer dengan tautan yang berfungsi.

## 5. Sistem visual dan spacing

Nilai berikut adalah titik awal desain, bukan alasan untuk menimpa token global website:

| Elemen | Arahan awal |
| --- | --- |
| Canvas | Charcoal `#070B10`; kedalaman navy `#0D1520` |
| Teks utama | Off-white `#F2F4F3` |
| Teks sekunder | Slate terang `#A8B3C0`; ukur kontras pada latar aktual |
| Aksen | Cyan lembut `#9DD9E5`, digunakan selektif |
| Lebar konten | Maksimal sekitar 1180–1240 px, margin tengah konsisten |
| Padding horizontal | Mobile 20–24 px; tablet 32 px; desktop 40–64 px |
| Jarak bab | Desktop 96–128 px; mobile 64–80 px, disesuaikan konteks |
| H1 | Fluid, titik awal 40–48 px mobile dan 64–80 px desktop |
| H2 | Sekitar 30–48 px, sesuai lebar layar |
| Body | 16–18 px; line-height sekitar 1.6–1.75; lebar maksimal 60–68 karakter |
| Label dan metadata | 12–14 px; jangan mengecilkan isi penting menjadi microtext |
| Target interaksi | Sekitar 44 × 44 px atau lebih |

Gunakan serif editorial yang sudah tersedia untuk headline bila sesuai Iteration 3; body sans-serif yang jelas, monospace hanya untuk kode atau metadata seperlunya. Jangan menambah font baru sebelum memeriksa font existing. Hindari letter spacing berlebihan pada kalimat panjang.

Bangun background melalui ambient glow yang halus dan lokal, garis koordinat tipis, serta perbedaan tonal antarbab. Teks utama tidak diturunkan opacity-nya demi estetika. Jangan menyelimuti seluruh halaman dengan grid atau partikel yang membuat konten sulit dibaca.

Gunakan garis pembatas dan tipografi untuk mengorganisasi informasi. Panel berbingkai dipakai hanya saat berguna, misalnya detail bidang aktif atau eksperimen. Hilangkan kebiasaan memberi setiap paragraf kartu tersendiri.

## 6. Motion, navigasi, dan responsivitas

- Gunakan motion ringan pada opacity dan transform. Konten inti terbaca saat halaman dimuat; jangan bergantung pada scroll reveal agar muncul.
- Hormati `prefers-reduced-motion`, termasuk pulse dan smooth scrolling. Visual dekoratif diberi `aria-hidden` serta `pointer-events: none`.
- Hindari animasi layout pada ukuran, posisi teks, dan border yang menyebabkan pergeseran konten.
- Batasi navigasi section menjadi label pendek seperti `Tentang`, `Riset`, `Metode`, `Prinsip`, `Perkembangan`. Pastikan target anchor ada.
- Periksa navbar global dan navigasi lokal bersama: tidak saling menutupi. Atur `scroll-margin-top` berdasarkan total tinggi sticky yang benar-benar terlihat.
- Mobile boleh memakai navigasi section yang menggulir horizontal di container sendiri. Halaman utama tetap tanpa horizontal overflow.
- Perbaiki penyebab overflow dengan grid fleksibel, `min-width: 0`, wrapping, dan ukuran visual yang benar. Jangan menutupi masalah konten dengan `overflow-x-hidden` global.
- Warna bukan satu-satunya indikator tab aktif, status, atau focus. Setiap kontrol memiliki nama yang jelas, state yang benar, dan perilaku keyboard yang sesuai.

## 7. Urutan implementasi

1. Audit versi lokal dan buat inventaris konten, anchor, komponen, serta status faktual.
2. Rapikan hero dan token visual lokal Lab. Render desktop/mobile sebelum melanjutkan agar arah tipografi dan proporsi konsisten.
3. Satukan peta dengan bidang riset; rapikan pipeline, evidence, safety, autonomy, serta status berdasarkan struktur di atas.
4. Selesaikan navigasi, disclosure, reduced motion, dan semua target tautan.
5. Lakukan pemeriksaan visual serta perbaikan sampai hasil memenuhi kriteria berikut. Jangan berhenti hanya setelah membuat implementation plan.

Gunakan `src/lib/hcftl.ts` atau model konten lokal yang sudah ada sebagai sumber data bersama. Jangan menduplikasi label lima frontier di hero, map, dan indeks. Hindari refactor besar di luar kebutuhan revisi.

## 8. Kriteria selesai

- Inspeksi screenshot pada lebar 360, 390, 768, 1024, dan 1440 px. Sertakan setidaknya satu viewport pendek untuk memeriksa hero dan sticky navigation.
- Tidak ada teks bertabrakan, terpotong, atau tertutup dekorasi. Tidak ada horizontal overflow halaman.
- Headline, paragraf, status, dan CTA hero memiliki urutan baca jelas; nama lengkap HCFTL tetap terbaca.
- Lima bidang riset hanya memiliki satu section utama; semuanya dapat dibuka dengan sentuhan dan keyboard.
- Semua informasi substantive evidence, safety, dan autonomy dipertahankan dan dapat diakses.
- Status eksperimen dan publikasi sesuai sumber; tidak ada indikator operasional palsu.
- Verifikasi teks pada zoom 200%, focus keyboard, anchor, reduced motion, serta kontras normal dan muted text pada background aktual.
- Tidak ada error console baru atau layout shift nyata akibat animasi/font. Uji interaksi yang berubah; tidak perlu membuat test yang sekadar menyalin implementasi styling.
- Jalankan pemeriksaan lint/typecheck/build yang memang tersedia di `package.json` dan gate repo yang berlaku. Jalankan OpenNext build bila merupakan gate proyek. Bedakan error lama dari error revisi; jangan mengklaim lulus jika perintah belum dijalankan.

Laporan akhir harus memuat: versi dasar dan branch, komponen yang diubah, alasan perubahan, screenshot hero desktop, halaman penuh desktop, serta mobile; hasil pemeriksaan dengan kendala yang masih ada. Jika preview atau build tidak tersedia, tulis batasan itu secara eksplisit.

Siapkan perubahan yang dapat direview. Ikuti otorisasi yang sudah ada untuk commit/push; prompt desain ini tidak meminta merge ke main atau deployment production.
