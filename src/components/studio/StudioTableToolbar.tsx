"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { Editor } from "@tiptap/react";
import {
  Trash2,
  Heading,
  Plus,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Table as TableIcon,
} from "lucide-react";

type Props = {
  editor: Editor | null;
};

export function StudioTableToolbar({ editor }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!editor) return;

    if (!editor.isActive("table")) {
      setIsVisible(false);
      return;
    }

    // Find the active cell or table DOM element
    let targetEl: HTMLElement | null = null;
    const domSelection = window.getSelection();

    if (domSelection && domSelection.rangeCount > 0) {
      const node = domSelection.anchorNode;
      const element = node instanceof HTMLElement ? node : node?.parentElement;
      targetEl = element?.closest(".studio-tiptap table, .tableWrapper, table") as HTMLElement | null;
    }

    if (!targetEl) {
      targetEl = document.querySelector(".studio-tiptap table");
    }

    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      const toolbarHeight = 44;
      const toolbarWidth = 460;

      // Position toolbar above the table, clamping to top of screen if scrolled
      let top = rect.top - toolbarHeight - 10;
      if (top < 70) {
        // If table top is scrolled above viewport, anchor toolbar near top of viewport as long as table is visible
        top = Math.max(70, Math.min(rect.bottom - toolbarHeight - 10, 70));
      }

      // Center or left-align relative to table, keeping inside window bounds
      let left = Math.max(16, Math.min(rect.left, window.innerWidth - toolbarWidth - 16));

      setPosition({ top, left });
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    editor.on("selectionUpdate", updatePosition);
    editor.on("transaction", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      editor.off("selectionUpdate", updatePosition);
      editor.off("transaction", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [editor, updatePosition]);

  if (!editor || !isVisible) return null;

  return (
    <div
      ref={toolbarRef}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      className="fixed z-40 flex items-center gap-1 p-1.5 rounded-xl bg-[#14151B]/95 border border-white/15 shadow-2xl backdrop-blur-xl select-none animate-in fade-in duration-100 text-xs font-sans"
      onMouseDown={(e) => e.preventDefault()} // Prevents blurring editor selection
    >
      {/* Table Badge */}
      <div className="flex items-center gap-1.5 px-2 py-1 text-[#34D399] font-mono text-[11px] font-semibold bg-[#34D399]/10 rounded-lg border border-[#34D399]/20">
        <TableIcon className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Tabel</span>
      </div>

      <span className="w-px h-4 bg-white/10 mx-0.5" />

      {/* Row Actions */}
      <div className="flex items-center gap-0.5" title="Kontrol Baris">
        <button
          type="button"
          onClick={() => editor.chain().focus().addRowBefore().run()}
          title="Tambah baris di atas"
          aria-label="Add row above"
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/10 transition-colors"
        >
          <Plus className="w-3 h-3 text-[#34D399]" />
          <ArrowUp className="w-3 h-3 text-[#94A3B8]" />
          <span className="hidden md:inline text-[11px]">Baris Atas</span>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().addRowAfter().run()}
          title="Tambah baris di bawah"
          aria-label="Add row below"
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/10 transition-colors"
        >
          <Plus className="w-3 h-3 text-[#34D399]" />
          <ArrowDown className="w-3 h-3 text-[#94A3B8]" />
          <span className="hidden md:inline text-[11px]">Baris Bawah</span>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().deleteRow().run()}
          title="Hapus baris aktif saat ini"
          aria-label="Delete row"
          className="p-1 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/15 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <span className="w-px h-4 bg-white/10 mx-0.5" />

      {/* Column Actions */}
      <div className="flex items-center gap-0.5" title="Kontrol Kolom">
        <button
          type="button"
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          title="Tambah kolom di kiri"
          aria-label="Add column left"
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/10 transition-colors"
        >
          <Plus className="w-3 h-3 text-[#60A5FA]" />
          <ArrowLeft className="w-3 h-3 text-[#94A3B8]" />
          <span className="hidden md:inline text-[11px]">Kolom Kiri</span>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          title="Tambah kolom di kanan"
          aria-label="Add column right"
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/10 transition-colors"
        >
          <Plus className="w-3 h-3 text-[#60A5FA]" />
          <ArrowRight className="w-3 h-3 text-[#94A3B8]" />
          <span className="hidden md:inline text-[11px]">Kolom Kanan</span>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().deleteColumn().run()}
          title="Hapus kolom aktif saat ini"
          aria-label="Delete column"
          className="p-1 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/15 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <span className="w-px h-4 bg-white/10 mx-0.5" />

      {/* Header Row Toggle */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeaderRow().run()}
        title="Nyalakan/matikan baris header"
        aria-label="Toggle header row"
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/10 transition-colors"
      >
        <Heading className="w-3 h-3 text-[#FBBF24]" />
        <span className="hidden sm:inline text-[11px]">Header</span>
      </button>

      <span className="w-px h-4 bg-white/10 mx-0.5" />

      {/* Delete Table Action */}
      <button
        type="button"
        onClick={() => {
          editor.chain().focus().deleteTable().run();
          setIsVisible(false);
        }}
        title="Hapus seluruh tabel ini"
        aria-label="Delete entire table"
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[#EF4444] hover:bg-[#EF4444]/15 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span className="text-[11px]">Hapus Tabel</span>
      </button>
    </div>
  );
}
