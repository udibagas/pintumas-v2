'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Users,
  FolderOpen,
  Tags,
  Settings,
  BarChart3,
} from 'lucide-react'

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
      name: 'Posts',
      href: '/admin/posts',
      icon: FileText,
      roles: ['ADMIN', 'MODERATOR'],
    },
    {
      name: 'Comments',
      href: '/admin/comments',
      icon: MessageSquare,
      roles: ['ADMIN', 'MODERATOR'],
    },
    {
      name: 'Categories',
      href: '/admin/categories',
      icon: FolderOpen,
      roles: ['ADMIN'],
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
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      roles: ['ADMIN'],
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      roles: ['ADMIN'],
    },
  ]

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(userRole)
  )

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-2">
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
