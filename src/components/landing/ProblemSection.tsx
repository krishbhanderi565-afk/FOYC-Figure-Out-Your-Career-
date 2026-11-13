import React from 'react';
import { Highlight } from '../common/Highlight';
import { Card } from '../common/Card';
import { AlertCircle, HelpCircle, Layers, BrainCircuit, Users, Compass } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      title: 'Analysis Paralysis',
      subtitle: 'Too many contradictory opinions',
      desc: 'YouTube tech influencers, family expectations, Reddit debates, and 200 different roadmaps leave you frozen in place without taking real action.',
      variant: 'pink' as const,
      stat: '78%',
      statLabel: 'of learners report feeling completely overwhelmed by conflicting career advice.',
      icon: Layers,
    },
    {
      title: 'The AI Anxiety Paradox',
      subtitle: 'Will my chosen career disappear?',
      desc: 'Every week brings a new headline declaring standard coding or design "dead". You want to know which fundamental skills will actually compound in the real world.',
      variant: 'lavender' as const,
      stat: '84%',
      statLabel: 'of students fear learning skills that may become obsolete before graduation.',
      icon: BrainCircuit,
    },
    {
      title: 'The Qualification Trap',
      subtitle: 'Degrees and certificates with zero job readiness',
      desc: 'Collecting theoretical certificates without building demonstrable proof of work creates a false sense of security while leaving real employers unimpressed.',
      variant: 'yellow' as const,
      stat: '65%',
      statLabel: 'of degree holders struggle to explain their practical problem-solving competency.',
      icon: AlertCircle,
    },
    {
      title: 'One-Size-Fits-All Advice',
      subtitle: 'Generic career quizzes that force one answer',
      desc: 'Typical 10-question multiple-choice quizzes pigeonhole you into rigid stereotypes without understanding your personal constraints, pace, or ambition.',
      variant: 'blue' as const,
      stat: '91%',
      statLabel: 'of participants find standard online career quizzes shallow and unhelpful.',
      icon: HelpCircle,
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#FFF8E9] border-t-3 border-[#17172B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFD9E8] border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B] text-xs font-bold uppercase tracking-wider mb-4">
            <Compass className="w-4 h-4 text-[#17172B]" />
            The Reality Check
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#17172B] tracking-tight leading-[1.15] mb-6">
            Career confusion is not a personal failure.{' '}
            <Highlight color="#FFE76B" rotate="0.5deg">The current system is broken.</Highlight>
          </h2>
          <p className="text-lg text-[#17172B]/80 leading-relaxed font-medium">
            You are expected to make irreversible decisions about decades of your life based on outdated university curricula and commercial bootcamp marketing.
          </p>
        </div>

        {/* 4 Pastel Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {problems.map((prob, idx) => {
            const Icon = prob.icon;
            return (
              <Card
                key={idx}
                variant={prob.variant}
                shadowSize="lg"
                interactive
                className="p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-[#17172B]">
                    <div className="w-12 h-12 rounded-xl bg-white border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#17172B]" />
                    </div>
                    <span className="font-mono text-xs font-extrabold uppercase px-3 py-1 bg-white rounded-lg border border-[#17172B]">
                      Obstacle 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-2xl font-extrabold text-[#17172B] mb-2">{prob.title}</h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#17172B]/70 mb-4">
                    {prob.subtitle}
                  </p>
                  <p className="text-sm sm:text-base text-[#17172B]/85 leading-relaxed font-medium mb-6">
                    {prob.desc}
                  </p>
                </div>

                <div className="bg-white/90 p-4 rounded-xl border-2 border-[#17172B] flex items-center gap-4">
                  <span className="font-extrabold text-3xl sm:text-4xl text-[#17172B] tracking-tight shrink-0">
                    {prob.stat}
                  </span>
                  <p className="text-xs font-bold text-[#17172B]/80 leading-snug">
                    {prob.statLabel}
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
