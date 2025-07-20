import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AnnouncementForm from '@/components/admin/AnnouncementForm';
import axios from 'axios';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getAnnouncement(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await axios.get(`${baseUrl}/api/admin/announcements/${id}`);

    if (response.data.success) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching announcement:', error);
    return null;
  }
}

export const metadata: Metadata = {
  title: 'Edit Announcement - Admin | PINTUMAS',
  description: 'Edit announcement details',
};

export default async function EditAnnouncementPage({ params }: PageProps) {
  const { id } = await params;
  const announcement = await getAnnouncement(id);

  if (!announcement) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Announcement</h1>
        <p className="text-gray-600">Update announcement details</p>
      </div>

      <AnnouncementForm initialData={announcement} isEditing />
    </div>
  );
}
