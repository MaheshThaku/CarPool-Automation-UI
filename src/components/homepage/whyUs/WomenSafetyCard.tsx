import { ShieldCheck, PhoneCall, Siren, BadgeCheck } from 'lucide-react';

const points = [
  {
    icon: ShieldCheck,
    label: 'Women Friendly Badge',
  },
  {
    icon: PhoneCall,
    label: 'Emergency Contacts',
  },
  {
    icon: Siren,
    label: 'SOS Alert',
  },
  {
    icon: BadgeCheck,
    label: 'Verified Profiles',
  },
];

export default function WomenSafetyCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[var(--primary)]/20 bg-gradient-to-br from-[var(--surface)] to-[var(--background)] p-8 transition-all duration-300 hover:shadow-xl">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--primary)]/10">
        <ShieldCheck size={40} className="text-[var(--primary)]" />
      </div>

      <h3 className="text-2xl font-bold text-[var(--heading)]">
        Women Safety First
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-[var(--text-light)]">
        Dedicated safety features and verified community standards help create a
        secure travel experience for women riders.
      </p>

      <div className="mt-8 space-y-4">
        {points.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10">
                <Icon size={18} className="text-[var(--primary)]" />
              </div>

              <span className="font-medium text-[var(--heading)]">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <button className="mt-8 rounded-xl border border-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary)] transition-all duration-300 hover:bg-[var(--primary)] hover:text-white">
        Learn More →
      </button>
    </div>
  );
}
