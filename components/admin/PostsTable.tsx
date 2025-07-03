'use client'

import { useMemo, useState } from 'react'
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
import { MoreHorizontal, Edit, Trash2, Eye, ArrowUpDown } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import axios from 'axios'
import { formatDistanceToNow } from 'date-fns'
import DeleteAlertDialog from '@/components/ui/DeleteAlertDialog'

interface Post {
  id: string
  title: string
  summary?: string | null
  slug: string
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  createdAt: Date
  author: {
    name: string
  }
  category: {
    name: string
    color?: string | null
  }
  _count: {
    comments: number
  }
}

interface PostsTableProps {
  posts: Post[]
}

const getStatusBadge = (status: Post['status']) => {
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

  const columns: ColumnDef<Post>[] = useMemo(
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
        header: 'Author',
        cell: ({ row }) => row.original.author.name,
      },
      {
        accessorKey: 'category.name',
        header: 'Category',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${row.original.category.color || 'bg-gray-300'
                }`}
            />
            {row.original.category.name}
          </div>
        ),
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
        accessorKey: '_count.comments',
        header: 'Comments',
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
        searchPlaceholder="Search posts..."
        filterableColumns={[
          {
            id: 'status',
            title: 'Status',
            options: statusOptions,
          },
        ]}
      />
      <DeleteAlertDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete this post? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDialogOpen(false)}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </>
  )
}
