'use client'

import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { Edit, Trash2, ArrowUpDown } from 'lucide-react'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { CategoryWithPostCount, useStore } from './store'

export default function CategoriesTable() {
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | number | null>(null)
  const { items, isDeleteConfirmOpen, setItem, setIsFormOpen, deleteItem, setIsDeleteConfirmOpen } = useStore()

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
      // {
      //   accessorKey: 'color',
      //   header: 'Color',
      //   cell: ({ row }) => (
      //     <div className="flex items-center gap-2">
      //       <div
      //         className={`w-4 h-4 rounded-full ${row.getValue('color') || 'bg-gray-300'
      //           }`}
      //       />
      //       <span className="text-sm text-gray-600">
      //         {row.getValue('color') || 'No color'}
      //       </span>
      //     </div>
      //   ),
      // },
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
        style: { textAlign: 'center', width: '120px' },
        cell: ({ row }) => {
          const category = row.original

          return (
            <>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsFormOpen(true)
                  setItem(category)
                }}
                className="cursor-pointer text-blue-600 hover:bg-blue-100 text-xs"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setDeleteCategoryId(category.id)
                  setIsDeleteConfirmOpen(true)
                }}
                className="cursor-pointer text-red-600 hover:bg-red-100 text-xs"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )
        },
      },
    ],
    []
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={items}
        searchKey="name"
        searchPlaceholder="Search categories..."
      />

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={() => deleteItem(deleteCategoryId as string)}
      />
    </>
  )
}
