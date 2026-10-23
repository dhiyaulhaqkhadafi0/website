"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import {
  PanelLeft,
  PanelRight,
  Maximize2,
  Minimize2,
  Eye,
  Send,
  LoaderCircle,
  AlertCircle,
  Undo2,
  Redo2,
  Plus,
  Bot,
  Sparkles,
  Table as TableIcon,
  MoreHorizontal,
  Check,
} from "lucide-react";
import type { StudioArticle } from "@/lib/blog-types";
type Props = {
  article: StudioArticle;
  saveState: "saved" | "editing" | "saving" | "error";
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  focusMode: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
  onToggleFocus: () => void;
  onOpenPreview: () => void;
  onOpenPublishModal: () => void;
  canUpdate: boolean;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onInsertBlockClick: () => void;
  onInsertTable?: () => void;
  onOpenAiModal?: () => void;
  onOpenRepurposeModal?: () => void;
  hasSelection?: boolean;
};
export function StudioHeader(p: Props) {
  const menu = useRef<HTMLDetailsElement>(null);
  const action = (fn: (() => void) | undefined) => {
    if (menu.current) menu.current.open = false;
    fn?.();
  };
  return (
    <header className="studio-topbar editorial-topbar">
      <div className="editorial-topbar-start">
        <details className="studio-module-menu">
          <summary aria-label="Navigasi Khadafi Studio">
            <Image
              src="/images/brand/khadafi-studio-ks.webp"
              alt=""
              width="32"
              height="32"
            />
            <span>
              Khadafi <small>STUDIO / EDITORIAL</small>
            </span>
          </summary>
          <nav aria-label="Modul Studio">
            <Link href="/studio/apps">Apps Manager ↗</Link>
            <Link href="/studio/affiliates">Affiliate Manager ↗</Link>
            <Link href="/studio/overview">Ringkasan bisnis ↗</Link>
            <Link href="/studio/freelance">Field Notes ↗</Link>
            <Link href="/blog">Lihat blog ↗</Link>
          </nav>
        </details>
        <span
          className="studio-save-status"
          role="status"
          data-state={p.saveState}
        >
          {p.saveState === "saving" ? (
            <LoaderCircle size={14} className="studio-spin" />
          ) : p.saveState === "error" ? (
            <AlertCircle size={14} />
          ) : p.saveState === "saved" ? (
            <Check size={14} />
          ) : (
            <span className="studio-status-dot" />
          )}
          <span>
            {p.saveState === "saving"
              ? "Menyimpan…"
              : p.saveState === "error"
                ? "Gagal menyimpan"
                : p.saveState === "saved"
                  ? "Tersimpan"
                  : "Menulis…"}
          </span>
        </span>
      </div>
      <div className="editorial-topbar-actions">
        {!p.focusMode && (
          <button
            type="button"
            onClick={p.onToggleLeft}
            aria-label="Daftar naskah"
            aria-expanded={!p.leftCollapsed}
          >
            <PanelLeft size={17} />
            <span>Naskah</span>
          </button>
        )}
        <button
          type="button"
          onClick={p.onToggleFocus}
          aria-label="Mode Fokus"
          aria-pressed={p.focusMode}
        >
          {p.focusMode ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          <span>{p.focusMode ? "Keluar fokus" : "Fokus"}</span>
        </button>
        <details
          ref={menu}
          className="studio-more"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.currentTarget.open = false;
              e.currentTarget.querySelector("summary")?.focus();
            }
          }}
        >
          <summary aria-label="Alat penulisan lainnya">
            <MoreHorizontal size={20} />
            <span>Alat</span>
          </summary>
          <div className="studio-more-panel">
            <button
              className="studio-more-focus"
              type="button"
              onClick={() => action(p.onToggleFocus)}
            >
              <Maximize2 size={16} />
              {p.focusMode ? "Keluar fokus" : "Mode fokus"}
            </button>
            <span className="studio-tool-group">MENULIS</span>
            <button type="button" onClick={() => action(p.onInsertBlockClick)}>
              <Plus size={16} />
              Sisipkan blok <kbd>/</kbd>
            </button>
            {p.onInsertTable && (
              <button type="button" onClick={() => action(p.onInsertTable)}>
                <TableIcon size={16} />
                Tabel editorial
              </button>
            )}
            <button
              type="button"
              onClick={() => action(p.onUndo)}
              disabled={!p.canUndo}
            >
              <Undo2 size={16} />
              Urungkan <kbd>Ctrl Z</kbd>
            </button>
            <button
              type="button"
              onClick={() => action(p.onRedo)}
              disabled={!p.canRedo}
            >
              <Redo2 size={16} />
              Ulangi <kbd>Ctrl Y</kbd>
            </button>
            <span className="studio-tool-group">KEMBANGKAN</span>
            {p.onOpenAiModal && (
              <button type="button" onClick={() => action(p.onOpenAiModal)}>
                <Bot size={16} />
                Asisten editorial{p.hasSelection ? " · teks dipilih" : ""}
              </button>
            )}
            {p.onOpenRepurposeModal && (
              <button
                type="button"
                onClick={() => action(p.onOpenRepurposeModal)}
              >
                <Sparkles size={16} />
                Turunkan menjadi konten
              </button>
            )}
          </div>
        </details>
        <button
          type="button"
          onClick={p.onOpenPreview}
          aria-label="Pratinjau naskah"
        >
          <Eye size={17} />
          <span>Pratinjau</span>
        </button>
        {!p.focusMode && (
          <button
            type="button"
            onClick={p.onToggleRight}
            aria-label="Pengaturan artikel"
            aria-expanded={!p.rightCollapsed}
          >
            <PanelRight size={17} />
            <span>Pengaturan</span>
          </button>
        )}
        <button
          className="editorial-publish"
          aria-label={
            p.article.status === "published"
              ? "Perbarui publikasi"
              : "Publikasikan"
          }
          type="button"
          onClick={p.onOpenPublishModal}
        >
          <Send size={16} />
          <span>
            {p.article.status === "published"
              ? p.canUpdate
                ? "Perbarui"
                : "Publikasi"
              : "Publikasikan"}
          </span>
        </button>
      </div>
    </header>
  );
}
