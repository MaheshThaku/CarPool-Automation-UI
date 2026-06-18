"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { X } from "lucide-react";

import Container from "@/components/ui/Container";

import { useState } from "react";


const navLinks = [
  {
    label: "Find Ride",
    href: "#",
  },
  {
    label: "Offer Ride",
    href: "#",
  },
  {
    label: "Routes",
    href: "#",
  },
  {
    label: "How It Works",
    href: "#",
  },
  {
    label: "Safety",
    href: "#",
  },
  {
    label: "About Us",
    href: "#",
  },
  {
    label: "Blog",
    href: "#",
  },
];



export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] =
  useState(false);
  return (
<header
  className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-white/10 backdrop-blur-xl"
>
      <Container>
        <nav
          className="flex h-20 items-center justify-between"
        >
          {/* Logo */}

          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
            >
              SF
            </div>

            <div>
              <h2
                className="text-xl font-bold text-white"
              >
                ShareFare
              </h2>

              <p
                className="text-xs text-white/80"
              >
                Travel Together, Better
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}

          <div
            className="hidden items-center gap-8 lg:flex"
          >
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative text-sm font-medium text-white transition-colors duration-300 hover:text-[var(--primary)]"
              >
                {item.label}

                <span
                  className="absolute -bottom-2 left-0 h-[2px] w-0 bg-[var(--primary)] transition-all duration-300 group-hover:w-full"
                />
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}

          <div
            className="hidden items-center gap-3 lg:flex"
          >
            <Link
              href="/auth/login"
              className="rounded-xl border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:border-[var(--primary)] hover:bg-white/20"
            >
              Login
            </Link>

            <Link
              href="/auth/register"
              className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:bg-[var(--primary-hover)] hover:scale-105"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}

<button
  onClick={() =>
    setIsMenuOpen(!isMenuOpen)
  }
  className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 lg:hidden"
>
  {isMenuOpen ? (
    <X size={22} />
  ) : (
    <Menu size={22} />
  )}
</button>
        </nav>
        {isMenuOpen && (
  <div
    className="absolute inset-x-4 top-[88px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl animate-in fade-in slide-in-from-top-4 lg:hidden"
  >
    <div className="p-5">
      {/* Navigation */}

      <div className="space-y-1">
        {navLinks.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={() =>
              setIsMenuOpen(false)
            }
            className="flex items-center rounded-2xl px-4 py-3.5 text-sm font-medium text-[var(--heading)] transition-all duration-300 hover:bg-[var(--background)] hover:text-[var(--primary)]"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Divider */}

      <div
        className="my-5 h-px bg-[var(--border)]"
      />

      {/* Actions */}

      <div className="space-y-3">
        <Link
          href="/auth/login"
          onClick={() =>
            setIsMenuOpen(false)
          }
          className="flex h-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] font-medium text-[var(--heading)] backdrop-blur-md transition-all duration-300 hover:border-[var(--primary)] hover:bg-white/20"
        >
          Login
        </Link>

        <Link
          href="/auth/register"
          onClick={() =>
            setIsMenuOpen(false)
          }
          className="flex h-12 items-center justify-center rounded-2xl bg-[var(--primary)] font-medium text-white backdrop-blur-md transition-all duration-300 hover:border-[var(--primary)] hover:bg-white/20"
        >
          Sign Up
        </Link>
      </div>
    </div>
  </div>
)}
      </Container>
    </header>
  );
}