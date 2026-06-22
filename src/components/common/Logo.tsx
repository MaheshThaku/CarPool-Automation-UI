import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="ShareFare Home"
      className="inline-flex items-center transition-transform duration-300 hover:scale-[1.02]"
    >
      <Image
        src="/images/logo/FLogo.png"
        alt="ShareFare Logo"
        width={400}
        height={200}
        priority
        className="h-40 w-auto object-contain md:h-40 lg:h-40"
      />
    </Link>
  );
}
