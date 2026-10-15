import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { PRIVACY_SECTIONS } from "@/content/legal";
export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Bagaimana Khadafi menggunakan data akun, newsletter, transaksi, dan referral, serta pilihan Anda.",
  alternates: { canonical: "https://khadafidaffa.com/privacy" },
};
export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Kebijakan Privasi"
      summary="Penjelasan tentang data yang digunakan, tujuannya, dan pilihan yang tetap ada di tangan Anda."
      path="/privacy"
      sections={PRIVACY_SECTIONS}
    />
  );
}
