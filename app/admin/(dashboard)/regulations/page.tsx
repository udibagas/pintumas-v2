'use client'

import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useCrud } from '@/hooks/useCrud'
import { useAuth } from '@/hooks/use-auth'
import RegulationDialog from './RegulationDialog'
import RegulationsTable from './RegulationsTable'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function RegulationsPage() {
  const regulationsHook = useCrud('/api/admin/regulations')
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Peraturan</h1>
              <p className="text-gray-600 mt-1">
                Kelola peraturan organisasi dan dokumen kepatuhan
              </p>
            </div>
            {user?.role === 'MODERATOR' && (
              <Button
                onClick={() => regulationsHook.setModalOpen(true)}
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Tambah Peraturan
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <RegulationsTable hook={regulationsHook} />
          {user?.role === 'MODERATOR' && (
            <RegulationDialog hook={regulationsHook} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
