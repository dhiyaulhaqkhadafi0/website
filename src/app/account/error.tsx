"use client";
import s from "@/components/commerce/commerce.module.css";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <section className={s.success}>
      <h1>Akun belum dapat dimuat.</h1>
      <p className={s.lead}>Silakan coba kembali.</p>
      <button className={s.button} onClick={reset}>
        Coba lagi
      </button>
    </section>
  );
}
