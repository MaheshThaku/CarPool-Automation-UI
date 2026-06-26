import Container from '@/components/ui/Container';

import {
  AlertTriangle,
  Car,
  MapPin,
  Phone,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

const guidelines = [
  {
    icon: UserCheck,
    title: 'Verify Profiles',
    description:
      'Review driver and passenger profiles before confirming a ride request.',
  },
  {
    icon: Car,
    title: 'Confirm Vehicle Details',
    description:
      'Match vehicle information with the details displayed on the platform.',
  },
  {
    icon: MapPin,
    title: 'Meet In Public Locations',
    description:
      'Choose safe and well-lit pickup and drop-off points whenever possible.',
  },
  {
    icon: Phone,
    title: 'Share Trip Information',
    description:
      'Inform a trusted friend or family member about your travel plans.',
  },
  {
    icon: ShieldCheck,
    title: 'Follow Safety Practices',
    description:
      'Use verified accounts and follow platform guidelines for secure travel.',
  },
  {
    icon: AlertTriangle,
    title: 'Report Suspicious Activity',
    description:
      'Immediately report any inappropriate behavior or safety concerns.',
  },
];

export default function SafetyGuidelines() {
  return (
    <section className="bg-[var(--surface)] py-20">
      <Container>
        {/* Header */}

        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mt-5 text-3xl font-bold text-[var(--heading)] md:text-5xl">
            Best Practices For Safe Travel
          </h2>

          <p className="mt-5 text-lg leading-8 text-[var(--text)]">
            Following these simple safety recommendations helps create a safer
            ride-sharing experience for drivers and passengers across the
            ShareFare community.
          </p>
        </div>

        {/* Cards */}

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {guidelines.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-light)] transition-all duration-300 group-hover:bg-[var(--primary)]">
                  <Icon
                    size={24}
                    className="text-[var(--primary)] transition-colors duration-300 group-hover:text-white"
                  />
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

        {/* Bottom Trust Box */}

        <div className="mt-14 rounded-3xl border border-[var(--border)] bg-[var(--background)] p-8 text-center">
          <h3 className="text-2xl font-semibold text-[var(--heading)]">
            Travel Smart. Travel Responsibly.
          </h3>

          <p className="mx-auto mt-4 max-w-3xl leading-8 text-[var(--text)]">
            Safety is a shared responsibility. By following recommended travel
            practices and using verified profiles, every member helps strengthen
            the ShareFare community.
          </p>
        </div>
      </Container>
    </section>
  );
}
