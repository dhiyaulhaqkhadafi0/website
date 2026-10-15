"use client";
import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import { money, type Product } from "@/lib/commerce-types";
import s from "./commerce.module.css";
export function StudioProducts({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Semua");
  const items = products.filter(
    (p) =>
      (status === "Semua" || p.status === status) &&
      p.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <div className={s.toolbar}>
        <input
          aria-label="Cari produk"
          placeholder="Cari produk…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Link href="/studio/products/new" className={s.button}>
          <Plus size={17} />
          Produk baru
        </Link>
      </div>
      <div className={s.tabs}>
        {["Semua", "draft", "published", "archived"].map((t) => (
          <button
            className={s.tab}
            aria-pressed={status === t}
            onClick={() => setStatus(t)}
            key={t}
          >
            {t === "Semua" ? t : t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {items.length ? (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td data-label="Produk">
                    <div>
                      <strong>{p.name}</strong>
                      <small>/products/{p.slug}</small>
                    </div>
                  </td>
                  <td data-label="Kategori">{p.category}</td>
                  <td data-label="Harga">{money(p.price)}</td>
                  <td data-label="Status">
                    <span className={s.badge}>{p.status}</span>
                  </td>
                  <td data-label="Aksi">
                    <Link href={"/studio/products/" + p.id}>
                      Edit produk ↗
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={s.notice}>
          Tidak ada produk yang sesuai. Buat produk baru atau ubah filter.
        </div>
      )}
    </>
  );
}
