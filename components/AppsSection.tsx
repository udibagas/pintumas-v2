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
      const { data } = await axios.get('/api/admin/apps');
      setApps(data);
    } catch (err: any) {
      console.error('Error fetching apps:', err);
      setError('Failed to load apps');
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  // Common section wrapper component
  const SectionWrapper = ({ children }: { children: React.ReactNode }) => (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );

  // Common header component
  const SectionHeader = ({ title, description }: { title: string; description: string }) => (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100">
      <div className="text-center">
        <Skeleton className="w-12 h-12 rounded-full mx-auto mb-3" />
        <Skeleton className="h-4 mb-2" />
      </div>
    </div>
  );

  // App card component
  const AppCard = ({ app }: { app: App }) => {
    const isActive = !!app.link;
    const baseClasses = "bg-white rounded-xl p-4 shadow-xs border border-gray-100";

    const iconBgClass = isActive ? 'bg-blue-100 group-hover:scale-105' : 'bg-gray-100';
    const iconColorClass = isActive ? 'text-blue-600' : 'text-gray-400';
    const titleColorClass = isActive ? 'text-gray-900 group-hover:text-blue-700' : 'text-gray-500';

    const cardContent = (
      <div className="text-center">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform duration-200 ${iconBgClass}`}>
          {app.iconUrl ? (
            <Image
              src={app.iconUrl}
              alt={app.name}
              width={32}
              height={32}
              className="w-16 h-16 rounded object-cover"
            />
          ) : (
            <AppWindow className={`h-6 w-6 ${iconColorClass}`} />
          )}
        </div>
        <h3 className={`text-sm font-semibold transition-colors duration-200 ${titleColorClass}`}>
          {app.name}
        </h3>
        {isActive && (
          <ExternalLink className="h-3 w-3 text-gray-400 mx-auto mt-1 group-hover:text-blue-500" />
        )}
      </div>
    );

    if (isActive) {
      return (
        <a
          href={app.link!}
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

  // Early return for no apps
  if (!loading && !error && apps.length === 0) {
    return null;
  }

  return (
    <SectionWrapper>
      {loading && (
        <>
          <SectionHeader
            title="Layanan"
            description="Memuat layanan yang tersedia..."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[...Array(8)].map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </div>
        </>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchApps} variant="outline">
            Coba Lagi
          </Button>
        </div>
      )}

      {!loading && !error && apps.length > 0 && (
        <>
          <SectionHeader
            title="Layanan"
            description="Akses berbagai layanan yang tersedia"
          />
          <div className="flex flex-wrap justify-center gap-4">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </>
      )}
    </SectionWrapper>
  );
}
