import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ArrowRight, ShieldCheck, Compass } from 'lucide-react';

export const FinalCtaSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-[#FDF5EB] border-t border-[#E8E5DE]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card
          variant="yellow"
          shadowSize="lg"
          className="p-8 sm:p-14 text-center space-y-6 border-2 border-[#171717] bg-[#FFE76B] relative overflow-hidden"
        >
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#171717] text-xs font-black uppercase tracking-wider text-[#171717]">
                <Compass className="w-3.5 h-3.5" />
                Take the First Step
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#171717] tracking-tight leading-[1.1]">
              Your next step starts with clarity.
            </h2>

            <p className="text-base sm:text-lg text-[#333333] font-semibold max-w-xl mx-auto leading-relaxed">
              Stop guessing your future through random tutorials. Get a personalized roadmap tailored to your strengths, time, and goals.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/onboarding" className="w-full sm:w-auto">
                <Button
                  variant="dark"
                  size="lg"
                  className="gap-3 font-black text-base px-8 py-3.5 bg-[#171717] text-white hover:bg-[#333333] shadow-[4px_4px_0px_#526B50] rounded-full transition-transform hover:-translate-y-0.5"
                >
                  <Compass className="w-5 h-5 text-[#FFE76B]" />
                  <span>Start My Journey</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2 text-xs font-bold text-[#171717]/80">
              <ShieldCheck className="w-4 h-4 text-[#526B50]" />
              <span>100% Free • No signup required to begin</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
