'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useCrud } from '@/hooks/useCrud'
import RegulationDialog from './RegulationDialog'
import RegulationsTable from './RegulationsTable'

export default function RegulationsPage() {
  const regulationsHook = useCrud('/api/admin/regulations')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Regulations</h1>
          <p className="text-gray-600 mt-1">
            Manage organizational regulations and compliance documents
          </p>
        </div>
        <Button
          onClick={() => regulationsHook.setModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Regulation
        </Button>
      </div>

      <RegulationsTable hook={regulationsHook} />
      <RegulationDialog hook={regulationsHook} />
    </div>
  )
}
