import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Route,
  GraduationCap,
  ListTodo,
  CalendarCheck,
  FolderGit2,
  Library,
  RotateCcw,
  Settings,
  Compass,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { Logo } from '../common/Logo';
import { DASHBOARD_MODULE_REGISTRY } from '../../types/moduleRegistry';

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
  const { dashboardData, dashboardConfig, userName, userEmail, signOut, isDemoMode, exitDemoMode } = useCareer();
  const navigate = useNavigate();

  const selectedModules = dashboardConfig?.selected_modules || [
    'personal_vision',
    'career_roadmap',
    'daily_priorities',
    'habit_tracker',
  ];

  // Count active / pending tasks for the badge
  const pendingTasksCount = (dashboardData?.tasks || []).filter((t) => !t.completed).length;

  // Primary navigation items mapped to module IDs
  const allNavItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      to: '/dashboard',
      icon: LayoutDashboard,
      end: true,
      alwaysShow: true,
      badge: null,
    },
    {
      id: 'daily_priorities',
      label: 'Tasks',
      to: '/dashboard/tasks',
      icon: ListTodo,
      badge: pendingTasksCount > 0 ? (pendingTasksCount > 9 ? '9+' : `${pendingTasksCount}`) : null,
    },
    {
      id: 'career_roadmap',
      label: 'Roadmap',
      to: '/dashboard/roadmap',
      icon: Route,
      badge: null,
    },
    {
      id: 'habit_tracker',
      label: 'Habits',
      to: '/dashboard/habits',
      icon: CalendarCheck,
      badge: null,
    },
    {
      id: 'skills_learning',
      label: 'Skills',
      to: '/dashboard/skills',
      icon: GraduationCap,
      badge: null,
    },
    {
      id: 'personal_vision',
      label: 'My Direction',
      to: '/dashboard/career',
      icon: Compass,
      badge: null,
    },
    {
      id: 'projects',
      label: 'Projects',
      to: '/dashboard/projects',
      icon: FolderGit2,
      badge: null,
    },
    {
      id: 'resources',
      label: 'Resources',
      to: '/dashboard/resources',
      icon: Library,
      badge: null,
    },
    {
      id: 'weekly_review',
      label: 'Review',
      to: '/dashboard/review',
      icon: RotateCcw,
      badge: null,
    },
  ];

  // Filter based on selected modules
  const menuNavItems = allNavItems.filter((item) => {
    if (item.alwaysShow) return true;
    return selectedModules.includes(item.id);
  });

  const generalNavItems = [
    { label: 'Settings', to: '/dashboard/settings', icon: Settings },
    { label: 'Explore Tools', to: '/clarity-compass', icon: Sparkles },
  ];

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
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#171717] text-white border-r border-[#262626] flex flex-col justify-between transition-all duration-300 ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Top Header & Navigation */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo & Collapse */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-[#262626] shrink-0">
            <Link to="/" className="flex items-center gap-2 overflow-hidden py-1">
              {!collapsed ? (
                <Logo size="sm" variant="dark" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-[#262626] border border-[#3E3E3E] flex items-center justify-center font-black text-xs text-[#FFE76B]">
                  F
                </div>
              )}
            </Link>

            {/* Desktop collapse toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-7 h-7 rounded-lg bg-[#262626] hover:bg-[#333333] items-center justify-center text-white/70 hover:text-white border border-[#3E3E3E] transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Scrollable Navigation Body */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {/* SECTION: MENU */}
            <div>
              {!collapsed && (
                <span className="block px-3 text-[10px] font-black uppercase tracking-wider text-stone-400 mb-2">
                  Menu
                </span>
              )}
              <nav className="space-y-1">
                {menuNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                          isActive
                            ? 'bg-[var(--foyc-theme-sidebar-active-bg,#171717)] text-white shadow-xs font-bold border border-white/20'
                            : 'text-stone-300 hover:text-white hover:bg-stone-900'
                        }`
                      }
                      title={collapsed ? item.label : undefined}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className="w-4 h-4 shrink-0 text-stone-300 group-hover:text-white" />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!collapsed && item.badge && (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-[#526B50] text-white">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* SECTION: GENERAL */}
            <div>
              {!collapsed && (
                <span className="block px-3 text-[10px] font-black uppercase tracking-wider text-stone-400 mb-2">
                  General
                </span>
              )}
              <nav className="space-y-1">
                {generalNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                          isActive
                            ? 'bg-stone-800 text-white font-bold'
                            : 'text-stone-300 hover:text-white hover:bg-stone-900'
                        }`
                      }
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="w-4 h-4 shrink-0 text-stone-300 group-hover:text-white" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </NavLink>
                  );
                })}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-all text-left"
                  title={collapsed ? 'Sign Out' : undefined}
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>{isDemoMode ? 'Exit Demo' : 'Logout'}</span>}
                </button>
              </nav>
            </div>

            {/* Bottom Donezo-style Card */}
            {!collapsed && (
              <div className="pt-2">
                <div className="rounded-2xl p-4 bg-gradient-to-br from-stone-900 via-stone-900 to-[#1f2d1e] border border-stone-800 text-white shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#526B50]/20 rounded-full blur-xl pointer-events-none" />
                  <div className="w-8 h-8 rounded-lg bg-[#526B50]/40 flex items-center justify-center mb-2.5 border border-[#526B50]/50">
                    <Smartphone className="w-4 h-4 text-[#FFE76B]" />
                  </div>
                  <h4 className="text-xs font-black tracking-tight text-white mb-0.5">Dual Experience</h4>
                  <p className="text-[11px] text-stone-400 leading-snug mb-3">
                    Desktop powerhouse or mobile app experience on any smartphone browser.
                  </p>
                  <Link
                    to="/clarity-compass"
                    className="inline-flex items-center justify-center w-full px-3 py-1.5 rounded-xl bg-[#526B50] hover:bg-[#435941] text-white text-xs font-black transition-colors"
                  >
                    Clarity Compass
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Profile Mini Footer */}
        <div className="p-3 border-t border-[#262626] shrink-0">
          {!collapsed ? (
            <div className="bg-stone-900/90 p-2.5 rounded-xl border border-stone-800 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <span className="text-xs font-bold text-white truncate block">
                  {userName || userEmail?.split('@')[0] || 'User'}
                </span>
                <span className="text-[10px] text-stone-400 truncate block font-medium">
                  {dashboardConfig?.dashboard_title || 'Career Workspace'}
                </span>
              </div>
              <Link to="/" title="Exit to Home" className="text-stone-400 hover:text-white p-1">
                <Compass className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center font-bold text-xs text-[#FFE76B]">
                {(userName || userEmail || 'U')[0].toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
