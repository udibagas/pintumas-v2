'use client';

import { useState, useEffect } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import axios from 'axios';

interface Category {
  id: string;
  name: string;
  slug: string;
  articles: number;
  color?: string;
}

// Icon mapping for categories
const getIconForCategory = (name: string) => {
  const iconMap: { [key: string]: any } = {
    'Business': Briefcase,
    'Technology': Monitor,
    'Health': Activity,
    'World': Globe,
    'Sports': Trophy,
    'Science': Microscope,
    'Politics': Gavel,
    'Culture': Palette
  };
  return iconMap[name] || Globe;
};

// Color mapping for categories
const getColorForCategory = (name: string) => {
  const colorMap: { [key: string]: string } = {
    'Business': 'bg-blue-500',
    'Technology': 'bg-purple-500',
    'Health': 'bg-green-500',
    'World': 'bg-indigo-500',
    'Sports': 'bg-orange-500',
    'Science': 'bg-teal-500',
    'Politics': 'bg-red-500',
    'Culture': 'bg-pink-500'
  };
  return colorMap[name] || 'bg-gray-500';
};

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/categories');

      if (response.data.success) {
        setCategories(response.data.data);
      } else {
        throw new Error('Failed to fetch categories');
      }
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');

      // Fallback data
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

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

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {/* Loading skeleton */}
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-xs border border-gray-100">
                <div className="text-center">
                  <Skeleton className="w-12 h-12 rounded-full mx-auto mb-3" />
                  <Skeleton className="h-4 mb-2" />
                  <Skeleton className="h-3 w-8 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchCategories} variant="outline">
              Coba Lagi
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => {
              const IconComponent = getIconForCategory(category.name);
              const color = category.color || getColorForCategory(category.name);

              return (
                <Link key={category.id} href={`/category/${category.slug}`}>
                  <div className="group cursor-pointer bg-white rounded-xl p-4 shadow-xs hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-yellow-300">
                    <div className="text-center">
                      <div className={`${color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-200`}>
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
        )}

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