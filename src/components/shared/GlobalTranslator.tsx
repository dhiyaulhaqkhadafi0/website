"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Globe, X, Check, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "id", label: "Bahasa Indonesia (Asli)", flag: "🇮🇩" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "zh-CN", label: "简体中文", flag: "🇨🇳" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
];

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages?: string;
            autoDisplay?: boolean;
          },
          elementId: string
        ) => void;
      };
    };
  }
}

function setCookie(name: string, value: string, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const hostname = window.location.hostname;
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  if (hostname !== "localhost" && hostname !== "127.0.0.1") {
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; domain=.${hostname.replace(/^www\./, "")}`;
  }
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

export function GlobalTranslator() {
  const [currentLang, setCurrentLang] = useState<string>("id");
  const [showToast, setShowToast] = useState(false);
  const [detectedLangName, setDetectedLangName] = useState<string>("English");
  const [targetCode, setTargetCode] = useState<string>("en");

  // Initialize current language state from cookie
  useEffect(() => {
    const rawCookie = getCookie("googtrans");
    if (rawCookie) {
      const parts = rawCookie.split("/");
      const lang = parts[parts.length - 1];
      if (lang && lang !== "id") {
        setCurrentLang(lang);
      } else {
        setCurrentLang("id");
      }
    }
  }, []);

  // Load Google Translate script dynamically if not present
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "id",
            includedLanguages: "id,en,ja,es,zh-CN,de,fr,ar",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Visitor Auto-Detection for Non-Indonesian traffic
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasStoredPref = localStorage.getItem("khadafi_lang_preference");
    if (hasStoredPref) return; // User already interacted before

    const userLang = (navigator.language || (navigator as any).userLanguage || "").toLowerCase();
    const isIndonesian = userLang.startsWith("id");

    if (!isIndonesian) {
      // Find matching language or fallback to English
      const matched = SUPPORTED_LANGUAGES.find((l) => userLang.startsWith(l.code.toLowerCase()));
      const code = matched ? matched.code : "en";
      const name = matched ? matched.label : "English";
      
      setTargetCode(code);
      setDetectedLangName(name);

      // Show toast after a gentle 1.8s delay so visitor experiences page first
      const timer = setTimeout(() => {
        setShowToast(true);
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, []);

  const changeLanguage = useCallback((code: string) => {
    localStorage.setItem("khadafi_lang_preference", code);
    setCurrentLang(code);
    setShowToast(false);

    if (code === "id") {
      setCookie("googtrans", "/id/id");
      const select = document.querySelector("#google_translate_element select") as HTMLSelectElement | null;
      if (select) {
        select.value = "id";
        select.dispatchEvent(new Event("change"));
      }
      window.location.reload();
      return;
    }

    setCookie("googtrans", `/id/${code}`);
    const select = document.querySelector("#google_translate_element select") as HTMLSelectElement | null;
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event("change"));
    } else {
      window.location.reload();
    }
  }, []);

  const dismissToast = () => {
    localStorage.setItem("khadafi_lang_preference", "dismissed");
    setShowToast(false);
  };

  const activeLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <>
      {/* Hidden container for Google Translate widget */}
      <div id="google_translate_element" className="sr-only pointer-events-none" aria-hidden="true" />

      {/* Floating Translated Banner Indicator if active translation is on */}
      {currentLang !== "id" && (
        <aside
          aria-label="Status Terjemahan"
          className="fixed bottom-5 left-5 z-[95] flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#05050A]/90 backdrop-blur-xl border border-emerald-500/30 text-white text-xs shadow-2xl animate-fade-in"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-white/70">
            Translated to <strong className="text-white font-semibold">{activeLangObj.label}</strong>
          </span>
          <button
            type="button"
            onClick={() => changeLanguage("id")}
            className="ml-2 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Reset (ID)
          </button>
        </aside>
      )}

      {/* Smart Non-Intrusive Visitor Toast for International Traffic */}
      <AnimatePresence>
        {showToast && currentLang === "id" && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-[100] max-w-sm w-[calc(100vw-3rem)] rounded-2xl bg-[#090A10]/95 backdrop-blur-2xl border border-white/15 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-white"
            role="dialog"
            aria-live="polite"
          >
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Globe className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Global Visitor
                </span>
              </div>
              <button
                type="button"
                onClick={dismissToast}
                aria-label="Tutup saran terjemahan"
                className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h4 className="text-sm font-semibold text-white mb-1.5 leading-snug">
              Browsing from outside Indonesia?
            </h4>
            <p className="text-xs text-white/70 leading-relaxed mb-4 font-light">
              Translate this website to <strong className="text-white font-medium">{detectedLangName}</strong> for a seamless and intuitive reading experience.
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => changeLanguage(targetCode)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-semibold text-xs transition-all shadow-md shadow-emerald-500/20 hover:scale-[1.02] cursor-pointer"
              >
                <span>Translate to {detectedLangName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={dismissToast}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-mono transition-colors cursor-pointer"
              >
                Stay ID
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Standalone Language Switcher Trigger for Navbar (Desktop & Mobile)
 */
export function NavbarLanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<string>("id");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rawCookie = getCookie("googtrans");
    if (rawCookie) {
      const parts = rawCookie.split("/");
      const lang = parts[parts.length - 1];
      if (lang && lang !== "id") {
        setCurrentLang(lang);
      } else {
        setCurrentLang("id");
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (code: string) => {
    localStorage.setItem("khadafi_lang_preference", code);
    setCurrentLang(code);
    setDropdownOpen(false);

    if (code === "id") {
      setCookie("googtrans", "/id/id");
      const select = document.querySelector("#google_translate_element select") as HTMLSelectElement | null;
      if (select) {
        select.value = "id";
        select.dispatchEvent(new Event("change"));
      }
      window.location.reload();
      return;
    }

    setCookie("googtrans", `/id/${code}`);
    const select = document.querySelector("#google_translate_element select") as HTMLSelectElement | null;
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event("change"));
    } else {
      window.location.reload();
    }
  };

  const activeLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen((v) => !v)}
        aria-label="Pilih bahasa / Select language"
        aria-expanded={dropdownOpen}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium text-white/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-500/30 transition-all cursor-pointer group"
      >
        <Globe className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-45 transition-transform duration-300" />
        <span className="uppercase tracking-wider font-semibold">{activeLangObj.code === "id" ? "ID" : activeLangObj.code.toUpperCase()}</span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-[#090A10]/95 backdrop-blur-2xl border border-white/15 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[100] animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-white/40 border-b border-white/10 mb-1">
            Pilih Bahasa / Language
          </div>
          <div className="flex flex-col gap-0.5 max-h-64 overflow-y-auto">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isActive = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </span>
                  {isActive && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
