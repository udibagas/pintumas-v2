'use client'

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { Edit, Trash2, ArrowUpDown } from 'lucide-react'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { CategoryWithPostCount } from './types'
import { UseCrudType } from '@/hooks/useCrud'

export default function CategoriesTable({ hook }: { hook: UseCrudType }) {
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | number | null>(null)
  const { setModalOpen, setEditingData, useFetch, isDeleteConfirmOpen, setDeleteConfirmOpen, handleDelete } = hook
  const { data = [] } = useFetch<CategoryWithPostCount[]>()

  const columns: ColumnDef<CategoryWithPostCount>[] = [
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
      header: 'Aksi',
      cell: ({ row }) => {
        const category = row.original

        return (
          <div className="flex items-center gap-2">
            <Button
              size={'sm'}
              variant="outline"
              onClick={() => {
                setModalOpen(true)
                setEditingData(category)
              }}
              className="cursor-pointer"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size={'sm'}
              variant="outline"
              onClick={() => {
                setDeleteCategoryId(category.id)
                setDeleteConfirmOpen(true)
              }}
              className="cursor-pointer text-red-500 hover:text-red-600 text-xs"
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
        searchPlaceholder="Search categories..."
      />

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={() => handleDelete(deleteCategoryId as string)}
      />
    </>
  )
}
