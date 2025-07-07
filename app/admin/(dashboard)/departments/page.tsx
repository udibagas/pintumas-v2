'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DepartmentsTable from './DepartmentsTable';
import DepartmentDialog from './DepartmentDialog';
import { departmentStore } from './store';

export default function DepartmentsPage() {
  const {
    fetchItems,
    items,
    loading,
    setIsFormOpen,
    isFormOpen,
    item,
    setItem
  } = departmentStore();

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Departments</CardTitle>
              <CardDescription>
                Manage your departments here. You can create, edit, or delete departments.
              </CardDescription>
            </div>
            <Button variant="default" onClick={() => setIsFormOpen(true)}>
              Add Department
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-8">Loading departments...</div>
          ) : (
            <DepartmentsTable
              departments={items}
              onRefresh={fetchItems}
              setDepartment={setItem}
              setIsFormOpen={setIsFormOpen}
            />
          )}
        </CardContent>
      </Card>

      <DepartmentDialog
        department={item}
        onSuccess={fetchItems}
        isOpen={isFormOpen}
        handleOpenChange={(open: boolean) => {
          setIsFormOpen(open);
          if (!open) {
            setItem(undefined);
          }
        }}
      />
    </div>
  );
}
