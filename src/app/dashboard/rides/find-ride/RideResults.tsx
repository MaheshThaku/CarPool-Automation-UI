'use client';

import RideCard from './RideCard';
import NoResults from './NoResults';
import { RideResultsProps } from '../_types/ride-page.types';

export default function RideResults({
  rides,
  loading,
  hasSearched,
  bookingLoadingRideId,
  bookedRideIds,
  onBookRide,
}: RideResultsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-2xl border border-[var(--border)] bg-white p-5"
          >
            <div className="h-5 w-40 rounded bg-gray-100" />

            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((block) => (
                <div key={block}>
                  <div className="h-3 w-14 rounded bg-gray-100" />
                  <div className="mt-2 h-4 w-20 rounded bg-gray-100" />
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-gray-100" />
              <div className="h-10 w-28 rounded-xl bg-gray-100" />
            </div>
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

  return (
    <section className="space-y-5">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-[var(--heading)]">
            Available Rides
          </h3>

          <p className="mt-1 text-sm text-[var(--text-light)]">
            {rides.length} ride
            {rides.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Results */}

      <div className="space-y-4">
        {rides.map((ride) => (
          <RideCard
            key={ride.id}
            ride={ride}
            booked={bookedRideIds.has(ride.id)}
            bookingLoading={bookingLoadingRideId === ride.id}
            onBook={onBookRide}
          />
        ))}
      </div>
    </section>
  );
}
