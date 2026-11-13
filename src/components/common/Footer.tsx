import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, Compass } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="hidden md:block border-t border-[#333333] bg-[#171717] text-white pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link to="/" className="inline-block focus:outline-none">
              <Logo size="md" variant="dark" />
            </Link>
            <p className="font-bold text-[#FFE76B] text-base">
              From Career Confusion to Career Clarity.
            </p>
            <p className="text-xs text-white/70 max-w-sm leading-relaxed">
              FOYC helps people from any background or career stage explore real possibilities, identify skill gaps, and turn ambitions into a personalized career development plan.
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-[#171717] bg-[#EDF2E9] px-3 py-1.5 rounded-full border border-[#A8B99A] font-semibold w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-[#526B50]" />
              <span>Zero mandatory accounts • 100% private discovery</span>
            </div>
          </div>

          {/* Nav links 1 */}
          <div className="md:col-span-2 flex flex-col gap-2.5">
            <span className="font-bold text-xs uppercase tracking-wider text-[#A8B99A]">Journey</span>
            <Link to="/" className="text-xs text-white/80 hover:text-white transition-colors">Home</Link>
            <Link to="/explore" className="text-xs text-white/80 hover:text-white transition-colors">Explore Paths</Link>
            <Link to="/about" className="text-xs text-white/80 hover:text-white transition-colors">About FOYC</Link>
            <Link to="/onboarding" className="text-xs text-white/80 hover:text-white transition-colors">Start Discovery</Link>
            <Link to="/reflection" className="text-xs text-white/80 hover:text-white transition-colors">Mind Reflection</Link>
            <Link to="/prompt-ready" className="text-xs text-white/80 hover:text-white transition-colors">ChatGPT Coach Prompt</Link>
            <Link to="/import" className="text-xs text-white/80 hover:text-white transition-colors">Import Handoff</Link>
          </div>

          {/* Nav links 2 */}
          <div className="md:col-span-2 flex flex-col gap-2.5">
            <span className="font-bold text-xs uppercase tracking-wider text-[#A8B99A]">Dashboard</span>
            <Link to="/dashboard" className="text-xs text-white/80 hover:text-white transition-colors">Overview</Link>
            <Link to="/dashboard/roadmap" className="text-xs text-white/80 hover:text-white transition-colors">Career Roadmap</Link>
            <Link to="/dashboard/skills" className="text-xs text-white/80 hover:text-white transition-colors">Skill Development</Link>
            <Link to="/dashboard/tasks" className="text-xs text-white/80 hover:text-white transition-colors">Checklist</Link>
            <Link to="/dashboard/habits" className="text-xs text-white/80 hover:text-white transition-colors">Habit Tracker</Link>
            <Link to="/dashboard/projects" className="text-xs text-white/80 hover:text-white transition-colors">Projects</Link>
          </div>

          {/* Nav links 3 */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <span className="font-bold text-xs uppercase tracking-wider text-[#A8B99A]">Core Promise</span>
            <div className="bg-[#262626] p-4 rounded-xl border border-white/10">
              <p className="text-xs text-white/80 italic leading-relaxed">
                "Your future doesn't need to be figured out all at once. Let's find your next step together."
              </p>
            </div>
            <Link to="/onboarding" className="inline-flex items-center gap-1.5 font-bold text-xs text-[#FFE76B] hover:underline">
              <Compass className="w-3.5 h-3.5" />
              <span>Begin Your Exploration Free</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} FOYC (Figure Out Your Career). Built for clarity and progress.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Data Portability</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
