import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tentang',
  description:
    'Profil, latar belakang, prinsip kerja, dan visi eksekusi Daffa Dhiyaulhaq Khadafi sebagai kreator, builder, dan freelancer.',
  alternates: {
    canonical: 'https://khadafidaffa.com/about',
  },
  openGraph: {
    title: 'Tentang | Khadafi',
    description:
      'Profil, latar belakang, prinsip kerja, dan visi eksekusi Daffa Dhiyaulhaq Khadafi sebagai kreator, builder, dan freelancer.',
    url: 'https://khadafidaffa.com/about',
    siteName: 'Khadafi',
    locale: 'id_ID',
    type: 'profile',
    images: [
      {
        url: '/assets/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tentang Khadafi | Khadafi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tentang | Khadafi',
    description:
      'Profil, latar belakang, prinsip kerja, dan visi eksekusi Daffa Dhiyaulhaq Khadafi sebagai kreator, builder, dan freelancer.',
    images: ['/assets/og-image.png'],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
