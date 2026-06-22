import Container from '@/components/ui/Container';

import SafetyCard from './SafetyCard';
import SafetyHighlight from './SafetyHighlight';

import { safetyFeatures } from './safety.data';

export default function Safety() {
  return (
    <section id="safety" className="bg-[var(--background)] py-20">
      <Container>
        <div className="mb-12">
          <span className="rounded-full bg-[var(--primary)]/10 px-4 py-2 text-sm font-semibold text-[var(--primary)]">
            Safety First
          </span>

          <h2 className="mt-4 text-3xl font-bold text-[var(--heading)] md:text-4xl">
            Travel With Confidence
          </h2>

          <p className="mt-3 max-w-2xl text-[var(--text-light)]">
            Built with safety, trust and transparency at every step of your
            journey.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {safetyFeatures.map((item) => (
              <SafetyCard subtitle={''} key={item.title} {...item} />
            ))}
          </div>

          <SafetyHighlight />
        </div>
      </Container>
    </section>
  );
}
