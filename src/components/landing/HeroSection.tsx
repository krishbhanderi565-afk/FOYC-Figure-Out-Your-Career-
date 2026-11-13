import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Sparkles, CheckCircle2, TrendingUp, Zap, Target, BookOpen } from 'lucide-react';
import { Highlight } from '../common/Highlight';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';

export const HeroSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ai' | 'swe' | 'design' | 'founder'>('swe');

  const previews = {
    swe: {
      title: 'Full-Stack Software Engineer',
      badge: 'High Demand • Scalable Code',
      badgeColor: 'blue' as const,
      cardColor: 'blue' as const,
      nextStep: 'Deploy your first full-stack CRUD system with auth & database',
      timeline: '4 - 6 Months Roadmap',
      keySkills: ['TypeScript', 'React 19', 'PostgreSQL', 'Docker', 'System Design'],
      stat: '94% clarity gain in 2 weeks',
    },
    ai: {
      title: 'Applied AI & LLM Engineer',
      badge: 'Exponential Growth • Frontier',
      badgeColor: 'yellow' as const,
      cardColor: 'yellow' as const,
      nextStep: 'Build a production multi-agent RAG workflow with vector search',
      timeline: '3 - 5 Months Roadmap',
      keySkills: ['Python', 'Embeddings', 'LangGraph', 'PyTorch', 'Prompt Eval'],
      stat: 'Fastest growing discipline',
    },
    design: {
      title: 'Product & UX/UI Designer',
      badge: 'Creative • Human-Centered',
      badgeColor: 'pink' as const,
      cardColor: 'pink' as const,
      nextStep: 'Complete 2 end-to-end case studies with usability test recordings',
      timeline: '3 - 6 Months Roadmap',
      keySkills: ['Figma Tokens', 'User Research', 'Design Systems', 'Micro-interactions'],
      stat: 'Highly valued in modern startups',
    },
    founder: {
      title: 'Tech Founder / Indie Hacker',
      badge: 'Maximum Autonomy • Compounding',
      badgeColor: 'green' as const,
      cardColor: 'green' as const,
      nextStep: 'Interview 15 target users & pre-sell MVP before writing full code',
      timeline: '90-Day Launch Sprint',
      keySkills: ['Problem Discovery', 'Rapid Prototyping', 'Distribution', 'Stripe Integration'],
      stat: '$0 to $5k MRR framework',
    },
  };

  const current = previews[activeTab];

  return (
    <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-[#FFF8E9]">
      {/* Decorative background grid subtle dots */}
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#17172B 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Notification Pill */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B] text-xs sm:text-sm font-bold text-[#17172B]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>No sign-up required to start</span>
            <span className="text-[#17172B]/30">•</span>
            <span className="text-[#17172B]/80 font-medium">100% Free Discovery Handoff</span>
          </div>
        </div>

        {/* Hero Headline & Subcopy */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#17172B] leading-[1.08] mb-6">
            Feeling lost about <Highlight rotate="-1deg">your future?</Highlight>
          </h1>
          <p className="text-lg sm:text-2xl text-[#17172B]/80 font-medium max-w-2xl mx-auto leading-relaxed mb-8">
            Too many choices. Too many opinions. Not enough clarity.{' '}
            <span className="font-bold text-[#17172B] underline decoration-[#FFE76B] decoration-4 underline-offset-4">
              Let's figure out your next step together.
            </span>
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/onboarding" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" fullWidth className="gap-3 text-lg py-4 px-8 group">
                <Sparkles className="w-5 h-5 text-[#17172B] group-hover:rotate-12 transition-transform" />
                Find My Direction
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" fullWidth className="gap-2 text-lg py-4 px-8">
                How FOYC Works
              </Button>
            </a>
          </div>

          {/* Social Proof Mini Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-bold text-[#17172B]/75">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              Works for any college or background
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              No generic chatbot quizzes
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              Living actionable roadmap
            </span>
          </div>
        </div>

        {/* Hero Interactive Visual Showcase */}
        <div className="mt-8 relative max-w-5xl mx-auto">
          {/* Main Card Frame */}
          <div className="bg-white rounded-3xl border-3 border-[#17172B] shadow-[8px_8px_0px_#17172B] overflow-hidden">
            {/* Top Interactive Selector Bar */}
            <div className="bg-[#FFF8E9] px-6 py-4 border-b-2 border-[#17172B] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-[#17172B]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-[#17172B]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-[#17172B]" />
                <span className="ml-2 font-bold text-xs uppercase tracking-wider text-[#17172B]/70">
                  Interactive Career Possibility Simulator
                </span>
              </div>

              {/* Selector Tabs */}
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border-2 border-[#17172B]">
                <button
                  onClick={() => setActiveTab('swe')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'swe' ? 'bg-[#D7EAFE] text-[#17172B] border border-[#17172B]' : 'text-[#17172B]/70 hover:text-[#17172B]'
                  }`}
                >
                  Software
                </button>
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'ai' ? 'bg-[#FFE76B] text-[#17172B] border border-[#17172B]' : 'text-[#17172B]/70 hover:text-[#17172B]'
                  }`}
                >
                  Applied AI
                </button>
                <button
                  onClick={() => setActiveTab('design')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'design' ? 'bg-[#FFD9E8] text-[#17172B] border border-[#17172B]' : 'text-[#17172B]/70 hover:text-[#17172B]'
                  }`}
                >
                  UX Design
                </button>
                <button
                  onClick={() => setActiveTab('founder')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'founder' ? 'bg-[#DDF5C9] text-[#17172B] border border-[#17172B]' : 'text-[#17172B]/70 hover:text-[#17172B]'
                  }`}
                >
                  Founder
                </button>
              </div>
            </div>

            {/* Inner Dashboard Preview Body */}
            <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-b from-white to-[#FFFDF7]">
              {/* Left Column: Result Details */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  <Badge variant={current.badgeColor} dot>
                    {current.badge}
                  </Badge>
                  <span className="text-xs font-bold text-[#17172B]/60 uppercase tracking-wider">
                    {current.timeline}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-extrabold text-[#17172B] tracking-tight">
                  {current.title}
                </h3>

                <div className="bg-[#FFF8E9] p-4 rounded-xl border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B]">
                  <span className="text-xs font-extrabold text-[#17172B]/70 uppercase tracking-wider block mb-1">
                    Recommended Immediate Micro-Step:
                  </span>
                  <p className="text-sm sm:text-base font-bold text-[#17172B]">
                    "{current.nextStep}"
                  </p>
                </div>

                {/* Skills Chips */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#17172B]/60 block mb-2">
                    Key Competencies You Will Build
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {current.keySkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-white rounded-lg text-xs font-bold text-[#17172B] border-2 border-[#17172B] shadow-[1.5px_1.5px_0px_#17172B]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <Link to="/onboarding">
                    <Button variant="primary" size="md" className="gap-2 text-sm font-bold">
                      <Target className="w-4 h-4" />
                      Build My Custom Plan
                    </Button>
                  </Link>
                  <Link to="/dashboard" className="text-xs font-bold text-[#17172B] hover:underline flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    Preview Full Command Centre
                  </Link>
                </div>
              </div>

              {/* Right Column: Live Mockup Card */}
              <div className="lg:col-span-5">
                <Card variant={current.cardColor} shadowSize="lg" className="p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-[#17172B]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white border-2 border-[#17172B] flex items-center justify-center font-black text-sm">
                        #1
                      </div>
                      <span className="font-extrabold text-sm text-[#17172B]">Direction Fit Score</span>
                    </div>
                    <span className="font-black text-2xl text-[#17172B]">96%</span>
                  </div>

                  {/* Roadmap Milestones Mockup */}
                  <div className="space-y-2.5">
                    <div className="bg-white p-3 rounded-xl border-2 border-[#17172B] flex items-center gap-3">
                      <div className="w-5 h-5 rounded-md bg-[#DDF5C9] border border-[#17172B] flex items-center justify-center text-xs font-bold text-[#17172B]">
                        ✓
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#17172B] truncate">Phase 1: Deep Fundamentals</p>
                        <p className="text-[10px] text-[#17172B]/60">3 weeks • Completed</p>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border-2 border-[#17172B] flex items-center gap-3 shadow-[2px_2px_0px_#17172B]">
                      <div className="w-5 h-5 rounded-md bg-[#FFE76B] border border-[#17172B] flex items-center justify-center text-xs font-bold text-[#17172B] animate-pulse">
                        ●
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#17172B] truncate">Phase 2: Portfolio Capstone</p>
                        <p className="text-[10px] text-[#17172B]/60">Active Sprint • 2 tasks remaining</p>
                      </div>
                    </div>

                    <div className="bg-white/80 p-3 rounded-xl border-2 border-[#17172B]/50 flex items-center gap-3">
                      <div className="w-5 h-5 rounded-md bg-gray-100 border border-[#17172B]/40 flex items-center justify-center text-xs font-bold text-[#17172B]/50">
                        3
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#17172B]/70 truncate">Phase 3: Industry Readiness</p>
                        <p className="text-[10px] text-[#17172B]/50">Upcoming</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Daily Consistency Streak */}
                  <div className="mt-1 pt-3 border-t-2 border-[#17172B] flex items-center justify-between text-xs font-bold text-[#17172B]">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-[#D97706] fill-amber-500" />
                      5 Day Learning Streak
                    </span>
                    <span className="bg-white px-2 py-0.5 rounded-md border border-[#17172B] text-[11px]">
                      🔥 85% Consistency
                    </span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
