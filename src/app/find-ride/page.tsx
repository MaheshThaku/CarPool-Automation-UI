import type { Metadata } from 'next';

import PreAuthLayout from '@/components/pre-auth/PreAuthLayout';
import Navbar from '@/components/common/Navbar';

export const metadata: Metadata = {
  title: 'Find Ride | ShareFare - Affordable & Verified Rides',

  description:
    'Find affordable, safe and verified rides across India. Travel with trusted drivers, save money and enjoy smarter journeys with ShareFare.',

  keywords: [
    'find ride',
    'ride sharing',
    'carpooling india',
    'verified drivers',
    'shared travel',
    'intercity rides',
    'sharefare',
  ],

  openGraph: {
    title: 'Find Ride | ShareFare',
    description: 'Find affordable and verified rides across India.',
    type: 'website',
  },
};

const findRideData = {
  title: 'Find Affordable Rides Across India',

  subtitle:
    'Join thousands of travelers using ShareFare to discover verified rides, reduce travel costs and enjoy safe journeys every day.',

  ctaTitle: 'Find Your Perfect Ride',

  ctaDescription:
    'Login to access verified ride listings, connect with trusted drivers and start traveling smarter.',

  features: [
    'Verified Drivers & Travelers',
    'Women Friendly Travel Options',
    'Secure Ride Matching',
    'Affordable Travel Costs',
    'Thousands Of Popular Routes',
    '24/7 Customer Support',
  ],
};

export default function FindRidePage() {
  return (
    <main>
      <Navbar />
      <PreAuthLayout
        title={findRideData.title}
        subtitle={findRideData.subtitle}
        ctaTitle={findRideData.ctaTitle}
        ctaDescription={findRideData.ctaDescription}
        features={findRideData.features}
      />
    </main>
  );
}
