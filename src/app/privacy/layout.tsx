import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description:
    'Kebijakan privasi dan perlindungan data pengguna di platform khadafidaffa.com.',
  alternates: {
    canonical: 'https://khadafidaffa.com/privacy',
  },
  openGraph: {
    title: 'Kebijakan Privasi | Khadafi',
    description:
      'Kebijakan privasi dan perlindungan data pengguna di platform khadafidaffa.com.',
    url: 'https://khadafidaffa.com/privacy',
    siteName: 'Khadafi',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/assets/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Kebijakan Privasi | Khadafi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kebijakan Privasi | Khadafi',
    description:
      'Kebijakan privasi dan perlindungan data pengguna di platform khadafidaffa.com.',
    images: ['/assets/og-image.png'],
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
