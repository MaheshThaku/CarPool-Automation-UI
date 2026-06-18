import Link from "next/link";
import {
  CalendarDays, ShieldCheck, ArrowRight, Clock,
  CheckCircle, MapPin, Phone, ArrowLeftRight,
} from "lucide-react";

import StatsCard from "@/components/dashboard/StatsCard";
import { CurrentUser } from "@/hooks/useCurrentUser";
import { useAsyncData } from "@/hooks/useAsyncData";
import { dashboardService } from "@/services/dashboard.service";

import { formatDisplayName, getGreeting, parseDeparture } from "./overviewUtils";
import { EmptyState, SectionError, Skeleton, StatsCardSkeleton } from "./Primitives";

interface PassengerDashboardProps {
  user: CurrentUser;
}

export default function PassengerDashboard({ user }: PassengerDashboardProps) {
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
                // Note: the backend doesn't return the ride's departure time on
                // this endpoint, only when the booking was made.
                const dt = parseDeparture(trip.bookingTime);
                return (
                  <div key={trip.bookingId} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
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
                        <span className="flex items-center gap-1"><Clock size={11} />Booked {dt.time}</span>
                        <span>• {trip.seatsBooked} Seat{trip.seatsBooked !== 1 ? "s" : ""} Booked</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white">
                          {trip.driverName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-[var(--text)]">Driver: {trip.driverName}</span>
                        <span className={"rounded-full px-2 py-0.5 text-[10px] font-semibold " + (trip.status === "APPROVED" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700")}>
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
                // Note: the backend doesn't return the ride's departure time on
                // this endpoint, only when the booking was made.
                const dt = parseDeparture(booking.bookingTime);
                return (
                  <div key={booking.bookingId} className="flex items-center gap-4 rounded-xl border border-[var(--border)] p-3">
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
                        Booked {dt.date} {dt.month} {new Date(booking.bookingTime).getFullYear()} {String.fromCharCode(8226)} {dt.time}
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
