import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Play } from 'lucide-react';
import { Highlight } from '../common/Highlight';
import { Button } from '../common/Button';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-8 pb-14 md:pt-12 md:pb-16 overflow-hidden bg-[#FDF5EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline, Subtitle and CTAs matching the reference */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 border-[#171717] bg-white shadow-[2px_2px_0px_#171717]">
              <Compass className="w-4 h-4 text-[#171717]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#171717]">
                FOYC • Career Discovery & Clarity
              </span>
            </div>

            {/* Bold Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#171717] leading-[1.12] sm:leading-[1.08] tracking-tight">
              Confused about <br />
              your career? <br />
              <div className="mt-2 inline-block">
                <span className="inline-block px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-2xl bg-[#FFE76B] border-2 border-[#171717] shadow-[3px_3px_0px_#171717] text-[#171717]">
                  Let's figure it out.
                </span>
              </div>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-[#333333] font-semibold leading-relaxed max-w-xl">
              FOYC helps you understand your interests, explore career possibilities and turn your confusion into a personalized action plan.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
              <Link to="/onboarding" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto gap-2.5 text-sm sm:text-base font-black px-6 py-3 rounded-full bg-[#FFE76B] hover:bg-[#FADB3D] text-[#171717] border-2 border-[#171717] shadow-[3px_3px_0px_#171717] transition-all hover:-translate-y-0.5 justify-center min-h-[48px]"
                >
                  <span>Find My Direction</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Button>
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center sm:justify-start gap-2.5 px-4 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-[#171717] hover:text-[#526B50] transition-colors group min-h-[44px]"
              >
                <div className="w-8 h-8 rounded-full bg-[#171717] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
                <span>How FOYC Works</span>
              </a>
            </div>
          </div>

          {/* Right Column: High-Res Hero Illustration matching reference image */}
          <div className="lg:col-span-6 flex justify-center items-center mt-2 lg:mt-0">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-none">
              <img
                src="/assets/foyc_hero_illustration.jpg"
                alt="FOYC Career Discovery Illustration — Explore Technology, Business, Science, Data & Analytics, and Arts"
                className="w-full h-auto max-h-[340px] sm:max-h-[440px] lg:max-h-[560px] object-contain rounded-2xl mx-auto drop-shadow-sm"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
