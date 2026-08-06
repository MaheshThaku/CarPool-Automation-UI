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
import BookingStatusDialog, {
  BookingDialogState,
} from '../find-ride/BookingStatusDialog';

import { RideSearchSchemaType } from '../schemas/ride-search.schema';
import { RideResponse } from '@/types/ride.types';

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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const [bookingDialog, setBookingDialog] = useState<BookingDialogState | null>(
    null,
  );

  /* ---------------- Search ---------------- */

  const search$ = useAsyncData(
    async () => {
      if (!searchParams) {
        return null;
      }

      return rideService.searchRides({
        sourceCity: searchParams.sourceCity.trim(),
        destinationCity: searchParams.destinationCity.trim(),
        departureDate: searchParams.departureDate || undefined,
        requiredSeats: searchParams.requiredSeats,
      });
    },
    [searchParams],
    {
      cacheKey: searchParams
        ? `ride-search-${JSON.stringify(searchParams)}`
        : undefined,
    },
  );

  const rides: RideResponse[] = useMemo(
    () => search$.data?.content ?? [],
    [search$.data],
  );

  const totalElements = search$.data?.totalElements ?? rides.length;

  /* ---------------- Search Handler ---------------- */

  const handleSearch = useCallback((values: RideSearchSchemaType) => {
    setBookingDialog(null);
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
      setBookingDialog(null);

      if (!currentUser?.email) {
        setBookingDialog({
          type: 'error',
          title: 'Login Required',
          message: 'Please login to continue booking.',
        });
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

        setBookingDialog({
          type: 'success',
          title: 'Request Sent!',
          message:
            'Booking request submitted successfully. Waiting for driver approval.',
        });

        invalidateAsyncCache('my-bookings');
        invalidateAsyncCache('upcoming-bookings');
      } catch (err) {
        const error = err as
          | { response?: { data?: { message?: string } }; message?: string }
          | Error;
        const message =
          (error && 'response' in error && error.response?.data?.message) ||
          (error instanceof Error ? error.message : undefined) ||
          'Unable to create booking. Please try again.';

        setBookingDialog({
          type: 'error',
          title: 'Booking Failed',
          message,
        });
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
        loading={search$.loading}
        onSearch={handleSearch}
      />

      {/* Initial Sections */}

      {!hasSearched && (
        <>
          <PopularRoutes onSelectRoute={handlePopularRoute} />
          <HowItWorks />
        </>
      )}

      {/* Results */}

      <RideResults
        rides={rides}
        loading={search$.loading}
        hasSearched={hasSearched}
        bookingLoadingRideId={bookingLoadingRideId}
        bookedRideIds={bookedRideIds}
        onBookRide={handleBookRide}
        requiredSeats={searchParams?.requiredSeats || 1}
        totalElements={totalElements}
      />

      {/* Booking status dialog (success / error / already booked) */}

      {bookingDialog && (
        <BookingStatusDialog
          type={bookingDialog.type}
          title={bookingDialog.title}
          message={bookingDialog.message}
          onClose={() => setBookingDialog(null)}
        />
      )}
    </div>
  );
}
