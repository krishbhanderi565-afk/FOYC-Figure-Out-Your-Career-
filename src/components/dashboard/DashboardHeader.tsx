import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  Sparkles,
  User,
  Check,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { DASHBOARD_THEMES, DashboardThemeId } from '../../types/moduleRegistry';
import { Link, useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  onOpenMobileMenu: () => void;
  title?: string;
  subtitle?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onOpenMobileMenu,
  title = 'Your career, in focus.',
  subtitle = 'Small steps today. A clearer future tomorrow.',
  searchQuery = '',
  onSearchChange,
}) => {
  const {
    userName,
    userEmail,
    userAvatar,
    currentTheme,
    setTheme,
    isDemoMode,
    exitDemoMode,
    signOut,
  } = useCareer();

  const navigate = useNavigate();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setShowThemeMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeList = Object.values(DASHBOARD_THEMES).filter(
    (th, idx, self) => idx === self.findIndex((t) => t.id === th.id)
  );

  const displayName = userName || userEmail?.split('@')[0] || 'Alex';
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    if (isDemoMode) {
      exitDemoMode();
      navigate('/');
    } else {
      await signOut();
      navigate('/');
    }
  };

  return (
    <header className="px-4 sm:px-8 pt-6 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-30">
      {/* Left: Mobile hamburger & Large Page Title (Reference 1) */}
      <div className="flex items-start gap-3">
        <button
          onClick={onOpenMobileMenu}
          aria-label="Open sidebar"
          className="lg:hidden p-2 rounded-xl bg-white/80 border border-white/80 shadow-xs shrink-0 mt-1"
        >
          <Menu className="w-5 h-5 text-stone-800" />
        </button>

        <div className="space-y-0.5">
          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-stone-900 tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-stone-600">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Search, Notifications, Theme Selector, User Avatar (Reference 1) */}
      <div className="flex items-center gap-3 sm:gap-4 self-end md:self-auto shrink-0">
        {/* Search bar with rounded glass pill */}
        <div className="relative w-48 sm:w-64 lg:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search insights, skills, or careers..."
            className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-white/85 backdrop-blur-md rounded-full border border-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-xs placeholder:text-stone-400 text-stone-900 transition-all"
          />
        </div>

        {/* Subtle vertical divider */}
        <div className="hidden sm:block h-6 w-px bg-stone-300/60" />

        {/* Notifications Icon with Red Badge (Reference 1) */}
        <div className="relative">
          <button
            title="Notifications"
            className="p-2.5 rounded-full bg-white/80 backdrop-blur-md border border-white/80 text-stone-700 hover:text-stone-900 shadow-xs transition-colors"
          >
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white shadow-xs">
            3
          </span>
        </div>

        {/* Theme Swatch Pill Dropdown (Reference 1) */}
        <div className="relative" ref={themeMenuRef}>
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            title="Change color theme"
            className="px-2.5 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-white/80 hover:border-emerald-300 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {/* 3 mini color dots inside pill */}
            <div className="flex items-center -space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 border border-white" />
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 border border-white" />
            </div>
            <ChevronDown className="w-3 h-3 text-stone-500" />
          </button>

          {showThemeMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl border border-white shadow-xl p-2 z-50 animate-scaleUp">
              <span className="block px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-stone-500">
                Workspace Palette
              </span>
              <div className="space-y-1">
                {themeList.map((th) => {
                  const isSelected = th.id === currentTheme;
                  return (
                    <button
                      key={th.id}
                      onClick={() => {
                        setTheme(th.id);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                        isSelected ? 'bg-emerald-50 text-emerald-900' : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full shadow-xs"
                          style={{
                            backgroundColor: th.badgeColor,
                            border: '1px solid rgba(0,0,0,0.1)',
                          }}
                        />
                        <span>{th.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Circle (Reference 1) */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-9 h-9 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-xs shadow-xs border-2 border-white hover:scale-105 transition-all cursor-pointer overflow-hidden"
          >
            {userAvatar ? (
              <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{initial}</span>
            )}
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl border border-white shadow-xl p-2 z-50 animate-scaleUp">
              <div className="px-3 py-2 border-b border-stone-100">
                <span className="block text-xs font-black text-stone-900 truncate">
                  {displayName}
                </span>
                <span className="block text-[11px] text-stone-500 font-medium truncate">
                  {userEmail || 'Personal Workspace'}
                </span>
              </div>

              <div className="pt-1 space-y-0.5">
                <Link
                  to="/dashboard/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Settings & Backup</span>
                </Link>

                {isDemoMode && (
                  <button
                    onClick={() => {
                      exitDemoMode();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-amber-700 hover:bg-amber-50 transition-colors text-left"
                  >
                    <span>Exit Persona Preview</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
