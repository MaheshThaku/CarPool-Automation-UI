import Link from 'next/link';

import Container from '@/components/ui/Container';

import RouteCard from './RouteCard';
import { routes } from './routes.data';

import { ArrowRight } from 'lucide-react';

export default function PopularRoutes() {
  return (
    <section id="routes" className="bg-[var(--background)] py-16">
      <Container>
        {/* <div className="mb-8 flex items-center"> */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-[var(--heading)] md:text-3xl">
            Popular Routes
          </h2>

          <p className="mt-2 text-[var(--text-light)]">
            Discover the most travelled routes.
          </p>
        </div>

        {/* <Link
            href="/routes"
            className="hidden items-center gap-2 text-sm font-semibold text-[var(--primary)] md:flex"
          >
            View All Routes
            <ArrowRight size={16} />
          </Link> */}
        {/* </div> */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {routes.map((route) => (
            <RouteCard key={route.id} {...route} />
          ))}
        </div>
      </Container>
    </section>
  );
}
