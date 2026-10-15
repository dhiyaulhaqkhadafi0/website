"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import s from "./commerce.module.css";
export function PrivateNav({ studio = false }: { studio?: boolean }) {
  const path = usePathname();
  const router = useRouter();
  const links = studio
    ? [
        ["Ringkasan", "/studio/overview"],
        ["Konten", "/studio"],
        ["Produk", "/studio/products"],
        ["Pesanan", "/studio/orders"],
        ["Pelanggan", "/studio/customers"],
        ["Subscriber", "/studio/freelance"],
        ["Afiliasi", "/studio/affiliates"],
      ]
    : [
        ["Ringkasan", "/account"],
        ["Produk Saya", "/account/library"],
        ["Riwayat Pembelian", "/account/orders"],
        ["Profil", "/account/profile"],
      ];
  async function logout() {
    await supabase.auth.signOut();
    await fetch("/api/auth/session", { method: "DELETE" });
    router.replace("/login");
    router.refresh();
  }
  return (
    <nav
      className={s.privateNav}
      aria-label={studio ? "Navigasi Studio" : "Navigasi akun"}
    >
      {links.map(([label, href]) => (
        <Link
          key={href}
          href={href}
          aria-current={path === href ? "page" : undefined}
        >
          {label}
        </Link>
      ))}
      {!studio && <a href="mailto:daffadhiyaulhaqkhadafi@gmail.com">Bantuan</a>}
      <button onClick={() => void logout()}>Keluar ↗</button>
    </nav>
  );
}
