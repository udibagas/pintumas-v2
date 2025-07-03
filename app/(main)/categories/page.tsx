'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Search, TrendingUp, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import axios from 'axios';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  articles: number;
  trending: boolean;
  recentArticles: string[];
}

export default function AllCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/categories?detailed=true');
        if (response.data.success) {
          setCategories(response.data.data);
        } else {
          setError('Failed to fetch categories');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const trendingCategories = categories.filter(cat => cat.trending);
  const totalArticles = categories.reduce((sum, cat) => sum + cat.articles, 0);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Categories</h3>
          <p className="text-gray-600">Please wait while we fetch the latest categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Categories</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-6 transition-colors duration-200">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Beranda
      </Link>

      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Semua Kategori
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Jelajahi berita di berbagai topik dan temukan cerita yang penting bagi Anda.
          Dari berita terkini hingga analisis mendalam, temukan semuanya di satu tempat.
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center space-x-8 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
            <div className="text-sm text-gray-500">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalArticles.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Total Articles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{trendingCategories.length}</div>
            <div className="text-sm text-gray-500">Trending</div>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <Input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Trending Categories */}
      {!searchTerm && (
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-6 w-6 text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-900">Trending Categories</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingCategories.slice(0, 6).map((category, index) => (
              <Link key={index} href={`/category/${category.slug}`}>
                <div className="group cursor-pointer bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-yellow-300 hover:-translate-y-2">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${category.color} w-12 h-12 rounded-full flex items-center justify-center`}>
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <Badge className="bg-yellow-500 text-black font-semibold">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-yellow-700 transition-colors duration-200">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{category.articles.toLocaleString()} artikel</span>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Updated daily</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Categories */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {searchTerm ? `Search Results (${filteredCategories.length})` : 'All Categories'}
        </h2>

        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredCategories.map((category, index) => (
              <Link key={index} href={`/category/${category.slug}`}>
                <div className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-yellow-300">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <FileText className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-yellow-700 transition-colors duration-200">
                            {category.name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>{category.articles.toLocaleString()} articles</span>
                            {category.trending && (
                              <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {category.description}
                    </p>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Artikel Terkini:</h4>
                      {category.recentArticles && category.recentArticles.length > 0 ? (
                        <ul className="space-y-2">
                          {category.recentArticles.slice(0, 3).map((article, articleIndex) => (
                            <li key={articleIndex} className="text-sm text-gray-600 hover:text-yellow-600 transition-colors duration-200 line-clamp-1">
                              • {article}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 italic">Tidak ada artikel</p>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <Button variant="outline" className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-50 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
                        Jelajahi {category.name}
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}