'use client';

import { memo } from 'react';

import { CheckCircle, Clock3, AlertCircle, FileCheck } from 'lucide-react';

import { VerificationItem } from '@/types/dashboard.types';

import DashboardCard from '../shared/DashboardCard';

interface Props {
  items: VerificationItem[];
}

function VerificationStatusComponent({ items }: Props) {
  const totalDocs = items.length;

  const verifiedDocs = items.filter(
    (item) => item.status === 'VERIFIED',
  ).length;

  const pendingDocs = items.filter((item) => item.status === 'PENDING').length;

  const rejectedDocs = items.filter(
    (item) => item.status === 'REJECTED',
  ).length;

  const overallStatus =
    rejectedDocs > 0
      ? 'REJECTED'
      : pendingDocs > 0
        ? 'PENDING'
        : verifiedDocs === totalDocs && totalDocs > 0
          ? 'VERIFIED'
          : 'NOT_PROVIDED';

  const statusColor =
    overallStatus === 'VERIFIED'
      ? 'text-green-600'
      : overallStatus === 'PENDING'
        ? 'text-amber-600'
        : overallStatus === 'REJECTED'
          ? 'text-red-600'
          : 'text-gray-500';

  const StatusIcon =
    overallStatus === 'VERIFIED'
      ? CheckCircle
      : overallStatus === 'PENDING'
        ? Clock3
        : AlertCircle;

  const title =
    overallStatus === 'VERIFIED'
      ? 'Verified'
      : overallStatus === 'PENDING'
        ? 'Pending'
        : overallStatus === 'REJECTED'
          ? 'Rejected'
          : 'Not Submitted';

  const subtitle =
    overallStatus === 'VERIFIED'
      ? 'All documents approved'
      : overallStatus === 'PENDING'
        ? `${pendingDocs} document(s) under review`
        : overallStatus === 'REJECTED'
          ? `${rejectedDocs} document(s) rejected`
          : 'Upload documents to verify';

  return (
    <DashboardCard className="h-full">
      <div className="flex h-full items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-light)]">
            <FileCheck size={24} className="text-[var(--primary)]" />
          </div>

          <div>
            <p className="text-sm text-[var(--text-light)]">
              Verification Status
            </p>

            <h3 className={`mt-1 text-2xl font-bold ${statusColor}`}>
              {title}
            </h3>

            <p className="text-sm text-[var(--text-light)]">{subtitle}</p>
          </div>
        </div>

        <StatusIcon size={28} className={statusColor} />
      </div>
    </DashboardCard>
  );
}

const VerificationStatus = memo(VerificationStatusComponent);

export default VerificationStatus;
