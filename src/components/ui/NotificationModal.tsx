'use client';

import { CheckCircle, XCircle } from 'lucide-react';

import Button from './Button';

interface NotificationModalProps {
  open: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
}

export default function NotificationModal({
  open,
  type,
  title,
  message,
  onClose,
}: NotificationModalProps) {
  if (!open) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-2xl">
        <div className="flex justify-center">
          {isSuccess ? (
            <CheckCircle size={72} className="text-green-500" />
          ) : (
            <XCircle size={72} className="text-red-500" />
          )}
        </div>

        <h2 className="mt-5 text-center text-2xl font-bold text-[var(--heading)]">
          {title}
        </h2>

        <p className="mt-3 text-center text-sm leading-6 text-[var(--text)]">
          {message}
        </p>

        <div className="mt-8">
          <Button onClick={onClose}>{isSuccess ? 'Continue' : 'Okay'}</Button>
        </div>
      </div>
    </div>
  );
}
