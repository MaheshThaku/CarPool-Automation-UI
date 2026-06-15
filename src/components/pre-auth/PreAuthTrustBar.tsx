import { ShieldCheck, Headphones, Users, HeartHandshake } from 'lucide-react';

export default function PreAuthTrustBar() {
  const items = [
    {
      icon: ShieldCheck,
      label: 'Secure Travel',
    },
    {
      icon: Users,
      label: 'Verified Community',
    },
    {
      icon: HeartHandshake,
      label: 'Women Friendly',
    },
    {
      icon: Headphones,
      label: '24/7 Support',
    },
  ];

  return (
    <div className="mt-10 grid grid-cols-2 gap-4 rounded-3xl bg-black/75 p-6 backdrop-blur-xl lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div key={item.label} className="text-center">
            <Icon size={28} className="mx-auto mb-3 text-[var(--primary)]" />

            <p className="text-sm font-medium text-white">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
}
