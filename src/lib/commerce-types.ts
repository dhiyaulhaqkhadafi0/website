import { CREATOR_NAME, mediaUrl, type ProductMedia } from "./product-media";
export const CATEGORIES = [
  "Ebook",
  "Guide",
  "Template",
  "Toolkit",
  "Resource",
  "Digital Product",
] as const;
export type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  category: (typeof CATEGORIES)[number];
  price: number;
  currency: "IDR";
  cover_url: string;
  creator_name?: string;
  gallery?: ProductMedia[];
  status: "draft" | "published" | "archived";
  featured: boolean;
  included: string[];
  audience: string;
  preview: string;
  seo_title: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
};
export type Order = {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: "pending" | "paid" | "failed" | "expired" | "cancelled" | "refunded";
  provider: string;
  payment_url: string | null;
  created_at: string;
  commerce_order_items: {
    product_id: string;
    product_name: string;
    price: number;
  }[];
};
export const money = (price: number) =>
  price === 0
    ? "Gratis"
    : new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(price);
export const statusLabel: Record<Order["status"], string> = {
  pending: "Menunggu pembayaran",
  paid: "Lunas",
  failed: "Gagal",
  expired: "Kedaluwarsa",
  cancelled: "Dibatalkan",
  refunded: "Dikembalikan",
};
export function safeReturnTo(value: string | null | undefined) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\r\n]/.test(value)
  )
    return "/account";
  try {
    const url = new URL(value, "https://khadafidaffa.com");
    return url.origin === "https://khadafidaffa.com"
      ? url.pathname + url.search
      : "/account";
  } catch {
    return "/account";
  }
}
export function paymentStatus(
  status: string,
  fraud?: string,
): Order["status"] | null {
  if (status === "settlement" || (status === "capture" && fraud === "accept"))
    return "paid";
  if (status === "refund") return "refunded";
  if (status === "pending" || (status === "capture" && fraud === "challenge"))
    return "pending";
  if (status === "deny" || status === "failure") return "failed";
  if (status === "expire") return "expired";
  if (status === "cancel") return "cancelled";
  return null;
}
export function validateProduct(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new Error("Data produk tidak valid.");
  const p = input as Record<string, unknown>;
  const str = (key: string, max: number) => {
    const v = p[key];
    if (typeof v !== "string" || v.length > max)
      throw new Error("Kolom " + key + " tidak valid.");
    return v.trim();
  };
  const name = str("name", 180),
    slug = str("slug", 160);
  if (!name || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug))
    throw new Error("Nama dan slug produk wajib diisi dengan benar.");
  if (
    [
      "original",
      "recommended",
      "chatgpt",
      "figma",
      "notion",
      "vercel",
    ].includes(slug)
  )
    throw new Error(
      "Slug tersebut digunakan oleh koleksi atau rekomendasi storefront.",
    );
  if (!CATEGORIES.includes(p.category as Product["category"]))
    throw new Error("Kategori tidak valid.");
  if (
    !Number.isInteger(p.price) ||
    Number(p.price) < 0 ||
    Number(p.price) > 100000000
  )
    throw new Error("Harga harus berupa rupiah bulat yang valid.");
  if (!["draft", "published", "archived"].includes(String(p.status)))
    throw new Error("Status tidak valid.");
  const cover_input = str("cover_url", 2048);
  const cover_url = mediaUrl(cover_input);
  if (cover_input && !cover_url) throw new Error("Gunakan URL HTTPS, path situs, atau storage key gambar yang valid.");
  if (
    cover_url &&
    !(cover_url.startsWith("/") && !cover_url.startsWith("//")) &&
    !/^https:\/\//.test(cover_url)
  )
    throw new Error("URL cover tidak valid.");
  if (
    !Array.isArray(p.included) ||
    p.included.length > 60 ||
    p.included.some((v) => typeof v !== "string" || v.length > 400)
  )
    throw new Error("Daftar isi tidak valid.");
  return {
    name,
    slug,
    category: p.category as Product["category"],
    price: Number(p.price),
    status: p.status as Product["status"],
    cover_url,
    creator_name: typeof p.creator_name === "string" && p.creator_name.trim() ? str("creator_name", 180) : CREATOR_NAME,
    ...(p.gallery === undefined ? {} : { gallery: validateGallery(p.gallery) }),
    featured: p.featured === true,
    short_description: str("short_description", 500),
    description: str("description", 15000),
    audience: str("audience", 3000),
    preview: str("preview", 10000),
    seo_title: str("seo_title", 180),
    seo_description: str("seo_description", 320),
    included: p.included.map((v) => v.trim()).filter(Boolean),
  };
}
export function validateGallery(input: unknown): ProductMedia[] {
  if (!Array.isArray(input) || input.length > 12) throw new Error("Galeri maksimal 12 gambar.");
  return input.map((item) => {
    if (!item || typeof item !== "object" || typeof item.url !== "string" || item.url.length > 2048 || typeof item.alt !== "string" || item.alt.length > 180) throw new Error("Media galeri tidak valid.");
    const url = mediaUrl(item.url);
    if (!url) throw new Error("Alamat gambar galeri tidak valid.");
    return { url, alt: item.alt.trim() };
  });
}
