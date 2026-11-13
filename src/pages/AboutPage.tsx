import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Highlight } from '../components/common/Highlight';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileQuestion,
  Bot,
  FileCode,
  LayoutDashboard,
  CalendarCheck,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { Logo } from '../components/common/Logo';

export const AboutPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: FileQuestion,
      title: 'Share your background and interests',
      desc: 'Answer 8 thoughtful questions about your current situation, skills, interests, and what specifically feels confusing right now. No generic multiple-choice quizzes.',
    },
    {
      num: '02',
      icon: Bot,
      title: 'Explore your career direction through ChatGPT',
      desc: 'FOYC generates an expert career advisory prompt. You paste it into your own ChatGPT account for a structured, conversational 1-on-1 discovery dialogue.',
    },
    {
      num: '03',
      icon: FileCode,
      title: 'Bring your final FOYC career plan back',
      desc: 'Once you and ChatGPT agree on your ideal trajectory, ChatGPT outputs a standardized FOYC JSON handoff block. Copy and paste it back into FOYC in one click.',
    },
    {
      num: '04',
      icon: LayoutDashboard,
      title: 'Create your personalized dashboard',
      desc: 'FOYC instantly transforms your approved handoff into an interactive career command centre with milestones, skill gap analyses, and capstone project blueprints.',
    },
    {
      num: '05',
      icon: CalendarCheck,
      title: 'Track your goals, habits and progress',
      desc: 'Execute your roadmap using the integrated habit tracker, daily reflection log, and weekly review system to maintain continuous momentum toward your ambitions.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF5EB] text-[#171717]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 pb-24 md:pb-16">
        {/* Brand Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 border-[#171717] bg-white shadow-[2px_2px_0px_#171717]">
            <Compass className="w-4 h-4 text-[#171717]" />
            <span className="text-xs font-black uppercase tracking-wider text-[#171717]">
              Figure Out Your Career
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#171717] tracking-tight leading-tight">
            From Career Confusion <br />
            to <Highlight color="#FFE76B">Career Clarity.</Highlight>
          </h1>

          <p className="text-base sm:text-lg text-[#333333] font-medium leading-relaxed max-w-2xl mx-auto">
            FOYC helps people from any country, educational background or professional field understand themselves, explore career possibilities and turn their ambitions into a personalized career development plan.
          </p>
        </div>

        {/* Section 1: The Problem FOYC Solves */}
        <div className="mb-14">
          <Card
            variant="white"
            shadowSize="md"
            className="p-8 sm:p-12 border-2 border-[#171717] bg-white space-y-6"
          >
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#526B50]">
              <HelpCircle className="w-4 h-4" />
              <span>The Problem We Address</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
              Why traditional career advice leaves people stuck.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-sm text-[#444444] font-medium leading-relaxed">
              <div className="p-5 rounded-2xl bg-[#FDF5EB] border border-[#E8E5DE] space-y-2">
                <h3 className="font-bold text-base text-[#171717]">
                  Shifting Markets & Conflicting Opinions
                </h3>
                <p className="text-xs leading-relaxed">
                  Every person gives different advice. New technologies create confusion about which skills will remain relevant. People end up learning random things without knowing where they are heading.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FDF5EB] border border-[#E8E5DE] space-y-2">
                <h3 className="font-bold text-base text-[#171717]">
                  Generic Quizzes & Static Roadmaps
                </h3>
                <p className="text-xs leading-relaxed">
                  Most online tests give generic personality badges (like "The Visionary") that don't translate into realistic milestones, real proof of work, or daily routines.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-sm font-semibold text-[#171717] leading-relaxed">
                FOYC solves this by combining self-reflection with ChatGPT's conversational depth, converting the final outcome into a living dashboard you own and track every day.
              </p>
            </div>
          </Card>
        </div>

        {/* Section 2: The 5-Step Workflow */}
        <div className="mb-14 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#526B50]">
              The Proven Methodology
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#171717] tracking-tight">
              How FOYC Moves You Forward
            </h2>
            <p className="text-xs sm:text-sm text-[#555555] font-medium">
              A transparent, private, 5-stage journey from career confusion to daily momentum.
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((st) => {
              const Icon = st.icon;
              return (
                <Card
                  key={st.num}
                  variant="white"
                  shadowSize="sm"
                  className="p-6 sm:p-7 border-2 border-[#171717] bg-white flex flex-col sm:flex-row items-start sm:items-center gap-5 transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-2xl sm:text-3xl font-black text-[#526B50] font-mono">
                      {st.num}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#FFE76B] border-2 border-[#171717] flex items-center justify-center shadow-[2px_2px_0px_#171717]">
                      <Icon className="w-6 h-6 text-[#171717]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-base sm:text-lg text-[#171717]">
                      {st.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#444444] font-medium leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Section 3: Privacy & Commitment */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#171717] text-white border-2 border-[#171717] shadow-[4px_4px_0px_#526B50] space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#526B50] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#A8B99A] block">
                Privacy First
              </span>
              <h3 className="text-xl font-black text-white">
                Zero Mandatory Signup to Discover Your Path
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed">
            FOYC does not lock career discovery behind paywalls or forced registration. You can complete your entire reflection and generate your ChatGPT coaching prompt 100% anonymously. You only need to create an account when you want to securely save and persist your personalized dashboard across devices.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <Link to="/onboarding" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                className="w-full sm:w-auto font-black text-xs bg-[#FFE76B] text-[#171717] border-2 border-[#171717] shadow-[2px_2px_0px_#ffffff]"
              >
                <span>Start Your Career Discovery</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>

            <Link to="/explore" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="md"
                className="w-full sm:w-auto font-bold text-xs bg-white text-[#171717] hover:bg-[#F4F3EF]"
              >
                <span>Browse Career Paths</span>
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
