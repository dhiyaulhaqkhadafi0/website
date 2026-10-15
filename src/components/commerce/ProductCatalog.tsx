"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { type Product, money } from "@/lib/commerce-types";
import { BookCover } from "./BookCover";
import s from "./commerce.module.css";
export function ProductCatalog({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState("Semua");
  const categories = ["Semua", ...new Set(products.map((p) => p.category))];
  const visible = products.filter(
    (p) => filter === "Semua" || p.category === filter,
  );
  return (
    <section id="koleksi" className={s.section}>
      <div className={s.sectionHeading}>
        <div>
          <span className={s.eyebrow}>THE COLLECTION</span>
          <h2>Bekal untuk langkah berikutnya.</h2>
        </div>
        <p>
          Produk yang dibuat dengan perhatian.
          <br />
          Pilih yang relevan dengan perjalananmu.
        </p>
      </div>
      {products.length > 0 && (
        <div className={s.tabs} aria-label="Filter kategori">
          {categories.map((c) => (
            <button
              key={c}
              className={s.tab}
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      {visible.length ? (
        <div className={s.productGrid}>
          {visible.map((p) => (
            <article className={s.productCard} key={p.id}>
              <Link href={"/products/" + p.slug}>
                <BookCover name={p.name} cover={p.cover_url} />
                <span className={s.eyebrow}>
                  {p.category} / DIGITAL EDITION
                </span>
                <h3>{p.name}</h3>
                <p>{p.short_description}</p>
                <div className={s.cardFoot}>
                  <strong>{money(p.price)}</strong>
                  <span>
                    Lihat produk <ArrowUpRight aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className={s.empty}>
          <div>
            <span className={s.eyebrow}>GOOD THINGS TAKE CARE</span>
            <h3>Koleksi pertama sedang disiapkan.</h3>
            <p>
              Aku sedang merapikan produk pertamaku. Sambil menunggu, jelajahi
              panduan dan resources gratis yang sudah bisa kamu gunakan.
            </p>
            <div className={s.actions}>
              <Link className={s.secondary} href="/resources">
                Jelajahi resources <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className={s.emptyVisual} aria-hidden="true">
            <div className={s.sheet}>
              <small>01 / AN IDEA</small>Think.
              <br />
              Build.
            </div>
            <div className={s.sheet}>
              <small>02 / A PRACTICE</small>Make it
              <br />
              useful.
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
