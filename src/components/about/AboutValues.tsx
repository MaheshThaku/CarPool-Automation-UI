import Container from '@/components/ui/Container';

import { ShieldCheck, HeartHandshake, Users, Leaf } from 'lucide-react';

const values = [
  {
    icon: ShieldCheck,
    title: 'Safety First',
    description:
      'We prioritize traveler safety through profile verification, trusted reviews and secure ride interactions.',
  },
  {
    icon: HeartHandshake,
    title: 'Trust & Transparency',
    description:
      'Every journey is built on trust, transparency and a reliable community experience.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description:
      'We connect people travelling in the same direction to create meaningful and affordable travel experiences.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Travel',
    description:
      'By sharing rides we help reduce traffic congestion, fuel consumption and carbon emissions.',
  },
];

export default function AboutValues() {
  return (
    <section className="bg-[var(--background)] py-24">
      <Container>
        <div className="text-center">
          <span className="inline-flex rounded-full bg-[var(--primary-light)] px-4 py-2 text-sm font-semibold text-[var(--primary)]">
            Our Core Values
          </span>

          <h2 className="mt-4 text-4xl font-bold text-[var(--heading)]">
            What Drives ShareFare
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {values.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[var(--primary)] hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-light)]">
                  <Icon size={32} className="text-[var(--primary)]" />
                </div>

                <h3 className="mt-6 text-xl font-bold text-[var(--heading)]">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-[var(--text)]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
