import type { Metadata } from "next";
import {
  Storefront,
  type ShopSearchParams,
} from "@/components/shop/Storefront";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Rekomendasi Tools — Curated for You",
  description:
    "Tools pilihan untuk AI, desain, dokumentasi, dan deployment. Kenali manfaat, batas, serta website resmi sebelum memilih.",
  alternates: { canonical: "/products/recommended" },
};
export default function Recommended({
  searchParams,
}: {
  searchParams: ShopSearchParams;
}) {
  return <Storefront searchParams={searchParams} mode="recommended" />;
}
