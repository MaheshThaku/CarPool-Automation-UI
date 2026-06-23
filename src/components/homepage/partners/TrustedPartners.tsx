import Container from '@/components/ui/Container';
import { trustedBrands } from './trustedBrands';

export default function TrustedPartners() {
  const brands = [...trustedBrands, ...trustedBrands];

  return (
    <section
      className="relative overflow-hidden bg-[var(--background)] py-8 md:py-10 lg:py-10"
    >
      <Container>
        {/* Heading */}

        <div
          className="mb-10 text-center"
        >
          <span
            className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--primary)]"
          >
            Trusted Platform
          </span>

          <h2
            className="mt-4 text-2xl font-bold text-[var(--heading)] sm:text-3xl lg:text-4xl"
          >
            Trusted & Verified By
          </h2>

          <p
            className="mx-auto mt-3 max-w-2xl text-sm text-[var(--text)] sm:text-base"
          >
            Secure partnerships and integrations
            helping thousands of travellers ride
            safely across India.
          </p>
        </div>

        {/* Slider */}

        <div className="relative">
          {/* Left Fade */}

          <div
            className="absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[var(--background)] to-transparent lg:w-32"
          />

          {/* Right Fade */}

          <div
            className="absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[var(--background)] to-transparent lg:w-32"
          />

          <div className="partner-slider">
            <div className="partner-track">
              {brands.map((brand, index) => (
                <div
                  key={`${brand}-${index}`}
                  className="flex h-20 min-w-[180px] items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 text-sm font-semibold text-[var(--heading)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-xl hover:text-[var(--primary)] lg:min-w-[220px] lg:text-base"
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
