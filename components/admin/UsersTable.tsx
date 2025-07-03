'use client'

import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/ui/data-table'
import { MoreHorizontal, Edit, Trash2, ArrowUpDown, Shield, User as UserIcon, Crown } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import DeleteAlertDialog from '@/components/ui/DeleteAlertDialog'

interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN' | 'MODERATOR'
  avatar?: string | null
  bio?: string | null
  createdAt: Date
  _count: {
    posts: number
    comments: number
  }
}

interface UsersTableProps {
  users: User[]
}

const getRoleBadge = (role: User['role']) => {
  const roleConfig = {
    ADMIN: { color: 'bg-red-100 text-red-800', label: 'Admin', icon: Crown },
    MODERATOR: { color: 'bg-blue-100 text-blue-800', label: 'Moderator', icon: Shield },
    USER: { color: 'bg-gray-100 text-gray-800', label: 'User', icon: UserIcon },
  }
  const config = roleConfig[role] || roleConfig.USER
  const Icon = config.icon
  return (
    <Badge className={config.color}>
      <Icon className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  )
}

export default function UsersTable({ users }: UsersTableProps) {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            User
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={row.original.avatar || ''} alt={row.getValue('name')} />
              <AvatarFallback>
                {(row.getValue('name') as string).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{row.getValue('name')}</div>
              <div className="text-sm text-gray-500">{row.original.email}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => getRoleBadge(row.getValue('role')),
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: 'bio',
        header: 'Bio',
        cell: ({ row }) => (
          <div className="max-w-[200px] truncate">
            {row.getValue('bio') || 'No bio provided'}
          </div>
        ),
      },
      {
        accessorKey: '_count.posts',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Posts
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <Badge variant="secondary">{row.original._count.posts} posts</Badge>
        ),
      },
      {
        accessorKey: '_count.comments',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Comments
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <Badge variant="outline">{row.original._count.comments} comments</Badge>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) =>
          formatDistanceToNow(row.getValue('createdAt'), {
            addSuffix: true,
          }),
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          const user = row.original

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/users/${user.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setDeleteUserId(user.id)
                    setDialogOpen(true)
                  }}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    []
  )

  const roleOptions = [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Moderator', value: 'MODERATOR' },
    { label: 'User', value: 'USER' },
  ]

  const handleDelete = async () => {
    if (!deleteUserId) return

    try {
      const response = await axios.delete(`/api/admin/users/${deleteUserId}`)

      if (response.status === 200) {
        toast.success('User deleted successfully!')
      } else {
        toast.error('Failed to delete user')
      }
    } catch (error) {
      toast.error('Error deleting user')
    } finally {
      setDialogOpen(false)
      setDeleteUserId(null)
    }
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={users}
        searchKey="name"
        searchPlaceholder="Search users..."
        filterableColumns={[
          {
            id: 'role',
            title: 'Role',
            options: roleOptions,
          },
        ]}
      />
      <DeleteAlertDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDialogOpen(false)}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </>
  )
}
