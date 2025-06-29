import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CategoryForm from '@/components/admin/CategoryForm';

export const dynamic = 'force-dynamic';

interface EditCategoryPageProps {
  params: {
    id: string;
  };
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const category = await prisma.category.findUnique({
    where: { id: params.id }
  });

  if (!category) {
    notFound();
  }

  return <CategoryForm category={category} isEdit={true} />;
}
