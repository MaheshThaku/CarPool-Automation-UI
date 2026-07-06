// app/dashboard/overview/_components/shared/SectionError.tsx

'use client';

import { memo } from 'react';

import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  message: string;
  onRetry?: () => void;
}

function SectionErrorComponent({ message, onRetry }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
      <AlertCircle size={16} className="shrink-0" />

      <span className="flex-1">{message}</span>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-1 font-medium transition hover:opacity-80"
        >
          <RefreshCw size={13} />
          Retry
        </button>
      )}
    </div>
  );
}

const SectionError = memo(SectionErrorComponent);

export default SectionError;
