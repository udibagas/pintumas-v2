'use client';

import { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Edit, Trash2, ArrowUpDown, MoreHorizontal, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { Department } from './store';


interface DepartmentsTableProps {
  departments: Department[];
  onRefresh?: () => void;
  setDepartment: (department: Department) => void;
  setIsFormOpen: (isOpen: boolean) => void;
}

export default function DepartmentsTable({
  departments,
  onRefresh,
  setDepartment,
  setIsFormOpen,
}: DepartmentsTableProps) {
  const [deleteDepartmentId, setDeleteDepartmentId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const columns: ColumnDef<Department>[] = useMemo(
    () => [
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
              {link}
            </a>
          ) : (
            <span className="text-gray-400">No link</span>
          );
        },
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          const department = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setIsFormOpen(true);
                    setDepartment(department);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setDeleteDepartmentId(department.id);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [setDepartment, setIsFormOpen]
  );

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/admin/departments/${deleteDepartmentId}`);

      if (response.status === 200) {
        toast.success('Department deleted successfully!');
        onRefresh?.();
      } else {
        toast.error('Failed to delete department');
      }
    } catch (error) {
      toast.error('Error deleting department');
    } finally {
      setDeleteDepartmentId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={departments}
        searchKey="name"
        searchPlaceholder="Search departments..."
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </>
  );
}
