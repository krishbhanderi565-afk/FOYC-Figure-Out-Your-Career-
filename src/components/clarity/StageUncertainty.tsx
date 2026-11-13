import React, { useState } from 'react';
import { UNCERTAINTY_OPTIONS, UncertaintyId } from '../../types/clarity';
import { 
  Compass, 
  HelpCircle, 
  AlertTriangle, 
  BrainCircuit, 
  DollarSign, 
  Cpu, 
  Users, 
  BatteryLow, 
  MapPin, 
  Shuffle, 
  GraduationCap, 
  Clock, 
  PlusCircle, 
  ArrowRight,
  Check
} from 'lucide-react';

interface StageUncertaintyProps {
  selectedUncertainties: UncertaintyId[];
  customUncertainty: string;
  reflectionText: string;
  onChange: (data: {
    uncertainties: UncertaintyId[];
    customUncertainty?: string;
    reflectionText?: string;
  }) => void;
  onNext: () => void;
  onBack: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  too_many_options: Compass,
  dont_know_strengths: HelpCircle,
  fear_of_choosing_wrong: AlertTriangle,
  lack_experience: BrainCircuit,
  financial_pressure: DollarSign,
  ai_anxiety: Cpu,
  social_expectations: Users,
  burnt_out: BatteryLow,
  no_clear_roadmap: MapPin,
  career_switch_risk: Shuffle,
  nontraditional_background: GraduationCap,
  feeling_behind: Clock,
  other: PlusCircle,
};

export const StageUncertainty: React.FC<StageUncertaintyProps> = ({
  selectedUncertainties,
  customUncertainty,
  reflectionText,
  onChange,
  onNext,
  onBack,
}) => {
  const [otherText, setOtherText] = useState(customUncertainty || '');
  const [reflection, setReflection] = useState(reflectionText || '');

  const toggleOption = (id: UncertaintyId) => {
    let nextList: UncertaintyId[];
    if (selectedUncertainties.includes(id)) {
      nextList = selectedUncertainties.filter((item) => item !== id);
    } else {
      nextList = [...selectedUncertainties, id];
    }
    onChange({
      uncertainties: nextList,
      customUncertainty: otherText,
      reflectionText: reflection,
    });
  };

  const handleOtherChange = (val: string) => {
    setOtherText(val);
    const hasOther = selectedUncertainties.includes('other');
    const nextList = val.trim() && !hasOther
      ? [...selectedUncertainties, 'other' as UncertaintyId]
      : !val.trim() && hasOther
      ? selectedUncertainties.filter((i) => i !== 'other')
      : selectedUncertainties;

    onChange({
      uncertainties: nextList,
      customUncertainty: val,
      reflectionText: reflection,
    });
  };

  const handleReflectionChange = (val: string) => {
    setReflection(val);
    onChange({
      uncertainties: selectedUncertainties,
      customUncertainty: otherText,
      reflectionText: val,
    });
  };

  const isValid = selectedUncertainties.length > 0 || reflection.trim().length > 10;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-block text-xs font-bold tracking-wider uppercase px-3 py-1 bg-[#FFE76B]/60 text-[#171717] rounded-full border border-[#171717]/20 mb-3">
          Stage 2 of 7: Uncertainty Identification
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#171717] tracking-tight mb-3">
          What’s creating the uncertainty?
        </h2>
        <p className="text-base md:text-lg text-[#555] max-w-2xl mx-auto font-medium">
          Select all that feel true right now. You can choose more than one. Honesty here directly improves the precision of your advice.
        </p>
      </div>

      {/* Uncertainty Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-8">
        {UNCERTAINTY_OPTIONS.filter((opt) => (opt.id || opt.key) !== 'other').map((opt) => {
          const optId = opt.id || opt.key;
          const isSelected = selectedUncertainties.includes(optId);
          const Icon = ICON_MAP[optId] || HelpCircle;

          return (
            <button
              key={optId}
              type="button"
              onClick={() => toggleOption(optId)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3.5 group relative ${
                isSelected
                  ? 'border-[#171717] bg-[#526B50]/10 shadow-[3px_3px_0px_#171717]'
                  : 'border-[#171717]/15 bg-white/90 hover:border-[#171717]/40 hover:bg-white shadow-[2px_2px_0px_rgba(0,0,0,0.05)]'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                  isSelected
                    ? 'bg-[#526B50] text-white border-[#171717]'
                    : 'bg-[#FDF5EB] text-[#171717] border-[#171717]/20 group-hover:border-[#171717]/40'
                }`}
              >
                {isSelected ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-5 h-5 stroke-[2]" />}
              </div>

              <div className="flex-1 min-w-0 pr-2">
                <p className={`text-sm md:text-base font-semibold leading-snug ${isSelected ? 'text-[#171717]' : 'text-[#222]'}`}>
                  {opt.label}
                </p>
                <span className="text-[11px] uppercase tracking-wider text-[#666] font-medium block mt-1">
                  {opt.category}
                </span>
              </div>

              <div
                className={`w-5 h-5 rounded-md border shrink-0 flex items-center justify-center mt-0.5 ${
                  isSelected
                    ? 'bg-[#171717] border-[#171717] text-white'
                    : 'border-[#171717]/30 bg-transparent'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </div>
            </button>
          );
        })}

        {/* Other option */}
        <div
          className={`w-full text-left p-4 rounded-xl border-2 transition-all md:col-span-2 ${
            selectedUncertainties.includes('other')
              ? 'border-[#171717] bg-[#526B50]/10 shadow-[3px_3px_0px_#171717]'
              : 'border-[#171717]/15 bg-white/90'
          }`}
        >
          <div className="flex items-center gap-3.5 mb-2">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                selectedUncertainties.includes('other')
                  ? 'bg-[#526B50] text-white border-[#171717]'
                  : 'bg-[#FDF5EB] text-[#171717] border-[#171717]/20'
              }`}
            >
              <PlusCircle className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex-1">
              <label htmlFor="custom-uncertainty-input" className="text-sm md:text-base font-semibold text-[#171717] block">
                Something else specific to your situation?
              </label>
              <span className="text-[11px] text-[#666]">Add any other challenge or ambiguity not covered above</span>
            </div>
          </div>
          <input
            id="custom-uncertainty-input"
            type="text"
            value={otherText}
            onChange={(e) => handleOtherChange(e.target.value)}
            placeholder="e.g. Relocating to a new country and unsure how foreign credentials translate..."
            className="w-full mt-2 px-3.5 py-2.5 rounded-lg border border-[#171717]/20 bg-white text-[#171717] text-sm focus:outline-none focus:ring-2 focus:ring-[#526B50] focus:border-[#171717]"
          />
        </div>
      </div>

      {/* Free-form reflection textarea */}
      <div className="bg-white/95 rounded-2xl p-6 border-2 border-[#171717]/20 shadow-[3px_3px_0px_#171717] mb-8">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[#FFE76B] border border-[#171717] flex items-center justify-center shrink-0 font-bold text-xs text-[#171717]">
            📝
          </div>
          <div>
            <h3 className="text-base font-bold text-[#171717]">
              Tell us more about what's going on in your mind
            </h3>
            <p className="text-xs text-[#555]">
              Optional, but makes your assessment and ChatGPT session much more deeply personalized.
            </p>
          </div>
        </div>

        <textarea
          value={reflection}
          onChange={(e) => handleReflectionChange(e.target.value)}
          rows={4}
          placeholder="Write as freely as you want. Mention your dilemmas, past attempts, frustrations, what you've enjoyed, what you want to avoid..."
          className="w-full p-3.5 rounded-xl border border-[#171717]/20 bg-[#FDF5EB]/30 text-[#171717] text-sm focus:outline-none focus:ring-2 focus:ring-[#526B50] focus:border-[#171717] leading-relaxed resize-y"
        />

        <div className="flex items-center justify-between mt-2 text-xs text-[#666]">
          <span>{reflection.length} characters</span>
          <span>Your thoughts stay private and encrypted</span>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[#171717]/10">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl font-bold text-sm text-[#171717] border border-[#171717]/30 hover:bg-[#171717]/5 transition-colors"
        >
          ← Back
        </button>

        <div className="flex items-center gap-3">
          {!isValid && (
            <span className="text-xs text-[#888] hidden sm:inline">
              Select at least 1 uncertainty or share a thought to continue
            </span>
          )}
          <button
            type="button"
            onClick={onNext}
            disabled={!isValid}
            className={`px-7 py-3 rounded-xl font-bold text-sm flex items-center gap-2 border-2 transition-all ${
              isValid
                ? 'bg-[#FFE76B] text-[#171717] border-[#171717] shadow-[3px_3px_0px_#171717] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#171717]'
                : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
            }`}
          >
            <span>Continue to Questionnaire</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
