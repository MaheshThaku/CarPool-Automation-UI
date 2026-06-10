import { LucideIcon, CheckCircle } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle: string;
  valueColor?: "default" | "green";
  verified?: boolean;
}

export default function StatsCard({
  icon: Icon,
  title,
  value,
  subtitle,
  valueColor = "default",
  verified = false,
}: StatsCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm">
      <div className="relative shrink-0">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-light)]">
          <Icon size={26} className="text-[var(--primary)]" />
        </div>
        {verified && (
          <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5">
            <CheckCircle size={16} className="fill-green-100 text-green-600" />
          </div>
        )}
      </div>
      <div>
        <p className="text-xs text-[var(--text-light)]">{title}</p>
        <p
          className={`text-2xl font-bold ${
            valueColor === "green" ? "text-green-600" : "text-[var(--heading)]"
          }`}
        >
          {value}
        </p>
        <p className="text-xs text-[var(--text-light)]">{subtitle}</p>
      </div>
    </div>
  );
}
