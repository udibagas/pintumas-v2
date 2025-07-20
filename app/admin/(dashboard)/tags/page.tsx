'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TagsTable from './TagsTable';
import { Button } from '@/components/ui/button';
import TagDialog from './TagDialog';
import { useCrud } from '@/hooks/useCrud';
import { TagWithPostCount } from './types';

export default function TagsPage() {
  const hook = useCrud<TagWithPostCount>('/api/admin/tags');
  const { setModalOpen } = hook;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Manage your tags here. You can create, edit, or delete tags.
              </CardDescription>
            </div>
            <Button variant="default" onClick={() => setModalOpen(true)}>
              Tambah Tag
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <TagsTable hook={hook} />
        </CardContent>
      </Card>

      <TagDialog hook={hook} />
    </div>
  );
}
