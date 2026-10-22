"use client";
import { useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isPublicTranslationPath } from "@/lib/visitor-language.mjs";
import { Moon, Sun } from "lucide-react";
import s from "./commerce.module.css";
import { SessionBridge } from "./SessionBridge";
const subscribe = (cb: () => void) => {
  window.addEventListener("home-theme-change", cb);
  return () => window.removeEventListener("home-theme-change", cb);
};
const theme = () => {
  try {
    return localStorage.getItem("khadafi-home-theme") === "light"
      ? "light"
      : "dark";
  } catch {
    return "dark";
  }
};
export function CommerceShell({ children }: { children: ReactNode }) {
  const privatePage = !isPublicTranslationPath(usePathname() || "/");
  const current = useSyncExternalStore(subscribe, theme, () => "dark");
  function toggle() {
    try {
      localStorage.setItem(
        "khadafi-home-theme",
        current === "dark" ? "light" : "dark",
      );
      window.dispatchEvent(new Event("home-theme-change"));
    } catch {}
  }
  return (
    <div className={`${s.shell}${privatePage ? " notranslate" : ""}`} translate={privatePage ? "no" : undefined} data-theme={current}>
      <SessionBridge />
      <div className={s.wrap}>
        <header className={s.header}>
          <Link href="/" className={s.brand} aria-label="Khadafi — beranda">
            khadafi<span>.</span>
          </Link>
          <nav className={s.nav} aria-label="Navigasi produk">
            <Link href="/products">Produk</Link>
            <Link href="/resources" className={s.optional}>
              Resources
            </Link>
            <Link href="/account">Akun saya</Link>
            <button
              className={s.toggle}
              onClick={toggle}
              aria-label={
                current === "dark"
                  ? "Gunakan tema terang"
                  : "Gunakan tema gelap"
              }
            >
              {current === "dark" ? <Sun /> : <Moon />}
            </button>
          </nav>
        </header>
        {children}
      </div>
    </div>
  );
}
