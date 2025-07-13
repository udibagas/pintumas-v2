'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Building2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { Department } from '@prisma/client';

export default function DepartmentsList() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('/api/admin/departments');
        setDepartments(response.data.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Departments</h2>
          <p className="text-muted-foreground">
            Browse our departments and visit their websites
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {departments.length} Departments
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((department) => (
          <Card
            key={department.id}
            className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-blue-200"
            onClick={() => {
              if (department.link) {
                window.open(department.link, '_blank', 'noopener,noreferrer');
              }
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {/* Logo */}
                <div className="flex-shrink-0">
                  {department.imageUrl ? (
                    <Image
                      src={department.imageUrl}
                      alt={department.name}
                      width={64}
                      height={64}
                      className="rounded-full object-cover border-2 border-gray-100 group-hover:border-blue-200 transition-colors"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-2 border-gray-100 group-hover:border-blue-200 transition-colors">
                      <Building2 className="h-8 w-8 text-blue-600" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                        {department.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        /{department.slug}
                      </p>
                    </div>

                    {department.link && (
                      <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="h-4 w-4 text-blue-500" />
                      </div>
                    )}
                  </div>

                  {/* Status and Link */}
                  <div className="mt-3 flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      Active
                    </Badge>

                    {department.link ? (
                      <span className="text-xs text-blue-600 font-medium">
                        Visit Website →
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">
                        No website
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {departments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
            <p className="text-gray-500">
              There are no departments to display at the moment.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
