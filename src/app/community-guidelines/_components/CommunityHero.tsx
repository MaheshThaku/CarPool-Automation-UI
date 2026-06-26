import Container from '@/components/ui/Container';

export default function CommunityHero() {
  return (
    <section className="page-hero-bg pt-20 pb-10">
      <Container>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="mt-8 text-5xl font-bold text-[var(--heading)] md:text-6xl">
            Building A Trusted
            <span className="block text-[var(--primary)]">
              Ride Sharing Community
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[var(--text)]">
            Our community guidelines help create a safe, respectful and
            trustworthy environment for passengers and drivers using ShareFare.
          </p>
        </div>
      </Container>
    </section>
  );
}
