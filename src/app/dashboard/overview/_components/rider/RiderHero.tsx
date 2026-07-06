'use client';

import { memo } from 'react';

interface Props {
  greeting: string;
  name: string;
}

function RiderHeroComponent({ name }: Props) {
  return (
    <section>
      <h1 className="mt-1 text-3xl font-bold text-[var(--heading)]">
        Welcome Back, {name}
      </h1>

      <p className="mt-2 text-base text-[var(--text)]">
        Ready to share your next journey?
      </p>
    </section>
  );
}

const RiderHero = memo(RiderHeroComponent);

export default RiderHero;
