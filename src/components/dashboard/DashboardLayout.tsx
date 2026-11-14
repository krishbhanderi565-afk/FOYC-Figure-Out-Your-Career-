import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { useCareer } from '../../context/CareerContext';

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentTheme } = useCareer();

  return (
    <div
      className="min-h-screen text-[#1E293B] flex flex-col lg:flex-row pb-20 lg:pb-0 relative overflow-x-hidden selection:bg-emerald-200"
      style={{
        background: 'var(--theme-bg-canvas, #F8F6F0)',
      }}
    >
      {/* Subtle ambient warm-neutral background highlights */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-white/40 blur-3xl pointer-events-none -z-0" />
      <div className="fixed bottom-[-10%] left-[20%] w-[450px] h-[450px] rounded-full bg-amber-50/20 blur-3xl pointer-events-none -z-0" />

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <DashboardSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 relative z-10 ${
          collapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}
      >
        <Outlet context={{ onOpenMobileMenu: () => setMobileOpen(true) }} />
      </div>
    </div>
  );
};
