import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PostForm from '@/components/admin/PostForm';

export const dynamic = 'force-dynamic';

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const [post, categories, tags] = await Promise.all([
    prisma.post.findUnique({
      where: { id: params.id },
      include: {
        author: true,
        category: true,
        tags: true
      }
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' }
    }),
    prisma.tag.findMany({
      orderBy: { name: 'asc' }
    })
  ]);

  if (!post) {
    notFound();
  }

  return (
    <PostForm
      categories={categories}
      tags={tags}
      mode="edit"
      initialData={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        summary: post.summary || '',
        content: post.content,
        status: post.status,
        featured: post.featured,
        categoryId: post.categoryId,
        tagIds: post.tags.map(tag => tag.id),
        imageUrl: post.imageUrl || ''
      }}
    />
  );
}
