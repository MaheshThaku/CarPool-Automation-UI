import { Eye, EyeOff, Lock } from "lucide-react";

interface PwFieldProps {
  label: string;
  value: string;
  show: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}

export default function PwField({ label, value, show, onToggle, onChange }: PwFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[var(--text-light)]">{label}</label>
      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          <Lock size={15} className="text-[var(--text-light)]" />
        </div>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-xl border border-[var(--border)] bg-white py-2.5 pl-9 pr-10 text-sm text-[var(--heading)] outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
        />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-light)] hover:text-[var(--heading)]">
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}
