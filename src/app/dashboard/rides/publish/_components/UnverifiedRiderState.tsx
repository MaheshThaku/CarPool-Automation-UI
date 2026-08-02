'use client';

import Link from 'next/link';
import {
  ShieldAlert,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  FileText,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { RiderVerificationStatusResponse, DocStatus } from '@/types/dashboard.types';

interface Props {
  verificationData: RiderVerificationStatusResponse | null;
}

const REQUIRED_DOCUMENTS = [
  { key: 'DRIVING_LICENSE', label: 'Driving License', desc: 'Valid Driver License' },
  { key: 'VEHICLE_RC', label: 'Vehicle RC', desc: 'Registration Certificate' },
  { key: 'VEHICLE_INSURANCE', label: 'Vehicle Insurance', desc: 'Vehicle Insurance Policy' },
  { key: 'GOVT_ID', label: 'Government Photo ID', desc: 'Aadhaar / PAN / Passport' },
] as const;

export default function UnverifiedRiderState({ verificationData }: Props) {
  const emailVerified = verificationData?.emailVerified ?? false;
  const phoneVerified = verificationData?.phoneVerified ?? false;

  const isDocVerified = (docType: string): boolean => {
    if (verificationData?.overallVerificationStatus === 'VERIFIED') return true;
    if (!verificationData) return false;
    const pendingItem = verificationData.documents?.find(
      (d) => d.documentType === docType,
    );
    return !pendingItem;
  };

  const docStatuses = REQUIRED_DOCUMENTS.map((doc) => ({
    ...doc,
    verified: isDocVerified(doc.key),
    status: (verificationData?.documents?.find((d) => d.documentType === doc.key)?.verificationStatus ?? 'VERIFIED') as DocStatus,
  }));

  const verifiedCount =
    (emailVerified ? 1 : 0) +
    (phoneVerified ? 1 : 0) +
    docStatuses.filter((d) => d.verified).length;

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-4">
      {/* Top Banner Alert */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <ShieldAlert size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-gray-900">
                  Rider Verification Incomplete
                </h3>
                <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-800">
                  {verifiedCount} of 6 Verified
                </span>
              </div>
              <p className="mt-1 text-sm text-amber-800">
                You cannot publish a ride until all 6 rider verification steps are verified by our team.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/documents"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-amber-700 active:scale-[0.98]"
          >
            Complete Verification
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Verification Requirements Checklist Grid */}
      <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm space-y-6">
        <div>
          <h4 className="text-lg font-bold text-[var(--heading)]">
            Verification Requirements
          </h4>
          <p className="mt-0.5 text-xs text-[var(--text-light)]">
            Complete the missing steps below to unlock ride publishing.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Email Status */}
          <div
            className={`flex items-center justify-between rounded-xl border p-4 ${
              emailVerified
                ? 'border-emerald-200 bg-emerald-50/40'
                : 'border-amber-200 bg-amber-50/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  emailVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                <Mail size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Email Address</p>
                <p className="text-xs text-[var(--text-light)]">Registered Account Email</p>
              </div>
            </div>
            {emailVerified ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                <CheckCircle2 size={16} /> Verified
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-semibold text-amber-700">
                <Clock3 size={16} /> Pending
              </span>
            )}
          </div>

          {/* Phone Status */}
          <div
            className={`flex items-center justify-between rounded-xl border p-4 ${
              phoneVerified
                ? 'border-emerald-200 bg-emerald-50/40'
                : 'border-amber-200 bg-amber-50/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  phoneVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                <Phone size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Phone Number</p>
                <p className="text-xs text-[var(--text-light)]">Contact Number</p>
              </div>
            </div>
            {phoneVerified ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                <CheckCircle2 size={16} /> Verified
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-semibold text-amber-700">
                <Clock3 size={16} /> Pending
              </span>
            )}
          </div>

          {/* 4 Document Statuses */}
          {docStatuses.map((doc) => (
            <div
              key={doc.key}
              className={`flex items-center justify-between rounded-xl border p-4 ${
                doc.verified
                  ? 'border-emerald-200 bg-emerald-50/40'
                  : 'border-amber-200 bg-amber-50/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    doc.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{doc.label}</p>
                  <p className="text-xs text-[var(--text-light)]">{doc.desc}</p>
                </div>
              </div>
              {doc.verified ? (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 size={16} /> Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-semibold text-amber-700">
                  <Clock3 size={16} /> {doc.status === 'REJECTED' ? 'Rejected' : 'Pending'}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
          <p className="text-xs text-[var(--text-light)]">
            Upload your document files to complete verification.
          </p>
          <Link
            href="/dashboard/documents"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)]"
          >
            Go to Documents
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
