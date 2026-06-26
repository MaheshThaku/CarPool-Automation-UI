import type { Metadata } from 'next';

import PrivacyHero from './_components/PrivacyHero';
import PrivacyContent from './_components/PrivacyContent';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/footer/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | ShareFare Ride Sharing Platform',

  description:
    'Learn how ShareFare collects, uses and protects personal information, verification documents and user data while providing secure ride-sharing services.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <PrivacyHero />

      <PrivacyContent />
      <Footer />
    </>
  );
}
