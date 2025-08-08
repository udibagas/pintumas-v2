'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Users,
  Tags,
  Settings,
  Megaphone,
  Building2,
  AppWindow,
  PlusCircle,
  Scale,
} from 'lucide-react'
import { Button } from '../ui/button'

interface AdminSidebarProps {
  userRole: string
}

export default function AdminSidebar({ userRole }: AdminSidebarProps) {
  const pathname = usePathname()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'MODERATOR'],
    },
    {
      name: 'Informasi',
      href: '/admin/posts',
      icon: FileText,
      roles: ['ADMIN', 'MODERATOR'],
    },
    {
      name: 'Komentar',
      href: '/admin/comments',
      icon: MessageSquare,
      roles: ['ADMIN', 'MODERATOR'],
    },
    {
      name: 'Pengumuman',
      href: '/admin/announcements',
      icon: Megaphone,
      roles: ['ADMIN', 'MODERATOR'],
    },
    {
      name: 'Instansi',
      href: '/admin/departments',
      icon: Building2,
      roles: ['ADMIN'],
    },
    {
      name: 'Layanan',
      href: '/admin/apps',
      icon: AppWindow,
      roles: ['ADMIN'],
    },
    {
      name: 'Peraturan',
      href: '/admin/regulations',
      icon: Scale,
      roles: ['ADMIN', 'MODERATOR'],
    },
    {
      name: 'Tags',
      href: '/admin/tags',
      icon: Tags,
      roles: ['ADMIN'],
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      roles: ['ADMIN'],
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      roles: ['ADMIN'],
    }
  ]

  const filteredNavigation = navigation.filter(item =>
    item.roles.includes(userRole)
  )

  const router = useRouter();

  return (
    <div className="w-[240px] bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-2">
        <Button className="w-full" onClick={() => router.push('/admin/posts/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Buat Informasi
        </Button>
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}