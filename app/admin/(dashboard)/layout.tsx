import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  // Check if user is authenticated and has admin/moderator role
  if (!user || (user.role !== 'ADMIN' && user.role !== 'MODERATOR')) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={user} />
      <div className="flex">
        <AdminSidebar userRole={user.role} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
