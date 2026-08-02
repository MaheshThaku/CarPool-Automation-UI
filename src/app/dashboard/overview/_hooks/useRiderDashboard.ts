'use client';

import { useCallback } from 'react';

import { useAsyncData } from '@/hooks/useAsyncData';
import { dashboardService } from '@/services/dashboard.service';
import { vehicleService  } from '@/services/vehicle.service';
import { rideService } from '@/services/ride.service';


export function useRiderDashboard() {
  const stats$ = useAsyncData(
    dashboardService.getRiderStats,
    [],
    {
      cacheKey: 'rider-dashboard-stats',
    },
  );

const rides$ = useAsyncData(
  () =>
    rideService.getRiderRides(
      0,
      20,
    ),
  [],
  {
    cacheKey: 'dashboard-upcoming-rides',
    ttlMs: 60_000,
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
    rides$.loading ||
    vehicles$.loading;

  const error =
    stats$.error ||
    rides$.error ||
    vehicles$.error ||
    '';

  const refetch = useCallback(() => {
    stats$.refetch?.();
    rides$.refetch?.();
    vehicles$.refetch?.();
  }, [stats$, rides$, vehicles$]);

  const vehicle =
    vehicles$.data ?? null;

  return {
    loading,
    error,

    stats:
      stats$.data ?? null,

    upcomingRides:
      rides$.data?.content ?? [],



    vehicle,
    verification: verification$.data ?? [],
    profileCompletion: profileCompletion$.data ?? [],

    refetch,
  };
}