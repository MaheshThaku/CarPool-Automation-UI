import Container from '@/components/ui/Container';

export default function CookiesHero() {
  return (
    <section className="page-hero-bg pt-20 pb-10">
      <Container>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="mt-8 text-5xl font-bold text-[var(--heading)] md:text-6xl">
            Cookies <span className="text-[var(--primary)]"> Policy</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[var(--text)]">
            Learn how ShareFare uses cookies and similar technologies to improve
            website performance, enhance user experience and provide secure
            ride-sharing services.
          </p>
        </div>
      </Container>
    </section>
  );
}
