'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CategoriesTable from './CategoriesTable';
import { Button } from '@/components/ui/button';
import CategoryDialog from './CategoryDialog';
import { useCrud } from '@/hooks/useCrud';
import { CategoryWithPostCount } from './types';

export default function CategoriesPage() {
  const hook = useCrud<CategoryWithPostCount>('/api/admin/categories');
  const { setModalOpen } = hook;

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
            <Button variant="default" onClick={() => setModalOpen(true)}>
              Tambah Kategori
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <CategoriesTable hook={hook} />
        </CardContent>
      </Card>

      <CategoryDialog hook={hook} />
    </div>
  );
}
