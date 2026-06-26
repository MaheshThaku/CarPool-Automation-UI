import Container from '@/components/ui/Container';

const sections = [
  {
    title: 'Information We Collect',
    content:
      'We may collect personal information such as your name, email address, phone number, profile details and verification documents when you create an account or use ShareFare services.',
  },
  {
    title: 'How We Use Your Information',
    content:
      'Your information is used to provide ride-sharing services, verify user identities, improve platform security, communicate important updates and enhance user experience.',
  },
  {
    title: 'Document Verification',
    content:
      'Verification documents submitted by users may be reviewed to confirm identity and eligibility. These documents are processed securely and only for verification purposes.',
  },
  {
    title: 'Information Sharing',
    content:
      'ShareFare does not sell personal information. Information may be shared only when necessary for platform operations, legal compliance or user safety.',
  },
  {
    title: 'Data Security',
    content:
      'We implement reasonable security measures to protect personal information from unauthorized access, misuse or disclosure.',
  },
  {
    title: 'Cookies & Analytics',
    content:
      'ShareFare may use cookies and analytics tools to improve website performance, understand user behavior and enhance platform functionality.',
  },
  {
    title: 'User Rights',
    content:
      'Users may request updates, corrections or removal of personal information subject to applicable laws and operational requirements.',
  },
  {
    title: 'Policy Updates',
    content:
      'This Privacy Policy may be updated periodically. Continued use of ShareFare after updates constitutes acceptance of the revised policy.',
  },
  {
    title: 'Contact Us',
    content:
      'For privacy-related questions or concerns, please contact the ShareFare support team through our Contact Us page.',
  },
];

export default function PrivacyContent() {
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
