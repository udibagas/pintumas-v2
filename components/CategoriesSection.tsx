import {
  Briefcase,
  Monitor,
  Activity,
  Globe,
  Trophy,
  Microscope,
  Gavel,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CategoriesSection() {
  const categories = [
    { name: 'Business', icon: Briefcase, color: 'bg-blue-500', articles: 1247 },
    { name: 'Technology', icon: Monitor, color: 'bg-purple-500', articles: 892 },
    { name: 'Health', icon: Activity, color: 'bg-green-500', articles: 634 },
    { name: 'World', icon: Globe, color: 'bg-indigo-500', articles: 1156 },
    { name: 'Sports', icon: Trophy, color: 'bg-orange-500', articles: 743 },
    { name: 'Science', icon: Microscope, color: 'bg-teal-500', articles: 521 },
    { name: 'Politics', icon: Gavel, color: 'bg-red-500', articles: 934 },
    { name: 'Culture', icon: Palette, color: 'bg-pink-500', articles: 412 }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Kategori Berita
          </h2>
          <p className="text-gray-600">
            Jelajahi berita berdasarkan topik yang Anda minati
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link key={index} href={`/category/${category.name.toLowerCase()}`}>
                <div className="group cursor-pointer bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-yellow-300">
                  <div className="text-center">
                    <div className={`${category.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-200`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-yellow-700 transition-colors duration-200">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {category.articles.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link href="/categories">
            <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
              Lihat Semua Kategori
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}