import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: 'Pintumas - Portal Berita Pelabuhan Tanjung Mas',
  description: 'Portal berita terpercaya dengan informasi terkini seputar Pelabuhan Tanjung Mas, perdagangan maritim, logistik, dan berita terbaru lainnya.',
  keywords: 'berita, pelabuhan tanjung mas, maritim, logistik, perdagangan, shipping, semarang, jawa tengah, indonesia',
  authors: [{ name: 'Tim Pintumas' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Pintumas - Portal Berita Pelabuhan Tanjung Mas',
    description: 'Portal berita terpercaya dengan informasi terkini seputar Pelabuhan Tanjung Mas, perdagangan maritim, logistik, dan berita terbaru lainnya.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Pintumas',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pintumas - Portal Berita Pelabuhan Tanjung Mas',
    description: 'Portal berita terpercaya dengan informasi terkini seputar Pelabuhan Tanjung Mas dan industri maritim.',
  },
  other: {
    'language': 'id-ID',
    'geo.region': 'ID-JT',
    'geo.placename': 'Semarang',
    'geo.position': '-6.966667;110.416664',
    'ICBM': '-6.966667, 110.416664',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}