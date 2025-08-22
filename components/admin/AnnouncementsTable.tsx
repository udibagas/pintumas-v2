'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Edit, Trash2, Plus, Eye, EyeOff, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';
import Link from 'next/link';

interface AnnouncementPost {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  linkUrl: string | null;
  linkText: string | null;
  posterImage: string | null;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  department?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export default function AnnouncementsTable() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<AnnouncementPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/announcements');

      if (response.data.success) {
        setAnnouncements(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await axios.delete(`/api/admin/announcements/${id}`);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  }, [fetchAnnouncements]);

  const columns: ColumnDef<AnnouncementPost>[] = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="h-auto p-0 font-semibold"
            >
              Title
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const announcement = row.original;
          return (
            <div className="min-w-0">
              <div className="font-medium truncate">{announcement.title}</div>
              {announcement.summary && (
                <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {announcement.summary}
                </div>
              )}
            </div>
          );
        },
        size: 500,
      },
      {
        accessorKey: 'department',
        header: 'Department',
        cell: ({ row }) => {
          const department = row.original.department;
          return (
            <div className="truncate max-w-32">
              {department?.name || 'No Department'}
            </div>
          );
        },
        size: 120,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue('status') as string;
          return (
            <div className="flex items-center gap-2">
              {status === 'PUBLISHED' ? (
                <Eye className="h-4 w-4 text-green-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
              <span className={status === 'PUBLISHED' ? 'text-green-600' : 'text-gray-400'}>
                {status === 'PUBLISHED' ? 'Published' : 'Draft'}
              </span>
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
        size: 100,
      },
      {
        accessorKey: 'author.name',
        header: 'Author',
        cell: ({ row }) => {
          return (
            <div className="truncate max-w-32">
              {row.original.author.name}
            </div>
          );
        },
        size: 120,
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="h-auto p-0 font-semibold"
            >
              Created
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const date = row.getValue('createdAt') as string;
          return format(new Date(date), 'MMM d, yyyy');
        },
        size: 120,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const announcement = row.original;
          return (
            <div className="flex items-center justify-end gap-2">
              <Link href={`/admin/announcements/${announcement.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete &quot;{announcement.title}&quot;? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(announcement.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        },
        size: 100,
        enableSorting: false,
      },
    ],
    [handleDelete]
  );

  const filterableColumns = [
    {
      id: 'status',
      title: 'Status',
      options: [
        { label: 'Published', value: 'PUBLISHED' },
        { label: 'Draft', value: 'DRAFT' },
      ],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Announcements</CardTitle>
          <Link href="/admin/announcements/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Announcement
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            Loading announcements...
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={announcements}
            searchKey="title"
            searchPlaceholder="Search announcements..."
            filterableColumns={filterableColumns}
          />
        )}
      </CardContent>
    </Card>
  );
}
