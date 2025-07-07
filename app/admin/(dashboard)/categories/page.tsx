'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CategoriesTable from './CategoriesTable';
import { Button } from '@/components/ui/button';
import CategoryDialog from './CategoryDialog';
import { useStore } from './store';

export default function CategoriesPage() {
  const { fetchItems, loading, setIsFormOpen } = useStore();

  useEffect(() => {
    fetchItems();
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
            <CategoriesTable />
          )}
        </CardContent>
      </Card>

      <CategoryDialog />
    </div>
  );
}
