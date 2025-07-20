'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Building2 } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import { Department } from '@prisma/client';

export default function DepartmentsWidget() {
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
      <div className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center text-center animate-pulse">
              <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className='flex justify-center align-middle gap-16'>
          {departments.map((department) => (
            <div
              key={department.id}
              className="group flex flex-col items-center text-center cursor-pointer transition-all duration-200 hover:scale-105"
              onClick={() => {
                if (department.link) {
                  window.open(department.link, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              {/* Logo Circle */}
              <div className="relative mb-4">
                <div className="w-48 h-48 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-gray-100 group-hover:border-blue-200 transition-colors">
                  {department.imageUrl ? (
                    <Image
                      src={department.imageUrl}
                      alt={department.name}
                      width={80}
                      height={80}
                      className="rounded-full object-contain p-2"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-linear-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-blue-600" />
                    </div>
                  )}
                </div>

                {/* External Link Indicator */}
                {department.link && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>

              {/* Department Name */}
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-center leading-tight">
                {department.name}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {departments.length === 0 && (
        <div className="text-center py-16">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No departments available</p>
        </div>
      )}
    </section>
  );
}
