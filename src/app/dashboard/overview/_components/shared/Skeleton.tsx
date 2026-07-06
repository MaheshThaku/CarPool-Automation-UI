'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

export function Skeleton({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-gray-100 ${className}`} />
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm">
      <Skeleton className="h-14 w-14 rounded-2xl" />

      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-10" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}
