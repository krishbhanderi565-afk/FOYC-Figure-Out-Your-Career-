import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFF8E9] flex">
      {/* Sidebar */}
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
    </div>
  );
};
