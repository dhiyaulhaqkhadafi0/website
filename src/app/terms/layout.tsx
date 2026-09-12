import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ketentuan Layanan',
  description:
    'Syarat dan ketentuan penggunaan situs, konten, layanan, dan sumber daya digital Khadafi.',
  alternates: {
    canonical: 'https://khadafidaffa.com/terms',
  },
  openGraph: {
    title: 'Ketentuan Layanan | Khadafi',
    description:
      'Syarat dan ketentuan penggunaan situs, konten, layanan, dan sumber daya digital Khadafi.',
    url: 'https://khadafidaffa.com/terms',
    siteName: 'Khadafi',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/assets/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ketentuan Layanan | Khadafi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ketentuan Layanan | Khadafi',
    description:
      'Syarat dan ketentuan penggunaan situs, konten, layanan, dan sumber daya digital Khadafi.',
    images: ['/assets/og-image.png'],
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
