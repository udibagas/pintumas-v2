'use client'

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DataTable } from '@/components/ui/data-table'
import { Edit, Trash2, ArrowUpDown, Shield, User as UserIcon, Crown } from 'lucide-react'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { UserWithCounts } from './types'
import { UseCrudType } from '@/hooks/useCrud'

export default function UsersTable({ hook }: { hook: UseCrudType }) {
  const [deleteUserId, setDeleteUserId] = useState<string | number | null>(null)
  const { setModalOpen, setEditingData, useFetch, isDeleteConfirmOpen, setDeleteConfirmOpen, handleDelete } = hook
  const { data = [] } = useFetch<UserWithCounts[]>()

  type RoleKey = 'ADMIN' | 'MODERATOR' | 'USER';

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<RoleKey, { color: string; label: string; icon: React.ElementType }> = {
      ADMIN: { color: 'bg-red-100 text-red-800', label: 'Admin', icon: Crown },
      MODERATOR: { color: 'bg-blue-100 text-blue-800', label: 'Moderator', icon: Shield },
      USER: { color: 'bg-gray-100 text-gray-800', label: 'User', icon: UserIcon },
    }
    const config = roleConfig[(role as RoleKey)] || roleConfig.USER
    const Icon = config.icon
    return (
      <Badge className={`${config.color}`}>
        <Icon className="h-3 w-3 mr-2" />
        {config.label}
      </Badge>
    )
  }

  const columns: ColumnDef<UserWithCounts>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar || ''} alt={user.name} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => getRoleBadge(row.getValue('role')),
    },
    {
      id: 'activity',
      header: 'Activity',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="text-sm">
            <div>{user._count.posts} posts</div>
            <div className="text-gray-500">{user._count.comments} comments</div>
          </div>
        );
      },
    },
    {
      id: 'actions',
      size: 100,
      enableHiding: false,
      header: 'Aksi',
      cell: ({ row }) => {
        const user = row.original

        return (
          <div className="flex items-center gap-2">
            <Button
              size={'sm'}
              variant="outline"
              onClick={() => {
                setModalOpen(true)
                setEditingData(user)
              }}
              className="cursor-pointer"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size={'sm'}
              variant="outline"
              onClick={() => {
                setDeleteUserId(user.id)
                setDeleteConfirmOpen(true)
              }}
              className="cursor-pointer text-red-500 hover:text-red-600 "
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Search users..."
      />

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={() => handleDelete(deleteUserId as string)}
      />
    </>
  )
}
