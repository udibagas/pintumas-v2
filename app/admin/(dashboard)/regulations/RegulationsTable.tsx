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
import { useAuth } from '@/hooks/use-auth'
import { formatDistanceToNow } from 'date-fns'

export default function RegulationsTable({ hook }: { hook: UseCrudType }) {
  const { user } = useAuth()
  const [deleteRegulationId, setDeleteRegulationId] = useState<string | null>(null)
  const { setModalOpen, setEditingData, useFetch, isDeleteConfirmOpen, setDeleteConfirmOpen, handleDelete } = hook
  const { data: fetchedData = [] } = useFetch<RegulationData[]>()

  // Ensure data is always an array
  const data = Array.isArray(fetchedData) ? fetchedData : []

  const columns: ColumnDef<RegulationData>[] = [
    {
      accessorKey: 'number',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nomor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const regulation = row.original;
        return (
          <div className="font-mono text-sm">{regulation.number}</div>
        );
      },
      size: 120,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Judul Peraturan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const regulation = row.original;
        return (
          <div className="space-y-1">
            <div className="font-medium text-sm">{regulation.title}</div>
            {regulation.description && (
              <div className="text-xs text-gray-500">
                {regulation.description.length > 100
                  ? `${regulation.description.substring(0, 100)}...`
                  : regulation.description
                }
              </div>
            )}
          </div>
        );
      },
      size: 300,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const regulation = row.original;
        const statusConfig = {
          PUBLISHED: { label: 'Dipublikasikan', variant: 'default' as const },
          DRAFT: { label: 'Draft', variant: 'secondary' as const },
          ARCHIVED: { label: 'Diarsipkan', variant: 'outline' as const },
        };
        const config = statusConfig[regulation.status];
        return (
          <Badge variant={config.variant}>
            {config.label}
          </Badge>
        );
      },
      size: 100,
    },
    {
      accessorKey: 'departmentId',
      header: 'Instansi',
      cell: ({ row }) => {
        const regulation = row.original;
        return regulation.department ? (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Building className="w-3 h-3 mr-1" />
            {regulation.department.name}
          </Badge>
        ) : (
          <span className="text-gray-500 text-sm">Semua Instansi</span>
        );
      },
      size: 150,
    },
    {
      accessorKey: 'effectiveDate',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Berlaku
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const regulation = row.original;
        return regulation.effectiveDate ? (
          <div className="text-sm">
            {new Date(regulation.effectiveDate).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </div>
        ) : (
          <span className="text-gray-500 text-sm">Belum ditetapkan</span>
        );
      },
      size: 120,
    },
    {
      accessorKey: 'attachmentUrl',
      header: 'Lampiran',
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
            Lihat
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        ) : (
          <span className="text-gray-500 text-sm">Tidak ada lampiran</span>
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
          Dibuat
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

  ]

  if (user?.role == 'MODERATOR') {
    columns.push({
      id: 'actions',
      enableHiding: false,
      header: 'Aksi',
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
    })
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        searchKey="title"
        searchPlaceholder="Cari peraturan..."
        filterableColumns={[
          {
            id: 'departmentId',
            title: 'Instansi',
            options: [
              { label: 'Semua Instansi', value: '' },
              ...Array.from(
                new Set(
                  data
                    .filter(r => r.department && r.department.id)
                    .map(r => r.department!.id)
                )
              ).map(id => {
                const dept = data.find(r => r.departmentId === id)?.department;
                return dept ? { label: dept.name, value: id } : null;
              }).filter(Boolean) as Array<{ label: string; value: string }>,
            ],
          },
        ]}
      />

      {user?.role === 'MODERATOR' && (
        <ConfirmDialog
          isOpen={isDeleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          onConfirm={() => handleDelete(deleteRegulationId as string)}
        />
      )}
    </>
  )
}
