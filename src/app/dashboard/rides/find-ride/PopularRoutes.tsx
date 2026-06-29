'use client';

import { ArrowRight } from 'lucide-react';
import { POPULAR_ROUTES } from './popularRoutes.data';

interface Props {
  onSelectRoute: (source: string, destination: string) => void;
}

export default function PopularRoutes({ onSelectRoute }: Props) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-[var(--heading)]">
        Popular Routes
      </h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {POPULAR_ROUTES.map((route) => (
          <button
            key={`${route.source}-${route.destination}`}
            type="button"
            onClick={() => {
              console.log(route.source, route.destination);

              onSelectRoute(route.source, route.destination);
            }}
            className="group flex h-14 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-white text-sm font-medium text-[var(--heading)] transition-all duration-300 hover:border-[var(--primary)] hover:bg-[var(--primary-light)]"
          >
            <span>{route.source}</span>

            <ArrowRight
              size={14}
              className="text-[var(--primary)] transition-transform duration-300 group-hover:translate-x-1"
            />

            <span>{route.destination}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
