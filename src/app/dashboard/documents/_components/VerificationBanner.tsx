'use client';

import { memo, useMemo } from 'react';
import { ShieldCheck } from 'lucide-react';

import { VerificationItem } from '@/types/dashboard.types';

import { DOC_CATALOGUE } from './docCatalogue';

interface VerificationBannerProps {
  items: VerificationItem[];
}

function VerificationBannerComponent({ items }: VerificationBannerProps) {
  const { percentage, completed, verified, total } = useMemo(() => {
    const requiredDocs = DOC_CATALOGUE.filter((doc) => doc.required);

    const total = requiredDocs.length;

    const verified = items.filter(
      (item) =>
        item.status === 'VERIFIED' &&
        requiredDocs.some((doc) => doc.documentType === item.documentType),
    ).length;

    const percentage = total > 0 ? Math.round((verified / total) * 100) : 0;

    return {
      total,
      verified,
      percentage,
      completed: verified >= total,
    };
  }, [items]);

  return (
    <section
      className={`rounded-3xl border p-5 lg:p-6 ${
        completed
          ? 'border-green-200 bg-green-50'
          : 'border-[var(--border)] bg-white'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
            completed ? 'bg-green-100' : 'bg-[var(--primary-light)]'
          }`}
        >
          <ShieldCheck
            size={22}
            className={completed ? 'text-green-600' : 'text-[var(--primary)]'}
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-[var(--heading)]">
                {completed
                  ? 'Verification Complete'
                  : 'Complete Your Verification'}
              </h2>

              <p className="mt-1 text-sm text-[var(--text-light)]">
                {completed
                  ? 'All required documents have been verified.'
                  : `${verified} of ${total} required documents verified.`}
              </p>
            </div>

            <span className="text-lg font-bold text-[var(--primary)]">
              {percentage}%
            </span>
          </div>

          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                completed ? 'bg-green-500' : 'bg-[var(--primary)]'
              }`}
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const VerificationBanner = memo(VerificationBannerComponent);

export default VerificationBanner;
