import Container from '@/components/ui/Container';

import ContactInfo from './ContactInfo';
import ContactForm from './ContactForm';

export default function ContactSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--background)] py-20">
      {/* Background Gradient */}

      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-light)] via-[var(--background)] to-[var(--primary-light)]" />

      {/* Top Left Highlight */}

      <div
        className="absolute -top-20 -left-20 h-72 w-72 rounded-full opacity-60"
        style={{
          background:
            'radial-gradient(circle, var(--primary-light) 0%, transparent 75%)',
        }}
      />

      {/* Bottom Right Highlight */}

      <div
        className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full opacity-60"
        style={{
          background:
            'radial-gradient(circle, var(--primary-light) 0%, transparent 75%)',
        }}
      />

      {/* Subtle Grid */}

      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--heading)_1px,transparent_1px),linear-gradient(to_bottom,var(--heading)_1px,transparent_1px)] bg-[size:80px_80px] opacity-[0.03]" />

      <Container>
        <div className="relative z-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <ContactInfo />

          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
