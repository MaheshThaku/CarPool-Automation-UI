import PreAuthHero from './PreAuthHero';
import PreAuthCard from './PreAuthCard';

type Props = {
  title: string;
  subtitle: string;
  ctaTitle: string;
  ctaDescription: string;
  features: string[];
};

export default function PreAuthLayout({
  title,
  subtitle,
  ctaTitle,
  ctaDescription,
  features,
}: Props) {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <PreAuthHero title={title} subtitle={subtitle} />

        <PreAuthCard
          title={ctaTitle}
          description={ctaDescription}
          features={features}
        />
      </div>
    </main>
  );
}
