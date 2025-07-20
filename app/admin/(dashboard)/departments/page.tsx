'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DepartmentsTable from './DepartmentsTable';
import { Button } from '@/components/ui/button';
import DepartmentDialog from './DepartmentDialog';
import { useCrud } from '@/hooks/useCrud';
import { DepartmentData } from './types';

export default function DepartmentsPage() {
  const hook = useCrud<DepartmentData>('/api/admin/departments');
  const { setModalOpen } = hook;

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
            <Button variant="default" onClick={() => setModalOpen(true)}>
              Tambah Department
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <DepartmentsTable hook={hook} />
        </CardContent>
      </Card>

      <DepartmentDialog hook={hook} />
    </div>
  );
}
