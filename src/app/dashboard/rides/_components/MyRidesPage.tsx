'use client';

import { useMemo, useState } from 'react';

import { rideService } from '@/services/ride.service';
import { useAsyncData } from '@/hooks/useAsyncData';

import EmptyRidesState from '../my-ride/EmptyRidesState';
import MyRideFilters from '../my-ride/MyRideFilters';
import MyRideStats from '../my-ride/MyRideStats';
import MyRideTable from '../my-ride/MyRideTable';

import { RideResponse, RideStatus } from '@/types/ride.types';
import { RideFilterTab } from '../_types/ride-page.types';

/** Human label for the filter tabs, used by the inline empty state. */
const TAB_LABELS: Record<RideStatus, string> = {
  SCHEDULED: 'Scheduled',
  STARTED: 'Started',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export default function MyRidesPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<RideFilterTab>('ALL');
  const [page, setPage] = useState(1);

  const rides$ = useAsyncData(
    () =>
      rideService.getRiderRides(
        page - 1,
        5,
        activeTab === 'ALL' ? undefined : activeTab,
      ),
    [page, activeTab],
    {
      cacheKey: `rider-rides-${activeTab}-${page}`,
      ttlMs: 60000,
    },
  );
  const stats$ = useAsyncData(() => rideService.getRideStats(), [], {
    cacheKey: 'rider-dashboard-stats',
    ttlMs: 60000,
  });

  const totalRides = stats$.data?.totalRides ?? 0;

  const rides: RideResponse[] = useMemo(
    () => rides$.data?.content ?? [],
    [rides$.data?.content],
  );

  const handleTabChange = (tab: RideFilterTab) => {
    setPage(1);
    setActiveTab(tab);
  };
  const handleSearchChange = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  const totalPages = rides$.data?.page?.totalPages ?? 1;

  const totalElements = rides$.data?.page?.totalElements ?? 0;

  const displayedRides = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return rides;
    }

    return rides.filter(
      (ride) =>
        ride.sourceCity.toLowerCase().includes(query) ||
        ride.destinationCity.toLowerCase().includes(query),
    );
  }, [rides, search]);

  const isEmpty = !rides$.loading && displayedRides.length === 0;

  /*
   * Full-page skeleton ONLY on the very first fetch (no response has ever
   * arrived). `data` stays non-null across re-fetches (useAsyncData preserves
   * it while flipping loading), so switching tabs never blanks the whole page —
   * that full-page flash is what reads as a "reload", and it hit hardest on
   * empty tabs like Cancelled (rides.length === 0).
   */
  const isFirstLoad = rides$.loading && rides$.data === null;

  if (isFirstLoad && !rides$.error) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>

        <div className="h-[450px] animate-pulse rounded-3xl bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--heading)]">My Rides</h2>

        <p className="mt-1 text-sm text-[var(--text)]">
          Turn Empty Seats into Shared Journeys
        </p>
      </div>

      {/* Stats — each card is a shortcut to the matching filter tab */}
      <MyRideStats
        loading={stats$.loading}
        total={totalRides}
        scheduled={stats$.data?.upcomingRides ?? 0}
        completed={stats$.data?.completedRides ?? 0}
        cancelled={stats$.data?.cancelledRides ?? 0}
        activeTab={activeTab}
        onSelect={handleTabChange}
      />

      {/* Tabs + search — always visible so the user can switch filters */}
      <MyRideFilters
        activeTab={activeTab}
        search={search}
        total={totalRides}
        scheduled={stats$.data?.upcomingRides ?? 0}
        completed={stats$.data?.completedRides ?? 0}
        cancelled={stats$.data?.cancelledRides ?? 0}
        onTabChange={handleTabChange}
        onSearchChange={handleSearchChange}
      />

      {/* Results slot */}
      {rides$.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
          {rides$.error}
        </div>
      ) : rides$.loading ? (
        /* Tab switch in progress — keep the chrome visible, pulse the rows. */
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-16 animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>
      ) : isEmpty && totalRides === 0 ? (
        /* Rider has never published a ride — full call-to-action state. */
        <EmptyRidesState />
      ) : isEmpty ? (
        /* The current tab / search has no matches — keep tabs visible. */
        <div className="rounded-3xl border border-dashed border-[var(--border)] bg-white px-6 py-10 text-center">
          <p className="text-sm font-semibold text-[var(--heading)]">
            {activeTab === 'ALL'
              ? 'No rides found'
              : `No ${TAB_LABELS[activeTab].toLowerCase()} rides found`}
          </p>

          <p className="mx-auto mt-1.5 max-w-md text-sm text-[var(--text-light)]">
            {search.trim()
              ? 'Nothing matches your search on this tab. Try a different city.'
              : 'There are no rides in this status right now. Try another tab.'}
          </p>
        </div>
      ) : (
        <MyRideTable
          rides={displayedRides}
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
