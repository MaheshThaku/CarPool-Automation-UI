import Container from '@/components/ui/Container';

import FAQItem from './FAQItem';

import { faqData } from './faq.data';

export default function FAQ() {
  return (
    <section id="faq" className="bg-[var(--background)] py-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left Side */}

          <div>
            <span className="inline-flex items-center rounded-full bg-[var(--primary)]/10 px-4 py-2 text-sm font-semibold text-[var(--primary)]">
              Frequently Asked Questions
            </span>

            <h2 className="mt-5 text-3xl font-bold text-[var(--heading)] md:text-4xl">
              Got Questions?
            </h2>

            <h2 className="mt-2 text-3xl font-bold text-[var(--primary)] md:text-4xl">
              We Have Answers.
            </h2>

            <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--text-light)]">
              Find answers to the most common questions about rides, safety,
              bookings and payments.
            </p>

            <div className="mt-8 rounded-3xl border border-[var(--primary)]/20 bg-[var(--surface)] p-6">
              <h3 className="text-lg font-semibold text-[var(--heading)]">
                Still Need Help?
              </h3>

              <p className="mt-2 text-sm text-[var(--text-light)]">
                Our support team is available 24/7 to help.
              </p>

              <button className="mt-5 rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-white transition-all hover:bg-[var(--primary-hover)]">
                Contact Support
              </button>
            </div>
          </div>

          {/* Right Side */}

          <div className="space-y-4">
            {faqData.map((faq) => (
              <FAQItem key={faq.question} {...faq} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
