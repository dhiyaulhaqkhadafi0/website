import { SAFETY_CLASSES } from "@/lib/hcftl";

export function LabSafetyFramework() {
  const atmospheres: Record<string, { glow: string; ring: string; textAccent: string }> = {
    GREEN: {
      glow: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(34,197,94,0.06) 0%, transparent 70%)",
      ring: "rgba(34,197,94,0.15)",
      textAccent: "#4ADE80",
    },
    AMBER: {
      glow: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(245,158,11,0.07) 0%, transparent 70%)",
      ring: "rgba(245,158,11,0.15)",
      textAccent: "#FCD34D",
    },
    RED: {
      glow: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(239,68,68,0.06) 0%, transparent 70%)",
      ring: "rgba(239,68,68,0.12)",
      textAccent: "#F87171",
    },
  };

  return (
    <section id="safety" className="py-24 md:py-40 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 pb-12 border-b border-white/[0.04] gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6 font-mono text-[10px] tracking-[0.25em] text-[#7DD3FC]/60 uppercase">
              <span className="w-6 h-px bg-[#7DD3FC]/30" />
              <span>HCFTL // Section 07 — Safety Framework</span>
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-medium text-[#F4F7FA] tracking-tight leading-[1.05]">
              Kemampuan Harus<br />Tetap Dapat Dikendalikan
            </h2>
          </div>
          <p className="max-w-sm text-base md:text-lg text-[#8899A6] font-light leading-relaxed">
            Klasifikasi risiko tiga tingkat wajib sebelum desain eksperimental dimulai.
          </p>
        </div>

        {/* Three Atmospheric Zones */}
        <div className="flex flex-col gap-4 md:gap-6">
          {SAFETY_CLASSES.map((sc) => {
            const atm = atmospheres[sc.tier];
            return (
              <div
                key={sc.tier}
                className="relative w-full rounded-3xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, rgba(5,8,14,0.8) 0%, rgba(8,12,20,0.7) 100%)`,
                  border: `1px solid ${atm.ring}`,
                }}
              >
                {/* Atmospheric glow — fills the region */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: atm.glow }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 p-8 md:p-12 lg:p-16">

                  {/* Left: Tier ID + Title */}
                  <div className="md:w-72 shrink-0">
                    <div className="text-[10px] font-mono tracking-[0.25em] uppercase mb-3" style={{ color: atm.textAccent }}>
                      Class // {sc.tier}
                    </div>
                    <h3
                      className="text-2xl sm:text-3xl md:text-4xl font-medium text-[#F4F7FA] tracking-tight leading-tight"
                    >
                      {sc.title}
                    </h3>
                  </div>

                  {/* Center: Description */}
                  <div className="flex-1">
                    <p className="text-base md:text-lg text-[#C2CDD8] font-light leading-relaxed mb-6">
                      {sc.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sc.examples.map((ex) => (
                        <span
                          key={ex}
                          className="px-3 py-1.5 text-[11px] font-mono text-[#8899A6] rounded-full bg-white/[0.03]"
                          style={{ border: `1px solid ${atm.ring}` }}
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Posture */}
                  <div className="shrink-0">
                    <span
                      className="inline-flex items-center px-5 py-2 rounded-full text-[11px] font-mono tracking-widest uppercase"
                      style={{
                        color: atm.textAccent,
                        background: `${sc.colorHex}10`,
                        border: `1px solid ${atm.ring}`,
                      }}
                    >
                      {sc.posture}
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
