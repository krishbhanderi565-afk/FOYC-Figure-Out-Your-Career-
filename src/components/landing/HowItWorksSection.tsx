import React from 'react';
import { Highlight } from '../common/Highlight';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { MessageSquare, Cpu, FileSpreadsheet, LayoutDashboard, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Share What\'s On Your Mind',
      tag: 'No Judgment • Raw Thoughts',
      tagColor: 'pink' as const,
      cardColor: 'cream' as const,
      desc: 'Answer a few quick questions about your stage and write freely about what confuses, excites, or stresses you. No right or wrong answers.',
      icon: MessageSquare,
      illustration: '✏️ Free reflection, zero test pressure',
    },
    {
      num: '02',
      title: 'Generate Personalized Coach Prompt',
      tag: 'Empathetic AI Guidance',
      tagColor: 'yellow' as const,
      cardColor: 'white' as const,
      desc: 'FOYC formulates a tailored system prompt that instructs ChatGPT to behave as an objective, patient career discovery mentor rather than a generic text generator.',
      icon: Cpu,
      illustration: '🤖 One question at a time, exploring trade-offs',
    },
    {
      num: '03',
      title: 'Conduct Deep Discovery in ChatGPT',
      tag: 'Your Private Session',
      tagColor: 'blue' as const,
      cardColor: 'white' as const,
      desc: 'Have a meaningful conversation in your own ChatGPT account. Test assumptions, examine real daily routines of various professions, and choose your primary path.',
      icon: FileSpreadsheet,
      illustration: '📋 Delimited FOYC Handoff generated upon approval',
    },
    {
      num: '04',
      title: 'Import into Your Living Dashboard',
      tag: 'Command Centre & Growth',
      tagColor: 'green' as const,
      cardColor: 'white' as const,
      desc: 'Paste the handoff back into FOYC to instantly unlock your customized roadmap, actionable learning checklist, daily habit tracker, and capstone project milestones.',
      icon: LayoutDashboard,
      illustration: '🚀 Living dashboard that evolves with your progress',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-[#FFF8E9] border-t-3 border-[#17172B] scroll-mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="yellow" className="mb-4">
            Step-by-Step Architecture
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#17172B] tracking-tight leading-[1.15] mb-6">
            From chaos to clarity in <Highlight color="#FFE76B">four honest steps.</Highlight>
          </h2>
          <p className="text-base sm:text-lg text-[#17172B]/80 font-medium leading-relaxed">
            We don't lock you inside a black box. You own your data, your prompts, and your decisions from start to finish.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <Card
                key={i}
                variant={st.cardColor}
                shadowSize="lg"
                interactive
                className="p-6 flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-[#17172B]">
                    <span className="font-black text-2xl text-[#17172B]">
                      {st.num}
                    </span>
                    <Badge variant={st.tagColor} size="sm">
                      Step {st.num}
                    </Badge>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-[#FFF8E9] border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B] flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#17172B]" />
                  </div>

                  <h3 className="text-lg font-extrabold text-[#17172B] mb-2 leading-snug">
                    {st.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#17172B]/75 leading-relaxed font-medium mb-6">
                    {st.desc}
                  </p>
                </div>

                <div className="bg-[#FFFDF7] p-3 rounded-xl border border-[#17172B]/40 text-[11px] font-bold text-[#17172B]/90">
                  {st.illustration}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Action Link */}
        <div className="mt-14 text-center">
          <Link to="/onboarding">
            <Button variant="primary" size="lg" className="gap-3">
              Begin Step 01 Now — It's Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
