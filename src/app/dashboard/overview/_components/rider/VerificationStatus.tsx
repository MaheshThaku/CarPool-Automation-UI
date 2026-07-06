'use client';

import Link from 'next/link';
import { memo } from 'react';

import {
  BadgeCheck,
  Clock3,
  AlertCircle,
  FileText,
  ArrowRight,
} from 'lucide-react';

import { VerificationItem } from '@/types/dashboard.types';

import DashboardCard from '../shared/DashboardCard';

interface Props {
  items: VerificationItem[];
}

function getStatusConfig(status: string) {
  switch (status) {
    case 'VERIFIED':
      return {
        label: 'Verified',
        color: 'text-green-600',
        bg: 'bg-green-50',
        icon: BadgeCheck,
      };

    case 'PENDING':
      return {
        label: 'Pending',
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        icon: Clock3,
      };

    case 'UNDER_REVIEW':
      return {
        label: 'Under Review',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        icon: Clock3,
      };

    case 'REJECTED':
      return {
        label: 'Rejected',
        color: 'text-red-600',
        bg: 'bg-red-50',
        icon: AlertCircle,
      };

    default:
      return {
        label: 'Not Submitted',
        color: 'text-gray-500',
        bg: 'bg-gray-50',
        icon: AlertCircle,
      };
  }
}

function formatDocumentName(type?: string) {
  if (!type) return 'Document';

  return type
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function VerificationStatusComponent({ items }: Props) {
  return (
    <DashboardCard className="flex h-full min-h-[420px] flex-col">
      {/* Header */}

      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--heading)]">
            Verification Status
          </h3>

          <p className="mt-1 text-sm text-[var(--text-light)]">
            Track all submitted verification documents
          </p>
        </div>

        <span className="rounded-full bg-[var(--primary-light)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
          {items.length} Documents
        </span>
      </div>

      {/* Empty State */}

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] px-6 py-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-light)]">
            <FileText size={28} className="text-[var(--primary)]" />
          </div>

          <h4 className="mt-4 text-lg font-semibold text-[var(--heading)]">
            No Documents Uploaded
          </h4>

          <p className="mt-2 max-w-xs text-sm text-[var(--text-light)]">
            Upload your verification documents to activate rider verification.
          </p>

          <Link
            href="/dashboard/documents"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
          >
            Upload Documents
          </Link>
        </div>
      ) : (
        <>
          {/* Document List */}

          <div className="flex-1 space-y-3">
            {items.map((item, index) => {
              const config = getStatusConfig(item.status);

              const StatusIcon = config.icon;

              return (
                <div
                  key={`${item.documentType}-${index}`}
                  className="flex items-center justify-between rounded-2xl border border-[var(--border)] p-4 transition-colors hover:bg-[var(--primary-light)]/10"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.bg}`}
                    >
                      <FileText size={18} className={config.color} />
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate font-medium text-[var(--heading)]">
                        {formatDocumentName(item.documentType)}
                      </h4>

                      <p className="text-xs text-[var(--text-light)]">
                        Verification Document
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex shrink-0 items-center gap-2 font-semibold ${config.color}`}
                  >
                    <span className="hidden text-sm sm:block">
                      {config.label}
                    </span>

                    <StatusIcon size={18} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}

          <div className="mt-5 border-t border-[var(--border)] pt-4">
            <Link
              href="/dashboard/documents"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"
            >
              View Documents
              <ArrowRight size={16} />
            </Link>
          </div>
        </>
      )}
    </DashboardCard>
  );
}

const VerificationStatus = memo(VerificationStatusComponent);

export default VerificationStatus;
