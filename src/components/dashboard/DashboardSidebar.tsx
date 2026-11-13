import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  Milestone as MilestoneIcon,
  Layers,
  CheckSquare,
  Flame,
  FolderGit2,
  BookOpen,
  CalendarCheck,
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

  // 10 Official Dashboard Navigation Modules (Section 12)
  const navItems = [
    { label: 'Overview', to: '/dashboard', icon: LayoutDashboard, end: true },
    { label: 'My Career', to: '/dashboard/career', icon: Target },
    { label: 'My Roadmap', to: '/dashboard/roadmap', icon: MilestoneIcon },
    { label: 'Skill Development', to: '/dashboard/skills', icon: Layers },
    { label: 'My Checklist', to: '/dashboard/tasks', icon: CheckSquare },
    { label: 'Habit Tracker', to: '/dashboard/habits', icon: Flame },
    { label: 'Projects', to: '/dashboard/projects', icon: FolderGit2 },
    { label: 'Resources', to: '/dashboard/resources', icon: BookOpen },
    { label: 'Weekly Review', to: '/dashboard/review', icon: CalendarCheck },
    { label: 'Settings', to: '/dashboard/settings', icon: Settings },
  ];

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
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#17172B] text-white border-r-3 border-[#17172B] flex flex-col justify-between transition-all duration-300 ${
          mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-20' : 'lg:w-72'}`}
      >
        {/* Top Header */}
        <div>
          <div className="h-20 px-4 flex items-center justify-between border-b border-[#2C2C4E]">
            <Link to="/" className="flex items-center gap-2 overflow-hidden py-1">
              {!collapsed ? (
                <Logo size="md" variant="dark" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-white border-2 border-[#B8E986] flex items-center justify-center font-black text-sm text-[#17172B]">
                  F
                </div>
              )}
            </Link>

            {/* Desktop collapse toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-8 h-8 rounded-lg bg-[#252542] hover:bg-[#323254] items-center justify-center text-white/70 hover:text-white border border-[#3E3E66] transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-175px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      isActive
                        ? 'bg-[#B8E986] text-[#17172B] shadow-[2px_2px_0px_#FFFFFF] border border-white'
                        : 'text-white/70 hover:text-white hover:bg-[#252542]'
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
        <div className="p-3 border-t border-[#2C2C4E]">
          {!collapsed ? (
            <div className="bg-[#21213A] p-3 rounded-xl border border-[#323254] flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <span className="text-xs font-bold text-white truncate block">
                  {dashboardData.profile.preferredName || 'Explorer'}
                </span>
                <span className="text-[10px] text-[#B8E986] truncate block font-bold">
                  {dashboardData.direction.primaryTitle}
                </span>
              </div>
              <Link to="/" title="Exit to Home">
                <button className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-9 h-9 rounded-xl bg-[#21213A] border border-[#3E3E66] flex items-center justify-center font-black text-xs text-[#B8E986]">
                {dashboardData.profile.preferredName?.[0] || 'E'}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
