import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Compass, LayoutDashboard, LogIn, UserPlus, LogOut, User, CalendarCheck } from 'lucide-react';
import { Button } from './Button';
import { Logo } from './Logo';
import { useCareer } from '../../context/CareerContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, userEmail, userName, signOut } = useCareer();

  const isCurrent = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#E8E5DE] shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Official FOYC Brand Logo (Medium, balanced 125-155px wide on desktop, 95-120px mobile) */}
        <Link to="/" className="flex items-center group focus:outline-none py-1 hover:opacity-90 transition-opacity">
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#F4F3EF] px-3 py-1.5 rounded-full border border-[#E8E5DE]">
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
          <Link
            to="/explore"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              isCurrent('/explore') ? 'bg-[#171717] text-white shadow-xs' : 'text-[#333333] hover:text-[#171717] hover:bg-black/5'
            }`}
          >
            Explore
          </Link>
          <Link
            to="/about"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              isCurrent('/about') ? 'bg-[#171717] text-white shadow-xs' : 'text-[#333333] hover:text-[#171717] hover:bg-black/5'
            }`}
          >
            About
          </Link>
          <Link
            to="/habit-tracker"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              isCurrent('/habit-tracker') ? 'bg-[#526B50] text-white shadow-xs' : 'text-[#333333] hover:text-[#171717] hover:bg-black/5'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Habit Tracker</span>
          </Link>
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
        <div className="hidden md:flex items-center gap-2.5">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button variant="secondary" size="sm" className="gap-2 text-xs font-bold border-[#171717] bg-white hover:bg-[#F4F3EF] text-[#171717] shadow-[2px_2px_0px_#171717]">
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#526B50]" />
                  Dashboard
                </Button>
              </Link>

              <div className="flex items-center gap-2 pl-1 border-l border-[#E8E5DE]">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EDF2E9] border border-[#A8B99A] text-xs font-bold text-[#526B50]">
                  <User className="w-3 h-3" />
                  <span className="max-w-[120px] truncate">{userName || userEmail?.split('@')[0] || 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-[#555555] hover:text-[#171717] hover:bg-black/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="px-3.5 py-1.5 text-xs font-bold text-[#171717] hover:text-[#526B50] transition-colors flex items-center gap-1.5">
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
              </Link>

              <Link to="/signup">
                <button className="px-3.5 py-1.5 rounded-full text-xs font-bold text-[#171717] bg-white border border-[#171717] hover:bg-[#F4F3EF] transition-colors flex items-center gap-1.5 shadow-xs">
                  <UserPlus className="w-3.5 h-3.5 text-[#526B50]" />
                  <span>Sign Up</span>
                </button>
              </Link>

              <Link to="/onboarding">
                <Button variant="primary" size="sm" className="gap-1.5 text-xs font-bold bg-[#FFE76B] hover:bg-[#FADB3D] text-[#171717] border border-[#171717] shadow-[2px_2px_0px_#171717]">
                  <Compass className="w-3.5 h-3.5 text-[#171717]" />
                  <span>Find My Direction</span>
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          {!isAuthenticated ? (
            <Link to="/signup">
              <Button variant="primary" size="sm" className="text-xs px-3 py-1.5 bg-[#FFE76B] text-[#171717] border border-[#171717]">
                Sign Up
              </Button>
            </Link>
          ) : (
            <Link to="/dashboard">
              <Button variant="secondary" size="sm" className="text-xs px-3 py-1.5 border border-[#171717] bg-white text-[#171717]">
                Dashboard
              </Button>
            </Link>
          )}
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
        <div className="md:hidden border-t border-[#E8E5DE] bg-[#FFFDF8] px-6 py-6 flex flex-col gap-3.5 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="font-bold text-sm text-[#171717] py-2 border-b border-[#E8E5DE]"
          >
            Home
          </Link>
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="font-bold text-sm text-[#171717] py-2 border-b border-[#E8E5DE]"
          >
            How It Works
          </a>
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="font-bold text-sm text-[#171717] py-2 border-b border-[#E8E5DE]"
          >
            Explore Paths
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="font-bold text-sm text-[#171717] py-2 border-b border-[#E8E5DE]"
          >
            About FOYC
          </Link>
          <Link
            to="/habit-tracker"
            onClick={() => setMobileMenuOpen(false)}
            className={`font-bold text-sm py-2 border-b border-[#E8E5DE] flex items-center gap-2 ${
              isCurrent('/habit-tracker') ? 'text-[#526B50]' : 'text-[#171717]'
            }`}
          >
            <CalendarCheck className="w-4 h-4 text-[#526B50]" />
            <span>Habit Tracker</span>
          </Link>
          <Link
            to="/import"
            onClick={() => setMobileMenuOpen(false)}
            className="font-bold text-sm text-[#171717] py-2 border-b border-[#E8E5DE]"
          >
            Import ChatGPT Handoff
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="font-bold text-sm text-[#171717] py-2 border-b border-[#E8E5DE]"
          >
            Career Dashboard
          </Link>

          {/* Auth buttons in Mobile Menu */}
          <div className="pt-2 flex flex-col gap-2.5">
            {isAuthenticated ? (
              <div className="p-3 rounded-xl bg-[#EDF2E9] border border-[#A8B99A] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#526B50]">
                    <User className="w-3.5 h-3.5" />
                    <span>{userName || userEmail}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" fullWidth size="md" className="border-[#171717] text-[#171717] font-bold text-xs">
                    <LogIn className="w-3.5 h-3.5 mr-1" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" fullWidth size="md" className="bg-[#171717] text-white hover:bg-[#333333] font-bold text-xs">
                    <UserPlus className="w-3.5 h-3.5 mr-1" />
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            <Link to="/onboarding" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" fullWidth size="md" className="gap-2 justify-center bg-[#FFE76B] text-[#171717] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-black text-xs">
                <Compass className="w-4 h-4" />
                Find My Direction
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
