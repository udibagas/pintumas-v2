import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PintuMas - Pusat Informasi Terpadu Pelabuhan Tanjung Mas',
  description: 'Stay informed with comprehensive news coverage from around the globe. Breaking news, politics, business, technology, sports, and more.',
  keywords: 'news, breaking news, politics, business, technology, sports, world news, latest news',
  authors: [{ name: 'PintuMas Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'PintuMas - Pusat Informasi Terpadu Pelabuhan Tanjung Mas',
    description: 'Stay informed with comprehensive news coverage from around the globe.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PintuMas - Pusat Informasi Terpadu Pelabuhan Tanjung Mas',
    description: 'Stay informed with comprehensive news coverage from around the globe.',
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