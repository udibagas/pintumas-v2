import { prisma } from '@/lib/prisma'
import TagForm from '@/components/admin/TagForm'
import { notFound } from 'next/navigation'

interface EditTagPageProps {
  params: {
    id: string
  }
}

export default async function EditTagPage({ params }: EditTagPageProps) {
  const tag = await prisma.tag.findUnique({
    where: { id: params.id },
  })

  if (!tag) {
    notFound()
  }

  return <TagForm initialData={tag} isEdit />
}
