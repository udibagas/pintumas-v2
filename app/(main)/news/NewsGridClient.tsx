'use client';

import { useState } from 'react';
import { Clock, Eye, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { formatViews } from '@/lib/utils';

interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  image: string;
  category: string;
  categorySlug: string;
  categoryColor?: string;
  author: string;
  publishedAt: string | Date;
  readTime: string;
  comments: number;
  views: number;
  featured: boolean;
}

interface NewsGridClientProps {
  initialArticles: Article[];
}

export default function NewsGridClient({ initialArticles }: NewsGridClientProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles || []);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to format time ago
  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return postDate.toLocaleDateString('id-ID');
  };

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/posts?limit=6&offset=${articles.length}&featured=false`);

      if (response.data.success) {
        const newArticles = response.data.data;
        setArticles(prev => [...prev, ...newArticles]);
        setHasMore(response.data.pagination.hasMore);
      }
    } catch (err: any) {
      console.error('Error loading more articles:', err);
      setError('Failed to load more articles');
    } finally {
      setIsLoading(false);
    }
  };

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No articles found.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {articles.map((article, index) => (
          <Link key={article.id} href={`/post/${article.slug}`} className="block">
            <article className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer hover:-translate-y-1">
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
                  <span>By {article.author}</span>
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
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{formatViews(article.views)}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span>{article.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-center mb-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={handleLoadMore} variant="outline">
            Try Again
          </Button>
        </div>
      )}

      {/* Load More Button */}
      <div className="text-center">
        {hasMore ? (
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 text-lg font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Loading More Articles...
              </>
            ) : (
              'Muat Lebih Banyak'
            )}
          </Button>
        ) : (
          <div className="text-gray-500">
            <p className="text-lg">You have reached the end!</p>
            <p className="text-sm mt-2">No more articles to load</p>
          </div>
        )}
      </div>
    </div>
  );
}
