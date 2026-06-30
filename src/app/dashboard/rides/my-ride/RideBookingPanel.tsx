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

  /* ---------------- Sorted Bookings ---------------- */

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

  /* ---------------- Stats ---------------- */

  const stats = useMemo(
    () => ({
      total: bookings.length,

      pending: bookings.filter((b) => b.status === 'PENDING').length,

      approved: bookings.filter((b) => b.status === 'APPROVED').length,

      rejected: bookings.filter((b) => b.status === 'REJECTED').length,

      cancelled: bookings.filter((b) => b.status === 'CANCELLED').length,

      completed: bookings.filter((b) => b.status === 'COMPLETED').length,
    }),
    [bookings],
  );

  /* ---------------- Approve ---------------- */

  const handleApprove = async (bookingId: number) => {
    try {
      setActionLoadingId(bookingId);

      await bookingService.approveBooking(bookingId);

      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === bookingId
            ? {
                ...b,
                status: 'APPROVED',
              }
            : b,
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
        prev.map((b) =>
          b.bookingId === bookingId
            ? {
                ...b,
                status: 'REJECTED',
              }
            : b,
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
      <div className="space-y-4">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="h-44 animate-pulse rounded-2xl border border-[var(--border)] bg-white"
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

  return (
    <div className="space-y-5">
      {/* Stats */}

      <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
        <StatCard label="Total" value={stats.total} />

        <StatCard
          label="Pending"
          value={stats.pending}
          valueClass="text-amber-600"
        />

        <StatCard
          label="Approved"
          value={stats.approved}
          valueClass="text-green-600"
        />

        <StatCard
          label="Rejected"
          value={stats.rejected}
          valueClass="text-red-600"
        />

        <StatCard label="Cancelled" value={stats.cancelled} />

        <StatCard label="Completed" value={stats.completed} />
      </div>

      {/* Cards */}

      <div className="space-y-4">
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

/* ---------------- Stat Card ---------------- */

interface StatCardProps {
  label: string;
  value: number;
  valueClass?: string;
}

function StatCard({ label, value, valueClass }: StatCardProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-3 text-center">
      <p className="text-xs text-[var(--text-light)]">{label}</p>

      <p
        className={`mt-1 text-lg font-bold ${
          valueClass ?? 'text-[var(--heading)]'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
