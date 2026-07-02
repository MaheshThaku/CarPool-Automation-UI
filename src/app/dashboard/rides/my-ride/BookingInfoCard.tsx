'use client';

import { memo } from 'react';
import { Calendar, Check, Trash2, Users, X } from 'lucide-react';

import { RideBookingResponse } from '@/types/ride.types';

import PassengerAvatar from './PassengerAvatar';
import { getBookingStatusConfig } from './ride-status';

interface Props {
  booking: RideBookingResponse;
  loading?: boolean;
  onApprove: (bookingId: number) => Promise<void>;
  onReject: (bookingId: number) => Promise<void>;
  onDelete: (bookingId: number) => void | Promise<void>;
}

function BookingInfoCardComponent({
  booking,
  loading = false,
  onApprove,
  onReject,
  onDelete,
}: Props) {
  const status = getBookingStatusConfig(booking.status);

  const bookingDate = new Date(booking.bookingTime).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const canDelete =
    booking.status === 'REJECTED' ||
    booking.status === 'CANCELLED' ||
    booking.status === 'COMPLETED';

  return (
    <div
      className={`rounded-2xl border bg-white px-5 py-4 transition-all duration-200 hover:shadow-sm ${
        booking.status === 'REJECTED'
          ? 'border-red-200'
          : 'border-[var(--border)]'
      }`}
    >
      {/* Mobile Layout */}
      <div className="space-y-4 lg:hidden">
        <div className="flex items-center gap-3">
          <PassengerAvatar
            name={booking.passengerName}
            photoUrl={booking.passengerProfilePic}
          />

          <div className="min-w-0 flex-1">
            <h4 className="truncate font-semibold text-[var(--heading)]">
              {booking.passengerName}
            </h4>

            <p className="text-sm text-[var(--text-light)]">
              {booking.contactNumber ?? 'Contact unavailable'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span className="font-medium text-[var(--heading)]">
            {booking.sourceCity} → {booking.destinationCity}
          </span>

          <span className="flex items-center gap-1 text-[var(--text-light)]">
            <Users size={14} />
            {booking.seatsBooked}
          </span>

          <span className="font-semibold text-[var(--primary)]">
            ₹{booking.totalAmount}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-[var(--text-light)]">
          <Calendar size={14} />
          {bookingDate}
        </div>

        <div className="flex flex-wrap gap-2">
          {booking.status === 'PENDING' ? (
            <>
              <button
                type="button"
                disabled={loading}
                onClick={() => onReject(booking.bookingId)}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                <X size={14} />
                Reject
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => onApprove(booking.bookingId)}
                className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
              >
                <Check size={14} />
                Approve
              </button>
            </>
          ) : (
            <>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${status.bg} ${status.text}`}
              >
                {status.label}
              </span>

              {canDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(booking.bookingId)}
                  className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-[280px_1fr_70px_100px_190px_240px] lg:items-center lg:gap-4">
        {/* Passenger */}
        <div className="flex min-w-0 items-center gap-3">
          <PassengerAvatar
            name={booking.passengerName}
            photoUrl={booking.passengerProfilePic}
          />

          <div className="min-w-0">
            <h4 className="truncate font-semibold text-[var(--heading)]">
              {booking.passengerName}
            </h4>

            <p className="truncate text-sm text-[var(--text-light)]">
              {booking.contactNumber ?? 'Contact unavailable'}
            </p>
          </div>
        </div>

        {/* Route */}
        <div className="font-medium text-[var(--heading)]">
          {booking.sourceCity}

          <span className="mx-2 text-[var(--text-light)]">→</span>

          {booking.destinationCity}
        </div>

        {/* Seats */}
        <div className="flex items-center gap-1">
          <Users size={15} className="text-[var(--text-light)]" />

          <span className="font-medium text-[var(--heading)]">
            {booking.seatsBooked}
          </span>
        </div>

        {/* Amount */}
        <div>
          <p className="font-semibold text-[var(--primary)]">
            ₹{booking.totalAmount.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Requested Time */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-light)]">
          <Calendar size={14} />

          <span>{bookingDate}</span>
        </div>

        {/* Actions */}
        <div className="flex min-w-[220px] justify-end gap-2">
          {booking.status === 'PENDING' ? (
            <>
              <button
                type="button"
                disabled={loading}
                onClick={() => onReject(booking.bookingId)}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                <X size={14} />

                {loading ? 'Processing...' : 'Reject'}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => onApprove(booking.bookingId)}
                className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-60"
              >
                <Check size={14} />

                {loading ? 'Processing...' : 'Approve'}
              </button>
            </>
          ) : (
            <>
              <span
                className={`flex items-center rounded-full px-3 py-1 text-xs font-semibold ${status.bg} ${status.text}`}
              >
                {status.label}
              </span>

              {canDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(booking.bookingId)}
                  className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const BookingInfoCard = memo(BookingInfoCardComponent);

export default BookingInfoCard;
