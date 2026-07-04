'use client';

import { useCallback } from 'react';

import { useAsyncData } from '@/hooks/useAsyncData';
import { dashboardService } from '@/services/dashboard.service';

export function useRiderDashboard() {
  const stats$ = useAsyncData(
    dashboardService.getRiderStats,
    [],
    {
      cacheKey: 'rider-dashboard-stats',
    },
  );

  const upcomingRides$ = useAsyncData(
    dashboardService.getUpcomingRides,
    [],
    {
      cacheKey: 'rider-dashboard-rides',
    },
  );

  const vehicles$ = useAsyncData(
    dashboardService.getVehicleInfo,
    [],
    {
      cacheKey: 'rider-dashboard-vehicles',
    },
  );

  const verification$ = useAsyncData(
  () => dashboardService.getVerificationStatus(),
  [],
  {
    cacheKey: 'rider-dashboard-verification',
  },
);

  const loading =
    stats$.loading ||
    upcomingRides$.loading ||
    vehicles$.loading;

  const error =
    stats$.error ||
    upcomingRides$.error ||
    vehicles$.error ||
    '';

  const refetch = useCallback(() => {
    stats$.refetch?.();
    upcomingRides$.refetch?.();
    vehicles$.refetch?.();
  }, [stats$, upcomingRides$, vehicles$]);

  const vehicle =
    vehicles$.data ?? null;

  return {
    loading,
    error,

    stats:
      stats$.data ?? null,

    upcomingRides:
      upcomingRides$.data ?? [],

    vehicle,
    verification: verification$.data ?? [],

    refetch,
  };
}