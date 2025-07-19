'use client';

import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

export default function AdminLayout({ children, }: { children: React.ReactNode }) {

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={{ id: '1', name: 'Bagas', role: 'admin', email: 'admin@mail.com' }} />
      <div className="flex">
        <AdminSidebar userRole={'admin'} />
        <main className="flex-1 p-6">
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </main>
      </div>
    </div>
  )
}
