'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, X, ExternalLink, Clock, User } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';
import Link from 'next/link';

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

interface AnnouncementsModalProps {
  announcements: Announcement[];
  isOpen: boolean;
  onClose: () => void;
}

export default function AnnouncementsModal({ announcements, isOpen, onClose }: AnnouncementsModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset to first announcement when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen]);

  // Auto-advance slides every 8 seconds
  useEffect(() => {
    if (!isOpen || announcements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isOpen, announcements.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? announcements.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'breaking':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'alert':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'event':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (announcements.length === 0) return null;

  const currentAnnouncement = announcements[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-semibold">Pengumuman Resmi</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          {/* Announcement Content */}
          <div className="space-y-4">
            {/* Header with type and navigation */}
            <div className="flex items-center justify-between">
              {announcements.length > 1 && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevious}
                    disabled={announcements.length <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-500">
                    {currentIndex + 1} / {announcements.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNext}
                    disabled={announcements.length <= 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900">
              {currentAnnouncement.text}
            </h3>

            {/* Meta information */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {formatTimeAgo(new Date(currentAnnouncement.createdAt))}
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {currentAnnouncement.author}
              </div>
            </div>

            {/* Content */}
            {currentAnnouncement.content && (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {currentAnnouncement.content}
                </p>
              </div>
            )}

            {/* Link button */}
            {currentAnnouncement.linkUrl && (
              <div className="pt-4">
                <Button asChild variant="default" className="w-full sm:w-auto">
                  <Link
                    href={currentAnnouncement.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {currentAnnouncement.linkText || 'Selengkapnya'}
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Dots indicator for multiple announcements */}
          {announcements.length > 1 && (
            <div className="flex justify-center space-x-2 pt-4">
              {announcements.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex
                    ? 'bg-yellow-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Link href="/announcements">
            <Button variant="outline" size="sm">
              Lihat Semua Pengumuman
            </Button>
          </Link>

          <Button variant="ghost" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
