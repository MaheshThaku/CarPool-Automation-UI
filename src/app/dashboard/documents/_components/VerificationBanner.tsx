'use client';

/**
 * VerificationBanner
 *
 * Shown at the top of the Documents page.  Displays:
 *   • A progress bar for the 4 required documents.
 *   • Small chips for email verification and phone verification status.
 *
 * Accepts both the legacy `items` prop (VerificationItem[] from /all endpoint)
 * for the document progress bar, and the richer `riderVerificationStatus`
 * (from the shared store) for the email/phone indicators.
 */

import { memo, useMemo } from 'react';
import { ShieldCheck, CheckCircle2, Clock3, Mail, Phone } from 'lucide-react';

import { RiderVerificationStatusResponse, VerificationItem } from '@/types/dashboard.types';
import { DOC_CATALOGUE } from './docCatalogue';

interface VerificationBannerProps {
  /** Legacy per-document items (from /v1/rider/document/all). */
  items: VerificationItem[];
  /** Full status response from the shared store — used for email/phone chips. */
  riderVerificationStatus?: RiderVerificationStatusResponse | null;
}

function VerificationBannerComponent({
  items,
  riderVerificationStatus,
}: VerificationBannerProps) {
  const { percentage, verified, total, completed } = useMemo(() => {
    const requiredDocs = DOC_CATALOGUE.filter((doc) => doc.required);
    const total = requiredDocs.length;
    const verified = items.filter(
      (item) =>
        item.status === 'VERIFIED' &&
        requiredDocs.some((doc) => doc.documentType === item.documentType),
    ).length;
    const percentage = total > 0 ? Math.round((verified / total) * 100) : 0;
    return { total, verified, percentage, completed: verified >= total };
  }, [items]);

  const emailVerified = riderVerificationStatus?.emailVerified ?? false;
  const phoneVerified = riderVerificationStatus?.phoneVerified ?? false;

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
          {/* Title + percentage */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-[var(--heading)]">
                {completed ? 'Document Verification Complete' : 'Complete Your Document Verification'}
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

          {/* Progress bar */}
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                completed ? 'bg-green-500' : 'bg-[var(--primary)]'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Email & Phone verification chips */}
          {riderVerificationStatus !== undefined && (
            <div className="mt-4 flex flex-wrap gap-2">
              {/* Email chip */}
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                  emailVerified
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-amber-200 bg-amber-50 text-amber-700'
                }`}
              >
                <Mail size={12} />
                {emailVerified ? (
                  <><CheckCircle2 size={12} /> Email Verified</>
                ) : (
                  <><Clock3 size={12} /> Email Pending</>
                )}
              </span>

              {/* Phone chip */}
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                  phoneVerified
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-amber-200 bg-amber-50 text-amber-700'
                }`}
              >
                <Phone size={12} />
                {phoneVerified ? (
                  <><CheckCircle2 size={12} /> Phone Verified</>
                ) : (
                  <><Clock3 size={12} /> Phone Pending</>
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const VerificationBanner = memo(VerificationBannerComponent);

export default VerificationBanner;
