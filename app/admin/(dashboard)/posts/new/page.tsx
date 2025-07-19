import { prisma } from '@/lib/prisma'
import PostForm from '@/components/admin/PostForm'

// Force dynamic rendering for database queries
export const dynamic = 'force-dynamic'

export default async function NewPostPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })

  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <PostForm
      categories={categories}
      tags={tags}
      mode="create"
    />
  )
}
