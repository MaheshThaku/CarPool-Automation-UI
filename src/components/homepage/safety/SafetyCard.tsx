import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  icon: LucideIcon;
}

export default function SafetyCard({
  title,
  icon: Icon,
}: Props) {
  return (
    <div
      className="group flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-md"
    >
      <div
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 transition-all group-hover:bg-[var(--primary)]"
      >
        <Icon
          size={20}
          className="text-[var(--primary)] group-hover:text-white"
        />
      </div>

      <h3
        className="text-xs font-semibold text-[var(--heading)] md:text-sm"
      >
        {title}
      </h3>
    </div>
  );
}