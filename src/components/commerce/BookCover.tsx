/* eslint-disable @next/next/no-img-element -- CMS covers support validated HTTPS URLs without an image proxy allowlist. */
import s from "./commerce.module.css";
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
      <div className={s.book}>
        {cover ? (
          <img src={cover} alt={name} width={600} height={900} loading="lazy" />
        ) : (
          <div className={s.bookFallback}>
            <small>KHADAFI / DIGITAL EDITION</small>
            <strong>{name}</strong>
            <div className={s.bookMark} aria-hidden="true">
              ↗
            </div>
            <small>DAFFA KHADAFI</small>
          </div>
        )}
      </div>
      {label && <span className={s.annotation}>{label}</span>}
    </figure>
  );
}
