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
              <CardTitle>Instansi</CardTitle>
              <CardDescription>
                Kelola instansi Anda di sini. Anda dapat membuat, mengedit, atau menghapus instansi.
              </CardDescription>
            </div>
            <Button variant="default" onClick={() => setModalOpen(true)}>
              Tambah Instansi
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
