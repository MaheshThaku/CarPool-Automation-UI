import Container from '@/components/ui/Container';

import SafetyCard from './SafetyCard';
import SafetyHighlight from './SafetyHighlight';

import { safetyFeatures } from './safety.data';

export default function Safety() {
  return (
    <section className="bg-[var(--surface)] py-16">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="mt-4 text-2xl font-bold text-[var(--heading)] md:text-3xl lg:text-4xl">
            Safety You Can Trust
          </h2>

          <p className="mt-3 text-[var(--text-light)]">
            Travel confidently with trusted profiles and built-in safety tools.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-2 lg:grid-cols-2">
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
