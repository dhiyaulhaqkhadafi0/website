"use client";
import { PUBLIC_FOOTER_GROUPS } from "@/content/public-navigation";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerGroups = PUBLIC_FOOTER_GROUPS;

  return (
    <footer className="w-full border-t border-white/10 bg-[#10100e] text-[#ECEDE7] mt-auto relative z-20 overflow-hidden font-sans">
      {/* Ambient Lighting Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-emerald-500/[0.03] blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl py-14 sm:py-16 relative z-10">
        {/* Top Section: Brand Identity + 4 Column Hierarchy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-14">
          {/* Identity Column */}
          <div className="lg:col-span-4 pr-0 lg:pr-6">
            <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
              <Image
                src="/assets/logo%20AAPE.png"
                alt="Khadafi Logo"
                width={66}
                height={44}
                className="w-auto h-11 object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col border-l border-white/10 pl-3">
                <span className="font-extrabold text-sm tracking-widest text-white group-hover:text-emerald-400 transition-colors uppercase">
                  KHADAFI
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                  Business OS v1
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
              Personal Business Headquarters & sistem kerja <span className="text-white font-medium">AI-Assisted Product Engineer</span>. Merancang produk digital, automasi sistem, dan inisiatif internet mandiri.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5">
              <a
                href="https://www.linkedin.com/in/khdfii9/"
                target="_blank"
                rel="noreferrer"
                aria-label="Profil LinkedIn Khadafi (buka tab baru)"
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-400/40 text-slate-400 hover:text-white transition-all hover:scale-105 active:scale-95"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@khdfii9"
                target="_blank"
                rel="noreferrer"
                aria-label="Kanal YouTube Khadafi (buka tab baru)"
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-400/40 text-slate-400 hover:text-white transition-all hover:scale-105 active:scale-95"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/dhiyaulhaqkhadafi0"
                target="_blank"
                rel="noreferrer"
                aria-label="Profil GitHub Khadafi (buka tab baru)"
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-400/40 text-slate-400 hover:text-white transition-all hover:scale-105 active:scale-95"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="mailto:daffadhiyaulhaqkhadafi@gmail.com"
                aria-label="Kirim Email ke Khadafi"
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-400/40 text-slate-400 hover:text-white transition-all hover:scale-105 active:scale-95"
              >
                <MailIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 4-Column IA: Build, Learn, Ecosystem, Khadafi */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {footerGroups.map((group) => (
              <div key={group.title} className="flex flex-col">
                <h3 className="text-white font-mono text-[11px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2 text-emerald-400/80">
                  <span className="w-3 h-px bg-emerald-400/40" />
                  {group.title}
                </h3>
                <ul className="space-y-3" role="list">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group/link block text-slate-400 hover:text-white transition-colors"
                      >
                        <span className="text-[13.5px] font-medium flex items-center gap-1 group-hover/link:text-emerald-300">
                          {link.label}
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </span>
                        <span className="text-[11px] text-slate-500 block leading-tight mt-0.5 line-clamp-1">
                          {link.desc}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Utility Bar: Legal, Status & Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <p>
              © {currentYear} Daffa Dhiyaulhaq Khadafi. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="hover:text-slate-300 transition-colors underline underline-offset-4 decoration-white/10"
              >
                Kebijakan Privasi
              </Link>
              <span className="text-white/20">·</span>
              <Link
                href="/terms"
                className="hover:text-slate-300 transition-colors underline underline-offset-4 decoration-white/10"
              >
                Syarat & Ketentuan
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-slate-400 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Independent builder · Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
