import React from 'react';
import {
  LifeStageKey,
  LIFE_STAGE_OPTIONS,
} from '../../types/clarity';
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  TrendingUp,
  Shuffle,
  Rocket,
  RotateCcw,
  Compass,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Button } from '../common/Button';

interface StageSituationProps {
  selectedStage: LifeStageKey | '';
  otherText: string;
  onSelectStage: (stage: LifeStageKey) => void;
  onChangeOtherText: (text: string) => void;
  onNext: () => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  GraduationCap,
  BookOpen,
  Briefcase,
  TrendingUp,
  Shuffle,
  Rocket,
  RotateCcw,
  Compass,
};

export const StageSituation: React.FC<StageSituationProps> = ({
  selectedStage,
  otherText,
  onSelectStage,
  onChangeOtherText,
  onNext,
}) => {
  const isComplete = selectedStage && (selectedStage !== 'other' || otherText.trim().length > 0);

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#A8B99A] bg-[#EDF2E9] text-xs font-black text-[#526B50]">
          <span>Stage 01 • Current Position</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#171717] tracking-tight leading-tight">
          Let's start with where you are right now.
        </h2>
        <p className="text-sm sm:text-base text-[#555555] font-medium max-w-2xl leading-relaxed">
          Everyone begins somewhere different. Tell us a little about your current situation so we can understand your journey.
        </p>
      </div>

      {/* 8 Selectable Life-Stage Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {LIFE_STAGE_OPTIONS.map((opt) => {
          const isSelected = selectedStage === opt.key;
          const IconComponent = ICON_MAP[opt.iconName] || Compass;

          return (
            <div
              key={opt.key}
              onClick={() => onSelectStage(opt.key)}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between text-left relative active:scale-[0.99] ${
                isSelected
                  ? 'bg-white border-[#171717] shadow-[4px_4px_0px_#FFE76B]'
                  : 'bg-[#FFFDF8] border-[#E8E5DE] hover:border-[#171717] hover:shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-colors ${
                    isSelected
                      ? 'bg-[#FFE76B] border-[#171717] text-[#171717]'
                      : 'bg-[#F4F3EF] border-[#E8E5DE] text-[#555555]'
                  }`}
                >
                  <IconComponent className="w-5 h-5 stroke-[2]" />
                </div>

                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#526B50] border-[#526B50] text-white shadow-xs'
                      : 'border-[#CCCCCC] bg-transparent'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#777777] block mb-1">
                  {opt.tagline}
                </span>
                <h3 className="text-base font-black text-[#171717] mb-1.5 leading-snug">
                  {opt.label}
                </h3>
                <p className="text-xs text-[#555555] font-medium leading-relaxed">
                  {opt.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conditional Other Text Field */}
      {selectedStage === 'other' && (
        <div className="p-5 rounded-2xl bg-white border-2 border-[#171717] shadow-xs space-y-2 animate-fadeIn">
          <label className="block text-xs font-black uppercase tracking-wider text-[#171717]">
            Please describe your unique situation
          </label>
          <input
            type="text"
            value={otherText}
            onChange={(e) => onChangeOtherText(e.target.value)}
            placeholder="e.g. In between finishing military service and exploring tech careers"
            className="w-full px-4 py-3 rounded-xl border border-[#E8E5DE] bg-[#FFFDF8] text-sm text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#526B50]"
            autoFocus
          />
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-end pt-4 border-t border-[#E8E5DE]">
        <Button
          variant="primary"
          size="lg"
          disabled={!isComplete}
          onClick={onNext}
          className="w-full sm:w-auto gap-2 bg-[#FFE76B] hover:bg-[#FADB3D] text-[#171717] border-2 border-[#171717] shadow-[3px_3px_0px_#171717] text-sm font-black px-8 py-3 rounded-full justify-center min-h-[48px]"
        >
          <span>Continue to Identify Uncertainty</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </Button>
      </div>
    </div>
  );
};
