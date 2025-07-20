'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTagPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main tags page - the modal will handle creation
    router.replace('/admin/tags');
  }, [router]);

  return null;
}
