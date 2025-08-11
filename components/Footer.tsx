'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import Image from 'next/image';

interface Department {
  id: string;
  name: string;
  slug: string;
  posts: number;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  posts: number;
}

export default function Footer() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);

  // Fetch departments from backend
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setDepartmentsLoading(true);
        const { data } = await axios.get('/api/departments');
        setDepartments(data);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
        // Fallback to default departments if API fails
        setDepartments([]);
      } finally {
        setDepartmentsLoading(false);
      }
    };

    const fetchServices = async () => {
      try {
        setServicesLoading(true);
        const { data } = await axios.get('/api/services');
        setServices(data);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
        // Fallback to default departments if API fails
        setServices([]);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchDepartments();
    fetchServices();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

          {/* Departments List */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Instansi</h3>
            <ul className="space-y-3">
              {departmentsLoading ? (
                // Loading skeleton
                <>
                  <li><Skeleton className="h-4 w-20" /></li>
                  <li><Skeleton className="h-4 w-24" /></li>
                  <li><Skeleton className="h-4 w-18" /></li>
                  <li><Skeleton className="h-4 w-22" /></li>
                  <li><Skeleton className="h-4 w-16" /></li>
                  <li><Skeleton className="h-4 w-20" /></li>
                </>
              ) : (
                departments.map((department) => (
                  <li key={department.id}>
                    <Link
                      href={`/departments#${department.slug}`}
                      className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 text-sm flex items-center justify-between"
                    >
                      <span>{department.name}</span>
                      {department.posts > 0 && (
                        <span className="text-xs text-gray-500">({department.posts})</span>
                      )}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Services List */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Layanan</h3>
            <ul className="space-y-3">
              {servicesLoading ? (
                // Loading skeleton
                <>
                  <li><Skeleton className="h-4 w-20" /></li>
                  <li><Skeleton className="h-4 w-24" /></li>
                  <li><Skeleton className="h-4 w-18" /></li>
                  <li><Skeleton className="h-4 w-22" /></li>
                  <li><Skeleton className="h-4 w-16" /></li>
                  <li><Skeleton className="h-4 w-20" /></li>
                </>
              ) : (
                services.map((service) => (
                  <li key={service.id}>
                    <Link
                      href={`/services#${service.slug}`}
                      className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 text-sm flex items-center justify-between"
                    >
                      <span>{service.name}</span>
                      {service.posts > 0 && (
                        <span className="text-xs text-gray-500">({service.posts})</span>
                      )}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Social Media & Bottom Section */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
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