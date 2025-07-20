'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface EditUserPageProps {
  params: {
    id: string
  }
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main users page with edit mode for this user
    router.replace(`/admin/users?edit=${params.id}`);
  }, [router, params.id]);

  return null;
}
