'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Edit, Trash2, Plus, Search, Filter, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';
import Link from 'next/link';

interface AnnouncementPost {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  announcementType: string;
  priority: number;
  status: string;
  startDate: string | null;
  endDate: string | null;
  linkUrl: string | null;
  linkText: string | null;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function AnnouncementsTable() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<AnnouncementPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchQuery) params.append('search', searchQuery);
      if (typeFilter) params.append('type', typeFilter);
      if (activeFilter) params.append('status', activeFilter);

      const response = await axios.get(`/api/admin/announcements?${params}`);

      if (response.data.success) {
        setAnnouncements(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
        });

        if (searchQuery) params.append('search', searchQuery);
        if (typeFilter) params.append('type', typeFilter);
        if (activeFilter) params.append('status', activeFilter);

        const response = await axios.get(`/api/admin/announcements?${params}`);

        if (response.data.success) {
          setAnnouncements(response.data.data);
          setPagination(response.data.pagination);
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagination.page, pagination.limit, searchQuery, typeFilter, activeFilter]);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/admin/announcements/${id}`);
      fetchAnnouncements();
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchAnnouncements();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BREAKING':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'ALERT':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'EVENT':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 4:
        return { label: 'Urgent', color: 'bg-red-100 text-red-800' };
      case 3:
        return { label: 'High', color: 'bg-orange-100 text-orange-800' };
      case 2:
        return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
      default:
        return { label: 'Low', color: 'bg-gray-100 text-gray-800' };
    }
  };

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
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" variant="outline">
              Search
            </Button>
          </form>

          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="INFO">Info</SelectItem>
                <SelectItem value="BREAKING">Breaking</SelectItem>
                <SelectItem value="ALERT">Alert</SelectItem>
                <SelectItem value="EVENT">Event</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
              </SelectContent>
            </Select>

            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading announcements...
                  </TableCell>
                </TableRow>
              ) : announcements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No announcements found
                  </TableCell>
                </TableRow>
              ) : (
                announcements.map((announcement) => {
                  const priorityInfo = getPriorityLabel(announcement.priority);
                  return (
                    <TableRow key={announcement.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{announcement.title}</div>
                          {announcement.content && (
                            <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {announcement.content}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(announcement.announcementType)}>
                          {announcement.announcementType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityInfo.color}>
                          {priorityInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {announcement.status === 'PUBLISHED' ? (
                            <Eye className="h-4 w-4 text-green-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          )}
                          <span className={announcement.status === 'PUBLISHED' ? 'text-green-600' : 'text-gray-400'}>
                            {announcement.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{announcement.author.name}</TableCell>
                      <TableCell>
                        {format(new Date(announcement.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
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
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} announcements
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.pages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
