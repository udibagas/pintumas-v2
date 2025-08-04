import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PostForm from '@/components/admin/PostForm';

export const dynamic = 'force-dynamic';

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const [post, tags] = await Promise.all([
    prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        tags: true
      }
    }),
    prisma.tag.findMany({
      orderBy: { name: 'asc' }
    })
  ]);

  if (!post) {
    notFound();
  }

  // Fetch departments and apps data here
  const departments = await prisma.department.findMany({
    orderBy: { name: 'asc' }
  });
  const apps = await prisma.apps.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
    }
  });

  return (
    <PostForm
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
        tagIds: post.tags.map(tag => tag.id),
        imageUrl: post.imageUrl || ''
      }}
      departments={departments}
      apps={apps}
    />
  );
}
