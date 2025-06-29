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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
        <p className="text-gray-600">Write and publish a new article</p>
      </div>

      <PostForm
        categories={categories}
        tags={tags}
        mode="create"
      />
    </div>
  )
}
