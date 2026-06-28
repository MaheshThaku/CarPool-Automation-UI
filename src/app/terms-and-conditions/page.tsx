import type { Metadata } from 'next';

import TermsHero from './_components/TermsHero';
import TermsContent from './_components/TermsContent';
import Navbar from '@/components/common/navbar/Navbar';
import Footer from '@/components/common/footer/Footer';

export const metadata: Metadata = {
  title: 'Terms & Conditions | ShareFare Ride Sharing Platform',

  description:
    'Review ShareFare Terms & Conditions regarding platform usage, user responsibilities, verification requirements, ride sharing services and account policies.',
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <Navbar />
      <TermsHero />
      <TermsContent />
      <Footer />
    </>
  );
}
