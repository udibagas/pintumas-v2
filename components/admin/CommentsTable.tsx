'use client'

import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { Check, X, Trash2, ArrowUpDown } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import axios from 'axios'
import { toast } from 'sonner'
import DeleteAlertDialog from '@/components/ui/DeleteAlertDialog'

interface Comment {
  id: string
  content: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: Date
  author: {
    name: string
  }
  post: {
    title: string
    slug: string
  }
}

interface CommentsTableProps {
  comments: Comment[]
  onRefresh?: () => void
}

const getStatusBadge = (status: Comment['status']) => {
  const statusConfig = {
    PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    APPROVED: { color: 'bg-green-100 text-green-800', label: 'Approved' },
    REJECTED: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
  }
  const config = statusConfig[status] || statusConfig.PENDING
  return (
    <Badge className={config.color}>
      {config.label}
    </Badge>
  )
}

const handleStatusChange = async (commentId: string, newStatus: string) => {
  try {
    const response = await axios.put(`/api/admin/comments/${commentId}`, {
      status: newStatus,
    })

    if (response.status === 200) {
      window.location.reload()
    } else {
      toast.error('Failed to update comment status')
    }
  } catch (error) {
    toast.error('Error updating comment status')
  }
}

export default function CommentsTable({ comments, onRefresh }: CommentsTableProps) {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null)

  const columns: ColumnDef<Comment>[] = useMemo(
    () => [
      {
        accessorKey: 'content',
        header: 'Comment',
        cell: ({ row }) => (
          <div className="max-w-[300px] truncate">
            {row.getValue('content')}
          </div>
        ),
      },
      {
        accessorKey: 'author.name',
        header: 'Author',
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.author.name}</div>
          </div>
        ),
      },
      {
        accessorKey: 'post.title',
        header: 'Post',
        cell: ({ row }) => (
          <Link
            href={`/post/${row.original.post.slug}`}
            className="text-blue-600 hover:underline truncate block max-w-[200px]"
            target="_blank"
          >
            {row.original.post.title}
          </Link>
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
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Date
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
          const comment = row.original

          return (
            <div className="flex items-center gap-2">
              {comment.status === 'PENDING' && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(comment.id, 'APPROVED')}
                    className="text-green-600 border-green-300 hover:bg-green-50"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(comment.id, 'REJECTED')}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </>
              )}
              {comment.status === 'APPROVED' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange(comment.id, 'REJECTED')}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              {comment.status === 'REJECTED' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange(comment.id, 'APPROVED')}
                  className="text-green-600 border-green-300 hover:bg-green-50"
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setDeleteCommentId(comment.id)
                  setDialogOpen(true)
                }}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )
        },
      },
    ],
    []
  )

  const statusOptions = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
  ]

  const handleDelete = async () => {
    if (!deleteCommentId) return

    try {
      const response = await axios.delete(`/api/admin/comments/${deleteCommentId}`)

      if (response.status === 200) {
        toast.success('Comment deleted successfully!')
        onRefresh?.()
      } else {
        toast.error('Failed to delete comment')
      }
    } catch (error) {
      toast.error('Error deleting comment')
    } finally {
      setDialogOpen(false)
      setDeleteCommentId(null)
    }
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={comments}
        searchKey="author.name"
        searchPlaceholder="Search comments..."
      />
      <DeleteAlertDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleDelete}
        onCancel={() => setDialogOpen(false)}
      />
    </>
  )
}
