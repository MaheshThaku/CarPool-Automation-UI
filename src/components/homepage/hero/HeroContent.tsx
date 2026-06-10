export default function HeroContent() {
  return (
    <div>
      <span
        className="
          inline-flex
          rounded-full
          bg-[var(--primary)]
          px-4
          py-2
          text-sm
          font-medium
          text-white
        "
      >
        India&apos;s Smart Ride Sharing Platform
      </span>

      <h1
        className="
          mt-6
          text-5xl
          font-bold
          leading-tight
          text-[var(--heading)]

          lg:text-7xl
        "
      >
        Travel Together.
      </h1>

      <h2
        className="
          text-5xl
          font-bold
          leading-tight
          text-[var(--primary)]

          lg:text-7xl
        "
      >
        Travel Smarter.
      </h2>

      <p
        className="
          mt-6
          max-w-xl
          text-lg
          leading-relaxed
          text-[var(--heading)]
        "
      >
        Share rides, save money and reduce traffic.
        Connect with trusted travellers across India
        through ShareFare.
      </p>
    </div>
  );
}