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

export default function SearchContent() {
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
      if (query) searchParams.append('query', query);
      if (sortBy !== 'relevance') searchParams.append('sortBy', sortBy);
      if (filterCategory !== 'all') searchParams.append('category', filterCategory);
      if (filterTimeframe !== 'all') searchParams.append('timeframe', filterTimeframe);
      searchParams.append('page', page.toString());
      searchParams.append('limit', '10');

      const response = await axios.get(`/api/posts/search?${searchParams.toString()}`);

      if (response.data.success) {
        if (page === 1) {
          setSearchResults(response.data.data);
        } else {
          setSearchResults(prev => [...prev, ...response.data.data]);
        }
        setTotalResults(response.data.total);
        setHasMoreResults(response.data.data.length === 10);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
      setTotalResults(0);
    }

    setIsLoading(false);
  }, [sortBy, filterCategory, filterTimeframe]);

  // Get search query from URL params
  useEffect(() => {
    const queryParam = searchParams.get('q');
    const categoryParam = searchParams.get('category');
    const sortParam = searchParams.get('sort');
    const timeParam = searchParams.get('time');

    if (queryParam) {
      setSearchQuery(queryParam);
    }
    if (categoryParam) {
      setFilterCategory(categoryParam);
    }
    if (sortParam) {
      setSortBy(sortParam);
    }
    if (timeParam) {
      setFilterTimeframe(timeParam);
    }
  }, [searchParams]);

  // Trigger search when dependencies change
  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(1);
      performSearch(searchQuery, 1);
    }
  }, [searchQuery, sortBy, filterCategory, filterTimeframe, performSearch]);

  // Update URL when filters change
  const updateURL = useCallback((newParams: Record<string, string>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== 'relevance') {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });

    const search = current.toString();
    const query = search ? `?${search}` : '';

    router.push(`/search${query}`);
  }, [searchParams, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL({ q: searchQuery, category: filterCategory, sort: sortBy, time: filterTimeframe });
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    performSearch(searchQuery, nextPage);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatReadTime = (readTime: string) => {
    return `${readTime} menit baca`;
  };

  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pencarian</h1>
          <p className="text-gray-600">
            Temukan artikel, berita, dan konten yang Anda cari
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Masukkan kata kunci pencarian..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Select
                    value={sortBy}
                    onValueChange={(value) => {
                      setSortBy(value);
                      updateURL({ q: searchQuery, category: filterCategory, sort: value, time: filterTimeframe });
                    }}
                  >
                    <SelectTrigger>
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Urutkan" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <Select
                    value={filterCategory}
                    onValueChange={(value) => {
                      setFilterCategory(value);
                      updateURL({ q: searchQuery, category: value, sort: sortBy, time: filterTimeframe });
                    }}
                  >
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <Select
                    value={filterTimeframe}
                    onValueChange={(value) => {
                      setFilterTimeframe(value);
                      updateURL({ q: searchQuery, category: filterCategory, sort: sortBy, time: value });
                    }}
                  >
                    <SelectTrigger>
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Waktu" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeframes.map((timeframe) => (
                        <SelectItem key={timeframe.value} value={timeframe.value}>
                          {timeframe.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={isLoading} className="px-8">
                  {isLoading ? 'Mencari...' : 'Cari'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchQuery && (
          <div className="space-y-6">
            {/* Results Info */}
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                {isLoading ? (
                  'Mencari...'
                ) : totalResults > 0 ? (
                  <>
                    Menampilkan <span className="font-semibold">{searchResults.length}</span> dari{' '}
                    <span className="font-semibold">{totalResults}</span> hasil untuk{' '}
                    <span className="font-semibold">"{searchQuery}"</span>
                  </>
                ) : (
                  <>Tidak ada hasil untuk <span className="font-semibold">"{searchQuery}"</span></>
                )}
              </p>

              {totalResults > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <TrendingUp className="h-4 w-4" />
                  <span>{totalResults} hasil ditemukan</span>
                </div>
              )}
            </div>

            {/* Results List */}
            <div className="space-y-6">
              {searchResults.map((result) => (
                <Card key={result.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Featured Image */}
                      {result.featuredImage && (
                        <div className="flex-shrink-0">
                          <Link href={`/post/${result.slug}`}>
                            <div className="relative w-32 h-20 rounded-lg overflow-hidden">
                              <Image
                                src={result.featuredImage}
                                alt={result.title}
                                fill
                                className="object-cover hover:scale-105 transition-transform"
                              />
                            </div>
                          </Link>
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        {/* Title */}
                        <Link href={`/post/${result.slug}`}>
                          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                            {highlightSearchTerm(result.title, searchQuery)}
                          </h3>
                        </Link>

                        {/* Excerpt */}
                        <p className="text-gray-600 line-clamp-3 leading-relaxed">
                          {highlightSearchTerm(result.excerpt, searchQuery)}
                        </p>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{result.author.name}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(result.publishedAt)}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatReadTime(result.readTime)}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>{result.views.toLocaleString()} views</span>
                          </div>
                        </div>

                        {/* Category and Tags */}
                        <div className="flex flex-wrap items-center gap-2">
                          <Link href={`/category/${result.category.slug}`}>
                            <Badge variant="secondary" className="hover:bg-blue-100">
                              {result.category.name}
                            </Badge>
                          </Link>

                          {result.tags.length > 0 && (
                            <>
                              <Separator orientation="vertical" className="h-4" />
                              <div className="flex items-center gap-1">
                                <Tag className="h-3 w-3 text-gray-400" />
                                <div className="flex flex-wrap gap-1">
                                  {result.tags.slice(0, 3).map((tag) => (
                                    <Link key={tag.id} href={`/search?q=${tag.name}`}>
                                      <Badge variant="outline" className="text-xs hover:bg-gray-100">
                                        {tag.name}
                                      </Badge>
                                    </Link>
                                  ))}
                                  {result.tags.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{result.tags.length - 3} lagi
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Load More Button */}
              {hasMoreResults && !isLoading && searchResults.length > 0 && (
                <div className="text-center">
                  <Button variant="outline" onClick={handleLoadMore} className="px-8">
                    Muat Lebih Banyak
                  </Button>
                </div>
              )}

              {/* No Results */}
              {!isLoading && totalResults === 0 && searchQuery && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="max-w-md mx-auto space-y-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <Search className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Tidak ada hasil ditemukan
                      </h3>
                      <p className="text-gray-600">
                        Tidak ada artikel yang cocok dengan pencarian Anda untuk "{searchQuery}".
                        Coba gunakan kata kunci yang berbeda atau lebih umum.
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Saran:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Periksa ejaan kata kunci</li>
                          <li>• Gunakan kata kunci yang lebih umum</li>
                          <li>• Coba hapus beberapa filter</li>
                          <li>• Gunakan sinonim atau kata terkait</li>
                        </ul>
                      </div>
                    </div>
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
