"use client";
import { PUBLIC_NAV_CATEGORIES, type NavCategory } from "@/content/public-navigation";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { NavbarLanguageSwitcher } from "./GlobalTranslator";
import dynamic from "next/dynamic";
const ProjectInquiryModal = dynamic(() => import("./ProjectInquiryModal").then(m => m.ProjectInquiryModal), { ssr: false });
import { useAccountDestination } from "./useAccountDestination";



export function Navbar() {
  const pathname = usePathname() || "";
  const inHome = pathname === "/" || pathname === "/about" || pathname === "/resources" || pathname.startsWith("/resources/");
  const account = useAccountDestination();
  const reduced = useReducedMotion();
  const inFreelance = pathname === "/freelance" || pathname.startsWith("/freelance/");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

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
        if (mobileOpen) menuButton.current?.focus();
        setMobileOpen(false);
        setOpenDropdown(null);
      }
      if (event.key === "Tab" && mobileOpen && navRef.current) {
        const items = [...navRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')].filter(item => item.getClientRects().length > 0);
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  // Lock body scroll on mobile open
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const wide = window.matchMedia("(min-width: 1024px)");
    const resize = () => { if (wide.matches) setMobileOpen(false); };
    wide.addEventListener("change", resize);
    return () => { document.body.style.overflow = previous; wide.removeEventListener("change", resize); };
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
    if (categoryKey === "apps") return pathname === '/apps' || pathname.startsWith('/apps/');
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
      return false;
    }
    return false;
  };

  const [appCategories,setAppCategories]=useState<{slug:string;name:string;description:string}[]>([]);
  useEffect(()=>{const c=new AbortController();void fetch('/api/apps/categories',{signal:c.signal}).then(r=>r.ok?r.json():null).then(data=>{if(data)setAppCategories(data.categories);}).catch(()=>{});return()=>c.abort();},[]);
  const navCategories: NavCategory[] = PUBLIC_NAV_CATEGORIES.map(c=>c.key==='apps'?{...c,subMenus:[...c.subMenus,...appCategories.map(a=>({label:a.name,href:'/apps/'+a.slug,description:a.description}))]}:c);

  return (
    <>
      {mobileOpen && (inHome || inFreelance) && <div className="h-[84px] lg:hidden" aria-hidden="true" />}
      <motion.header
        data-mobile-open={mobileOpen}
        initial={false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.5, ease: "easeOut" }}
        className={`site-navbar ${inHome ? "relative bg-[#10100e] pb-3 sm:pb-4" : inFreelance ? "relative bg-[#292a27] pb-3 sm:pb-4" : "fixed top-0 left-0 right-0"} z-[90] px-3 sm:px-6 pt-3 sm:pt-4 pointer-events-none`}
      >
        <div
          ref={navRef}
          className={`max-w-[1240px] mx-auto rounded-2xl pointer-events-auto transition-all duration-300 ${
            scrolled || mobileOpen
              ? "bg-[#181815]/95 backdrop-blur-xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.65)] py-2 sm:py-2.5 px-3 sm:px-6"
              : "bg-[#121210]/80 backdrop-blur-md border border-white/10 shadow-[0_6px_25px_rgba(0,0,0,0.4)] py-2 sm:py-3 px-3 sm:px-6"
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
                    src="/images/experience/brand-v1.webp"
                    unoptimized
                    alt="Khadafi Logo"
                    width={60}
                    height={40}
                    preload
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
                          transition={{ duration: reduced ? 0 : 0.18, ease: "easeOut" }}
                          className="absolute top-[110%] left-1/2 -translate-x-1/2 w-80 pt-2 z-50 pointer-events-auto"
                        >
                          <div className="bg-[#181815]/98 backdrop-blur-2xl border border-white/15 rounded-2xl p-2 shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col relative overflow-hidden">
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
              <div className="block">
                <NavbarLanguageSwitcher />
              </div>

              {/* Primary CTA: Mulai Proyek */}
              <Link
                href={account.href}
                className="group relative inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-xl text-xs sm:text-[13px] font-bold tracking-wide bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white transition-all duration-300 shadow-[0_4px_16px_rgba(255,255,255,0.06)] hover:shadow-[0_4px_24px_rgba(255,255,255,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 active:scale-95"
              >
                <span>{account.label}</span>
                <span className="text-white/40 group-hover:text-black transition-colors" aria-hidden="true">
                  →
                </span>
              </Link>

              {/* Mobile Menu Toggle Button */}
              <div className="lg:hidden flex items-center">
                <button
                  ref={menuButton}
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
                transition={{ duration: reduced ? 0 : 0.25, ease: "easeInOut" }}
                className="lg:hidden overflow-hidden border-t border-white/10 mt-3 pt-3"
              >
                <nav
                  aria-label="Navigasi Mobile"
                  className="mobile-menu-scroll flex flex-col gap-1 overflow-y-auto pb-4 pr-1"
                >
                  {/* Category Accordion Items */}
                  {navCategories.map((category) => {
                    const isExpanded = mobileExpandedCat === category.key;
                    const active = isCategoryActive(category.key);

                    return (
                      <div
                        key={category.key}
                        className="shrink-0 rounded-xl overflow-hidden border border-white/5 bg-white/[0.02]"
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
                              transition={{ duration: reduced ? 0 : 0.2 }}
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
                  <div className="shrink-0 pt-4 mt-2 border-t border-white/10 flex flex-col gap-3">
                    <Link
                      href={account.href}
                      onClick={closeMobile}
                      className="w-full py-3.5 px-4 bg-white text-black font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <span>{account.label}</span>
                    </Link>

                    <div className="flex items-center justify-between px-2 pt-1 text-xs text-white/50 font-mono">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Belajar · Berkarya · Bertumbuh</span>
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
      {inquiryOpen && <ProjectInquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
      />}
    </>
  );
}
