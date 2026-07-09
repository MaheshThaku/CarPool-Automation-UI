'use client';

import { useMemo, useState } from 'react';

import { rideService } from '@/services/ride.service';
import { useAsyncData } from '@/hooks/useAsyncData';

import EmptyRidesState from '../my-ride/EmptyRidesState';
import MyRideFilters from '../my-ride/MyRideFilters';
import MyRideStats from '../my-ride/MyRideStats';
import MyRideTable from '../my-ride/MyRideTable';

import { RideResponse, RideStatus } from '@/types/ride.types';

type FilterTab = 'ALL' | RideStatus;

export default function MyRidesPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [page, setPage] = useState(1);

  const rides$ = useAsyncData(
    () => rideService.getRiderRides(page - 1, 5),
    [page],
    {
      cacheKey: `rider-rides-${page}`,
      ttlMs: 60_000,
    },
  );

  const rides: RideResponse[] = useMemo(
    () => rides$.data?.content ?? [],
    [rides$.data?.content],
  );

  const totalPages = rides$.data?.page?.totalPages ?? 1;

  const totalElements = rides$.data?.page?.totalElements ?? 0;

  const filteredRides = useMemo(() => {
    let result = rides;

    if (activeTab !== 'ALL') {
      result = result.filter((ride) => ride.status === activeTab);
    }

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter(
        (ride) =>
          ride.sourceCity.toLowerCase().includes(query) ||
          ride.destinationCity.toLowerCase().includes(query),
      );
    }

    return result;
  }, [rides, activeTab, search]);

  const stats = useMemo(
    () => ({
      total: totalElements,

      scheduled: rides.filter((ride) => ride.status === 'SCHEDULED').length,

      completed: rides.filter((ride) => ride.status === 'COMPLETED').length,

      cancelled: rides.filter((ride) => ride.status === 'CANCELLED').length,
    }),
    [rides, totalElements],
  );

  if (rides$.loading && rides.length === 0) {
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

  if (rides$.error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
        {rides$.error}
      </div>
    );
  }

  if (!rides$.loading && rides.length === 0) {
    return <EmptyRidesState />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--heading)]">My Rides</h2>

        <p className="mt-1 text-sm text-[var(--text)]">
          Turn Empty Seats into Shared Journeys
        </p>
      </div>

      <MyRideStats
        total={stats.total}
        scheduled={stats.scheduled}
        completed={stats.completed}
        cancelled={stats.cancelled}
      />

      <MyRideFilters
        activeTab={activeTab}
        search={search}
        total={stats.total}
        scheduled={stats.scheduled}
        completed={stats.completed}
        cancelled={stats.cancelled}
        onSearchChange={(value) => {
          setSearch(value);
        }}
        onTabChange={(tab) => {
          setActiveTab(tab);
        }}
      />

      <MyRideTable
        rides={filteredRides}
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setPage}
        onRefresh={rides$.refetch}
      />
    </div>
  );
}
