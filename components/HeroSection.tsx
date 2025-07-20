'use client';

import { useState, useEffect } from 'react';
import { Clock, TrendingUp, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { formatTimeAgo, formatViews } from '@/lib/utils';

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
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [featuredStories, setFeaturedStories] = useState<Post[]>([]);
  const [trendingStories, setTrendingStories] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [featuredResponse, trendingResponse] = await Promise.all([
        axios.get('/api/posts/featured'),
        axios.get('/api/posts/trending')
      ]);

      if (featuredResponse.data.success) {
        setFeaturedStories(featuredResponse.data.data.slice(0, 4)); // Limit to 4 for carousel
      }

      if (trendingResponse.data.success) {
        setTrendingStories(trendingResponse.data.data.slice(0, 3)); // Limit to 3 for sidebar
      }
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');

      // Fallback data
      setFeaturedStories([]);
      setTrendingStories([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredStories.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredStories.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredStories.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredStories.length) % featuredStories.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  if (loading) {
    return (
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Loading skeleton for carousel */}
            <div className="lg:col-span-2">
              <Skeleton className="relative overflow-hidden rounded-2xl shadow-2xl aspect-16/10" />
            </div>
            {/* Loading skeleton for sidebar */}
            <div className="space-y-6">
              <Skeleton className="h-8" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex space-x-4 p-4">
                  <Skeleton className="w-20 h-20 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || featuredStories.length === 0) {
    return (
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error || 'No featured stories available'}</p>
            <Button onClick={fetchData} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured Stories Carousel */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              {/* Carousel Container */}
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredStories.map((story) => (
                  <div key={story.id} className="w-full shrink-0 relative group">
                    <Link href={`/post/${story.slug}`} className="block">
                      <div className="aspect-16/10 overflow-hidden">
                        <Image
                          src={story.image}
                          alt={story.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          priority={currentSlide === 0} // Only prioritize the first slide
                        />
                      </div>
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="flex items-center space-x-4 mb-4">
                          <Badge className="text-white font-semibold"
                            style={{ backgroundColor: story.categoryColor || '#EAB308' }}>
                            {story.category}
                          </Badge>
                          <div className="flex items-center text-yellow-300 text-sm">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span>Featured</span>
                          </div>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-yellow-300 transition-colors duration-200">
                          {story.title}
                        </h1>
                        <p className="text-gray-200 text-lg mb-6 line-clamp-3">
                          {story.summary}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6 text-gray-300 text-sm">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{story.readTime}</span>
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              <span>{formatViews(story.views)}</span>
                            </div>
                            <span>Oleh {story.author}</span>
                            <span>{formatTimeAgo(story.publishedAt)}</span>
                          </div>
                          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                            Baca Selengkapnya
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 hover:scale-110 z-10"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 hover:scale-110 z-10"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {featuredStories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentSlide
                      ? 'bg-yellow-500 scale-125'
                      : 'bg-white/50 hover:bg-white/75'
                      }`}
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                  />
                ))}
              </div>

              {/* Auto-play indicator */}
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${isAutoPlaying
                    ? 'bg-green-500/80 text-white hover:bg-green-600/80'
                    : 'bg-gray-500/80 text-white hover:bg-gray-600/80'
                    }`}
                >
                  {isAutoPlaying ? 'Auto' : 'Manual'}
                </button>
              </div>
            </div>

            {/* Story Preview Thumbnails */}
            <div className="flex space-x-3 mt-4 overflow-x-auto pb-2">
              {featuredStories.map((story, index) => (
                <button
                  key={story.id}
                  onClick={() => goToSlide(index)}
                  className={`shrink-0 relative overflow-hidden rounded-lg transition-all duration-200 ${index === currentSlide
                    ? 'ring-2 ring-yellow-500 ring-offset-2 scale-105'
                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                >
                  <div className="w-20 h-12 relative">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <Badge className="absolute bottom-1 left-1 text-xs py-0 px-1 text-white"
                    style={{ backgroundColor: story.categoryColor || '#3B82F6' }}>
                    {story.category}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Trending Stories Sidebar */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">Sedang Trending</h2>
            </div>

            {trendingStories.map((story, index) => (
              <Link key={index} href={`/post/${story.slug}`} className="block">
                <div className="group cursor-pointer">
                  <div className="flex space-x-4 p-4 rounded-xl hover:bg-yellow-50 transition-colors duration-200">
                    <div className="shrink-0">
                      <div className="w-20 h-20 relative rounded-lg overflow-hidden">
                        <Image
                          src={story.image}
                          alt={story.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-600">
                          {story.category}
                        </Badge>
                        <span className="text-xs text-gray-500">{formatTimeAgo(story.publishedAt)}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-yellow-700 transition-colors duration-200 mb-2">
                        {story.title}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{story.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            <Link href="/news">
              <Button variant="outline" className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                Lihat Semua Trending
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
