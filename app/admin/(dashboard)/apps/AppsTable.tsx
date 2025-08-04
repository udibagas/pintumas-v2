'use client'

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { Edit, Trash2, ArrowUpDown, ExternalLink, Building } from 'lucide-react'
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
      accessorKey: 'DepartmentApps',
      header: 'Departments',
      cell: ({ row }) => {
        const app = row.original;
        const departments = app.DepartmentApps || [];

        if (departments.length === 0) {
          return <span className="text-gray-500 text-sm">No departments</span>;
        }

        return (
          <div className="flex flex-wrap gap-1">
            {departments.slice(0, 2).map((dept) => (
              <Badge key={dept.department.id} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Building className="w-3 h-3 mr-1" />
                {dept.department.name}
              </Badge>
            ))}
            {departments.length > 2 && (
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                +{departments.length - 2} more
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        const description = row.getValue('description') as string;
        return description ? (
          <span className="text-sm text-gray-600 max-w-[200px] truncate block">
            {description}
          </span>
        ) : (
          <span className="text-gray-500 text-sm">No description</span>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      header: 'Aksi',
      cell: ({ row }) => {
        const app = row.original

        return (
          <div className="flex items-center gap-2">
            <Button
              size={'sm'}
              variant="outline"
              onClick={() => {
                setModalOpen(true)
                setEditingData(app)
              }}
              className="cursor-pointer"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size={'sm'}
              variant="outline"
              onClick={() => {
                setDeleteAppId(app.id)
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
