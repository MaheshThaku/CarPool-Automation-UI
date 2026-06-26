import Container from '@/components/ui/Container';

import StepCard from './StepCard';
import { howItWorksSteps } from './howItWorks.data';

import { ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  return (
    <section className="bg-[var(--background)] py-8 md:py-10 lg:py-10">
      <Container>
        {/* Header */}

        <div className="mb-12 text-center">
          <h2 className="mt-4 text-2xl font-bold text-[var(--heading)] md:text-3xl lg:text-4xl">
            How ShareFare Works
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-light)] md:text-lg">
            Find rides, reserve your seat, travel safely and save money in just
            a few simple steps.
          </p>
        </div>

        {/* Steps */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {howItWorksSteps.map((step, index) => (
            <div key={step.number} className="relative">
              <StepCard {...step} />

              {/* Desktop Connector */}

              {index !== howItWorksSteps.length - 1 && (
                <ArrowRight
                  size={28}
                  className="absolute top-1/2 -right-6 z-10 hidden -translate-y-1/2 text-[var(--primary)] lg:block"
                />
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
