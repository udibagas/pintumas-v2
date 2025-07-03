'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CategoriesTable from '@/components/admin/CategoriesTable';
import CategoryDialog from '@/components/admin/CategoryDialog';
import axios from 'axios';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  _count: {
    posts: number;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600">Organize content with categories</p>
        </div>
        <CategoryDialog onSuccess={fetchCategories} />
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-8">Loading categories...</div>
          ) : (
            <CategoriesTable categories={categories} onRefresh={fetchCategories} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
