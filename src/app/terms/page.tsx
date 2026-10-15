import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { TERMS_SECTIONS } from "@/content/legal";
export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description:
    "Ketentuan penggunaan akun, karya, produk digital, peluang freelance, newsletter, dan layanan Khadafi.",
  alternates: { canonical: "https://khadafidaffa.com/terms" },
};
export default function TermsPage() {
  return (
    <LegalDocument
      title="Syarat & Ketentuan"
      summary="Pedoman menggunakan situs, karya, dan fitur yang tersedia dengan jelas dan bertanggung jawab."
      path="/terms"
      sections={TERMS_SECTIONS}
    />
  );
}
