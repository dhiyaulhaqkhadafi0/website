"use client";
import s from "@/components/commerce/commerce.module.css";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <section className={s.success}>
      <h1>Katalog belum dapat dimuat.</h1>
      <p className={s.lead}>Koneksi sedang bermasalah. Silakan coba kembali.</p>
      <div className={s.actions}>
        <button className={s.button} onClick={reset}>
          Coba lagi
        </button>
      </div>
    </section>
  );
}
