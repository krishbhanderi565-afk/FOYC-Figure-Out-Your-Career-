import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Sparkles, LayoutDashboard } from 'lucide-react';
import { Button } from './Button';
import { Logo } from './Logo';
import { useCareer } from '../../context/CareerContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, userEmail } = useCareer();

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFF8E9]/90 backdrop-blur-md border-b-2 border-[#17172B] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Official FOYC Brand Logo */}
        <Link to="/" className="flex items-center group focus:outline-none py-1">
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/70 px-4 py-1.5 rounded-full border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B]">
          <Link
            to="/"
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
              isCurrent('/') ? 'bg-[#FFE76B] text-[#17172B]' : 'text-[#17172B]/80 hover:text-[#17172B] hover:bg-black/5'
            }`}
          >
            Home
          </Link>
          <a
            href="/#how-it-works"
            className="px-4 py-1.5 rounded-full text-sm font-bold text-[#17172B]/80 hover:text-[#17172B] hover:bg-black/5 transition-all"
          >
            How It Works
          </a>
          <a
            href="/#explore"
            className="px-4 py-1.5 rounded-full text-sm font-bold text-[#17172B]/80 hover:text-[#17172B] hover:bg-black/5 transition-all"
          >
            Explore
          </a>
          <a
            href="/#about"
            className="px-4 py-1.5 rounded-full text-sm font-bold text-[#17172B]/80 hover:text-[#17172B] hover:bg-black/5 transition-all"
          >
            About
          </a>
          <Link
            to="/import"
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
              isCurrent('/import') ? 'bg-[#DDF5C9] text-[#17172B]' : 'text-[#17172B]/80 hover:text-[#17172B] hover:bg-black/5'
            }`}
          >
            Import Handoff
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="secondary" size="sm" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Demo Dashboard
            </Button>
          </Link>
          <Link to="/onboarding">
            <Button variant="primary" size="sm" className="gap-2">
              <Sparkles className="w-4 h-4 text-[#17172B]" />
              Find My Direction
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu hamburger toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link to="/onboarding">
            <Button variant="primary" size="sm" className="text-xs px-3 py-1.5">
              Start
            </Button>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl bg-white border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B] active:translate-x-0.5 active:translate-y-0.5"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-[#17172B] bg-[#FFF8E9] px-6 py-6 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="font-bold text-lg text-[#17172B] py-2 border-b border-[#17172B]/10"
          >
            Home
          </Link>
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="font-bold text-lg text-[#17172B] py-2 border-b border-[#17172B]/10"
          >
            How It Works
          </a>
          <a
            href="/#explore"
            onClick={() => setMobileMenuOpen(false)}
            className="font-bold text-lg text-[#17172B] py-2 border-b border-[#17172B]/10"
          >
            Explore Paths
          </a>
          <a
            href="/#about"
            onClick={() => setMobileMenuOpen(false)}
            className="font-bold text-lg text-[#17172B] py-2 border-b border-[#17172B]/10"
          >
            About FOYC
          </a>
          <Link
            to="/import"
            onClick={() => setMobileMenuOpen(false)}
            className="font-bold text-lg text-[#17172B] py-2 border-b border-[#17172B]/10"
          >
            Import ChatGPT Handoff
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="font-bold text-lg text-[#17172B] py-2 border-b border-[#17172B]/10"
          >
            View Dashboard Engine
          </Link>

          <div className="pt-2 flex flex-col gap-3">
            <Link to="/onboarding" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" fullWidth size="md" className="gap-2 justify-center">
                <Sparkles className="w-4 h-4" />
                Find My Direction
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" fullWidth size="md">
                {isAuthenticated ? `Signed in (${userEmail || 'Alex'})` : 'Sign Up / Login'}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
