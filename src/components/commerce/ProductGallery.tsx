"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, Expand, Minus, Plus, RotateCcw, X } from "lucide-react";
import { ProductImage } from "./ProductImage";
import { BookCover } from "./BookCover";
import type { ProductMedia } from "@/lib/product-media";
import s from "./commerce.module.css";
const levels = [50, 75, 100, 125, 150];
const subscribe = () => () => {};
export function ProductGallery({ name, cover, gallery = [] }: { name: string; cover: string; gallery?: ProductMedia[] }) {
  const images = [{ url: cover, alt: name + " — cover" }, ...gallery].filter(i => i.url);
  const [index, setIndex] = useState(0), [zoom, setZoom] = useState(100);
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const dialog = useRef<HTMLDialogElement>(null), opener = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLDivElement>(null), touch = useRef(0);
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const current = images[index] || images[0];
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const wheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return;
      event.preventDefault();
      setZoom(value => levels[Math.max(0, Math.min(levels.length - 1, levels.indexOf(value) + (event.deltaY > 0 ? -1 : 1)))]);
      element.scrollTo({ left: 0, top: 0 });
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, []);
  function scale(value: number) { setZoom(value); canvas.current?.scrollTo({ left: 0, top: 0 }); }
  function move(delta: number) { if (images.length) setIndex(i => (i + delta + images.length) % images.length); scale(100); }
  function step(delta: number) { scale(levels[Math.max(0, Math.min(levels.length - 1, levels.indexOf(zoom) + delta))]); }
  return <div className={s.gallery} data-gallery-ready={hydrated}>
    <div className={s.galleryStage} onTouchStart={e => { touch.current = e.touches[0].clientX; }} onTouchEnd={e => { const delta = touch.current - e.changedTouches[0].clientX; if (images.length > 1 && Math.abs(delta) > 45) move(delta > 0 ? 1 : -1); }}>
      {index === 0 ? <BookCover name={name} cover={cover} /> : current && <ProductImage src={current.url} alt={current.alt || name} eager />}
      {current && <button ref={opener} className={s.expandImage} disabled={!hydrated} type="button" onClick={() => { scale(100); dialog.current?.showModal(); }} aria-label="Perbesar preview produk"><Expand size={17} /> Preview</button>}
    </div>
    {images.length > 1 && <div className={s.thumbnails} aria-label="Galeri produk">{images.map((item, i) => <button type="button" key={item.url + i} aria-label={"Lihat gambar " + (i + 1)} aria-pressed={i === index} onClick={() => { setIndex(i); scale(100); }}><ProductImage src={item.url} alt={item.alt || name} /></button>)}</div>}
    <p className={s.galleryCaption} aria-live="polite">{current?.alt || "Cover produk"}{images.length > 1 && ` · ${index + 1} / ${images.length}`}</p>
    <dialog ref={dialog} className={s.lightbox} aria-label={"Preview " + name} onClose={() => { scale(100); opener.current?.focus(); }} onKeyDown={e => {
      if ((e.target as HTMLElement).tagName === "SELECT") return;
      if (e.key === "ArrowRight") { e.preventDefault(); move(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
      if (e.key === "+" || e.key === "=") { e.preventDefault(); step(1); }
      if (e.key === "-") { e.preventDefault(); step(-1); }
      if (e.key === "0") { e.preventDefault(); scale(100); }
    }}>
      <div className={s.lightboxToolbar}>
        <span aria-live="polite">{index + 1} / {images.length} · {zoom}%</span>
        <button type="button" aria-label="Zoom out" disabled={zoom === 50} onClick={() => step(-1)}><Minus /></button>
        <label className={s.zoomLabel}>Zoom<select aria-label="Persentase zoom" value={zoom} onChange={e => scale(Number(e.target.value))}>{levels.map(level => <option key={level} value={level}>{level}%</option>)}</select></label>
        <button type="button" aria-label="Zoom in" disabled={zoom === 150} onClick={() => step(1)}><Plus /></button>
        <button type="button" aria-label="Reset zoom ke 100%" onClick={() => scale(100)}><RotateCcw /></button>
        <button type="button" aria-label="Tutup preview" onClick={() => dialog.current?.close()}><X /></button>
      </div>
      <p className={s.zoomHelp}>100% = gambar utuh sesuai ruang layar. Saat diperbesar, geser untuk melihat detail.</p>
      <div ref={canvas} className={s.lightboxCanvas} tabIndex={0} role="region" aria-label="Gambar produk, area geser saat diperbesar"
        onPointerDown={e => { if (zoom <= 100 || e.pointerType !== "mouse") return; drag.current = { x: e.clientX, y: e.clientY, left: e.currentTarget.scrollLeft, top: e.currentTarget.scrollTop }; e.currentTarget.setPointerCapture(e.pointerId); e.preventDefault(); }}
        onPointerMove={e => { if (drag.current) { e.currentTarget.scrollLeft = drag.current.left - (e.clientX - drag.current.x); e.currentTarget.scrollTop = drag.current.top - (e.clientY - drag.current.y); } }}
        onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
        {current && <div className={s.zoomSurface} style={{ width: `${Math.max(100, zoom)}%`, height: `${Math.max(100, zoom)}%` }}><div style={{ width: `${Math.min(100, zoom)}%`, height: `${Math.min(100, zoom)}%` }}><ProductImage src={current.url} alt={current.alt || name} eager /></div></div>}
      </div>
      <div className={s.lightboxToolbar}><button type="button" aria-label="Gambar sebelumnya" disabled={images.length < 2} onClick={() => move(-1)}><ArrowLeft /></button><p>{current?.alt || name}</p><button type="button" aria-label="Gambar berikutnya" disabled={images.length < 2} onClick={() => move(1)}><ArrowRight /></button></div>
    </dialog>
  </div>;
}
