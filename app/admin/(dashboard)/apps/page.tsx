'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppsTable from './AppsTable';
import { Button } from '@/components/ui/button';
import AppDialog from './AppDialog';
import { useCrud } from '@/hooks/useCrud';
import { AppsData } from './types';

export default function AppsPage() {
  const hook = useCrud<AppsData>('/api/admin/apps');
  const { setModalOpen } = hook;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Layanan</CardTitle>
              <CardDescription>
                Kelola layanan Anda di sini. Anda dapat membuat, mengedit, atau menghapus layanan.
              </CardDescription>
            </div>
            <Button variant="default" onClick={() => setModalOpen(true)}>
              Tambah Layanan
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <AppsTable hook={hook} />
        </CardContent>
      </Card>

      <AppDialog hook={hook} />
    </div>
  );
}
