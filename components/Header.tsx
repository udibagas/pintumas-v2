'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, Bell, User, Globe, Clock, TrendingUp, LogOut, Settings, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, LoginSchema, type RegisterData, type LoginData } from '@/lib/validations';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

interface Category {
  id: string;
  name: string;
  slug: string;
  articles: number;
}

interface Announcement {
  id: string;
  text: string;
  content: string | null;
  type: string;
  priority: number;
  linkUrl: string | null;
  linkText: string | null;
  createdAt: string;
  author: string;
}

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: number, title: string, category: string }>>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [userProfile, setUserProfile] = useState<{
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    role: string;
  } | null>(null);
  const [authError, setAuthError] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // React Hook Form for signin
  const {
    register: registerSignIn,
    handleSubmit: handleSignInSubmit,
    formState: { errors: signInErrors, isSubmitting: isSignInSubmitting },
    reset: resetSignInForm,
  } = useForm<LoginData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // React Hook Form for signup
  const {
    register,
    handleSubmit: handleSignUpSubmit,
    formState: { errors, isSubmitting },
    reset: resetSignUpForm,
  } = useForm<RegisterData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Mock data for search suggestions and trending topics
  const trendingTopics = [
    'AI Technology',
    'Climate Change',
    'Global Economy',
    'Space Exploration',
    'Healthcare Innovation'
  ];

  const mockArticles = [
    { id: 1, title: 'Revolutionary AI Algorithm Predicts Weather Patterns', category: 'Technology' },
    { id: 2, title: 'Breakthrough Gene Therapy Shows Promise', category: 'Health' },
    { id: 3, title: 'Quantum Computing Reaches New Milestone', category: 'Technology' },
    { id: 4, title: 'Sustainable Energy Storage Solution', category: 'Business' },
    { id: 5, title: 'Machine Learning Transforms Medical Diagnosis', category: 'Health' },
    { id: 6, title: 'Global Climate Summit Reaches Agreement', category: 'World' },
    { id: 7, title: 'Economic Recovery Shows Positive Signs', category: 'Business' },
    { id: 8, title: 'Space Technology Advances Mars Mission', category: 'Technology' }
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    // Check authentication status from backend
    checkAuthStatus();

    // Fetch categories from backend
    fetchCategories();

    // Fetch announcements from backend
    fetchAnnouncements();
  }, []);

  // Cycle through announcements
  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(() => {
        setCurrentAnnouncementIndex((prev) =>
          (prev + 1) % announcements.length
        );
      }, 5000); // Change every 5 seconds

      return () => clearInterval(interval);
    }
  }, [announcements]);

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      if (response.data.success) {
        setUserProfile(response.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // User is not authenticated, clear local state
      setIsAuthenticated(false);
      setUserProfile(null);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await axios.get('/api/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Fallback to default categories
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Fetch announcements from API
  const fetchAnnouncements = async () => {
    try {
      setAnnouncementsLoading(true);
      const response = await axios.get('/api/announcements');
      if (response.data.success) {
        setAnnouncements(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      // Fallback to default announcements
      setAnnouncements([
        {
          id: '1',
          text: 'Welcome to PINTUMAS - Your trusted source for port information',
          content: 'Stay updated with the latest news',
          type: 'info',
          priority: 1,
          linkUrl: null,
          linkText: null,
          createdAt: new Date().toISOString(),
          author: 'System'
        }
      ]);
    } finally {
      setAnnouncementsLoading(false);
    }
  };

  // Authentication functions
  const handleSignIn = async (data: LoginData) => {
    setAuthError('');

    try {
      const response = await axios.post('/api/auth/login', {
        email: data.email,
        password: data.password,
      });

      if (response.data.success) {
        setUserProfile(response.data.user);
        setIsAuthenticated(true);
        setIsAuthModalOpen(false);

        // Reset form
        resetSignInForm();
      } else {
        setAuthError('Login failed. Please try again.');
      }
    } catch (error: any) {
      setAuthError(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  const handleSignUp = async (data: RegisterData) => {
    setAuthError('');

    try {
      const response = await axios.post('/api/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      if (response.data.success) {
        setUserProfile(response.data.user);
        setIsAuthenticated(true);
        setIsAuthModalOpen(false);

        // Reset form
        resetSignUpForm();
      } else {
        setAuthError('Registration failed. Please try again.');
      }
    } catch (error: any) {
      setAuthError(error.response?.data?.error || 'Registration failed. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await axios.post('/api/auth/logout');
      setIsAuthenticated(false);
      setUserProfile(null);
      setIsUserMenuOpen(false);
    } catch (error) {
      // Even if logout fails on server, clear client state
      setIsAuthenticated(false);
      setUserProfile(null);
      setIsUserMenuOpen(false);
    }
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      // Filter mock articles based on search query
      const filtered = mockArticles.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.category.toLowerCase().includes(query.toLowerCase())
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
      setIsSearchOpen(false);
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
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
        setIsSearchFocused(true);
      }
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setIsSearchFocused(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '/' },
    ...categories.slice(0, 5).map(category => ({
      name: category.name,
      href: `/category/${category.slug}`
    }))
  ];

  return (
    <header className="shadow-lg border-b-2 border-yellow-500" style={{ backgroundColor: '#011629' }}>
      {/* Breaking News Ticker */}
      <div className="bg-red-600 text-white py-2 overflow-hidden">
        <div className="flex items-center">
          <span className="bg-yellow-500 text-black px-3 py-1 text-sm font-bold mr-4 flex-shrink-0">
            {announcements.length > 0 && announcements[currentAnnouncementIndex]?.type === 'breaking' ? 'BERITA UTAMA' :
              announcements.length > 0 && announcements[currentAnnouncementIndex]?.type === 'alert' ? 'PERINGATAN' :
                announcements.length > 0 && announcements[currentAnnouncementIndex]?.type === 'event' ? 'EVENT' :
                  announcements.length > 0 && announcements[currentAnnouncementIndex]?.type === 'maintenance' ? 'MAINTENANCE' : 'INFORMASI'}
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <span className="text-sm">
                {announcementsLoading ? (
                  'Loading latest news...'
                ) : announcements.length > 0 ? (
                  <span>
                    {announcements[currentAnnouncementIndex].linkUrl ? (
                      <Link
                        href={announcements[currentAnnouncementIndex].linkUrl!}
                        className="hover:text-yellow-300 transition-colors cursor-pointer"
                      >
                        {announcements[currentAnnouncementIndex].text}
                      </Link>
                    ) : (
                      announcements[currentAnnouncementIndex].text
                    )}
                    {announcements.length > 1 && (
                      <span className="ml-4 text-yellow-300">
                        ({currentAnnouncementIndex + 1}/{announcements.length})
                      </span>
                    )}
                  </span>
                ) : (
                  'Welcome to PINTUMAS - Your trusted source for port information and news'
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200">
            <div className="">
              <Image src={'/images/pintumas.png'} alt="Pintumas Logo" width={40} height={40} className="h-10 w-10 object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">PINTUMAS</h1>
              <p className="text-xs text-gray-300">Pusat Informasi Terpadu Pelabuhan Tanjung Mas</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {categoriesLoading ? (
              // Loading skeleton
              <>
                <div className="h-4 w-12 bg-gray-600 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-600 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-600 rounded animate-pulse"></div>
                <div className="h-4 w-14 bg-gray-600 rounded animate-pulse"></div>
                <div className="h-4 w-12 bg-gray-600 rounded animate-pulse"></div>
                <div className="h-4 w-18 bg-gray-600 rounded animate-pulse"></div>
              </>
            ) : (
              navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-yellow-400 font-medium transition-colors duration-200 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-200 group-hover:w-full"></span>
                </Link>
              ))
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Toggle */}
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (!isSearchOpen) {
                  setIsSearchFocused(true);
                }
              }}
              className="p-2 text-gray-300 hover:text-yellow-400 transition-colors duration-200 relative group"
              title="Search (⌘K)"
            >
              <Search className="h-5 w-5" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                ⌘K
              </span>
            </button>

            {/* Notifications */}
            {/* <button className="p-2 text-gray-300 hover:text-yellow-400 transition-colors duration-200 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button> */}

            {/* User Account */}
            {isAuthenticated && userProfile ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  <Image
                    src={userProfile.avatar || '/images/default-avatar.png'}
                    alt={userProfile.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="hidden sm:block text-sm font-medium text-gray-300">
                    {userProfile.name}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={userProfile.avatar || '/images/default-avatar.png'}
                          alt={userProfile.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{userProfile.name}</h3>
                          <p className="text-sm text-gray-500">{userProfile.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                        <Bookmark className="h-4 w-4" />
                        <span>Saved Articles</span>
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </button>
                    </div>

                    <div className="border-t border-gray-100 py-2">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Keluar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden sm:flex border-yellow-500 text-yellow-600 hover:bg-yellow-50"
              >
                <User className="h-4 w-4 mr-2" />
                Masuk
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-yellow-400 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        {isSearchOpen && (
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
                            {article.category}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Recent Searches */}
                  {recentSearches.length > 0 && searchQuery === '' && (
                    <div className="p-2 border-t">
                      <div className="flex items-center justify-between px-3 py-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-semibold text-gray-500">Recent Searches</span>
                        </div>
                        <button
                          onClick={clearRecentSearches}
                          className="text-xs text-gray-400 hover:text-gray-600"
                        >
                          Clear
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
                      {trendingTopics.map((topic, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearchSubmit(topic)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors duration-150 text-gray-700"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* No Results */}
                  {searchQuery && searchResults.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p>No results found for &ldquo;{searchQuery}&rdquo;</p>
                      <p className="text-sm">Try different keywords or browse trending topics</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              {categoriesLoading ? (
                // Loading skeleton for mobile
                <>
                  <div className="h-4 w-20 bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-4 w-28 bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-4 w-18 bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-4 w-22 bg-gray-600 rounded animate-pulse"></div>
                </>
              ) : (
                navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-gray-300 hover:text-yellow-400 font-medium transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))
              )}

              {/* Mobile Auth Section */}
              {isAuthenticated && userProfile ? (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <Image
                      src={userProfile.avatar || '/images/default-avatar.png'}
                      alt={userProfile.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-200">{userProfile.name}</h3>
                      <p className="text-sm text-gray-400">{userProfile.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      className="block w-full text-left text-gray-300 hover:text-yellow-400 font-medium transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button className="w-full text-left text-gray-300 hover:text-yellow-400 font-medium transition-colors duration-200">
                      Saved Articles
                    </button>
                    <button className="w-full text-left text-gray-300 hover:text-yellow-400 font-medium transition-colors duration-200">
                      Settings
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left text-red-400 hover:text-red-300 font-medium transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="mt-4 border-yellow-500 text-yellow-600 hover:bg-yellow-50 w-fit"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Authentication Modal */}
      <Dialog
        open={isAuthModalOpen}
        onOpenChange={(open) => {
          setIsAuthModalOpen(open);
          if (!open) {
            // Reset forms when modal closes
            resetSignInForm();
            resetSignUpForm();
            setAuthError('');
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Selamat Datang di PintuMas</DialogTitle>
            <DialogDescription>
              Silakan masuk atau daftar untuk melanjutkan.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Masuk</TabsTrigger>
              <TabsTrigger value="signup">Daftar</TabsTrigger>
            </TabsList>

            {/* Sign In Tab */}
            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignInSubmit(handleSignIn)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Masukkan Email Anda"
                    className={signInErrors.email ? 'border-red-300 focus:border-red-500' : ''}
                    {...registerSignIn('email')}
                  />
                  {signInErrors.email && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <span className="text-red-500">⚠</span>
                      {signInErrors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan Password Anda"
                    className={signInErrors.password ? 'border-red-300 focus:border-red-500' : ''}
                    {...registerSignIn('password')}
                  />
                  {signInErrors.password && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <span className="text-red-500">⚠</span>
                      {signInErrors.password.message}
                    </p>
                  )}
                </div>

                {authError && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 flex items-center gap-2">
                    <span className="text-red-500">⚠</span>
                    {authError}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                  disabled={isSignInSubmitting}
                >
                  {isSignInSubmitting ? 'Masuk...' : 'Masuk'}
                </Button>
              </form>

              <div className="text-center text-sm text-gray-500">
                <p>Masukkan email dan password yang valid untuk masuk</p>
              </div>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUpSubmit(handleSignUp)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Masukkan nama lengkap Anda"
                    className={errors.name ? 'border-red-300 focus:border-red-500' : ''}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <span className="text-red-500">⚠</span>
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Masukkan alamat email Anda"
                    className={errors.email ? 'border-red-300 focus:border-red-500' : ''}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <span className="text-red-500">⚠</span>
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Buat password (minimal 6 karakter)"
                    className={errors.password ? 'border-red-300 focus:border-red-500' : ''}
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <span className="text-red-500">⚠</span>
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Konfirmasi password Anda"
                    className={errors.confirmPassword ? 'border-red-300 focus:border-red-500' : ''}
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <span className="text-red-500">⚠</span>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {authError && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 flex items-center gap-2">
                    <span className="text-red-500">⚠</span>
                    {authError}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Membuat Akun...' : 'Daftar'}
                </Button>
              </form>

              <div className="text-center text-sm text-gray-500">
                <p>Dengan mendaftar, Anda menyetujui syarat dan ketentuan kami</p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </header>
  );
}