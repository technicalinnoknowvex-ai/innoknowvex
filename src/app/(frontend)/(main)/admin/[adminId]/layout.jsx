'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useUserSession from '@/hooks/useUserSession';

// Simplified client-side admin layout.
// We no longer rely on `params.adminId` here; pages/components should use
// the authenticated session (via `useUserSession`) as PersonalInfoPage does.
export default function AdminLayout({ children }) {
  const router = useRouter();
  const { session, isSessionLoading } = useUserSession();

  useEffect(() => {
    if (isSessionLoading) return;

    // If not authenticated, send to login
    if (!session?.user_id) {
      router.push('/auth/student');
    }
  }, [session, isSessionLoading, router]);

  if (isSessionLoading) return null;
  if (!session?.user_id) return null;

  return children;
}
