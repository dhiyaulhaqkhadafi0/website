import { Lora } from "next/font/google";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });

const archiveItems = [
  {
    index: "01",
    title: "Research Notes",
    count: "000",
    status: "Belum ada catatan riset publik.",
    detail:
      "Memo kerja awal, eksplorasi teoretis, dan draf matematis akan diarsipkan di sini seiring matangnya piagam riset.",
  },
  {
    index: "02",
    title: "Publications",
    count: "000",
    status: "Belum ada publikasi sejawat.",
    detail:
      "Manuskrip formal membutuhkan minimal verifikasi Level 04 Reproducible Result sebelum diajukan ke tinjauan sejawat eksternal.",
  },
  {
    index: "03",
    title: "Open Research Releases",
    count: "000",
    status: "Belum ada rilis terbuka.",
    detail:
      "Paket reproduksi yang dapat dieksekusi, dataset telemetri, dan model sumber terbuka akan dirilis di bawah lisensi yang permisif dan diaudit.",
  },
  {
    index: "04",
    title: "Failure Records",
    count: "000",
    status: "Belum ada catatan kegagalan eksperimen.",
    detail:
      "HCFTL mewajibkan publikasi hipotesis yang terbukti salah, temuan nol, dan anomali untuk mencegah jalan buntu yang berulang di seluruh bidang.",
  },
];

export function ResearchOutputs() {
  return (
    <section id="research" className="py-24 md:py-40 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 pb-12 border-b border-white/[0.04] gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6 font-mono text-[10px] tracking-[0.25em] text-[#7DD3FC]/60 uppercase">
              <span className="w-6 h-px bg-[#7DD3FC]/30" />
              <span>HCFTL // Section 09 — Research Archive</span>
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-medium text-[#F4F7FA] tracking-tight leading-[1.05]">
              Research Archive
            </h2>
          </div>
          <p className="max-w-sm text-base md:text-lg text-[#8899A6] font-light leading-relaxed">
            Catatan publik dari seluruh karya ilmiah, tolok ukur, dataset, dan anomali.
          </p>
        </div>

        {/* Editorial Ledger — journal archive feel */}
        <div className="border-t border-white/[0.04]">
          {archiveItems.map((item) => (
            <div
              key={item.index}
              className="group grid grid-cols-1 md:grid-cols-[100px_1fr_100px] gap-6 md:gap-16 items-start py-16 md:py-20 border-b border-white/[0.04] hover:bg-white/[0.008] transition-colors px-2 -mx-2 rounded-2xl"
            >
              {/* Large ghost index number */}
              <div className="flex items-start">
                <span
                  className="font-mono font-bold text-[#7DD3FC]/20 group-hover:text-[#7DD3FC]/30 transition-colors leading-none"
                  style={{ fontSize: "clamp(48px, 5vw, 72px)" }}
                >
                  {item.index}
                </span>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-2xl md:text-3xl font-medium text-[#F4F7FA] tracking-tight mb-4 group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="text-lg md:text-xl text-[#8899A6] font-light mb-3">
                  {item.status}
                </p>
                <p className="text-base text-[#66717F] font-light leading-relaxed max-w-2xl">
                  {item.detail}
                </p>
              </div>

              {/* Count */}
              <div className="text-right">
                <span
                  className="font-mono font-bold text-white/10 group-hover:text-white/15 transition-colors"
                  style={{ fontSize: "clamp(36px, 4vw, 64px)" }}
                >
                  {item.count}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Doctrine statement */}
        <div className="mt-20 md:mt-24 flex flex-col md:flex-row items-start md:items-center gap-12 md:gap-16 pt-12 border-t border-white/[0.04]">
          <blockquote
            className={`${lora.className} text-[28px] sm:text-[36px] md:text-[42px] font-medium text-[#F4F7FA] leading-tight flex-1`}
          >
            &ldquo;Hasil negatif tetap merupakan bagian dari proses penelitian.&rdquo;
          </blockquote>
          <div className="shrink-0 text-[10px] font-mono text-[#66717F] uppercase tracking-widest border border-white/[0.04] rounded-full px-4 py-2">
            HCFTL DOCTRINE // UNBIASED RECORD
          </div>
        </div>

      </div>
    </section>
  );
}
