import type { Metadata } from 'next';

import PreAuthLayout from '@/components/pre-auth/PreAuthLayout';
import Navbar from '@/components/common/Navbar';

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
