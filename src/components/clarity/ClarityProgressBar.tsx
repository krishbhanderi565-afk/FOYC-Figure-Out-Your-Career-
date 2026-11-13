import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Home } from 'lucide-react';

export type ClarityStep =
  | 'situation'
  | 'uncertainty'
  | 'understand'
  | 'initial-report'
  | 'prompt'
  | 'handoff-submit'
  | 'final-report';

interface ClarityProgressBarProps {
  currentStep: ClarityStep;
  onStepChange?: (step: ClarityStep) => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

const STEPS: { key: ClarityStep; label: string; shortLabel: string }[] = [
  { key: 'situation', label: '1. Current Situation', shortLabel: 'Situation' },
  { key: 'uncertainty', label: '2. Uncertainty', shortLabel: 'Uncertainty' },
  { key: 'understand', label: '3. Self-Discovery', shortLabel: 'Discovery' },
  { key: 'initial-report', label: '4. Initial Assessment', shortLabel: 'Assessment' },
  { key: 'prompt', label: '5. ChatGPT Prompt', shortLabel: 'Prompt' },
  { key: 'handoff-submit', label: '6. Bring Clarity Back', shortLabel: 'Import' },
  { key: 'final-report', label: '7. Clarity Report', shortLabel: 'Report' },
];

export const ClarityProgressBar: React.FC<ClarityProgressBarProps> = ({
  currentStep,
  onStepChange,
  onBack,
  canGoBack = true,
}) => {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="w-full bg-[#FFFDF8] border-b border-[#E8E5DE] sticky top-14 sm:top-16 md:top-20 z-40 px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Back / Home Navigation */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/"
            title="Return to FOYC Homepage"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E5DE] bg-white hover:bg-[#F4F3EF] text-xs font-bold text-[#171717] transition-colors shadow-xs active:scale-95"
          >
            <Home className="w-3.5 h-3.5 text-[#526B50]" />
            <span className="hidden sm:inline">Home</span>
          </Link>

          {canGoBack && currentIndex > 0 && onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E5DE] bg-white hover:bg-[#F4F3EF] text-xs font-bold text-[#171717] transition-colors shadow-xs active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
        </div>

        {/* Desktop Step Sequence */}
        <div className="hidden md:flex items-center gap-2 overflow-x-auto py-1">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <React.Fragment key={step.key}>
                <div
                  onClick={() => isCompleted && onStepChange && onStepChange(step.key)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-[#171717] text-white shadow-xs'
                      : isCompleted
                      ? 'bg-[#EDF2E9] text-[#526B50] cursor-pointer hover:bg-[#DDF5C5]'
                      : 'text-[#888888] opacity-60'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isCurrent
                        ? 'bg-[#FFE76B] text-[#171717]'
                        : isCompleted
                        ? 'bg-[#526B50] text-white'
                        : 'bg-[#E8E5DE] text-[#666666]'
                    }`}
                  >
                    {isCompleted ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : idx + 1}
                  </div>
                  <span>{step.shortLabel}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`w-3 h-0.5 rounded-full ${idx < currentIndex ? 'bg-[#526B50]' : 'bg-[#E8E5DE]'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile Compact Step Indicator */}
        <div className="flex md:hidden items-center gap-2 flex-1 justify-center">
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#526B50]">
              Step {currentIndex + 1} of {STEPS.length}
            </span>
            <h4 className="text-xs font-bold text-[#171717] truncate max-w-[200px]">
              {STEPS[currentIndex]?.label}
            </h4>
          </div>
        </div>

        {/* Right side step progress badge */}
        <div className="text-right shrink-0">
          <span className="text-xs font-mono font-bold text-[#666666]">
            {Math.round(((currentIndex + 1) / STEPS.length) * 100)}%
          </span>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full bg-[#E8E5DE] h-1 rounded-full mt-2 overflow-hidden max-w-5xl mx-auto">
        <div
          className="bg-[#526B50] h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
};
