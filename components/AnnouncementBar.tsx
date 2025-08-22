'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import axios from 'axios';

interface Announcement {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  announcementType: string;
  priority: number;
  status: string;
  startDate: string | null;
  endDate: string | null;
  linkUrl: string | null;
  linkText: string | null;
  views: number;
  imageUrl: string | null;
  posterImage: string | null;
  departmentId: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: string;
}

interface AnnouncementBarProps {
  onOpenAnnouncementsModal: () => void;
  onAnnouncementsChange?: (announcements: Announcement[]) => void;
}

export default function AnnouncementBar({ onOpenAnnouncementsModal, onAnnouncementsChange }: AnnouncementBarProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);

  // Fetch announcements from API
  const fetchAnnouncements = useCallback(async () => {
    try {
      setAnnouncementsLoading(true);
      const response = await axios.get('/api/announcements');
      if (response.data.success) {
        setAnnouncements(response.data.data);
        onAnnouncementsChange?.(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      // Fallback to default announcements
      const fallbackAnnouncements = [
        {
          id: '1',
          title: 'Welcome to PINTUMAS - Your trusted source for port information',
          summary: null,
          content: 'Stay updated with the latest news',
          announcementType: 'INFO',
          priority: 1,
          status: 'PUBLISHED',
          startDate: null,
          endDate: null,
          linkUrl: null,
          linkText: null,
          views: 0,
          imageUrl: null,
          posterImage: null,
          departmentId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          authorId: 'system'
        }
      ];
      setAnnouncements(fallbackAnnouncements);
      onAnnouncementsChange?.(fallbackAnnouncements);
    } finally {
      setAnnouncementsLoading(false);
    }
  }, [onAnnouncementsChange]);

  // Load announcements on component mount
  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  // Cycle through announcements
  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(() => {
        setCurrentAnnouncementIndex((prev: number) =>
          (prev + 1) % announcements.length
        );
      }, 5000); // Change every 5 seconds

      return () => clearInterval(interval);
    }
  }, [announcements]);

  // Get announcement type label
  const getAnnouncementTypeLabel = () => {
    if (announcements.length === 0) return 'INFORMASI';

    const currentType = announcements[currentAnnouncementIndex]?.announcementType;
    switch (currentType) {
      case 'BREAKING':
        return 'BERITA UTAMA';
      case 'ALERT':
        return 'PERINGATAN';
      case 'EVENT':
        return 'EVENT';
      case 'MAINTENANCE':
        return 'MAINTENANCE';
      default:
        return 'INFORMASI';
    }
  }; return (
    <div className="bg-red-600 text-white py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <span className="bg-yellow-500 text-black px-3 py-1 text-sm font-bold mr-4 shrink-0">
              {getAnnouncementTypeLabel()}
            </span>

            {announcementsLoading ? (
              <span className="text-sm">Loading latest news...</span>
            ) : announcements.length > 0 ? (
              announcements.length === 1 ? (
                // Single announcement - show directly
                <div className="flex-1 overflow-hidden">
                  <div className="animate-marquee whitespace-nowrap">
                    <span className="text-sm">
                      {announcements[0].linkUrl ? (
                        <Link
                          href={announcements[0].linkUrl}
                          className="hover:text-yellow-300 transition-colors cursor-pointer"
                        >
                          {announcements[0].title}
                        </Link>
                      ) : (
                        announcements[0].title
                      )}
                    </span>
                  </div>
                </div>
              ) : (
                // Multiple announcements - show clickable text
                <div className="flex-1">
                  <button
                    onClick={onOpenAnnouncementsModal}
                    className="text-sm hover:text-yellow-300 transition-colors cursor-pointer text-left"
                  >
                    {announcements[currentAnnouncementIndex].title}
                    <span className="ml-2 text-yellow-300">
                      ({announcements.length} pengumuman • Klik untuk melihat semua)
                    </span>
                  </button>
                </div>
              )
            ) : (
              <span className="text-sm">Welcome to PINTUMAS - Your trusted source for port information and news</span>
            )}
          </div>

          {/* View All Button for multiple announcements */}
          {announcements.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAnnouncementsModal}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 ml-4"
            >
              Lihat Semua ({announcements.length})
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
