import Image from "next/image";
import Container from "@/components/ui/Container";

import HeroContent from "./HeroContent";
import HeroActions from "./HeroActions";

export default function Hero() {
  return ( 
    <section
      className="relative h-[650px] md:h-[750px] lg:h-[850px]"
    >
      <Image
        src="/images/auth/auth_banner.png"
        alt="ShareFare Hero"
        fill
        priority
        className="object-cover"
      />

      <div
        className="absolute inset-0 bg-black/20"
      />

      <Container>
        <div
          className="relative z-10 flex h-[650px] md:h-[750px] lg:h-[850px] items-center"
        >
          <div className="max-w-3xl">
            <HeroContent />

            <HeroActions />

          </div>
        </div>
      </Container>
    </section>
  );
}