"use client";

import { useEffect, useState } from "react";

interface TOCItem {
  id: string;
  label: string;
  title: string;
}

export function LearningGuideTOC({ items }: { items: TOCItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const update = () => {
      let current = 0;
      items.forEach((item, index) => {
        const section = document.getElementById(item.id);
        if (section && section.getBoundingClientRect().top <= window.innerHeight * 0.38) current = index;
      });
      setActiveIndex(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  const links = (mobile = false) => items.map((item, index) => (
    <a
      key={item.id}
      href={`#${item.id}`}
      aria-current={activeIndex === index ? "location" : undefined}
      className={`flex items-start gap-3 py-2.5 leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78906d] ${activeIndex === index ? "text-[#22251f] font-bold" : "text-[#62675d] hover:text-[#22251f]"} ${mobile ? "text-sm" : "text-[13px]"}`}
    >
      <span className="w-5 shrink-0 text-[11px] font-bold pt-0.5">{index < activeIndex ? "✓" : item.label}</span>
      <span>{item.title}</span>
      {activeIndex === index && <span className="ml-auto text-[#6f8268]" aria-hidden="true">●</span>}
    </a>
  ));

  return <>
    <aside className="hidden lg:block sticky top-8 self-start" aria-label="Navigasi panduan">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#66705f] mb-5">Dalam panduan</p>
      <nav aria-label="Bab panduan">{links()}</nav>
      <div className="mt-8 pt-5 border-t border-[#c9cec0]">
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#66705f] mb-2">Posisi membaca</p>
        <p className="text-2xl font-bold tracking-tight text-[#242520]">{String(activeIndex + 1).padStart(2, "0")} <span className="text-sm font-normal text-[#677063]">/ 07</span></p>
        <div className="h-1 bg-[#cbd0c3] mt-3" aria-hidden="true"><div className="h-full bg-[#667b5d] transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${((activeIndex + 1) / items.length) * 100}%` }} /></div>
        <p className="text-xs text-[#62675d] mt-4">± 25–35 menit baca & praktik</p>
      </div>
    </aside>
    <details className="lg:hidden border-y border-[#b9beaf] mb-8 group">
      <summary className="cursor-pointer list-none py-4 flex items-center justify-between gap-4 text-sm font-semibold text-[#242520] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78906d]">
        <span>Dalam panduan <span className="text-[#6b7667] font-normal ml-2">{String(activeIndex + 1).padStart(2, "0")} / 07</span></span>
        <span className="group-open:rotate-45 transition-transform motion-reduce:transition-none text-xl" aria-hidden="true">+</span>
      </summary>
      <nav className="pb-4" aria-label="Bab panduan">{links(true)}</nav>
    </details>
  </>;
}
