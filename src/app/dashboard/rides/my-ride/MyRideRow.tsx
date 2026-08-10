'use client';

import { memo, useState } from 'react';

import {
  ArrowRight,
  Car,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Users,
} from 'lucide-react';

import { RideResponse } from '@/types/ride.types';

import RideBookingsPanel from './RideBookingPanel';
import { getRideStatusConfig } from './ride-status';
import UpdateStatusDialog from './UpdateStatusDialog';

interface Props {
  ride: RideResponse;
  mobile?: boolean;
  onRefresh?: () => void;
}

type RideWithBookingMeta = RideResponse & {
  pendingBookingCount?: number;
  pendingBookings?: number;
};

function formatDeparture(departureTime: string) {
  const date = new Date(departureTime);

  return {
    date: date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),

    day: date.toLocaleDateString('en-IN', {
      weekday: 'short',
    }),

    time: date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
  };
}

function getPendingBookingCount(ride: RideResponse): number {
  const rideWithMeta = ride as RideWithBookingMeta;

  if (
    typeof rideWithMeta.pendingBookingCount === 'number' &&
    Number.isFinite(rideWithMeta.pendingBookingCount)
  ) {
    return Math.max(0, rideWithMeta.pendingBookingCount);
  }

  if (
    typeof rideWithMeta.pendingBookings === 'number' &&
    Number.isFinite(rideWithMeta.pendingBookings)
  ) {
    return Math.max(0, rideWithMeta.pendingBookings);
  }

  return 0;
}

function MyRideRowComponent({ ride, mobile = false, onRefresh }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [loading] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  const departure = formatDeparture(ride.departureTime);

  const status = getRideStatusConfig(ride.status);

  const StatusIcon = status.icon;

  const isTerminal = ride.status === 'COMPLETED' || ride.status === 'CANCELLED';

  const pendingBookingCount = getPendingBookingCount(ride);

  const hasPendingRequests = pendingBookingCount > 0;

  const toggleExpanded = () => {
    setExpanded((previous) => !previous);
  };

  const handleRowKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleExpanded();
    }
  };

  /* =========================================================
     MOBILE
     ========================================================= */

  if (mobile) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={toggleExpanded}
        onKeyDown={handleRowKeyDown}
        aria-expanded={expanded}
        className={`rounded-2xl border p-4 transition-all duration-200 ${
          hasPendingRequests
            ? 'border-[var(--primary)] bg-[var(--primary-light)]/40 shadow-sm'
            : 'border-[var(--border)] bg-white hover:border-[var(--primary)]/40 hover:shadow-sm'
        } cursor-pointer focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none`}
      >
        {/* Pending request indicator */}

        {hasPendingRequests && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-[var(--primary)]/20 bg-[var(--primary-light)] px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--primary)]" />

              <span className="text-xs font-semibold text-[var(--primary)]">
                Pending booking request
                {pendingBookingCount > 1 ? 's' : ''}
              </span>
            </div>

            <span className="rounded-full bg-[var(--primary)] px-2 py-0.5 text-[10px] font-bold text-white">
              {pendingBookingCount}
            </span>
          </div>
        )}

        {/* Header */}

        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-light)]">
              <Car size={18} className="text-[var(--primary)]" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 font-semibold text-[var(--heading)]">
                <span>{ride.sourceCity}</span>

                <ArrowRight
                  size={14}
                  className="shrink-0 text-[var(--text-light)]"
                />

                <span>{ride.destinationCity}</span>
              </div>
            </div>
          </div>

          <span
            className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${status.bg} ${status.text}`}
          >
            <StatusIcon size={10} />

            {status.label}
          </span>
        </div>

        {/* Ride information */}

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-[var(--text-light)]">Date</p>

            <p className="font-medium text-[var(--heading)]">
              {departure.date}
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--text-light)]">Time</p>

            <p className="font-medium text-[var(--heading)]">
              {departure.time}
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--text-light)]">Seats</p>

            <p className="font-medium text-[var(--heading)]">
              {ride.availableSeats}
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--text-light)]">Price</p>

            <p className="font-semibold text-[var(--primary)]">
              ₹{ride.pricePerSeat.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Status update */}

        {!isTerminal && (
          <div className="mt-4" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsStatusDialogOpen(true)}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--primary)] bg-[var(--primary-light)] px-4 py-2.5 text-sm font-semibold text-[var(--primary)] transition-all hover:bg-[var(--primary)] hover:text-white disabled:opacity-50"
            >
              Update Ride Status
            </button>
          </div>
        )}

        {/* Bookings toggle */}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            toggleExpanded();
          }}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
            hasPendingRequests
              ? 'border-[var(--primary)] bg-white text-[var(--primary)]'
              : 'border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
          }`}
        >
          {hasPendingRequests ? <>{pendingBookingCount} Pending</> : 'Bookings'}

          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {/* Bookings panel */}

        {expanded && (
          <div className="mt-4" onClick={(event) => event.stopPropagation()}>
            <RideBookingsPanel rideId={ride.id} />
          </div>
        )}

        {/* Status dialog */}

        {isStatusDialogOpen && (
          <div onClick={(event) => event.stopPropagation()}>
            <UpdateStatusDialog
              ride={ride}
              onClose={() => setIsStatusDialogOpen(false)}
              onRefresh={onRefresh}
            />
          </div>
        )}
      </div>
    );
  }

  /* =========================================================
     DESKTOP
     ========================================================= */

  return (
    <>
      <tr
        tabIndex={0}
        role="button"
        aria-expanded={expanded}
        onClick={toggleExpanded}
        onKeyDown={handleRowKeyDown}
        className={`group cursor-pointer border-b transition-colors focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none focus:ring-inset ${
          hasPendingRequests
            ? 'border-[var(--primary)]/20 bg-[var(--primary-light)]/50 hover:bg-[var(--primary-light)]'
            : 'border-[var(--border)] hover:bg-gray-50/80'
        }`}
      >
        {/* Route */}

        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            {hasPendingRequests && (
              <span
                className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-[var(--primary)]"
                title={`${pendingBookingCount} pending booking request${
                  pendingBookingCount > 1 ? 's' : ''
                }`}
              />
            )}

            <div className="flex items-center gap-1.5 font-semibold text-[var(--heading)]">
              <span>{ride.sourceCity}</span>

              <ArrowRight size={12} className="text-[var(--text-light)]" />

              <span>{ride.destinationCity}</span>
            </div>
          </div>

          {hasPendingRequests && (
            <p className="mt-1 text-[10px] font-semibold text-[var(--primary)]">
              {pendingBookingCount} pending booking
              {pendingBookingCount > 1 ? 's' : ''} awaiting action
            </p>
          )}
        </td>

        {/* Date & Time */}

        <td className="px-6 py-4">
          <p className="font-medium text-[var(--heading)]">{departure.date}</p>

          <p className="mt-0.5 text-xs text-[var(--text-light)]">
            {departure.day} · {departure.time}
          </p>
        </td>

        {/* Seats */}

        <td className="px-6 py-4">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 text-sm font-medium text-[var(--heading)]">
            <Users size={13} className="text-[var(--text-light)]" />

            {ride.availableSeats}
          </span>
        </td>

        {/* Price */}

        <td className="px-6 py-4">
          <span className="font-semibold text-[var(--primary)]">
            ₹{ride.pricePerSeat.toLocaleString('en-IN')}
          </span>
        </td>

        {/* Status */}

        <td className="px-6 py-4">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.bg} ${status.text}`}
          >
            <StatusIcon size={11} />

            {status.label}
          </span>
        </td>

        {/* Actions */}

        <td
          className="px-6 py-4 text-right"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="inline-flex items-center gap-2">
            {/* Existing Bookings button */}

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                toggleExpanded();
              }}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-sm font-medium shadow-sm transition-all ${
                hasPendingRequests
                  ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                  : 'border-[var(--border)] bg-white text-[var(--heading)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
              }`}
            >
              {hasPendingRequests
                ? `${pendingBookingCount} Pending`
                : 'Bookings'}

              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            {/* Existing status action */}

            {!isTerminal ? (
              <button
                type="button"
                onClick={() => setIsStatusDialogOpen(true)}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-white text-gray-400 shadow-sm transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] active:scale-95"
                title="Update Status"
                aria-label="Update ride status"
              >
                <MoreVertical size={15} />
              </button>
            ) : (
              <div className="h-8 w-8 shrink-0" aria-hidden="true" />
            )}
          </div>
        </td>
      </tr>

      {/* Expanded bookings panel */}

      {expanded && (
        <tr>
          <td
            colSpan={6}
            className="border-b border-[var(--border)] bg-gray-50/70 px-6 py-5"
            onClick={(event) => event.stopPropagation()}
          >
            <RideBookingsPanel rideId={ride.id} />
          </td>
        </tr>
      )}

      {/* Status dialog */}

      {isStatusDialogOpen && (
        <UpdateStatusDialog
          ride={ride}
          onClose={() => setIsStatusDialogOpen(false)}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
}

const MyRideRow = memo(MyRideRowComponent);

export default MyRideRow;
