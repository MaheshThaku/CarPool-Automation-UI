'use client';

import { useCallback } from 'react';

import { useAsyncData } from '@/hooks/useAsyncData';
import { dashboardService } from '@/services/dashboard.service';
import { vehicleService  } from '@/services/vehicle.service';

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
    vehicleService.getMyVehicles,
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

const profileCompletion$ = useAsyncData(
  () => dashboardService.getProfileCompletion(),
  [],
  {
    cacheKey: 'rider-dashboard-profile-completion',
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
    profileCompletion: profileCompletion$.data ?? [],

    refetch,
  };
}