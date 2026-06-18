import { AlertCircle, RefreshCw } from "lucide-react";

export function Skeleton({ className }: { className: string }) {
  return <div className={"animate-pulse rounded-xl bg-gray-100 " + className} />;
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

interface SectionErrorProps {
  message: string;
  onRetry?: () => void;
}

export function SectionError({ message, onRetry }: SectionErrorProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600">
      <AlertCircle size={16} className="shrink-0" />
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="flex items-center gap-1 font-medium hover:underline">
          <RefreshCw size={13} /> Retry
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <Icon size={22} className="text-gray-400" />
      </div>
      <p className="mt-3 font-medium text-[var(--heading)]">{title}</p>
      <p className="mt-1 text-sm text-[var(--text-light)]">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function CircularProgress({ pct }: { pct: number }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" className="shrink-0">
      <circle cx="40" cy="40" r={r} fill="none" stroke="#E5E7EB" strokeWidth="8" />
      <circle
        cx="40" cy="40" r={r} fill="none"
        stroke="#d89a33" strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 40 40)"
      />
      <text x="40" y="45" textAnchor="middle" fontSize="14" fontWeight="700" fill="#111827">
        {pct}%
      </text>
    </svg>
  );
}
