'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, MessageCircle, Eye, Clock, Phone, Mail, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface Author {
  id: string;
  name: string;
  avatar: string | null;
}

interface App {
  id: string;
  name: string;
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
  app: App | null;
  commentsCount: number;
}

interface Department {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  link: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  postsCount: number;
  usersCount: number;
  latestPosts: Post[];
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/departments/services');
      const data = await response.json();

      if (data.success) {
        setDepartments(data.data);
      } else {
        setError('Failed to load departments');
      }
    } catch (err) {
      setError('An error occurred while loading departments');
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading departments...</p>
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
            <Button onClick={fetchDepartments} className="mt-4">
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
      <div style={{ backgroundColor: '#011629' }} className="text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Unit Kerja PINTUMAS
            </h1>
            <p className="text-xl text-yellow-100 max-w-3xl mx-auto">
              Mengenal lebih dekat dengan berbagai instansi dan unit kerja di PINTUMAS dan
              mengakses informasi terkini dari setiap unit kerja.
            </p>
          </div>
        </div>
      </div>

      {/* Departments Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {departments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No departments available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {departments.map((department) => (
              <div key={department.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Department Header */}
                <div style={{ backgroundColor: '#011629' }} className="p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {department.imageUrl && (
                        <div className="flex-shrink-0">
                          <Image
                            src={department.imageUrl}
                            alt={department.name}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover bg-white/10 p-2"
                          />
                        </div>
                      )}
                      <div>
                        <h2 className="text-2xl font-bold">{department.name}</h2>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-100 border-yellow-500/30">
                            {department.postsCount} artikel
                          </Badge>
                          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-100 border-yellow-500/30">
                            <Users className="h-3 w-3 mr-1" />
                            {department.usersCount} pegawai
                          </Badge>
                        </div>

                        {/* Contact Info */}
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-yellow-100">
                          {department.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-4 w-4" />
                              <span>{department.phone}</span>
                            </div>
                          )}
                          {department.email && (
                            <div className="flex items-center space-x-1">
                              <Mail className="h-4 w-4" />
                              <span>{department.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {department.link && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-yellow-500/20 border-yellow-500/30 text-yellow-100 hover:bg-yellow-500/30"
                        onClick={() => window.open(department.link!, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Kunjungi
                      </Button>
                    )}
                  </div>
                </div>

                {/* Latest Posts */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Artikel Terbaru
                  </h3>

                  {department.latestPosts.length === 0 ? (
                    <p className="text-gray-500 italic">
                      Belum ada artikel dari departemen ini.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {department.latestPosts.map((post) => (
                        <div key={post.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
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
                                <h4 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1">
                                  <Link
                                    href={`/post/${post.slug}`}
                                    className="hover:text-yellow-600 transition-colors"
                                  >
                                    {post.title}
                                  </Link>
                                </h4>
                                {post.summary && (
                                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                                    {post.summary}
                                  </p>
                                )}

                                {/* Post Meta */}
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
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

                              {/* App Badge */}
                              {post.app && (
                                <div className="flex-shrink-0 ml-4">
                                  <Badge variant="outline" className="text-xs">
                                    {post.app.name}
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
                  {department.postsCount > 3 && (
                    <div className="mt-6 text-center">
                      <Link
                        href={`/news?department=${department.id}`}
                        className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium"
                      >
                        Lihat semua artikel ({department.postsCount})
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
