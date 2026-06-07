import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-4">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg sm:p-10">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-[var(--heading)]">
            RideConnect
          </h1>

          <p className="mt-3 text-[var(--text)]">
            Temporary Home Page for Testing
          </p>
        </header>

        <div className="mt-8 space-y-4">
          <Link
            href="/auth/login"
            className="
              flex h-14 items-center justify-center rounded-xl
              bg-[var(--primary)] font-medium text-white
              transition-colors hover:bg-[var(--primary-hover)]
            "
          >
            Login
          </Link>

          <Link
            href="/auth/register"
            className="
              flex h-14 items-center justify-center rounded-xl
              border border-[var(--border)]
              font-medium text-[var(--heading)]
              transition-colors hover:bg-gray-50
            "
          >
            Register
          </Link>
        </div>
      </section>
    </main>
  );
}