import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Compass, Sparkles, Home } from 'lucide-react';

export type PossibilityStep = 'intro' | 'questionnaire' | 'prompt' | 'handoff' | 'report';

interface PossibilityProgressBarProps {
  currentStep: PossibilityStep;
  onStepChange?: (step: PossibilityStep) => void;
  onBack?: () => void;
}

const STEPS: { key: PossibilityStep; label: string; shortLabel: string }[] = [
  { key: 'intro', label: '1. Introduction', shortLabel: 'Intro' },
  { key: 'questionnaire', label: '2. Questionnaire', shortLabel: 'Context' },
  { key: 'prompt', label: '3. Exploration Prompt', shortLabel: 'Prompt' },
  { key: 'handoff', label: '4. Bring Discoveries Back', shortLabel: 'Handoff' },
  { key: 'report', label: '5. Possibility Report', shortLabel: 'Report' },
];

export const PossibilityProgressBar: React.FC<PossibilityProgressBarProps> = ({
  currentStep,
  onStepChange,
  onBack,
}) => {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="w-full bg-[#FFFDF8] border-b border-[#171717]/10 py-3 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Back / Home Navigation */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/"
            title="Return to FOYC Homepage"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#171717]/20 hover:border-[#171717] bg-white text-xs font-bold text-[#171717] transition-all shadow-xs active:scale-95"
          >
            <Home className="w-3.5 h-3.5 text-[#526B50]" />
            <span className="hidden sm:inline">Home</span>
          </Link>

          {onBack && currentIndex > 0 && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs font-bold text-[#171717] hover:text-[#526B50] px-2.5 py-1.5 rounded-xl border border-[#171717]/20 hover:border-[#171717] bg-white transition-all active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
        </div>

        {/* Desktop Step Indicators */}
        <div className="hidden md:flex items-center gap-2">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <React.Fragment key={step.key}>
                <button
                  type="button"
                  disabled={idx > currentIndex}
                  onClick={() => onStepChange && onStepChange(step.key)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-[#171717] text-white shadow-[2px_2px_0px_#526B50]'
                      : isCompleted
                      ? 'bg-[#526B50]/15 text-[#526B50] hover:bg-[#526B50]/25 cursor-pointer'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                      isCurrent
                        ? 'bg-[#FFE76B] text-[#171717]'
                        : isCompleted
                        ? 'bg-[#526B50] text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : idx + 1}
                  </span>
                  <span>{step.label}</span>
                </button>

                {idx < STEPS.length - 1 && (
                  <span className={`w-4 h-0.5 rounded-full ${idx < currentIndex ? 'bg-[#526B50]' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile Compact Status */}
        <div className="md:hidden flex items-center gap-2">
          <span className="text-xs font-bold text-[#171717]">
            Step {currentIndex + 1} of {STEPS.length}:
          </span>
          <span className="text-xs font-semibold text-[#526B50]">
            {STEPS[currentIndex]?.shortLabel}
          </span>
        </div>

        {/* Progress Tracker Pill */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#171717] bg-[#FDF5EB] px-3 py-1 rounded-full border border-[#171717]/15">
          <span>{Math.round(((currentIndex + 1) / STEPS.length) * 100)}% Complete</span>
        </div>
      </div>
    </div>
  );
};
