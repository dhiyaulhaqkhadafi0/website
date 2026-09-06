# HCFTL Iteration 5 — Visual dan Motion

## Arah upgrade

Pertahankan struktur dan informasi Iteration 4. Iteration 5 memperkuat karakter visual, kualitas interaksi, dan ritme halaman. Dokumen ini adalah prompt implementasi untuk agent di workspace terbaru; belum merupakan perubahan kode website.

Dasar penilaian: screenshot penuh yang diberikan pengguna berukuran 230 × 2047 px. Komposisi besar dapat dinilai, tetapi screenshot statis tidak membuktikan kualitas animasi, hover, cursor, atau transisi existing. Keluhan tentang pengalaman gerak berasal dari penggunaan langsung oleh pengguna.

Dari komposisinya, visual hero masih kecil dibanding ruang kolom kanan; banyak section memakai permukaan kartu gelap yang hampir serupa; dan jeda antarbagian belum banyak memiliki transisi komposisi. Perbaikan harus terlihat menarik saat animasi dijeda sekalipun.

## Prompt implementasi

Lanjutkan `/lab` dari **HCFTL Iteration 4** yang sudah berada di workspace lokal. Kerjakan **Iteration 5: visual identity, interaction, and motion polish** sampai dapat direview. Baca aturan proyek, status git, serta diff lokal. Pertahankan pekerjaan pengguna dan semua informasi riset yang sudah disepakati.

### 1. Bahasa visual utama

Gunakan satu motif khas: struktur orbit berlapis dengan inti stabil sebagai metafora manusia di pusat teknologi. Bentuk ini menjadi visual besar hero dan muncul secara lebih sederhana pada indikator aktif, diagram bidang, serta aksen divider. Jangan mengulang objek hero utuh di setiap section.

Palet tetap charcoal/navy, off-white, silver, cyan lembut. Tambahkan perbedaan tonal yang jelas antara permukaan depan dan background. Warna keselamatan tetap mengikuti makna GREEN/AMBER/RED dari data.

Gunakan serif editorial untuk judul, sans-serif untuk isi, dan monospace terbatas untuk label. Pertahankan font existing. Kurangi label dekoratif yang terlalu kecil dan sulit dibaca.

### 2. Hero dengan visual yang lebih kuat

- Pertahankan H1, deskripsi, CTA, dan status yang sudah disetujui. Rapikan pemenggalan judul menurut lebar layar, tanpa memaksa line break yang menyebabkan kata terjepit.
- Besarkan objek utama sehingga mengisi sekitar 65–80% lebar area visual desktop. Sisakan ruang untuk orbit dan glow. Ini target komposisi awal; verifikasi di preview, bukan lewat angka saja.
- Bangun objek berbentuk struktur orbital berlapis atau permukaan wireframe melengkung dengan kedalaman depan-belakang. Pusatnya tenang; lapisan luar bergeser perlahan. Tingkatkan pencahayaan dan siluet agar terbaca bahkan dalam screenshot kecil.
- Gunakan SVG, CSS, atau canvas yang ringan sesuai kebutuhan bentuk. Utamakan stack yang sudah tersedia. Jangan menambah dependensi WebGL atau animasi hanya untuk ornamen.
- Tempatkan objek dalam container khusus. Desktop memberi ruang terpisah dari teks; mobile menumpuk visual setelah CTA, dengan tinggi awal sekitar 260–320 px. Tidak ada overlap dengan headline.
- Satu putaran orbit boleh sekitar 35–60 detik. Tambahkan perubahan cahaya halus dengan siklus 7–10 detik bila dibutuhkan. Maksimal dua gerakan ambient yang terlihat bersamaan pada hero.
- Pointer desktop memberi sedikit perubahan sudut/depth atau parallax maksimal sekitar 6–10 px. Dampaknya lokal pada visual. Posisi teks tetap stabil.
- Jangan memasukkan label ONLINE, traffic, telemetry, nilai throughput, atau angka riset palsu. Objek adalah metafora visual.

### 3. Tombol yang punya karakter

Gunakan sistem tombol yang konsisten dengan bentuk instrumen lab:

- CTA primer: rounded rectangle sekitar 10–12 px, tinggi 46–50 px, warna silver-cyan lembut, inset highlight tipis, padding horizontal yang cukup, dan ikon panah di kanan.
- Hindari tombol menjadi panjang hanya untuk mengisi kolom. Pada mobile, full-width diperbolehkan jika memang membantu komposisi.
- Hover: latar sedikit lebih terang, tombol naik sekitar 1–2 px, panah bergeser 3 px, dan satu sapuan kilau lembut ketika pointer masuk. Jangan menjalankan shimmer terus-menerus.
- Press: scale sekitar 0.98 selama 100–140 ms, tanpa mengubah ukuran layout.
- CTA sekunder: tautan atau ghost button dengan underline/border yang berubah secara halus. Bobotnya lebih rendah daripada CTA primer.
- Focus keyboard harus terlihat jelas dan tetap mendapat penekanan yang setara. Ikon hanya pelengkap; label tombol tetap tersedia.
- Jangan menggerakkan seluruh hit area tombol mengikuti cursor. Area klik harus stabil dan mudah ditargetkan.

### 4. Cursor dan hover yang kontekstual

- Pertahankan cursor sistem agar familiar dan mudah dilihat.
- Pada container visual hero saja, tambahkan lingkaran atau reticle tipis yang mengikuti pointer desktop. Gunakan `pointer-events: none`; efek tidak boleh menghalangi interaksi.
- Bila visual benar-benar dapat dieksplorasi, boleh ada label aksi kontekstual yang sesuai fungsi. Jangan menampilkan “drag” atau “explore” bila aksi tersebut tidak tersedia.
- Hover pada baris frontier: perubahan tonal, garis aktif, dan ikon panah kecil. Jangan memberikan hover yang seolah dapat diklik pada kartu informasi statis.
- Efek cursor lokal dimatikan untuk touch, reduced motion, dan pointer kasar. Informasi penting selalu tersedia tanpa hover.

### 5. Motion sebagai respons terhadap aksi

Gunakan nilai berikut sebagai token awal. Sesuaikan dengan motion utilities existing:

| Kejadian | Durasi awal | Perilaku |
| --- | --- | --- |
| Hover tombol/link | 160–220 ms | Warna, border, panah; gerakan kecil |
| Press tombol | 100–140 ms | Scale ringan |
| Pergantian bidang riset | 240–320 ms | Crossfade panel dan visual; offset maksimal 6 px |
| Disclosure | 220–300 ms | Buka/tutup mengikuti tinggi konten alami |
| Intro visual hero | 700–1000 ms | Visual hadir perlahan; teks utama sudah terbaca |
| Reveal section | 400–550 ms | Opacity dan offset 12–18 px, satu kali |
| Orbit ambient | 35–60 detik | Gerak kontinu sangat lambat |

Gunakan easing yang lembut dan konsisten, misalnya cubic-bezier(0.22, 1, 0.36, 1) pada transisi pendek. Jangan membuat semua elemen memantul.

Tidak ada typewriter pada headline, preloader buatan, penundaan CTA, scroll hijacking, atau animasi keluar-masuk setiap kali pengguna menggulir sedikit. Jika JavaScript gagal, konten pokok tetap tersedia.

### 6. Variasi komposisi untuk tujuh bab existing

**Hero:** satu objek visual besar dengan kedalaman yang jelas dan gerakan lambat.

**Manifesto:** pernyataan editorial tetap lapang. Tonjolkan satu frasa penting secara statis; saat pertama masuk viewport, boleh ada satu garis tipis yang muncul. Hindari mewarnai ulang setiap kata mengikuti scroll.

**Bidang riset:** pertahankan tab desktop dan accordion mobile. Saat bidang berubah, panel penjelasan dan diagram berubah bersama. Perlihatkan perbedaan bentuk yang bermakna: persepsi–aksi untuk physical intelligence, jaringan agen untuk collective intelligence, struktur redundan untuk resilience, pasangan model untuk digital twins, dan batas di sekitar inti untuk safe autonomy. Diagram harus menjelaskan konsep; jangan menyiratkan hasil pengujian.

**Metode:** sembilan tahap R01–R09 tetap dipertahankan urutan dan maknanya. Kurangi kesan sembilan kartu identik dengan grouping visual berdasarkan isi nyata, nomor tahap yang konsisten, dan konektor yang jelas. Bila grouping tidak dapat diturunkan dari isi, pertahankan daftar bernomor dengan divider sederhana. Satu highlight boleh berpindah saat tahap dipilih. Jangan mengaktifkan autoplay langkah-langkah seolah eksperimen sedang berjalan.

**Evidence dan governance:** utamakan keterbacaan. Gunakan header disclosure yang jelas dan animasi buka yang halus. Pertahankan preferensi buka/tutup pengguna selama sesi. Hindari glow bergerak pada panel peringatan, red warning yang berkedip, atau kontrol interaktif berlebihan.

**Perkembangan:** gunakan satu milestone utama sebagai jangkar visual. Riwayat, proposal, dan empty state mendapat bobot lebih ringan. Proposal tetap dilabeli sebagai proposal; jangan mengubahnya menjadi eksperimen aktif untuk membuat halaman tampak hidup.

**Founder dan penutup:** beri komposisi editorial yang berbeda dari kartu penelitian. Identitas founder cukup kuat melalui nama, peran, dan narasi existing. Gunakan foto asli hanya bila tersedia dan telah disetujui; tidak perlu membuat wajah sintetis. Ambient glow penutup boleh sangat halus tanpa menyaingi hero.

### 7. Background dan transisi antarbab

- Buat beberapa bidang cahaya lokal dengan karakter berbeda namun satu palet: hero lebih terang, metode sedikit navy, governance lebih netral, founder lebih tenang.
- Gradien harus melebur antarseksi. Jangan menghasilkan pita warna keras atau rectangle glow yang berhenti tiba-tiba.
- Kurangi pengulangan ruang kosong dengan tinggi sama. Jarak antarbab ditentukan pergantian topik, bukan spacer tetap raksasa.
- Border kartu, garis divider, dan tekstur tidak semuanya memiliki kontras yang sama. Isi mendapat kontras tertinggi, struktur lebih rendah, ornamen paling rendah.
- Tambahkan animasi hanya setelah versi diam sudah memiliki depth, proporsi, dan hierarchy yang kuat.

### 8. Batas performa dan aksesibilitas

- Batasi animation loop pada visual yang sedang terlihat. Hentikan saat document tersembunyi, section keluar viewport, atau komponen unmount.
- Pointer update gunakan requestAnimationFrame atau motion values, bukan React setState setiap pointermove.
- Jika memakai canvas, batasi device pixel ratio sekitar 1.5–2 dan turunkan detail pada perangkat kecil bila perlu. Hindari membangun ulang titik geometri setiap frame jika bisa dipra-komputasi.
- Animasikan transform dan opacity. Hindari blur besar yang berubah setiap frame dan transform seluruh halaman.
- Hormati reduced motion dari render awal. Matikan orbit, parallax, reticle, smooth scrolling, dan reveal bergerak; pergantian informasi tetap berfungsi secara langsung.
- Bila visual bergerak kontinu, sediakan kontrol jeda yang mudah ditemukan. Pilihan pengguna harus benar-benar menghentikan gerak ambient.
- Disclosure, tabs, navigasi, dan CTA dapat digunakan dengan keyboard, touch, dan mouse. Focus ring tidak boleh tersembunyi oleh clipping.
- Jangan mengurangi kontras teks atau menyembunyikan isi untuk mengejar efek sinematik.

### 9. Urutan kerja dan bukti selesai

1. Audit komponen dan gerakan existing. Catat screenshot baseline hero serta halaman penuh.
2. Implementasikan hero, tombol, dan efek pointer terlebih dahulu; verifikasi komposisi desktop/mobile.
3. Terapkan transisi bidang riset, disclosure, dan perubahan background. Rapikan ritme kartu tanpa mengganti struktur konten.
4. Periksa 360, 390, 768, 1024, dan 1440 px, termasuk viewport pendek, zoom 200%, keyboard, touch, serta reduced motion.
5. Rekam video pendek yang menunjukkan: hero idle, hover CTA, respons pointer, pergantian frontier, buka disclosure, dan satu scroll antarbagian. Screenshot saja tidak membuktikan kualitas motion.
6. Periksa scrollWidth serta bounding boxes konten penting untuk mendeteksi overlap. Periksa visual dalam keadaan animasi dijeda.
7. Jalankan gate lint/typecheck/build yang berlaku dan cek console. Laporkan hasil yang benar-benar dijalankan serta keterbatasan perangkat uji; jangan mengklaim angka frame rate tanpa pengukuran.

Laporan akhir memuat komponen yang diubah, perbedaan visual yang terlihat, rekaman interaksi, screenshot desktop/mobile, hasil validasi, dan masalah tersisa. Kerjakan sampai reviewable, bukan hanya implementation plan. Ikuti otorisasi commit/push yang sudah berlaku; jangan menganggap prompt desain ini sebagai permintaan merge atau deployment production.
