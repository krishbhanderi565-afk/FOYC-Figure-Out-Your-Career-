import React from 'react';
import { Highlight } from '../common/Highlight';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { ArrowRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CtaSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-[#FFF8E9] border-t-3 border-[#17172B]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card
          variant="yellow"
          shadowSize="lg"
          className="p-8 sm:p-14 lg:p-20 text-center relative overflow-hidden flex flex-col items-center justify-center"
        >
          {/* Subtle background decoration */}
          <div className="w-16 h-16 rounded-2xl bg-white border-2 border-[#17172B] shadow-[3px_3px_0px_#17172B] flex items-center justify-center mb-6">
            <Compass className="w-9 h-9 text-[#17172B]" />
          </div>

          <span className="text-xs font-black uppercase tracking-widest text-[#17172B]/80 mb-3 bg-white px-3.5 py-1 rounded-full border border-[#17172B]">
            From Confusion to Clarity
          </span>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#17172B] tracking-tight max-w-3xl leading-[1.1] mb-6">
            Your future doesn't need to be figured out all at once.{' '}
            <span className="underline decoration-white decoration-4 underline-offset-4">
              Let's find your next step.
            </span>
          </h2>

          <p className="text-base sm:text-xl text-[#17172B]/85 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Take 2 minutes to describe what's currently on your mind. Walk away with an actionable, personalized career roadmap today.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link to="/onboarding" className="w-full sm:w-auto">
              <Button variant="dark" size="lg" fullWidth className="gap-3 text-lg py-4 px-9 group">
                <Compass className="w-5 h-5 text-[#FFE76B] group-hover:rotate-12 transition-transform" />
                Find My Direction Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" fullWidth className="text-lg py-4 px-9">
                Explore Demo Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
};
