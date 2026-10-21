"use client";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationFeedback() {
  const pathname = usePathname(), search = useSearchParams();
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => { if (root.current) root.current.dataset.active = "false"; }, [pathname, search]);
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    function start(event: MouseEvent) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const a = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!a || a.hasAttribute("download") || (a.target && a.target !== "_self") || a.getAttribute("aria-disabled") === "true") return;
      const next = new URL(a.href, location.href);
      if (next.origin !== location.origin || (next.pathname === location.pathname && next.search === location.search)) return;
      if (root.current) root.current.dataset.active = "true";
      clearTimeout(timeout);
      // A cancelled navigation must never leave the indicator running forever.
      timeout = setTimeout(() => { if (root.current) root.current.dataset.active = "false"; }, 12000);
    }
    const done = () => { if (root.current) root.current.dataset.active = "false"; };
    document.addEventListener("click", start, true);
    window.addEventListener("pageshow", done);
    return () => { clearTimeout(timeout); document.removeEventListener("click", start, true); window.removeEventListener("pageshow", done); };
  }, []);
  return <div ref={root} className="navigation-feedback" data-active="false" aria-hidden="true">
    <div className="navigation-thread" />
    <div className="navigation-note"><span className="loading-orbit"><i /><i /><i /></span><span>Membuka ruang berikutnya</span></div>
  </div>;
}
