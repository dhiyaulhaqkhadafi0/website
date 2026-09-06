# HCFTL Iteration 6.1 — Interaksi dan Atmosfer

## Prompt untuk agent implementasi lokal

Lanjutkan halaman `/lab` dari Iteration 6 terbaru pada workspace `e:\khadafi-website`. Pengguna menyukai arah desain sekarang: pahatan silver di hero, tipografi editorial, dan layout terbuka. Pertahankan identitas serta komposisi tersebut. Tugas berikutnya adalah membuat halaman terasa hidup, dapat dieksplorasi, dan lebih nyaman dibaca melalui detail yang dapat dibuka-tutup, visual bergerak, background berlapis, serta transisi dan tombol yang responsif.

Kerjakan sampai implementasi dan preview dapat direview. Jangan berhenti pada rencana jika tidak ada blocker nyata. Baca aturan proyek, status git, diff lokal, model data, dan komponen existing sebelum mengedit. Jangan menimpa perubahan pengguna atau mengubah halaman lain.

## 1. Prinsip interaksi

Setiap bab memiliki lapisan ringkasan yang selalu terlihat dan lapisan penjelasan yang bisa dibuka. Judul, manfaat utama, status faktual, serta CTA penting tetap dapat dibaca tanpa klik. Pengunjung tetap memahami lab saat semua detail dalam keadaan tertutup.

Terapkan buka-tutup pada kelompok informasi yang masuk akal. Hindari setiap paragraf menjadi accordion, accordion bersarang, atau seluruh section lenyap saat ditutup. Hero tetap terbuka; akses navigasi dan kontak selalu terlihat.

Gunakan satu pola disclosure yang konsisten: judul, ringkasan, tombol `Lihat detail` atau label spesifik, dan ikon plus/minus. Saat terbuka, label berubah menjadi `Tutup detail` dengan konteks yang jelas secara aksesibel. Baris dan divider sudah cukup; jangan mengembalikan semua konten ke kartu berbingkai.

## 2. Pemetaan perilaku section

| Bagian | Selalu terlihat | Detail yang dibuka | Keadaan awal |
| --- | --- | --- | --- |
| Hero | Identitas, H1, deskripsi, CTA, status, pahatan | Tidak perlu accordion hero | Terbuka |
| Manifesto | Quote utama dan satu kalimat pengantar | Narasi pendirian melalui `Mengapa HCFTL ada?` | Ringkas |
| Frontier | Lima pilihan, nama bidang aktif, diagram, ringkasan | Pertanyaan riset, cakupan, dan penjelasan melalui `Dalami bidang ini` | Satu bidang aktif, detail ringkas |
| Metode | Tiga fase, nama dan urutan sembilan tahap | Detail masing-masing fase melalui header fase | Detail fase tertutup |
| Evidence Ladder | Nama dan urutan semua level, pengantar standar bukti | Penjelasan per level melalui baris level | Tertutup; satu level dapat dibuka pada satu waktu |
| Governance | Tiga prinsip serta ringkasan batasan utama | Kerangka keselamatan dan skala otonomi, dua disclosure independen | Detail tertutup |
| Perkembangan | Fase aktual, milestone berikutnya, status publikasi | Proposal Experiment 001 melalui `Baca rancangan eksperimen` | Ringkas |
| Founder | Nama, peran, pengantar, tautan kontak valid | Narasi panjang melalui `Tentang pendiri` | Ringkas |
| Filosofi keterbukaan | Nama dan ringkasan tiga prinsip rilis | Penjelasan kebijakan pada tiap prinsip bila memang panjang | Ringkas |

Seluruh konten substantive Iteration 6 tetap tersedia. Data kosong tidak perlu diberi tombol. Batas keselamatan yang penting tetap disebut pada ringkasan; detail boleh diperluas untuk penjelasan lengkap.

### Aturan keadaan dan navigasi

- Keadaan buka-tutup dipertahankan selama halaman masih terpasang. Jangan menutup otomatis karena scroll keluar viewport, resize, atau render ulang.
- Dalam evidence ladder hanya satu level terbuka pada satu waktu. Disclosure lintas section dapat terbuka bersamaan.
- Pergantian frontier memperbarui judul, ringkasan, diagram, serta detail secara konsisten. Pertahankan preferensi detail terbuka saat pengguna membandingkan bidang; isi mengikuti bidang aktif.
- Isi detail tersembunyi tidak boleh tetap dapat difokuskan dengan keyboard atau dibaca seolah visible oleh assistive technology.
- Gunakan button atau native details/summary sesuai kebutuhan, dengan ID unik, expanded state, accessible name, dan hubungan kontrol/panel yang benar.
- Jika fokus berada di dalam panel yang akan ditutup, kembalikan fokus ke pemicunya sebelum menyembunyikan panel.
- Anchor ke detail tersembunyi harus membuka leluhurnya dahulu, lalu menggulir ke target dengan offset sticky yang benar. Pertahankan kompatibilitas anchor existing.
- Jangan memindahkan posisi scroll atau fokus setiap kali panel dibuka. Koreksi posisi hanya jika kontrol/target benar-benar tertutup navbar.
- Pilih semantik native yang tetap masuk akal tanpa JavaScript atau sediakan fallback isi terbaca. Jangan membuat seluruh informasi tidak tersedia ketika script gagal.

## 3. Transisi buka-tutup yang halus

- Durasi awal sekitar 240–320 ms dengan easing yang lembut dan konsisten. Mobile boleh sedikit lebih cepat.
- Tinggi mengikuti konten nyata. Gunakan fasilitas animasi existing, pengukuran tinggi, atau teknik grid yang teruji. Hindari max-height tebakan yang memotong penjelasan atau memberi jeda kosong panjang.
- Opacity dapat mengikuti perubahan tinggi secara ringan. Isi tidak perlu terbang, berputar, atau blur saat dibuka.
- Klik cepat berulang tidak boleh menghasilkan panel tersangkut, ikon salah keadaan, atau tinggi tertinggal.
- Setelah ditutup, ruang detail ikut menyusut. Jangan mempertahankan spacer kosong bekas konten.
- Reduced motion menggunakan perubahan langsung tanpa translasi atau animasi tinggi panjang.

## 4. Hidupkan pahatan dan visual riset

### Hero

Pertahankan pahatan pita silver Iteration 6. Tingkatkan keterbacaan bentuk melalui edge light tipis, perbedaan sisi terang/gelap, dan pencahayaan yang memberi kedalaman. Jangan menggantinya kembali menjadi radar atau banyak cincin HUD.

- Tambahkan satu gerakan ambient utama: sedikit perubahan orientasi atau drift vertikal sekitar 4–6 px dalam 10–16 detik.
- Satu pergeseran cahaya lambat boleh menjadi gerak pendamping. Jangan menggerakkan semua layer dengan kecepatan berbeda secara mencolok.
- Pointer desktop memberi parallax lokal maksimal sekitar 6–8 px. Teks, CTA, dan hit area tetap stabil.
- Kontrol `Jeda animasi` / `Lanjutkan animasi` berlaku konsisten pada seluruh animasi ambient Lab, termasuk background dan diagram. Tempatkan dengan tenang tetapi dapat ditemukan. Hover feedback singkat dapat tetap bekerja; reduced motion memiliki perilaku lebih ketat.
- Pahatan tetap menarik saat dijeda. Label teknis dan indikasi operasional tidak perlu ditambahkan.

### Frontier

Pertahankan panggung besar dan lima diagram konseptual. Setiap diagram mendapat perilaku yang menjelaskan topiknya:

- Physical Intelligence: satu sinyal bergerak dari persepsi menuju tindakan.
- Collective Intelligence: beberapa koneksi bergantian menyorot untuk menunjukkan pertukaran antaragen.
- Resilience Technology: penekanan jalur alternatif. Jika ada simulasi gangguan, beri tombol aksi yang jelas dan label bahwa itu ilustrasi konseptual, tanpa angka hasil palsu.
- Digital Twin Intelligence: penekanan korespondensi antarrepresentasi.
- Safe Autonomous Systems: bidang batas tetap stabil dengan gerak halus di area yang diizinkan.

Implementasikan hanya perilaku yang jelas, ringan, dan cocok dengan diagram existing. Tidak wajib membuat simulasi kompleks. Gerakan bukan bukti aktivitas penelitian nyata. Jalankan animasi hanya untuk bidang yang aktif dan berada dalam viewport.

## 5. Background berlapis yang tetap clean

Bangun suasana dengan maksimal tiga lapisan dekoratif ringan per bagian:

1. Warna dasar ink/navy/graphite.
2. Cahaya lokal yang luas dan lembut, ditempatkan sesuai komposisi.
3. Tekstur statis samar, misalnya garis kontur atau grain ringan, hanya jika menambah kedalaman.

Gunakan tekstur prosedural sederhana atau aset lokal yang tersedia. Jangan mengunduh gambar acak atau membuat background berat hanya untuk mengisi ruang.

Variasi per bagian:

- Hero: pencahayaan arah yang mendukung pahatan silver.
- Manifesto: bidang graphite sedikit lebih terang, dengan satu kontur besar di area kosong.
- Frontier: kedalaman navy; cahaya lokal mengikuti posisi diagram, bukan setiap gerak cursor di seluruh halaman.
- Metode: garis penghubung halus dengan motif koordinat statis yang jarang.
- Governance: latar netral dan tenang agar makna warna safety tidak terganggu.
- Founder: graphite hangat dengan pencahayaan yang menurun menuju quote penutup.

Sambungan antarbab harus menyatu. Hindari kotak gradien yang berhenti mendadak, starfield penuh halaman, scanline di atas teks, grain berlebihan, atau glow neon.

Jika cahaya background bergerak, gunakan transform pada lapisan dekoratif terisolasi dengan siklus sangat lambat. Jangan menganimasikan blur besar atau background gradient seluruh halaman setiap frame. Pause dan reduced motion menghentikannya.

## 6. Tombol, pilihan aktif, dan hover

Tetapkan pola konsisten untuk default, hover, pressed, focus-visible, expanded/selected, dan disabled jika memang dibutuhkan.

- CTA utama mempertahankan silver dengan aksen cyan lembut. Hover: lift maksimal 1–2 px, highlight sedikit lebih terang, panah bergeser 3 px. Press: scale sekitar 0.98 secara singkat.
- Disclosure: perubahan tonal pada baris, ikon plus/minus yang bertransisi ringan, dan indikator expanded yang jelas. Seluruh pemicu mendapat target sentuh sekitar 44 px.
- Tab frontier: garis atau penanda aktif bergerak mengikuti pilihan, tanpa mendorong layout. Label aktif tetap terbaca melalui teks/bentuk selain warna.
- Tautan: underline atau panah berubah singkat, tanpa membuat teks melompat.
- Cursor native tetap terlihat. Reticle lokal hanya jika membantu interaksi panggung visual; tidak perlu cursor dekoratif di seluruh halaman.
- Kartu atau teks statis tidak diberi pointer cursor dan efek seperti tombol.
- Jangan menggunakan loading palsu, shimmer berulang, atau delay buatan untuk aksi lokal yang instan.

## 7. Rapikan ritme dan proporsi seperlunya

Karena detail sekarang dapat ditutup, tinggi halaman akan berubah. Sesuaikan padding agar versi ringkas tidak meninggalkan banyak ruang kosong. Pertahankan ruang bernapas dan variasi komposisi yang disukai pengguna.

Periksa pemenggalan judul hero dan judul governance. Pada desktop lebar, hindari susunan kata terlalu sempit yang memanjangkan headline tanpa tujuan. Jangan memaksakan line break yang sama pada mobile.

Periksa kecerahan diagram dan pahatan. Elemen utama harus terlihat tanpa menuntut pengguna menaikkan brightness layar. Ini tidak berarti menaikkan opacity semua ornamen.

## 8. Arsitektur interaksi dan performa

- Audit komponen disclosure, tabs, dan motion existing sebelum membuat yang baru. Satukan pola perilaku yang sama tanpa meratakan variasi desain tiap section.
- Simpan state secara lokal sesuai lingkupnya. Gunakan konteks motion tingkat Lab hanya jika diperlukan untuk pause global. Hindari store baru atau backend.
- Tidak perlu persist preferensi ke storage untuk tugas ini. Jika memakai persistence existing, jaga agar initial render tidak berkedip atau hydration mismatch.
- Hormati prefers-reduced-motion sejak awal. Matikan ambient motion, parallax, reticle mengikuti pointer, dan smooth scroll. Isi serta kontrol tetap berfungsi.
- Pause global berlaku juga pada animasi CSS/SVG, bukan hanya Framer Motion atau requestAnimationFrame.
- Hentikan loop ketika document tersembunyi, komponen unmount, diagram tidak aktif, atau section keluar viewport. Observer dan event listener dibersihkan dengan benar.
- Pointer memakai motion values atau requestAnimationFrame yang efisien; jangan setState tiap pointermove.
- Scope seluruh style ke Lab. Jaga fungsi website, Blog Studio, dan integrasi lain.

## 9. Verifikasi nyata sebelum menyatakan selesai

1. Konfirmasi route, workspace, proses server, dan port preview aktual.
2. Periksa versi ringkas: seluruh identitas, manfaat, bidang riset, metode, prinsip keselamatan, status, dan kontak utama dapat dipahami tanpa membuka detail.
3. Buka-tutup setiap jenis disclosure dengan mouse, touch, dan keyboard. Uji klik cepat, isi panjang, serta menutup panel ketika fokus berada di dalamnya.
4. Uji perpindahan frontier, resize desktop/mobile, dan anchor langsung ke detail yang tertutup.
5. Uji pause global: semua ambient motion berhenti, termasuk cahaya dan background. Uji reduced motion dari awal halaman dimuat.
6. Periksa 360, 390, 768, 1024, dan 1440 px, zoom 200%, viewport pendek, overlap, overflow, focus, serta clipping konten.
7. Jalankan gate lint/typecheck/build proyek dan periksa console. Tampilkan hasil akhir dan exit code yang benar; jangan menyamakan lint dengan verifikasi visual.
8. Ambil screenshot halaman dalam keadaan ringkas dan beberapa detail terbuka. Buat rekaman 20–40 detik yang memperlihatkan hover, buka-tutup, perubahan diagram, pause, dan scroll antarbab.

Laporkan perubahan dan hasil pemeriksaan yang benar-benar dilakukan, URL lokal terkonfirmasi, serta batasan yang belum terselesaikan. Jangan mengklaim 60fps atau aksesibilitas sempurna tanpa bukti pengukuran.

Ikuti otorisasi commit/push yang sudah berlaku di sesi lokal. Tugas ini meminta implementasi serta preview yang dapat direview; tidak menambah permintaan merge atau deployment production.
