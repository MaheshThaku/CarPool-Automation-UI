import Hero from '@/components/homepage/hero/Hero';
import HowItWorks from '@/components/homepage/how-it-works/HowItWorks';
// import TrustedPartners from "@/components/homepage/partners/TrustedPartners";
import PopularRoutes from '@/components/homepage/routes/PopularRoutes';
import Safety from '@/components/homepage/safety/Safety';
import RideSearch from '@/components/homepage/search/RideSearch';
import WhyUs from '@/components/homepage/whyUs/WhyUs';
import Navbar from '@/components/common/Navbar';
import Testimonials from '@/components/homepage/testimonials/Testimonials';
import CommunityStats from '@/components/homepage/stats/CommunityStats';
import FAQ from '@/components/homepage/faq/FAQ';
import Footer from '@/components/common/footer/Footer';

export default function HomePage() {
  return (
    <main className="bg-[var(--background)]">
      <Navbar />
      <Hero />
      <RideSearch />
      {/* <TrustedPartners />  */}
      <HowItWorks />
      <Safety />
      <PopularRoutes />
      <WhyUs />
      <Testimonials />
      <CommunityStats />
      <FAQ />
      <Footer />
    </main>
  );
}
