"use client";

import Link from "next/link";
import {
  Car, CalendarDays, Shield, ArrowRight, Clock, MoreVertical,
  CheckCircle, ChevronRight, Plus, FileText, ShieldCheck,
  MapPin, Phone, ArrowLeftRight, AlertCircle, RefreshCw,
} from "lucide-react";

import StatsCard from "@/components/dashboard/StatsCard";
import { CurrentUser, useCurrentUser } from "@/hooks/useCurrentUser";
import { useAsyncData } from "@/hooks/useAsyncData";
import { dashboardService } from "@/services/dashboard.service";
import { DocStatus } from "@/types/dashboard.types";

/* =====================================================================
   Utilities
===================================================================== */

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function formatDisplayName(user: CurrentUser): string {
  if (user.firstName && user.firstName !== user.email.split("@")[0]) {
    return user.firstName;
  }
  // Fall back to capitalising the email prefix
  const prefix = user.email.split("@")[0];
  return prefix.charAt(0).toUpperCase() + prefix.slice(1);
}

function parseDeparture(iso: string) {
  try {
    const d = new Date(iso);
    return {
      date: d.getDate(),
      month: d.toLocaleString("en-IN", { month: "short" }),
      day: d.toLocaleString("en-IN", { weekday: "short" }),
      time: d
        .toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
        .toUpperCase(),
    };
  } catch {
    return { date: "--", month: "---", day: "---", time: "--:--" };
  }
}

function docStatusLabel(status: DocStatus) {
  switch (status) {
    case "VERIFIED": return { text: "Verified", color: "text-green-600" };
    case "PENDING": return { text: "Pending", color: "text-amber-500" };
    case "REJECTED": return { text: "Rejected", color: "text-red-500" };
    default: return { text: "Not Provided", color: "text-amber-500" };
  }
}

/* =====================================================================
   Shared UI primitives
===================================================================== */

function Skeleton({ className }: { className: string }) {
  return <div className={"animate-pulse rounded-xl bg-gray-100 " + className} />;
}

function StatsCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm">
      <Skeleton className="h-14 w-14 rounded-2xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-10" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

function SectionError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600">
      <AlertCircle size={16} className="shrink-0" />
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="flex items-center gap-1 font-medium hover:underline">
          <RefreshCw size={13} /> Retry
        </button>
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, action }: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <Icon size={22} className="text-gray-400" />
      </div>
      <p className="mt-3 font-medium text-[var(--heading)]">{title}</p>
      <p className="mt-1 text-sm text-[var(--text-light)]">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function CircularProgress({ pct }: { pct: number }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" className="shrink-0">
      <circle cx="40" cy="40" r={r} fill="none" stroke="#E5E7EB" strokeWidth="8" />
      <circle
        cx="40" cy="40" r={r} fill="none"
        stroke="#d89a33" strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 40 40)"
      />
      <text x="40" y="45" textAnchor="middle" fontSize="14" fontWeight="700" fill="#111827">
        {pct}%
      </text>
    </svg>
  );
}

/* =====================================================================
   Rider Dashboard
===================================================================== */

function RiderDashboard({ user }: { user: CurrentUser }) {
  const stats = useAsyncData(() => dashboardService.getRiderStats());
  const rides = useAsyncData(() => dashboardService.getUpcomingRides());
  const verification = useAsyncData(() => dashboardService.getVerificationStatus());
  const vehicle = useAsyncData(() => dashboardService.getVehicleInfo());
  const completion = useAsyncData(() => dashboardService.getProfileCompletion());

  const displayName = formatDisplayName(user);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--heading)]">
          {getGreeting()}, {displayName}! <span aria-hidden="true">👋</span>
        </h2>
        <p className="mt-1 text-sm text-[var(--text)]">Ready to share your next journey?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.loading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : stats.error ? (
          <div className="col-span-3">
            <SectionError message={stats.error} onRetry={stats.refetch} />
          </div>
        ) : (
          <>
            <StatsCard
              icon={Car}
              title="Total Rides"
              value={stats.data ? String(stats.data.totalRides) : "—"}
              subtitle="All time"
            />
            <StatsCard
              icon={CalendarDays}
              title="Upcoming Rides"
              value={stats.data ? String(stats.data.upcomingRides) : "—"}
              subtitle="Next 7 days"
            />
            <StatsCard
              icon={Shield}
              title="Verification Status"
              value={
                stats.data
                  ? stats.data.verificationStatus === "VERIFIED"
                    ? "Verified"
                    : stats.data.verificationStatus === "PENDING"
                    ? "Pending"
                    : "Incomplete"
                  : "—"
              }
              subtitle={
                stats.data && stats.data.verificationStatus === "VERIFIED"
                  ? "Documents verified"
                  : "Complete verification"
              }
              valueColor={
                stats.data && stats.data.verificationStatus === "VERIFIED"
                  ? "green"
                  : "default"
              }
              verified={stats.data?.verificationStatus === "VERIFIED"}
            />
          </>
        )}
      </div>

      {/* Hero Banner */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{ background: "linear-gradient(135deg, #b85e04 0%, #d89a33 55%, #e8b050 100%)" }}
      >
        <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 right-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="relative z-10 flex items-center justify-between p-8">
          <div className="max-w-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <Car size={24} className="text-white" />
            </div>
            <h3 className="text-3xl font-bold leading-tight text-white">
              Offer a Ride.<br />Share the Journey.
            </h3>
            <p className="mt-2 text-sm text-white/80">
              Help travelers save money while making your trip more rewarding.
            </p>
            <Link
              href="/dashboard/rides/publish"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border-2 border-white bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white hover:text-[var(--primary)]"
            >
              <Plus size={16} />
              Offer New Ride
            </Link>
          </div>
          <div className="hidden items-center justify-center rounded-2xl bg-white/10 p-8 lg:flex">
            <Car size={72} className="text-white/70" />
          </div>
        </div>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Rides */}
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[var(--heading)]">Upcoming Rides</h3>
            <Link href="/dashboard/rides" className="flex items-center gap-1 text-sm font-medium text-[var(--primary)] hover:underline">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {rides.loading ? (
            <div className="mt-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 py-2">
                  <Skeleton className="h-16 w-[46px]" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : rides.error ? (
            <div className="mt-4"><SectionError message={rides.error} onRetry={rides.refetch} /></div>
          ) : !rides.data || rides.data.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                icon={CalendarDays}
                title="No upcoming rides"
                description="You have no rides scheduled. Offer a new ride to get started."
                action={
                  <Link href="/dashboard/rides/publish" className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]">
                    <Plus size={14} /> Offer a Ride
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="mt-4 divide-y divide-[var(--border)]">
              {rides.data.map((ride) => {
                const dt = parseDeparture(ride.departureTime);
                return (
                  <div key={ride.id} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
                    <div className="flex w-[46px] shrink-0 flex-col items-center rounded-xl bg-[var(--primary-light)] py-2">
                      <span className="text-lg font-bold leading-none text-[var(--heading)]">{dt.date}</span>
                      <span className="mt-0.5 text-[10px] font-medium text-[var(--primary)]">{dt.month}</span>
                      <span className="text-[10px] text-[var(--text-light)]">{dt.day}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[var(--heading)]">{ride.sourceCity}</span>
                        <ArrowRight size={13} className="shrink-0 text-[var(--text-light)]" />
                        <span className="font-semibold text-[var(--heading)]">{ride.destinationCity}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-[var(--text)]">
                        <span className="flex items-center gap-1"><Clock size={11} />{dt.time}</span>
                        <span>• {ride.availableSeats} Seats Available</span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-[var(--primary)]">
                        Rs.{ride.pricePerSeat} / Seat
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button className="rounded-lg border border-[var(--primary)] px-2.5 py-1.5 text-xs font-medium text-[var(--primary)] transition-all hover:bg-[var(--primary-light)]">
                        View Details
                      </button>
                      <button className="p-1 text-[var(--text-light)] hover:text-[var(--heading)]">
                        <MoreVertical size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!rides.loading && !rides.error && rides.data && rides.data.length > 0 && (
            <div className="mt-4 border-t border-[var(--border)] pt-4 text-center text-xs text-[var(--text)]">
              <Link href="/dashboard/rides" className="font-medium text-[var(--primary)] hover:underline">
                View all rides →
              </Link>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Verification Status */}
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[var(--heading)]">Verification Status</h3>
              <Link href="/dashboard/documents" className="flex items-center gap-1 text-sm font-medium text-[var(--primary)] hover:underline">
                View all <ArrowRight size={14} />
              </Link>
            </div>

            {verification.loading ? (
              <div className="mt-3 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : verification.error ? (
              <div className="mt-3"><SectionError message={verification.error} onRetry={verification.refetch} /></div>
            ) : !verification.data || verification.data.length === 0 ? (
              <div className="mt-3">
                <EmptyState icon={FileText} title="No documents" description="Upload your documents to get verified." />
              </div>
            ) : (
              <div className="mt-3 divide-y divide-[var(--border)]">
                {verification.data.map((item) => {
                  const sl = docStatusLabel(item.status);
                  return (
                    <div key={item.documentType} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-light)]">
                          <FileText size={14} className="text-[var(--primary)]" />
                        </div>
                        <span className="text-sm font-medium text-[var(--heading)]">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={"text-xs font-semibold " + sl.color}>{sl.text}</span>
                        {item.status === "VERIFIED" && <CheckCircle size={14} className="text-green-600" />}
                        <ChevronRight size={14} className="text-gray-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Vehicle Information */}
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
            <h3 className="font-semibold text-[var(--heading)]">Vehicle Information</h3>

            {vehicle.loading ? (
              <div className="mt-4 flex items-center gap-4">
                <Skeleton className="h-16 w-24 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ) : vehicle.error ? (
              <div className="mt-4"><SectionError message={vehicle.error} onRetry={vehicle.refetch} /></div>
            ) : !vehicle.data ? (
              <div className="mt-4">
                <EmptyState
                  icon={Car}
                  title="No vehicle added"
                  description="Add your vehicle details to start offering rides."
                  action={
                    <Link href="/dashboard/profile" className="inline-flex items-center gap-2 rounded-xl border border-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary)] hover:bg-[var(--primary-light)]">
                      Add Vehicle
                    </Link>
                  }
                />
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                  {vehicle.data.imageUrl ? (
                    <img src={vehicle.data.imageUrl} alt={vehicle.data.model} className="h-full w-full object-cover" />
                  ) : (
                    <Car size={34} className="text-gray-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[var(--heading)]">{vehicle.data.model}</p>
                  <p className="text-sm text-[var(--text-light)]">{vehicle.data.registrationNumber}</p>
                  <p className="text-sm text-[var(--text-light)]">
                    {vehicle.data.color} &bull; {vehicle.data.vehicleType}
                  </p>
                </div>
                <Link
                  href="/dashboard/profile"
                  className="shrink-0 rounded-xl border border-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary)] transition-all hover:bg-[var(--primary-light)]"
                >
                  Edit
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Completion */}
      <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
        {completion.loading ? (
          <div className="flex items-center gap-6">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
        ) : completion.error ? (
          <SectionError message={completion.error} onRetry={completion.refetch} />
        ) : !completion.data ? null : (
          <div className="flex flex-wrap items-center gap-6">
            <CircularProgress pct={completion.data.percentage} />
            <div>
              <h3 className="font-semibold text-[var(--heading)]">Profile Completion</h3>
              <p className="mt-0.5 text-sm text-[var(--text)]">
                Complete your profile to build more trust.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:ml-auto">
              {completion.data.steps.map((step) => (
                <div
                  key={step.key}
                  className={"flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium " + (step.completed ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700")}
                >
                  {step.completed ? <CheckCircle size={13} /> : <Clock size={13} />}
                  {step.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =====================================================================
   Passenger Dashboard
===================================================================== */

function PassengerDashboard({ user }: { user: CurrentUser }) {
  const stats = useAsyncData(() => dashboardService.getPassengerStats());
  const trips = useAsyncData(() => dashboardService.getUpcomingTrips());
  const bookings = useAsyncData(() => dashboardService.getRecentBookings());
  const profileVerif = useAsyncData(() => dashboardService.getProfileVerification());

  const displayName = formatDisplayName(user);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--heading)]">
          {getGreeting()}, {displayName}! <span aria-hidden="true">👋</span>
        </h2>
        <p className="mt-1 text-sm text-[var(--text)]">Book rides, travel together and save more.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.loading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : stats.error ? (
          <div className="col-span-3">
            <SectionError message={stats.error} onRetry={stats.refetch} />
          </div>
        ) : (
          <>
            <StatsCard
              icon={CalendarDays}
              title="Total Bookings"
              value={stats.data ? String(stats.data.totalBookings) : "—"}
              subtitle="All time"
            />
            <StatsCard
              icon={CalendarDays}
              title="Upcoming Trips"
              value={stats.data ? String(stats.data.upcomingTrips) : "—"}
              subtitle="Next 7 days"
            />
            <StatsCard
              icon={ShieldCheck}
              title="Profile Verified"
              value={stats.data ? (stats.data.profileVerified ? "Verified" : "Incomplete") : "—"}
              subtitle={stats.data && stats.data.profileVerified ? "You're good to go!" : "Complete your profile"}
              valueColor={stats.data && stats.data.profileVerified ? "green" : "default"}
              verified={stats.data?.profileVerified}
            />
          </>
        )}
      </div>

      {/* Hero Search Banner */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{ background: "linear-gradient(135deg, #b85e04 0%, #d89a33 55%, #e8b050 100%)" }}
      >
        <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 right-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="relative z-10 p-8">
          <h3 className="text-2xl font-bold text-white">Find Your Next Ride</h3>
          <p className="mt-1 text-sm text-white/80">
            Search from thousands of rides and travel safely with verified drivers.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl bg-white p-2 shadow-lg">
            <div className="flex min-w-[140px] flex-1 items-center gap-2 rounded-xl px-3 py-2">
              <MapPin size={16} className="shrink-0 text-[var(--primary)]" />
              <input type="text" placeholder="From" className="w-full bg-transparent text-sm text-[var(--heading)] placeholder:text-[var(--text-light)] outline-none" />
            </div>
            <button className="rounded-lg p-2 text-[var(--primary)] hover:bg-[var(--primary-light)]">
              <ArrowLeftRight size={16} />
            </button>
            <div className="flex min-w-[140px] flex-1 items-center gap-2 rounded-xl px-3 py-2">
              <MapPin size={16} className="shrink-0 text-[var(--primary)]" />
              <input type="text" placeholder="To" className="w-full bg-transparent text-sm text-[var(--heading)] placeholder:text-[var(--text-light)] outline-none" />
            </div>
            <div className="flex min-w-[130px] flex-1 items-center gap-2 rounded-xl px-3 py-2">
              <CalendarDays size={16} className="shrink-0 text-[var(--primary)]" />
              <input type="date" className="w-full bg-transparent text-sm text-[var(--heading)] outline-none" />
            </div>
            <Link
              href="/dashboard/rides"
              className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[var(--primary-hover)]"
            >
              Search Rides
            </Link>
          </div>
        </div>
      </div>

      {/* Two-column: Upcoming Trips + Recent Bookings */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Trips */}
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[var(--heading)]">Upcoming Trips</h3>
            <Link href="/dashboard/bookings" className="flex items-center gap-1 text-sm font-medium text-[var(--primary)] hover:underline">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {trips.loading ? (
            <div className="mt-4 space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3 py-2">
                  <Skeleton className="h-16 w-[46px]" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
              ))}
            </div>
          ) : trips.error ? (
            <div className="mt-4"><SectionError message={trips.error} onRetry={trips.refetch} /></div>
          ) : !trips.data || trips.data.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                icon={CalendarDays}
                title="No upcoming trips"
                description="You have no trips booked. Search for a ride to get started."
                action={
                  <Link href="/dashboard/rides" className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]">
                    Find a Ride
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="mt-4 divide-y divide-[var(--border)]">
              {trips.data.map((trip) => {
                const dt = parseDeparture(trip.departureTime);
                return (
                  <div key={trip.id} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
                    <div className="flex w-[46px] shrink-0 flex-col items-center rounded-xl bg-[var(--primary-light)] py-2">
                      <span className="text-lg font-bold leading-none text-[var(--heading)]">{dt.date}</span>
                      <span className="mt-0.5 text-[10px] font-medium text-[var(--primary)]">{dt.month}</span>
                      <span className="text-[10px] text-[var(--text-light)]">{dt.day}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[var(--heading)]">{trip.sourceCity}</span>
                        <ArrowRight size={13} className="shrink-0 text-[var(--text-light)]" />
                        <span className="font-semibold text-[var(--heading)]">{trip.destinationCity}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-[var(--text)]">
                        <span className="flex items-center gap-1"><Clock size={11} />{dt.time}</span>
                        <span>• {trip.availableSeats} Seats Available</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white">
                          {trip.driverName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-[var(--text)]">Driver: {trip.driverName}</span>
                        <span className={"rounded-full px-2 py-0.5 text-[10px] font-semibold " + (trip.status === "CONFIRMED" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700")}>
                          {trip.status.charAt(0) + trip.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </div>
                    <button className="shrink-0 rounded-lg border border-[var(--primary)] px-2.5 py-1.5 text-xs font-medium text-[var(--primary)] transition-all hover:bg-[var(--primary-light)]">
                      View Details
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[var(--heading)]">Recent Bookings</h3>
            <Link href="/dashboard/bookings" className="flex items-center gap-1 text-sm font-medium text-[var(--primary)] hover:underline">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {bookings.loading ? (
            <div className="mt-4 space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4 rounded-xl border border-[var(--border)] p-3">
                  <Skeleton className="h-14 w-14 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <div className="space-y-1 text-right">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : bookings.error ? (
            <div className="mt-4"><SectionError message={bookings.error} onRetry={bookings.refetch} /></div>
          ) : !bookings.data || bookings.data.length === 0 ? (
            <div className="mt-4">
              <EmptyState icon={CalendarDays} title="No bookings yet" description="Your completed and cancelled rides will appear here." />
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {bookings.data.map((booking) => {
                const dt = parseDeparture(booking.departureTime);
                return (
                  <div key={booking.id} className="flex items-center gap-4 rounded-xl border border-[var(--border)] p-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                      <MapPin size={22} className="text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[var(--heading)]">{booking.sourceCity}</span>
                        <ArrowRight size={12} className="text-[var(--text-light)]" />
                        <span className="font-semibold text-[var(--heading)]">{booking.destinationCity}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-[var(--text-light)]">
                        {dt.date} {dt.month} {new Date(booking.departureTime).getFullYear()} {String.fromCharCode(8226)} {dt.time}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-semibold text-[var(--heading)]">Rs.{booking.totalAmount}</p>
                      <span className={"mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold " + (booking.status === "COMPLETED" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600")}>
                        {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom: Profile Verification + Safety */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Profile Verification */}
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
          <h3 className="font-semibold text-[var(--heading)]">Profile Verification</h3>

          {profileVerif.loading ? (
            <div className="mt-4 space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : profileVerif.error ? (
            <div className="mt-4"><SectionError message={profileVerif.error} onRetry={profileVerif.refetch} /></div>
          ) : !profileVerif.data ? null : (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text)]">Email Address</span>
                <div className="flex items-center gap-1.5">
                  <span className={"text-sm font-semibold " + (profileVerif.data.emailVerified ? "text-green-600" : "text-amber-500")}>
                    {profileVerif.data.emailVerified ? "Verified" : "Not Verified"}
                  </span>
                  {profileVerif.data.emailVerified && <CheckCircle size={15} className="text-green-600" />}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text)]">Contact Number</span>
                <div className="flex items-center gap-1.5">
                  <span className={"text-sm font-semibold " + (profileVerif.data.contactVerified ? "text-green-600" : "text-amber-500")}>
                    {profileVerif.data.contactVerified ? "Verified" : "Not Verified"}
                  </span>
                  {profileVerif.data.contactVerified && <CheckCircle size={15} className="text-green-600" />}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Safety */}
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
          <h3 className="font-semibold text-[var(--heading)]">Safety First, Always</h3>
          <div className="mt-4 space-y-3">
            {[
              { icon: ShieldCheck, label: "Verified Drivers", desc: "All our drivers are verified and trusted" },
              { icon: MapPin, label: "Live Trip Tracking", desc: "Share your trip with family and friends" },
              { icon: Phone, label: "Emergency Support", desc: "24/7 support for any travel assistance" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-light)]">
                  <item.icon size={15} className="text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--heading)]">{item.label}</p>
                  <p className="text-xs text-[var(--text-light)]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   Page Entry Point
===================================================================== */

export default function OverviewPage() {
  const user = useCurrentUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    );
  }

  return user.role === "ROLE_RIDER" ? (
    <RiderDashboard user={user} />
  ) : (
    <PassengerDashboard user={user} />
  );
}
