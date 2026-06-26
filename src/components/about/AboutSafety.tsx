import Container from '@/components/ui/Container';

export default function AboutSafety() {
  return (
    <section className="bg-[var(--surface)] py-24">
      <Container>
        <div className="rounded-[40px] border border-[var(--border)] bg-[var(--primary-light)] p-10 lg:p-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mt-6 text-4xl font-bold text-[var(--heading)]">
              Building Safer Travel Experiences
            </h2>

            <p className="mt-6 text-lg leading-8 text-[var(--text)]">
              Safety is at the heart of everything we do. ShareFare is committed
              to creating a trusted ride sharing ecosystem through verified
              profiles, transparent reviews, secure communication and community
              accountability.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              'Verified Profiles',
              'Women Friendly Travel',
              'Trusted Reviews',
              'Support Assistance',
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-white p-6 text-center shadow-sm"
              >
                <p className="font-semibold text-[var(--heading)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
