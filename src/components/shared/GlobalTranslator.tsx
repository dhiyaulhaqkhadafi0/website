"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Globe, Check } from "lucide-react";
import Link from "next/link";
import { TRANSLATION_CONSENT_KEY } from "@/components/legal/CookiePreferences";
export const SUPPORTED_LANGUAGES = [
  { code: "id", label: "Bahasa Indonesia" },
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "es", label: "Español" },
  { code: "zh-CN", label: "简体中文" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
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
          elementId: string,
        ) => void;
      };
    };
  }
}
const subscribe = (cb: () => void) => {
  window.addEventListener("translation-consent-change", cb);
  return () => window.removeEventListener("translation-consent-change", cb);
};
function currentLanguage() {
  try {
    return localStorage.getItem(TRANSLATION_CONSENT_KEY) === "granted"
      ? SUPPORTED_LANGUAGES.find(
          (l) => l.code === localStorage.getItem("khadafi_lang_preference"),
        )?.code || "id"
      : "id";
  } catch {
    return "id";
  }
}
function setLanguage(code: string) {
  try {
    localStorage.setItem("khadafi_lang_preference", code);
    const value = code === "id" ? "" : "/id/" + code;
    const maxAge = code === "id" ? 0 : 30 * 86400;
    for (const domain of [
      "",
      `; domain=.${location.hostname.replace(/^www\./, "")}`,
    ])
      document.cookie = `googtrans=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}${domain}`;
    window.location.reload();
  } catch {
    window.dispatchEvent(new Event("translation-consent-change"));
  }
}
export function GlobalTranslator() {
  const lang = useSyncExternalStore(subscribe, currentLanguage, () => "id");
  useEffect(() => {
    if (lang === "id") return;
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement)
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "id",
            includedLanguages: SUPPORTED_LANGUAGES.map((l) => l.code).join(","),
            autoDisplay: false,
          },
          "google_translate_element",
        );
    };
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [lang]);
  return (
    <>
      <div
        id="google_translate_element"
        className="sr-only pointer-events-none"
        aria-hidden="true"
      />
      {lang !== "id" && (
        <aside
          aria-label="Status terjemahan"
          className="fixed bottom-5 left-5 z-[95] rounded-xl bg-[#181815] border border-white/20 text-white text-xs p-3 flex items-center gap-4"
        >
          <span>
            Terjemahan:{" "}
            {SUPPORTED_LANGUAGES.find((l) => l.code === lang)?.label}
          </span>
          <button
            type="button"
            onClick={() => setLanguage("id")}
            className="min-h-11 underline"
          >
            Kembali ke ID
          </button>
        </aside>
      )}
    </>
  );
}
export function NavbarLanguageSwitcher() {
  const lang = useSyncExternalStore(subscribe, currentLanguage, () => "id");
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const outside = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) {
        setOpen(false);
        setPending(null);
      }
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        setPending(null);
        trigger.current?.focus();
      }
    };
    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  function choose(code: string) {
    try {
      if (
        code !== "id" &&
        localStorage.getItem(TRANSLATION_CONSENT_KEY) !== "granted"
      ) {
        setPending(code);
        return;
      }
      setLanguage(code);
    } catch {
      setError("Penyimpanan browser belum tersedia.");
    }
  }
  function allow() {
    try {
      localStorage.setItem(TRANSLATION_CONSENT_KEY, "granted");
      if (pending) setLanguage(pending);
    } catch {
      setError("Preferensi belum dapat disimpan.");
    }
  }
  return (
    <div ref={root} className="relative">
      <button
        ref={trigger}
        type="button"
        aria-label="Pilih bahasa / Select language"
        aria-expanded={open}
        onClick={() => {
          setOpen((v) => !v);
          setPending(null);
        }}
        className="min-h-11 inline-flex gap-2 items-center px-3 rounded-lg text-xs text-white/75 border border-white/10 bg-white/5"
      >
        <Globe size={15} aria-hidden="true" />
        <span>{lang.toUpperCase()}</span>
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-44px)] bg-[#181815] text-white border border-white/15 shadow-xl rounded-xl p-3 z-[100]"
          aria-label="Pilihan bahasa"
        >
          {pending ? (
            <>
              <p className="text-sm leading-relaxed mb-3">
                Aktifkan Google Translate untuk menerjemahkan halaman. Layanan
                Google dapat menerima konten halaman dan informasi teknis
                browser.
              </p>
              <Link
                className="text-xs underline block min-h-11"
                href="/cookies"
              >
                Baca penjelasan Cookies
              </Link>
              <button
                className="min-h-11 w-full bg-[#e8e3d5] text-[#252620] rounded-lg text-xs px-3"
                onClick={allow}
              >
                Aktifkan &amp; terjemahkan
              </button>
              <button
                className="min-h-11 w-full text-xs"
                onClick={() => {
                  setPending(null);
                  setOpen(false);
                }}
              >
                Tetap Bahasa Indonesia
              </button>
            </>
          ) : (
            SUPPORTED_LANGUAGES.map((l) => (
              <button
                type="button"
                key={l.code}
                onClick={() => choose(l.code)}
                className="min-h-11 px-3 w-full flex justify-between items-center text-left text-sm hover:bg-white/10 rounded-lg"
              >
                {l.label}
                {l.code === lang && <Check size={14} aria-hidden="true" />}
              </button>
            ))
          )}
          {error && (
            <p role="alert" className="text-xs p-2">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
