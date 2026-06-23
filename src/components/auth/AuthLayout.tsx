import { ReactNode } from 'react';

import AuthBanner from './AuthBanner';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main
      className="min-h-screen bg-white lg:h-screen lg:overflow-hidden"
    >
      <div
        className="flex min-h-screen flex-col lg:h-full lg:min-h-0 lg:flex-row"
      >
        <AuthBanner />

        <section
          className="flex flex-1 items-center justify-center px-4 py-4 sm:px-6 lg:px-6 lg:py-0"
        >
          {children}
        </section>
      </div>
    </main>
  );
}
