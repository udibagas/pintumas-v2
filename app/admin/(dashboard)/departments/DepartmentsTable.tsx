'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Edit, Trash2, ArrowUpDown, ExternalLink } from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { DepartmentData } from './types';
import { UseCrudType } from '@/hooks/useCrud';
import Image from 'next/image';

export default function DepartmentsTable({ hook }: { hook: UseCrudType }) {
  const [deleteDepartmentId, setDeleteDepartmentId] = useState<string | number | null>(null);
  const { setModalOpen, setEditingData, useFetch, isDeleteConfirmOpen, setDeleteConfirmOpen, handleDelete } = hook;
  const { data = [] } = useFetch<DepartmentData[]>();

  const columns: ColumnDef<DepartmentData>[] = [
    {
      accessorKey: 'imageUrl',
      header: 'Logo',
      cell: ({ row }) => {
        const imageUrl = row.getValue('imageUrl') as string;
        return imageUrl ? (
          <Image
            src={imageUrl}
            alt={row.original.name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-500 text-xs">No Logo</span>
          </div>
        );
      },
    },
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
      accessorKey: 'link',
      header: 'External Link',
      cell: ({ row }) => {
        const link = row.getValue('link') as string;
        return link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3" />
            <span className="max-w-[200px] truncate">{link}</span>
          </a>
        ) : (
          <span className="text-gray-400">No link</span>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      header: 'Aksi',
      cell: ({ row }) => {
        const department = row.original;

        return (
          <div className="flex items-center gap-2">
            <Button
              size={'sm'}
              variant="outline"
              onClick={() => {
                setModalOpen(true);
                setEditingData(department);
              }}
              className="cursor-pointer"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size={'sm'}
              variant="outline"
              onClick={() => {
                setDeleteDepartmentId(department.id);
                setDeleteConfirmOpen(true);
              }}
              className="cursor-pointer text-red-500 hover:text-red-600 text-xs"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Search departments..."
      />

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={() => handleDelete(deleteDepartmentId as string)}
      />
    </>
  );
}
