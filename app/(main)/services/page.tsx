'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, MessageCircle, Eye, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface Author {
  id: string;
  name: string;
  avatar: string | null;
}

interface Department {
  id: string;
  name: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  imageUrl: string | null;
  publishedAt: string | null;
  readTime: string | null;
  views: number;
  author: Author;
  department: Department | null;
  commentsCount: number;
}

interface App {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  link: string | null;
  postsCount: number;
  latestPosts: Post[];
}

export default function ServicesPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/apps/services');
      const data = await response.json();

      if (data.success) {
        setApps(data.data);
      } else {
        setError('Failed to load services');
      }
    } catch (err) {
      setError('An error occurred while loading services');
      console.error('Error fetching apps:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchApps} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Layanan Digital PINTUMAS
            </h1>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto">
              Akses berbagai layanan digital terintegrasi untuk meningkatkan efisiensi
              operasional pelabuhan dan memberikan pengalaman terbaik bagi pengguna.
            </p>
          </div>
        </div>
      </div>

      {/* Services Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {apps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No services available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {apps.map((app) => {
              const slug = app.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
              return (
                <div key={app.id} id={slug} className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200">
                  {/* App Header */}
                  <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {app.iconUrl && (
                          <div className="flex-shrink-0">
                            <Image
                              src={app.iconUrl}
                              alt={app.name}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover bg-white/10 p-2"
                            />
                          </div>
                        )}
                        <div>
                          <h2 className="text-2xl font-bold">{app.name}</h2>
                          {app.description && (
                            <p className="text-slate-200 mt-1">{app.description}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="secondary" className="bg-amber-400/20 text-amber-100 border-amber-400/30">
                              {app.postsCount} artikel
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {app.link && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-amber-400/20 border-amber-400/30 text-amber-100 hover:bg-amber-400/30"
                          onClick={() => window.open(app.link!, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Akses Aplikasi
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Latest Posts */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Artikel Terbaru
                    </h3>

                    {app.latestPosts.length === 0 ? (
                      <p className="text-gray-500 italic">
                        Belum ada artikel untuk aplikasi ini.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {app.latestPosts.map((post) => (
                          <div key={post.id} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200 border border-slate-200">
                            {/* Post Image */}
                            {post.imageUrl && (
                              <div className="flex-shrink-0">
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                                  <Image
                                    src={post.imageUrl}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Post Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="text-lg font-semibold text-slate-800 line-clamp-2 mb-1">
                                    <Link
                                      href={`/post/${post.slug}`}
                                      className="hover:text-amber-600 transition-colors"
                                    >
                                      {post.title}
                                    </Link>
                                  </h4>
                                  {post.summary && (
                                    <p className="text-slate-600 text-sm line-clamp-2 mb-2">
                                      {post.summary}
                                    </p>
                                  )}

                                  {/* Post Meta */}
                                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                                    <div className="flex items-center space-x-1">
                                      <Image
                                        src={post.author.avatar || '/images/default-avatar.png'}
                                        alt={post.author.name}
                                        width={16}
                                        height={16}
                                        className="rounded-full object-cover"
                                      />
                                      <span>{post.author.name}</span>
                                    </div>
                                    {post.publishedAt && (
                                      <div className="flex items-center space-x-1">
                                        <Calendar className="h-3 w-3" />
                                        <span>
                                          {format(new Date(post.publishedAt), 'dd MMM yyyy', { locale: id })}
                                        </span>
                                      </div>
                                    )}
                                    {post.readTime && (
                                      <div className="flex items-center space-x-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{post.readTime}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center space-x-1">
                                      <Eye className="h-3 w-3" />
                                      <span>{post.views}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <MessageCircle className="h-3 w-3" />
                                      <span>{post.commentsCount}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Department Badge */}
                                {post.department && (
                                  <div className="flex-shrink-0 ml-4">
                                    <Badge variant="outline" className="text-xs">
                                      {post.department.name}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* View All Posts Link */}
                    {app.postsCount > 3 && (
                      <div className="mt-6 text-center">
                        <Link
                          href={`/news?app=${app.id}`}
                          className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium"
                        >
                          Lihat semua artikel ({app.postsCount})
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Butuh Bantuan?
            </h2>
            <p className="text-xl text-slate-200 mb-6 max-w-2xl mx-auto">
              Tim dukungan kami siap membantu Anda menggunakan layanan digital PINTUMAS
            </p>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="bg-amber-400/20 border-amber-400/30 text-amber-100 hover:bg-amber-400/30">
                Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
