import { Car, Star, Users } from 'lucide-react';

const STATS = [
  {
    icon: Users,
    value: '500K+',
    label: 'Verified Riders',
  },
  {
    icon: Car,
    value: '50K+',
    label: 'Monthly Trips',
  },
  {
    icon: Star,
    value: '4.9★',
    label: 'Community Rating',
  },
];

export default function AuthStats() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {STATS.map(({ icon: Icon, value, label }) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center rounded-lg bg-white/80 px-3 py-3 text-center shadow-md backdrop-blur-sm sm:px-4 sm:py-4"
        >
          <Icon size={22} className="mb-2 text-[var(--primary)] sm:size-6" />

          <h3 className="text-lg leading-none font-bold text-[var(--heading)] sm:text-2xl">
            {value}
          </h3>

          <p className="mt-1 text-[10px] text-[var(--text)] sm:text-xs">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
