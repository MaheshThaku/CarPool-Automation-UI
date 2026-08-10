'use client';

import { useState } from 'react';

import { useAsyncData } from '@/hooks/useAsyncData';
import { dashboardService } from '@/services/dashboard.service';
import {
  BookingStatus,
  BookingListItem,
} from '@/types/dashboard.types';

export type BookingFilter = BookingStatus | 'ALL' | 'UPCOMING';

export function useBookings() {
  const [page, setPage] = useState(1);

  const [activeTab, setActiveTab] =
    useState<BookingFilter>('ALL');

  // Every tab asks the backend for the matching status (UPCOMING is a real
  // backend filter too: PENDING/APPROVED whose ride hasn't departed yet), so
  // the list and the pagination come straight from the server.
  const bookings$ = useAsyncData(
    () =>
      dashboardService.getAllBookings(
        page - 1,
        5,
        activeTab === 'ALL' ? undefined : activeTab,
      ),
    [page, activeTab],
    {
      cacheKey: `passenger-bookings-${activeTab}-${page}`,
      ttlMs: 60000,
    },
  );

  const bookingCounts$ = useAsyncData(
    () => dashboardService.getBookingCounts(),
    [],
    {
      cacheKey: 'passenger-booking-counts',
      ttlMs: 60000,
    },
  );

  const handleTabChange = (
    tab: BookingFilter,
  ) => {
    setPage(1);
    setActiveTab(tab);
  };

  const bookings =
    (bookings$.data?.content ?? []) as BookingListItem[];

  return {
    bookings,

    loading: bookings$.loading,

    error: bookings$.error,

    refresh: bookings$.refetch,

    page,

    setPage,

    activeTab,

    setActiveTab: handleTabChange,

    totalPages: bookings$.data?.page.totalPages ?? 0,

    totalElements: bookings$.data?.page.totalElements ?? 0,

    counts: bookingCounts$.data,

    countsLoading: bookingCounts$.loading,

  };
}