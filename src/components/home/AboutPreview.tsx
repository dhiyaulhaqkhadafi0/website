import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Award } from "lucide-react";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

const IbmIcon = () => (
  <span className="text-[11px] font-black tracking-tighter font-mono text-blue-400">
    IBM
  </span>
);

export function AboutPreview() {
  const credentials = [
    {
      title: "Google AI Professional",
      issuer: "Google",
      category: "Artificial Intelligence",
      icon: <GoogleIcon />,
    },
    {
      title: "Cybersecurity & System Analysis",
      issuer: "IBM",
      category: "Infrastructure & Security",
      icon: <IbmIcon />,
    },
    {
      title: "End-to-End Product Management",
      issuer: "MySkill Professional",
      category: "Product Leadership",
      icon: <Award className="w-4 h-4 text-emerald-400" />,
    },
    {
      title: "Business & Systems Analysis",
      issuer: "Industry Certified",
      category: "System Design",
      icon: <ShieldCheck className="w-4 h-4 text-teal-400" />,
    },
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 bg-[#07080d] border-t border-white/5">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Photo / Signature Visual */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-indigo-500/10 to-transparent rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative w-64 h-80 sm:w-72 sm:h-92 rounded-3xl overflow-hidden border border-white/10 bg-[#0e0f17] shadow-2xl">
                <Image
                  src="/assets/my-profile.jpg"
                  alt="Daffa Dhiyaulhaq Khadafi"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Bio & Core Philosophy */}
          <div className="lg:col-span-8 flex flex-col items-start">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold mb-2 block">
              Builder Identity
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-6">
              I&apos;m Khadafi. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-300">
                I build things on the internet.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal mb-6">
              Saya adalah seorang <strong className="text-white">AI-Assisted Product Engineer</strong> dan builder independen. Bekerja di persimpangan antara intuisi produk, context engineering untuk coding agents, dan arsitektur bisnis internet mandiri.
            </p>

            <p className="text-sm text-slate-400 leading-relaxed font-normal mb-8">
              Fokus saya adalah mengubah ruang masalah yang ambigu menjadi software yang cepat, teruji, dan defensible. Bukan sekadar mengejar tren AI, melainkan merakit sistem nyata yang memecahkan masalah pengguna.
            </p>

            <Link
              href="/about"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black font-semibold text-xs sm:text-sm border border-white/15 transition-all flex items-center gap-2 group active:scale-95"
            >
              <span>More About Me</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Compressed Credentials & Certifications Subsection with PRESERVED ANCHOR */}
        <div id="certifications" className="mt-20 pt-12 border-t border-white/10 scroll-mt-28">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Foundations & Certifications</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Google · IBM · Professional Programs
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {credentials.map((cred) => (
              <div
                key={cred.title}
                className="p-4 rounded-2xl bg-[#0b0c13] border border-white/5 hover:border-white/15 transition-colors flex items-center gap-3.5"
              >
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  {cred.icon || <Award className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[13px] font-bold text-white truncate">
                    {cred.title}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 truncate">
                    {cred.issuer} · {cred.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
