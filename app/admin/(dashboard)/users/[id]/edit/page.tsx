import { prisma } from '@/lib/prisma'
import UserForm from '@/components/admin/UserForm'
import { notFound } from 'next/navigation'

interface EditUserPageProps {
  params: {
    id: string
  }
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      bio: true,
    },
  })

  if (!user) {
    notFound()
  }

  return <UserForm initialData={{
    ...user,
    avatar: user.avatar || undefined,
    bio: user.bio || undefined,
  }} isEdit />
}
