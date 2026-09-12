import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://khadafidaffa.com"),
  title: {
    default: "Khadafi — Kreator, Builder & Freelancer",
    template: "%s | Khadafi",
  },
  description:
    "Website resmi Khadafi: Kreator, Builder & Freelancer. Temukan riset AI, produk digital, panduan taktis, dan sumber daya gratis untuk membangun bisnis mandiri.",
  applicationName: "Khadafi",
  authors: [{ name: "Daffa Dhiyaulhaq Khadafi", url: "https://khadafidaffa.com" }],
  creator: "Daffa Dhiyaulhaq Khadafi",
  publisher: "Khadafi",
  alternates: {
    canonical: "https://khadafidaffa.com",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://khadafidaffa.com",
    siteName: "Khadafi",
    title: "Khadafi — Kreator, Builder & Freelancer",
    description:
      "Website resmi Khadafi: Kreator, Builder & Freelancer. Temukan riset AI, produk digital, panduan taktis, dan sumber daya gratis untuk membangun bisnis mandiri.",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "Khadafi — Kreator, Builder & Freelancer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Khadafi — Kreator, Builder & Freelancer",
    description:
      "Website resmi Khadafi: Kreator, Builder & Freelancer. Temukan riset AI, produk digital, panduan taktis, dan sumber daya gratis untuk membangun bisnis mandiri.",
    images: ["/assets/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "tvDzvqzKpVqYpHuHxRtfaLJHT6_mTg4AeQpKmp44m6k",
  },
};

import { Footer } from "@/components/shared/footer";
import { GlobalTranslator } from "@/components/shared/GlobalTranslator";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} antialiased scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-brand-bg text-brand-primary font-sans">
        <GlobalTranslator />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
