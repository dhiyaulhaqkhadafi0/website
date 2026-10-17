/* eslint-disable @next/next/no-img-element -- Validated CMS media with client-side failure recovery. */
"use client";
import { useState } from "react";
import { mediaUrl } from "@/lib/product-media";
export function ProductImage({ src, alt, className, eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  const url = mediaUrl(src);
  const [failed, setFailed] = useState("");
  return url && failed !== url ? <img className={className} src={url} alt={alt} width={900} height={1350} loading={eager ? "eager" : "lazy"} onError={() => setFailed(url)} /> :
    <div className={className} role="img" aria-label={alt} style={{ minHeight: 230, padding: 24, background: "#eae5d8", color: "#29242e", display: "grid", alignContent: "space-between", gap: 24 }}><small>KHADAFI / DIGITAL EDITION</small><strong style={{ fontFamily: "Georgia, serif", fontSize: 26 }}>{alt}</strong><small>Preview gambar belum tersedia</small></div>;
}
