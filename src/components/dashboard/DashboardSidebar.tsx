import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Home,
  Briefcase,
  Route,
  ClipboardList,
  Flame,
  FolderKanban,
  BookOpen,
  Calendar,
  Settings,
  Compass,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { DASHBOARD_THEMES, DashboardThemeId } from '../../types/moduleRegistry';

interface DashboardSidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { dashboardConfig, currentTheme, setTheme } = useCareer();

  const selectedModules = dashboardConfig?.selected_modules || [
    'personal_vision',
    'career_roadmap',
    'daily_priorities',
    'habit_tracker',
    'projects',
    'resources',
    'weekly_review',
  ];

  // Navigation items matching Reference Image 1 exactly
  const allNavItems = [
    {
      id: 'overview',
      label: 'Overview',
      to: '/dashboard',
      icon: Home,
      end: true,
      alwaysShow: true,
    },
    {
      id: 'personal_vision',
      label: 'My Career',
      to: '/dashboard/career',
      icon: Briefcase,
    },
    {
      id: 'career_roadmap',
      label: 'My Roadmap',
      to: '/dashboard/roadmap',
      icon: Route,
    },
    {
      id: 'daily_priorities',
      label: 'Learning Checklist',
      to: '/dashboard/tasks',
      icon: ClipboardList,
    },
    {
      id: 'habit_tracker',
      label: 'Habit Tracker',
      to: '/dashboard/habits',
      icon: Flame,
    },
    {
      id: 'projects',
      label: 'Projects & Portfolio',
      to: '/dashboard/projects',
      icon: FolderKanban,
    },
    {
      id: 'resources',
      label: 'Learning Resources',
      to: '/dashboard/resources',
      icon: BookOpen,
    },
    {
      id: 'weekly_review',
      label: 'Weekly Review',
      to: '/dashboard/review',
      icon: Calendar,
    },
    {
      id: 'settings',
      label: 'Settings',
      to: '/dashboard/settings',
      icon: Settings,
      alwaysShow: true,
    },
  ];

  // Filter based on adaptive dashboard module configuration
  const navItems = allNavItems.filter((item) => {
    if (item.alwaysShow) return true;
    return selectedModules.includes(item.id);
  });

  const availableThemeSwatches: { id: DashboardThemeId; bg: string; border?: string }[] = [
    { id: 'green', bg: '#22C55E' },
    { id: 'blue', bg: '#3B82F6' },
    { id: 'sunset', bg: '#F97316' },
    { id: 'purple', bg: '#8B5CF6' },
    { id: 'red', bg: '#EF4444' },
    { id: 'black', bg: '#111827' },
    { id: 'white', bg: '#FFFFFF', border: '#D1D5DB' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container - Floating FinTrack Design */}
      <aside
        className={`fixed top-3 bottom-3 left-3 z-50 rounded-3xl flex flex-col justify-between transition-all duration-300 border shadow-[0_4px_24px_rgba(0,0,0,0.03)] ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
        style={{
          backgroundColor: 'var(--theme-sidebar-bg, #FFFFFF)',
          borderColor: 'var(--theme-sidebar-border, #EBE8DF)',
        }}
      >
        <div className="flex-1 flex flex-col min-h-0">
          {/* Top Logo & Branding (Reference 1) */}
          <div className="h-20 px-5 flex items-center justify-between shrink-0">
            <Link to="/" className="flex items-center gap-3 overflow-hidden py-1">
              {/* Compass circular badge */}
              <div className="w-10 h-10 rounded-full bg-white border border-emerald-400/60 shadow-xs flex items-center justify-center shrink-0 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-green-50 pointer-events-none" />
                <Compass className="w-6 h-6 text-emerald-600 transition-transform duration-300 group-hover:rotate-45" />
              </div>

              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-xl font-black text-stone-900 tracking-tight leading-none">
                    FOYC
                  </span>
                  <span className="text-[10px] font-bold text-stone-500 tracking-wide mt-1">
                    Figure Out Your Career
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop collapse toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-7 h-7 rounded-lg hover:bg-stone-200/50 items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-3.5 py-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl font-bold text-xs sm:text-[13px] transition-all group ${
                      isActive
                        ? 'shadow-xs font-black'
                        : 'text-stone-700 hover:text-stone-950 hover:bg-white/60'
                    }`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive
                      ? 'var(--theme-sidebar-active-bg, #bdf5bc)'
                      : undefined,
                    color: isActive
                      ? 'var(--theme-sidebar-active-text, #133e19)'
                      : undefined,
                  })}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: "Dream Bigger" Card & "Customize Theme" Swatches */}
        {!collapsed ? (
          <div className="p-3.5 space-y-3 shrink-0">
            {/* Dream Bigger Card (Reference 1) */}
            <div className="rounded-2xl p-4 bg-gradient-to-br from-white/90 to-emerald-50/80 border border-white/80 shadow-xs relative overflow-hidden backdrop-blur-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-base">⭐</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <h4 className="text-xs font-black text-stone-900 tracking-tight">Dream Bigger</h4>
              <p className="text-[11px] text-stone-500 font-semibold leading-tight mt-0.5">
                You're doing great! Keep going!
              </p>
              {/* Ascending curved arrow decoration */}
              <div className="absolute right-[-10px] bottom-[-10px] w-20 h-20 opacity-20 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-600">
                  <path
                    d="M10,80 Q50,75 80,20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <polygon points="70,15 85,18 82,33" fill="currentColor" />
                </svg>
              </div>
            </div>

            {/* Customize Theme circular swatches (Reference 1) */}
            <div className="px-1 py-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block mb-2">
                Customize Theme
              </span>
              <div className="flex items-center justify-between gap-1.5">
                {availableThemeSwatches.map((th) => {
                  const isSelected = currentTheme === th.id;
                  return (
                    <button
                      key={th.id}
                      onClick={() => setTheme(th.id)}
                      className={`w-5 h-5 rounded-full transition-transform hover:scale-110 cursor-pointer relative ${
                        isSelected
                          ? 'ring-2 ring-stone-900 ring-offset-2 scale-110 shadow-xs'
                          : 'shadow-2xs'
                      }`}
                      style={{
                        backgroundColor: th.bg,
                        border: th.border ? `1px solid ${th.border}` : '1px solid rgba(0,0,0,0.1)',
                      }}
                      title={th.id}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 flex flex-col items-center gap-2 shrink-0">
            <div
              className="w-7 h-7 rounded-full shadow-xs cursor-pointer border border-stone-300"
              style={{ backgroundColor: DASHBOARD_THEMES[currentTheme]?.badgeColor || '#22C55E' }}
              title="Current theme"
            />
          </div>
        )}
      </aside>
    </>
  );
};
