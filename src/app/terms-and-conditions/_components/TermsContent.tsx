import Container from '@/components/ui/Container';

const sections = [
  {
    title: 'Acceptance Of Terms',
    content:
      'By accessing or using ShareFare, you agree to be bound by these Terms & Conditions and all applicable laws and regulations.',
  },
  {
    title: 'Eligibility',
    content:
      'Users must provide accurate information during registration and meet applicable legal requirements to use the platform.',
  },
  {
    title: 'User Accounts',
    content:
      'You are responsible for maintaining the confidentiality of your account credentials and for all activities conducted through your account.',
  },
  {
    title: 'Ride Sharing Services',
    content:
      'ShareFare acts as a platform that connects passengers and drivers. We do not own, operate or control vehicles listed on the platform.',
  },
  {
    title: 'Verification Requirements',
    content:
      'Drivers may be required to submit identification, driving licenses, vehicle registration and insurance documents for verification purposes.',
  },
  {
    title: 'User Responsibilities',
    content:
      'Users must provide accurate information, behave respectfully and comply with all applicable traffic, safety and legal requirements.',
  },
  {
    title: 'Prohibited Activities',
    content:
      'Fraudulent activities, misuse of the platform, submission of false information, harassment and illegal conduct are strictly prohibited.',
  },
  {
    title: 'Platform Availability',
    content:
      'While we strive to maintain uninterrupted service, ShareFare does not guarantee continuous availability of the platform.',
  },
  {
    title: 'Limitation Of Liability',
    content:
      'ShareFare shall not be liable for indirect, incidental or consequential damages arising from the use of the platform or ride-sharing activities.',
  },
  {
    title: 'Termination',
    content:
      'We reserve the right to suspend or terminate accounts that violate these Terms & Conditions or applicable laws.',
  },
  {
    title: 'Changes To Terms',
    content:
      'ShareFare may update these Terms & Conditions periodically. Continued use of the platform after updates constitutes acceptance of the revised terms.',
  },
  {
    title: 'Contact Information',
    content:
      'For questions regarding these Terms & Conditions, please contact us through the Contact Us page.',
  },
];

export default function TermsContent() {
  return (
    <section className="bg-[var(--background)] py-10">
      <Container>
        <div className="max-w-8xl mx-auto rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-10">
          <p className="mb-10 text-sm text-[var(--text-light)]">
            Last Updated: June 2026
          </p>

          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-2xl font-semibold text-[var(--heading)]">
                  {section.title}
                </h2>

                <p className="mt-4 leading-8 text-[var(--text)]">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
