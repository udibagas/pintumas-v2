'use client';

import { useState, useEffect } from 'react';
import { Clock, MessageCircle, Share2, BookmarkPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { formatTimeAgo } from '@/lib/utils';

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  image: string;
  category: string;
  categorySlug: string;
  categoryColor?: string;
  readTime: string;
  views: number;
  author: string;
  publishedAt: string | Date;
  createdAt: string | Date;
  comments: number;
}

interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export default function LatestNewsSection() {
  const [articles, setArticles] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsInitialLoading(true);
      setError(null);

      const response = await axios.get('/api/posts/latest?limit=6&offset=0');

      if (response.data.success) {
        setArticles(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      console.error('Error fetching latest posts:', err);
      setError('Failed to load articles');
    } finally {
      setIsInitialLoading(false);
    }
  };

  // Handle load more functionality
  const handleLoadMore = async () => {
    if (!pagination) return;

    setIsLoading(true);

    try {
      const response = await axios.get(`/api/posts/latest?limit=3&offset=${articles.length}`);

      if (response.data.success) {
        setArticles(prev => [...prev, ...response.data.data]);
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      console.error('Error loading more posts:', err);
      setError('Failed to load more articles');
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-6 w-96" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <Skeleton className="h-48" />
                <div className="p-6">
                  <Skeleton className="h-4 mb-3" />
                  <Skeleton className="h-6 mb-3" />
                  <Skeleton className="h-4 mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && articles.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchInitialData} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Berita Terkini</h2>
            <p className="text-lg text-gray-600">
              Tetap terkini dengan perkembangan terbaru dari Pelabuhan Tanjung Mas
            </p>
          </div>
          <Link href="/news">
            <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
              Lihat Semua Berita
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Link
              key={article.id}
              href={`/post/${article.slug}`}
              className="block"
            >
              <article
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer hover:-translate-y-1"
                style={{
                  animationDelay: `${(index % 3) * 100}ms`,
                  animation: index >= articles.length - 3 && !isLoading ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                }}
              >
                <div className="relative overflow-hidden">
                  <div className="w-full h-48 relative">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className="text-white font-semibold"
                      style={{ backgroundColor: article.categoryColor || '#3B82F6' }}>
                      {article.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span>Oleh {article.author}</span>
                    <span className="mx-2">•</span>
                    <span>{formatTimeAgo(article.publishedAt)}</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-yellow-700 transition-colors duration-200">
                    {article.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.summary}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{article.readTime}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span>{article.comments}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 text-gray-400 hover:text-yellow-600 transition-colors duration-200"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Handle bookmark functionality
                          console.log('Bookmarked:', article.title);
                        }}
                      >
                        <BookmarkPlus className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-yellow-600 transition-colors duration-200"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Handle share functionality
                          if (navigator.share) {
                            navigator.share({
                              title: article.title,
                              text: article.summary,
                              url: `/post/${article.slug}`
                            });
                          } else {
                            // Fallback - copy to clipboard
                            navigator.clipboard.writeText(`${window.location.origin}/post/${article.slug}`);
                            console.log('Link copied to clipboard');
                          }
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Progress Indicator */}
        {pagination && articles.length > 6 && (
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white rounded-full px-4 py-2 shadow-md">
              <span className="text-sm text-gray-600">
                Menampilkan <span className="font-semibold text-yellow-600">{articles.length}</span> dari <span className="font-semibold">{pagination.total}</span> artikel
              </span>
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          {pagination?.hasMore ? (
            <Button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Memuat Lebih Banyak...
                </>
              ) : (
                <>
                  Muat Lebih Banyak Artikel
                  <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                    {pagination.total - articles.length} lagi
                  </span>
                </>
              )}
            </Button>
          ) : (
            <div className="text-gray-500">
              <p className="text-lg font-medium mb-2">Anda telah mencapai akhir!</p>
              <p className="text-sm">
                Menampilkan semua {articles.length} artikel. Periksa kembali nanti untuk berita lebih lanjut.
              </p>
              <Link href="/news" className="inline-block mt-4">
                <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                  Lihat Semua Arsip Berita
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
