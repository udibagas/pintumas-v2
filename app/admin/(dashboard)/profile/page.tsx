import Profile from '@/components/Profile';

export default function AdminProfilePage() {
  return <Profile redirectPath="/admin/login" showRoleInfo={true} />;
}

