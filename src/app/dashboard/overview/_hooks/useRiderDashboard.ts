'use client';

/**
 * useRiderDashboard
 *
 * Aggregates all data needed by the rider overview page.
 *
 * Verification status is now read from `verification.store` (loaded once by
 * `useVerificationBootstrap` in the layout) instead of being fetched here —
 * this eliminates a duplicate API call on every dashboard visit.
 */

import { useCallback } from 'react';

import { useAsyncData } from '@/hooks/useAsyncData';
import { dashboardService } from '@/services/dashboard.service';
import { vehicleService } from '@/services/vehicle.service';
import { rideService } from '@/services/ride.service';

import { useVerificationStore } from '@/store/verification.store';

export function useRiderDashboard() {
  const stats$ = useAsyncData(dashboardService.getRiderStats, [], {
    cacheKey: 'rider-dashboard-stats',
  });

  const rides$ = useAsyncData(
    () => rideService.getRiderRides(0, 20),
    [],
    {
      cacheKey: 'dashboard-upcoming-rides',
      ttlMs: 60_000,
    },
  );

  const vehicles$ = useAsyncData(vehicleService.getMyVehicles, [], {
    cacheKey: 'rider-dashboard-vehicles',
  });

  // ── Verification data comes from the shared store (no fetch here) ─────────
  const riderVerification = useVerificationStore((s) => s.verificationStatus);
  const verificationLoading = useVerificationStore((s) => s.isLoading);

  const loading =
    stats$.loading || rides$.loading || vehicles$.loading || verificationLoading;

  const error = stats$.error || rides$.error || vehicles$.error || '';

  const refetch = useCallback(() => {
    stats$.refetch?.();
    rides$.refetch?.();
    vehicles$.refetch?.();
  }, [stats$, rides$, vehicles$]);

  return {
    loading,
    error,

    stats: stats$.data ?? null,

    upcomingRides: rides$.data?.content ?? [],

    vehicles: vehicles$.data ?? [],
    vehicle: vehicles$.data ?? null,

    /** Full verification status from the shared store. */
    riderVerification,
  };
}