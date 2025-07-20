'use client'

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { Edit, Trash2, ArrowUpDown } from 'lucide-react'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { TagWithPostCount } from './types'
import { UseCrudType } from '@/hooks/useCrud'

export default function TagsTable({ hook }: { hook: UseCrudType }) {
  const [deleteTagId, setDeleteTagId] = useState<string | number | null>(null)
  const { setModalOpen, setEditingData, useFetch, isDeleteConfirmOpen, setDeleteConfirmOpen, handleDelete } = hook
  const { data = [] } = useFetch<TagWithPostCount[]>()

  const columns: ColumnDef<TagWithPostCount>[] = [
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
        const tag = row.original

        return (
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setModalOpen(true)
                setEditingData(tag)
              }}
              className="cursor-pointer text-blue-600 hover:bg-blue-100 text-xs"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setDeleteTagId(tag.id)
                setDeleteConfirmOpen(true)
              }}
              className="cursor-pointer text-red-600 hover:bg-red-100 text-xs"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
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
        searchPlaceholder="Search tags..."
      />

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={() => handleDelete(deleteTagId as string)}
      />
    </>
  )
}
