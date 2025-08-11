'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, ChevronLeft, ChevronRight, FileText, ArrowUpDown } from 'lucide-react';
import { RegulationData, DepartmentData, RegulationsResponse } from './types';
import { useFetch } from '@/hooks/useFetch';

export default function RegulationsPage() {
  const [regulations, setRegulations] = useState<RegulationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const limit = 10;

  // Check if mobile view
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Fetch departments for filter
  const { data: departments = [] } = useFetch<DepartmentData[]>('/api/departments');

  // Fetch regulations
  useEffect(() => {
    const fetchRegulations = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: limit.toString(),
        });

        if (searchTerm) {
          params.append('search', searchTerm);
        }

        if (selectedDepartment !== 'all') {
          params.append('departmentId', selectedDepartment);
        }

        const response = await fetch(`/api/regulations?${params}`);
        if (response.ok) {
          const data: RegulationsResponse = await response.json();
          setRegulations(data.data);
          setTotalPages(data.pagination.totalPages);
          setTotalCount(data.pagination.totalCount);
        }
      } catch (error) {
        console.error('Error fetching regulations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegulations();
  }, [currentPage, searchTerm, selectedDepartment]);

  // Handle search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle department filter change
  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Peraturan</h1>
        <p className="text-gray-600">
          Kumpulan peraturan dan kebijakan organisasi yang dapat diakses oleh publik
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari berdasarkan judul atau nomor peraturan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Department Filter */}
            <div className="w-full md:w-64">
              <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Instansi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Instansi</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="mb-4 text-sm text-gray-600">
        Menampilkan {regulations.length} dari {totalCount} peraturan
      </div>

      {/* Regulations Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Nomor</TableHead>
                  <TableHead className="min-w-[250px]">Judul & Deskripsi</TableHead>
                  <TableHead className="w-[130px] hidden sm:table-cell">Instansi</TableHead>
                  <TableHead className="w-[130px] hidden md:table-cell">Berlaku</TableHead>
                  <TableHead className="w-[100px] hidden lg:table-cell text-center">Lampiran</TableHead>
                  <TableHead className="w-[130px] hidden xl:table-cell">Diperbarui</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading skeleton rows
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index} className="animate-pulse">
                      <TableCell><div className="h-4 bg-gray-200 rounded w-3/4"></div></TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell"><div className="h-4 bg-gray-200 rounded w-full"></div></TableCell>
                      <TableCell><div className="h-4 bg-gray-200 rounded w-full"></div></TableCell>
                      <TableCell className="hidden md:table-cell"><div className="h-4 bg-gray-200 rounded w-full"></div></TableCell>
                      <TableCell className="hidden lg:table-cell"><div className="h-4 bg-gray-200 rounded w-full"></div></TableCell>
                      <TableCell className="hidden xl:table-cell"><div className="h-4 bg-gray-200 rounded w-full"></div></TableCell>
                    </TableRow>
                  ))
                ) : regulations.length === 0 ? (
                  // Empty state
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <FileText className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Tidak ada peraturan ditemukan
                        </h3>
                        <p className="text-gray-600">
                          Coba ubah kriteria pencarian atau filter untuk menemukan peraturan.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  // Regulations rows
                  regulations.map((regulation) => (
                    <TableRow key={regulation.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {regulation.number}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900 leading-tight">
                            {regulation.title}
                          </div>
                          {regulation.description && (
                            <div className="text-sm text-gray-600 leading-relaxed">
                              {truncateContent(regulation.description, 150)}
                            </div>
                          )}
                          {/* Show department and other info on mobile when columns are hidden */}
                          <div className="flex flex-wrap gap-2 mt-2 sm:hidden">
                            {regulation.department && (
                              <Badge variant="secondary" className="text-xs">
                                {regulation.department.name}
                              </Badge>
                            )}
                            {regulation.effectiveDate && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                Berlaku: {formatDate(regulation.effectiveDate)}
                              </span>
                            )}
                          </div>
                          {/* Show download button on mobile when attachment column is hidden */}
                          {regulation.attachmentUrl && (
                            <div className="mt-2 lg:hidden">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-7 px-2 text-xs"
                              >
                                <a
                                  href={regulation.attachmentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Unduh Lampiran
                                </a>
                              </Button>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {regulation.department ? (
                          <Badge variant="secondary" className="text-xs">
                            {regulation.department.name}
                          </Badge>
                        ) : (
                          <span className="text-gray-500 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {regulation.effectiveDate ? (
                          <span className="text-sm text-gray-600">
                            {formatDate(regulation.effectiveDate)}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-center">
                        {regulation.attachmentUrl ? (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="h-8 px-3 text-xs bg-amber-500 text-white"
                          >
                            <a
                              href={regulation.attachmentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-3 w-3" />
                            </a>
                          </Button>
                        ) : (
                          <span className="text-gray-500 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <span className="text-sm text-gray-600">
                          {formatDate(regulation.updatedAt)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          {/* Results info */}
          <div className="text-sm text-gray-600">
            Menampilkan {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, totalCount)} dari {totalCount} peraturan
          </div>

          {/* Pagination controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </Button>

            {/* Page numbers - show fewer on mobile */}
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(isMobile ? 3 : 5, totalPages) }, (_, i) => {
                let pageNum;
                const maxPages = isMobile ? 3 : 5;

                if (totalPages <= maxPages) {
                  pageNum = i + 1;
                } else if (currentPage <= Math.floor(maxPages / 2) + 1) {
                  pageNum = i + 1;
                } else if (currentPage > totalPages - Math.floor(maxPages / 2)) {
                  pageNum = totalPages - maxPages + 1 + i;
                } else {
                  pageNum = currentPage - Math.floor(maxPages / 2) + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <span className="hidden sm:inline">Berikutnya</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
