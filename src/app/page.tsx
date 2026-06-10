import Hero from "@/components/homepage/hero/Hero";
import HowItWorks from "@/components/homepage/how-it-works/HowItWorks";
import TrustedPartners from "@/components/homepage/partners/TrustedPartners";
import Safety from "@/components/homepage/safety/Safety";
import RideSearch from "@/components/homepage/search/RideSearch";
import Navbar from "@/components/layout/Navbar";  

export default function HomePage() {
  return (
    <main className="bg-[var(--background)]">
      <Navbar />
      <Hero />
      <RideSearch />
      <TrustedPartners /> 
      <HowItWorks />
      <Safety />
    </main>
  );
}