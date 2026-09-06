# HCFTL Iteration 6 — Frontier Research Atlas

## Prompt utama untuk Anti Gravity / Codex lokal

Kerjakan **redesign komposisi halaman `/lab` secara nyata** pada proyek `e:\khadafi-website`. Pengguna sudah menilai Iteration 5: efek lebih hidup, tetapi desain masih terasa sama. Kali ini targetnya adalah pengalaman visual baru yang lebih berani, premium, dan memorable, dengan informasi riset tetap utuh.

**Prompt ini menggantikan batasan desain Iteration 4–5 yang meminta mempertahankan susunan visual. Kamu diizinkan membangun ulang layout, markup, proporsi, pengelompokan section, komposisi visual, dan gaya komponen Lab.** Pertahankan fakta, makna, fungsi yang relevan, serta identitas HCFTL; susunan kartu dan template dua kolom existing boleh diganti sepenuhnya.

Selesaikan implementasi, preview, dan verifikasi. Rencana singkat boleh dibuat sebagai catatan kerja, lalu lanjutkan eksekusi sesuai otorisasi proyek. Jangan berhenti pada implementation plan jika tidak ada blocker nyata.

## 1. Creative direction: Frontier Research Atlas

Bayangkan sebuah pameran riset masa depan yang dikurasi dengan selera editorial: tipografi monumental, satu objek pahatan digital yang khas, diagram riset berukuran besar, dan informasi yang disusun seperti atlas ilmiah modern.

Karakter: berani dalam skala, tenang dalam gerak, jelas dalam informasi, dan berpusat pada manusia. Dark premium tetap menjadi basis. Silver, off-white, dan cyan lembut digunakan dengan sengaja.

Tiga hal yang harus langsung terlihat pada screenshot diam:

1. Hero memiliki siluet baru dan objek utama yang berbeda dari radar/orbit kecil Iteration 5.
2. Bidang riset mendapat satu panggung visual besar yang menjadi pusat eksplorasi halaman.
3. Bagian bawah mempunyai variasi penyajian: pernyataan editorial, alur metode, daftar disclosure, jurnal perkembangan, dan profil founder. Repetisi kartu kecil berkurang secara nyata.

Jangan berhenti pada mengganti radius, memperbesar glow, menambahkan partikel, atau menambah animasi ke layout lama. Lulus build adalah pemeriksaan teknis; penilaian desain dilakukan dengan perbandingan screenshot.

## 2. Audit singkat dan batas pekerjaan

- Baca aturan proyek yang berlaku, branch, status git, dan diff lokal. Gunakan versi lokal Iteration 5 sebagai baseline, bukan remote lama.
- Periksa route `/lab`, komponen Lab, model data HCFTL, navbar, font, motion utilities, dan aset yang tersedia.
- Simpan screenshot baseline pada ukuran viewport yang akan dipakai untuk perbandingan akhir.
- Buat inventaris konten singkat: lima bidang riset, sembilan tahap metode, evidence ladder, safety, autonomy, status eksperimen, publikasi, prinsip keterbukaan, dan identitas founder. Gunakan inventaris ini untuk menjaga substansi saat layout diubah.
- Pertahankan pekerjaan pengguna, route lain, Blog Studio, autentikasi, provider AI, dan data publikasi. Scope redesign adalah Lab.
- Gunakan stack existing. Komponen yang semantik atau perilakunya masih baik boleh dipakai ulang; layout lama tidak wajib dipertahankan.

## 3. Hero: komposisi editorial dengan pahatan digital

### Layout desktop

Bangun hero sebagai satu kanvas lebar, bukan dua kotak setara berisi teks dan radar.

- Kontainer utama sekitar 1280–1360 px pada desktop besar, dengan gutter 48–72 px sesuai viewport. Pada layar kecil, kurangi gutter secara responsif.
- Identitas HCFTL dan nama lengkap lab ditampilkan sebagai masthead ringkas. Navbar global tetap berfungsi; jangan membuat menu global kedua yang mengulangnya.
- Headline dominan menggunakan sekitar delapan kolom dari grid 12 kolom. Mulai dengan 80–104 px pada desktop lebar, lalu sesuaikan font aktual agar tetap elegan. Target pada 1440 px: dua baris yang disengaja; bukan empat atau lima baris pendek.
- Copy H1: `Teknologi frontier.` / `Berpusat pada manusia.` Jika font aktual tidak memungkinkan dua baris tanpa menabrak area lain, prioritaskan proporsi dan bacaannya; jangan mengecilkan seluruh hero untuk memaksakan target.
- Gunakan off-white untuk kalimat utama dan aksen cyan/silver selektif pada kata `manusia`. Hindari seluruh judul berisi gradient terang.
- Letakkan deskripsi dan CTA pada kelompok kompak di bawah headline, sejajar margin teks. Lebar deskripsi sekitar 40–48 karakter.
- Status fondasi menjadi catatan ringkas pada bagian bawah hero. Sediakan petunjuk scroll sederhana yang menuju section selanjutnya.

### Objek khas baru: folded light ribbon

Ganti radar, lingkaran HUD, penanda derajat, serta titik kecil di tengah dengan **pita metalik berlipat yang membentuk ruang terbuka di pusatnya**. Bentuknya terasa seperti pahatan tipis dari silver dengan tepian cahaya cyan: ada permukaan depan, permukaan belakang, dan kedalaman yang dapat terbaca saat diam.

Makna visualnya adalah kemampuan teknologi yang membuka ruang bagi manusia. Ini metafora brand, bukan visualisasi hasil eksperimen.

- Objek menempati bagian kanan dan bawah hero, cukup besar untuk menjadi fokus kedua setelah headline. Sebagian dekorasi boleh keluar dari batas container visual untuk memberi kesan skala.
- Tetapkan area aman teks. Objek boleh menyatu dengan background, tetapi tidak boleh menutup huruf, deskripsi, CTA, atau status. Gunakan masking lokal dan urutan layer yang terencana.
- Tambahkan pencahayaan arah tunggal dan bayangan lembut yang membuat material terlihat. Titik cahaya seperlunya, tanpa starfield memenuhi layar.
- Implementasikan lewat SVG dengan kurva, gradient, dan masking yang dirancang dengan baik, atau teknologi grafis existing bila memang sudah ada. Jika perlu aset raster, gunakan aset berlisensi atau hasil generasi yang tersedia secara sah, dan simpan lokal dengan fallback. Jangan hotlink aset acak atau mengklaim objek 3D bila hanya efek glow datar.
- Pilih implementasi yang menghasilkan siluet bagus dengan biaya render wajar. Tidak perlu menambahkan engine 3D baru untuk mengejar label teknis.
- Gerak: perubahan sudut sangat kecil, pergeseran cahaya lambat, atau parallax lokal maksimal sekitar 8 px. Jangan memutar seluruh objek cepat seperti loading spinner.

### Mobile

Susun identitas → headline → deskripsi/CTA → pahatan. Gunakan headline sekitar 42–54 px sebagai titik awal dan wrapping alami. Visual tetap cukup besar, sekitar 260–340 px tinggi, dengan skala yang disesuaikan layar. Tidak boleh ada overlap, teks terpotong, atau crop pada informasi utama.

Hero harus tumbuh bersama konten. Hindari fixed height yang memotong isi pada viewport pendek atau zoom.

## 4. Manifesto: satu bidang editorial yang punya bobot

Sesudah hero, buat bidang graphite yang lebih terang dari canvas utama, dengan pencahayaan lembut dan batas tonal yang menyatu.

- Tampilkan manifesto pengguna sebagai pernyataan besar selebar ruang baca yang nyaman.
- Beri satu kata/frasa penekanan secara tipografis, bukan animasi per kata.
- Letakkan narasi pendukung sebagai catatan editorial kecil di sisi bawah/kanan desktop dan mengalir setelah quote pada mobile.
- Hilangkan note card berbingkai yang membuat bagian ini menyerupai dashboard.
- Pindahkan motif pahatan hero menjadi satu garis sederhana sebagai aksen, tanpa mengulang objek lengkap.

## 5. Lima bidang riset: panggung eksplorasi utama

Ganti komposisi daftar kecil kiri + panel teks kanan + diagram mungil di bawah menjadi **satu panggung riset lebar dengan diagram dominan dan caption terintegrasi**.

Desktop:

1. Header section di atas dengan judul jelas dan pengantar ringkas.
2. Lima pilihan bidang tersusun sebagai indeks bernomor di bagian atas panggung. Teks harus terbaca; jika lebar tidak cukup, beralih ke susunan yang lebih lapang, bukan mengecilkan font.
3. Diagram aktif mengisi sekitar 55–65% area utama. Judul bidang dan deskripsi menempati area sisanya, dengan ruang yang cukup.
4. Pertanyaan riset dan scope ditampilkan di bawah sebagai baris editorial, bukan kumpulan chip kecil.

Visual tiap bidang berbeda secara konseptual:

- Physical Intelligence: hubungan persepsi, keputusan, dan tindakan dalam ruang.
- Collective Intelligence: beberapa agen dengan hubungan kerja yang terbaca.
- Resilience Technology: jalur redundan dan struktur pemulihan.
- Digital Twin Intelligence: dua representasi sistem yang saling dipetakan.
- Safe Autonomous Systems: ruang tindakan dengan batas yang jelas dan kewenangan manusia.

Gunakan data serta istilah versi lokal. Diagram dapat bersifat konseptual; jangan memberi angka performa atau mengarang hasil penelitian. Label harus dapat dibaca pada ukuran render aktual. Jangan menambahkan hover tooltip sebagai satu-satunya sumber informasi.

Pada mobile gunakan accordion atau pemilih sederhana, diikuti diagram besar dan narasi vertikal. Semua lima bidang tetap dapat diakses. Crossfade saat berganti sekitar 250–350 ms; pertahankan fokus dan minimalkan layout jump tanpa memotong teks panjang.

Jika memakai semantic tabs, implementasikan pola keyboard, selected state, dan relasi panel dengan benar. Jangan menjadikan lima card yang identik sebagai pengganti panggung visual.

## 6. Metode dan evidence: alur yang dapat diikuti

Pertahankan sembilan tahap dan tiga grouping Iteration 5 hanya jika grouping tersebut cocok dengan isi sumber.

- Desktop: tiga kolom fase berukuran besar dan terbuka, terhubung garis tipis. Gunakan nomor fase yang kuat, judul, lalu daftar tahap bernomor dengan divider seperlunya.
- Hilangkan bingkai kartu individual dari setiap tahap. Susunan nomor, teks, dan konektor harus menjelaskan urutan bahkan tanpa animasi.
- Mobile: alur vertikal tunggal dengan label fase yang jelas.
- Evidence Ladder menjadi satu garis bertingkat atau daftar jenjang ringkas di bawah metode, dengan penjelasan lengkap dalam disclosure.
- Jika ada penanda level aktif, nyatakan eksperimen/klaim mana yang dinilai. Jangan menetapkan level bukti institusi tanpa dasar.

Hindari highlight yang bergerak sendiri seolah proses riset sedang dieksekusi. Gerakan boleh merespons pemilihan tahap atau disclosure.

## 7. Tata kelola: struktur yang tenang dan tegas

Ganti tiga kartu prinsip dan panel bertumpuk dengan layout editorial dua bagian:

- Pernyataan `Manusia tetap memegang kendali` di satu sisi.
- Tiga prinsip sebagai baris bernomor dengan divider, diikuti disclosure kerangka keselamatan dan skala otonomi di sisi lain.

Pada mobile semuanya mengalir dalam satu kolom. Semua batasan, definisi, serta level tetap utuh. Warna hijau/amber/merah dipakai untuk kategori keselamatan yang memang bermakna; teks prinsip tidak perlu glow warna-warni.

Disclosure memakai tombol berlabel jelas, ikon plus/minus, focus state, dan transisi ringan. Detail yang tertutup tidak boleh tetap masuk tab order.

## 8. Perkembangan: jurnal riset yang jujur

Susun bagian ini sebagai jurnal perkembangan:

- Satu pernyataan status dominan berdasarkan data aktual.
- Milestone berikutnya sebagai baris yang mudah dipindai.
- Experiment 001 sebagai entri proposal/eksperimen sesuai status yang terdokumentasi, dengan judul, ringkasan, dan status yang jelas.
- Publikasi sebagai daftar atau empty state yang rapi. Empat jenis publikasi masa depan dapat ditampilkan sebagai daftar teks ringkas, tidak harus empat kartu kosong.

Jangan menambahkan angka aktivitas, progress persentase, tanggal, mitra, atau publikasi yang belum ada. Jika belum ada aktivitas riset, kekuatan visual datang dari penyusunan informasi yang jelas.

## 9. Founder dan penutup: identitas personal yang kuat

Ganti kartu profil kecil dengan komposisi editorial lebih besar:

- Nama lengkap `Daffa Dhiyaulhaq Khadafi` sebagai elemen utama section, dengan peran dan narasi existing.
- Filosofi keterbukaan menjadi tiga kolom teks sederhana di desktop dan daftar vertikal di mobile.
- Gunakan foto founder asli hanya jika sudah tersedia dan sesuai izin; kalau tidak ada, gunakan komposisi tipografi dan aksen visual existing. Jangan menciptakan foto orang atau logo baru.
- CTA menuju kontak atau tujuan existing yang valid. Tautan `/` dan `/blog` tetap dapat dipertahankan.
- Quote penutup berada pada ruang tersendiri, dengan skala lebih kecil daripada H1 dan pencahayaan yang menurun secara lembut menuju footer.
- Pastikan tidak ada footer global dan footer Lab yang mengulang informasi secara berlebihan.

## 10. Sistem bentuk, warna, dan tipografi

Gunakan token lokal Lab; jangan mengubah tema global seluruh website.

| Elemen | Arahan |
| --- | --- |
| Canvas | Ink/navy sangat gelap, misalnya #070C12 |
| Bidang penekanan | Graphite/navy lebih terang, misalnya #14212B, dengan transisi tonal halus |
| Teks utama | Off-white hangat, misalnya #F0F2ED |
| Teks sekunder | Slate cukup terang, misalnya #ADBAC5; verifikasi pada background aktual |
| Aksen utama | Silver dan cyan lembut, misalnya #B5E1E7 |
| Tipografi | Serif editorial untuk headline, sans-serif untuk isi, monospace seperlunya |
| Body | Sekitar 16–18 px; lebar baca sekitar 55–68 karakter |
| Metadata | Sekitar 12–14 px, tidak menjadi microtext dekoratif |
| Card | Hanya ketika container membantu fungsi; jangan membungkus tiap ide |
| Jarak | Variasikan menurut hubungan konten; jangan menyisipkan spacer besar yang sama antarsemua section |

Gunakan paling banyak dua keluarga font existing jika memungkinkan. Tidak ada kewajiban semua judul memiliki ukuran atau layout sama; hierarki visual perlu konsisten, tetapi tiap bab boleh mempunyai komposisi tersendiri.

## 11. Tombol, cursor, navigasi, dan motion

- Primer: tombol silver dengan sudut sekitar 8–12 px, tinggi sekitar 48 px, label jelas, dan area panah di ujung kanan. Berikan detail inset yang ringan, bukan glow besar.
- Hover: perubahan cahaya, panah bergeser 3 px, lift maksimal 2 px. Sapuan kilau cukup satu kali saat pointer masuk.
- Sekunder: tautan editorial dengan underline yang bergerak singkat. Area klik tetap mudah ditargetkan.
- Reticle lokal hanya di panggung yang memang bisa dieksplorasi, desktop dengan fine pointer. Pertahankan cursor sistem dan matikan efek pada reduced motion/touch.
- Pilih satu navigasi section yang ringkas. Jangan menumpuk bar sticky yang mengambil banyak tinggi layar. Pertahankan anchor lama atau sediakan target kompatibel saat grouping section berubah.
- Gerak ambient menjadi aksen. Sediakan jeda yang menghentikan semua gerakan ambient terkait, termasuk cahaya, bukan hanya orbit.
- Hormati reduced motion dari awal. Tidak ada preloader buatan, scroll hijacking, teks tersembunyi sampai animasi selesai, atau marquee tanpa fungsi.

## 12. Performa dan responsivitas

- Semua teks penting berada dalam document flow. Absolute positioning hanya untuk lapisan dekorasi yang terisolasi.
- Perbaiki overflow pada sumbernya. Clipping lokal boleh untuk pahatan dekoratif; jangan menyembunyikan overflow konten dengan aturan global.
- Batasi loop animasi pada visual yang terlihat dan hentikan saat document tersembunyi atau komponen dilepas.
- Pointer memakai motion value atau requestAnimationFrame yang efisien. Jangan setState React setiap pointermove.
- Jika canvas digunakan, batasi DPR serta detail mobile, dan sediakan tampilan statis ketika animasi dimatikan. Konten dan CTA tidak bergantung pada canvas.
- Hindari animasi blur besar, resize terus-menerus, dan transform seluruh halaman.
- Verifikasi keyboard, touch, zoom 200%, reduced motion, focus state, dan kontras. Status atau pilihan aktif tidak bergantung pada warna saja.

## 13. Prosedur pengerjaan

1. Audit dan simpan baseline.
2. Bangun ulang komposisi hero dan panggung frontier terlebih dahulu. Render pada desktop dan mobile, lalu perbaiki proporsinya sebelum menerapkan gaya ke bagian lain.
3. Bangun layout manifesto, metode, governance, perkembangan, serta founder yang berbeda bentuk penyajiannya. Cocokkan kembali inventaris konten agar tidak ada substansi hilang.
4. Tambahkan motion dan interaksi setelah desain diamnya sudah kuat.
5. Jalankan pemeriksaan visual serta gate teknis yang berlaku.
6. Buktikan preview berasal dari workspace dan port yang benar. Jangan mengandalkan asumsi localhost:3000 jika server berjalan di port berbeda. Hapus penanda diagnosis sementara sebelum selesai.

## 14. Acceptance criteria: perbedaan yang harus dibuktikan

Tugas selesai ketika:

- Screenshot hero menunjukkan siluet, skala headline, dan objek utama yang berbeda nyata dari Iteration 5.
- Pada 1440 px headline tidak lagi terjepit menjadi tumpukan baris pendek hanya karena kolom terlalu sempit.
- Panggung frontier menampilkan diagram besar sebagai bagian utama, bukan thumbnail di bawah panel teks.
- Metode, governance, perkembangan, dan founder mempunyai susunan yang berbeda satu sama lain.
- Informasi, status, serta makna seluruh level bukti dan keselamatan tetap utuh.
- Dengan animasi dijeda dan reduced motion aktif, halaman tetap terasa dirancang dengan baik.
- Tidak ada teks tertutup dekorasi, overflow halaman, kontrol mati, focus yang hilang, atau clipping isi.

Bukti akhir:

- Screenshot sebelum/sesudah pada viewport identik: hero desktop, halaman penuh desktop, hero mobile, dan panggung riset.
- Periksa lebar 360, 390, 768, 1024, dan 1440 px, termasuk satu viewport pendek dan zoom 200%.
- Rekaman 15–30 detik: hero, hover CTA, pergantian frontier, disclosure, scroll antarbab, serta jeda gerakan.
- Hasil lint/typecheck/build sesuai script proyek, beserta error atau batasan yang benar-benar ditemukan. Jangan mengklaim fps, kontras, atau performa tanpa pemeriksaan.
- URL lokal dan port yang telah terkonfirmasi, daftar perubahan utama, serta hal yang belum selesai bila ada.

Jika perbandingan screenshot masih terlihat seperti desain lama dengan warna atau glow berbeda, lanjutkan perbaikan komposisi. Jangan menutup pekerjaan dengan klaim “maksimal”, “sempurna”, atau “lebih premium” tanpa bukti visual.

Ikuti otorisasi commit/push yang sudah berlaku dalam sesi lokal. Prompt ini meminta implementasi dan preview yang dapat direview; bukan permintaan merge ke main atau deployment production.
