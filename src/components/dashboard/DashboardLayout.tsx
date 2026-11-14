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
      className="min-h-screen text-[#171717] flex flex-col lg:flex-row pb-20 lg:pb-0 relative overflow-x-hidden selection:bg-emerald-200"
      style={{
        background: 'var(--theme-bg-gradient, linear-gradient(135deg, #e8f9e7 0%, #c8f5c6 25%, #eafce6 60%, #baf2bb 100%))',
      }}
    >
      {/* Ambient background glow circles (matching visual reference 1) */}
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-white/30 blur-3xl pointer-events-none -z-0" />
      <div className="fixed bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-emerald-300/20 blur-3xl pointer-events-none -z-0" />

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
          collapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <Outlet context={{ onOpenMobileMenu: () => setMobileOpen(true) }} />
      </div>
    </div>
  );
};
