'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import AuthDialog from '@/components/AuthDialog';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
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
  const handleAuthSuccess = (user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    role: string;
  }) => {
    setUserProfile(user);
    setIsAuthenticated(true);
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

  // Handle clicking outside user menu to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
      }
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
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
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-18" />
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
                          <h3 className="font-semibold text-gray-900 line-clamp-1">{userProfile.name}</h3>
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
                        <span>Profil</span>
                      </Link>
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

        {/* Search Bar */}
        <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              {categoriesLoading ? (
                // Loading skeleton for mobile
                <>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-18" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-22" />
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
                      <h3 className="font-semibold text-gray-200 line-clamp-1">{userProfile.name}</h3>
                      <p className="text-sm text-gray-400">{userProfile.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      className="block w-full text-left text-gray-300 hover:text-yellow-400 font-medium transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profil
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left text-red-400 hover:text-red-300 font-medium transition-colors duration-200"
                    >
                      Keluar
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
      <AuthDialog
        open={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        onAuthSuccess={handleAuthSuccess}
      />
    </header>
  );
}