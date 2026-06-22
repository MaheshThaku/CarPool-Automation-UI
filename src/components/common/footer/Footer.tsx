import Container from '@/components/ui/Container';

import FooterBrand from './FooterBrand';
import FooterCTA from './FooterCTA';
import FooterLinks from './FooterLinks';

import { Route } from 'lucide-react';

import { footerLinks } from './footer.data';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[var(--surface)]">
      {/* Background Effects */}

      <div className="absolute top-0 -left-32 h-[450px] w-[450px] rounded-full bg-[var(--primary)]/20 blur-3xl" />

      <div className="absolute right-0 bottom-0 h-[350px] w-[350px] rounded-full bg-[var(--primary)]/20 blur-3xl" />

      <div className="absolute top-20 left-[-60px] hidden lg:block">
        <Route size={260} className="text-[var(--primary)]/10" />
      </div>

      <div className="absolute right-[-50px] bottom-10 hidden lg:block">
        <Route size={260} className="text-[var(--primary)]/10" />
      </div>

      <div className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block"></div>

      <Container>
        <div className="relative z-10 mt-10 pb-16">
          <FooterCTA />
        </div>

        <div className="relative z-10 grid gap-12 border-b border-[var(--border)] pb-14 lg:grid-cols-[1.8fr_1fr_1fr_1fr_1fr]">
          <FooterBrand />

          <FooterLinks title="Product" links={footerLinks.product} />

          <FooterLinks title="Company" links={footerLinks.company} />

          <FooterLinks title="Support" links={footerLinks.support} />

          <FooterLinks title="Legal" links={footerLinks.legal} />
        </div>

        <div className="relative z-10 flex flex-col gap-5 py-8 text-sm text-[var(--text-light)] lg:flex-row lg:items-center lg:justify-between">
          <p>© {new Date().getFullYear()} ShareFare. All rights reserved.</p>

          <div className="flex flex-wrap justify-center gap-3 lg:justify-end">
            {[
              'Verified Profiles',
              'Women Safety',
              'Secure Payments',
              'Trusted Community',
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-[var(--border)] bg-white/80 px-4 py-2 font-medium text-[var(--heading)] backdrop-blur-md"
              >
                ✓ {item}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
