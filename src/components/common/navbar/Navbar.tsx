'use client';

import { useState } from 'react';

import { Menu, X } from 'lucide-react';

import Container from '@/components/ui/Container';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import Logo from './Logo';
import DesktopNav from './DesktopNav';
import DesktopActions from './DesktopActions';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const user = useCurrentUser();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-white/10 backdrop-blur-xl">
      <Container>
        <nav className="flex h-20 items-center justify-between">
          {/* Logo */}

          <Logo />

          {/* Desktop Navigation */}

          <DesktopNav />

          {/* Desktop Actions */}

          <DesktopActions user={user} />

          {/* Mobile Menu Toggle */}

          <button
            onClick={toggleMenu}
            aria-label="Toggle Menu"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/10 backdrop-blur-md transition-all duration-300 hover:bg-white/20 lg:hidden"
          >
            {isMenuOpen ? (
              <X size={22} color="black" />
            ) : (
              <Menu size={22} color="black" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}

        <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} user={user} />
      </Container>
    </header>
  );
}
