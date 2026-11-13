import React, { useState, useEffect } from 'react';
import { ClarityAssessment } from '../../types/clarity';
import { 
  ArrowRight, 
  RotateCcw, 
  Compass, 
  AlertCircle, 
  UserCheck, 
  Search, 
  HelpCircle, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface StageInitialReportProps {
  assessment: ClarityAssessment | null;
  onContinueToPrompt: () => void;
  onEditResponses: () => void;
}

export const StageInitialReport: React.FC<StageInitialReportProps> = ({
  assessment,
  onContinueToPrompt,
  onEditResponses,
}) => {
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    'Synthesizing life stage & context...',
    'Mapping tension points & uncertainty drivers...',
    'Structuring personal strengths & constraints...',
    'Formulating deep strategic exploration questions...',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 450);

    const finishTimer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => {
      clearInterval(timer);
      clearTimeout(finishTimer);
    };
  }, []);

  if (loading || !assessment?.initial_report) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#FFE76B] border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-center justify-center animate-pulse">
          <Compass className="w-8 h-8 text-[#171717] animate-spin" style={{ animationDuration: '6s' }} />
        </div>
        <h3 className="text-2xl font-extrabold text-[#171717] mb-2 tracking-tight">
          Connecting the dots...
        </h3>
        <p className="text-sm font-semibold text-[#526B50] mb-6 h-6 transition-all">
          {loadingSteps[loadingStep]}
        </p>

        <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden border border-[#171717]/20">
          <div
            className="h-full bg-[#526B50] transition-all duration-500 rounded-full"
            style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  const {
    currentPosition,
    uncertaintyBreakdown,
    strengthsSynthesis,
    areasNeedingExploration,
    worthExploringQuestions,
    recommendedNextStep,
  } = assessment.initial_report;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header Badge */}
      <div className="text-center mb-8">
        <span className="inline-block text-xs font-bold tracking-wider uppercase px-3 py-1 bg-[#526B50]/15 text-[#526B50] rounded-full border border-[#526B50]/30 mb-3">
          Stage 4 of 7: Initial Assessment
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#171717] tracking-tight mb-2">
          Your Clarity Synthesis
        </h2>
        <p className="text-sm md:text-base text-[#555] max-w-xl mx-auto font-medium">
          A transparent, objective baseline synthesized from your answers before we enter the deep exploration stage.
        </p>
      </div>

      {/* Main Report Cards */}
      <div className="space-y-6">
        {/* Card 1: Current Position */}
        <div className="bg-white/95 rounded-2xl p-6 border-2 border-[#171717]/20 shadow-[3px_3px_0px_#171717]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFE76B] border border-[#171717] flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-[#171717]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#171717]">1. Current Position & Grounding</h3>
              <span className="text-[11px] text-[#666] uppercase tracking-wider font-semibold">Where you stand right now</span>
            </div>
          </div>
          <p className="text-sm md:text-base text-[#222] leading-relaxed pl-12">
            {currentPosition}
          </p>
        </div>

        {/* Card 2: What is Creating Uncertainty */}
        <div className="bg-white/95 rounded-2xl p-6 border-2 border-[#171717]/20 shadow-[3px_3px_0px_#171717]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#526B50]/15 border border-[#171717] flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-[#526B50]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#171717]">2. What Is Creating Uncertainty</h3>
              <span className="text-[11px] text-[#666] uppercase tracking-wider font-semibold">Identified friction points</span>
            </div>
          </div>
          <p className="text-sm md:text-base text-[#222] leading-relaxed pl-12 mb-4">
            {uncertaintyBreakdown}
          </p>
        </div>

        {/* Card 3: What We Understand About You */}
        <div className="bg-white/95 rounded-2xl p-6 border-2 border-[#171717]/20 shadow-[3px_3px_0px_#171717]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#171717] text-white flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#171717]">3. What We Understand About You</h3>
              <span className="text-[11px] text-[#666] uppercase tracking-wider font-semibold">Strengths, curiosity & preferences</span>
            </div>
          </div>
          <p className="text-sm md:text-base text-[#222] leading-relaxed pl-12">
            {strengthsSynthesis}
          </p>
        </div>

        {/* Card 4: Areas Needing Exploration */}
        <div className="bg-white/95 rounded-2xl p-6 border-2 border-[#171717]/20 shadow-[3px_3px_0px_#171717]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFE76B]/40 border border-[#171717] flex items-center justify-center shrink-0">
              <Search className="w-5 h-5 text-[#171717]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#171717]">4. What Still Needs Deeper Exploration</h3>
              <span className="text-[11px] text-[#666] uppercase tracking-wider font-semibold">Unresolved questions</span>
            </div>
          </div>
          <p className="text-sm md:text-base text-[#222] leading-relaxed pl-12">
            {areasNeedingExploration}
          </p>
        </div>

        {/* Card 5: Questions Worth Exploring Further */}
        <div className="bg-white/95 rounded-2xl p-6 border-2 border-[#171717]/20 shadow-[3px_3px_0px_#171717]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#526B50] text-white flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#171717]">5. High-Impact Questions for Next Stage</h3>
              <span className="text-[11px] text-[#666] uppercase tracking-wider font-semibold">Prompts to unlock direction</span>
            </div>
          </div>
          <div className="space-y-2.5 pl-12">
            {worthExploringQuestions.map((q: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FDF5EB] border border-[#171717]/15">
                <span className="w-5 h-5 rounded-full bg-[#171717] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs md:text-sm font-semibold text-[#171717] leading-snug">{q}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Card 6: Recommended Next Step */}
        <div className="bg-[#526B50]/10 rounded-2xl p-6 border-2 border-[#526B50]/30 shadow-[3px_3px_0px_#526B50]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#526B50] text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#171717]">6. Recommended Next Step</h3>
              <span className="text-[11px] text-[#526B50] uppercase tracking-wider font-semibold">Immediate action</span>
            </div>
          </div>
          <p className="text-sm md:text-base font-medium text-[#171717] pl-12">
            {recommendedNextStep}
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mt-8 pt-6 border-t border-[#171717]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onEditResponses}
          className="px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold text-[#555] border border-[#171717]/25 hover:text-[#171717] hover:bg-white flex items-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Edit My Inputs</span>
        </button>

        <button
          type="button"
          onClick={onContinueToPrompt}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#FFE76B] text-[#171717] font-extrabold text-sm md:text-base border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-center justify-center gap-3 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#171717] transition-all"
        >
          <span>Explore My Clarity With ChatGPT</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
