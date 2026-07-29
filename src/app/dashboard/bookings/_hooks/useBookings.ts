'use client';

import { useState } from 'react';

import { useAsyncData } from '@/hooks/useAsyncData';
import { dashboardService } from '@/services/dashboard.service';
import {
  BookingStatus,
  BookingListItem,
} from '@/types/dashboard.types';

export type BookingFilter = BookingStatus | 'ALL';

export function useBookings() {
  const [page, setPage] = useState(1);

  const [activeTab, setActiveTab] =
    useState<BookingFilter>('ALL');

  const bookings$ = useAsyncData(
    () =>
      dashboardService.getAllBookings(
        page - 1,
        5,
        activeTab === 'ALL'
          ? undefined
          : activeTab,
      ),
    [page, activeTab],
    {
      cacheKey: `passenger-bookings-${activeTab}-${page}`,
      ttlMs: 60000,
    },
  );

  const handleTabChange = (
    tab: BookingFilter,
  ) => {
    setPage(1);
    setActiveTab(tab);
  };

  return {
    bookings:
      bookings$.data?.content ??
      ([] as BookingListItem[]),

    loading: bookings$.loading,

    error: bookings$.error,

    refresh: bookings$.refetch,

    page,

    setPage,

    activeTab,

    setActiveTab: handleTabChange,

    totalPages:
      bookings$.data?.page.totalPages ?? 0,

    totalElements:
      bookings$.data?.page.totalElements ?? 0,
  };
}