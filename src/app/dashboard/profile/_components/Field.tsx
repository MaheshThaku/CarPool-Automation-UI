import { cn } from "@/lib/cn";

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldProps {
  label: string;
  value: string;
  editing: boolean;
  icon?: React.ElementType;
  type?: string;
  name: string;
  onChange: (name: string, val: string) => void;
  readOnly?: boolean;
  badge?: React.ReactNode;
  options?: FieldOption[];
  min?: string;
  max?: string;
  error?: string;
}

export default function Field({
  label, value, editing, icon: Icon, type = "text", name, onChange, readOnly, badge, options, min, max, error,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[var(--text-light)]">{label}</label>
      <div className="relative flex items-center">
        {Icon && (
          <div className="pointer-events-none absolute left-3 flex h-full items-center">
            <Icon size={15} className="text-[var(--text-light)]" />
          </div>
        )}
        {editing && !readOnly ? (
          options ? (
            <select
              name={name}
              value={value}
              onChange={(e) => onChange(name, e.target.value)}
              className={cn(
                "w-full rounded-xl border border-[var(--border)] bg-white py-2.5 pr-3 text-sm text-[var(--heading)] outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20",
                Icon ? "pl-9" : "pl-3"
              )}
            >
              {options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              name={name}
              value={value}
              min={min}
              max={max}
              onChange={(e) => onChange(name, e.target.value)}
              className={cn(
                "w-full rounded-xl border bg-white py-2.5 pr-3 text-sm text-[var(--heading)] outline-none transition-all focus:ring-2",
                error
                  ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                  : "border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--primary)]/20",
                Icon ? "pl-9" : "pl-3"
              )}
            />
          )
        ) : (
          <div
            className={cn(
              "flex w-full items-center rounded-xl border border-[var(--border)] bg-gray-50 py-2.5 pr-3 text-sm",
              Icon ? "pl-9" : "pl-3"
            )}
          >
            <span className={value ? "text-[var(--heading)]" : "text-[var(--text-light)]"}>
              {value || "—"}
            </span>
            {badge && <span className="ml-auto">{badge}</span>}
          </div>
        )}
      </div>
      {error && editing && !readOnly && (
        <p className="text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}
