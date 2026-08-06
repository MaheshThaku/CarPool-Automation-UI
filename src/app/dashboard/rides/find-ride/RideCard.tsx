'use client';

import { memo } from 'react';
import {
  Calendar,
  Check,
  Clock,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react';

import { RideCardProps } from '../_types/ride-page.types';
import {
  formatCurrency,
  formatDeparture,
  getDepartureLabel,
  rideStatusConfig,
} from '../_utils/ride.utils';

/** Desktop "fact" row — small icon chip + uppercase label + value. */
function FactChip({
  icon: Icon,
  label,
  value,
  alert = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          alert ? 'bg-amber-50' : 'bg-[var(--primary-light)]'
        }`}
      >
        <Icon
          size={15}
          className={alert ? 'text-amber-600' : 'text-[var(--primary)]'}
        />
      </div>
      <div>
        <p
          className={`text-[10px] font-semibold tracking-wide uppercase ${
            alert ? 'text-amber-600' : 'text-[var(--text-light)]'
          }`}
        >
          {label}
        </p>
        <p
          className={`text-sm font-semibold ${
            alert ? 'text-amber-700' : 'text-[var(--heading)]'
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function RideCardComponent({
  ride,
  onBook,
  booked = false,
  bookingLoading = false,
  requiredSeats = 1,
}: RideCardProps) {
  const departure = formatDeparture(ride.departureTime);
  const departureLabel = getDepartureLabel(ride.departureTime);
  // Search results don't always carry a status — only show a chip when set.
  const status = ride.status ? rideStatusConfig(ride.status) : null;

  const availableSeats = ride.availableSeats;
  const isSoldOut = availableSeats <= 0;
  const notEnoughSeats = requiredSeats > availableSeats;
  const isDisabled = booked || bookingLoading || isSoldOut || notEnoughSeats;

  const driverInfo = [ride.driverName, ride.vehicleName]
    .filter(Boolean)
    .join(' · ');

  const seatsText = isSoldOut
    ? 'Sold out'
    : notEnoughSeats
      ? `Only ${availableSeats} seat${availableSeats !== 1 ? 's' : ''} left`
      : `${availableSeats} seat${availableSeats !== 1 ? 's' : ''} left`;

  const seatsAlert = notEnoughSeats && !isSoldOut;

  const buttonLabel = bookingLoading
    ? 'Booking…'
    : booked
      ? 'Request Sent'
      : isSoldOut
        ? 'Sold Out'
        : notEnoughSeats
          ? 'Not Enough Seats'
          : requiredSeats > 1
            ? `Book ${requiredSeats} Seats`
            : 'Book Ride';

  // Price block — shown top-right on mobile (inside the route row) and as the
  // third column's header on desktop, via responsive visibility.
  const priceBlock = (
    <div className="text-right">
      {departureLabel && (
        <p className="mb-1 text-xs font-semibold text-[var(--primary)]">
          {departureLabel}
        </p>
      )}

      <div className="flex items-baseline justify-end gap-1">
        <span className="text-xl font-bold text-[var(--heading)] lg:text-2xl">
          {formatCurrency(ride.pricePerSeat)}
        </span>
        <span className="text-xs text-[var(--text-light)]">/ seat</span>
      </div>

      {!isSoldOut && !notEnoughSeats && requiredSeats > 1 && (
        <p className="mt-1 text-[11px] text-[var(--text-light)]">
          {formatCurrency(ride.pricePerSeat * requiredSeats)} for{' '}
          {requiredSeats} seats
        </p>
      )}
    </div>
  );

  return (
    <article className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--primary)]/40 hover:shadow-lg lg:p-6">
      {/* Premium top accent — desktop only */}
      <div className="absolute inset-x-0 top-0 hidden h-0.5 bg-gradient-to-r from-[var(--primary)] via-[var(--primary)]/50 to-transparent lg:block" />

      <div className="flex flex-col lg:grid lg:grid-cols-3 lg:items-center lg:gap-6">
        {/* Col 1 — Route */}
        <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            {/* Timeline */}
            <div className="flex shrink-0 flex-col items-center pt-1.5">
              <span className="h-2.5 w-2.5 rounded-full border-2 border-[var(--primary)] bg-white" />
              <span className="my-1 h-5 w-px bg-[var(--border)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
            </div>

            {/* Cities + addresses + driver */}
            <div className="min-w-0 flex-1 space-y-3">
              <div className="min-w-0">
                <p className="truncate text-[15px] font-bold text-[var(--heading)]">
                  {ride.sourceCity}
                </p>
                {ride.sourceAddress && (
                  <p className="mt-0.5 truncate text-xs text-[var(--text-light)]">
                    {ride.sourceAddress}
                  </p>
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-[15px] font-bold text-[var(--heading)]">
                  {ride.destinationCity}
                </p>
                {ride.destinationAddress && (
                  <p className="mt-0.5 truncate text-xs text-[var(--text-light)]">
                    {ride.destinationAddress}
                  </p>
                )}
              </div>

              {driverInfo && (
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-light)]">
                  <User size={13} className="shrink-0 text-[var(--primary)]" />
                  <span className="min-w-0 truncate">{driverInfo}</span>
                </div>
              )}
            </div>
          </div>

          {/* Mobile-only price (top-right of route row) */}
          <div className="shrink-0 lg:hidden">{priceBlock}</div>
        </div>

        {/* Col 2 — Facts (mobile: flat row / desktop: chip column) */}
        {/* Mobile facts */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--border)] pt-4 lg:hidden">
          <span className="flex items-center gap-1.5 text-xs text-[var(--text)]">
            <Calendar size={13} className="shrink-0 text-[var(--primary)]" />
            {departure.date}
          </span>

          <span className="flex items-center gap-1.5 text-xs text-[var(--text)]">
            <Clock size={13} className="shrink-0 text-[var(--primary)]" />
            {departure.time}
          </span>

          <span className={`flex items-center gap-1.5 text-xs ${seatsAlert ? 'font-semibold text-amber-600' : 'text-[var(--text)]'}`}>
            <Users size={13} className="shrink-0 text-[var(--primary)]" />
            {seatsText}
          </span>

          {status && (
            <span
              className={`ml-auto flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${status.className}`}
            >
              {status.label}
            </span>
          )}
        </div>

        {/* Desktop facts */}
        <div className="hidden shrink-0 flex-col gap-3 lg:flex lg:border-l lg:border-[var(--border)] lg:pl-8">
          <FactChip icon={Calendar} label="Date" value={departure.date} />
          <FactChip icon={Clock} label="Time" value={departure.time} />
          <FactChip
            icon={Users}
            label="Seats"
            value={seatsText}
            alert={seatsAlert}
          />
          {status && (
            <span
              className={`inline-flex w-fit items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${status.className}`}
            >
              {status.label}
            </span>
          )}
        </div>

        {/* Col 3 — Price + CTA */}
        <div className="mt-4 flex items-center justify-between gap-4 lg:mt-0 lg:shrink-0 lg:flex-col lg:items-end lg:justify-center lg:gap-4 lg:border-l lg:border-[var(--border)] lg:pl-8">
          {/* Desktop-only price */}
          <div className="hidden lg:block">{priceBlock}</div>

          <button
            type="button"
            onClick={() => onBook?.(ride.id)}
            disabled={isDisabled}
            aria-disabled={isDisabled}
            className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all active:scale-[0.98] lg:w-auto lg:px-8 ${
              booked
                ? 'bg-green-600 text-white hover:bg-green-700'
                : isDisabled
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'bg-[var(--primary)] text-white shadow-sm hover:bg-[var(--primary-hover)]'
            }`}
          >
            {booked && <Check size={15} />}
            {buttonLabel}
          </button>
        </div>
      </div>
    </article>
  );
}

export default memo(RideCardComponent);
