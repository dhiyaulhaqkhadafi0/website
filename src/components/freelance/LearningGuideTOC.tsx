"use client";

import { useEffect, useState } from "react";
import { Check, Circle } from "lucide-react";

interface TOCItem {
  id: string;
  label: string;
  title: string;
}

export function LearningGuideTOC({ items }: { items: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || "");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      let currentActiveId = items[0]?.id;
      let passedSections = 0;

      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Adjust threshold so that when the element is just below the center of the viewport, it becomes active.
          if (rect.top <= window.innerHeight * 0.4) {
            currentActiveId = item.id;
            passedSections = i + 1;
            break;
          }
        }
      }

      setActiveId(currentActiveId);
      setProgress(passedSections);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  return (
    <div className="sticky top-32">
      <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#8C8E87] mb-8">
        Dalam Panduan Ini
      </h4>
      <nav className="flex flex-col gap-4">
        {items.map((item, index) => {
          const isActive = activeId === item.id;
          const isPast = items.findIndex((i) => i.id === activeId) > index;
          
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`text-[14px] font-medium flex items-center justify-between transition-colors group ${
                isActive 
                  ? "text-[#242521]" 
                  : isPast 
                  ? "text-[#8C8E87] hover:text-[#242521]"
                  : "text-[#8C8E87] hover:text-[#242521]"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-[11px] font-bold tracking-widest ${isActive ? "text-[#242521]" : "text-[#8C8E87]"}`}>
                  {item.label}
                </span>
                <span>{item.title}</span>
              </div>
              
              <div className="shrink-0 flex items-center justify-center">
                {isPast ? (
                  <Check className="w-3.5 h-3.5 text-[#A5AC91]" />
                ) : isActive ? (
                  <Circle className="w-2.5 h-2.5 fill-[#242521] text-[#242521]" />
                ) : null}
              </div>
            </a>
          );
        })}
      </nav>

      <div className="mt-12 pt-6 border-t border-[#D9D8D2] flex flex-col gap-1.5 text-[12px] font-medium text-[#8C8E87]">
        <span>25 menit baca</span>
        <span>{progress} / {items.length} selesai</span>
      </div>
    </div>
  );
}
