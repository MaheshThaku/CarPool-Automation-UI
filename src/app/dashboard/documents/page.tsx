'use client';

import { CheckCircle, FileText, Info, ShieldCheck } from "lucide-react";

import { CheckCircle, FileText, Info, ShieldCheck } from "lucide-react";

import { useAsyncData } from "@/hooks/useAsyncData";
import { dashboardService } from "@/services/dashboard.service";
import { VerificationItem } from "@/types/dashboard.types";

import DocumentCard from "./_components/DocumentCard";
import VerificationBanner from "./_components/VerificationBanner";
import { DOC_CATALOGUE } from "./_components/docCatalogue";

export default function DocumentsPage() {
  const { data: verificationItems, loading, refetch } = useAsyncData(
    () => dashboardService.getVerificationStatus()
  );

  // Merge catalogue with API data (if any)
  function getVerificationItem(
    documentType: string,
  ): VerificationItem | undefined {
    return (verificationItems ?? []).find(
      (v) => v.documentType === documentType,
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--heading)]">Documents</h2>
        <p className="mt-1 text-sm text-[var(--text)]">
          Upload and manage your verification documents.
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <Info size={16} className="mt-0.5 shrink-0 text-blue-600" />
        <div className="text-sm text-blue-700">
          <span className="font-semibold">Why verify?</span> Verified riders get
          more bookings, higher trust scores, and are shown first in search
          results.
        </div>
      </div>

      {/* Verification progress */}
      {!loading && <VerificationBanner items={verificationItems ?? []} />}

      {/* Document cards */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse space-y-3 rounded-2xl border border-[var(--border)] bg-white p-5"
            >
              <div className="flex gap-3">
                <div className="h-11 w-11 rounded-xl bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-36 rounded-lg bg-gray-100" />
                  <div className="h-3 w-48 rounded-lg bg-gray-100" />
                </div>
              </div>
              <div className="h-10 rounded-xl bg-gray-100" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {DOC_CATALOGUE.map((config) => (
            <DocumentCard
              key={config.documentType}
              config={config}
              verificationItem={getVerificationItem(config.documentType)}
              onUploaded={refetch}
            />
          ))}
        </div>
      )}

      {/* Guidelines */}
      <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
        <h4 className="font-semibold text-[var(--heading)]">
          Upload Guidelines
        </h4>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              icon: CheckCircle,
              title: 'Clear & Readable',
              desc: 'All text must be clearly visible. Blurry or cropped images will be rejected.',
            },
            {
              icon: ShieldCheck,
              title: 'Valid & Current',
              desc: 'Ensure documents are not expired. Expired documents will not be accepted.',
            },
            {
              icon: FileText,
              title: 'Original Only',
              desc: 'Upload original documents. Edited or tampered files will be rejected.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-start gap-3 rounded-xl bg-gray-50 p-3"
            >
              <Icon
                size={16}
                className="mt-0.5 shrink-0 text-[var(--primary)]"
              />
              <div>
                <p className="text-sm font-semibold text-[var(--heading)]">
                  {title}
                </p>
                <p className="mt-0.5 text-xs text-[var(--text-light)]">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
