import { CheckCircle, X } from "lucide-react";

interface SuccessBannerProps {
  message: string;
  onDismiss: () => void;
}

export default function SuccessBanner({ message, onDismiss }: SuccessBannerProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4 text-sm text-green-700">
      <CheckCircle size={16} className="shrink-0" />
      <span className="flex-1">{message}</span>
      <button onClick={onDismiss}><X size={14} /></button>
    </div>
  );
}
