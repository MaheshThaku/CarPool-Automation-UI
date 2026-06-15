import Container from '@/components/ui/Container';

const stats = [
  {
    value: '500K+',
    label: 'Verified Travelers',
  },
  {
    value: '50K+',
    label: 'Monthly Trips',
  },
  {
    value: '4.9★',
    label: 'Community Rating',
  },
  {
    value: '100+',
    label: 'Popular Routes',
  },
];

export default function AboutStats() {
  return (
    <section className="bg-[var(--background)] py-24">
      <Container>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center"
            >
              <h3 className="text-5xl font-bold text-[var(--primary)]">
                {item.value}
              </h3>

              <p className="mt-3 text-[var(--text)]">{item.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
