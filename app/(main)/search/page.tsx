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

interface SearchResult {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  imageUrl: string;
  slug: string;
  tags: string[];
}

// Mock search results data - moved outside component to prevent re-renders
const mockSearchResults: SearchResult[] = [
  {
    id: 1,
    title: 'Revolutionary AI Algorithm Predicts Weather Patterns with Unprecedented Accuracy',
    excerpt: 'Scientists have developed a groundbreaking artificial intelligence system that can predict weather patterns up to 30 days in advance with remarkable precision, potentially revolutionizing climate forecasting.',
    category: 'Technology',
    author: 'Dr. Sarah Chen',
    publishedAt: '2024-12-15',
    readTime: '5 min read',
    imageUrl: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'revolutionary-ai-algorithm-predicts-weather-patterns',
    tags: ['AI', 'Weather', 'Technology', 'Climate']
  },
  {
    id: 2,
    title: 'Breakthrough Gene Therapy Shows Promise for Treating Rare Diseases',
    excerpt: 'A new gene therapy approach has shown remarkable success in clinical trials, offering hope for patients with previously incurable genetic disorders.',
    category: 'Health',
    author: 'Dr. Michael Rodriguez',
    publishedAt: '2024-12-14',
    readTime: '4 min read',
    imageUrl: 'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'breakthrough-gene-therapy-shows-promise',
    tags: ['Gene Therapy', 'Health', 'Medical Research', 'Innovation']
  },
  {
    id: 3,
    title: 'Quantum Computing Reaches New Milestone with 1000-Qubit Processor',
    excerpt: 'Tech giant announces the development of a 1000-qubit quantum processor, marking a significant leap forward in quantum computing capabilities.',
    category: 'Technology',
    author: 'Prof. David Kim',
    publishedAt: '2024-12-13',
    readTime: '6 min read',
    imageUrl: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'quantum-computing-reaches-new-milestone',
    tags: ['Quantum Computing', 'Technology', 'Innovation', 'Science']
  },
  {
    id: 4,
    title: 'Sustainable Energy Storage Solution Could Transform Renewable Power',
    excerpt: 'Researchers have developed a new battery technology that could store renewable energy for weeks, addressing one of the biggest challenges in sustainable power.',
    category: 'Business',
    author: 'Emma Thompson',
    publishedAt: '2024-12-12',
    readTime: '3 min read',
    imageUrl: 'https://images.pexels.com/photos/9800029/pexels-photo-9800029.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'sustainable-energy-storage-solution',
    tags: ['Renewable Energy', 'Battery Technology', 'Sustainability', 'Green Tech']
  },
  {
    id: 5,
    title: 'Machine Learning Transforms Medical Diagnosis Accuracy',
    excerpt: 'New AI-powered diagnostic tools are helping doctors identify diseases earlier and more accurately than ever before, potentially saving millions of lives.',
    category: 'Health',
    author: 'Dr. Lisa Wang',
    publishedAt: '2024-12-11',
    readTime: '5 min read',
    imageUrl: 'https://images.pexels.com/photos/3912317/pexels-photo-3912317.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'machine-learning-transforms-medical-diagnosis',
    tags: ['Machine Learning', 'Healthcare', 'AI', 'Medical Technology']
  },
  {
    id: 6,
    title: 'Global Climate Summit Reaches Historic Agreement on Carbon Reduction',
    excerpt: 'World leaders have signed a landmark agreement to reduce global carbon emissions by 50% within the next decade, marking a crucial step in fighting climate change.',
    category: 'World',
    author: 'James Patterson',
    publishedAt: '2024-12-10',
    readTime: '7 min read',
    imageUrl: 'https://images.pexels.com/photos/3617500/pexels-photo-3617500.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'global-climate-summit-reaches-agreement',
    tags: ['Climate Change', 'Environment', 'Global Politics', 'Sustainability']
  },
  {
    id: 7,
    title: 'Economic Recovery Shows Positive Signs as Markets Stabilize',
    excerpt: 'Financial analysts report encouraging signs of economic recovery as major markets show sustained growth and unemployment rates continue to decline.',
    category: 'Business',
    author: 'Robert Johnson',
    publishedAt: '2024-12-09',
    readTime: '4 min read',
    imageUrl: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'economic-recovery-shows-positive-signs',
    tags: ['Economy', 'Finance', 'Markets', 'Business News']
  },
  {
    id: 8,
    title: 'Space Technology Advances Bring Mars Mission Closer to Reality',
    excerpt: 'Latest developments in propulsion and life support systems are bringing human Mars missions closer to reality, with the first crewed mission planned for 2030.',
    category: 'Technology',
    author: 'Dr. Amanda Foster',
    publishedAt: '2024-12-08',
    readTime: '6 min read',
    imageUrl: 'https://images.pexels.com/photos/586063/pexels-photo-586063.jpeg?auto=compress&cs=tinysrgb&w=800',
    slug: 'space-technology-advances-mars-mission',
    tags: ['Space Technology', 'Mars Mission', 'NASA', 'Space Exploration']
  }
];

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

  const categories = ['all', 'Technology', 'Health', 'Business', 'World', 'Sports', 'Politics'];
  const timeframes = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' }
  ];

  // Perform search function
  const performSearch = useCallback((query: string, page = 1) => {
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      let filteredResults = mockSearchResults;

      // Filter by search query
      if (query) {
        filteredResults = filteredResults.filter(
          result =>
            result.title.toLowerCase().includes(query.toLowerCase()) ||
            result.excerpt.toLowerCase().includes(query.toLowerCase()) ||
            result.category.toLowerCase().includes(query.toLowerCase()) ||
            result.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
      }

      // Filter by category
      if (filterCategory !== 'all') {
        filteredResults = filteredResults.filter(result => result.category === filterCategory);
      }

      // Sort results
      switch (sortBy) {
        case 'newest':
          filteredResults.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
          break;
        case 'oldest':
          filteredResults.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
          break;
        case 'popular':
          // Simulate popularity by randomizing order
          filteredResults.sort(() => Math.random() - 0.5);
          break;
        default:
          // Relevance - keep current order
          break;
      }

      // Pagination simulation
      const resultsPerPage = 10;
      const startIndex = (page - 1) * resultsPerPage;
      const paginatedResults = filteredResults.slice(startIndex, startIndex + resultsPerPage);

      if (page === 1) {
        setSearchResults(paginatedResults);
      } else {
        setSearchResults(prev => [...prev, ...paginatedResults]);
      }

      setTotalResults(filteredResults.length);
      setHasMoreResults(filteredResults.length > page * resultsPerPage);
      setIsLoading(false);
    }, 500);
  }, [filterCategory, sortBy]);

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
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category === 'all' ? 'All Categories' : category}
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
                              <img
                                src={result.imageUrl}
                                alt={result.title}
                                className="w-full h-32 object-cover rounded-lg hover:opacity-90 transition-opacity duration-200"
                              />
                            </Link>
                          </div>

                          <div className="md:col-span-3">
                            <div className="mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {result.category}
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
                                  <span>{result.author}</span>
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
                                    {tag}
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
