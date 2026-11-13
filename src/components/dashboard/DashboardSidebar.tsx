import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Compass,
  LayoutDashboard,
  Target,
  Milestone as MilestoneIcon,
  CheckSquare,
  Flame,
  FolderGit2,
  BookOpen,
  CalendarCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';

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
  const { logoutDemo, userEmail, dashboardData } = useCareer();

  const navItems = [
    { label: 'Overview', to: '/dashboard', icon: LayoutDashboard, end: true },
    { label: 'My Career', to: '/dashboard/career', icon: Target },
    { label: 'My Roadmap', to: '/dashboard/roadmap', icon: MilestoneIcon },
    { label: 'Learning Checklist', to: '/dashboard/tasks', icon: CheckSquare },
    { label: 'Habit Tracker', to: '/dashboard/habits', icon: Flame },
    { label: 'Projects & Portfolio', to: '/dashboard/projects', icon: FolderGit2 },
    { label: 'Learning Resources', to: '/dashboard/resources', icon: BookOpen },
    { label: 'Weekly Review', to: '/dashboard/review', icon: CalendarCheck },
    { label: 'Settings', to: '/dashboard/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#17172B] text-[#FFF8E9] border-r-3 border-[#17172B] flex flex-col justify-between transition-all duration-300 ${
          mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-20' : 'lg:w-72'}`}
      >
        {/* Top Header */}
        <div>
          <div className="h-20 px-4 flex items-center justify-between border-b border-[#2C2C4E]">
            <Link to="/" className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-[#FFE76B] border-2 border-white flex items-center justify-center shrink-0">
                <Compass className="w-6 h-6 text-[#17172B]" />
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="font-black text-xl text-white tracking-tighter">FOYC</span>
                  <span className="text-[10px] text-[#FFE76B] uppercase font-bold tracking-widest">
                    Career OS
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop collapse toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-8 h-8 rounded-lg bg-[#252542] hover:bg-[#323254] items-center justify-center text-white/70 hover:text-white border border-[#3E3E66]"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)]">
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
                        ? 'bg-[#FFE76B] text-[#17172B] shadow-[2px_2px_0px_#FFFFFF] border border-white'
                        : 'text-white/70 hover:text-white hover:bg-[#252542]'
                    }`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0" />
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
                <span className="text-[10px] text-[#DDF5C9] truncate block">
                  {dashboardData.direction.primaryTitle}
                </span>
              </div>
              <Link to="/" title="Exit to Home">
                <button className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-9 h-9 rounded-xl bg-[#21213A] border border-[#3E3E66] flex items-center justify-center font-black text-xs text-[#FFE76B]">
                {dashboardData.profile.preferredName?.[0] || 'E'}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
