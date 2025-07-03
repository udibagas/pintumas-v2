'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  category: {
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch posts and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [postsResponse, categoriesResponse] = await Promise.all([
          axios.get('/api/posts?limit=50'), // Get more posts for better search results
          axios.get('/api/categories')
        ]);

        if (postsResponse.data.success) {
          setPosts(postsResponse.data.data);
        }

        if (categoriesResponse.data.success) {
          setCategories(categoriesResponse.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch search data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate trending topics from categories
  const trendingTopics = categories.slice(0, 5).map(category => category.name);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      // Filter posts based on search query
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        (post.category && post.category.name && post.category.name.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(filtered.slice(0, 5)); // Limit to 5 results
    } else {
      setSearchResults([]);
    }
  };

  // Handle search submission
  const handleSearchSubmit = (query = searchQuery) => {
    if (query.trim()) {
      // Add to recent searches
      const updatedRecentSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(updatedRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedRecentSearches));

      // Navigate to search results page
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);

      // Close search and reset
      onClose();
      setSearchQuery('');
      setSearchResults([]);
      setIsSearchFocused(false);
    }
  };

  // Handle clicking outside search to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Keyboard shortcut for search (Escape)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        setIsSearchFocused(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Focus input when search opens
  useEffect(() => {
    if (isOpen) {
      setIsSearchFocused(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="pb-4">
      <div className="relative max-w-2xl mx-auto" ref={searchRef}>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search news, topics, or categories..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchSubmit();
              }
            }}
            className="pl-10 pr-12 py-3 text-lg border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-xl"
            autoFocus
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Search Dropdown */}
        {(isSearchFocused || searchQuery) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="p-2">
                <div className="px-3 py-2 text-sm font-semibold text-gray-500 border-b">
                  Search Results
                </div>
                {searchResults.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => handleSearchSubmit(article.title)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                  >
                    <div className="font-medium text-gray-900 line-clamp-1">
                      {article.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {article.category.name}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Loading state for search */}
            {searchQuery && isLoading && (
              <div className="p-4 text-center text-gray-500">
                <div className="text-sm">Mencari...</div>
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && searchQuery === '' && (
              <div className="p-2 border-t">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-500">Pencarian terakhir</span>
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Bersihkan
                  </button>
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchSubmit(search)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors duration-150 text-gray-700"
                  >
                    {search}
                  </button>
                ))}
              </div>
            )}

            {/* Trending Topics */}
            {searchQuery === '' && (
              <div className="p-2 border-t">
                <div className="flex items-center space-x-2 px-3 py-2">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-500">Trending Topics</span>
                </div>
                {isLoading ? (
                  <div className="px-3 py-2 text-sm text-gray-500">Memuat...</div>
                ) : trendingTopics.length > 0 ? (
                  trendingTopics.map((topic, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchSubmit(topic)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors duration-150 text-gray-700"
                    >
                      {topic}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">Tidak ada topik</div>
                )}
              </div>
            )}

            {/* No Results */}
            {searchQuery && searchResults.length === 0 && !isLoading && (
              <div className="p-4 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Tidak ada hasil untuk &ldquo;{searchQuery}&rdquo;</p>
                <p className="text-sm">Coba kata kunci lain atau jelajahi topik yang sedang trending</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
