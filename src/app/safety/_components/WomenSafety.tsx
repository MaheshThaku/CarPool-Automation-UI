import Container from '@/components/ui/Container';

import { BadgeCheck, ShieldCheck, UserCheck, Users } from 'lucide-react';

const safetyPoints = [
  {
    icon: UserCheck,
    title: 'Verified Profiles',
    description:
      'Passengers and drivers complete profile verification before accessing ride-sharing features.',
  },
  {
    icon: BadgeCheck,
    title: 'Document Validation',
    description:
      'Driving licenses and vehicle documents are reviewed before approval.',
  },
  {
    icon: ShieldCheck,
    title: 'Safer Ride Matching',
    description:
      'Verified users help create a more secure and trustworthy travel experience.',
  },
  {
    icon: Users,
    title: 'Responsible Community',
    description:
      'Transparency and accountability encourage respectful interactions.',
  },
];

export default function WomenSafety() {
  return (
    <section className="bg-[var(--surface)] py-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          {/* Left Content */}

          <div>
            <h2 className="mt-5 text-3xl font-bold text-[var(--heading)] md:text-5xl">
              Creating A Safer Travel Experience
            </h2>

            <p className="mt-6 text-lg leading-8 text-[var(--text)]">
              ShareFare promotes safe ride sharing through profile verification,
              document validation and responsible community participation. We
              encourage users to review profiles carefully and travel with
              confidence.
            </p>

            <div className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
              <h3 className="text-lg font-semibold text-[var(--heading)]">
                Our Commitment
              </h3>

              <p className="mt-3 leading-7 text-[var(--text)]">
                We continuously improve platform security, verification
                standards and trust-building measures to support safe travel for
                all users.
              </p>
            </div>
          </div>

          {/* Right Grid */}

          <div className="grid gap-5 sm:grid-cols-2">
            {safetyPoints.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-light)]">
                    <Icon size={22} className="text-[var(--primary)]" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-[var(--heading)]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[var(--text-light)]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
