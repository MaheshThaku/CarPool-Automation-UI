import Container from '@/components/ui/Container';

import WhyUsFeature from './WhyUsFeature';
import WomenSafetyCard from './WomenSafetyCard';

import { whyUsFeatures } from './whyUs.data';

export default function WhyUs() {
  return (
    <section id="why-us" className="bg-[var(--background)] py-20">
      <Container>
        <div className="mb-12">
          <span className="rounded-full bg-[var(--primary)]/10 px-4 py-2 text-sm font-semibold text-[var(--primary)]">
            Why Choose Us
          </span>

          <h2 className="mt-4 text-3xl font-bold text-[var(--heading)] md:text-4xl">
            Travel Smarter With ShareFare
          </h2>

          <p className="mt-3 max-w-2xl text-[var(--text-light)]">
            Experience safer, affordable and smarter ride sharing with a trusted
            travel community.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {whyUsFeatures.map((item) => (
              <WhyUsFeature key={item.title} {...item} />
            ))}
          </div>

          <WomenSafetyCard />
        </div>
      </Container>
    </section>
  );
}
