import { Metadata } from 'next';
import { Clock, ExternalLink, AlertCircle, Info, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatTimeAgo } from '@/lib/utils';
import Link from 'next/link';
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: 'Pengumuman - Pintumas',
  description: 'Pengumuman resmi terbaru dari Pelabuhan Tanjung Mas mengenai kebijakan, operasional, dan informasi penting lainnya.',
  keywords: 'pengumuman, announcement, pelabuhan tanjung mas, kebijakan, operasional, informasi penting',
  openGraph: {
    title: 'Pengumuman - Pintumas',
    description: 'Pengumuman resmi terbaru dari Pelabuhan Tanjung Mas mengenai kebijakan, operasional, dan informasi penting lainnya.',
    type: 'website',
    siteName: 'Pintumas',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pengumuman - Pintumas',
    description: 'Pengumuman resmi terbaru dari Pelabuhan Tanjung Mas.',
  },
};

export const dynamic = 'force-dynamic';

interface Announcement {
  id: string;
  text: string;
  content: string | null;
  type: string;
  priority: number;
  linkUrl: string | null;
  linkText: string;
  createdAt: Date;
  author: string;
}


async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const announcements = await prisma.announcement.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { startDate: null }, // No start date restriction
          { startDate: { lte: new Date() } }, // Start date has passed
        ],
        AND: [
          {
            OR: [
              { endDate: null }, // No end date restriction
              { endDate: { gte: new Date() } }, // End date hasn't passed yet
            ],
          },
        ],
      },
      select: {
        id: true,
        title: true,
        summary: true,
        announcementType: true,
        priority: true,
        linkUrl: true,
        linkText: true,
        createdAt: true,
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [
        { priority: "desc" }, // Higher priority first
        { createdAt: "desc" }, // Latest first
      ],
      take: 5, // Limit to 5 announcements for the ticker
    });

    return announcements.map((announcement) => ({
      id: announcement.id,
      text: announcement.title,
      content: announcement.summary,
      type: announcement.announcementType?.toLowerCase() || "info",
      priority: announcement.priority,
      linkUrl: announcement.linkUrl || null, // Use provided linkUrl or null
      linkText: announcement.linkText || "Selengkapnya",
      createdAt: announcement.createdAt,
      author: announcement.author.name,
    }));
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
}

function getAnnouncementIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'info':
      return <Info className="h-5 w-5 inline-block mr-2" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 inline-block mr-2" />;
    case 'success':
      return <CheckCircle className="h-5 w-5 inline-block mr-2" />;
    case 'urgent':
      return <AlertCircle className="h-5 w-5 inline-block mr-2" />;
    default:
      return <Info className="h-5 w-5 inline-block mr-2" />;
  }
}

function getAnnouncementColor(type: string) {
  switch (type.toLowerCase()) {
    case 'info':
      return 'bg-blue-50 border-blue-200 text-blue-700';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    case 'success':
      return 'bg-green-50 border-green-200 text-green-700';
    case 'urgent':
      return 'bg-red-50 border-red-200 text-red-700';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-700';
  }
}

function getBadgeVariant(type: string) {
  switch (type.toLowerCase()) {
    case 'info':
      return 'default';
    case 'warning':
      return 'secondary';
    case 'success':
      return 'outline';
    case 'urgent':
      return 'destructive';
    default:
      return 'default';
  }
}

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/" className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-6 transition-colors duration-200">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Beranda
      </Link>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Pengumuman Resmi
        </h1>
        <p className="text-xl text-gray-600 mx-auto mb-8">
          Informasi penting dan pengumuman terbaru dari Pelabuhan Tanjung Mas
        </p>
      </div>

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tidak Ada Pengumuman
            </h3>
            <p className="text-gray-600">
              Belum ada pengumuman yang tersedia saat ini.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {announcements.map((announcement) => (
            <Card
              key={announcement.id}
              className={`border-l-4 ${getAnnouncementColor(announcement.type)}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900">
                        {getAnnouncementIcon(announcement.type)}
                        {announcement.text}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatTimeAgo(announcement.createdAt)}
                        </div>
                        <span>•</span>
                        <span>Oleh {announcement.author}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getBadgeVariant(announcement.type)}>
                      {announcement.type.toUpperCase()}
                    </Badge>
                    {announcement.priority > 50 && (
                      <Badge variant="destructive">
                        PRIORITAS TINGGI
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {announcement.content}
                </p>

                {announcement.linkUrl && (
                  <div className="flex justify-start">
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={announcement.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {announcement.linkText}
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Kembali ke Beranda */}
      <div className="mt-12 text-center">
        <Button asChild variant="outline">
          <Link href="/">
            Kembali ke Beranda
          </Link>
        </Button>
      </div>
    </div>
  );
}
