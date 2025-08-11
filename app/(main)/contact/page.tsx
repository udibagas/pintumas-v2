'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Facebook,
  X,
  Instagram,
  Youtube,
  Linkedin,
  Building2,
  Globe,
  Clock
} from 'lucide-react';
import Image from 'next/image';

interface Department {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  link: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  youtube: string | null;
  linkedin: string | null;
  _count: {
    posts: number;
    users: number;
    Regulations: number;
  };
}

interface ContactResponse {
  success: boolean;
  data: Department[];
}

export default function ContactPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/departments/contact');
      const data: ContactResponse = await response.json();

      if (data.success) {
        setDepartments(data.data);
      } else {
        setError('Failed to load departments');
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const getSocialMediaColor = (platform: string) => {
    switch (platform) {
      case 'facebook': return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600';
      case 'twitter': return 'bg-black hover:bg-black-600 hover:text-white text-white border-black-500';
      case 'instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-purple-500';
      case 'youtube': return 'bg-red-600 hover:bg-red-700 text-white border-red-600';
      case 'linkedin': return 'bg-blue-700 hover:bg-blue-800 text-white border-blue-700';
      default: return 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600';
    }
  };

  const getSocialMediaIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="h-4 w-4" />;
      case 'twitter': return <X className="h-4 w-4" />;
      case 'instagram': return <Instagram className="h-4 w-4" />;
      case 'youtube': return <Youtube className="h-4 w-4" />;
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getSocialMediaLabel = (platform: string) => {
    switch (platform) {
      case 'facebook': return 'Facebook';
      case 'twitter': return 'X';
      case 'instagram': return 'Instagram';
      case 'youtube': return 'YouTube';
      case 'linkedin': return 'LinkedIn';
      default: return 'Website';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-12">
          {/* Loading skeleton */}
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <div className="h-12 bg-gray-200 rounded-lg w-1/2 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-3/4 mx-auto animate-pulse"></div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 mb-4">
              <Building2 className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Departments
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchDepartments} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Hubungi Kami
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Temukan informasi kontak lengkap dari berbagai instansi dan unit kerja di PINTUMAS.
              Kami siap melayani Anda dengan profesional dan responsif.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Departments Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((department) => (
            <Card key={department.id} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {department.imageUrl ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={department.imageUrl}
                          alt={`${department.name} logo`}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {department.name}
                      </CardTitle>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Contact Information */}
                <div className="space-y-3">
                  {department.phone && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Phone className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <a
                        href={`tel:${department.phone}`}
                        className="text-gray-700 hover:text-green-600 transition-colors"
                      >
                        {department.phone}
                      </a>
                    </div>
                  )}

                  {department.email && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <a
                        href={`mailto:${department.email}`}
                        className="text-gray-700 hover:text-blue-600 transition-colors break-all"
                      >
                        {department.email}
                      </a>
                    </div>
                  )}

                  {department.address && (
                    <div className="flex items-start space-x-3 text-sm">
                      <MapPin className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 leading-relaxed">
                        {department.address}
                      </span>
                    </div>
                  )}

                  {department.link && (
                    <div className="flex items-center space-x-3 text-sm">
                      <ExternalLink className="h-4 w-4 text-purple-600 flex-shrink-0" />
                      <a
                        href={department.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-purple-600 transition-colors break-all"
                      >
                        Website Resmi
                      </a>
                    </div>
                  )}
                </div>

                {/* Social Media */}
                {(department.facebook || department.twitter || department.instagram || department.youtube || department.linkedin) && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Media Sosial</h4>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { platform: 'facebook', url: department.facebook },
                          { platform: 'twitter', url: department.twitter },
                          { platform: 'instagram', url: department.instagram },
                          { platform: 'youtube', url: department.youtube },
                          { platform: 'linkedin', url: department.linkedin },
                        ].map(({ platform, url }) =>
                          url && (
                            <Button
                              key={platform}
                              variant="outline"
                              size="sm"
                              asChild
                              className={`h-8 px-3 transition-all duration-200 ${getSocialMediaColor(platform)}`}
                            >
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={getSocialMediaLabel(platform)}
                              >
                                {getSocialMediaIcon(platform)}
                                <span className="ml-1 text-xs hidden sm:inline">
                                  {getSocialMediaLabel(platform)}
                                </span>
                              </a>
                            </Button>
                          )
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
