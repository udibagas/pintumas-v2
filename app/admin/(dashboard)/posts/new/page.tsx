import { prisma } from '@/lib/prisma'
import PostForm from '@/components/admin/PostForm'

// Force dynamic rendering for database queries
export const dynamic = 'force-dynamic'

export default async function NewPostPage() {

  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' }
  })

  const apps = await prisma.apps.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <PostForm
      tags={tags}
      apps={apps}
      mode="create"
    />
  )
}
