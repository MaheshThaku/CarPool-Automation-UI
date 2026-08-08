'use client';

/**
 * useVerificationBootstrap
 *
 * Fetches the rider's full verification status exactly once when the dashboard
 * mounts (for ROLE_RIDER accounts only) and stores it in `verification.store`.
 *
 * Called from `DashboardLayout` so every child page can read from the store
 * without issuing its own API call.
 */

import { useEffect } from 'react';

import { useCurrentUser } from './useCurrentUser';
import { useVerificationStore } from '@/store/verification.store';

export function useVerificationBootstrap(): void {
  const user = useCurrentUser();
  const fetchVerificationStatus = useVerificationStore(
    (s) => s.fetchVerificationStatus,
  );
  const verificationStatus = useVerificationStore((s) => s.verificationStatus);

  useEffect(() => {
    // Only fetch for riders; passengers do not have this endpoint.
    if (user?.role !== 'ROLE_RIDER') return;

    // Only fetch if we do not already have data in the store (avoids a refetch
    // when the layout re-renders due to unrelated state changes).
    if (verificationStatus !== null) return;

    fetchVerificationStatus();
  }, [user?.role, verificationStatus, fetchVerificationStatus]);
}
