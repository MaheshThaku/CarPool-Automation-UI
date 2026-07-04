'use client';

import { memo } from 'react';

interface Props {
  greeting: string;
  name: string;
}

function PassengerHeroComponent({ name }: Props) {
  return (
    <section>
      <h1 className="mt-1 text-3xl font-bold text-[var(--heading)]">
        Welcome Back, {name}
      </h1>

      <p className="mt-2 text-base text-[var(--text)]">
        Book rides, travel together and save more
      </p>
    </section>
  );
}

const PassengerHero = memo(PassengerHeroComponent);

export default PassengerHero;
