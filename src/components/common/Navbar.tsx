import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ArrowRight,
  LayoutDashboard,
  LogIn,
  UserPlus,
  LogOut,
  User,
  ChevronDown,
  Compass,
  Sparkles,
  GitCompare,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from './Button';
import { Logo } from './Logo';
import { useCareer } from '../../context/CareerContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, userEmail, userName, signOut } = useCareer();

  const isCurrent = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isExploreActive =
    location.pathname.startsWith('/clarity-compass') ||
    location.pathname.startsWith('/possibility-explorer') ||
    location.pathname.startsWith('/career-comparison') ||
    location.pathname.startsWith('/explore');

  // Handle hover on Explore dropdown with graceful delay
  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setExploreDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setExploreDropdownOpen(false);
    }, 150);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setExploreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu and dropdown on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setExploreDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close everything on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setExploreDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const exploreTools = [
    {
      title: 'Clarity Compass',
      path: '/clarity-compass',
      description: 'Assess career confusion & identify hidden blind spots',
      icon: Compass,
      iconColor: 'text-[#526B50]',
      bgColor: 'bg-[#EDF2E9]',
      borderColor: 'border-[#A8B99A]',
      badge: 'Assessment',
    },
    {
      title: 'Possibility Explorer',
      path: '/possibility-explorer',
      description: 'Discover diversified high-leverage careers tailored to you',
      icon: Sparkles,
      iconColor: 'text-[#D97706]',
      bgColor: 'bg-[#FEF3C7]',
      borderColor: 'border-[#FCD34D]',
      badge: 'Discovery',
    },
    {
      title: 'Career Path Comparison',
      path: '/career-comparison',
      description: 'Side-by-side trade-offs, break-evens & AI resilience',
      icon: GitCompare,
      iconColor: 'text-[#2563EB]',
      bgColor: 'bg-[#EFF6FF]',
      borderColor: 'border-[#BFDBFE]',
      badge: 'Trade-offs',
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#E8E5DE] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 md:h-20 flex items-center justify-between gap-4">
        {/* Left: Official FOYC Brand Logo */}
        <Link
          to="/"
          className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] rounded-lg py-1 hover:opacity-95 transition-opacity shrink-0"
          aria-label="FOYC Homepage"
        >
          <Logo size="md" />
        </Link>

        {/* Center: Clean & Short Modern 4-Option Navigation Bar */}
        <nav
          className="hidden md:flex items-center gap-1.5 bg-[#F4F3EF] px-3.5 py-1.5 rounded-full border border-[#E8E5DE] shadow-xs"
          aria-label="Main Navigation"
        >
          {/* 1. Home */}
          <Link
            to="/"
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-tight transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] ${
              isCurrent('/')
                ? 'bg-[#171717] text-white shadow-xs'
                : 'text-[#333333] hover:text-[#171717] hover:bg-black/5'
            }`}
            aria-current={isCurrent('/') ? 'page' : undefined}
          >
            Home
          </Link>

          {/* 2. About Us */}
          <Link
            to="/about"
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-tight transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] ${
              isCurrent('/about')
                ? 'bg-[#171717] text-white shadow-xs'
                : 'text-[#333333] hover:text-[#171717] hover:bg-black/5'
            }`}
            aria-current={isCurrent('/about') ? 'page' : undefined}
          >
            About Us
          </Link>

          {/* 3. Habit Tracker */}
          <Link
            to="/habit-tracker"
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-tight transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] ${
              isCurrent('/habit-tracker')
                ? 'bg-[#171717] text-white shadow-xs'
                : 'text-[#333333] hover:text-[#171717] hover:bg-black/5'
            }`}
            aria-current={isCurrent('/habit-tracker') ? 'page' : undefined}
          >
            Habit Tracker
          </Link>

          {/* 4. Explore Dropdown (Holds all 3 tools) */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setExploreDropdownOpen(!exploreDropdownOpen)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-tight transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] ${
                isExploreActive || exploreDropdownOpen
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'text-[#333333] hover:text-[#171717] hover:bg-black/5'
              }`}
              aria-expanded={exploreDropdownOpen}
              aria-haspopup="true"
            >
              <span>Explore</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  exploreDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Card */}
            {exploreDropdownOpen && (
              <div
                className="absolute top-full right-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 w-80 sm:w-96 rounded-2xl bg-[#FFFDF8] border-2 border-[#171717] shadow-[6px_6px_0px_#171717] p-3 z-50 animate-fadeIn"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="px-2 pt-1 pb-2 border-b border-[#E8E5DE] flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#888888]">
                    FOYC Discovery Tools
                  </span>
                  <span className="text-[10px] font-bold text-[#526B50] bg-[#EDF2E9] px-2 py-0.5 rounded-full border border-[#A8B99A]">
                    3 Core Engines
                  </span>
                </div>

                <div className="py-2 space-y-1.5">
                  {exploreTools.map((tool) => {
                    const active = isCurrent(tool.path);
                    const ToolIcon = tool.icon;
                    return (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        onClick={() => setExploreDropdownOpen(false)}
                        className={`group flex items-start gap-3 p-2.5 rounded-xl transition-all border ${
                          active
                            ? 'bg-[#171717] text-white border-[#171717]'
                            : 'bg-white hover:bg-[#FAF8F5] border-[#E8E5DE] hover:border-[#171717]'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                            active
                              ? 'bg-white/20 border-white/30 text-white'
                              : `${tool.bgColor} ${tool.borderColor} ${tool.iconColor}`
                          }`}
                        >
                          <ToolIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className={`text-xs font-black truncate ${
                                active ? 'text-white' : 'text-[#171717] group-hover:text-[#526B50]'
                              }`}
                            >
                              {tool.title}
                            </span>
                            <span
                              className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                                active
                                  ? 'bg-[#FFE76B] text-[#171717]'
                                  : 'bg-[#F4F3EF] text-[#666666]'
                              }`}
                            >
                              {tool.badge}
                            </span>
                          </div>
                          <p
                            className={`text-[11px] leading-tight mt-0.5 line-clamp-1 ${
                              active ? 'text-gray-300' : 'text-[#666666]'
                            }`}
                          >
                            {tool.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Bottom link to general explore overview */}
                <div className="pt-2 border-t border-[#E8E5DE]">
                  <Link
                    to="/explore"
                    onClick={() => setExploreDropdownOpen(false)}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#171717] hover:bg-[#F4F3EF] transition-colors"
                  >
                    <span>Browse All Career Paths Catalog</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#526B50]" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right: Action Controls & User Profile */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          <Link to="/dashboard">
            <Button
              variant="secondary"
              size="sm"
              className="gap-1.5 text-xs font-bold border-[#171717] bg-white hover:bg-[#F4F3EF] text-[#171717] shadow-[2px_2px_0px_#171717]"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#526B50]" />
              <span>My Workspace</span>
            </Button>
          </Link>

          <div className="flex items-center gap-2 pl-1 border-l border-[#E8E5DE]">
            <Link
              to="/dashboard/settings"
              title="View Settings & Data Backup"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EDF2E9] border border-[#A8B99A] text-xs font-bold text-[#526B50] hover:bg-[#DDF5C5] transition-colors"
            >
              <User className="w-3 h-3" />
              <span className="max-w-[110px] truncate">{userName || 'My FOYC'}</span>
            </Link>
          </div>

          <Link to="/onboarding">
            <Button
              variant="primary"
              size="sm"
              className="gap-1.5 text-xs font-bold bg-[#FFE76B] hover:bg-[#FADB3D] text-[#171717] border border-[#171717] shadow-[2px_2px_0px_#171717]"
            >
              <span>Find My Direction</span>
              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu toggle (Visible below md) */}
        <div className="flex md:hidden items-center gap-2">
          <Link to="/dashboard">
            <Button
              variant="secondary"
              size="sm"
              className="text-xs px-3 py-1.5 border border-[#171717] bg-white text-[#171717] font-bold"
            >
              Dashboard
            </Button>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="p-2 rounded-xl bg-white border border-[#E8E5DE] shadow-xs active:bg-[#F4F3EF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#171717]" /> : <Menu className="w-5 h-5 text-[#171717]" />}
          </button>
        </div>
      </div>

      {/* Accessible Responsive Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-x-0 top-16 sm:top-18 md:top-20 bottom-0 z-50 bg-black/40 backdrop-blur-sm md:hidden overflow-y-auto animate-fadeIn"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="bg-[#FFFDF8] border-b border-[#E8E5DE] px-5 py-6 flex flex-col gap-2 shadow-2xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[11px] font-black uppercase tracking-wider text-[#888888] px-2 mb-1">
              Menu
            </div>

            {/* 1. Home */}
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-between ${
                isCurrent('/')
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'text-[#171717] bg-[#FAF8F5] hover:bg-[#F0EEEA] border border-[#E8E5DE]'
              }`}
            >
              <span>Home</span>
              {isCurrent('/') && <span className="text-xs font-mono font-bold text-[#FFE76B]">Active</span>}
            </Link>

            {/* 2. About Us */}
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-between ${
                isCurrent('/about')
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'text-[#171717] bg-[#FAF8F5] hover:bg-[#F0EEEA] border border-[#E8E5DE]'
              }`}
            >
              <span>About Us</span>
              {isCurrent('/about') && <span className="text-xs font-mono font-bold text-[#FFE76B]">Active</span>}
            </Link>

            {/* 3. Habit Tracker */}
            <Link
              to="/habit-tracker"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-between ${
                isCurrent('/habit-tracker')
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'text-[#171717] bg-[#FAF8F5] hover:bg-[#F0EEEA] border border-[#E8E5DE]'
              }`}
            >
              <span>Habit Tracker</span>
              {isCurrent('/habit-tracker') && <span className="text-xs font-mono font-bold text-[#FFE76B]">Active</span>}
            </Link>

            {/* 4. Explore Tools Section */}
            <div className="mt-2 pt-2 border-t border-[#E8E5DE]">
              <div className="text-[11px] font-black uppercase tracking-wider text-[#888888] px-2 mb-2">
                Explore Discovery Tools
              </div>
              <div className="space-y-2">
                {exploreTools.map((tool) => {
                  const active = isCurrent(tool.path);
                  const ToolIcon = tool.icon;
                  return (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                        active
                          ? 'bg-[#171717] text-white border-[#171717]'
                          : 'bg-white border-[#E8E5DE]'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                          active
                            ? 'bg-white/20 border-white/30 text-white'
                            : `${tool.bgColor} ${tool.borderColor} ${tool.iconColor}`
                        }`}
                      >
                        <ToolIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black">{tool.title}</div>
                        <div
                          className={`text-[10px] truncate ${
                            active ? 'text-gray-300' : 'text-[#666666]'
                          }`}
                        >
                          {tool.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Workspace & Direction Action Area */}
            <div className="pt-4 mt-2 border-t border-[#E8E5DE] flex flex-col gap-2.5">
              <div className="p-3.5 rounded-2xl bg-[#EDF2E9] border border-[#A8B99A] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#526B50]">
                    <User className="w-4 h-4" />
                    <span>{userName || 'My FOYC'}</span>
                  </div>
                </div>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="secondary"
                    fullWidth
                    size="sm"
                    className="border-[#171717] bg-white text-[#171717] font-bold text-xs"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 mr-1 text-[#526B50]" />
                    Open My Workspace
                  </Button>
                </Link>
              </div>

              <Link to="/onboarding" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="primary"
                  fullWidth
                  size="md"
                  className="gap-2 justify-center bg-[#FFE76B] text-[#171717] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-black text-xs min-h-[44px]"
                >
                  <span>Find My Direction</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;
