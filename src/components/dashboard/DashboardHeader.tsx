import React from 'react';
import { Menu, Compass, RefreshCw, ChevronDown } from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { SAMPLE_HANDOFFS } from '../../utils/sampleHandoffs';
import { Link } from 'react-router-dom';

interface DashboardHeaderProps {
  onOpenMobileMenu: () => void;
  title: string;
  subtitle?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onOpenMobileMenu,
  title,
  subtitle,
}) => {
  const { dashboardData, activeProfessionId, loadSampleProfession } = useCareer();

  return (
    <header className="sticky top-0 z-30 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#E8E5DE] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          aria-label="Open sidebar"
          className="lg:hidden p-2 rounded-xl bg-white border border-[#E8E5DE] shadow-xs"
        >
          <Menu className="w-5 h-5 text-[#171717]" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs font-semibold text-[#666666] truncate hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Universal Personalization Engine Switcher & Revisit button */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Universal Engine Switcher */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#E8E5DE] shadow-xs">
          <Compass className="w-3.5 h-3.5 text-[#526B50] shrink-0" />
          <span className="text-[11px] font-bold uppercase text-[#666666] hidden md:inline">
            Role Preset:
          </span>
          <select
            value={activeProfessionId}
            onChange={(e) => loadSampleProfession(e.target.value)}
            className="text-xs font-black text-[#171717] bg-transparent focus:outline-none cursor-pointer pr-1"
          >
            {SAMPLE_HANDOFFS.map((sp) => (
              <option key={sp.id} value={sp.id}>
                {sp.role}
              </option>
            ))}
          </select>
        </div>

        <Link
          to="/import"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#171717] bg-[#F4F3EF] hover:bg-[#E8E5DE] border border-[#E8E5DE] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#526B50]" />
          <span>New Plan</span>
        </Link>
      </div>
    </header>
  );
};
