import Container from '@/components/ui/Container';
import Link from 'next/link';

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-[var(--background)] pt-32 pb-24">
      {/* Background Mesh */}

      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-light)] via-[var(--background)] to-[var(--primary-light)]" />

      {/* Top Left Glow */}

      <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-[var(--primary)]/10 blur-[120px]" />

      {/* Bottom Right Glow */}

      <div className="absolute -right-32 -bottom-32 h-[500px] w-[500px] rounded-full bg-[var(--primary)]/10 blur-[120px]" />

      {/* Center Glow */}

      <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--primary)]/5 blur-[100px]" />

      {/* Grid Pattern */}

      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: `
      linear-gradient(
        var(--heading) 1px,
        transparent 1px
      ),
      linear-gradient(
        90deg,
        var(--heading) 1px,
        transparent 1px
      )
    `,
          backgroundSize: '80px 80px',
        }}
      />

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
              className="rounded-2xl bg-[var(--primary)] px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--primary-hover)] hover:shadow-xl"
            >
              Find Ride
            </Link>

            <Link
              href="/offer-ride"
              className="rounded-2xl border border-[var(--border)] bg-white/80 px-8 py-4 font-semibold text-[var(--heading)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-lg"
            >
              Offer Ride
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
