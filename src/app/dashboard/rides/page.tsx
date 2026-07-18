'use client';

import { Suspense } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import MyRidesPage from './_components/MyRidesPage';
import FindRidesPage from './_components/FindRidesPage';

export default function RidesPage() {
  const user = useCurrentUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    );
  }

  return user.role === 'ROLE_RIDER' ? (
    <MyRidesPage />
  ) : (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
        </div>
      }
    >
      <FindRidesPage />
    </Suspense>
  );
}
