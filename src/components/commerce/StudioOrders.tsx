"use client";
import { useState } from "react";
import { OrdersTable } from "./OrdersTable";
import { statusLabel, type Order } from "@/lib/commerce-types";
import s from "./commerce.module.css";
export function StudioOrders({ orders }: { orders: Order[] }) {
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const items = orders.filter(
    (o) =>
      (status === "all" || status === o.status) &&
      (
        o.customer_email +
        " " +
        o.customer_name +
        " " +
        o.id +
        " " +
        o.commerce_order_items.map((i) => i.product_name).join(" ")
      )
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <div className={s.toolbar}>
        <input
          aria-label="Cari pesanan"
          placeholder="Nama, email, produk, nomor pesanan…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className={s.tabs}>
        {["all", ...Object.keys(statusLabel)].map((t) => (
          <button
            className={s.tab}
            key={t}
            aria-pressed={t === status}
            onClick={() => setStatus(t)}
          >
            {t === "all" ? "Semua" : statusLabel[t as Order["status"]]}
          </button>
        ))}
      </div>
      {items.length ? (
        <OrdersTable studio orders={items} />
      ) : (
        <div className={s.notice} style={{ marginBottom: 70 }}>
          Belum ada pesanan yang sesuai.
        </div>
      )}
      <small>Menampilkan maksimal 250 pesanan terbaru.</small>
    </>
  );
}
