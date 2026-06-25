'use client';

import { Upload, Loader2 } from 'lucide-react';

interface Props {
  selectedCount: number;
  uploading: boolean;
  onUpload: () => void;
}

export default function UploadDocumentsBar({
  selectedCount,
  uploading,
  onUpload,
}: Props) {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky bottom-6 z-30 mt-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left Content */}

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary-light)]">
              <Upload size={22} className="text-[var(--primary)]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-[var(--heading)]">
                  Documents Ready
                </h4>

                <span className="rounded-full bg-[var(--primary-light)] px-2.5 py-1 text-xs font-semibold text-[var(--primary)]">
                  {selectedCount}
                </span>
              </div>

              <p className="mt-1 text-sm text-[var(--text-light)]">
                {selectedCount} document
                {selectedCount > 1 ? 's' : ''} selected and ready for upload.
              </p>
            </div>
          </div>

          {/* Upload Button */}

          <button
            type="button"
            disabled={uploading}
            onClick={onUpload}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-[var(--primary-hover)] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload Selected Documents
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
