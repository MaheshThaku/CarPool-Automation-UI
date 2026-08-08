/**
 * OfferRidePage  (/offer-ride)
 *
 * Public pre-auth marketing page.  Shows what ShareFare offers to riders and
 * includes a small "What you need" (ℹ) tooltip near the section header so
 * visitors know the six verification requirements before signing up.
 *
 * NOTE: This page is a Server Component — the tooltip is implemented as a
 * pure CSS :hover popover so no 'use client' directive is needed.
 */

import type { Metadata } from 'next';

import PreAuthLayout from '@/components/pre-auth/PreAuthLayout';
import Navbar from '@/components/common/navbar/Navbar';
import OfferRideInfoTooltip from './_components/OfferRideInfoTooltip';

export const metadata: Metadata = {
  title: 'Offer Ride | ShareFare - Share Empty Seats & Earn',

  description:
    'Offer rides, share empty seats and earn while you travel. Connect with verified passengers and make every trip more rewarding.',

  keywords: [
    'offer ride',
    'carpool driver',
    'ride sharing',
    'earn while travelling',
    'share empty seats',
    'verified passengers',
    'sharefare',
  ],

  openGraph: {
    title: 'Offer Ride | ShareFare',
    description: 'Offer rides and earn while travelling.',
    type: 'website',
  },
};

const offerRideData = {
  title: 'Offer Rides & Earn While Traveling',

  subtitle:
    'Turn your empty seats into value. Share your ride with verified passengers, reduce fuel costs and travel smarter with ShareFare.',

  ctaTitle: 'Start Offering Rides',

  ctaDescription:
    'Login to publish rides, manage bookings and connect with trusted travelers across India.',

  features: [
    'Earn Extra Income',
    'Verified Passengers',
    'Secure Booking Requests',
    'Flexible Travel Schedule',
    'Smart Ride Management',
    '24/7 Customer Support',
  ],
};

export default function OfferRidePage() {
  return (
    <main>
      <Navbar />

      {/* Requirements info tooltip — floats above the main content */}
      <OfferRideInfoTooltip />

      <PreAuthLayout
        title={offerRideData.title}
        subtitle={offerRideData.subtitle}
        ctaTitle={offerRideData.ctaTitle}
        ctaDescription={offerRideData.ctaDescription}
        features={offerRideData.features}
      />
    </main>
  );
}
