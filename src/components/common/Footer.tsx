import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-3 border-[#17172B] bg-[#17172B] text-[#FFF8E9] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#FFF8E9]/15">
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link to="/" className="inline-block focus:outline-none">
              <Logo size="md" variant="dark" />
            </Link>
            <p className="font-bold text-[#FFE76B] text-lg">
              From Career Confusion to Career Clarity.
            </p>
            <p className="text-sm text-[#FFF8E9]/70 max-w-sm leading-relaxed">
              FOYC helps people from any country, educational background or career stage explore real possibilities, identify skill gaps, and turn raw ambitions into a living, personalized career roadmap.
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-[#17172B] bg-[#B8E986] px-3.5 py-1.5 rounded-full border-2 border-[#17172B] font-bold shadow-[2px_2px_0px_#FFE76B] w-fit">
              <ShieldCheck className="w-4 h-4 text-[#17172B]" />
              <span>Zero mandatory accounts • 100% private discovery</span>
            </div>
          </div>

          {/* Nav links 1 */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <span className="font-bold text-xs uppercase tracking-widest text-[#FFE76B]">Journey</span>
            <Link to="/" className="text-sm text-[#FFF8E9]/80 hover:text-white transition-colors">Home</Link>
            <Link to="/onboarding" className="text-sm text-[#FFF8E9]/80 hover:text-white transition-colors">Start Discovery</Link>
            <Link to="/reflection" className="text-sm text-[#FFF8E9]/80 hover:text-white transition-colors">Mind Reflection</Link>
            <Link to="/prompt-ready" className="text-sm text-[#FFF8E9]/80 hover:text-white transition-colors">ChatGPT Coach Prompt</Link>
            <Link to="/import" className="text-sm text-[#FFF8E9]/80 hover:text-white transition-colors">Import Handoff</Link>
          </div>

          {/* Nav links 2 */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <span className="font-bold text-xs uppercase tracking-widest text-[#B8E986]">Dashboard</span>
            <Link to="/dashboard" className="text-sm text-[#FFF8E9]/80 hover:text-white transition-colors">Overview</Link>
            <Link to="/dashboard/roadmap" className="text-sm text-[#FFF8E9]/80 hover:text-white transition-colors">Career Roadmap</Link>
            <Link to="/dashboard/tasks" className="text-sm text-[#FFF8E9]/80 hover:text-white transition-colors">Learning Checklist</Link>
            <Link to="/dashboard/habits" className="text-sm text-[#FFF8E9]/80 hover:text-white transition-colors">Habit Tracker</Link>
            <Link to="/dashboard/projects" className="text-sm text-[#FFF8E9]/80 hover:text-white transition-colors">Projects & Portfolio</Link>
            <Link to="/dashboard/resources" className="text-sm text-[#FFF8E9]/80 hover:text-white transition-colors">Learning Resources</Link>
          </div>

          {/* Nav links 3 */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <span className="font-bold text-xs uppercase tracking-widest text-[#D7EAFE]">Core Promise</span>
            <div className="bg-[#21213A] p-4 rounded-xl border border-[#3A3A5E]">
              <p className="text-xs text-[#FFF8E9]/80 italic leading-relaxed">
                "Your future doesn't need to be figured out all at once. Let's find your next step together."
              </p>
            </div>
            <Link to="/onboarding" className="inline-flex items-center gap-2 font-bold text-sm text-[#FFE76B] hover:underline">
              <Sparkles className="w-4 h-4" />
              Begin Your Exploration Free
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFF8E9]/70">
          <p>© {new Date().getFullYear()} FOYC (Figure Out Your Career). Built with craft & empathy.</p>
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
