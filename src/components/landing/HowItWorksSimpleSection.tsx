import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Highlight } from '../common/Highlight';
import { UserCheck, MessageSquare, DownloadCloud, LayoutDashboard, ArrowRight } from 'lucide-react';

export const HowItWorksSimpleSection: React.FC = () => {
  const steps = [
    {
      number: '1',
      title: 'Tell us about yourself.',
      description: 'Share your background, situation, time availability, and what has been on your mind.',
      icon: UserCheck,
      color: 'bg-[#FFE76B]',
      badge: 'Step 1 • 2 mins',
      badgeColor: 'yellow' as const,
    },
    {
      number: '2',
      title: 'Explore your direction with ChatGPT.',
      description: 'Engage in a thoughtful, 1-on-1 interview with your personalized discovery coach in your own ChatGPT account.',
      icon: MessageSquare,
      color: 'bg-[#D7EAFE]',
      badge: 'Step 2 • Reflection',
      badgeColor: 'blue' as const,
    },
    {
      number: '3',
      title: 'Bring your personalized FOYC handoff back.',
      description: 'Copy the structured FOYC handoff block from ChatGPT and paste it into our dashboard creation page.',
      icon: DownloadCloud,
      color: 'bg-[#B8E986]',
      badge: 'Step 3 • Import',
      badgeColor: 'parrot' as const,
    },
    {
      number: '4',
      title: 'Build and track your career dashboard.',
      description: 'Review your personalized milestones, actionable checklist, habit streak tracker, and portfolio capstones.',
      icon: LayoutDashboard,
      color: 'bg-[#E8DDFF]',
      badge: 'Step 4 • Living OS',
      badgeColor: 'lavender' as const,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-[#FFF8E9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <Badge variant="blue" size="sm">
            Simple 4-Step Process
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-[#17172B] tracking-tight">
            How <Highlight color="#FFE76B">FOYC Works</Highlight>
          </h2>
          <p className="text-sm sm:text-base text-[#17172B]/80 font-semibold">
            No endless tests or generic quizzes. A transparent, privacy-first journey from confusion to clarity.
          </p>
        </div>

        {/* Horizontal timeline on desktop / compact vertical on mobile */}
        <div className="relative">
          {/* Connector line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 bg-[#17172B] -translate-y-12 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card
                  key={step.number}
                  variant="white"
                  shadowSize="md"
                  interactive
                  className="p-6 flex flex-col justify-between space-y-4 border-2"
                >
                  <div className="space-y-4">
                    {/* Top step bubble & badge */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-12 h-12 rounded-2xl ${step.color} border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B] flex items-center justify-center font-black text-xl text-[#17172B]`}
                      >
                        {step.number}
                      </div>
                      <Badge variant={step.badgeColor} size="sm">
                        {step.badge}
                      </Badge>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-extrabold text-base sm:text-lg text-[#17172B] leading-snug">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#17172B]/75 font-medium leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#17172B]/10 flex items-center gap-2 text-xs font-bold text-[#17172B]/60">
                    <Icon className="w-4 h-4 text-[#17172B]" />
                    <span>Phase 0{step.number}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
