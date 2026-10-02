"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { NavbarLanguageSwitcher } from "./GlobalTranslator";
import { ProjectInquiryModal } from "./ProjectInquiryModal";

interface SubMenuItem {
  label: string;
  href: string;
  description: string;
  isExternal?: boolean;
  badge?: string;
}

interface NavCategory {
  key: string;
  label: string;
  href: string;
  badge?: string;
  subMenus: SubMenuItem[];
}

export function Navbar() {
  const pathname = usePathname() || "";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Escape key closes menus
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setOpenDropdown(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll on mobile open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Click outside closes desktop dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileExpandedCat(null);
  };

  const isCategoryActive = (categoryKey: string): boolean => {
    if (categoryKey === "freelance") {
      return pathname.startsWith("/freelance");
    }
    if (categoryKey === "resources") {
      return pathname.startsWith("/resources") || pathname.startsWith("/blog");
    }
    if (categoryKey === "komunitas") {
      return pathname.startsWith("/komunitas") || pathname.startsWith("/community");
    }
    if (categoryKey === "tentang") {
      return (
        pathname.startsWith("/about") ||
        pathname.startsWith("/lab") ||
        pathname.startsWith("/changelog")
      );
    }
    if (categoryKey === "produk") {
      return pathname.startsWith("/studio");
    }
    return false;
  };

  const navCategories: NavCategory[] = [
    {
      key: "produk",
      label: "Produk",
      href: "/#produk",
      badge: "Ventures",
      subMenus: [
        {
          label: "Chikki — Writing Network",
          href: "/studio",
          description: "Platform studio penulisan & repurposing AI (Live MVP)",
          badge: "Live Product",
        },
        {
          label: "Produk Digital",
          href: "/resources?topic=product",
          description: "Blueprint PRD, arsitektur software & template sistem",
        },
        {
          label: "Buku & Panduan",
          href: "/resources",
          description: "Playbook, mental models & panduan taktis builder",
        },
      ],
    },
    {
      key: "jasa",
      label: "Jasa",
      href: "/about#jasa",
      badge: "Hire Me",
      subMenus: [
        {
          label: "Work With Me & Kapabilitas",
          href: "/about#jasa",
          description: "Prinsip rekayasa produk AI, arsitektur defensible & eksekusi cepat",
        },
        {
          label: "Mulai Proyek / Konsultasi",
          href: "#inquiry",
          description: "Diskusikan ide produk, MVP, atau automasi workflow bersama Khadafi",
          badge: "Direct Contact",
        },
      ],
    },
    {
      key: "freelance",
      label: "Freelance",
      href: "/freelance",
      badge: "Hub",
      subMenus: [
        {
          label: "Freelance Journey Hub",
          href: "/freelance",
          description: "Pusat ekosistem, catatan, dan navigasi karier remote",
        },
        {
          label: "Mulai Freelance dari Nol",
          href: "/freelance/belajar/mulai-freelance",
          description: "Panduan flagship langkah awal membangun karier mandiri",
          badge: "Flagship Guide",
        },
        {
          label: "Peluang Remote Jobs",
          href: "/freelance/direktori?type=Remote+Job+Board",
          description: "Kurasi job board & papan lowongan internasional",
        },
        {
          label: "Direktori Platform",
          href: "/freelance/direktori",
          description: "14+ platform kerja independen & marketplace proyek",
        },
        {
          label: "Tools & Sumber Daya",
          href: "/freelance/cari",
          description: "Pencarian terpadu tools, panduan, dan direktori",
        },
      ],
    },
    {
      key: "resources",
      label: "Resources",
      href: "/resources",
      subMenus: [
        {
          label: "Semua Resources",
          href: "/resources",
          description: "Kumpulan sistem kerja, blueprint PRD, dan panduan taktis",
        },
        {
          label: "AI & Prompt Engineering",
          href: "/resources?topic=ai",
          description: "Context engineering primer, prompt pack & eval sheet",
        },
        {
          label: "Product Building",
          href: "/resources?topic=product",
          description: "PRD engine, architecture RFC & MVP readiness checklist",
        },
        {
          label: "Digital Business & Assets",
          href: "/resources?topic=business",
          description: "Positioning canvas, monetisasi independen & unit ekonomi",
        },
        {
          label: "Creator Systems",
          href: "/resources?topic=content",
          description: "Content OS, repurposing engine & alur distribusi",
        },
        {
          label: "The Digital Grimoire (Blog)",
          href: "/blog",
          description: "Esai mendalam seputar AI, produk, dan bisnis digital",
          badge: "Editorial",
        },
      ],
    },
    {
      key: "komunitas",
      label: "Komunitas",
      href: "/komunitas",
      subMenus: [
        {
          label: "Tentang Komunitas",
          href: "/komunitas",
          description: "Wadah belajar dan berjejaring builder & kreator Indonesia",
        },
        {
          label: "Gabung Komunitas",
          href: "/komunitas#join",
          description: "Akses grup diskusi eksklusif & sharing sesi berkala",
        },
        {
          label: "Event & Sesi Diskusi",
          href: "/komunitas",
          description: "Bedah studi kasus produk, demo AI workflow & tanya jawab",
        },
      ],
    },
    {
      key: "tentang",
      label: "Tentang",
      href: "/about",
      subMenus: [
        {
          label: "Tentang Khadafi",
          href: "/about",
          description: "Profil builder, AI-assisted product engineer & etos kerja",
        },
        {
          label: "Journey / Now",
          href: "/about#journey",
          description: "Fokus eksplorasi saat ini & roadmap pembangunan produk",
        },
        {
          label: "Sertifikasi & Kredensial",
          href: "/#certifications",
          description: "Validasi profesional dari Google, IBM & institusi global",
        },
        {
          label: "HCFTL Lab",
          href: "/lab",
          description: "Human-Centered Future Tech Lab: Riset AI & teknologi masa depan",
          badge: "Research Lab",
        },
        {
          label: "Changelog",
          href: "/changelog",
          description: "Catatan pembaruan berkala Khadafi Business OS",
        },
      ],
    },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-[90] px-3 sm:px-6 pt-3 sm:pt-4 pointer-events-none"
      >
        <div
          ref={navRef}
          className={`max-w-[1240px] mx-auto rounded-2xl pointer-events-auto transition-all duration-300 ${
            scrolled || mobileOpen
              ? "bg-[#0b0c10]/95 backdrop-blur-xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.65)] py-2 sm:py-2.5 px-3 sm:px-6"
              : "bg-[#08090e]/80 backdrop-blur-md border border-white/10 shadow-[0_6px_25px_rgba(0,0,0,0.4)] py-2 sm:py-3 px-3 sm:px-6"
          }`}
        >
          <div className="flex items-center justify-between gap-1.5 sm:gap-4">
            {/* Brand Logo & Identity */}
            <div className="flex items-center flex-shrink-0">
              <Link
                href="/"
                onClick={closeMobile}
                className="group flex items-center gap-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-xl"
                aria-label="Khadafi — Kembali ke Beranda"
              >
                <div className="relative flex items-center">
                  <Image
                    src="/assets/logo%20AAPE.png"
                    alt="Khadafi Logo"
                    width={130}
                    height={40}
                    priority
                    className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                  />
                </div>
                <div className="hidden sm:flex flex-col border-l border-white/10 pl-2.5">
                  <span className="font-extrabold text-[13px] tracking-widest text-white group-hover:text-emerald-400 transition-colors uppercase font-sans">
                    KHADAFI
                  </span>
                  <span className="text-[9.5px] uppercase font-mono tracking-widest text-slate-400">
                    BUILDER
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Categories */}
            <nav
              className="hidden lg:flex items-center gap-0.5 xl:gap-1"
              aria-label="Navigasi Utama"
            >
              {navCategories.map((category) => {
                const active = isCategoryActive(category.key);
                const isOpen = openDropdown === category.key;

                return (
                  <div
                    key={category.key}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(category.key)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <Link
                      href={category.href}
                      onClick={() => setOpenDropdown(null)}
                      onFocus={() => setOpenDropdown(category.key)}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      className={`flex items-center gap-1 px-3 py-2 text-[13.5px] font-semibold tracking-wide rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                        active
                          ? "text-emerald-400 bg-emerald-500/10 font-bold"
                          : isOpen
                          ? "text-white bg-white/10"
                          : "text-white/75 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>{category.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 text-white/50 ${
                          isOpen ? "rotate-180 text-emerald-400" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </Link>

                    {/* Desktop Dropdown Panel */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="absolute top-[110%] left-1/2 -translate-x-1/2 w-80 pt-2 z-50 pointer-events-auto"
                        >
                          <div className="bg-[#0e0f14]/98 backdrop-blur-2xl border border-white/15 rounded-2xl p-2 shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col relative overflow-hidden">
                            {/* Subtle Ambient Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />

                            {/* Dropdown Items List */}
                            <div className="relative z-10 flex flex-col gap-0.5">
                              {category.subMenus.map((item) => (
                                <Link
                                  key={item.label}
                                  href={item.href}
                                  onClick={(e) => {
                                    setOpenDropdown(null);
                                    if (item.href === "#inquiry") {
                                      e.preventDefault();
                                      setInquiryOpen(true);
                                    }
                                  }}
                                  className="group/item flex flex-col px-3.5 py-2.5 rounded-xl hover:bg-white/10 transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[13px] font-semibold text-white/90 group-hover/item:text-emerald-300 transition-colors flex items-center gap-1.5">
                                      {item.label}
                                      {item.isExternal && (
                                        <ExternalLink className="w-3 h-3 text-white/40" />
                                      )}
                                    </span>
                                    {item.badge ? (
                                      <span className="text-[9.5px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                                        {item.badge}
                                      </span>
                                    ) : (
                                      <ArrowUpRight className="w-3.5 h-3.5 text-white/30 group-hover/item:text-emerald-400 opacity-0 group-hover/item:opacity-100 transition-all transform group-hover/item:translate-x-0.5" />
                                    )}
                                  </div>
                                  <span className="text-[11.5px] text-white/50 leading-snug line-clamp-1 mt-0.5 group-hover/item:text-white/70 transition-colors">
                                    {item.description}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* Right Action: Language Switcher & Primary CTA */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              <div className="hidden sm:block">
                <NavbarLanguageSwitcher />
              </div>

              {/* Primary CTA: Mulai Proyek */}
              <button
                type="button"
                onClick={() => setInquiryOpen(true)}
                className="group relative inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-xl text-xs sm:text-[13px] font-bold tracking-wide bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white transition-all duration-300 shadow-[0_4px_16px_rgba(255,255,255,0.06)] hover:shadow-[0_4px_24px_rgba(255,255,255,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 group-hover:text-black transition-colors" />
                <span>Mulai Proyek</span>
                <span className="text-white/40 group-hover:text-black transition-colors" aria-hidden="true">
                  →
                </span>
              </button>

              {/* Mobile Menu Toggle Button */}
              <div className="lg:hidden flex items-center">
                <button
                  type="button"
                  onClick={() => setMobileOpen((open) => !open)}
                  aria-label={mobileOpen ? "Tutup navigasi" : "Buka navigasi"}
                  aria-expanded={mobileOpen}
                  className="p-2 sm:p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Accordion Navigation Drawer */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="lg:hidden overflow-hidden border-t border-white/10 mt-3 pt-3"
              >
                <nav
                  aria-label="Navigasi Mobile"
                  className="flex flex-col gap-1 max-h-[75vh] overflow-y-auto pb-4 pr-1"
                >
                  {/* Category Accordion Items */}
                  {navCategories.map((category) => {
                    const isExpanded = mobileExpandedCat === category.key;
                    const active = isCategoryActive(category.key);

                    return (
                      <div
                        key={category.key}
                        className="rounded-xl overflow-hidden border border-white/5 bg-white/[0.02]"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setMobileExpandedCat(isExpanded ? null : category.key)
                          }
                          aria-expanded={isExpanded}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-colors ${
                            active
                              ? "text-emerald-400 bg-emerald-500/10"
                              : isExpanded
                              ? "text-white bg-white/10"
                              : "text-white/80 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{category.label}</span>
                            {category.badge && (
                              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                                {category.badge}
                              </span>
                            )}
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-white/50 transition-transform duration-200 ${
                              isExpanded ? "rotate-180 text-emerald-400" : ""
                            }`}
                          />
                        </button>

                        {/* Accordion Sub-items */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="px-3 py-2 bg-black/40 border-t border-white/5 flex flex-col gap-1"
                            >
                              {category.subMenus.map((sub) => (
                                <Link
                                  key={sub.label}
                                  href={sub.href}
                                  onClick={(e) => {
                                    closeMobile();
                                    if (sub.href === "#inquiry") {
                                      e.preventDefault();
                                      setInquiryOpen(true);
                                    }
                                  }}
                                  className="flex flex-col p-2.5 rounded-lg text-left text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-[13px] font-semibold text-white/90">
                                      {sub.label}
                                    </span>
                                    <span className="text-white/30 text-xs">→</span>
                                  </div>
                                  <span className="text-[11px] text-white/50 leading-tight mt-0.5">
                                    {sub.description}
                                  </span>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}

                  {/* Mobile Footer Area */}
                  <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        closeMobile();
                        setInquiryOpen(true);
                      }}
                      className="w-full py-3.5 px-4 bg-white text-black font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Mulai Proyek Bersama Khadafi</span>
                    </button>

                    <div className="flex items-center justify-between px-2 pt-1 text-xs text-white/50 font-mono">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Available for Selected Projects</span>
                      </div>
                      <NavbarLanguageSwitcher />
                    </div>
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Shared Project Inquiry Modal */}
      <ProjectInquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
      />
    </>
  );
}
