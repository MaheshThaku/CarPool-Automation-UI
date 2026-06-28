import type { Metadata } from 'next';

import CookiesHero from './_components/CookiesHero';
import CookiesContent from './_components/CookiesContent';
import Navbar from '@/components/common/navbar/Navbar';
import Footer from '@/components/common/footer/Footer';

export const metadata: Metadata = {
  title: 'Cookies Policy | ShareFare Ride Sharing Platform',

  description:
    'Learn how ShareFare uses cookies and similar technologies to improve website functionality, security, analytics and user experience.',

  keywords: [
    'cookies policy',
    'website cookies',
    'ride sharing platform',
    'analytics cookies',
    'performance cookies',
    'website privacy',
    'sharefare cookies policy',
  ],
};

export default function CookiesPolicyPage() {
  return (
    <>
      <Navbar />
      <CookiesHero />
      <CookiesContent />
      <Footer />
    </>
  );
}
