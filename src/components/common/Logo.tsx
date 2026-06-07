import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <div className="flex items-center">
        <Image
          src="/images/logo/logoDummy.png"
          alt="RideConnect"
          width={200}
          height={200}
          className="h-25 w-12 rounded-full object-cover"
        />

        <div>
        <h2 className="text-[20px] font-bold leading-none text-[var(--heading)]">
            RideConnect
          </h2>

          <p className="mt-1 text-base text-[var(--text-)]">
            Travel Together, Better
          </p>
        </div>
      </div>
    </Link>
  );
}