"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef, useSyncExternalStore } from "react";
import { PanelLeftClose, Menu, X, ArrowUpRight } from "lucide-react";
import s from "./workspace.module.css";
export type WorkspaceArea = { id: string; label: string; group: string };
export function WorkspaceShell({
  title,
  active,
  areas,
  onSelect,
  children,
}: {
  title: string;
  active: string;
  areas: WorkspaceArea[];
  onSelect: (id: string) => void;
  children: React.ReactNode;
}) {
  const subscribe = (callback: () => void) => {
    window.addEventListener("studio-nav-change", callback);
    return () => window.removeEventListener("studio-nav-change", callback);
  };
  const snapshot = () => {
    try {
      return localStorage.getItem("studio-nav-collapsed") === "true";
    } catch {
      return false;
    }
  };
  const collapsed = useSyncExternalStore(subscribe, snapshot, () => false);
  const drawer = useRef<HTMLDialogElement>(null);
  function toggle() {
    try {
      localStorage.setItem("studio-nav-collapsed", String(!collapsed));
      window.dispatchEvent(new Event("studio-nav-change"));
    } catch {}
  }
  const navigation = (
    <>
      <Link href="/studio" className={s.brand}>
        <Image
          src="/images/brand/khadafi-studio-ks.webp"
          width="40"
          height="40"
          alt=""
        />
        <span>
          Khadafi <small>STUDIO</small>
        </span>
      </Link>
      <p className={s.sectionLabel}>{title}</p>
      <nav aria-label={`Navigasi ${title}`}>
        {areas.map((area, index) => (
          <div key={area.id}>
            {area.group !== areas[index - 1]?.group && (
              <span className={s.group}>{area.group}</span>
            )}
            <button
              title={area.label}
              type="button"
              aria-current={area.id === active ? "page" : undefined}
              onClick={() => {
                onSelect(area.id);
                drawer.current?.close();
              }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {area.label}
            </button>
          </div>
        ))}
      </nav>
      <div className={s.modules}>
        <Link href="/studio">
          Artikel <ArrowUpRight size={14} />
        </Link>
        <Link href="/studio/apps">
          Apps <ArrowUpRight size={14} />
        </Link>
        <Link href="/studio/affiliates">
          Affiliate <ArrowUpRight size={14} />
        </Link>
        <Link href="/studio/overview">
          Bisnis <ArrowUpRight size={14} />
        </Link>
      </div>
    </>
  );
  return (
    <div className={`${s.shell} ${collapsed ? s.collapsed : ""}`}>
      <aside className={s.sidebar}>
        {navigation}
        <button
          className={s.collapse}
          type="button"
          onClick={toggle}
          aria-label="Ciutkan navigasi"
        >
          <PanelLeftClose size={18} />
          Ciutkan
        </button>
      </aside>
      <div className={s.main}>
        <header className={s.top}>
          <button
            type="button"
            className={s.menu}
            onClick={() => {
              if (matchMedia("(max-width: 900px)").matches)
                drawer.current?.showModal();
              else toggle();
            }}
            aria-label="Buka navigasi Studio"
          >
            <Menu size={20} />
          </button>
          <span>
            KHADAFI STUDIO <i>/</i> {title}
          </span>
          <Link href="/" prefetch={false}>
            Lihat website <ArrowUpRight size={14} />
          </Link>
        </header>
        {children}
      </div>
      <dialog ref={drawer} className={s.drawer}>
        <button
          type="button"
          className={s.drawerClose}
          onClick={() => drawer.current?.close()}
          aria-label="Tutup navigasi"
        >
          <X />
        </button>
        {navigation}
      </dialog>
    </div>
  );
}
