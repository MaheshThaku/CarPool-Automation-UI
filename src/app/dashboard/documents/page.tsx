"use client";

import { useRef, useState } from "react";
import {
  FileText, Upload, CheckCircle, Clock, XCircle,
  AlertCircle, ShieldCheck, Car, CreditCard, RefreshCw,
  Info, ChevronRight,
} from "lucide-react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { dashboardService } from "@/services/dashboard.service";
import { DocStatus, VerificationItem } from "@/types/dashboard.types";

/* =====================================================================
   Types
===================================================================== */

interface DocConfig {
  documentType: string;
  label: string;
  description: string;
  icon: React.ElementType;
  required: boolean;
  acceptedFormats: string;
  maxSizeMB: number;
}

/* =====================================================================
   Document catalogue — shown whether or not API returns data
===================================================================== */

const DOC_CATALOGUE: DocConfig[] = [
  {
    documentType: "DRIVING_LICENSE",
    label: "Driving License",
    description: "Valid driving license issued by the government. Must be current and not expired.",
    icon: CreditCard,
    required: true,
    acceptedFormats: "JPG, PNG, PDF",
    maxSizeMB: 5,
  },
  {
    documentType: "VEHICLE_RC",
    label: "Vehicle Registration (RC)",
    description: "Registration certificate of the vehicle you'll use for rides.",
    icon: Car,
    required: true,
    acceptedFormats: "JPG, PNG, PDF",
    maxSizeMB: 5,
  },
  {
    documentType: "VEHICLE_INSURANCE",
    label: "Vehicle Insurance",
    description: "Valid comprehensive insurance policy for your vehicle.",
    icon: ShieldCheck,
    required: true,
    acceptedFormats: "JPG, PNG, PDF",
    maxSizeMB: 5,
  },
  {
    documentType: "GOVT_ID",
    label: "Government ID",
    description: "Aadhaar card, PAN card, or passport for identity verification.",
    icon: FileText,
    required: false,
    acceptedFormats: "JPG, PNG, PDF",
    maxSizeMB: 5,
  },
];

/* =====================================================================
   Utilities
===================================================================== */

function statusDisplay(status: DocStatus) {
  switch (status) {
    case "VERIFIED":
      return {
        label: "Verified",
        icon: CheckCircle,
        chip: "bg-green-50 text-green-700",
        border: "border-green-200",
        iconColor: "text-green-600",
      };
    case "PENDING":
      return {
        label: "Under Review",
        icon: Clock,
        chip: "bg-amber-50 text-amber-700",
        border: "border-amber-200",
        iconColor: "text-amber-500",
      };
    case "REJECTED":
      return {
        label: "Rejected",
        icon: XCircle,
        chip: "bg-red-50 text-red-600",
        border: "border-red-200",
        iconColor: "text-red-500",
      };
    default:
      return {
        label: "Not Uploaded",
        icon: Upload,
        chip: "bg-gray-100 text-gray-600",
        border: "border-[var(--border)]",
        iconColor: "text-gray-400",
      };
  }
}

/* =====================================================================
   Individual Document Card
===================================================================== */

function DocumentCard({
  config,
  verificationItem,
}: {
  config: DocConfig;
  verificationItem?: VerificationItem;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const status: DocStatus = verificationItem?.status ?? "NOT_PROVIDED";
  const sd = statusDisplay(status);
  const StatusIcon = sd.icon;
  const DocIcon = config.icon;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > config.maxSizeMB * 1024 * 1024) {
      setFileError(`File must be under ${config.maxSizeMB} MB.`);
      return;
    }
    setFileError("");
    setLocalFile(file);

    // Placeholder: actual upload will call POST /v1/rider/document/upload when available
    setUploading(true);
    await new Promise((r) => setTimeout(r, 1200)); // simulate
    setUploading(false);
    // Once API exists, call: await documentService.uploadDocument(config.documentType, file);
  };

  return (
    <div className={`rounded-2xl border ${sd.border} bg-white p-5 transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between gap-3">
        {/* Icon + info */}
        <div className="flex items-start gap-3">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${status === "VERIFIED" ? "bg-green-50" : status === "REJECTED" ? "bg-red-50" : "bg-[var(--primary-light)]"}`}>
            <DocIcon size={20} className={status === "VERIFIED" ? "text-green-600" : status === "REJECTED" ? "text-red-500" : "text-[var(--primary)]"} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-[var(--heading)]">{config.label}</h4>
              {config.required && (
                <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-500">Required</span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-[var(--text-light)]">{config.description}</p>
          </div>
        </div>

        {/* Status chip */}
        <span className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${sd.chip}`}>
          <StatusIcon size={11} />
          {sd.label}
        </span>
      </div>

      {/* Accepted formats */}
      <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-light)]">
        <span>Accepted: {config.acceptedFormats}</span>
        <span>•</span>
        <span>Max {config.maxSizeMB} MB</span>
      </div>

      {/* Rejection reason placeholder */}
      {status === "REJECTED" && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600">
          <AlertCircle size={13} className="mt-0.5 shrink-0" />
          <span>Document was rejected. Please re-upload a clearer copy with all details visible.</span>
        </div>
      )}

      {/* Under review note */}
      {status === "PENDING" && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-700">
          <Clock size={13} className="mt-0.5 shrink-0" />
          <span>Your document is under review. This usually takes 24–48 hours.</span>
        </div>
      )}

      {/* Verified note */}
      {status === "VERIFIED" && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-xs text-green-700">
          <CheckCircle size={13} className="shrink-0" />
          <span>Verified successfully. You're good to go!</span>
        </div>
      )}

      {/* Upload area */}
      {status !== "VERIFIED" && (
        <div className="mt-4">
          {localFile && uploading ? (
            <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-gray-50 p-3">
              <RefreshCw size={16} className="animate-spin text-[var(--primary)]" />
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-medium text-[var(--heading)]">{localFile.name}</p>
                <p className="text-[10px] text-[var(--text-light)]">Uploading…</p>
              </div>
            </div>
          ) : localFile && !uploading ? (
            <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-3">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle size={15} className="shrink-0 text-green-600" />
                <p className="truncate text-xs font-medium text-green-700">{localFile.name}</p>
              </div>
              <span className="ml-2 shrink-0 text-[10px] text-green-600 font-medium">Uploaded</span>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--border)] bg-gray-50 py-3 text-sm font-medium text-[var(--text)] transition-all hover:border-[var(--primary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
            >
              <Upload size={15} className="transition-transform group-hover:-translate-y-0.5" />
              {status === "REJECTED" ? "Re-upload Document" : "Upload Document"}
            </button>
          )}
          {fileError && <p className="mt-1.5 text-xs text-red-500">{fileError}</p>}
          <input
            ref={fileRef}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      )}
    </div>
  );
}

/* =====================================================================
   Progress Banner
===================================================================== */

function VerificationBanner({ items }: { items: VerificationItem[] }) {
  const total = DOC_CATALOGUE.filter((d) => d.required).length;
  const verified = items.filter(
    (i) => i.status === "VERIFIED" && DOC_CATALOGUE.find((d) => d.documentType === i.documentType)
  ).length;
  const pct = total > 0 ? Math.round((verified / total) * 100) : 0;
  const allDone = verified >= total;

  return (
    <div className={`rounded-2xl p-5 ${allDone ? "bg-green-50 border border-green-200" : "border border-[var(--border)] bg-white"}`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${allDone ? "bg-green-100" : "bg-[var(--primary-light)]"}`}>
          <ShieldCheck size={20} className={allDone ? "text-green-600" : "text-[var(--primary)]"} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-[var(--heading)]">
            {allDone ? "Fully Verified!" : "Complete Your Verification"}
          </h3>
          <p className="text-xs text-[var(--text-light)]">
            {allDone
              ? "All required documents verified. Passengers trust you more now."
              : `${verified} of ${total} required documents verified`}
          </p>
        </div>
        {!allDone && (
          <span className="text-lg font-bold text-[var(--primary)]">{pct}%</span>
        )}
      </div>
      {!allDone && (
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}

/* =====================================================================
   Page
===================================================================== */

export default function DocumentsPage() {
  const { data: verificationItems, loading } = useAsyncData(
    () => dashboardService.getVerificationStatus()
  );

  // Merge catalogue with API data (if any)
  function getVerificationItem(documentType: string): VerificationItem | undefined {
    return (verificationItems ?? []).find((v) => v.documentType === documentType);
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
          <span className="font-semibold">Why verify?</span> Verified riders get more bookings, higher trust scores, and are shown first in search results.
        </div>
      </div>

      {/* Verification progress */}
      {!loading && <VerificationBanner items={verificationItems ?? []} />}

      {/* Document cards */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-[var(--border)] bg-white p-5 space-y-3">
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
            />
          ))}
        </div>
      )}

      {/* Guidelines */}
      <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
        <h4 className="font-semibold text-[var(--heading)]">Upload Guidelines</h4>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { icon: CheckCircle, title: "Clear & Readable", desc: "All text must be clearly visible. Blurry or cropped images will be rejected." },
            { icon: ShieldCheck, title: "Valid & Current", desc: "Ensure documents are not expired. Expired documents will not be accepted." },
            { icon: FileText, title: "Original Only", desc: "Upload original documents. Edited or tampered files will be rejected." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
              <Icon size={16} className="mt-0.5 shrink-0 text-[var(--primary)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--heading)]">{title}</p>
                <p className="mt-0.5 text-xs text-[var(--text-light)]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
