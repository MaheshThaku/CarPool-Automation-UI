import Link from 'next/link';

export default function FooterCTA() {
  return (
    <div className="relative overflow-hidden rounded-[32px] bg-[var(--primary)] px-6 py-10 shadow-[0_20px_60px_rgba(216,154,51,0.25)] lg:px-12 lg:py-12">
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />

      <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/10" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Ready To Travel Smarter?
          </h2>

          <p className="mt-3 max-w-xl text-white/90">
            Join thousands of verified travelers and experience affordable, safe
            and sustainable ride sharing.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/find-ride"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-[var(--heading)] transition-all duration-300 hover:scale-105"
          >
            Find Ride
          </Link>

          <Link
            href="/offer-ride"
            className="rounded-xl border border-white px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-[var(--heading)]"
          >
            Offer Ride
          </Link>
        </div>
      </div>
    </div>
  );
}
