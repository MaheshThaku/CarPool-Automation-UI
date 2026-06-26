import Container from '@/components/ui/Container';

const sections = [
  {
    title: 'Respectful Behavior',
    content:
      'Treat all members of the ShareFare community respectfully. Harassment, discrimination, abusive language and inappropriate conduct are not permitted.',
  },
  {
    title: 'Accurate Information',
    content:
      'Provide truthful profile information, vehicle details and ride information. Misrepresentation may result in account suspension.',
  },
  {
    title: 'Safety Responsibilities',
    content:
      'Passengers and drivers should follow safety guidelines, verify ride details and prioritize responsible travel practices.',
  },
  {
    title: 'Prohibited Conduct',
    content:
      'Fraudulent activity, impersonation, illegal behavior, spam, misuse of the platform and attempts to bypass verification are strictly prohibited.',
  },
  {
    title: 'Vehicle Standards',
    content:
      'Drivers should maintain vehicles in safe operating condition and comply with applicable laws and regulations.',
  },
  {
    title: 'Reporting Concerns',
    content:
      'Users are encouraged to report suspicious activity, safety concerns or guideline violations through ShareFare support.',
  },
  {
    title: 'Account Actions',
    content:
      'Violations of community guidelines may result in warnings, restrictions, temporary suspension or permanent account removal.',
  },
];

export default function CommunityContent() {
  return (
    <section className="bg-[var(--surface)] py-10">
      <Container>
        <div className="max-w-8xl mx-auto rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-10">
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
