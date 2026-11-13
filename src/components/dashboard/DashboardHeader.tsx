import React from 'react';
import { Menu, Sparkles, RefreshCw, ChevronDown } from 'lucide-react';
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
    <header className="sticky top-0 z-30 bg-[#FFF8E9]/95 backdrop-blur-md border-b-2 border-[#17172B] px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          aria-label="Open sidebar"
          className="lg:hidden p-2 rounded-xl bg-white border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B]"
        >
          <Menu className="w-5 h-5 text-[#17172B]" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#17172B] tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs font-semibold text-[#17172B]/60 truncate hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Universal Personalization Engine Switcher & Revisit button */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Universal Engine Switcher */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B]">
          <Sparkles className="w-4 h-4 text-[#D97706] shrink-0" />
          <span className="text-[11px] font-black uppercase text-[#17172B]/60 hidden md:inline">
            Role Preset:
          </span>
          <select
            value={activeProfessionId}
            onChange={(e) => loadSampleProfession(e.target.value)}
            className="text-xs font-extrabold bg-transparent text-[#17172B] focus:outline-none cursor-pointer"
          >
            {SAMPLE_HANDOFFS.map((sample) => (
              <option key={sample.id} value={sample.id}>
                {sample.role}
              </option>
            ))}
          </select>
        </div>

        {/* Revisit Direction button */}
        <Link to="/reflection">
          <button
            className="px-3 py-1.5 rounded-xl bg-[#FFFDF7] hover:bg-[#FFE76B] border-2 border-[#17172B] text-xs font-bold text-[#17172B] shadow-[2px_2px_0px_#17172B] flex items-center gap-1.5 transition-all"
            title="Revisit or adjust your career reflection"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Revisit Direction</span>
          </button>
        </Link>
      </div>
    </header>
  );
};
