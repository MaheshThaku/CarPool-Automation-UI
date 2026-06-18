import { BookOpen, ArrowRight } from "lucide-react";

import { BookingListItem } from "@/types/dashboard.types";

import { parseBookedOn, statusConfig } from "./bookingUtils";

interface BookingCardProps {
  booking: BookingListItem;
}

export default function BookingCard({ booking }: BookingCardProps) {
  // Note: the backend doesn't return the ride's departure time on this
  // endpoint, only when the booking was made.
  const dt = parseBookedOn(booking.bookingTime);
  const sc = statusConfig(booking.status);
  const StatusIcon = sc.icon;

  return (
    <div className="group rounded-2xl border border-[var(--border)] bg-white shadow-sm transition-all hover:border-[var(--primary)]/40 hover:shadow-md overflow-hidden">
      {/* Top accent bar by status */}
      <div className={`h-1 w-full ${sc.dot}`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-light)]">
              <BookOpen size={18} className="text-[var(--primary)]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-[var(--heading)]">{booking.sourceCity}</span>
                <ArrowRight size={13} className="shrink-0 text-[var(--text-light)]" />
                <span className="font-semibold text-[var(--heading)]">{booking.destinationCity}</span>
              </div>
              <p className="mt-0.5 text-xs text-[var(--text-light)]">Booking #{booking.bookingId}</p>
            </div>
          </div>
          <span className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${sc.bg} ${sc.text}`}>
            <StatusIcon size={11} />
            {sc.label}
          </span>
        </div>

        {/* Meta grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-xl bg-gray-50 px-3 py-2">
            <p className="text-[10px] text-[var(--text-light)]">Booked On</p>
            <p className="mt-0.5 text-xs font-semibold text-[var(--heading)]">{dt.date}</p>
          </div>
          <div className="rounded-xl bg-gray-50 px-3 py-2">
            <p className="text-[10px] text-[var(--text-light)]">Booked At</p>
            <p className="mt-0.5 text-xs font-semibold text-[var(--heading)]">{dt.time}</p>
          </div>
          <div className="rounded-xl bg-gray-50 px-3 py-2">
            <p className="text-[10px] text-[var(--text-light)]">Seats</p>
            <p className="mt-0.5 text-xs font-semibold text-[var(--heading)]">{booking.seatsBooked}</p>
          </div>
          <div className="rounded-xl bg-[var(--primary-light)] px-3 py-2">
            <p className="text-[10px] text-[var(--primary)]">Total Paid</p>
            <p className="mt-0.5 text-xs font-semibold text-[var(--primary)]">
              Rs.{booking.totalAmount.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Driver + actions */}
        <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white">
              {booking.driverName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-medium text-[var(--heading)]">{booking.driverName}</p>
              <p className="text-[10px] text-[var(--text-light)]">Driver</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(booking.status === "PENDING" || booking.status === "APPROVED") && (
              <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-50">
                Cancel
              </button>
            )}
            <button className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text)] transition-all hover:bg-gray-50">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
