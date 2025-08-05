'use client'

import { useMemo, useState, useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/ui/data-table'
import { MoreHorizontal, Edit, Trash2, Eye, ArrowUpDown, Building, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import axios from 'axios'
import { formatDistanceToNow } from 'date-fns'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { PostWithRelations } from '@/app/admin/(dashboard)/posts/types'
import { useAuth } from '@/hooks/use-auth'

interface PostsTableProps {
  posts: PostWithRelations[]
}

const getStatusBadge = (status: PostWithRelations['status']) => {
  const statusConfig = {
    PUBLISHED: { color: 'bg-green-100 text-green-800', label: 'Published' },
    DRAFT: { color: 'bg-yellow-100 text-yellow-800', label: 'Draft' },
    ARCHIVED: { color: 'bg-gray-100 text-gray-800', label: 'Archived' },
  }
  const config = statusConfig[status] || statusConfig.DRAFT
  return (
    <Badge className={config.color}>
      {config.label}
    </Badge>
  )
}

export default function PostsTable({ posts }: PostsTableProps) {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [deletePostId, setDeletePostId] = useState<string | null>(null)
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([])
  const [apps, setApps] = useState<{ id: string; name: string }[]>([])

  // Fetch departments and apps for filtering
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptResponse, appsResponse] = await Promise.all([
          axios.get('/api/admin/departments'),
          axios.get('/api/admin/apps')
        ])
        setDepartments(deptResponse.data)
        setApps(appsResponse.data)
      } catch (error) {
        console.error('Error fetching filter data:', error)
      }
    }
    fetchData()
  }, [])

  const columns: ColumnDef<PostWithRelations>[] = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.getValue('title')}</div>
            <div className="text-sm text-gray-500 truncate max-w-[300px]">
              {row.original.summary || 'No summary'}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'author.name',
        header: 'Penulis',
        cell: ({ row }) => row.original.author.name,
      },
      {
        accessorKey: 'department',
        header: 'Instansi',
        cell: ({ row }) => {
          const post = row.original;
          return post.department ? (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Building className="w-3 h-3 mr-1" />
              {post.department.name}
            </Badge>
          ) : (
            <span className="text-gray-500 text-sm">No department</span>
          );
        },
      },
      {
        accessorKey: 'app',
        header: 'Layanan',
        cell: ({ row }) => {
          const post = row.original;
          return post.app ? (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <Smartphone className="w-3 h-3 mr-1" />
              {post.app.name}
            </Badge>
          ) : (
            <span className="text-gray-500 text-sm">No app</span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => getStatusBadge(row.getValue('status')),
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: 'allowComment',
        header: 'Komentar',
        cell: ({ row }) => {
          const allowComment = row.getValue('allowComment') as boolean;
          return (
            <Badge variant={allowComment ? "default" : "secondary"} className={allowComment ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}>
              {allowComment ? "Diizinkan" : "Dinonaktifkan"}
            </Badge>
          );
        },
      },
      {
        accessorKey: '_count.comments',
        header: 'Jumlah Komentar',
        cell: ({ row }) => row.original._count.comments,
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
          const post = row.original

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
                  <Link href={`/post/${post.slug}`} target="_blank">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/posts/${post.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setDeletePostId(post.id)
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

  const statusOptions = [
    { label: 'Published', value: 'PUBLISHED' },
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Archived', value: 'ARCHIVED' },
  ]

  const handleDelete = async () => {
    if (!deletePostId) return

    try {
      const response = await axios.delete(`/api/admin/posts/${deletePostId}`)

      if (response.status === 200) {
        toast.success('Post deleted successfully!')
        window.location.reload()
      } else {
        toast.error('Failed to delete post')
      }
    } catch (error) {
      toast.error('Error deleting post')
    } finally {
      setDialogOpen(false)
      setDeletePostId(null)
    }
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={posts}
        searchKey="title"
        searchPlaceholder="Cari informasi..."
        filterableColumns={[
          {
            id: 'status',
            title: 'Status',
            options: statusOptions,
          },
          {
            id: 'department',
            title: 'Instansi',
            options: departments.map(dept => ({ label: dept.name, value: dept.id })),
          },
          {
            id: 'app',
            title: 'Layanan',
            options: apps.map(app => ({ label: app.name, value: app.id })),
          },
        ]}
      />
      <ConfirmDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleDelete}
      />
    </>
  )
}
