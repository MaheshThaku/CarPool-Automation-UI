import { Minus, Plus } from "lucide-react";

interface SeatPickerProps {
  value: number;
  onChange: (n: number) => void;
}

export default function SeatPicker({ value, onChange }: SeatPickerProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[var(--heading)]">
        Total Seats <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-white text-[var(--heading)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] active:scale-95"
        >
          <Minus size={16} />
        </button>

        <div className="flex flex-1 items-center justify-center gap-1.5">
          {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                n === value
                  ? "bg-[var(--primary)] text-white shadow-md"
                  : n <= value
                  ? "bg-[var(--primary-light)] text-[var(--primary)]"
                  : "border border-[var(--border)] bg-white text-[var(--text-light)]"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onChange(Math.min(8, value + 1))}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-white text-[var(--heading)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] active:scale-95"
        >
          <Plus size={16} />
        </button>
      </div>
      <p className="text-xs text-[var(--text-light)]">Maximum 8 seats per ride</p>
    </div>
  );
}
