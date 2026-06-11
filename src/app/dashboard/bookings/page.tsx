"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen, MapPin, ArrowRight, Clock, Users,
  CheckCircle, XCircle, AlertCircle, Search,
  Calendar, Car, IndianRupee, Filter,
} from "lucide-react";

import { useAsyncData } from "@/hooks/useAsyncData";
import { dashboardService } from "@/services/dashboard.service";
import { BookingListItem, BookingStatus } from "@/types/dashboard.types";

/* =====================================================================
   Utilities
===================================================================== */

function parseDeparture(iso: string) {
  try {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase(),
      day: d.toLocaleDateString("en-IN", { weekday: "long" }),
      isPast: d < new Date(),
    };
  } catch {
    return { date: "—", time: "—", day: "—", isPast: false };
  }
}

function statusConfig(status: BookingStatus) {
  switch (status) {
    case "CONFIRMED":
      return { label: "Confirmed", bg: "bg-blue-50", text: "text-blue-700", icon: CheckCircle, dot: "bg-blue-500" };
    case "PENDING":
      return { label: "Pending", bg: "bg-amber-50", text: "text-amber-700", icon: Clock, dot: "bg-amber-500" };
    case "COMPLETED":
      return { label: "Completed", bg: "bg-green-50", text: "text-green-700", icon: CheckCircle, dot: "bg-green-500" };
    case "CANCELLED":
      return { label: "Cancelled", bg: "bg-red-50", text: "text-red-500", icon: XCircle, dot: "bg-red-400" };
    default:
      return { label: status, bg: "bg-gray-100", text: "text-gray-600", icon: AlertCircle, dot: "bg-gray-400" };
  }
}

const TABS: { key: BookingStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PENDING", label: "Pending" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
];

/* =====================================================================
   Booking Card
===================================================================== */

function BookingCard({ booking }: { booking: BookingListItem }) {
  const dt = parseDeparture(booking.departureTime);
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
              <p className="mt-0.5 text-xs text-[var(--text-light)]">Booking #{booking.id}</p>
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
            <p className="text-[10px] text-[var(--text-light)]">Date</p>
            <p className="mt-0.5 text-xs font-semibold text-[var(--heading)]">{dt.date}</p>
          </div>
          <div className="rounded-xl bg-gray-50 px-3 py-2">
            <p className="text-[10px] text-[var(--text-light)]">Time</p>
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
            {booking.status === "CONFIRMED" && !dt.isPast && (
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

/* =====================================================================
   Empty state
===================================================================== */

function EmptyBookings({ filtered }: { filtered: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-light)]">
        <BookOpen size={28} className="text-[var(--primary)]" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[var(--heading)]">
        {filtered ? "No bookings found" : "No bookings yet"}
      </h3>
      <p className="mt-1.5 max-w-xs text-sm text-[var(--text)]">
        {filtered
          ? "Try adjusting your filters or search query."
          : "You haven't booked any rides yet. Find a ride and start your journey!"}
      </p>
      {!filtered && (
        <Link
          href="/dashboard/rides"
          className="mt-5 flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
        >
          <Search size={15} /> Find a Ride
        </Link>
      )}
    </div>
  );
}

/* =====================================================================
   Skeleton
===================================================================== */

function BookingSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-[var(--border)] bg-white overflow-hidden">
      <div className="h-1 bg-gray-200" />
      <div className="p-5 space-y-4">
        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-xl bg-gray-100 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-44 rounded-lg bg-gray-100" />
            <div className="h-3 w-24 rounded-lg bg-gray-100" />
          </div>
          <div className="h-6 w-20 rounded-full bg-gray-100 shrink-0" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[1,2,3,4].map(i => <div key={i} className="h-12 rounded-xl bg-gray-100" />)}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-gray-100" />
            <div className="h-3 w-20 rounded-lg bg-gray-100" />
          </div>
          <div className="h-7 w-24 rounded-lg bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   Page
===================================================================== */

export default function MyBookingsPage() {
  const { data: bookings, loading } = useAsyncData(() => dashboardService.getAllBookings());
  const [activeTab, setActiveTab] = useState<BookingStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const all = bookings ?? [];

  const filtered = all.filter((b) => {
    const matchTab = activeTab === "ALL" || b.status === activeTab;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.sourceCity.toLowerCase().includes(q) ||
      b.destinationCity.toLowerCase().includes(q) ||
      b.driverName.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const countOf = (s: BookingStatus) => all.filter((b) => b.status === s).length;

  const totalSpent = all
    .filter((b) => b.status === "COMPLETED")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--heading)]">My Bookings</h2>
          <p className="mt-1 text-sm text-[var(--text)]">
            {loading ? "Loading your bookings…" : `${all.length} booking${all.length !== 1 ? "s" : ""} total`}
          </p>
        </div>
        <Link
          href="/dashboard/rides"
          className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
        >
          <Search size={15} /> Find a Ride
        </Link>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Bookings", value: all.length, color: "text-[var(--heading)]", bg: "bg-white", icon: BookOpen },
          { label: "Upcoming", value: countOf("CONFIRMED") + countOf("PENDING"), color: "text-blue-700", bg: "bg-blue-50", icon: Calendar },
          { label: "Completed", value: countOf("COMPLETED"), color: "text-green-700", bg: "bg-green-50", icon: CheckCircle },
          { label: "Total Spent", value: totalSpent > 0 ? `Rs.${totalSpent.toLocaleString("en-IN")}` : "Rs.0", color: "text-[var(--primary)]", bg: "bg-[var(--primary-light)]", icon: IndianRupee },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} className={`flex items-center gap-3 rounded-2xl border border-[var(--border)] ${bg} p-4`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/60">
              <Icon size={16} className={color} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--text-light)]">{label}</p>
              <p className={`mt-0.5 text-lg font-bold ${color}`}>
                {loading ? <span className="inline-block h-6 w-10 animate-pulse rounded-lg bg-gray-200" /> : value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Tabs */}
        <div className="flex overflow-x-auto rounded-xl border border-[var(--border)] bg-white p-1">
          {TABS.map(({ key, label }) => {
            const count = key === "ALL" ? all.length : countOf(key as BookingStatus);
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  activeTab === key
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "text-[var(--text)] hover:text-[var(--heading)]"
                }`}
              >
                {label}
                {!loading && all.length > 0 && (
                  <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    activeTab === key ? "bg-white/30 text-white" : "bg-gray-100 text-[var(--text-light)]"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-light)]" />
          <input
            type="text"
            placeholder="Search city or driver…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-white py-2 pl-9 pr-4 text-sm text-[var(--heading)] placeholder:text-[var(--text-light)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[1,2,3,4].map(i => <BookingSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyBookings filtered={activeTab !== "ALL" || search.length > 0} />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map(b => <BookingCard key={b.id} booking={b} />)}
        </div>
      )}
    </div>
  );
}
