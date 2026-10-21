"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Expand, Minus, Plus, RotateCcw, X } from "lucide-react";
import s from "./editorial-home.module.css";
import z from "./chikki-preview.module.css";
const detail = "/images/experience/chikki-detail-v1.webp";
export function ChikkiPreview() {
  const [open, setOpen] = useState(false), [zoom, setZoom] = useState(100);
  const dialog = useRef<HTMLDialogElement>(null), opener = useRef<HTMLButtonElement>(null), canvas = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  function scale(value: number) { setZoom(Math.min(400, Math.max(50, value))); }
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const element = canvas.current;
    const wheel = (e: WheelEvent) => { if (e.ctrlKey) { e.preventDefault(); setZoom(value => Math.max(50, Math.min(400, value + (e.deltaY < 0 ? 25 : -25)))); } };
    element?.addEventListener("wheel", wheel, { passive: false });
    return () => { document.body.style.overflow = previous; element?.removeEventListener("wheel", wheel); };
  }, [open]);
  return <figure className={s.laptopShowcase} aria-label="Eksplorasi antarmuka Chikki dalam mockup laptop">
    <div className={s.laptopAmbient} aria-hidden="true" />
    <div className={s.laptopScreen}><span className={s.laptopCamera} aria-hidden="true" /><Image src="/images/experience/chikki-preview-v1.webp" width={1200} height={900} sizes="(max-width: 860px) 90vw, 620px" unoptimized alt="Konsep UI Chikki: ruang menulis, karya digital, dan eksplorasi peluang" /></div>
    <div className={s.laptopBase} aria-hidden="true"><i /></div>
    <button ref={opener} type="button" className={z.opener} onClick={() => { setZoom(100); setOpen(true); dialog.current?.showModal(); }} aria-label="Perbesar tampilan UI Chikki"><Expand size={15} /> Lihat detail · zoom</button>
    <figcaption>CHIKKI / Konsep antarmuka · ilustrasi, bukan data transaksi</figcaption>
    <dialog ref={dialog} className={z.dialog} aria-labelledby="chikki-preview-title" onClose={() => { setOpen(false); setZoom(100); opener.current?.focus(); }} onKeyDown={e => {
      if (e.key === "+" || e.key === "=") { e.preventDefault(); scale(zoom + 25); }
      if (e.key === "-") { e.preventDefault(); scale(zoom - 25); }
      if (e.key === "0") { e.preventDefault(); scale(100); }
    }}>
      <div className={z.toolbar}><h2 id="chikki-preview-title">Lebih dekat dengan Chikki.</h2><div>
        <button type="button" aria-label="Perkecil tampilan Chikki" disabled={zoom <= 50} onClick={() => scale(zoom - 25)}><Minus size={18} /></button>
        <output aria-live="polite" aria-label="Persentase zoom Chikki">{zoom}%</output>
        <button type="button" aria-label="Perbesar tampilan Chikki" disabled={zoom >= 400} onClick={() => scale(zoom + 25)}><Plus size={18} /></button>
        <button type="button" aria-label="Reset zoom Chikki" onClick={() => { scale(100); canvas.current?.scrollTo(0, 0); }}><RotateCcw size={17} /></button>
        <button type="button" aria-label="Tutup preview Chikki" onClick={() => dialog.current?.close()}><X size={20} /></button>
      </div></div>
      <p className={z.help}>Gunakan +/− untuk membaca detail. Geser gambar saat diperbesar. Tekan 0 untuk reset, Esc untuk tutup.</p>
      <div ref={canvas} className={z.canvas} tabIndex={0} role="region" aria-label="Detail UI Chikki, area gambar yang dapat digeser"
        onPointerDown={e => { if (e.pointerType !== "mouse" || zoom <= 100) return; drag.current = { x: e.clientX, y: e.clientY, left: e.currentTarget.scrollLeft, top: e.currentTarget.scrollTop }; e.currentTarget.setPointerCapture(e.pointerId); e.preventDefault(); }}
        onPointerMove={e => { if (drag.current) { e.currentTarget.scrollLeft = drag.current.left - (e.clientX - drag.current.x); e.currentTarget.scrollTop = drag.current.top - (e.clientY - drag.current.y); } }}
        onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
        {open && <div className={z.surface} style={{ width: `${Math.max(100, zoom)}%` }}><div style={{ width: `${Math.min(100, zoom)}%` }}><Image src={detail} alt="Detail konsep antarmuka Chikki untuk eksplorasi tulisan, produk digital, dan peluang" width={1448} height={1086} unoptimized draggable={false} /></div></div>}
      </div>
      <p className={z.caption}>Ilustrasi konsep antarmuka. Angka dan akun pada visual bukan data transaksi pengguna.</p>
    </dialog>
  </figure>;
}
