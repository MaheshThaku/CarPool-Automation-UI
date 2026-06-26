import type { Metadata } from 'next';

import CommunityHero from './_components/CommunityHero';
import CommunityPrinciples from './_components/CommunityPrinciples';
import CommunityContent from './_components/CommunityContent';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/footer/Footer';

export const metadata: Metadata = {
  title: 'Community Guidelines | ShareFare Ride Sharing Platform',

  description:
    'Learn the ShareFare Community Guidelines for safe, respectful and responsible ride sharing. Understand user responsibilities, safety expectations and platform standards.',

  keywords: [
    'community guidelines',
    'ride sharing rules',
    'ride sharing safety',
    'driver guidelines',
    'passenger guidelines',
    'safe ride sharing platform',
    'trusted ride sharing community',
  ],
};

export default function CommunityGuidelinesPage() {
  return (
    <>
      <Navbar />
      <CommunityHero />

      <CommunityPrinciples />

      <CommunityContent />
      <Footer />
    </>
  );
}
