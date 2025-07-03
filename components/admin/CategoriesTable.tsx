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
import { MoreHorizontal, Edit, Trash2, ArrowUpDown } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import CategoryDialog from './CategoryDialog'

interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  color?: string | null
  _count: {
    posts: number
  }
}

interface CategoriesTableProps {
  categories: Category[]
  onRefresh?: () => void
}

const handleDelete = async (categoryId: string, onRefresh?: () => void) => {
  if (!confirm('Are you sure you want to delete this category?')) return

  try {
    const response = await axios.delete(`/api/admin/categories/${categoryId}`)

    if (response.status === 200) {
      toast.success('Category deleted successfully!')
      onRefresh?.()
    } else {
      toast.error('Failed to delete category')
    }
  } catch (error) {
    toast.error('Error deleting category')
  }
}

export default function CategoriesTable({ categories, onRefresh }: CategoriesTableProps) {
  const columns: ColumnDef<Category>[] = useMemo(
    () => [
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
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.getValue('name')}</div>
            <div className="text-sm text-gray-500">/{row.original.slug}</div>
          </div>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
          <div className="max-w-[300px] truncate">
            {row.getValue('description') || 'No description'}
          </div>
        ),
      },
      {
        accessorKey: 'color',
        header: 'Color',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded-full ${row.getValue('color') || 'bg-gray-300'
                }`}
            />
            <span className="text-sm text-gray-600">
              {row.getValue('color') || 'No color'}
            </span>
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
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          const category = row.original

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <CategoryDialog
                  category={{
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                    description: category.description ?? null,
                    color: category.color ?? null,
                  }}
                  isEdit={true}
                  onSuccess={onRefresh}
                  trigger={
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  }
                />
                <DropdownMenuItem
                  onClick={() => handleDelete(category.id, onRefresh)}
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
    [onRefresh]
  )

  return (
    <DataTable
      columns={columns}
      data={categories}
      searchKey="name"
      searchPlaceholder="Search categories..."
    />
  )
}
