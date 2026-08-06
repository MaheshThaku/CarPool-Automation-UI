'use client';

import { memo, useMemo } from 'react';
import { Car } from 'lucide-react';

import RideCard from './RideCard';
import NoResults from './NoResults';
import { RideResultsProps } from '../_types/ride-page.types';

function RideResultsComponent({
  rides,
  loading,
  hasSearched,
  bookingLoadingRideId,
  bookedRideIds,
  onBookRide,
  requiredSeats,
  totalElements,
}: RideResultsProps) {
  // Keep the soonest departure first regardless of backend ordering.
  const sortedRides = useMemo(
    () =>
      [...rides].sort(
        (a, b) =>
          new Date(a.departureTime).getTime() -
          new Date(b.departureTime).getTime(),
      ),
    [rides],
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-2xl border border-[var(--border)] bg-white p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-3">
                <div className="h-4 w-32 rounded bg-gray-100" />
                <div className="h-3 w-56 max-w-full rounded bg-gray-100" />
                <div className="h-4 w-32 rounded bg-gray-100" />
              </div>
              <div className="h-8 w-20 shrink-0 rounded-lg bg-gray-100" />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-4">
              <div className="h-3 w-24 rounded bg-gray-100" />
              <div className="h-3 w-16 rounded bg-gray-100" />
              <div className="h-3 w-20 rounded bg-gray-100" />
            </div>

            <div className="mt-4 h-10 w-full rounded-xl bg-gray-100 lg:ml-auto lg:w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (hasSearched && rides.length === 0) {
    return <NoResults />;
  }

  if (!hasSearched) {
    return null;
  }

  const shownCount = sortedRides.length;
  const hasMore =
    typeof totalElements === 'number' && totalElements > shownCount;

  const countText = hasMore
    ? `Showing ${shownCount} of ${totalElements} rides`
    : `${shownCount} ride${shownCount !== 1 ? 's' : ''} found`;

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-light)] ring-1 ring-[var(--primary)]/10">
          <Car size={18} className="text-[var(--primary)]" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-[var(--heading)]">
            Available Rides
          </h3>
          <p className="mt-0.5 truncate text-xs text-[var(--text-light)]">
            {countText}
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {sortedRides.map((ride) => (
          <RideCard
            key={ride.id}
            ride={ride}
            booked={bookedRideIds.has(ride.id)}
            bookingLoading={bookingLoadingRideId === ride.id}
            onBook={onBookRide}
            requiredSeats={requiredSeats}
          />
        ))}
      </div>
    </section>
  );
}

const RideResults = memo(RideResultsComponent);

export default RideResults;
