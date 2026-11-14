import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Mail,
  Palette,
  SlidersHorizontal,
  Check,
  ChevronDown,
  User,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { DASHBOARD_THEMES, DashboardThemeId } from '../../types/moduleRegistry';
import { Link } from 'react-router-dom';

interface DashboardHeaderProps {
  onOpenMobileMenu: () => void;
  title?: string;
  subtitle?: string;
  onOpenModuleSettings?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onOpenMobileMenu,
  title,
  subtitle,
  onOpenModuleSettings,
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
  } = useCareer();

  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setShowThemeMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut ⌘F / Ctrl+F focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const themeList = Object.values(DASHBOARD_THEMES);

  return (
    <header className="sticky top-0 z-30 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#E8E5DE] px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Donezo-style search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenMobileMenu}
          aria-label="Open sidebar"
          className="lg:hidden p-2 rounded-xl bg-white border border-[#E8E5DE] shadow-xs shrink-0"
        >
          <Menu className="w-5 h-5 text-[#171717]" />
        </button>

        {/* Search input with ⌘F badge */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search task, goal, skill..."
            className="w-full pl-9.5 pr-14 py-2 text-xs font-semibold bg-white rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 shadow-2xs placeholder:text-stone-400 text-stone-900"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[10px] font-black text-stone-500 bg-stone-100 border border-stone-300 rounded-md">
              ⌘F
            </kbd>
          </div>
        </div>
      </div>

      {/* Right side: Notifications, Theme Switcher, and Real Profile */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Demo Mode Notice */}
        {isDemoMode && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-black">
            <span>[DEMO MODE]</span>
            <button
              onClick={exitDemoMode}
              className="underline hover:text-amber-950 font-bold ml-1 cursor-pointer"
            >
              Exit Demo
            </button>
          </div>
        )}

        {/* Theme Picker Dropdown */}
        <div className="relative" ref={themeMenuRef}>
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            title="Change color theme"
            className="p-2 rounded-xl bg-white border border-stone-200 hover:border-stone-900 shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <div
              className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-xs"
              style={{ backgroundColor: DASHBOARD_THEMES[currentTheme]?.badgeColor || '#526B50' }}
            />
            <ChevronDown className="w-3 h-3 text-stone-500" />
          </button>

          {showThemeMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border-2 border-stone-900 shadow-xl p-2 z-50 animate-scaleUp">
              <span className="block px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-stone-500">
                Workspace Theme
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
                        isSelected ? 'bg-stone-100 text-stone-900' : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-stone-300"
                          style={{ backgroundColor: th.badgeColor }}
                        />
                        <span>{th.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-stone-900" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action icons: Notification Bell */}
        <button
          title="Notifications"
          className="p-2 rounded-xl bg-white border border-stone-200 hover:border-stone-400 text-stone-600 hover:text-stone-900 transition-colors hidden sm:flex shadow-2xs"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Real User Profile Pill (Donezo Header Style) */}
        <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-stone-200">
          <div className="w-9 h-9 rounded-full bg-stone-900 text-white border-2 border-white shadow-sm flex items-center justify-center font-black text-xs shrink-0 overflow-hidden">
            {userAvatar ? (
              <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{(userName || userEmail || 'U')[0].toUpperCase()}</span>
            )}
          </div>
          <div className="text-left hidden md:block">
            <span className="block text-xs font-black text-stone-900 leading-tight truncate max-w-[140px]">
              {userName || userEmail?.split('@')[0] || 'User'}
            </span>
            <span className="block text-[11px] text-stone-500 font-medium leading-tight truncate max-w-[140px]">
              {userEmail || 'Personal Account'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
