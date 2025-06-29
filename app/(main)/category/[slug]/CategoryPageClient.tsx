'use client';

import { useState } from 'react';
import { Filter, Grid, List, Clock, Eye, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  image: string;
  author: string;
  publishedAt: string | Date;
  readTime: string;
  views: number;
  comments: number;
  featured: boolean;
}

interface CategoryPageClientProps {
  initialPosts: Article[];
  categorySlug: string;
}

export default function CategoryPageClient({ initialPosts, categorySlug }: CategoryPageClientProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('latest');
  const [articles, setArticles] = useState<Article[]>(initialPosts.filter(p => !p.featured));
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleArticles, setVisibleArticles] = useState(6);

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

  // Helper function to format views
  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const handleSortChange = async (newSortBy: string) => {
    setSortBy(newSortBy);
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/categories/${categorySlug}/posts?limit=12&offset=0&sortBy=${newSortBy}`);

      if (response.data.success) {
        const newArticles = response.data.data.posts.filter((p: Article) => !p.featured);
        setArticles(newArticles);
        setHasMore(response.data.data.pagination.hasMore);
        setVisibleArticles(6); // Reset visible articles
      }
    } catch (err: any) {
      console.error('Error sorting articles:', err);
      setError('Failed to sort articles');
    } finally {
      setIsLoading(false);
    }
  };

  const regularArticles = articles.filter(article => !article.featured);
  const displayedArticles = regularArticles.slice(0, visibleArticles);
  const hasMoreArticles = hasMore || visibleArticles < regularArticles.length;

  // Handle load more functionality
  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      // First try to load more from current articles
      if (visibleArticles < regularArticles.length) {
        setVisibleArticles(prev => Math.min(prev + 6, regularArticles.length));
      } else {
        // Load more from API
        const response = await axios.get(`/api/categories/${categorySlug}/posts?limit=6&offset=${articles.length}&sortBy=${sortBy}`);

        if (response.data.success) {
          const newArticles = response.data.data.posts.filter((p: Article) => !p.featured);
          setArticles(prev => [...prev, ...newArticles]);
          setHasMore(response.data.data.pagination.hasMore);
          setVisibleArticles(prev => prev + newArticles.length);
        }
      }
    } catch (err: any) {
      console.error('Error loading more articles:', err);
      setError('Failed to load more articles');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : ''}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Articles Grid/List */}
      <section>
        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedArticles.map((article, index) => (
              <Link key={article.id} href={`/post/${article.slug}`} className="block">
                <article
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer hover:-translate-y-1 ${index >= visibleArticles - 3 && visibleArticles > 6 ? 'animate-fadeInUp' : ''
                    }`}
                >
                  <div className="relative overflow-hidden">
                    <Image
                      width={800}
                      height={450}
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
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
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span>{article.comments}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{formatViews(article.views)}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {displayedArticles.map((article, index) => (
              <Link key={article.id} href={`/post/${article.slug}`} className="block">
                <article
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer ${index >= visibleArticles - 3 && visibleArticles > 6 ? 'animate-fadeInUp' : ''
                    }`}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <Image
                        width={800}
                        height={450}
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span>By {article.author}</span>
                        <span className="mx-2">•</span>
                        <span>{formatTimeAgo(article.publishedAt)}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-yellow-700 transition-colors duration-200">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{article.readTime}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            <span>{article.comments}</span>
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>{formatViews(article.views)}</span>
                          </div>
                        </div>
                        <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                          Read More
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Progress Indicator */}
      {visibleArticles > 6 && (
        <div className="flex items-center justify-center my-8">
          <div className="bg-white rounded-full px-4 py-2 shadow-md">
            <span className="text-sm text-gray-600">
              Showing <span className="font-semibold text-yellow-600">{visibleArticles}</span> of <span className="font-semibold">{regularArticles.length}</span> articles
            </span>
          </div>
        </div>
      )}

      {/* Load More Section */}
      <div className="text-center mt-12">
        {hasMoreArticles ? (
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading More Articles...
              </>
            ) : (
              <>
                Load More Articles
                <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                  {regularArticles.length - visibleArticles} more
                </span>
              </>
            )}
          </Button>
        ) : (
          <div className="text-gray-500">
            <div className="mb-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">You&apos;ve explored everything!</h3>
              <p className="text-gray-600 mb-4">
                You&apos;ve viewed all {regularArticles.length} articles in this category.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/">
                <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                  Back to Home
                </Button>
              </Link>
              <Link href="/news">
                <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white">
                  Browse All News
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Animation Styles */}
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
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </>
  );
}
