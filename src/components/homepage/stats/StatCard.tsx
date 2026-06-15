import { LucideIcon } from 'lucide-react';

type Props = {
  icon: LucideIcon;
  value: string;
  label: string;
};

export default function StatCard({ icon: Icon, value, label }: Props) {
  return (
    <div className="group flex flex-col items-center justify-center text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 transition-all duration-300 group-hover:scale-110 group-hover:bg-[var(--primary)]/15">
        <Icon size={30} className="text-[var(--primary)]" />
      </div>

      <h3 className="text-3xl font-bold text-white md:text-4xl">{value}</h3>

      <p className="mt-2 text-sm font-medium text-white/70 md:text-base">
        {label}
      </p>
    </div>
  );
}
