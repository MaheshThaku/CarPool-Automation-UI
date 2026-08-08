'use client';

import { useState } from 'react';

import { useAsyncData } from '@/hooks/useAsyncData';
import { dashboardService } from '@/services/dashboard.service';
import {
  BookingStatus,
  BookingListItem,
} from '@/types/dashboard.types';

export type BookingFilter = BookingStatus | 'ALL' | 'UPCOMING';

/** Statuses that count as "upcoming" (pending + approved). */
const UPCOMING_STATUSES: ReadonlySet<BookingStatus> = new Set([
  'PENDING',
  'APPROVED',
]);

export function useBookings() {
  const [page, setPage] = useState(1);

  const [activeTab, setActiveTab] =
    useState<BookingFilter>('ALL');

  // UPCOMING is fetched the same as ALL (no backend status filter) to avoid
  // the 401 race condition on the dedicated UPCOMING endpoint; the client
  // filters the results below.
  const bookings$ = useAsyncData(
    () =>
      dashboardService.getAllBookings(
        page - 1,
        5,
        activeTab === 'ALL' || activeTab === 'UPCOMING'
          ? undefined
          : activeTab,
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

  // Raw content from the API (unfiltered for ALL/UPCOMING).
  const rawContent =
    bookings$.data?.content ??
    ([] as BookingListItem[]);

  // Client-side filter for UPCOMING: only PENDING + APPROVED.
  // NOTE: pagination numbers are approximate when the filtered set is a
  // subset of the page; fine for small datasets and can be refined with a
  // dedicated backend multi-status endpoint later.
  const bookings =
    activeTab === 'UPCOMING'
      ? rawContent.filter((b) =>
          UPCOMING_STATUSES.has(b.status),
        )
      : rawContent;

  const upcomingTotal =
    bookingCounts$.data?.upcoming ?? 0;

  return {
    bookings,

    loading: bookings$.loading,

    error: bookings$.error,

    refresh: bookings$.refetch,

    page,

    setPage,

    activeTab,

    setActiveTab: handleTabChange,

    totalPages:
      activeTab === 'UPCOMING'
        ? Math.ceil(upcomingTotal / 5)
        : (bookings$.data?.page.totalPages ?? 0),

    totalElements:
      activeTab === 'UPCOMING'
        ? upcomingTotal
        : (bookings$.data?.page.totalElements ?? 0),

    counts: bookingCounts$.data,

    countsLoading: bookingCounts$.loading,

  };
}