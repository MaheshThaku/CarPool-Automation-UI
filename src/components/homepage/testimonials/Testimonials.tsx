import Container from '@/components/ui/Container';

import TestimonialCard from './TestimonialCard';
import { testimonials } from './testimonials.data';

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-[var(--background)] py-20">
      <Container>
        {/* Header */}

        <div className="text-center">
          <h2 className="mt-4 text-3xl font-bold text-[var(--heading)] md:text-4xl">
            Trusted by Thousands of Travelers
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-lg text-[var(--text-light)]">
            Discover why commuters and travelers across India choose ShareFare
            for safe, affordable and verified ride sharing.
          </p>
        </div>

        {/* Cards */}

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {testimonials.map((item) => (
            <div key={item.id} className="min-h-[240px]">
              <TestimonialCard {...item} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
