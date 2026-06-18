import { AlertCircle, RefreshCw } from "lucide-react";

interface SectionErrorProps {
  message: string;
  onRetry?: () => void;
}

export default function SectionError({ message, onRetry }: SectionErrorProps) {
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
