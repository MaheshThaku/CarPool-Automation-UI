import Image from 'next/image';

import Container from '@/components/ui/Container';

import StatCard from './StatCard';
import { stats } from './stats.data';

export default function StatsSection() {
  return (
    <section className="relative overflow-hidden py-20">
      {/* Background Image */}

      <Image
        src="/images/auth/banner.png"
        alt="Travel Community"
        fill
        className="object-cover"
      />

      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-black/75" />

      {/* Primary Glow */}

      <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/20 via-transparent to-[var(--primary)]/20" />

      <Container>
        <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((item) => (
            <StatCard key={item.label} {...item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
