import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { LayoutDashboard, Milestone as MilestoneIcon, CheckSquare, Flame, Menu } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FCEEE9] flex flex-col lg:flex-row pb-20 lg:pb-0">
      {/* Sidebar (Desktop + Mobile Drawer) */}
      <DashboardSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}
      >
        <Outlet />
      </div>

      {/* Mobile Bottom Navigation Bar (First-class mobile experience) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#17172B] border-t-2 border-[#17172B] px-3 py-2 flex items-center justify-around shadow-2xl">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-black transition-colors ${
              isActive ? 'text-[#FFE76B]' : 'text-white/60 hover:text-white'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Overview</span>
        </NavLink>

        <NavLink
          to="/dashboard/roadmap"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-black transition-colors ${
              isActive ? 'text-[#FFE76B]' : 'text-white/60 hover:text-white'
            }`
          }
        >
          <MilestoneIcon className="w-5 h-5" />
          <span>Roadmap</span>
        </NavLink>

        <NavLink
          to="/dashboard/tasks"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-black transition-colors ${
              isActive ? 'text-[#FFE76B]' : 'text-white/60 hover:text-white'
            }`
          }
        >
          <CheckSquare className="w-5 h-5" />
          <span>Tasks</span>
        </NavLink>

        <NavLink
          to="/dashboard/habits"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-black transition-colors ${
              isActive ? 'text-[#FFE76B]' : 'text-white/60 hover:text-white'
            }`
          }
        >
          <Flame className="w-5 h-5" />
          <span>Habits</span>
        </NavLink>

        <button
          onClick={() => setMobileOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-black text-white/60 hover:text-white"
        >
          <Menu className="w-5 h-5" />
          <span>More</span>
        </button>
      </nav>
    </div>
  );
};
