import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  House,
  Compass,
  Route,
  GraduationCap,
  ListCheck,
  CalendarCheck,
  FolderKanban,
  Library,
  CalendarDays,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { Logo } from '../common/Logo';

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
  const { dashboardData } = useCareer();

  // 10 Official Dashboard Navigation Modules (Functional line icons from Section 3)
  const navItems = [
    { label: 'Overview', to: '/dashboard', icon: House, end: true },
    { label: 'My Career', to: '/dashboard/career', icon: Compass },
    { label: 'My Roadmap', to: '/dashboard/roadmap', icon: Route },
    { label: 'Skill Development', to: '/dashboard/skills', icon: GraduationCap },
    { label: 'My Checklist', to: '/dashboard/tasks', icon: ListCheck },
    { label: 'Habit Tracker', to: '/dashboard/habits', icon: CalendarCheck },
    { label: 'Projects', to: '/dashboard/projects', icon: FolderKanban },
    { label: 'Resources', to: '/dashboard/resources', icon: Library },
    { label: 'Weekly Review', to: '/dashboard/review', icon: CalendarDays },
    { label: 'Settings', to: '/dashboard/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#171717] text-white border-r border-[#333333] flex flex-col justify-between transition-all duration-300 ${
          mobileOpen ? 'translate-x-0 w-68' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-20' : 'lg:w-68'}`}
      >
        {/* Top Header */}
        <div>
          <div className="h-18 px-4 flex items-center justify-between border-b border-[#2B2B2B]">
            <Link to="/" className="flex items-center gap-2 overflow-hidden py-1">
              {!collapsed ? (
                <Logo size="sm" variant="dark" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-[#262626] border border-[#3E3E3E] flex items-center justify-center font-black text-xs text-white">
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

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-165px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                      isActive
                        ? 'bg-[#526B50] text-white shadow-xs font-bold'
                        : 'text-white/70 hover:text-white hover:bg-[#262626]'
                    }`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile Section */}
        <div className="p-3 border-t border-[#2B2B2B]">
          {!collapsed ? (
            <div className="bg-[#262626] p-3 rounded-xl border border-[#333333] flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <span className="text-xs font-bold text-white truncate block">
                  {dashboardData.profile.preferredName || 'Explorer'}
                </span>
                <span className="text-[10px] text-[#A8B99A] truncate block font-medium">
                  {dashboardData.direction.primaryTitle}
                </span>
              </div>
              <Link to="/" title="Exit to Home">
                <button className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-xl bg-[#262626] border border-[#3E3E3E] flex items-center justify-center font-bold text-xs text-[#A8B99A]">
                {dashboardData.profile.preferredName?.[0] || 'E'}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
