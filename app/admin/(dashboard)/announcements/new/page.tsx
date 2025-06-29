import { Metadata } from 'next';
import AnnouncementForm from '@/components/admin/AnnouncementForm';

export const metadata: Metadata = {
  title: 'New Announcement - Admin | PINTUMAS',
  description: 'Create a new announcement',
};

export default function NewAnnouncementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Announcement</h1>
        <p className="text-gray-600">Create a new announcement for the ticker</p>
      </div>

      <AnnouncementForm />
    </div>
  );
}
