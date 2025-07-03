import { Metadata } from 'next';
import AnnouncementsTable from '@/components/admin/AnnouncementsTable';

export const metadata: Metadata = {
  title: 'Announcements - Admin | PINTUMAS',
  description: 'Manage announcements and ticker messages',
};

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <AnnouncementsTable />
    </div>
  );
}
