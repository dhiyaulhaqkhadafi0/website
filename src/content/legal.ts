export const LEGAL_UPDATED = "15 Oktober 2026";
export const SUPPORT_EMAIL = "daffadhiyaulhaqkhadafi@gmail.com";
export const LEGAL_LINKS = [
  { label: "Tentang", href: "/about" },
  { label: "Kebijakan Privasi", href: "/privacy" },
  { label: "Syarat & Ketentuan", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
  { label: "Changelog", href: "/changelog" },
] as const;
export type LegalSection = { id: string; title: string; paragraphs: string[] };
export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "pengelola",
    title: "Siapa yang mengelola situs ini?",
    paragraphs: [
      "khadafidaffa.com adalah situs Daffa Dhiyaulhaq Khadafi. Situs ini menghubungkan karya, produk digital, artikel, sumber daya belajar, dan perjalanan freelance. Pertanyaan tentang data pribadi dapat dikirim ke email bantuan yang tercantum di bawah.",
    ],
  },
  {
    id: "data",
    title: "Data yang digunakan",
    paragraphs: [
      "Saat membuat akun, Anda memberikan email, password kepada layanan autentikasi Supabase, serta nama jika diisi. Situs menggunakan identitas akun untuk membuka profil, pembelian, dan produk yang menjadi hak Anda. Password tidak ditampilkan di dashboard pengelola.",
      "Pendaftaran newsletter menyimpan nama, email, sumber pendaftaran, waktu dan versi persetujuan, status langganan, serta parameter sumber/kampanye bila tersedia. Pendaftaran newsletter tidak mewajibkan akun member.",
      "Jika Anda menggunakan alur pembelian yang tersedia, sistem menyimpan informasi pesanan, status pembayaran, dan akses produk. Aktivitas keamanan dan log teknis dapat mencakup waktu permintaan, informasi browser, dan alamat jaringan yang diproses oleh penyedia infrastruktur.",
    ],
  },
  {
    id: "tujuan",
    title: "Untuk apa data tersebut?",
    paragraphs: [
      "Data akun digunakan untuk autentikasi dan akses milik pengguna. Data pesanan digunakan untuk memeriksa transaksi dan hak akses produk. Data newsletter digunakan untuk pembaruan sesuai persetujuan Anda. Identitas jaringan diproses menjadi hash untuk membatasi spam pada form.",
      "Newsletter dari beranda dan Freelance Field Notes memiliki catatan persetujuan yang berbeda. Pendaftaran duplikat tidak mengubah persetujuan lama atau otomatis mengaktifkan kembali langganan yang dihentikan.",
    ],
  },
  {
    id: "referral",
    title: "Tautan referral dan situs lain",
    paragraphs: [
      "Sebagian direktori berisi tautan referral dengan penjelasan afiliasi. Saat Anda menekan tautan yang dilacak, situs dapat mencatat event navigasi, waktu, sumber, dan kampanye untuk mengukur penggunaan tautan. Klik bukan bukti pendaftaran, pendapatan, atau komisi.",
      "Setelah berpindah ke platform lain, pengelolaan data mengikuti kebijakan platform tersebut. Situs ini tidak menerima password atau data formulir lamaran yang Anda isi langsung pada platform tujuan.",
    ],
  },
  {
    id: "penyedia",
    title: "Penyedia layanan dan penyimpanan browser",
    paragraphs: [
      "Supabase digunakan untuk autentikasi dan database; Cloudflare digunakan untuk penyajian situs dan infrastruktur. Data diproses melalui layanan tersebut sesuai fungsi yang Anda gunakan. Lokasi pemrosesan dapat berbeda dari lokasi Anda.",
        "Sesi akun dan preferensi tampilan memakai cookies atau penyimpanan browser. Google Translate merupakan fitur opsional yang dimuat setelah Anda mengaktifkannya. Saat aktif, penyedia terjemahan menerima permintaan dari browser dan dapat memproses konten halaman. Rincian dan kontrol tersedia pada halaman Cookies.",
        "Google Analytics 4 mengukur penggunaan halaman publik setelah izin analytics diberikan, terpisah dari izin terjemahan. Pengukuran manual mengecualikan Studio, autentikasi, akun, dan checkout, serta memakai jalur halaman tanpa query atau fragmen. Browser berkomunikasi dengan Google saat analytics aktif. Anda dapat mencabut izin melalui halaman Cookies.",
    ],
  },
  {
    id: "akses",
    title: "Akses, penyimpanan, dan penghapusan",
    paragraphs: [
      "Member hanya dapat membuka data dan produk miliknya. Data subscriber serta modul pengelolaan dibatasi untuk pengelola yang diizinkan. Pembatasan diterapkan pada server dan database.",
      "Berhenti berlangganan menonaktifkan langganan, bukan otomatis menghapus catatan persetujuan. Penghapusan akun atau catatan lain juga merupakan permintaan terpisah. Untuk meminta akses, koreksi, atau penghapusan data, hubungi email bantuan dengan identitas akun yang relevan. Jangan mengirim password, token sesi, atau detail kartu pembayaran.",
      "Tidak ada masa penyimpanan tunggal untuk seluruh jenis data. Kebutuhan layanan, catatan persetujuan, keamanan, dan kewajiban yang berlaku menjadi pertimbangan penanganan permintaan penghapusan. Situs tidak menjanjikan penghapusan otomatis pada tanggal tertentu.",
    ],
  },
  {
    id: "pilihan",
    title: "Pilihan Anda",
    paragraphs: [
      "Newsletter dapat dihentikan melalui tautan kelola pribadi setelah pendaftaran atau tautan pada email newsletter saat pengiriman tersedia. Membuka halaman unsubscribe saja tidak mengubah status; Anda perlu mengonfirmasi tindakannya.",
      "Anda dapat mengubah preferensi terjemahan di halaman Cookies, menghapus penyimpanan situs melalui browser, atau keluar dari akun. Perubahan penting pada penjelasan ini dicatat dengan tanggal pembaruan.",
    ],
  },
];
export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "cakupan",
    title: "Menggunakan ekosistem Khadafi",
    paragraphs: [
      "Syarat ini menjelaskan penggunaan khadafidaffa.com, termasuk artikel, sumber daya, akun, newsletter, dan fitur produk yang tersedia. Gunakan situs secara wajar dan sesuai hukum yang berlaku. Jika membutuhkan penjelasan sebelum memakai suatu fitur, hubungi email bantuan.",
    ],
  },
  {
    id: "akun",
    title: "Akun dan keamanan",
    paragraphs: [
      "Gunakan email yang Anda kuasai dan jaga kerahasiaan password serta sesi akun. Pendaftaran publik menyediakan akses member. Memilih Founder / Pengelola di halaman masuk tidak memberikan hak pengelolaan; hak tersebut diperiksa dari akun yang telah diizinkan.",
      "Jangan mencoba mengakses data pengguna lain, membagikan token sesi, melewati pembatasan akses, mengganggu layanan, atau mengirim spam melalui form situs.",
    ],
  },
  {
    id: "konten",
    title: "Artikel, panduan, dan karya",
    paragraphs: [
      "Artikel dan panduan membantu proses belajar dan eksplorasi. Informasi platform, peluang kerja, harga, dan fitur layanan pihak ketiga dapat berubah; periksa sumber resminya sebelum mengambil keputusan.",
      "Hak atas karya tetap mengikuti pemilik dan lisensi masing-masing. Ikuti ketentuan yang tercantum pada produk atau sumber daya, termasuk bila suatu template mengizinkan penggunaan dan penyesuaian. Tautan sumber dan atribusi tidak memindahkan kepemilikan karya pihak lain.",
    ],
  },
  {
    id: "produk",
    title: "Produk dan pembelian",
    paragraphs: [
      "Harga, isi, format, dan ketersediaan produk ditampilkan pada halaman produk bila produk sudah diterbitkan. Proyek dalam pengembangan tidak otomatis berarti produk tersebut sudah dapat dibeli. Jangan melakukan pembayaran di luar alur yang ditampilkan dan diverifikasi situs.",
      "Akses produk ditentukan oleh status transaksi dan hak akses pada server. Halaman selesai pembayaran saja tidak membuktikan pembayaran berhasil. Jika ada masalah transaksi, unduhan, atau permintaan terkait pembelian, kirim nomor pesanan ke email bantuan. Situs tidak menetapkan janji pengembalian dana, waktu penyelesaian, atau bonus yang tidak dinyatakan pada penawaran terkait.",
    ],
  },
  {
    id: "peluang",
    title: "Peluang freelance dan afiliasi",
    paragraphs: [
      "Direktori platform dan lowongan merupakan informasi untuk dijelajahi, bukan jaminan diterima bekerja, memperoleh proyek, atau mendapatkan penghasilan tertentu. Proses seleksi, kontrak, dan pembayaran pada platform lain mengikuti ketentuan platform tersebut.",
      "Tautan afiliasi diberi penjelasan pada konteks yang relevan. Pengelola dapat memperoleh manfaat referral sesuai program pihak ketiga; klik atau kunjungan Anda tidak dengan sendirinya berarti ada komisi atau konversi.",
    ],
  },
  {
    id: "newsletter",
    title: "Newsletter dan bantuan",
    paragraphs: [
      "Newsletter bersifat opsional dan membutuhkan persetujuan. Subscriber tidak harus membuat akun. Anda dapat berhenti melalui tautan kelola langganan; frekuensi, bonus, atau email sambutan tidak dijanjikan kecuali dinyatakan secara jelas.",
      "Email bantuan digunakan untuk pertanyaan akun, data, produk, dan layanan situs. Jangan menyertakan password, token autentikasi, atau informasi pembayaran sensitif dalam pesan.",
    ],
  },
  {
    id: "pembaruan",
    title: "Ketersediaan dan pembaruan",
    paragraphs: [
      "Situs dan fitur dapat diperbaiki atau mengalami gangguan. Status proyek dan catatan perubahan tersedia melalui beranda serta Changelog. Penjelasan legal diperbarui sesuai perubahan fungsi, dengan tanggal pembaruan yang terlihat.",
      "Penjelasan ini tidak dimaksudkan untuk menghapus hak pengguna atau kewajiban yang berlaku menurut hukum. Hal yang belum dijelaskan dapat ditanyakan melalui email bantuan sebelum menggunakan fitur terkait.",
    ],
  },
];
