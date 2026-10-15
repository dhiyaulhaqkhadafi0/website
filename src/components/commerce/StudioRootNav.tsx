"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
export function StudioRootNav() {
  const path = usePathname();
  if (path !== "/studio") return null;
  return (
    <nav
      aria-label="Studio modules"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 24,
        padding: "12px 24px",
        background: "#181a16",
        color: "#e8e3d5",
        fontSize: 13,
      }}
    >
      <Link href="/studio/affiliates" style={{ minHeight: 44, display: "flex", alignItems: "center" }}>Afiliasi</Link>
      <Link
        href="/studio/overview"
        style={{ minHeight: 44, display: "flex", alignItems: "center" }}
      >
        Ringkasan
      </Link>
      <Link
        href="/studio"
        style={{ minHeight: 44, display: "flex", alignItems: "center" }}
      >
        Khadafi Studio / Konten
      </Link>
      <Link
        href="/studio/products"
        style={{ minHeight: 44, display: "flex", alignItems: "center" }}
      >
        Produk ↗
      </Link>
      <Link
        href="/studio/orders"
        style={{ minHeight: 44, display: "flex", alignItems: "center" }}
      >
        Pesanan
      </Link>
      <Link
        href="/studio/customers"
        style={{ minHeight: 44, display: "flex", alignItems: "center" }}
      >
        Pelanggan
      </Link>
      <Link
        href="/studio/freelance"
        style={{ minHeight: 44, display: "flex", alignItems: "center" }}
      >
        Field Notes
      </Link>
    </nav>
  );
}
