import Container from '@/components/ui/Container';

const sections = [
  {
    title: 'What Are Cookies?',
    content:
      'Cookies are small text files stored on your device when you visit a website. They help websites remember user preferences and improve browsing experiences.',
  },
  {
    title: 'How ShareFare Uses Cookies',
    content:
      'ShareFare uses cookies to maintain platform functionality, improve website performance, remember preferences and enhance user experience.',
  },
  {
    title: 'Essential Cookies',
    content:
      'Essential cookies help core website features function correctly, including user authentication, security and account access.',
  },
  {
    title: 'Analytics Cookies',
    content:
      'Analytics cookies help us understand how visitors interact with ShareFare. This information allows us to improve website usability and performance.',
  },
  {
    title: 'Performance Cookies',
    content:
      'Performance cookies collect anonymous information about website usage to help optimize loading speed and overall user experience.',
  },
  {
    title: 'Third-Party Services',
    content:
      'ShareFare may use trusted third-party tools such as analytics platforms to understand traffic patterns and improve services.',
  },
  {
    title: 'Managing Cookies',
    content:
      'Most browsers allow users to manage, disable or delete cookies through browser settings. Disabling cookies may affect certain website features.',
  },
  {
    title: 'Changes To This Policy',
    content:
      'We may update this Cookies Policy periodically to reflect changes in technology, legal requirements or platform functionality.',
  },
  {
    title: 'Contact Us',
    content:
      'If you have questions about our use of cookies or this policy, please contact ShareFare through our Contact Us page.',
  },
];

export default function CookiesContent() {
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
