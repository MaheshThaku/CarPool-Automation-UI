"use client";

import { useState } from "react";
import { BookOpen, ArrowRight, Calendar, Clock, Users, IndianRupee } from "lucide-react";

import { BookingListItem } from "@/types/dashboard.types";
import { parseBookedOn, statusConfig } from "./bookingUtils";
import BookingDetailsModal from "./BookingDetailsModal";

interface BookingCardProps {
  booking: BookingListItem;
}

export default function BookingCard({ booking }: BookingCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const dt = parseBookedOn(booking.bookingTime);
  const sc = statusConfig(booking.status);
  const StatusIcon = sc.icon;

  return (
    <>
      <div className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-all duration-300 hover:border-[var(--primary)] hover:shadow-md overflow-hidden">
        {/* Top accent bar by status */}
        <div className={`h-1 w-full ${sc.dot}`} />

        <div className="p-5 flex flex-col justify-between h-full">
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
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-[var(--background)] p-3 border border-[var(--border)]/30 hover:bg-white transition-colors">
              <div className="flex items-center gap-1 text-[var(--text-light)]">
                <Calendar size={12} className="text-[var(--primary)]" />
                <span className="text-[10px]">Booked On</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-[var(--heading)]">{dt.date}</p>
            </div>
            <div className="rounded-xl bg-[var(--background)] p-3 border border-[var(--border)]/30 hover:bg-white transition-colors">
              <div className="flex items-center gap-1 text-[var(--text-light)]">
                <Clock size={12} className="text-[var(--primary)]" />
                <span className="text-[10px]">Booked At</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-[var(--heading)]">{dt.time}</p>
            </div>
            <div className="rounded-xl bg-[var(--background)] p-3 border border-[var(--border)]/30 hover:bg-white transition-colors">
              <div className="flex items-center gap-1 text-[var(--text-light)]">
                <Users size={12} className="text-[var(--primary)]" />
                <span className="text-[10px]">Seats</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-[var(--heading)]">{booking.seatsBooked}</p>
            </div>
            <div className="rounded-xl bg-[var(--primary-light)] p-3 border border-[var(--primary)]/10 hover:bg-white transition-colors">
              <div className="flex items-center gap-1 text-[var(--primary)]">
                <IndianRupee size={12} />
                <span className="text-[10px]">Total Paid</span>
              </div>
              <p className="mt-1 text-xs font-bold text-[var(--primary)]">
                Rs.{booking.totalAmount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Driver + actions */}
          <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#E4A538] to-[#C7881D] text-xs font-bold text-white shadow-sm">
                {booking.driverName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--heading)] leading-tight">{booking.driverName}</p>
                <p className="text-[10px] text-[var(--text-light)]">Driver</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {(booking.status === "PENDING" || booking.status === "APPROVED") && (
                <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 transition-all hover:bg-red-50 hover:border-red-300">
                  Cancel
                </button>
              )}
              <button 
                type="button"
                onClick={() => setShowDetails(true)}
                className="rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] shadow-sm"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDetails && (
        <BookingDetailsModal 
          booking={booking} 
          onClose={() => setShowDetails(false)} 
        />
      )}
    </>
  );
}
