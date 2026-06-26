import type { Metadata } from 'next';

import AboutHero from '@/components/about/AboutHero';
import AboutMission from '@/components/about/AboutMission';
import AboutValues from '@/components/about/AboutValues';
import AboutSafety from '@/components/about/AboutSafety';
import Navbar from '@/components/common/Navbar';
import CommunityStats from '@/components/homepage/stats/CommunityStats';
import Footer from '@/components/common/footer/Footer';

export const metadata: Metadata = {
  title: 'About ShareFare | Safe & Affordable Ride Sharing Platform',

  description:
    "Learn about ShareFare, India's trusted ride sharing platform helping travelers connect, save money and travel safely.",

  keywords: [
    'about sharefare',
    'ride sharing india',
    'carpooling platform',
    'safe travel',
    'women safety rides',
    'shared mobility',
  ],
};

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <AboutHero />
      <AboutMission />
      <AboutValues />
      <AboutSafety />
      <CommunityStats />
      <Footer />
    </main>
  );
}
