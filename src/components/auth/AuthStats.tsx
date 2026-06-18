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
          className="flex flex-col items-center justify-center rounded-lg bg-white/80 px-3 py-3 sm:px-4 sm:py-4 text-center backdrop-blur-sm shadow-md"
        >
          <Icon size={22} className="mb-2 text-[var(--primary)] sm:size-6" />

          <h3
            className="text-lg font-bold leading-none sm:text-2xl text-[var(--heading)]"
          >
            {value}
          </h3>

          <p
            className="mt-1 text-[10px] sm:text-xs text-[var(--text)]"
          >
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
