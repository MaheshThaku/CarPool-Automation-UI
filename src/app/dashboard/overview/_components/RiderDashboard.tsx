import Link from "next/link";
import {
  Car, CalendarDays, Shield, ArrowRight, Clock, MoreVertical,
  CheckCircle, ChevronRight, Plus, FileText,
} from "lucide-react";

import StatsCard from "@/components/dashboard/StatsCard";
import { CurrentUser } from "@/hooks/useCurrentUser";
import { useAsyncData } from "@/hooks/useAsyncData";
import { dashboardService } from "@/services/dashboard.service";
import { documentTypeLabel } from "@/lib/constants";

import { docStatusLabel, formatDisplayName, getGreeting, parseDeparture } from "./overviewUtils";
import { CircularProgress, EmptyState, SectionError, Skeleton, StatsCardSkeleton } from "./Primitives";

interface RiderDashboardProps {
  user: CurrentUser;
}

export default function RiderDashboard({ user }: RiderDashboardProps) {
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
                        <span className="text-sm font-medium text-[var(--heading)]">{documentTypeLabel(item.documentType)}</span>
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
