import Image from 'next/image';

import Logo from '@/components/common/Logo';

import AuthFeatures from './AuthFeatures';
import AuthStats from './AuthStats';

export default function AuthBanner() {
  return (
    <section
      className="relative flex flex-col overflow-hidden lg:w-1/2 p-5 sm:p-6 lg:p-8 xl:p-10"
    >
      <Image
        src="/images/auth/auth_banner.png"
        alt="Travel Together"
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/5" />

      <div
        className="relative z-10 flex flex-1 flex-col"
      >
        <Logo />

        <div className="mt-4 lg:mt-6 max-w-lg">
          <h1
            className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl text-[var(--heading)]"
          >
            Travel Together.
          </h1>

          <h2
            className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl text-[var(--primary)]"
          >
            Travel Smarter.
          </h2>

          <div className="mt-3 h-1 w-20 bg-[var(--primary)]" />

          <p
            className="mt-4 max-w-md text-sm sm:text-base text-[var(--heading)]"
          >
            Join India&apos;s premium carpooling community
            and experience smarter, safer and more
            affordable journeys.
          </p>
        </div>

        <div className="mt-6 max-w-md">
          <AuthStats />
        </div>

        <div className="mt-auto pt-6">
          <AuthFeatures />
        </div>
      </div>
    </section>
  );
}
