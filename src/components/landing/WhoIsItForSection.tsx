import React, { useState } from 'react';
import { Highlight } from '../common/Highlight';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Check, ArrowRight, GraduationCap, Briefcase, RefreshCw, Code2, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WhoIsItForSection: React.FC = () => {
  const [selectedPersona, setSelectedPersona] = useState(0);

  const personas = [
    {
      id: 'student',
      tabLabel: "I'm in College or Final Year",
      icon: GraduationCap,
      color: 'pink' as const,
      headline: 'Facing Campus Placements or Graduation Uncertainty?',
      description:
        'Everyone tells you to learn 5 different tech stacks, do competitive coding, and submit 500 applications. FOYC cuts through campus noise to build a focused, defensible portfolio that makes recruiters stop scrolling.',
      whatYouGet: [
        'Curated 90-day placement & capstone readiness plan',
        'Identification of high-signal skills vs resume fluff',
        'Direct project specs that prove practical competence',
        'Tailored interview prep habits without burnout',
      ],
      idealFor: 'Students feeling behind or overwhelmed by campus competition.',
    },
    {
      id: 'switcher',
      tabLabel: "I'm Switching from Another Field",
      icon: RefreshCw,
      color: 'yellow' as const,
      headline: 'Pivoting into Tech, AI, or Design from Non-Tech?',
      description:
        'You already have valuable communication, analytical, or domain experience. FOYC maps your existing transferable strengths to high-growth modern roles so you don’t have to start from zero.',
      whatYouGet: [
        'Transferable skill audit from your past work',
        'Fast-track bridging roadmap to close critical technical gaps',
        'Realistic weekly study allocation around existing job hours',
        'Narrative pitch for explaining your career switch to employers',
      ],
      idealFor: 'Working professionals in sales, operations, support, or teaching seeking a tech pivot.',
    },
    {
      id: 'working',
      tabLabel: "I'm Currently Working but Feeling Stagnant",
      icon: Briefcase,
      color: 'blue' as const,
      headline: 'Stuck in a Routine Job with Limited Growth?',
      description:
        'When your daily tasks feel automated or obsolete, complacency is dangerous. FOYC helps you discover high-leverage specializations (like Applied AI or Systems) to advance your title and compensation.',
      whatYouGet: [
        'Advanced specialization roadmap (Senior & Staff tracks)',
        'System design and architectural leadership milestones',
        'Habits for maintaining high-impact side projects',
        'Objective assessment of when to ask for a promotion vs jump ship',
      ],
      idealFor: 'Mid-level engineers and designers feeling capped in their current role.',
    },
    {
      id: 'selftaught',
      tabLabel: "I'm Self-Taught & Building Alone",
      icon: Code2,
      color: 'lavender' as const,
      headline: 'Learning to Code Without a Degree or Mentor?',
      description:
        'Tutorial hell is real: watching endless courses without ever feeling confident to build on your own. FOYC replaces passive video watching with structured, milestone-driven execution.',
      whatYouGet: [
        'Elimination of tutorial paralysis with problem-first sprints',
        'Production standards checklist (Testing, CI/CD, Git etiquette)',
        'Community proof-of-work guidelines to get noticed',
        'Direct habit tracker for consistent daily practice',
      ],
      idealFor: 'Self-directed learners who want professional discipline and validation.',
    },
    {
      id: 'founder',
      tabLabel: 'I Want to Build a Startup / Micro-SaaS',
      icon: Rocket,
      color: 'green' as const,
      headline: 'Aspiring to Build Your Own Profitable Products?',
      description:
        'Stop spending 6 months building products nobody asked for. FOYC provides a structured indie-hacker roadmap from customer problem discovery to Stripe payment integration.',
      whatYouGet: [
        'Validation framework to test demand before coding',
        'Lean MVP development roadmap (under 30 days to launch)',
        'Distribution playbook for Reddit, Product Hunt, and X',
        'Revenue milestones and weekly customer interview targets',
      ],
      idealFor: 'Developers, designers, and creatives wanting financial and creative autonomy.',
    },
  ];

  const current = personas[selectedPersona];

  return (
    <section className="py-20 md:py-28 bg-[#FFFDF7] border-t-3 border-[#17172B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#17172B]/60 bg-white px-3 py-1 rounded-full border-2 border-[#17172B] inline-block mb-4 shadow-[1.5px_1.5px_0px_#17172B]">
            Inclusive & Universal
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#17172B] tracking-tight leading-[1.15] mb-4">
            Which stage <Highlight color="#FFE76B">fits you right now?</Highlight>
          </h2>
          <p className="text-base sm:text-lg text-[#17172B]/80 font-medium">
            Pick your current situation. We tailor the questions, pace, and recommendations specifically for your reality.
          </p>
        </div>

        {/* Tab selector and card display (inspired directly by the reference video) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left vertical tabs */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            {personas.map((persona, index) => {
              const Icon = persona.icon;
              const isSelected = selectedPersona === index;
              return (
                <button
                  key={persona.id}
                  onClick={() => setSelectedPersona(index)}
                  className={`w-full text-left p-4 rounded-xl border-2 border-[#17172B] font-bold text-sm sm:text-base flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-[#FFE76B] shadow-[4px_4px_0px_#17172B] translate-x-1'
                      : 'bg-white hover:bg-[#FFF8E9] text-[#17172B]/80 shadow-[2px_2px_0px_#17172B]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg border border-[#17172B] flex items-center justify-center ${
                        isSelected ? 'bg-white' : 'bg-[#FFF8E9]'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-[#17172B]" />
                    </div>
                    <span>{persona.tabLabel}</span>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'translate-x-1 text-[#17172B]' : 'opacity-40'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Detailed Showcase Card */}
          <div className="lg:col-span-7">
            <Card variant={current.color} shadowSize="lg" className="p-8 sm:p-10 flex flex-col justify-between min-h-[460px]">
              <div>
                <div className="inline-block px-3 py-1 bg-white rounded-lg border-2 border-[#17172B] text-xs font-black uppercase tracking-wider mb-4 shadow-[1.5px_1.5px_0px_#17172B]">
                  Tailored Experience
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17172B] tracking-tight mb-4">
                  {current.headline}
                </h3>
                <p className="text-sm sm:text-base text-[#17172B]/85 leading-relaxed font-medium mb-8">
                  {current.description}
                </p>

                {/* Sub-card: What You Get */}
                <div className="bg-white p-6 rounded-2xl border-2 border-[#17172B] shadow-[3px_3px_0px_#17172B] mb-6">
                  <span className="text-xs font-black uppercase tracking-widest text-[#17172B]/60 block mb-3">
                    What You Will Receive in Your Dashboard
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {current.whatYouGet.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-md bg-[#FFE76B] border border-[#17172B] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-[#17172B]" />
                        </div>
                        <span className="text-xs font-bold text-[#17172B]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-[#17172B]/30">
                <span className="text-xs font-bold text-[#17172B]/70 italic">
                  💡 {current.idealFor}
                </span>
                <Link to="/onboarding" className="w-full sm:w-auto">
                  <Button variant="dark" size="md" className="gap-2 w-full sm:w-auto">
                    Start in this Category
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
