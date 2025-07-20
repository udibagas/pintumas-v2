'use client'

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Edit, Trash2, ArrowUpDown, ExternalLink } from 'lucide-react'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { AppsData } from './types'
import { UseCrudType } from '@/hooks/useCrud'
import Image from 'next/image'

export default function AppsTable({ hook }: { hook: UseCrudType }) {
  const [deleteAppId, setDeleteAppId] = useState<string | number | null>(null)
  const { setModalOpen, setEditingData, useFetch, isDeleteConfirmOpen, setDeleteConfirmOpen, handleDelete } = hook
  const { data = [] } = useFetch<AppsData[]>()

  const columns: ColumnDef<AppsData>[] = [
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
      cell: ({ row }) => {
        const app = row.original;
        return (
          <div className="flex items-center gap-3">
            {app.iconUrl && (
              <Image
                src={app.iconUrl}
                alt={app.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded object-cover"
              />
            )}
            <span className="font-medium">{app.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'link',
      header: 'Link',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 max-w-[300px] truncate">
            {row.getValue('link')}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(row.getValue('link'), '_blank')}
            className="h-6 w-6 p-0"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      header: 'Aksi',
      cell: ({ row }) => {
        const app = row.original

        return (
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setModalOpen(true)
                setEditingData(app)
              }}
              className="cursor-pointer text-blue-600 hover:bg-blue-100 text-xs"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setDeleteAppId(app.id)
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
        searchPlaceholder="Search apps..."
      />

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={() => handleDelete(deleteAppId as string)}
      />
    </>
  )
}
