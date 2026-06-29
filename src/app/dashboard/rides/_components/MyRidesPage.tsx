"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  Car, Plus, ArrowRight, Clock, Users,
  CalendarDays, CheckCircle, XCircle, AlertCircle,
  Search, ChevronDown, ChevronUp, User2,
  IndianRupee, Loader2, BookOpen,
} from "lucide-react";

import { useAsyncData } from "@/hooks/useAsyncData";
import { rideService } from "@/services/ride.service";
import { bookingService } from "@/services/booking.service";
import { RideResponse, RideStatus, RideBookingResponse, BookingStatus } from "@/types/ride.types";

/* =====================================================================
   Utilities
===================================================================== */

function parseDeparture(iso: string) {
  try {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase(),
      day: d.toLocaleDateString("en-IN", { weekday: "short" }),
    };
  } catch {
    return { date: "—", time: "—", day: "—" };
  }
}

function rideStatusConfig(status: RideStatus) {
  switch (status) {
    case "SCHEDULED": return { label: "Scheduled", bg: "bg-blue-50", text: "text-blue-700", icon: Clock };
    case "COMPLETED": return { label: "Completed", bg: "bg-green-50", text: "text-green-700", icon: CheckCircle };
    case "CANCELLED": return { label: "Cancelled", bg: "bg-red-50", text: "text-red-500", icon: XCircle };
    default: return { label: status, bg: "bg-gray-100", text: "text-gray-600", icon: AlertCircle };
  }
}

function bookingStatusConfig(status: BookingStatus) {
  switch (status) {
    case "PENDING":  return { label: "Pending",  bg: "bg-amber-50",  text: "text-amber-700", dot: "bg-amber-400" };
    case "APPROVED": return { label: "Approved", bg: "bg-green-50",  text: "text-green-700", dot: "bg-green-500" };
    case "REJECTED": return { label: "Rejected", bg: "bg-red-50",    text: "text-red-500",   dot: "bg-red-400" };
    case "CANCELLED":return { label: "Cancelled",bg: "bg-gray-100",  text: "text-gray-500",  dot: "bg-gray-400" };
    default:         return { label: status,     bg: "bg-gray-100",  text: "text-gray-500",  dot: "bg-gray-400" };
  }
}

/* =====================================================================
   Booking row inside the expanded panel
===================================================================== */

interface BookingRowProps {
  booking: RideBookingResponse;
  onApprove: (id: number) => Promise<void>;
  onReject:  (id: number) => Promise<void>;
}

function BookingRow({ booking, onApprove, onReject }: BookingRowProps) {
  const [busy, setBusy] = useState<"approve" | "reject" | null>(null);
  const sc = bookingStatusConfig(booking.status);

  const handle = async (action: "approve" | "reject") => {
    setBusy(action);
    try {
      if (action === "approve") await onApprove(booking.bookingId);
      else await onReject(booking.bookingId);
    } finally {
      setBusy(null);
    }
  };

  const bookedAt = (() => {
    try { return new Date(booking.bookingTime).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
    catch { return "—"; }
  })();

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Passenger info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white">
          {booking.passengerName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--heading)] truncate">{booking.passengerName}</p>
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            <span className="flex items-center gap-1 text-xs text-[var(--text-light)]">
              <Users size={11} /> {booking.seatsBooked} seat{booking.seatsBooked !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1 text-xs text-[var(--text-light)]">
              <IndianRupee size={11} /> Rs.{booking.totalAmount.toLocaleString("en-IN")}
            </span>
            <span className="flex items-center gap-1 text-xs text-[var(--text-light)]">
              <CalendarDays size={11} /> {bookedAt}
            </span>
          </div>
        </div>
      </div>

      {/* Status + actions */}
      <div className="flex items-center gap-2 shrink-0">
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${sc.bg} ${sc.text}`}>
          {sc.label}
        </span>

        {booking.status === "PENDING" && (
          <>
            <button
              onClick={() => handle("approve")}
              disabled={busy !== null}
              className="flex items-center gap-1 rounded-xl bg-green-500 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-green-600 disabled:opacity-50"
            >
              {busy === "approve" ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
              Approve
            </button>
            <button
              onClick={() => handle("reject")}
              disabled={busy !== null}
              className="flex items-center gap-1 rounded-xl border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 transition-all hover:bg-red-50 disabled:opacity-50"
            >
              {busy === "reject" ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* =====================================================================
   Bookings panel (lazy-loaded per ride)
===================================================================== */

interface BookingsPanelProps {
  rideId: number;
}

function BookingsPanel({ rideId }: BookingsPanelProps) {
  const [bookings, setBookings] = useState<RideBookingResponse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch on first render of the panel
  useState(() => {
    bookingService.getBookingsByRide(rideId)
      .then(setBookings)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  });

  const handleApprove = useCallback(async (bookingId: number) => {
    const updated = await bookingService.approveBooking(bookingId);
    setBookings((prev) =>
      prev ? prev.map((b) => b.bookingId === bookingId ? { ...b, status: updated.status } : b) : prev
    );
  }, []);

  const handleReject = useCallback(async (bookingId: number) => {
    const updated = await bookingService.rejectBooking(bookingId);
    setBookings((prev) =>
      prev ? prev.map((b) => b.bookingId === bookingId ? { ...b, status: updated.status } : b) : prev
    );
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-6 text-sm text-[var(--text-light)]">
        <Loader2 size={16} className="animate-spin" /> Loading booking requests…
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-4 text-center text-xs text-red-500">
        Could not load bookings: {error}
      </p>
    );
  }

  const list = bookings ?? [];

  if (list.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <BookOpen size={24} className="text-[var(--text-light)]" />
        <p className="text-sm text-[var(--text-light)]">No booking requests yet for this ride.</p>
      </div>
    );
  }

  const pending   = list.filter((b) => b.status === "PENDING").length;
  const approved  = list.filter((b) => b.status === "APPROVED").length;

  return (
    <div className="space-y-3">
      {/* Summary chips */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-700">{pending} pending</span>
        <span className="rounded-full bg-green-50 px-2.5 py-1 font-semibold text-green-700">{approved} approved</span>
        <span className="rounded-full bg-gray-100 px-2.5 py-1 font-semibold text-gray-600">{list.length} total</span>
      </div>

      {list.map((booking) => (
        <BookingRow
          key={booking.bookingId}
          booking={booking}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      ))}
    </div>
  );
}

/* =====================================================================
   Ride Table Row (expands in-place to show bookings, not a modal)
===================================================================== */

function RideTableRow({ ride }: { ride: RideResponse }) {
  const [expanded, setExpanded] = useState(false);
  const dt = parseDeparture(ride.departureTime);
  const sc = rideStatusConfig(ride.status);
  const StatusIcon = sc.icon;

  return (
    <>
      <tr className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50/60">
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-light)]">
              <Car size={15} className="text-[var(--primary)]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 font-semibold text-[var(--heading)]">
                <span>{ride.sourceCity}</span>
                <ArrowRight size={12} className="shrink-0 text-[var(--text-light)]" />
                <span>{ride.destinationCity}</span>
              </div>
              <p className="text-xs text-[var(--text-light)]">Ride #{ride.id}</p>
            </div>
          </div>
        </td>
        <td className="px-5 py-3.5 whitespace-nowrap">
          <p className="font-medium text-[var(--heading)]">{dt.date}</p>
          <p className="text-xs text-[var(--text-light)]">{dt.day} · {dt.time}</p>
        </td>
        <td className="px-5 py-3.5 text-[var(--text)]">
          <span className="flex items-center gap-1"><Users size={12} />{ride.availableSeats}</span>
        </td>
        <td className="px-5 py-3.5 font-semibold text-[var(--primary)] whitespace-nowrap">
          Rs.{ride.pricePerSeat.toLocaleString("en-IN")}
        </td>
        <td className="px-5 py-3.5">
          <span className={`flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${sc.bg} ${sc.text}`}>
            <StatusIcon size={11} />{sc.label}
          </span>
        </td>
        <td className="px-5 py-3.5 text-right">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
          >
            <User2 size={12} />
            Bookings
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </td>
      </tr>

      {/* Expandable bookings panel — an inline row, not a modal */}
      {expanded && (
        <tr className="border-b border-[var(--border)] bg-gray-50/60 last:border-0">
          <td colSpan={6} className="px-5 py-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-light)]">
              Booking Requests
            </p>
            <BookingsPanel rideId={ride.id} />
          </td>
        </tr>
      )}
    </>
  );
}

/* =====================================================================
   Tabs / filters
===================================================================== */

const TABS: { key: RideStatus | "ALL"; label: string }[] = [
  { key: "ALL",       label: "All Rides"  },
  { key: "SCHEDULED", label: "Scheduled"  },
  { key: "COMPLETED", label: "Completed"  },
  { key: "CANCELLED", label: "Cancelled"  },
];

/* =====================================================================
   Page
===================================================================== */

export default function MyRidesPage() {
  const { data: rides, loading } = useAsyncData(() => rideService.getRiderRides(), [], { cacheKey: "rider-rides-list" });
  const [activeTab, setActiveTab] = useState<RideStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const filtered = (rides ?? []).filter((r) => {
    const matchTab = activeTab === "ALL" || r.status === activeTab;
    const q = search.toLowerCase();
    return matchTab && (!q || r.sourceCity.toLowerCase().includes(q) || r.destinationCity.toLowerCase().includes(q));
  });

  const countByStatus = (s: RideStatus) => (rides ?? []).filter((r) => r.status === s).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--heading)]">My Rides</h2>
          <p className="mt-1 text-sm text-[var(--text)]">
            {loading ? "Loading…" : `${(rides ?? []).length} ride${(rides ?? []).length !== 1 ? "s" : ""} published`}
          </p>
        </div>
        <Link
          href="/dashboard/rides/publish"
          className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
        >
          <Plus size={16} /> Offer New Ride
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total",     value: (rides ?? []).length, color: "text-[var(--heading)]", bg: "bg-white"    },
          { label: "Scheduled", value: countByStatus("SCHEDULED"), color: "text-blue-700",  bg: "bg-blue-50"  },
          { label: "Completed", value: countByStatus("COMPLETED"), color: "text-green-700", bg: "bg-green-50" },
          { label: "Cancelled", value: countByStatus("CANCELLED"), color: "text-red-500",   bg: "bg-red-50"   },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-2xl border border-[var(--border)] ${bg} p-4`}>
            <p className="text-xs text-[var(--text-light)]">{label}</p>
            <p className={`mt-1 text-2xl font-bold ${color}`}>
              {loading
                ? <span className="inline-block h-7 w-8 animate-pulse rounded-lg bg-gray-200" />
                : value}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs + search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex overflow-x-auto rounded-xl border border-[var(--border)] bg-white p-1">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === key
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "text-[var(--text)] hover:text-[var(--heading)]"
              }`}
            >
              {label}
              {key !== "ALL" && !loading && (rides ?? []).length > 0 && (
                <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  activeTab === key ? "bg-white/30 text-white" : "bg-gray-100 text-[var(--text-light)]"
                }`}>
                  {countByStatus(key as RideStatus)}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-light)]" />
          <input
            type="text"
            placeholder="Search by city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-white py-2 pl-9 pr-4 text-sm text-[var(--heading)] placeholder:text-[var(--text-light)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl border border-[var(--border)] bg-white" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-light)]">
            <Car size={28} className="text-[var(--primary)]" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[var(--heading)]">
            {activeTab !== "ALL" || search ? "No rides found" : "No rides yet"}
          </h3>
          <p className="mt-1.5 max-w-xs text-sm text-[var(--text)]">
            {activeTab !== "ALL" || search
              ? "Try a different filter or search."
              : "You haven't offered any rides yet."}
          </p>
          {activeTab === "ALL" && !search && (
            <Link
              href="/dashboard/rides/publish"
              className="mt-5 flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
            >
              <Plus size={16} /> Offer a Ride
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-gray-50 text-xs font-medium uppercase tracking-wide text-[var(--text-light)]">
                <th className="px-5 py-3">Route</th>
                <th className="px-5 py-3">Date &amp; Time</th>
                <th className="px-5 py-3">Seats Left</th>
                <th className="px-5 py-3">Price / Seat</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Bookings</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ride) => <RideTableRow key={ride.id} ride={ride} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
