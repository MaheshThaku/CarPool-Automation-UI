import Container from '@/components/ui/Container';
import Link from 'next/link';

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-[var(--background)] pt-32 pb-24">
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
            Making Travel
            <span className="block text-[var(--primary)]">More Affordable</span>
            Safe & Connected
          </h1>

          {/* Description */}

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-[var(--text)] md:text-xl">
            ShareFare is building India&apos;s trusted ride-sharing ecosystem
            where verified travelers and drivers connect safely, reduce travel
            costs, promote sustainable mobility and create smarter journeys for
            everyone.
          </p>

          {/* CTA Buttons */}

          <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/find-ride"
              className="rounded-2xl bg-[var(--primary)] px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-[var(--primary-hover)] hover:shadow-lg"
            >
              Find Ride
            </Link>

            <Link
              href="/offer-ride"
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-8 py-4 font-semibold text-[var(--heading)] transition-all duration-300 hover:border-[var(--primary)] hover:shadow-lg"
            >
              Offer Ride
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
