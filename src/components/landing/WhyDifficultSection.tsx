import React from 'react';
import { Highlight } from '../common/Highlight';
import { Card } from '../common/Card';
import { XCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';

export const WhyDifficultSection: React.FC = () => {
  const comparisons = [
    {
      broken: 'Takes a 5-minute generic quiz that labels you a "Strategist" or "Explorer" without any practical next step.',
      foyc: 'Listens to your raw thoughts, struggles, and real life constraints through an open-ended conversational reflection.',
    },
    {
      broken: 'Assumes you must pick one career for the rest of your life and stick with it regardless of market evolution.',
      foyc: 'Treats career planning as an iterative, living roadmap with built-in weekly reviews and reassessment milestones.',
    },
    {
      broken: 'Locks your plan inside a walled garden or pushes expensive paid bootcamps and upsells.',
      foyc: 'Provides an open, transparent ChatGPT prompt and structured handoff that you own, modify, and keep forever.',
    },
    {
      broken: 'Hands you an overwhelming list of 500 course links and leaves you to figure out what actually matters.',
      foyc: 'Translates goals into daily habit loops, high-priority milestones, and verifiable proof-of-work capstone projects.',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#FFFDF7] border-t-3 border-[#17172B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#17172B]/60 bg-white px-3 py-1 rounded-full border-2 border-[#17172B] inline-block mb-4 shadow-[1.5px_1.5px_0px_#17172B]">
            The Core Difference
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#17172B] tracking-tight leading-[1.15] mb-4">
            Why traditional career advice <Highlight color="#FFD9E8">fails people.</Highlight>
          </h2>
          <p className="text-base sm:text-lg text-[#17172B]/75 font-medium">
            Most tools want to sell you courses or categorize you into a box. FOYC is built to help you make informed, confident choices.
          </p>
        </div>

        {/* Comparison Table / Matrix */}
        <div className="max-w-4xl mx-auto space-y-4">
          {comparisons.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-2 rounded-2xl border-2 border-[#17172B] overflow-hidden shadow-[4px_4px_0px_#17172B]"
            >
              {/* Broken Way */}
              <div className="bg-[#FFF5F5] p-6 border-b md:border-b-0 md:border-r-2 border-[#17172B] flex items-start gap-4">
                <div className="p-1 rounded-full bg-red-100 text-red-600 shrink-0 mt-0.5">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-red-700 block mb-1">
                    Traditional Career Advice
                  </span>
                  <p className="text-sm font-semibold text-[#17172B]/80 leading-relaxed">
                    {item.broken}
                  </p>
                </div>
              </div>

              {/* FOYC Way */}
              <div className="bg-[#F0FDF4] p-6 flex items-start gap-4">
                <div className="p-1 rounded-full bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 block mb-1">
                    The FOYC Approach
                  </span>
                  <p className="text-sm font-bold text-[#17172B] leading-relaxed">
                    {item.foyc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mid-page prompt */}
        <div className="mt-12 text-center">
          <Link to="/onboarding">
            <Button variant="primary" size="md" className="gap-2">
              Experience the FOYC Difference
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
