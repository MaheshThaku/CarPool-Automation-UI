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

  const rides$ = useAsyncData(() => rideService.getRiderRides(), [], {
    cacheKey: 'rider-rides-list',
    ttlMs: 60_000,
  });

  const rides = rides$.data ?? [];

  /* ---------------- Stats ---------------- */

  const stats = useMemo(() => {
    return {
      total: rides.length,

      scheduled: rides.filter((ride) => ride.status === 'SCHEDULED').length,

      completed: rides.filter((ride) => ride.status === 'COMPLETED').length,

      cancelled: rides.filter((ride) => ride.status === 'CANCELLED').length,
    };
  }, [rides]);

  /* ---------------- Filters ---------------- */

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
          ride.destinationCity.toLowerCase().includes(query) ||
          ride.vehicleName?.toLowerCase().includes(query),
      );
    }

    return result;
  }, [rides, search, activeTab]);

  /* ---------------- Loading ---------------- */

  if (rides$.loading) {
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

  /* ---------------- Error ---------------- */

  if (rides$.error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
        {rides$.error}
      </div>
    );
  }

  /* ---------------- Empty ---------------- */

  if (rides.length === 0) {
    return <EmptyRidesState />;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}

      <MyRideStats
        total={stats.total}
        scheduled={stats.scheduled}
        completed={stats.completed}
        cancelled={stats.cancelled}
      />

      {/* Filters */}

      <MyRideFilters
        activeTab={activeTab}
        search={search}
        total={stats.total}
        scheduled={stats.scheduled}
        completed={stats.completed}
        cancelled={stats.cancelled}
        onSearchChange={setSearch}
        onTabChange={setActiveTab}
      />

      {/* Table */}

      <MyRideTable rides={filteredRides} />
    </div>
  );
}
