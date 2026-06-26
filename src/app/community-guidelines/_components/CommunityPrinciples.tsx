import Container from '@/components/ui/Container';

import { Handshake, ShieldCheck, Users, BadgeCheck } from 'lucide-react';

const principles = [
  {
    icon: ShieldCheck,
    title: 'Safety First',
    description:
      'Prioritize personal safety and follow all platform safety recommendations.',
  },
  {
    icon: Users,
    title: 'Respect Everyone',
    description:
      'Treat all passengers and drivers with courtesy, professionalism and respect.',
  },
  {
    icon: BadgeCheck,
    title: 'Be Honest',
    description:
      'Provide accurate profile information, vehicle details and ride information.',
  },
  {
    icon: Handshake,
    title: 'Build Trust',
    description:
      'Contribute positively to the community and help maintain a reliable platform.',
  },
];

export default function CommunityPrinciples() {
  return (
    <section className="bg-[var(--background)] py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-[var(--heading)] md:text-5xl">
            Our Community Principles
          </h2>

          <p className="mt-5 text-lg leading-8 text-[var(--text)]">
            Every member contributes to making ShareFare a safe and trusted
            ride-sharing platform.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {principles.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-light)]">
                  <Icon size={24} className="text-[var(--primary)]" />
                </div>

                <h3 className="mt-5 text-xl font-semibold text-[var(--heading)]">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[var(--text-light)]">
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
