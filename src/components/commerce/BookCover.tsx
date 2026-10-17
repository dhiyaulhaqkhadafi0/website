/* eslint-disable @next/next/no-img-element -- CMS covers support validated HTTPS URLs without an image proxy allowlist. */
import s from "./commerce.module.css";
import { ProductImage } from "./ProductImage";
import { CREATOR_NAME } from "@/lib/product-media";
export function BookCover({
  name,
  cover,
  label,
}: {
  name: string;
  cover?: string;
  label?: string;
}) {
  return (
    <figure className={s.bookScene} aria-label={"Cover " + name}>
      <div className={`${s.book} ${cover?.includes("mockup") ? s.mockupBook : ""}`}>
        {cover ? (
          <ProductImage src={cover} alt={name} />
        ) : (
          <div className={s.bookFallback}>
            <small>KHADAFI / DIGITAL EDITION</small>
            <strong>{name}</strong>
            <div className={s.bookMark} aria-hidden="true">
              ↗
            </div>
            <small>{CREATOR_NAME}</small>
          </div>
        )}
      </div>
      {label && <span className={s.annotation}>{label}</span>}
    </figure>
  );
}
