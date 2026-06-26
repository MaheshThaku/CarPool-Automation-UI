import Container from '@/components/ui/Container';

import { BadgeCheck, FileCheck, Shield, Users } from 'lucide-react';

const safetyFeatures = [
  {
    icon: BadgeCheck,
    title: 'Identity Verification',
    description:
      'Every user is required to complete profile verification before accessing ride-sharing features, helping build a trusted community.',
  },
  {
    icon: FileCheck,
    title: 'Document Verification',
    description:
      'Driving licenses, vehicle registration certificates and insurance documents are reviewed before approval.',
  },
  {
    icon: Shield,
    title: 'Secure Ride Matching',
    description:
      'ShareFare connects verified passengers and drivers, creating safer and more reliable ride-sharing experiences.',
  },
  {
    icon: Users,
    title: 'Community Trust',
    description:
      'Profile transparency and responsible behavior help create a trustworthy environment for everyone.',
  },
];

export default function SafetyFeatures() {
  return (
    <section className="bg-[var(--background)] py-20">
      <Container>
        {/* Section Header */}

        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mt-5 text-3xl font-bold text-[var(--heading)] md:text-5xl">
            Built Around Trust & Security
          </h2>

          <p className="mt-5 text-lg leading-8 text-[var(--text)]">
            Our safety measures are designed to create a trusted ride-sharing
            platform where passengers and drivers can travel with confidence.
          </p>
        </div>

        {/* Feature Cards */}

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {safetyFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-light)] transition-all duration-300 group-hover:bg-[var(--primary)]">
                  <Icon
                    size={26}
                    className="text-[var(--primary)] transition-colors duration-300 group-hover:text-white"
                  />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-[var(--heading)]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[var(--text-light)]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
