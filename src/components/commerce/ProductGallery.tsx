"use client";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, Minus, Plus, X } from "lucide-react";
import { ProductImage } from "./ProductImage";
import { BookCover } from "./BookCover";
import type { ProductMedia } from "@/lib/product-media";
import s from "./commerce.module.css";
export function ProductGallery({ name, cover, gallery = [] }: { name: string; cover: string; gallery?: ProductMedia[] }) {
  const images = [{ url: cover, alt: name + " — cover" }, ...gallery].filter(i => i.url);
  const [index, setIndex] = useState(0), [zoom, setZoom] = useState(1);
  const dialog = useRef<HTMLDialogElement>(null), opener = useRef<HTMLButtonElement>(null), touch = useRef(0);
  const current = images[index] || images[0];
  function move(delta: number) { setIndex(i => (i + delta + images.length) % images.length); setZoom(1); }
  return <div className={s.gallery}>
    <div className={s.galleryStage} onTouchStart={e => { touch.current = e.touches[0].clientX; }} onTouchEnd={e => { const delta = touch.current - e.changedTouches[0].clientX; if (images.length > 1 && Math.abs(delta) > 45) move(delta > 0 ? 1 : -1); }}>
      {index === 0 ? <BookCover name={name} cover={cover} /> : <ProductImage src={current.url} alt={current.alt || name} eager />}
      {current && <button ref={opener} className={s.expandImage} type="button" onClick={() => { setZoom(1); dialog.current?.showModal(); }} aria-label="Perbesar preview produk"><Expand size={17} /> Preview</button>}
    </div>
    {images.length > 1 && <div className={s.thumbnails} aria-label="Galeri produk">{images.map((item, i) => <button type="button" key={item.url + i} aria-label={"Lihat gambar " + (i + 1)} aria-pressed={i === index} onClick={() => { setIndex(i); setZoom(1); }}><ProductImage src={item.url} alt={item.alt || name} /></button>)}</div>}
    <p className={s.galleryCaption} aria-live="polite">{current?.alt || "Cover produk"}{images.length > 1 && ` · ${index + 1} / ${images.length}`}</p>
    <dialog ref={dialog} className={s.lightbox} aria-label={"Preview " + name} onClose={() => { setZoom(1); opener.current?.focus(); }} onKeyDown={e => { if (e.key === "ArrowRight") move(1); if (e.key === "ArrowLeft") move(-1); }}>
      <div className={s.lightboxToolbar}><span>{index + 1} / {images.length} · {Math.round(zoom * 100)}%</span><button type="button" aria-label="Zoom out" disabled={zoom <= 1} onClick={() => setZoom(z => Math.max(1, z - .5))}><Minus /></button><button type="button" aria-label="Zoom in" disabled={zoom >= 3} onClick={() => setZoom(z => Math.min(3, z + .5))}><Plus /></button><button type="button" aria-label="Tutup preview" onClick={() => dialog.current?.close()}><X /></button></div>
      <div className={s.lightboxCanvas}>{current && <div style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}><ProductImage src={current.url} alt={current.alt || name} eager /></div>}</div>
      <div className={s.lightboxToolbar}><button type="button" aria-label="Gambar sebelumnya" disabled={images.length < 2} onClick={() => move(-1)}><ArrowLeft /></button><p>{current?.alt || name}</p><button type="button" aria-label="Gambar berikutnya" disabled={images.length < 2} onClick={() => move(1)}><ArrowRight /></button></div>
    </dialog>
  </div>;
}
