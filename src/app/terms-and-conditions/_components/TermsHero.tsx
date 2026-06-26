import Container from '@/components/ui/Container';

export default function TermsHero() {
  return (
    <section className="page-hero-bg pt-20 pb-10">
      <Container>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="mt-8 text-5xl font-bold text-[var(--heading)] md:text-6xl">
            Terms <span className="text-[var(--primary)]"> & Conditions</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[var(--text)]">
            Please read these Terms & Conditions carefully before using
            ShareFare. By accessing our platform, you agree to comply with these
            terms.
          </p>
        </div>
      </Container>
    </section>
  );
}
