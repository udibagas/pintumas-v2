'use client'

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { Edit, Trash2, ArrowUpDown, Building, FileText, ExternalLink } from 'lucide-react'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { RegulationData } from './types'
import { UseCrudType } from '@/hooks/useCrud'
import { formatDistanceToNow } from 'date-fns'

export default function RegulationsTable({ hook }: { hook: UseCrudType }) {
  const [deleteRegulationId, setDeleteRegulationId] = useState<string | null>(null)
  const { setModalOpen, setEditingData, useFetch, isDeleteConfirmOpen, setDeleteConfirmOpen, handleDelete } = hook
  const { data = [] } = useFetch<RegulationData[]>()

  const columns: ColumnDef<RegulationData>[] = [
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
      cell: ({ row }) => {
        const regulation = row.original;
        return (
          <div className="space-y-1">
            <div className="font-medium text-sm">{regulation.title}</div>
            <div className="text-xs text-gray-500">
              {regulation.content.length > 100
                ? `${regulation.content.substring(0, 100)}...`
                : regulation.content
              }
            </div>
          </div>
        );
      },
      size: 300,
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row }) => {
        const regulation = row.original;
        return regulation.department ? (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Building className="w-3 h-3 mr-1" />
            {regulation.department.name}
          </Badge>
        ) : (
          <span className="text-gray-500 text-sm">All departments</span>
        );
      },
      size: 150,
    },
    {
      accessorKey: 'attachmentUrl',
      header: 'Attachment',
      cell: ({ row }) => {
        const regulation = row.original;
        return regulation.attachmentUrl ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(regulation.attachmentUrl!, '_blank')}
            className="h-7"
          >
            <FileText className="w-3 h-3 mr-1" />
            View
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        ) : (
          <span className="text-gray-500 text-sm">No attachment</span>
        );
      },
      size: 120,
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
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return (
          <div className="text-sm text-gray-600">
            {formatDistanceToNow(date, { addSuffix: true })}
          </div>
        );
      },
      size: 100,
    },
    {
      id: 'actions',
      enableHiding: false,
      header: 'Actions',
      cell: ({ row }) => {
        const regulation = row.original

        return (
          <div className="flex items-center gap-2">
            <Button
              size={'sm'}
              variant="outline"
              onClick={() => {
                setModalOpen(true)
                setEditingData(regulation)
              }}
              className="cursor-pointer"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size={'sm'}
              variant="outline"
              onClick={() => {
                setDeleteRegulationId(regulation.id)
                setDeleteConfirmOpen(true)
              }}
              className="cursor-pointer text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
      size: 100,
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        searchKey="title"
        searchPlaceholder="Search regulations..."
        filterableColumns={[
          {
            id: 'department',
            title: 'Department',
            options: [
              ...Array.from(new Set(data.filter(r => r.department).map(r => r.department!.id)))
                .map(id => {
                  const dept = data.find(r => r.department?.id === id)?.department!;
                  return { label: dept.name, value: dept.id };
                }),
              { label: 'All departments', value: 'null' }
            ],
          },
        ]}
      />

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={() => handleDelete(deleteRegulationId as string)}
      />
    </>
  )
}
