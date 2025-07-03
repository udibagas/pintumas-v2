'use client'

import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { Edit, Trash2, ArrowUpDown } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import DeleteAlertDialog from '../ui/DeleteAlertDialog'
import { Category } from '@prisma/client'

interface CategoryWithPostCount extends Category {
  _count: {
    posts: number
  }
}

interface CategoriesTableProps {
  categories: CategoryWithPostCount[]
  onRefresh?: () => void,
  setCategory: (category: Category) => void
  setIsFormOpen: (isOpen: boolean) => void
}

export default function CategoriesTable({
  categories,
  onRefresh,
  setCategory,
  setIsFormOpen
}: CategoriesTableProps) {
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null)

  const columns: ColumnDef<CategoryWithPostCount>[] = useMemo(
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
          <div className="font-medium">{row.getValue('name')}</div>
        ),
      },
      {
        accessorKey: 'slug',
        header: 'Slug',
        cell: ({ row }) => (
          <div className="text-sm text-gray-500">/{row.original.slug}</div>
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
            <>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsFormOpen(true)
                  setCategory(category)
                }}
                className="p-2"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setDeleteCategoryId(category.id)
                  setDeleteConfirmOpen(true)
                }}
                className="p-2 cursor-pointer hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </>
          )
        },
      },
    ],
    [onRefresh]
  )

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/admin/categories/${deleteCategoryId}`)

      if (response.status === 200) {
        toast.success('Category deleted successfully!')
        onRefresh?.()
      } else {
        toast.error('Failed to delete category')
      }
    } catch (error) {
      toast.error('Error deleting category')
    } finally {
      setDeleteConfirmOpen(false)
      setDeleteCategoryId(null)
    }
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={categories}
        searchKey="name"
        searchPlaceholder="Search categories..."
      />

      <DeleteAlertDialog
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </>
  )
}
