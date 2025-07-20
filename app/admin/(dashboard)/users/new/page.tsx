'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewUserPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main users page - the modal will handle creation
    router.replace('/admin/users');
  }, [router]);

  return null;
}
