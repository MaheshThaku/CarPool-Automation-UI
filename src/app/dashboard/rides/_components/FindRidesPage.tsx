'use client';

import { useCallback, useMemo, useState } from 'react';

import { bookingService } from '@/services/booking.service';
import { rideService } from '@/services/ride.service';
import { invalidateAsyncCache, useAsyncData } from '@/hooks/useAsyncData';

import RideSearchForm from '../find-ride/RideSearchForm';
import RideResults from '../find-ride/RideResults';
import PopularRoutes from '../find-ride/PopularRoutes';
import HowItWorks from '../find-ride/HowItWorks';

import { RideSearchSchemaType } from '../schemas/ride-search.schema';

export default function FindRidesPage() {
  const [searchParams, setSearchParams] = useState<RideSearchSchemaType | null>(
    null,
  );

  const [bookingLoadingRideId, setBookingLoadingRideId] = useState<
    number | null
  >(null);

  const [selectedRoute, setSelectedRoute] = useState<
    Partial<RideSearchSchemaType>
  >({});

  const [bookedRideIds, setBookedRideIds] = useState<Set<number>>(new Set());

  const [successMessage, setSuccessMessage] = useState('');

  const [error, setError] = useState('');

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

      console.log('SEARCH RESPONSE', response);
      console.log('SEARCH CONTENT', response.content);

      return response.content;
    },
    [searchParams],
    {
      cacheKey: searchParams
        ? `ride-search-${JSON.stringify(searchParams)}`
        : undefined,
    },
  );

  const handleSearch = useCallback((values: RideSearchSchemaType) => {
    setError('');
    setSearchParams(values);
  }, []);

  const handlePopularRoute = useCallback(
    (source: string, destination: string) => {
      console.log('selected', source, destination);

      setSelectedRoute({
        sourceCity: source,
        destinationCity: destination,
      });
    },
    [],
  );

  const handleBookRide = useCallback(async (rideId: number) => {
    try {
      setBookingLoadingRideId(rideId);

      await bookingService.createBooking({
        rideId,
        seatsBooked: 1,
      });

      setBookedRideIds((prev) => new Set([...prev, rideId]));

      setSuccessMessage(
        'Booking request sent successfully. Waiting for driver approval.',
      );

      invalidateAsyncCache('my-bookings');
    } catch (error) {
      console.error(error);
    } finally {
      setBookingLoadingRideId(null);
    }
  }, []);

  const hasSearched = useMemo(() => searchParams !== null, [searchParams]);

  return (
    <div className="space-y-6">
      <RideSearchForm
        key={`${selectedRoute.sourceCity ?? ''}-${selectedRoute.destinationCity ?? ''}`}
        initialValues={selectedRoute}
        loading={rides$.loading}
        onSearch={handleSearch}
      />

      {!hasSearched && (
        <>
          <PopularRoutes onSelectRoute={handlePopularRoute} />

          <HowItWorks />
        </>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <RideResults
        rides={rides$.data ?? []}
        loading={rides$.loading}
        hasSearched={hasSearched}
        bookingLoadingRideId={bookingLoadingRideId}
        bookedRideIds={bookedRideIds}
        onBookRide={handleBookRide}
      />
    </div>
  );
}
