'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  ArrowUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  slug: string;
  articles: number;
}

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await axios.get('/api/categories');
        if (response.data.success) {
          // Take only first 6 categories for footer
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Fallback to default categories if API fails
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <Image src={"/images/pintumas.png"} alt="Pintumas Logo" width={40} height={40} />
              <div>
                <h1 className="text-2xl font-bold">PINTUMAS</h1>
                <p className="text-sm text-gray-400">Pusat Informasi Terpadu Pelabuhan Tanjung Mas</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Media berita terpercaya yang menyajikan informasi terkini dan terlengkap tentang Pelabuhan Tanjung Mas.
            </p>
          </div>

          {/* News Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Kategori Berita</h3>
            <ul className="space-y-3">
              {categoriesLoading ? (
                // Loading skeleton
                <>
                  <li><div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div></li>
                  <li><div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div></li>
                  <li><div className="h-4 w-18 bg-gray-700 rounded animate-pulse"></div></li>
                  <li><div className="h-4 w-22 bg-gray-700 rounded animate-pulse"></div></li>
                  <li><div className="h-4 w-16 bg-gray-700 rounded animate-pulse"></div></li>
                  <li><div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div></li>
                </>
              ) : (
                categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/category/${category.slug}`}
                      className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 text-sm flex items-center justify-between"
                    >
                      <span>{category.name}</span>
                      {category.articles > 0 && (
                        <span className="text-xs text-gray-500">({category.articles})</span>
                      )}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Hubungi Kami</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-300">
                <Phone className="h-4 w-4 mr-3 text-yellow-500" />
                <span>+62 (24) xxx-xxx</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Mail className="h-4 w-4 mr-3 text-yellow-500" />
                <span>contact@pintumas.id</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <MapPin className="h-4 w-4 mr-3 text-yellow-500" />
                <span>Semarang, Jawa Tengah</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Section */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Social Media Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm mr-4">Follow us:</span>
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="bg-gray-800 hover:bg-yellow-600 p-2 rounded-full transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <IconComponent className="h-4 w-4" />
                  </a>
                );
              })}
            </div>

            {/* Back to Top Button */}
            <Button
              onClick={scrollToTop}
              variant="outline"
              size="sm"
              className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Kembali Ke Atas
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} PINTUMAS. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy-policy" className="hover:text-yellow-400 transition-colors duration-200">
                Kebijakan Privasi
              </Link>
              <Link href="/terms-of-service" className="hover:text-yellow-400 transition-colors duration-200">
                Syarat & Ketentuan
              </Link>
              <Link href="/cookie-policy" className="hover:text-yellow-400 transition-colors duration-200">
                Kebijakan Cookie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}