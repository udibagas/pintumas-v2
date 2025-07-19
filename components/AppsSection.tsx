'use client';

import { useState, useEffect } from 'react';
import { AppWindow, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import axios from 'axios';

interface App {
  id: string;
  name: string;
  iconUrl: string | null;
  link: string | null;
}

export default function AppsSection() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/admin/apps');

      if (response.data.success) {
        setApps(response.data.data);
      } else {
        throw new Error('Failed to fetch apps');
      }
    } catch (err: any) {
      console.error('Error fetching apps:', err);
      setError('Failed to load apps');
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Aplikasi
            </h2>
            <p className="text-gray-600">
              Akses berbagai aplikasi yang tersedia
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-center">
                  <Skeleton className="w-12 h-12 rounded-full mx-auto mb-3" />
                  <Skeleton className="h-4 mb-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchApps} variant="outline">
              Coba Lagi
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (apps.length === 0) {
    return null; // Don't render section if no apps
  }

  const AppCard = ({ app }: { app: App }) => {
    const cardContent = (
      <div className="text-center">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform duration-200 ${app.link ? 'bg-blue-100 group-hover:scale-105' : 'bg-gray-100'
          }`}>
          {app.iconUrl ? (
            <Image
              src={app.iconUrl}
              alt={app.name}
              width={32}
              height={32}
              className="w-16 h-16 rounded object-cover"
            />
          ) : (
            <AppWindow className={`h-6 w-6 ${app.link ? 'text-blue-600' : 'text-gray-400'}`} />
          )}
        </div>
        <h3 className={`text-sm font-semibold transition-colors duration-200 ${app.link ? 'text-gray-900 group-hover:text-blue-700' : 'text-gray-500'
          }`}>
          {app.name}
        </h3>
        {app.link && (
          <ExternalLink className="h-3 w-3 text-gray-400 mx-auto mt-1 group-hover:text-blue-500" />
        )}
      </div>
    );

    const baseClasses = "bg-white rounded-xl p-4 shadow-sm border border-gray-100";

    if (app.link) {
      return (
        <a
          href={app.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`group cursor-pointer hover:shadow-md transition-all duration-200 hover:border-blue-300 block ${baseClasses}`}
        >
          {cardContent}
        </a>
      );
    }

    return (
      <div className={`opacity-75 ${baseClasses}`}>
        {cardContent}
      </div>
    );
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Layanan
          </h2>
          <p className="text-gray-600">
            Akses berbagai layanan yang tersedia
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </section>
  );
}
