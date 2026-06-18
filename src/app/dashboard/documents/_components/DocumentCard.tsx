"use client";

import { useRef, useState } from "react";
import { AlertCircle, CheckCircle, Clock, RefreshCw, Upload } from "lucide-react";

import { dashboardService } from "@/services/dashboard.service";
import { ApiError } from "@/types/auth.types";
import { DocStatus, VerificationItem } from "@/types/dashboard.types";

import { DocConfig, statusDisplay } from "./docCatalogue";

interface DocumentCardProps {
  config: DocConfig;
  verificationItem?: VerificationItem;
  onUploaded: () => void;
}

export default function DocumentCard({ config, verificationItem, onUploaded }: DocumentCardProps) {
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

    setUploading(true);
    try {
      await dashboardService.uploadDocument(config.documentType, file);
      onUploaded();
    } catch (err) {
      setFileError(err instanceof ApiError ? err.message : "Upload failed. Please try again.");
      setLocalFile(null);
    } finally {
      setUploading(false);
    }
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
          <span>Verified successfully. You&apos;re good to go!</span>
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
