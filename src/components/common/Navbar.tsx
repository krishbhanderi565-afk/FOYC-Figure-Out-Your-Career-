import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Compass, LayoutDashboard } from 'lucide-react';
import { Button } from './Button';
import { Logo } from './Logo';
import { useCareer } from '../../context/CareerContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, userEmail } = useCareer();

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#E8E5DE] shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Official FOYC Brand Logo (Medium, balanced 125-155px wide on desktop, 95-120px mobile) */}
        <Link to="/" className="flex items-center group focus:outline-none py-1 hover:opacity-90 transition-opacity">
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#F4F3EF] px-3 py-1.5 rounded-full border border-[#E8E5DE]">
          <Link
            to="/"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              isCurrent('/') ? 'bg-[#171717] text-white shadow-xs' : 'text-[#333333] hover:text-[#171717] hover:bg-black/5'
            }`}
          >
            Home
          </Link>
          <a
            href="/#how-it-works"
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#333333] hover:text-[#171717] hover:bg-black/5 transition-all"
          >
            How It Works
          </a>
          <a
            href="/#explore"
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#333333] hover:text-[#171717] hover:bg-black/5 transition-all"
          >
            Explore
          </a>
          <a
            href="/#about"
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#333333] hover:text-[#171717] hover:bg-black/5 transition-all"
          >
            About
          </a>
          <Link
            to="/import"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              isCurrent('/import') ? 'bg-[#526B50] text-white shadow-xs' : 'text-[#333333] hover:text-[#171717] hover:bg-black/5'
            }`}
          >
            Import Handoff
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="secondary" size="sm" className="gap-2 text-xs font-semibold border-[#E8E5DE] bg-white hover:bg-[#F4F3EF] text-[#171717]">
              <LayoutDashboard className="w-3.5 h-3.5" />
              Demo Dashboard
            </Button>
          </Link>
          <Link to="/onboarding">
            <Button variant="primary" size="sm" className="gap-2 text-xs font-bold bg-[#FFE76B] hover:bg-[#FADB3D] text-[#171717] border border-[#171717] shadow-[2px_2px_0px_#171717]">
              <Compass className="w-3.5 h-3.5 text-[#171717]" />
              Find My Direction
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu hamburger toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link to="/onboarding">
            <Button variant="primary" size="sm" className="text-xs px-3 py-1.5 bg-[#FFE76B] text-[#171717] border border-[#171717]">
              Start
            </Button>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl bg-white border border-[#E8E5DE] shadow-xs active:bg-[#F4F3EF]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#171717]" /> : <Menu className="w-5 h-5 text-[#171717]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E5DE] bg-[#FFFDF8] px-6 py-6 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top-4 duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="font-semibold text-base text-[#171717] py-2 border-b border-[#E8E5DE]"
          >
            Home
          </Link>
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="font-semibold text-base text-[#171717] py-2 border-b border-[#E8E5DE]"
          >
            How It Works
          </a>
          <a
            href="/#explore"
            onClick={() => setMobileMenuOpen(false)}
            className="font-semibold text-base text-[#171717] py-2 border-b border-[#E8E5DE]"
          >
            Explore Paths
          </a>
          <a
            href="/#about"
            onClick={() => setMobileMenuOpen(false)}
            className="font-semibold text-base text-[#171717] py-2 border-b border-[#E8E5DE]"
          >
            About FOYC
          </a>
          <Link
            to="/import"
            onClick={() => setMobileMenuOpen(false)}
            className="font-semibold text-base text-[#171717] py-2 border-b border-[#E8E5DE]"
          >
            Import ChatGPT Handoff
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="font-semibold text-base text-[#171717] py-2 border-b border-[#E8E5DE]"
          >
            View Dashboard
          </Link>

          <div className="pt-2 flex flex-col gap-3">
            <Link to="/onboarding" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" fullWidth size="md" className="gap-2 justify-center bg-[#FFE76B] text-[#171717] border border-[#171717]">
                <Compass className="w-4 h-4" />
                Find My Direction
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" fullWidth size="md" className="border-[#E8E5DE] text-[#171717]">
                {isAuthenticated ? `Signed in (${userEmail || 'Alex'})` : 'Sign Up / Login'}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
