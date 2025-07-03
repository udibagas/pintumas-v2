'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter, Clock, TrendingUp, ArrowUpDown, Calendar, Tag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  featuredImage: string | null;
  publishedAt: string;
  views: number;
  readTime: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  author: {
    id: string;
    name: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterTimeframe, setFilterTimeframe] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreResults, setHasMoreResults] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const timeframes = [
    { value: 'all', label: 'Semua waktu' },
    { value: 'today', label: 'Hari Ini' },
    { value: 'week', label: 'Minggu Ini' },
    { value: 'month', label: 'Bulan Ini' },
    { value: 'year', label: 'Tahun Ini' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Paling Relevan' },
    { value: 'newest', label: 'Terbaru' },
    { value: 'oldest', label: 'Terlama' },
    { value: 'popular', label: 'Terpopuler' }
  ];

  // Perform search function with real API
  const performSearch = useCallback(async (query: string, page = 1) => {
    setIsLoading(true);

    try {
      // Build search parameters
      const searchParams = new URLSearchParams();

      if (query) {
        searchParams.append('q', query);
      }

      if (filterCategory !== 'all') {
        const selectedCategory = categories.find(cat => cat.name === filterCategory);
        if (selectedCategory) {
          searchParams.append('category', selectedCategory.slug);
        }
      }

      // Map sort options to API parameters
      let apiSortBy = 'latest';
      switch (sortBy) {
        case 'newest':
          apiSortBy = 'latest';
          break;
        case 'oldest':
          apiSortBy = 'oldest';
          break;
        case 'popular':
          apiSortBy = 'popular';
          break;
        default:
          apiSortBy = 'latest';
          break;
      }
      searchParams.append('sortBy', apiSortBy);

      // Add timeframe filter
      if (filterTimeframe !== 'all') {
        searchParams.append('timeframe', filterTimeframe);
      }

      // Pagination
      const limit = 10;
      const offset = (page - 1) * limit;
      searchParams.append('limit', limit.toString());
      searchParams.append('offset', offset.toString());

      // Make API call
      const response = await axios.get(`/api/posts?${searchParams.toString()}`);

      if (response.data.success) {
        const posts = response.data.data;

        // Transform posts to match SearchResult interface
        const transformedResults: SearchResult[] = posts.map((post: any) => ({
          id: post.id,
          title: post.title,
          excerpt: post.summary || '',
          content: '', // Not needed for search results
          slug: post.slug,
          featuredImage: post.image,
          publishedAt: post.publishedAt,
          views: post.views,
          readTime: post.readTime || '5 min read',
          category: {
            id: post.categorySlug,
            name: post.category,
            slug: post.categorySlug
          },
          author: {
            id: '1', // API doesn't return author ID
            name: post.author
          },
          tags: [] // API doesn't return tags in this format
        }));

        if (page === 1) {
          setSearchResults(transformedResults);
        } else {
          setSearchResults(prev => [...prev, ...transformedResults]);
        }

        setTotalResults(response.data.pagination?.total || transformedResults.length);
        setHasMoreResults(response.data.pagination?.hasMore || false);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setTotalResults(0);
      setHasMoreResults(false);
    } finally {
      setIsLoading(false);
    }
  }, [filterCategory, sortBy, filterTimeframe, categories]);

  // Get search query from URL params
  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
    if (query) {
      performSearch(query);
    }
  }, [searchParams, performSearch]);

  // Handle new search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle filter/sort changes
  useEffect(() => {
    const query = searchParams.get('q') || '';
    if (query) {
      setCurrentPage(1);
      performSearch(query, 1);
    }
  }, [sortBy, filterCategory, filterTimeframe, searchParams, performSearch]);

  // Load more results
  const loadMoreResults = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    const query = searchParams.get('q') || '';
    performSearch(query, nextPage);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const query = searchParams.get('q') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            {query ? `Hasil Pencarian untuk "${query}"` : 'Search News'}
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search news, topics, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-lg border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-xl"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-500 hover:bg-yellow-600 text-black px-6 rounded-xl"
              >
                Cari
              </Button>
            </div>
          </form>

          {/* Results Summary */}
          {query && (
            <div className="text-center space-x-2 text-sm text-gray-600">
              <span>Menemukan {totalResults.toLocaleString()} hasil</span>
              {isLoading && <span>• Mencari...</span>}
            </div>
          )}
        </div>

        {query && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Filter className="h-5 w-5 text-gray-600" />
                    <h2 className="font-semibold text-gray-900">Filters</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Sort By */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Urutkan Berdasarkan
                      </label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {sortOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Kategori
                      </label>
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Time Filter */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Diterbitkan
                      </label>
                      <Select value={filterTimeframe} onValueChange={setFilterTimeframe}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeframes.map(timeframe => (
                            <SelectItem key={timeframe.value} value={timeframe.value}>
                              {timeframe.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Clear Filters */}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSortBy('relevance');
                        setFilterCategory('all');
                        setFilterTimeframe('all');
                      }}
                      className="w-full"
                    >
                      Bersihkan Filter
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Search Results */}
            <div className="lg:col-span-3">
              {searchResults.length > 0 ? (
                <div className="space-y-6">
                  {searchResults.map((result) => (
                    <Card key={result.id} className="hover:shadow-lg transition-shadow duration-200">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-1">
                            <Link href={`/post/${result.slug}`}>
                              <div className="relative w-full h-32 rounded-lg overflow-hidden">
                                <Image
                                  src={result.featuredImage || '/images/pintumas.png'}
                                  alt={result.title}
                                  fill
                                  className="object-cover hover:opacity-90 transition-opacity duration-200"
                                />
                              </div>
                            </Link>
                          </div>

                          <div className="md:col-span-3">
                            <div className="mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {result.category.name}
                              </Badge>
                            </div>

                            <Link href={`/post/${result.slug}`}>
                              <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-yellow-600 transition-colors duration-200">
                                {result.title}
                              </h3>
                            </Link>

                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {result.excerpt}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <User className="h-4 w-4" />
                                  <span>{result.author.name}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{formatDate(result.publishedAt)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{result.readTime}</span>
                                </div>
                              </div>
                            </div>

                            {result.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {result.tags.slice(0, 3).map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {tag.name}
                                  </Badge>
                                ))}
                                {result.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{result.tags.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Load More Button */}
                  {hasMoreResults && (
                    <div className="text-center mt-8">
                      <Button
                        onClick={loadMoreResults}
                        disabled={isLoading}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3"
                      >
                        {isLoading ? 'Loading...' : 'Load More Results'}
                      </Button>
                    </div>
                  )}
                </div>
              ) : query ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      We couldn&apos;t find any articles matching &quot;{query}&quot;. Try adjusting your search terms or filters.
                    </p>
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Suggestions:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Check your spelling</li>
                        <li>• Try different keywords</li>
                        <li>• Use more general search terms</li>
                        <li>• Remove filters to see more results</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Start your search
                    </h3>
                    <p className="text-gray-600">
                      Enter keywords above to find news articles, topics, and more.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
