import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Semua Kategori - Pintumas',
  description: 'Jelajahi semua kategori berita di Pintumas. Temukan berita sesuai minat Anda dari berbagai kategori seperti maritim, logistik, perdagangan, dan lainnya.',
  keywords: 'kategori berita, maritim, logistik, perdagangan, shipping, pelabuhan, semarang, pintumas',
  openGraph: {
    title: 'Semua Kategori - Pintumas',
    description: 'Jelajahi semua kategori berita di Pintumas. Temukan berita sesuai minat Anda dari berbagai kategori.',
    type: 'website',
    siteName: 'Pintumas',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Semua Kategori - Pintumas',
    description: 'Jelajahi semua kategori berita di Pintumas.',
  },
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
