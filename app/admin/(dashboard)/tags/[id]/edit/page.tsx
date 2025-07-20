'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface EditTagPageProps {
  params: {
    id: string
  }
}

export default function EditTagPage({ params }: EditTagPageProps) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main tags page - the modal will handle editing
    router.replace('/admin/tags');
  }, [router]);

  return null;
}
