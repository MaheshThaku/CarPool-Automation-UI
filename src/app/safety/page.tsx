import type { Metadata } from 'next';

import Navbar from '@/components/common/navbar/Navbar';
import Footer from '@/components/common/footer/Footer';

import SafetyHero from './_components/SafetyHero';
import SafetyFeatures from './_components/SafetyFeatures';
import WomenSafety from './_components/WomenSafety';
import VerificationProcess from './_components/VerificationProcess';
import SafetyGuidelines from './_components/SafetyGuideline';

export const metadata: Metadata = {
  title: 'Safety | ShareFare - Safe & Trusted Ride Sharing Platform',

  description:
    'Learn how ShareFare protects passengers and drivers through identity verification, document validation, trusted profiles, secure ride matching and community safety standards.',

  keywords: [
    'ride sharing safety',
    'safe ride sharing platform',
    'verified drivers',
    'verified passengers',
    'secure ride matching',
    'carpool safety',
    'trusted ride sharing',
    'ride sharing security',
    'document verification',
    'identity verification',
    'safe travel platform',
  ],
};

export default function SafetyPage() {
  return (
    <main>
      <Navbar />

      <SafetyHero />

      <SafetyFeatures />

      <WomenSafety />

      <VerificationProcess />

      <SafetyGuidelines />

      <Footer />
    </main>
  );
}
