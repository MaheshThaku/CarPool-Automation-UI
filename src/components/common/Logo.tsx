import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/">
      <div className="flex items-center">
        <Image
          src="/images/logo/sharefarelogo.jpeg"
          alt="ShareFare"
          width={200}
          height={200}
          className="h-12 w-12 rounded-full border-2 border-[var(--heading)] object-cover"
        />

        <div className="ml-3">
          <h2 className="text-[20px] leading-none font-bold text-[var(--heading)]">
            <span className="text-[var(--primary)]">Share</span>Fare
          </h2>

          <p className="mt-1 text-base text-[var(--text-heading)]">
            Travel Together, Better
          </p>
        </div>
      </div>
    </Link>
  );
}
