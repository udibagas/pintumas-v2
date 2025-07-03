'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CategoriesTable from '@/components/admin/CategoriesTable';
import axios from 'axios';
import { Category } from '@prisma/client';
import { Button } from '@/components/ui/button';
import CategoryDialog from '@/components/admin/CategoryDialog';
import { set } from 'date-fns';

interface CategoryWithPostCount extends Category {
  _count: {
    posts: number
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithPostCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category | undefined>(undefined)
  const [isFormOpen, setIsFormOpen] = useState(false);


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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Categories</CardTitle>
              <CardDescription>
                Manage your categories here. You can create, edit, or delete categories.
              </CardDescription>
            </div>
            <Button variant="default" onClick={() => setIsFormOpen(true)}>
              Tambah Kategori
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-8">Loading categories...</div>
          ) : (
            <CategoriesTable
              categories={categories}
              setCategory={setCategory}
              setIsFormOpen={setIsFormOpen}
              onRefresh={fetchCategories}
            />
          )}
        </CardContent>
      </Card>

      <CategoryDialog
        category={category}
        onSuccess={fetchCategories}
        isOpen={isFormOpen}
        handleOpenChange={(open) => {
          setIsFormOpen(open)
          if (!open) {
            setCategory(undefined)
          }
        }}
      />
    </div>
  );
}
