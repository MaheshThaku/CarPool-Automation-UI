'use client';

/**
 * RiderStats
 *
 * Three KPI cards: Total Rides, Upcoming Rides, and Verification Status.
 *
 * The verification status is driven by `overallVerificationStatus` from the
 * authoritative store (GET /v1/rider/document/verification/status), NOT the
 * lighter stats endpoint — so the status stays in sync with the Profile
 * Readiness card above it.
 */

import { memo } from 'react';
import Link from 'next/link';
import { Car, CalendarCheck, ShieldCheck, ShieldAlert, ArrowRight } from 'lucide-react';

interface Props {
  totalRides: number;
  scheduledRides: number;
  /**
   * The overallVerificationStatus from RiderVerificationStatusResponse.
   * Pass undefined while the store is still loading.
   */
  overallVerificationStatus?: 'VERIFIED' | 'PENDING' | string | null;
}

function RiderStatsComponent({
  totalRides,
  scheduledRides,
  overallVerificationStatus,
}: Props) {
  const isVerified = overallVerificationStatus === 'VERIFIED';

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* ── Total Rides ──────────────────────────────── */}
      <div className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-[var(--primary)]/30">
        {/* Subtle background accent */}
        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[var(--primary-light)] opacity-60 transition-all group-hover:scale-125" />

        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-light)]">
              Total Rides
            </p>
            <h3 className="mt-2 text-4xl font-extrabold text-[var(--heading)]">
              {totalRides}
            </h3>
            <p className="mt-1 text-xs text-[var(--text-light)]">All time</p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-light)]">
            <Car size={22} className="text-[var(--primary)]" />
          </div>
        </div>
      </div>

      {/* ── Upcoming Rides ───────────────────────────── */}
      <div className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-[var(--primary)]/30">
        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[var(--primary-light)] opacity-60 transition-all group-hover:scale-125" />

        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-light)]">
              Upcoming Rides
            </p>
            <h3 className="mt-2 text-4xl font-extrabold text-[var(--heading)]">
              {scheduledRides}
            </h3>
            <p className="mt-1 text-xs text-[var(--text-light)]">Next 7 days</p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-light)]">
            <CalendarCheck size={22} className="text-[var(--primary)]" />
          </div>
        </div>
      </div>

      {/* ── Verification Status ──────────────────────── */}
      {isVerified ? (
        /* VERIFIED — clean green success card */
        <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-emerald-100 opacity-70" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                Verification Status
              </p>
              <h3 className="mt-2 text-2xl font-extrabold text-emerald-700">
                Verified ✓
              </h3>
              <p className="mt-1 text-xs text-emerald-600 font-medium">
                You&apos;re cleared to publish rides
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
              <ShieldCheck size={22} className="text-emerald-600" />
            </div>
          </div>
        </div>
      ) : (
        /* PENDING — amber CTA card */
        <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm">
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-amber-100 opacity-70" />

          <div className="relative flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                Verification Status
              </p>
              <h3 className="mt-2 text-2xl font-extrabold text-amber-700">
                Pending
              </h3>
              <Link
                href="/dashboard/documents"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:underline"
              >
                Complete verification <ArrowRight size={12} />
              </Link>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100">
              <ShieldAlert size={22} className="text-amber-600" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const RiderStats = memo(RiderStatsComponent);

export default RiderStats;
