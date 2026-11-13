import React from 'react';
import { Highlight } from '../common/Highlight';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Shield, Lightbulb, Compass, Target, RefreshCw, Lock } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      title: 'Zero Pressure & Zero Judgment',
      desc: 'No forced quiz answers. No timer. You are allowed to be honest about feeling lost, uninspired, or scared without being sold a $5,000 course.',
      color: 'pink' as const,
      icon: Shield,
    },
    {
      title: 'Transparent AI Collaboration',
      desc: 'FOYC does not pretend to have an omniscient black-box algorithm. We give you full visibility and control over your discovery prompt and handoff data.',
      color: 'yellow' as const,
      icon: Lightbulb,
    },
    {
      title: 'Actionable Proof of Work',
      desc: 'Instead of handing you a list of 50 books to read, your plan translates directly into capstone projects that prove your real-world ability.',
      color: 'blue' as const,
      icon: Target,
    },
    {
      title: 'Iterative & Living Roadmaps',
      desc: 'Careers are not tattoos. You can revisit your assumptions, run weekly reflections, and shift focus without losing past accomplishments.',
      color: 'green' as const,
      icon: RefreshCw,
    },
    {
      title: 'Universal Personalization',
      desc: 'From software engineering and applied AI to product design, indie hacking, or clinical medicine, the dashboard engine adapts to your chosen path.',
      color: 'lavender' as const,
      icon: Compass,
    },
    {
      title: 'Privacy & Data Ownership',
      desc: 'Explore anonymously. No mandatory signup until you are ready to persist your living dashboard. Your data is never sold to recruiters or advertisers.',
      color: 'cream' as const,
      icon: Lock,
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#FFF8E9] border-t-3 border-[#17172B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="green" className="mb-4">
            Guaranteed Core Values
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#17172B] tracking-tight leading-[1.15] mb-4">
            Designed for human ambition, <Highlight color="#FFE76B">not algorithms.</Highlight>
          </h2>
          <p className="text-base sm:text-lg text-[#17172B]/80 font-medium">
            Everything in FOYC is built to give you genuine confidence and daily momentum.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <Card
                key={i}
                variant={b.color}
                shadowSize="md"
                interactive
                className="p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B] flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-[#17172B]" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#17172B] mb-3">
                    {b.title}
                  </h3>
                  <p className="text-sm text-[#17172B]/80 font-medium leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
