'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { bookingService } from '@/services/booking.service';
import { rideService } from '@/services/ride.service';
import { invalidateAsyncCache, useAsyncData } from '@/hooks/useAsyncData';

import { useCurrentUser } from '@/hooks/useCurrentUser';

import RideSearchForm from '../find-ride/RideSearchForm';
import RideResults from '../find-ride/RideResults';
import PopularRoutes from '../find-ride/PopularRoutes';
import HowItWorks from '../find-ride/HowItWorks';

import { RideSearchSchemaType } from '../schemas/ride-search.schema';

export default function FindRidesPage() {
  const currentUser = useCurrentUser();
  const searchParamsFromURL = useSearchParams();

  const urlSource = searchParamsFromURL.get('sourceCity') || '';
  const urlDestination = searchParamsFromURL.get('destinationCity') || '';
  const urlDate = searchParamsFromURL.get('departureDate') || '';

  const [searchParams, setSearchParams] = useState<RideSearchSchemaType | null>(
    null,
  );

  const [selectedRoute, setSelectedRoute] = useState<
    Partial<RideSearchSchemaType>
  >({});

  // Sync state with URL query parameters on mount or when URL changes
  useEffect(() => {
    if (urlSource || urlDestination || urlDate) {
      setSelectedRoute({
        sourceCity: urlSource,
        destinationCity: urlDestination,
        departureDate: urlDate,
      });

      if (urlSource.length >= 2 && urlDestination.length >= 2) {
        setSearchParams({
          sourceCity: urlSource,
          destinationCity: urlDestination,
          departureDate: urlDate,
          requiredSeats: 1,
        });
      }
    }
  }, [urlSource, urlDestination, urlDate]);

  const [bookingLoadingRideId, setBookingLoadingRideId] = useState<
    number | null
  >(null);

  const [bookedRideIds, setBookedRideIds] = useState<Set<number>>(new Set());

  const [successMessage, setSuccessMessage] = useState('');

  const [error, setError] = useState('');

  /* ---------------- Search ---------------- */

  const rides$ = useAsyncData(
    async () => {
      if (!searchParams) {
        return [];
      }

      const response = await rideService.searchRides({
        sourceCity: searchParams.sourceCity.trim(),
        destinationCity: searchParams.destinationCity.trim(),
        departureDate: searchParams.departureDate || undefined,
        requiredSeats: searchParams.requiredSeats,
      });

      return response.content ?? [];
    },
    [searchParams],
    {
      cacheKey: searchParams
        ? `ride-search-${JSON.stringify(searchParams)}`
        : undefined,
    },
  );

  /* ---------------- Search Handler ---------------- */

  const handleSearch = useCallback((values: RideSearchSchemaType) => {
    setError('');
    setSuccessMessage('');
    setSearchParams(values);
  }, []);

  /* ---------------- Popular Route ---------------- */

  const handlePopularRoute = useCallback(
    (source: string, destination: string) => {
      setSelectedRoute({
        sourceCity: source,
        destinationCity: destination,
      });
    },
    [],
  );

  /* ---------------- Booking ---------------- */

  const handleBookRide = useCallback(
    async (rideId: number) => {
      setError('');
      setSuccessMessage('');

      if (!currentUser?.email) {
        setError('Please login to continue booking.');
        return;
      }

      try {
        setBookingLoadingRideId(rideId);

        await bookingService.createBooking({
          rideId,
          seatsBooked: searchParams?.requiredSeats || 1,
          passengerEmail: currentUser.email,
        });

        setBookedRideIds((prev) => {
          const next = new Set(prev);

          next.add(rideId);

          return next;
        });

        setSuccessMessage(
          'Booking request submitted successfully. Waiting for driver approval.',
        );

        invalidateAsyncCache('my-bookings');
        invalidateAsyncCache('upcoming-bookings');
      } catch (err) {
        const error = err as
          | { response?: { data?: { message?: string } }; message?: string }
          | Error;
        setError(
          (error && 'response' in error && error.response?.data?.message) ||
          (error instanceof Error ? error.message : undefined) ||
          'Unable to create booking. Please try again.',
        );
      } finally {
        setBookingLoadingRideId(null);
      }
    },
    [currentUser, searchParams],
  );

  /* ---------------- State ---------------- */

  const hasSearched = useMemo(() => searchParams !== null, [searchParams]);

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      {/* Page Header */}

      <div>
        <h1 className="text-2xl font-bold text-[var(--heading)]">Find Rides</h1>

        <p className="mt-1 text-sm text-[var(--text)]">
          Discover affordable and verified rides shared by trusted drivers.
        </p>
      </div>

      {/* Search Form */}

      <RideSearchForm
        key={`${selectedRoute.sourceCity ?? ''}-${selectedRoute.destinationCity ?? ''}`}
        initialValues={selectedRoute}
        loading={rides$.loading}
        onSearch={handleSearch}
      />

      {/* Initial Sections */}

      {!hasSearched && (
        <>
          <PopularRoutes onSelectRoute={handlePopularRoute} />
          <HowItWorks />
        </>
      )}

      {/* Success */}

      {successMessage && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {/* Error */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Results */}

      <RideResults
        rides={rides$.data ?? []}
        loading={rides$.loading}
        hasSearched={hasSearched}
        bookingLoadingRideId={bookingLoadingRideId}
        bookedRideIds={bookedRideIds}
        onBookRide={handleBookRide}
        requiredSeats={searchParams?.requiredSeats || 1}
      />
    </div>
  );
}
