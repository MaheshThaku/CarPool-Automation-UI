'use client';

import { useRef, useState } from 'react';

import { AlertCircle, CheckCircle, Clock, Upload } from 'lucide-react';

import { DocStatus, VerificationItem } from '@/types/dashboard.types';

import { DocConfig, statusDisplay } from './docCatalogue';

interface DocumentCardProps {
  config: DocConfig;
  verificationItem?: VerificationItem;

  selectedFile?: File;

  onFileSelected: (documentType: string, file: File) => void;
}

export default function DocumentCard({
  config,
  verificationItem,
  selectedFile,
  onFileSelected,
}: DocumentCardProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [fileError, setFileError] = useState('');

  const status: DocStatus = verificationItem?.status ?? 'NOT_PROVIDED';

  const sd = statusDisplay(status);

  const StatusIcon = sd.icon;

  const DocIcon = config.icon;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    if (!allowedTypes.includes(file.type)) {
      setFileError('Only JPG, PNG and PDF files are allowed.');

      return;
    }

    if (file.size > config.maxSizeMB * 1024 * 1024) {
      setFileError(`File must be under ${config.maxSizeMB} MB.`);

      return;
    }

    setFileError('');

    onFileSelected(config.documentType, file);
  };

  return (
    <div
      className={`rounded-2xl border ${sd.border} bg-white p-5 transition-all duration-300 hover:shadow-md`}
    >
      {/* Header */}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              status === 'VERIFIED'
                ? 'bg-green-50'
                : status === 'REJECTED'
                  ? 'bg-red-50'
                  : 'bg-[var(--primary-light)]'
            } `}
          >
            <DocIcon
              size={20}
              className={
                status === 'VERIFIED'
                  ? 'text-green-600'
                  : status === 'REJECTED'
                    ? 'text-red-500'
                    : 'text-[var(--primary)]'
              }
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-[var(--heading)]">
                {config.label}
              </h4>

              {config.required && (
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-500">
                  Required
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-[var(--text-light)]">
              {config.description}
            </p>
          </div>
        </div>

        <span
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${sd.chip} `}
        >
          <StatusIcon size={11} />
          {sd.label}
        </span>
      </div>

      {/* Meta */}

      <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-light)]">
        <span>Accepted: {config.acceptedFormats}</span>

        <span>•</span>

        <span>Max {config.maxSizeMB} MB</span>
      </div>

      {/* Rejected */}

      {status === 'REJECTED' && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600">
          <AlertCircle size={13} className="mt-0.5 shrink-0" />

          <span>Document was rejected. Please upload a clearer copy.</span>
        </div>
      )}

      {/* Pending */}

      {status === 'PENDING' && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-700">
          <Clock size={13} className="mt-0.5 shrink-0" />

          <span>Under review. Usually takes 24–48 hours.</span>
        </div>
      )}

      {/* Verified */}

      {status === 'VERIFIED' && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-xs text-green-700">
          <CheckCircle size={13} />

          <span>Verified successfully.</span>
        </div>
      )}

      {/* Select File */}

      {status !== 'VERIFIED' && (
        <div className="mt-4">
          {selectedFile ? (
            <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-3">
              <div className="flex min-w-0 items-center gap-2">
                <CheckCircle size={15} className="text-green-600" />

                <p className="truncate text-xs font-medium text-green-700">
                  {selectedFile.name}
                </p>
              </div>

              <span className="text-[10px] font-semibold text-green-600">
                Selected
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--border)] bg-gray-50 py-3 text-sm font-medium text-[var(--text)] transition-all hover:border-[var(--primary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
            >
              <Upload size={15} />
              Select File
            </button>
          )}

          {fileError && (
            <p className="mt-2 text-xs text-red-500">{fileError}</p>
          )}

          <input
            ref={fileRef}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}
