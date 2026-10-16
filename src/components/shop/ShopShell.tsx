"use client";
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { ChevronDown, Moon, Sun } from "lucide-react";
import { SessionBridge } from "@/components/commerce/SessionBridge";
import s from "./shop.module.css";
import commerce from "@/components/commerce/commerce.module.css";
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
export function ShopShell({ children }: { children: ReactNode }) {
  const current = useSyncExternalStore(subscribe, theme, () => "dark");
  const menu = useRef<HTMLDetailsElement>(null);
  function toggle() {
    try {
      localStorage.setItem(
        "khadafi-home-theme",
        current === "dark" ? "light" : "dark",
      );
      window.dispatchEvent(new Event("home-theme-change"));
    } catch {}
  }
  useEffect(() => {
    function dismiss(e: PointerEvent) {
      if (menu.current?.open && !menu.current.contains(e.target as Node))
        menu.current.open = false;
    }
    function escape(e: KeyboardEvent) {
      if (e.key === "Escape" && menu.current?.open) {
        menu.current.open = false;
        menu.current.querySelector("summary")?.focus();
      }
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  return (
    <div className={`${commerce.shell} ${s.shell}`} data-theme={current}>
      <SessionBridge />
      <div className={s.shopWrap}>
        <header className={s.shopHeader}>
          <Link href="/" className={s.brand} aria-label="Khadafi — beranda">
            khadafi<span>.</span>
          </Link>
          <nav aria-label="Navigasi Studio & Shop">
            <details ref={menu} className={s.shopMenu}>
              <summary>
                Produk & Jasa <ChevronDown aria-hidden="true" />
              </summary>
              <div
                onClick={() => {
                  if (menu.current) menu.current.open = false;
                }}
              >
                <Link href="/products">
                  Semua Koleksi<small>Produk, pilihan, dan layanan</small>
                </Link>
                <Link href="/products/original">
                  Produk Digital Khadafi
                  <small>Karya original, dibuat dengan perhatian</small>
                </Link>
                <Link href="/products/recommended">
                  Rekomendasi Pilihan
                  <small>Tools untuk langkah berikutnya</small>
                </Link>
                <Link href="/services">
                  Jasa & Kolaborasi<small>Mari wujudkan idemu</small>
                </Link>
              </div>
            </details>
            <Link href="/resources" className={s.hideMobile}>
              Resources
            </Link>
            <Link href="/account">Akun saya</Link>
            <button
              className={s.themeToggle}
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
