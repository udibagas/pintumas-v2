import HeroSection from '@/components/HeroSection';
import CategoriesSection from '@/components/CategoriesSection';
import LatestNewsSection from '@/components/LatestNewsSection';
import { Metadata } from 'next';
import DepartmentsWidget from '@/components/DepartmentsWidget';

export const metadata: Metadata = {
  title: 'Pintumas - Portal Berita Pelabuhan Tanjung Mas Semarang',
  description: 'Portal berita terpercaya untuk informasi terkini seputar Pelabuhan Tanjung Mas, industri maritim, logistik, perdagangan, dan berita terbaru lainnya di Semarang dan Indonesia.',
  keywords: 'pintumas, pelabuhan tanjung mas, berita maritim, logistik, perdagangan, shipping, pelabuhan semarang, jawa tengah, indonesia, portal berita',
  openGraph: {
    title: 'Pintumas - Portal Berita Pelabuhan Tanjung Mas',
    description: 'Portal berita terpercaya untuk informasi terkini seputar Pelabuhan Tanjung Mas, industri maritim, logistik, dan perdagangan.',
    type: 'website',
    siteName: 'Pintumas',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pintumas - Portal Berita Pelabuhan Tanjung Mas',
    description: 'Portal berita terpercaya untuk informasi terkini seputar Pelabuhan Tanjung Mas dan industri maritim.',
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <LatestNewsSection />
      <DepartmentsWidget />
    </>
  );
}
