'use client';

import { useEffect } from 'react';
import { CheckCircle2, X, XCircle } from 'lucide-react';

export type BookingDialogState =
  | { type: 'success'; title: string; message: string }
  | { type: 'error'; title: string; message: string };

type BookingStatusDialogProps = BookingDialogState & {
  onClose: () => void;
};

export default function BookingStatusDialog({
  type,
  title,
  message,
  onClose,
}: BookingStatusDialogProps) {
  const isSuccess = type === 'success';

  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1.5 text-[var(--text-light)] transition-all hover:bg-gray-100 hover:text-[var(--heading)]"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
            isSuccess ? 'bg-green-50' : 'bg-red-50'
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 size={34} className="text-green-600" />
          ) : (
            <XCircle size={34} className="text-red-500" />
          )}
        </div>

        <h3 className="mt-5 text-center text-xl font-bold text-[var(--heading)]">
          {title}
        </h3>

        <p className="mx-auto mt-2 max-w-[260px] text-center text-sm leading-relaxed text-[var(--text)]">
          {message}
        </p>

        <button
          type="button"
          onClick={onClose}
          className={`mt-6 w-full rounded-xl py-3 text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] ${
            isSuccess
              ? 'bg-[var(--primary)] hover:bg-[var(--primary-hover)]'
              : 'bg-[var(--heading)] hover:bg-black'
          }`}
        >
          {isSuccess ? 'Done' : 'Close'}
        </button>
      </div>
    </div>
  );
}
