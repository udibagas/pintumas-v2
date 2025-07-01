'use client'

import { useMemo } from 'react'
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
import { MoreHorizontal, Edit, Trash2, ArrowUpDown, Tag as TagIcon } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface Tag {
  id: string
  name: string
  slug: string
  createdAt: Date
  _count: {
    posts: number
  }
}

interface TagsTableProps {
  tags: Tag[]
}

const handleDelete = async (tagId: string) => {
  if (!confirm('Are you sure you want to delete this tag?')) return

  try {
    const response = await fetch(`/api/admin/tags/${tagId}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      window.location.reload()
    } else {
      alert('Failed to delete tag')
    }
  } catch (error) {
    alert('Error deleting tag')
  }
}

export default function TagsTable({ tags }: TagsTableProps) {
  const columns: ColumnDef<Tag>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Tag
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <TagIcon className="h-4 w-4 text-gray-500" />
            <div>
              <div className="font-medium">{row.getValue('name')}</div>
              <div className="text-sm text-gray-500">/{row.original.slug}</div>
            </div>
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
          const tag = row.original

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
                  <Link href={`/admin/tags/${tag.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(tag.id)}
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

  return (
    <DataTable
      columns={columns}
      data={tags}
      searchKey="name"
      searchPlaceholder="Search tags..."
    />
  )
}
