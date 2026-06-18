import { AlertCircle } from "lucide-react";

interface InputFieldProps {
  label: string;
  required?: boolean;
  icon?: React.ElementType;
  error?: string;
  children: React.ReactNode;
}

export default function InputField({ label, required, icon: Icon, error, children }: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[var(--heading)]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            <Icon size={16} className="text-[var(--text-light)]" />
          </div>
        )}
        {children}
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}
