import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Highlight } from '../common/Highlight';
import { HelpCircle, AlertTriangle, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react';

export const ProblemTensionSolutionSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      phase: 'PROBLEM',
      badge: 'Starting Point',
      badgeVariant: 'yellow' as const,
      cardVariant: 'white' as const,
      icon: HelpCircle,
      iconBg: 'bg-[#FFE76B]',
      iconColor: 'text-[#17172B]',
      headline: 'Multiple Interests, Zero Clear Path',
      text: 'You have interests in multiple fields, but you don\'t know which direction to choose.',
    },
    {
      step: '02',
      phase: 'TENSION',
      badge: 'Everyday Friction',
      badgeVariant: 'pink' as const, // Maps to light parrot green
      cardVariant: 'pink' as const,
      icon: AlertTriangle,
      iconBg: 'bg-[#B8E986]',
      iconColor: 'text-[#17172B]',
      headline: 'Conflicting Opinions & Shifting Markets',
      text: 'Everyone has a different opinion. New technologies keep changing the job market. You keep learning random things but still feel unsure about your future.',
    },
    {
      step: '03',
      phase: 'SOLUTION',
      badge: 'The FOYC Method',
      badgeVariant: 'blue' as const,
      cardVariant: 'blue' as const,
      icon: Lightbulb,
      iconBg: 'bg-[#D7EAFE]',
      iconColor: 'text-blue-900',
      headline: 'Objective Reflection & Concrete Gap Analysis',
      text: 'FOYC helps you understand yourself, explore suitable career directions and identify the skills and steps needed to move forward.',
    },
    {
      step: '04',
      phase: 'OUTCOME',
      badge: 'Living Clarity',
      badgeVariant: 'parrot' as const,
      cardVariant: 'parrot' as const,
      icon: CheckCircle2,
      iconBg: 'bg-[#B8E986]',
      iconColor: 'text-[#17172B]',
      headline: 'A Personal Career Command Centre',
      text: 'Leave with a personalized career roadmap, actionable checklist and habit tracker.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#FCEEE9] border-y-3 border-[#17172B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <Badge variant="parrot" size="sm">
            Why Traditional Advice Fails
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-[#17172B] tracking-tight">
            From Career Confusion to <Highlight color="#B8E986">Clear Momentum</Highlight>
          </h2>
          <p className="text-sm sm:text-base text-[#17172B]/80 font-semibold">
            Career decisions feel hard because you're forced to choose blindly. Here is how we untangle the knots.
          </p>
        </div>

        {/* 4 Compact Panels Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.phase} className="relative flex flex-col">
                <Card
                  variant={item.cardVariant}
                  shadowSize="md"
                  interactive
                  className="p-6 flex-1 flex flex-col justify-between space-y-4 border-2"
                >
                  <div className="space-y-4">
                    {/* Header: Phase badge & Sequence number */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-widest text-[#17172B] bg-[#17172B]/10 px-2 py-0.5 rounded-md">
                          {item.phase}
                        </span>
                        <Badge variant={item.badgeVariant} size="sm">
                          {item.badge}
                        </Badge>
                      </div>
                      <span className="text-2xl font-black text-[#17172B]/30 select-none">
                        {item.step}
                      </span>
                    </div>

                    {/* Icon & Title */}
                    <div className="space-y-2">
                      <div
                        className={`w-11 h-11 rounded-xl ${item.iconBg} border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B] flex items-center justify-center`}
                      >
                        <Icon className={`w-5 h-5 ${item.iconColor}`} />
                      </div>
                      <h3 className="font-extrabold text-base text-[#17172B] leading-snug">
                        {item.headline}
                      </h3>
                    </div>

                    {/* Short relatable scenario text */}
                    <p className="text-xs sm:text-sm text-[#17172B]/85 font-medium leading-relaxed">
                      "{item.text}"
                    </p>
                  </div>

                  {/* Visual flow indicator */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                      <div className="w-6 h-6 rounded-full bg-white border-2 border-[#17172B] shadow-[1px_1px_0px_#17172B] flex items-center justify-center">
                        <ArrowRight className="w-3 h-3 text-[#17172B]" />
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
