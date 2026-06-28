import Image from 'next/image';

import PreAuthTrustBar from './PreAuthTrustBar';
import Logo from '../common/navbar/Logo';
import AuthStats from '../auth/AuthStats';

type Props = {
  title: string;
  subtitle: string;
};

export default function PreAuthHero({ title, subtitle }: Props) {
  return (
    <section className="relative min-h-[700px] overflow-hidden">
      <Image
        src="/images/auth/banner.png"
        alt={title}
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between px-6 py-8 lg:px-16 lg:py-12">
        {/* Brand */}
        <div className="mb-10">
          {/* <div className="px-4 py-3">
            <Logo />
          </div> */}
        </div>

        {/* Main Content */}
        <div>
          <h1 className="max-w-xl text-4xl leading-tight font-bold text-[var(--heading)] md:text-5xl lg:text-6xl">
            Travel Together.
            <br />
            <span className="text-[var(--primary)]">Travel Smarter.</span>
          </h1>

          <div className="mt-5 h-1 w-20 rounded-full bg-[var(--primary)]" />

          <p className="mt-4 mb-4 max-w-xl text-lg leading-relaxed text-[var(--heading)]">
            {subtitle}
          </p>

          <AuthStats />
        </div>

        {/* Bottom Trust Bar */}
        <div className="mt-10">
          <PreAuthTrustBar />
        </div>
      </div>
    </section>
  );
}
