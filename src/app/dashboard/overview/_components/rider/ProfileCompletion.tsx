'use client';

import { memo } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  FileCheck2,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

import DashboardCard from '../shared/DashboardCard';
import { RiderVerificationStatusResponse } from '@/types/dashboard.types';

interface Props {
  riderVerification: RiderVerificationStatusResponse | null;
  hasVehicle: boolean;
}

function ProfileCompletionComponent({ riderVerification, hasVehicle }: Props) {
  const isOverallVerified = riderVerification?.overallVerificationStatus === 'VERIFIED';
  const emailVerified = riderVerification?.emailVerified ?? false;
  const phoneVerified = riderVerification?.phoneVerified ?? false;

  // Helper to determine if a specific document type is verified
  const isDocVerified = (docType: string): boolean => {
    if (isOverallVerified) return true;
    if (!riderVerification) return false;
    const pendingItem = riderVerification.documents?.find(
      (d) => d.documentType === docType,
    );
    return !pendingItem;
  };

  const licenseVerified = isDocVerified('DRIVING_LICENSE');
  const rcVerified = isDocVerified('VEHICLE_RC');
  const insuranceVerified = isDocVerified('VEHICLE_INSURANCE');
  const govtIdVerified = isDocVerified('GOVT_ID');

  const verifiedDocsCount = [
    licenseVerified,
    rcVerified,
    insuranceVerified,
    govtIdVerified,
  ].filter(Boolean).length;

  // 6 Total Verification Criteria: Email (1) + Phone (1) + 4 Documents (4)
  const completedTasksCount =
    (emailVerified ? 1 : 0) + (phoneVerified ? 1 : 0) + verifiedDocsCount;
  const totalTasks = 6;
  const percentage = Math.round((completedTasksCount / totalTasks) * 100);

  const identityVerified = licenseVerified && govtIdVerified;
  const vehicleDocVerified = rcVerified && insuranceVerified;

  return (
    <DashboardCard className="overflow-hidden border border-[var(--border)] bg-white p-6 shadow-sm">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h3 className="text-xl font-bold text-[var(--heading)]">
                Profile Readiness
              </h3>
              {isOverallVerified ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  <ShieldCheck size={14} className="text-emerald-600" /> Verified Rider
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                  <ShieldAlert size={14} className="text-amber-600" /> Verification Pending
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-light)]">
              Complete your account & document verification requirements to publish rides.
            </p>
          </div>

          {/* Badge & Percentage */}
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-[var(--primary-light)] px-3.5 py-1.5 text-xs font-semibold text-[var(--primary)]">
              {completedTasksCount} of {totalTasks} criteria verified
            </div>
            <div className="text-right">
              <p className="text-3xl font-extrabold text-[var(--heading)]">
                {percentage}%
              </p>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-light)]">
                Completed
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-amber-500 transition-all duration-700 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Interactive Steps Grid */}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {/* Criterion 1: Email Address */}
          <div
            className={`flex flex-col justify-between rounded-xl border p-4 transition-all ${
              emailVerified
                ? 'border-emerald-200 bg-emerald-50/40'
                : 'border-amber-200 bg-amber-50/40'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    emailVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Email Address</p>
                  <p
                    className={`text-[11px] font-medium ${
                      emailVerified ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {emailVerified ? 'Email Verified' : 'Pending Email'}
                  </p>
                </div>
              </div>
              {emailVerified ? (
                <CheckCircle2 size={18} className="text-emerald-600" />
              ) : (
                <Clock3 size={18} className="text-amber-600" />
              )}
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100 text-[11px]">
              {emailVerified ? (
                <span className="text-emerald-800 font-medium">✓ Registered & Active</span>
              ) : (
                <span className="text-amber-800 font-medium">Action Required</span>
              )}
            </div>
          </div>

          {/* Criterion 2: Phone Number */}
          <div
            className={`flex flex-col justify-between rounded-xl border p-4 transition-all ${
              phoneVerified
                ? 'border-emerald-200 bg-emerald-50/40'
                : 'border-amber-200 bg-amber-50/40'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    phoneVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Phone Number</p>
                  <p
                    className={`text-[11px] font-medium ${
                      phoneVerified ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {phoneVerified ? 'Phone Verified' : 'Pending Phone'}
                  </p>
                </div>
              </div>
              {phoneVerified ? (
                <CheckCircle2 size={18} className="text-emerald-600" />
              ) : (
                <Clock3 size={18} className="text-amber-600" />
              )}
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100 text-[11px]">
              {phoneVerified ? (
                <span className="text-emerald-800 font-medium">✓ Contact Confirmed</span>
              ) : (
                <span className="text-amber-800 font-medium">Action Required</span>
              )}
            </div>
          </div>

          {/* Criterion 3: Identity Verification */}
          <div
            className={`flex flex-col justify-between rounded-xl border p-4 transition-all ${
              identityVerified
                ? 'border-emerald-200 bg-emerald-50/40'
                : 'border-amber-200 bg-amber-50/40'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    identityVerified
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <FileCheck2 size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Identity Docs</p>
                  <p
                    className={`text-[11px] font-medium ${
                      identityVerified ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {licenseVerified && govtIdVerified
                      ? 'License & ID Verified'
                      : `${[licenseVerified, govtIdVerified].filter(Boolean).length}/2 Verified`}
                  </p>
                </div>
              </div>
              {identityVerified ? (
                <CheckCircle2 size={18} className="text-emerald-600" />
              ) : (
                <Clock3 size={18} className="text-amber-600" />
              )}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2 text-[11px]">
              <span className="text-gray-500 font-medium">License & Govt ID</span>
              <Link
                href="/dashboard/documents"
                className="flex items-center gap-1 font-semibold text-(--primary) hover:underline"
              >
                Upload <ArrowRight size={11} />
              </Link>
            </div>
          </div>

          {/* Criterion 4: Vehicle Verification */}
          <div
            className={`flex flex-col justify-between rounded-xl border p-4 transition-all ${
              vehicleDocVerified
                ? 'border-emerald-200 bg-emerald-50/40'
                : 'border-amber-200 bg-amber-50/40'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    vehicleDocVerified
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Vehicle Docs</p>
                  <p
                    className={`text-[11px] font-medium ${
                      vehicleDocVerified ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {rcVerified && insuranceVerified
                      ? 'RC & Insurance Verified'
                      : `${[rcVerified, insuranceVerified].filter(Boolean).length}/2 Verified`}
                  </p>
                </div>
              </div>
              {vehicleDocVerified ? (
                <CheckCircle2 size={18} className="text-emerald-600" />
              ) : (
                <Clock3 size={18} className="text-amber-600" />
              )}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2 text-[11px]">
              <span className="text-gray-500 font-medium">RC & Insurance</span>
              <Link
                href="/dashboard/documents"
                className="flex items-center gap-1 font-semibold text-(--primary) hover:underline"
              >
                Upload <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}

const ProfileCompletion = memo(ProfileCompletionComponent);

export default ProfileCompletion;
