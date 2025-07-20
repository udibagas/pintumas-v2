'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UsersTable from './UsersTable';
import { Button } from '@/components/ui/button';
import UserDialog from './UserDialog';
import { useCrud } from '@/hooks/useCrud';
import { UserWithCounts } from './types';

export default function UsersPage() {
  const hook = useCrud<UserWithCounts>('/api/admin/users');
  const { setModalOpen } = hook;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage user accounts, roles, and permissions here.
              </CardDescription>
            </div>
            <Button variant="default" onClick={() => setModalOpen(true)}>
              Tambah User
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <UsersTable hook={hook} />
        </CardContent>
      </Card>

      <UserDialog hook={hook} />
    </div>
  );
}
