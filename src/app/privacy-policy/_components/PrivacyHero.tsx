import Container from '@/components/ui/Container';

export default function PrivacyHero() {
  return (
    <section className="page-hero-bg pt-20 pb-10">
      <Container>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="mt-8 text-5xl font-bold text-[var(--heading)] md:text-6xl">
            Privacy
            <span className="text-[var(--primary)]"> Policy</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[var(--text)]">
            Learn how ShareFare collects, uses and protects your information
            while providing a safe and trusted ride-sharing experience.
          </p>
        </div>
      </Container>
    </section>
  );
}
