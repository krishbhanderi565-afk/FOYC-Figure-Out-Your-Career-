import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { House, Compass, CalendarCheck, LayoutDashboard, UserRound } from 'lucide-react';
import { useCareer } from '../../context/CareerContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, dashboardData } = useCareer();

  // Don't show bottom nav on full-screen onboarding flows where focused progression is desired
  const isExcludedFlow = ['/onboarding', '/reflection', '/prompt-ready'].includes(location.pathname);
  if (isExcludedFlow) {
    return null;
  }

  // Habits with pending check-in today
  const pendingHabitsToday = dashboardData.habits.filter((h) => !h.completedToday).length;

  const navItems = [
    {
      to: '/',
      label: 'Home',
      icon: House,
      exact: true,
      badge: null,
    },
    {
      to: '/explore',
      label: 'Explore',
      icon: Compass,
      exact: false,
      badge: null,
    },
    {
      to: '/habit-tracker',
      label: 'Habits',
      icon: CalendarCheck,
      exact: false,
      badge: pendingHabitsToday > 0 ? pendingHabitsToday : null,
    },
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      exact: false,
      badge: null,
    },
    {
      to: isAuthenticated ? '/dashboard/settings' : '/auth',
      label: 'Profile',
      icon: UserRound,
      exact: false,
      badge: null,
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FFFDF8]/95 backdrop-blur-md border-t border-[#E8E5DE] shadow-[0_-2px_12px_rgba(0,0,0,0.06)] px-2 pt-1.5 pb-[max(env(safe-area-inset-bottom),0.5rem)] transition-all"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center justify-around">
        {navItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));

          const IconComponent = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 active:scale-95 relative ${
                isActive
                  ? 'text-[#171717]'
                  : 'text-[#777777] hover:text-[#171717]'
              }`}
            >
              {/* Active Indicator Background Pill */}
              <div
                className={`relative p-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-[#FFE76B] border border-[#171717] shadow-xs'
                    : 'bg-transparent'
                }`}
              >
                <IconComponent className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />

                {/* Dot badge if any */}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#526B50] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#FFFDF8]">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] tracking-tight mt-0.5 leading-none transition-colors ${
                  isActive ? 'font-black text-[#171717]' : 'font-semibold text-[#666666]'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
