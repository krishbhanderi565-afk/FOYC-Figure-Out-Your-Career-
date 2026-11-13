import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Highlight } from '../common/Highlight';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const FinalCtaSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-[#FCEEE9] border-t-3 border-[#17172B]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card
          variant="yellow"
          shadowSize="lg"
          className="p-8 sm:p-14 text-center space-y-6 border-3 bg-[#FFE76B] relative overflow-hidden"
        >
          {/* Subtle decorative background circles */}
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-[#B8E986] border-2 border-[#17172B] opacity-60 pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-white border-2 border-[#17172B] opacity-60 pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2">
              <Badge variant="parrot" size="sm">
                Take the First Step
              </Badge>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#17172B] tracking-tight leading-[1.1]">
              Your next step starts with <Highlight color="#B8E986" rotate="1deg">clarity.</Highlight>
            </h2>

            <p className="text-base sm:text-lg text-[#17172B]/85 font-semibold max-w-xl mx-auto">
              Stop guessing your future through random tutorials. Get a personalized roadmap tailored to your strengths, time, and goals.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/onboarding" className="w-full sm:w-auto">
                <Button
                  variant="dark"
                  size="lg"
                  fullWidth
                  className="gap-3 font-black text-lg bg-[#17172B] text-white hover:bg-[#252542] shadow-[5px_5px_0px_#B8E986]"
                >
                  <Sparkles className="w-5 h-5 text-[#B8E986]" />
                  <span>Start My Journey</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2 text-xs font-bold text-[#17172B]/70">
              <ShieldCheck className="w-4 h-4 text-[#315B28]" />
              <span>100% Free • No signup required to begin</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
