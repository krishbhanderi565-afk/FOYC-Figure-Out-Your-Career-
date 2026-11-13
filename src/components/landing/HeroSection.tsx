import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Sparkles, CheckCircle2, TrendingUp, Zap, Target, BookOpen, Layers } from 'lucide-react';
import { Highlight } from '../common/Highlight';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';

export const HeroSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ai' | 'swe' | 'design' | 'founder'>('swe');

  const previews = {
    swe: {
      title: 'Full-Stack Software Engineer',
      badge: 'High Demand • Scalable Systems',
      badgeColor: 'blue' as const,
      cardColor: 'blue' as const,
      nextStep: 'Deploy a full-stack CRUD system with auth & PostgreSQL',
      timeline: '4 - 6 Months Roadmap',
      keySkills: ['TypeScript', 'React', 'PostgreSQL', 'System Design'],
      stat: '94% clarity gain in 2 weeks',
    },
    ai: {
      title: 'Applied AI & ML Systems Engineer',
      badge: 'Frontier Tech • High Growth',
      badgeColor: 'parrot' as const,
      cardColor: 'parrot' as const,
      nextStep: 'Build a production multi-agent RAG workflow with vector search',
      timeline: '3 - 5 Months Roadmap',
      keySkills: ['Python', 'Embeddings', 'LangGraph', 'PyTorch Eval'],
      stat: 'Fastest growing discipline',
    },
    design: {
      title: 'Product & UX/UI Designer',
      badge: 'Creative • Human-Centered',
      badgeColor: 'yellow' as const,
      cardColor: 'yellow' as const,
      nextStep: 'Complete 2 end-to-end case studies with usability test recordings',
      timeline: '3 - 6 Months Roadmap',
      keySkills: ['Figma Tokens', 'User Research', 'Design Systems', 'Micro-interactions'],
      stat: 'High autonomy & creative impact',
    },
    founder: {
      title: 'Tech Founder / Indie Hacker',
      badge: 'Autonomy • Compounding',
      badgeColor: 'green' as const,
      cardColor: 'green' as const,
      nextStep: 'Interview 15 target users & pre-sell MVP before writing full code',
      timeline: '90-Day Launch Sprint',
      keySkills: ['Problem Discovery', 'Rapid Prototyping', 'Distribution', 'Stripe'],
      stat: 'Validated problem-solution fit',
    },
  };

  const current = previews[activeTab];

  return (
    <section className="relative pt-8 pb-16 md:pt-14 md:pb-20 overflow-hidden bg-[#FFF8E9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Core Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#B8E986] border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B]">
                <Sparkles className="w-3.5 h-3.5 text-[#17172B]" />
                Career Discovery & Clarity OS
              </span>
              <span className="hidden sm:inline-block text-xs font-bold text-[#17172B]/60">
                • 100% Free & Private
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#17172B] leading-[1.06] tracking-tight">
              Confused about your career? <br className="hidden sm:inline" />
              <Highlight color="#FFE76B" rotate="-1deg">Let's figure it out.</Highlight>
            </h1>

            <p className="text-lg sm:text-xl text-[#17172B]/85 font-semibold leading-relaxed max-w-2xl">
              FOYC helps you understand your interests, explore career possibilities and turn your confusion into a personalized action plan.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link to="/onboarding" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="gap-3 text-lg font-black bg-[#FFE76B] hover:bg-[#FADB3D] shadow-[5px_5px_0px_#17172B]"
                >
                  <span>Find My Direction</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </Button>
              </Link>

              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  className="gap-2 text-base font-bold bg-white hover:bg-[#F2F9E9] shadow-[4px_4px_0px_#17172B]"
                >
                  <Compass className="w-4 h-4 text-[#17172B]" />
                  <span>How It Works</span>
                </Button>
              </a>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-bold text-[#17172B]/75">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#315B28]" />
                <span>No resume required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#315B28]" />
                <span>Zero login to explore</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#315B28]" />
                <span>Leaves with living roadmap</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Career Possibility Simulator */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Decorative shadow accent box */}
              <div className="absolute -inset-2 bg-[#B8E986] rounded-3xl border-3 border-[#17172B] rotate-1 hidden sm:block" />

              <Card
                variant="white"
                shadowSize="lg"
                className="relative p-5 sm:p-6 space-y-4 border-3 bg-[#FFFDF8]"
              >
                {/* Header bar of card */}
                <div className="flex items-center justify-between border-b-2 border-[#17172B] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#17172B]" />
                    <span className="w-3 h-3 rounded-full bg-[#FFE76B] border border-[#17172B]" />
                    <span className="w-3 h-3 rounded-full bg-[#B8E986] border border-[#17172B]" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#17172B] ml-1">
                      Career Simulator
                    </span>
                  </div>
                  <Badge variant="parrot" size="sm">
                    Interactive
                  </Badge>
                </div>

                {/* Role Switcher Pills */}
                <div className="grid grid-cols-4 gap-1.5 bg-[#FFF8E9] p-1.5 rounded-xl border-2 border-[#17172B]">
                  {[
                    { id: 'swe', label: 'Engineer' },
                    { id: 'ai', label: 'Applied AI' },
                    { id: 'design', label: 'Designer' },
                    { id: 'founder', label: 'Founder' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`text-xs py-1.5 px-1 font-bold rounded-lg transition-all text-center ${
                        activeTab === tab.id
                          ? 'bg-[#17172B] text-white shadow-[2px_2px_0px_#B8E986]'
                          : 'text-[#17172B]/80 hover:bg-black/5'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Active Role Content Card */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#17172B]/60">
                        Target Trajectory
                      </span>
                      <h3 className="font-extrabold text-xl text-[#17172B] tracking-tight">
                        {current.title}
                      </h3>
                    </div>
                    <Badge variant={current.badgeColor} size="sm">
                      {current.badge}
                    </Badge>
                  </div>

                  {/* Immediate Next Step */}
                  <div className="p-3 rounded-xl bg-[#FFF8E9] border-2 border-[#17172B] space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#17172B]/70 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-[#17172B]" /> Priority Milestone
                    </span>
                    <p className="text-xs font-bold text-[#17172B] leading-snug">
                      {current.nextStep}
                    </p>
                  </div>

                  {/* Skills tags */}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#17172B]/60 block mb-1.5">
                      Required Capabilities:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {current.keySkills.map((sk) => (
                        <span
                          key={sk}
                          className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-white border border-[#17172B] shadow-[1px_1px_0px_#17172B]"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom metrics & CTA */}
                  <div className="pt-2 border-t-2 border-[#17172B]/10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#315B28]">
                      <TrendingUp className="w-4 h-4" />
                      <span>{current.stat}</span>
                    </div>

                    <Link to="/onboarding">
                      <Button variant="parrot" size="sm" className="font-black text-xs gap-1.5">
                        <span>Explore Role</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
