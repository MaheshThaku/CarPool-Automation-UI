import Container from '@/components/ui/Container';

export default function AboutMission() {
  return (
    <section className="bg-[var(--surface)] py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl border border-[var(--border)] p-8">
            <h2 className="text-3xl font-bold text-[var(--heading)]">
              <span className="block text-[var(--primary)]">Our Mission</span>
            </h2>

            <p className="mt-5 leading-8 text-[var(--text)]">
              To make everyday and intercity travel affordable, accessible and
              secure through trusted ride sharing.
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--border)] p-8">
            <h2 className="text-3xl font-bold text-[var(--heading)]">
              <span className="block text-[var(--primary)]">Our Vision</span>
            </h2>

            <p className="mt-5 leading-8 text-[var(--text)]">
              To become India&apos;s most trusted ride sharing community while
              contributing to sustainable transportation and reduced traffic
              congestion.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
