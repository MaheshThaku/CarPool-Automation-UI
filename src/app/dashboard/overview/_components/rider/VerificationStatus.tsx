'use client';

import Link from 'next/link';
import { memo } from 'react';
import {
  CheckCircle2,
  Clock3,
  AlertCircle,
  FileText,
  ArrowRight,
  UploadCloud,
  ShieldCheck,
} from 'lucide-react';

import { RiderVerificationStatusResponse, DocStatus } from '@/types/dashboard.types';
import DashboardCard from '../shared/DashboardCard';

interface Props {
  riderVerification: RiderVerificationStatusResponse | null;
}

const REQUIRED_DOCUMENTS = [
  { key: 'DRIVING_LICENSE', label: 'Driving License', desc: 'Valid Driver License' },
  { key: 'VEHICLE_RC', label: 'Vehicle RC', desc: 'Registration Certificate' },
  { key: 'VEHICLE_INSURANCE', label: 'Vehicle Insurance', desc: 'Comprehensive Insurance Policy' },
  { key: 'GOVT_ID', label: 'Government Photo ID', desc: 'Aadhaar / PAN / Passport' },
] as const;

function getStatusBadgeConfig(status: DocStatus) {
  switch (status) {
    case 'VERIFIED':
      return {
        label: 'Verified',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: CheckCircle2,
      };
    case 'PENDING':
      return {
        label: 'Pending Review',
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: Clock3,
      };
    case 'REJECTED':
      return {
        label: 'Rejected',
        color: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: AlertCircle,
      };
    default:
      return {
        label: 'Not Uploaded',
        color: 'text-gray-600',
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        icon: UploadCloud,
      };
  }
}

function VerificationStatusComponent({ riderVerification }: Props) {
  const isOverallVerified = riderVerification?.overallVerificationStatus === 'VERIFIED';

  const docStatuses = REQUIRED_DOCUMENTS.map((doc) => {
    if (isOverallVerified) {
      return { ...doc, status: 'VERIFIED' as DocStatus };
    }
    const pendingItem = riderVerification?.documents?.find(
      (d) => d.documentType === doc.key,
    );
    return {
      ...doc,
      status: (pendingItem?.verificationStatus ?? 'VERIFIED') as DocStatus,
    };
  });

  const verifiedCount = docStatuses.filter((d) => d.status === 'VERIFIED').length;

  return (
    <DashboardCard className="flex h-full min-h-[420px] flex-col p-6 border border-[var(--border)] bg-white">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-[var(--heading)]">
            Verification Status
          </h3>
          <p className="mt-0.5 text-xs text-[var(--text-light)]">
            Track real-time status of your required rider documents
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isOverallVerified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <ShieldCheck size={13} /> Fully Verified
            </span>
          ) : (
            <span className="rounded-full bg-[var(--primary-light)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
              {verifiedCount} of 4 Verified
            </span>
          )}
        </div>
      </div>

      {/* Required Document List */}
      <div className="flex-1 space-y-3">
        {docStatuses.map((item) => {
          const config = getStatusBadgeConfig(item.status);
          const StatusIcon = config.icon;

          return (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3.5 transition-all hover:border-[var(--primary)]/40 hover:bg-gray-50/50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.bg} ${config.color}`}
                >
                  <FileText size={18} />
                </div>

                <div className="min-w-0">
                  <h4 className="truncate text-sm font-semibold text-gray-900">
                    {item.label}
                  </h4>
                  <p className="truncate text-[11px] text-[var(--text-light)]">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${config.bg} ${config.color} ${config.border}`}
                >
                  <StatusIcon size={12} />
                  <span>{config.label}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Link */}
      <div className="mt-5 border-t border-[var(--border)] pt-4 flex items-center justify-between">
        <p className="text-xs text-[var(--text-light)]">
          Need to update your documents?
        </p>
        <Link
          href="/dashboard/documents"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"
        >
          Manage Documents
          <ArrowRight size={14} />
        </Link>
      </div>
    </DashboardCard>
  );
}

const VerificationStatus = memo(VerificationStatusComponent);

export default VerificationStatus;
