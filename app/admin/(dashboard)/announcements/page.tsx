import { Metadata } from 'next';
import AnnouncementsTable from '@/components/admin/AnnouncementsTable';

export const metadata: Metadata = {
  title: 'Announcements - Admin | PINTUMAS',
  description: 'Manage announcements and ticker messages',
};

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Announcements</h1>
        <p className="text-gray-600">Manage announcements and ticker messages</p>
      </div>

      <AnnouncementsTable />
    </div>
  );
}
