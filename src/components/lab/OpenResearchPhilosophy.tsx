import { Globe, Code2, LockKeyhole } from "lucide-react";
import { Lora } from "next/font/google";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });

const models = [
  {
    num: "01",
    icon: Globe,
    title: "Open Research",
    desc: "Transparansi penuh pada metode, arsitektur eksperimental, observasi mentah, mode kegagalan, dan evaluasi.",
    detail: "Semua makalah teoretis, temuan negatif, dan pembuktian matematis dipublikasikan secara bebas.",
  },
  {
    num: "02",
    icon: Code2,
    title: "Open Source",
    desc: "Implementasi perangkat lunak dan peralatan dirilis di bawah lisensi sumber terbuka yang sah dan diakui.",
    detail: "Kode sumber didistribusikan dengan bersih tanpa batasan yang menipu atau label pseudo-terbuka.",
  },
  {
    num: "03",
    icon: LockKeyhole,
    title: "Controlled Release",
    desc: "Bobot model berkemampuan tinggi, pemicu aktuasi fisik, atau dataset penggunaan ganda diamankan di bawah akses terbatas.",
    detail: "Ditahan atau dirilis dalam batasan bertahap ketika akses tak terbatas dapat menimbulkan risiko fisik material.",
  },
];

export function OpenResearchPhilosophy() {
  return (
    <section className="py-24 md:py-40 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 pb-12 border-b border-white/[0.04] gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6 font-mono text-[10px] tracking-[0.25em] text-[#7DD3FC]/60 uppercase">
              <span className="w-6 h-px bg-[#7DD3FC]/30" />
              <span>HCFTL // Section 10 — Open Research Philosophy</span>
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-medium text-[#F4F7FA] tracking-tight leading-[1.05]">
              Terbuka saat<br />Bertanggung Jawab
            </h2>
          </div>
          <p className="max-w-sm text-base md:text-lg text-[#8899A6] font-light leading-relaxed">
            Menyeimbangkan kecepatan ilmiah maksimum dengan mitigasi risiko bio/siber-fisik yang ketat.
          </p>
        </div>

        {/* 3 Large Editorial Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {models.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={m.num}
                className={`flex flex-col py-12 px-8 md:px-10 lg:px-12 ${idx !== 0 ? "md:border-l border-white/[0.04]" : ""} ${idx !== models.length - 1 ? "border-b md:border-b-0 border-white/[0.04]" : ""}`}
              >
                {/* Large number + icon row */}
                <div className="flex items-end justify-between mb-10">
                  <span
                    className="font-mono font-bold text-[#7DD3FC]/20 leading-none"
                    style={{ fontSize: "clamp(56px, 7vw, 96px)" }}
                  >
                    {m.num}
                  </span>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.03] border border-white/[0.06] mb-2">
                    <Icon className="w-4 h-4 text-[#7DD3FC]/60" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-medium text-[#F4F7FA] tracking-tight mb-6 leading-tight">
                  {m.title}
                </h3>

                {/* Description */}
                <p className="text-base md:text-lg text-[#A2ACB9] font-light leading-relaxed mb-8 flex-1">
                  {m.desc}
                </p>

                {/* Detail */}
                <div className="pt-6 border-t border-white/[0.04]">
                  <p className="text-sm text-[#66717F] font-light leading-relaxed">
                    {m.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Central doctrine quote */}
        <div className="mt-24 py-20 border-y border-white/[0.04] text-center max-w-4xl mx-auto">
          <blockquote
            className={`${lora.className} text-[28px] sm:text-[36px] md:text-[44px] font-medium text-[#F4F7FA] leading-tight mb-8`}
          >
            &ldquo;Transparansi tidak mengharuskan perilisan yang tidak bertanggung jawab.&rdquo;
          </blockquote>
          <p className="text-[10px] font-mono text-[#66717F] uppercase tracking-[0.3em]">
            HCFTL Ethical Governance Directive // Principle 10
          </p>
        </div>

      </div>
    </section>
  );
}
