'use client';

import { useEffect, useMemo, useState } from 'react';

import { AlertCircle, Users } from 'lucide-react';

import { bookingService } from '@/services/booking.service';
import { invalidateAsyncCache, useAsyncData } from '@/hooks/useAsyncData';

import { RideBookingResponse } from '@/types/ride.types';

import BookingInfoCard from './BookingInfoCard';

interface Props {
  rideId: number;
}

export default function RideBookingsPanel({ rideId }: Props) {
  const bookings$ = useAsyncData(
    () => bookingService.getBookingsByRide(rideId),
    [rideId],
    {
      cacheKey: `ride-bookings-${rideId}`,
    },
  );

  const [bookings, setBookings] = useState<RideBookingResponse[]>([]);

  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  /* ---------------- Sync State ---------------- */

  useEffect(() => {
    if (bookings$.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBookings(bookings$.data);
    }
  }, [bookings$.data]);

  /* ---------------- Sort Pending First ---------------- */

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      if (a.status === 'PENDING' && b.status !== 'PENDING') {
        return -1;
      }

      if (a.status !== 'PENDING' && b.status === 'PENDING') {
        return 1;
      }

      return 0;
    });
  }, [bookings]);

  /* ---------------- Approve ---------------- */

  const handleApprove = async (bookingId: number) => {
    try {
      setActionLoadingId(bookingId);

      await bookingService.approveBooking(bookingId);

      setBookings((prev) =>
        prev.map((booking) =>
          booking.bookingId === bookingId
            ? {
                ...booking,
                status: 'APPROVED',
              }
            : booking,
        ),
      );

      invalidateAsyncCache(`ride-bookings-${rideId}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  /* ---------------- Reject ---------------- */

  const handleReject = async (bookingId: number) => {
    try {
      setActionLoadingId(bookingId);

      await bookingService.rejectBooking(bookingId);

      setBookings((prev) =>
        prev.map((booking) =>
          booking.bookingId === bookingId
            ? {
                ...booking,
                status: 'REJECTED',
              }
            : booking,
        ),
      );

      invalidateAsyncCache(`ride-bookings-${rideId}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  /* ---------------- Delete (Frontend Only) ---------------- */

  const handleDelete = async (bookingId: number) => {
    const confirmed = window.confirm('Delete this booking record?');

    if (!confirmed) {
      return;
    }

    setBookings((prev) =>
      prev.filter((booking) => booking.bookingId !== bookingId),
    );
  };

  /* ---------------- Loading ---------------- */

  if (bookings$.loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="h-24 animate-pulse rounded-2xl border border-[var(--border)] bg-white"
          />
        ))}
      </div>
    );
  }

  /* ---------------- Error ---------------- */

  if (bookings$.error) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        <AlertCircle size={16} />

        {bookings$.error}
      </div>
    );
  }

  /* ---------------- Empty ---------------- */

  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white p-8 text-center">
        <Users size={28} className="mx-auto text-[var(--text-light)]" />

        <h4 className="mt-3 font-semibold text-[var(--heading)]">
          No Booking Requests
        </h4>

        <p className="mt-2 text-sm text-[var(--text-light)]">
          Booking requests will appear here when passengers request seats.
        </p>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-4">
      {/* Header */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="font-semibold text-[var(--heading)]">
          Booking Requests
        </h4>

        <span className="rounded-full bg-[var(--primary-light)] px-3 py-1 text-xs font-medium text-[var(--primary)]">
          {bookings.length} Request
          {bookings.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Requests */}

      <div className="space-y-3">
        {sortedBookings.map((booking) => (
          <BookingInfoCard
            key={booking.bookingId}
            booking={booking}
            loading={actionLoadingId === booking.bookingId}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
