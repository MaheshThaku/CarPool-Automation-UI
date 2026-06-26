import Container from '@/components/ui/Container';
import Link from 'next/link';

export default function SafetyHero() {
  return (
    <section className="page-hero-bg pt-32 pb-24">
      {/* Background Gradient */}

      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-light)] via-[var(--background)] to-[var(--primary-light)]" />

      {/* Top Left Highlight */}

      <div
        className="absolute -top-20 -left-20 h-72 w-72 rounded-full opacity-60"
        style={{
          background:
            'radial-gradient(circle, var(--primary-light) 0%, transparent 75%)',
        }}
      />

      {/* Bottom Right Highlight */}

      <div
        className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full opacity-60"
        style={{
          background:
            'radial-gradient(circle, var(--primary-light) 0%, transparent 75%)',
        }}
      />

      {/* Subtle Grid */}

      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--heading)_1px,transparent_1px),linear-gradient(to_bottom,var(--heading)_1px,transparent_1px)] bg-[size:80px_80px] opacity-[0.03]" />
      <Container>
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          {/* Heading */}
          <h1 className="mt-8 text-5xl leading-tight font-bold text-[var(--heading)] md:text-6xl lg:text-7xl">
            Your Safety Is
            <span className="block text-[var(--primary)]">Our Priority</span>
          </h1>

          {/* Description */}

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-[var(--text)] md:text-xl">
            ShareFare is committed to creating a safe and trusted ride-sharing
            platform through identity verification, document validation,
            community accountability and secure ride matching.
          </p>

          {/* Trust Stats */}

          <div className="mt-16 grid gap-5 sm:grid-cols-3">
            {[
              {
                value: '100%',
                label: 'Document Verification',
              },
              {
                value: '24/7',
                label: 'Safety Support',
              },
              {
                value: 'Secure',
                label: 'Ride Matching',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
              >
                <h3 className="text-3xl font-bold text-[var(--primary)]">
                  {item.value}
                </h3>

                <p className="mt-2 text-sm text-[var(--text-light)]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
