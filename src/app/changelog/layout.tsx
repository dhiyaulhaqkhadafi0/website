import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog',
  description:
    'Riwayat pembaruan sistem, peluncuran fitur baru, dan catatan rilis ekosistem digital khadafidaffa.com.',
  alternates: {
    canonical: 'https://khadafidaffa.com/changelog',
  },
  openGraph: {
    title: 'Changelog | Khadafi',
    description:
      'Riwayat pembaruan sistem, peluncuran fitur baru, dan catatan rilis ekosistem digital khadafidaffa.com.',
    url: 'https://khadafidaffa.com/changelog',
    siteName: 'Khadafi',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/assets/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Changelog | Khadafi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Changelog | Khadafi',
    description:
      'Riwayat pembaruan sistem, peluncuran fitur baru, dan catatan rilis ekosistem digital khadafidaffa.com.',
    images: ['/assets/og-image.png'],
  },
};

export default function ChangelogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
