'use client';

import { useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Calendar,
  Car,
  ChevronRight,
  Clock,
  IndianRupee,
  MapPin,
  Phone,
  Users,
  XCircle,
} from 'lucide-react';

import { BookingListItem } from '@/types/dashboard.types';
import { dashboardService } from '@/services/dashboard.service';
import { invalidateAsyncCache } from '@/hooks/useAsyncData';

import { parseBookedOn, statusConfig } from './bookingUtils';
import BookingDetailsModal from './BookingDetailsModal';
import PassengerAvatar from '../../rides/my-ride/PassengerAvatar';

interface BookingCardProps {
  booking: BookingListItem;
}

/** Human-friendly "departs in X" label for an upcoming ride ('' when unknown/past). */
function daysFromNow(iso: string): string {
  try {
    const target = new Date(iso).getTime();
    if (!Number.isFinite(target)) return '';
    const diff = target - Date.now();
    const days = Math.round(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return '';
    if (days === 0) return 'Departs today';
    if (days === 1) return 'Departs tomorrow';
    return `Departs in ${days} days`;
  } catch {
    return '';
  }
}

export default function BookingCard({ booking }: BookingCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const canCancel = booking.status === 'PENDING' || booking.status === 'APPROVED';

  async function handleCancel() {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(true);
    try {
      await dashboardService.cancelBooking(booking.bookingId);
      invalidateAsyncCache('passenger-bookings-UPCOMING-1');
      invalidateAsyncCache('passenger-bookings-ALL-1');
      invalidateAsyncCache('passenger-bookings-PENDING-1');
      invalidateAsyncCache('passenger-bookings-APPROVED-1');
      invalidateAsyncCache('passenger-booking-counts');
      // Force a full page reload to reflect the updated status
      window.location.reload();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to cancel booking. Please try again.';
      window.alert(message);
    } finally {
      setCancelling(false);
    }
  }

  const dt = parseBookedOn(booking.departureTime);
  const sc = statusConfig(booking.status);
  const StatusIcon = sc.icon;
  const relative = daysFromNow(booking.departureTime);

  const driverName = booking.driverName || 'Driver';
  const contact = booking.driverContactNumber || null;
  const model = booking.vehicleModel || 'Vehicle';
  const regNumber = booking.vehicleRegistrationNumber || null;
  const amount = Number(booking.totalAmount || 0);

  // Precise photon points once the API provides them; city names for now.
  const startPoint = booking.sourceAddress || booking.sourceCity;
  const endPoint = booking.destinationAddress || booking.destinationCity;

  const footerSummary = [
    `${booking.seatsBooked} seat${booking.seatsBooked === 1 ? '' : 's'}`,
    dt.day,
    relative,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <>
      <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--primary)]/30 hover:shadow-lg hover:shadow-black/5">
        {/* Status accent bar */}
        <div className={`h-1 w-full ${sc.dot}`} />

        <div className="flex flex-1 flex-col p-4">
          {/* Header: route + status */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-light)] ring-1 ring-[var(--primary)]/10">
                <Car size={16} className="text-[var(--primary)]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-[var(--heading)]">
                  <span className="truncate">{booking.sourceCity}</span>
                  <ArrowRight size={13} className="shrink-0 text-[var(--text-light)]" />
                  <span className="truncate">{booking.destinationCity}</span>
                </div>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[var(--text-light)]">
                  <MapPin size={11} className="shrink-0 text-[var(--primary)]" />
                  <span className="truncate">{startPoint}</span>
                  <span className="shrink-0">→</span>
                  <span className="truncate">{endPoint}</span>
                </p>
              </div>
            </div>

            <span
              className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${sc.bg} ${sc.text}`}
            >
              <StatusIcon size={11} />
              {sc.label}
            </span>
          </div>

          {/* Stats */}
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-lg border border-[var(--border)]/40 bg-[var(--background)] px-2.5 py-2">
              <div className="flex items-center gap-1 text-[var(--text-light)]">
                <Calendar size={12} className="text-[var(--primary)]" />
                <span className="text-[10px] font-medium uppercase tracking-wide">Date</span>
              </div>
              <p className="mt-0.5 truncate text-xs font-semibold text-[var(--heading)]">{dt.date}</p>
            </div>

            <div className="rounded-lg border border-[var(--border)]/40 bg-[var(--background)] px-2.5 py-2">
              <div className="flex items-center gap-1 text-[var(--text-light)]">
                <Clock size={12} className="text-[var(--primary)]" />
                <span className="text-[10px] font-medium uppercase tracking-wide">Time</span>
              </div>
              <p className="mt-0.5 truncate text-xs font-semibold text-[var(--heading)]">{dt.time}</p>
            </div>

            <div className="rounded-lg border border-[var(--border)]/40 bg-[var(--background)] px-2.5 py-2">
              <div className="flex items-center gap-1 text-[var(--text-light)]">
                <Users size={12} className="text-[var(--primary)]" />
                <span className="text-[10px] font-medium uppercase tracking-wide">Seats</span>
              </div>
              <p className="mt-0.5 text-xs font-semibold text-[var(--heading)]">{booking.seatsBooked}</p>
            </div>

            <div className="rounded-lg border border-[var(--primary)]/15 bg-[var(--primary-light)] px-2.5 py-2">
              <div className="flex items-center gap-1 text-[var(--primary)]">
                <IndianRupee size={12} />
                <span className="text-[10px] font-medium uppercase tracking-wide">Paid</span>
              </div>
              <p className="mt-0.5 truncate text-xs font-bold text-[var(--primary)]">
                ₹{amount.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-3 border-t border-dashed border-[var(--border)]" />

          {/* Driver + vehicle */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <PassengerAvatar
                name={driverName}
                photoUrl={booking.driverProfilePic}
                size={36}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <p className="truncate text-sm font-semibold text-[var(--heading)]">{driverName}</p>
                  <BadgeCheck size={14} className="shrink-0 text-[var(--primary)]" />
                </div>
                {contact ? (
                  <a
                    href={`tel:${contact}`}
                    className="mt-0.5 inline-flex items-center gap-1 text-xs text-[var(--text-light)] transition-colors hover:text-[var(--primary)]"
                  >
                    <Phone size={11} />
                    {contact}
                  </a>
                ) : (
                  <p className="mt-0.5 text-xs text-[var(--text-light)]">Contact unavailable</p>
                )}
              </div>
            </div>

            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5">
              <Car size={13} className="text-[var(--primary)]" />
              <span className="text-xs font-semibold text-[var(--heading)]">{model}</span>
              {regNumber && (
                <span className="text-[11px] font-medium text-[var(--text-light)]">· {regNumber}</span>
              )}
            </span>
          </div>

          {/* Footer actions */}
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--border)] pt-3">
            <span className="truncate text-[11px] text-[var(--text-light)]">{footerSummary}</span>
            <div className="flex shrink-0 items-center gap-2">
              {canCancel && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-all hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
                >
                  <XCircle size={13} />
                  {cancelling ? 'Cancelling…' : 'Cancel'}
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowDetails(true)}
                className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs font-medium text-[var(--text)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                View Details
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </article>

      {showDetails && (
        <BookingDetailsModal
          booking={booking}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}
