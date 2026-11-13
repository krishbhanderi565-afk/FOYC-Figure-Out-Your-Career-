import React from 'react';
import { Compass, Sparkles, Target, ArrowRight, Lightbulb, Layers, ShieldCheck, CheckCircle } from 'lucide-react';
import { Button } from '../common/Button';

interface StageIntroProps {
  onStart: () => void;
  onPreviewSample?: () => void;
}

export const StageIntro: React.FC<StageIntroProps> = ({ onStart, onPreviewSample }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-center">
      {/* Brand Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 border-[#171717] bg-[#FFE76B] text-[#171717] shadow-[2px_2px_0px_#171717] mb-6">
        <Compass className="w-4 h-4 text-[#171717]" />
        <span className="text-xs font-black uppercase tracking-wider">
          FOYC Discovery Studio • Feature 02
        </span>
      </div>

      {/* Main Hero Headings */}
      <h1 className="text-3xl sm:text-5xl font-black text-[#171717] tracking-tight leading-tight mb-4">
        Let’s discover what possibilities{' '}
        <span className="underline decoration-[#FFE76B] decoration-wavy decoration-2">
          are waiting for you.
        </span>
      </h1>

      <p className="text-lg sm:text-xl font-bold text-[#526B50] max-w-2xl mx-auto mb-3">
        "Discover what you could become."
      </p>

      <p className="text-sm sm:text-base text-[#444] max-w-2xl mx-auto font-medium leading-relaxed mb-10">
        Tell us about yourself, where you stand today, and what interests you. We’ll help you uncover opportunities you might never have considered — spanning traditional careers, emerging fields, independent consulting, and hybrid crafts.
      </p>

      {/* 3 Benefit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left mb-12">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-6 border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#526B50]/15 text-[#526B50] flex items-center justify-center font-bold text-sm mb-4 border border-[#526B50]/30">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-[#171717] mb-2">
              1. Discover More
            </h3>
            <p className="text-xs text-[#555] leading-relaxed">
              Explore career and life opportunities beyond the obvious choices. Look past generic job titles to uncover unconventional, modern, and hybrid paths.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-bold text-[#526B50]">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>7 distinct career dimensions</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-6 border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#FFE76B] text-[#171717] flex items-center justify-center font-bold text-sm mb-4 border border-[#171717]/30">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-[#171717] mb-2">
              2. Find Your Fit
            </h3>
            <p className="text-xs text-[#555] leading-relaxed">
              Understand which possibilities genuinely align with your background, real constraints, available learning time, and true 3–5 year personal ambitions.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-bold text-[#171717]">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Honors real-life constraints</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-6 border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#171717] text-white flex items-center justify-center font-bold text-sm mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-[#171717] mb-2">
              3. Try Before You Decide
            </h3>
            <p className="text-xs text-[#555] leading-relaxed">
              Evaluate alternatives before committing money or months. Get bite-sized practical experiments to test the waters with zero friction or financial risk.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-bold text-[#526B50]">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Actionable low-risk tests</span>
          </div>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          type="button"
          onClick={onStart}
          className="w-full sm:w-auto px-9 py-4 rounded-xl bg-[#FFE76B] text-[#171717] font-extrabold text-base border-2 border-[#171717] shadow-[4px_4px_0px_#171717] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#171717] transition-all flex items-center justify-center gap-3"
        >
          <span>Explore My Possibilities</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {onPreviewSample && (
          <button
            type="button"
            onClick={onPreviewSample}
            className="text-xs font-bold text-[#555] hover:text-[#171717] underline decoration-1 underline-offset-4 py-2"
          >
            (Preview Sample Possibility Report)
          </button>
        )}
      </div>

      <p className="mt-6 text-xs text-[#777] flex items-center justify-center gap-1.5 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-[#526B50]" />
        <span>100% Free • Private Discovery • Zero mandatory account registration to start</span>
      </p>
    </div>
  );
};
