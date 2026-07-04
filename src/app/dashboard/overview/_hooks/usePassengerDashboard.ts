'use client';

import { useAsyncData } from '@/hooks/useAsyncData';

import { dashboardService } from '@/services/dashboard.service';

export function usePassengerDashboard() {
  const stats$ = useAsyncData(
    () => dashboardService.getPassengerStats(),
    [],
    {
      cacheKey: 'passenger-dashboard-stats',
    },
  );

  const upcomingTrips$ = useAsyncData(
    () => dashboardService.getUpcomingTrips(),
    [],
    {
      cacheKey: 'passenger-dashboard-upcoming',
    },
  );

  const recentBookings$ = useAsyncData(
    () => dashboardService.getRecentBookings(),
    [],
    {
      cacheKey: 'passenger-dashboard-recent',
    },
  );

  const verification$ = useAsyncData(
    () => dashboardService.getProfileVerification(),
    [],
    {
      cacheKey: 'passenger-dashboard-verification',
    },
  );

  const loading =
    stats$.loading ||
    upcomingTrips$.loading ||
    recentBookings$.loading ||
    verification$.loading;

  const error =
    stats$.error ||
    upcomingTrips$.error ||
    recentBookings$.error ||
    verification$.error ||
    '';

  const refetch = () => {
    stats$.refetch?.();
    upcomingTrips$.refetch?.();
    recentBookings$.refetch?.();
    verification$.refetch?.();
  };

  return {
    loading,
    error,

    stats: stats$.data,

    upcomingTrips:
      upcomingTrips$.data ?? [],

    bookings:
      recentBookings$.data ?? [],

    verification:
      verification$.data ?? null,

    refetch,
  };
}