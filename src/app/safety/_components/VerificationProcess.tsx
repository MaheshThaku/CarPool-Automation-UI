import Container from '@/components/ui/Container';

import { BadgeCheck, CheckCircle, FileCheck, UserPlus } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Create Account',
    description:
      'Register your account and complete your basic profile information.',
  },
  {
    icon: FileCheck,
    title: 'Upload Documents',
    description:
      'Submit required verification documents including driving license and vehicle information.',
  },
  {
    icon: BadgeCheck,
    title: 'Verification Review',
    description:
      'Our team reviews submitted documents to ensure authenticity and compliance.',
  },
  {
    icon: CheckCircle,
    title: 'Start Sharing Rides',
    description:
      'Once approved, you can safely offer rides and connect with verified passengers.',
  },
];

export default function VerificationProcess() {
  return (
    <section className="bg-[var(--background)] py-20">
      <Container>
        {/* Section Header */}

        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mt-5 text-3xl font-bold text-[var(--heading)] md:text-5xl">
            How Verification Works
          </h2>

          <p className="mt-5 text-lg leading-8 text-[var(--text)]">
            Our verification process helps maintain a trusted ride-sharing
            community by ensuring that drivers and passengers meet platform
            standards before participating in rides.
          </p>
        </div>

        {/* Timeline */}

        <div className="relative mt-16">
          {/* Desktop Line */}

          <div className="absolute top-10 left-0 hidden h-[2px] w-full bg-[var(--border)] lg:block" />

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="relative rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-lg"
                >
                  {/* Step Number */}

                  <div className="absolute -top-4 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white">
                    {index + 1}
                  </div>

                  {/* Icon */}

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-light)]">
                    <Icon size={26} className="text-[var(--primary)]" />
                  </div>

                  {/* Content */}

                  <h3 className="mt-5 text-xl font-semibold text-[var(--heading)]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[var(--text-light)]">
                    {step.description}
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
