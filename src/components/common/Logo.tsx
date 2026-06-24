import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/cn';

type LogoProps = {
  clickable?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

export default function Logo({
  clickable = true,
  size = 'lg',
}: LogoProps) {
  const logoImage = (
    <Image
      src="/images/logo/FLogo.png"
      alt="ShareFare Logo"
      width={400}
      height={200}
      priority
      className={cn(
        'w-auto object-contain',
        size === 'sm' && 'h-10',
        size === 'md' && 'h-14',
        size === 'lg' && 'h-35'
      )}
    />
  );

  if (!clickable) {
    return <div>{logoImage}</div>;
  }

  return (
    <Link
      href="/"
      aria-label="ShareFare Home"
      className="inline-flex items-center transition-transform duration-300 hover:scale-[1.02]"
    >
      {logoImage}
    </Link>
  );
}