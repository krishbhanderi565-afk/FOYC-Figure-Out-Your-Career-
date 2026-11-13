import React, { useState } from 'react';
import {
  PossibilityQuestionnaireData,
  POSSIBILITY_INTERESTS,
  POSSIBILITY_AMBITIONS,
  POSSIBILITY_SKILLS,
} from '../../types/possibility';
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
  Plus,
  Clock,
  Sparkles,
  Target,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface StageQuestionnaireProps {
  data: PossibilityQuestionnaireData;
  onChange: (updated: Partial<PossibilityQuestionnaireData>) => void;
  onNext: () => void;
  onBack: () => void;
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

export const StageQuestionnaire: React.FC<StageQuestionnaireProps> = ({
  data,
  onChange,
  onNext,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'stage' | 'background' | 'interests' | 'skills' | 'ambitions' | 'boundaries'>('stage');
  const [customPossessed, setCustomPossessed] = useState('');
  const [customToDevelop, setCustomToDevelop] = useState('');

  // Toggle helpers
  const toggleInterest = (interest: string) => {
    const list = data.interests || [];
    const next = list.includes(interest) ? list.filter((i: string) => i !== interest) : [...list, interest];
    onChange({ interests: next });
  };

  const toggleAmbition = (ambition: string) => {
    const list = data.ambitions || [];
    const next = list.includes(ambition) ? list.filter((a: string) => a !== ambition) : [...list, ambition];
    onChange({ ambitions: next });
  };

  const togglePossessedSkill = (skill: string) => {
    const list = data.skillsPossessed || [];
    const next = list.includes(skill) ? list.filter((s: string) => s !== skill) : [...list, skill];
    onChange({ skillsPossessed: next });
  };

  const toggleToDevelopSkill = (skill: string) => {
    const list = data.skillsToDevelop || [];
    const next = list.includes(skill) ? list.filter((s: string) => s !== skill) : [...list, skill];
    onChange({ skillsToDevelop: next });
  };

  const addCustomPossessed = () => {
    if (!customPossessed.trim()) return;
    const list = data.skillsPossessed || [];
    if (!list.includes(customPossessed.trim())) {
      onChange({ skillsPossessed: [...list, customPossessed.trim()] });
    }
    setCustomPossessed('');
  };

  const addCustomToDevelop = () => {
    if (!customToDevelop.trim()) return;
    const list = data.skillsToDevelop || [];
    if (!list.includes(customToDevelop.trim())) {
      onChange({ skillsToDevelop: [...list, customToDevelop.trim()] });
    }
    setCustomToDevelop('');
  };

  const isStageSelected = Boolean(data.lifeStage && (data.lifeStage !== 'other' || data.lifeStageOther.trim()));

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Questionnaire Navigation Tabs */}
      <div className="flex items-center justify-start overflow-x-auto gap-2 pb-2 mb-6 border-b border-[#171717]/15">
        {[
          { id: 'stage', label: 'A. Life Stage', icon: Compass },
          { id: 'background', label: 'B. Background', icon: BookOpen },
          { id: 'interests', label: 'C. Interests', icon: Sparkles },
          { id: 'skills', label: 'D. Skills & Strengths', icon: Target },
          { id: 'ambitions', label: 'E. Ambitions', icon: TrendingUp },
          { id: 'boundaries', label: 'F. Boundaries & Reality', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap flex items-center gap-2 border transition-all ${
                isActive
                  ? 'bg-[#171717] text-white border-[#171717] shadow-[2px_2px_0px_#526B50]'
                  : 'bg-white/80 text-[#555] border-[#171717]/15 hover:bg-white hover:text-[#171717]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION A: CURRENT LIFE STAGE */}
      {activeTab === 'stage' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-[#171717] shadow-[3px_3px_0px_#171717] space-y-6">
          <div className="text-center md:text-left">
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFE76B] text-[#171717] border border-[#171717]/20">
              Section A of F
            </span>
            <h2 className="text-2xl font-black text-[#171717] mt-2">
              Where are you in your journey right now?
            </h2>
            <p className="text-xs sm:text-sm text-[#666] mt-1 font-medium">
              Select the situation that best mirrors your current life or career phase.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {LIFE_STAGE_OPTIONS.map((opt) => {
              const isSelected = data.lifeStage === opt.key;
              const IconComponent = ICON_MAP[opt.iconName] || Compass;

              return (
                <div
                  key={opt.key}
                  onClick={() => onChange({ lifeStage: opt.key })}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 relative ${
                    isSelected
                      ? 'bg-[#526B50]/10 border-[#171717] shadow-[3px_3px_0px_#171717]'
                      : 'bg-[#FDF5EB]/40 border-[#171717]/15 hover:border-[#171717]/50 hover:bg-white'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? 'bg-[#526B50] text-white border-[#171717]'
                        : 'bg-white text-[#171717] border-[#171717]/20'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 stroke-[2]" />
                  </div>

                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className={`text-sm font-bold ${isSelected ? 'text-[#171717]' : 'text-[#333]'}`}>
                      {opt.label}
                    </h3>
                    <p className="text-[11px] text-[#666] mt-0.5 line-clamp-2">
                      {opt.description}
                    </p>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md border shrink-0 flex items-center justify-center mt-0.5 ${
                      isSelected ? 'bg-[#171717] text-white border-[#171717]' : 'border-[#171717]/30'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* If Other is selected */}
          {data.lifeStage === 'other' && (
            <div className="p-4 rounded-xl bg-[#FDF5EB] border border-[#171717]/20 space-y-2">
              <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider">
                Describe your unique situation:
              </label>
              <input
                type="text"
                value={data.lifeStageOther}
                onChange={(e) => onChange({ lifeStageOther: e.target.value })}
                placeholder="e.g., Sabbatical after 10 years in civil service, relocating countries..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#171717]/20 bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#526B50]"
              />
            </div>
          )}

          <div className="pt-4 border-t border-[#171717]/10 flex justify-between items-center">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 text-xs font-bold text-[#666] hover:text-[#171717]"
            >
              ← Back to Intro
            </button>

            <button
              type="button"
              disabled={!isStageSelected}
              onClick={() => setActiveTab('background')}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 border-2 transition-all ${
                isStageSelected
                  ? 'bg-[#171717] text-white border-[#171717] shadow-[2px_2px_0px_#526B50] hover:bg-[#333]'
                  : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
              }`}
            >
              <span>Next: Background Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION B: YOUR BACKGROUND (Adaptive) */}
      {activeTab === 'background' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-[#171717] shadow-[3px_3px_0px_#171717] space-y-6">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFE76B] text-[#171717] border border-[#171717]/20">
              Section B of F • Adaptive Background
            </span>
            <h2 className="text-2xl font-black text-[#171717] mt-2">
              Tell us about your background & experience
            </h2>
            <p className="text-xs sm:text-sm text-[#666] mt-1 font-medium">
              We calibrate recommendations so they are grounded in your real qualifications and accomplishments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
                Highest Education Level
              </label>
              <input
                type="text"
                value={data.educationLevel}
                onChange={(e) => onChange({ educationLevel: e.target.value })}
                placeholder="e.g., High School, Bachelor's in progress, Master's, Self-Taught..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#171717]/20 bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#526B50]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
                Course, Degree or Specialization
              </label>
              <input
                type="text"
                value={data.degreeOrCourse}
                onChange={(e) => onChange({ degreeOrCourse: e.target.value })}
                placeholder="e.g., B.Sc Computer Science, Commerce, Literature, Self-directed..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#171717]/20 bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#526B50]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
                Current Role / Focus
              </label>
              <input
                type="text"
                value={data.currentRole}
                onChange={(e) => onChange({ currentRole: e.target.value })}
                placeholder="e.g., Student, Associate Analyst, Marketing Specialist, Seeking first role..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#171717]/20 bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#526B50]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
                Years of Practical Experience
              </label>
              <select
                value={data.yearsExperience || 'None yet / Student'}
                onChange={(e) => onChange({ yearsExperience: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#171717]/20 bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#526B50]"
              >
                <option value="None yet / Student">None yet / Student projects</option>
                <option value="Less than 1 year">Less than 1 year</option>
                <option value="1–3 years">1–3 years</option>
                <option value="3–5 years">3–5 years</option>
                <option value="5–10 years">5–10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
            </div>
          </div>

          {/* Adaptive prompt for specific stages */}
          {data.lifeStage === 'career-switcher' && (
            <div className="p-4 rounded-xl bg-[#FDF5EB] border border-[#171717]/20 space-y-2">
              <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider">
                Reason for Career Switch / What feels missing currently:
              </label>
              <input
                type="text"
                value={data.industry}
                onChange={(e) => onChange({ industry: e.target.value })}
                placeholder="e.g., Burnt out on sales quotas, want autonomous creative product work..."
                className="w-full px-3.5 py-2 rounded-lg border border-[#171717]/20 bg-white text-xs"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
              Certifications, Key Projects, or Proud Achievements (Optional)
            </label>
            <textarea
              rows={2}
              value={data.certificationsOrAchievements}
              onChange={(e) => onChange({ certificationsOrAchievements: e.target.value })}
              placeholder="e.g., Built an e-commerce prototype, certified AWS Cloud Practitioner, led student newsletter..."
              className="w-full p-3 rounded-xl border border-[#171717]/20 bg-[#FDF5EB]/30 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#526B50]"
            />
          </div>

          <div className="pt-4 border-t border-[#171717]/10 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('stage')}
              className="px-4 py-2 text-xs font-bold text-[#666] hover:text-[#171717]"
            >
              ← Back to Stage
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('interests')}
              className="px-6 py-2.5 rounded-xl bg-[#171717] text-white font-bold text-xs md:text-sm flex items-center gap-2 hover:bg-[#333]"
            >
              <span>Next: Interests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION C: YOUR INTERESTS */}
      {activeTab === 'interests' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-[#171717] shadow-[3px_3px_0px_#171717] space-y-6">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFE76B] text-[#171717] border border-[#171717]/20">
              Section C of F
            </span>
            <h2 className="text-2xl font-black text-[#171717] mt-2">
              What are you naturally interested in exploring?
            </h2>
            <p className="text-xs sm:text-sm text-[#666] mt-1 font-medium">
              Select all domains you feel drawn to. We deliberately combine multiple interests to discover hybrid opportunities.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {POSSIBILITY_INTERESTS.map((interest: string) => {
              const isSelected = (data.interests || []).includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold border transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#526B50] text-white border-[#171717] shadow-[2px_2px_0px_#171717]'
                      : 'bg-[#FDF5EB]/50 text-[#333] border-[#171717]/20 hover:border-[#171717]/60 hover:bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  <span>{interest}</span>
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
              What else are you curious about?
            </label>
            <textarea
              rows={3}
              value={data.curiosityFreeText}
              onChange={(e) => onChange({ curiosityFreeText: e.target.value })}
              placeholder="Describe topics, side hobbies, obscure subjects, or projects you naturally enjoy reading or watching videos about..."
              className="w-full p-3.5 rounded-xl border border-[#171717]/20 bg-[#FDF5EB]/30 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#526B50]"
            />
          </div>

          <div className="pt-4 border-t border-[#171717]/10 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('background')}
              className="px-4 py-2 text-xs font-bold text-[#666] hover:text-[#171717]"
            >
              ← Back to Background
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('skills')}
              className="px-6 py-2.5 rounded-xl bg-[#171717] text-white font-bold text-xs md:text-sm flex items-center gap-2 hover:bg-[#333]"
            >
              <span>Next: Skills Mapping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION D: SKILLS & CAPABILITIES */}
      {activeTab === 'skills' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-[#171717] shadow-[3px_3px_0px_#171717] space-y-6">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFE76B] text-[#171717] border border-[#171717]/20">
              Section D of F
            </span>
            <h2 className="text-2xl font-black text-[#171717] mt-2">
              What can you bring to the table?
            </h2>
            <p className="text-xs sm:text-sm text-[#666] mt-1 font-medium">
              Distinguish between the skills you already bring and the ones you are excited to develop next.
            </p>
          </div>

          {/* Column 1: Skills Possessed */}
          <div className="p-4 rounded-xl border-2 border-[#171717]/15 bg-[#FDF5EB]/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                🟢 Skills I currently possess
              </span>
              <span className="text-[11px] text-[#666]">{(data.skillsPossessed || []).length} selected</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {POSSIBILITY_SKILLS.map((skill: string) => {
                const isSelected = (data.skillsPossessed || []).includes(skill);
                return (
                  <button
                    key={`pos-${skill}`}
                    type="button"
                    onClick={() => togglePossessedSkill(skill)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      isSelected
                        ? 'bg-[#171717] text-white border-[#171717]'
                        : 'bg-white text-[#333] border-[#171717]/20 hover:border-[#171717]/50'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add other skill you bring..."
                value={customPossessed}
                onChange={(e) => setCustomPossessed(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomPossessed();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-lg border border-[#171717]/20 bg-white text-xs"
              />
              <button
                type="button"
                onClick={addCustomPossessed}
                className="px-3 py-1.5 rounded-lg bg-[#526B50] text-white text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Column 2: Skills To Develop */}
          <div className="p-4 rounded-xl border-2 border-[#171717]/15 bg-[#FFE76B]/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                🎯 Skills I want to develop
              </span>
              <span className="text-[11px] text-[#666]">{(data.skillsToDevelop || []).length} selected</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {POSSIBILITY_SKILLS.map((skill: string) => {
                const isSelected = (data.skillsToDevelop || []).includes(skill);
                return (
                  <button
                    key={`dev-${skill}`}
                    type="button"
                    onClick={() => toggleToDevelopSkill(skill)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      isSelected
                        ? 'bg-[#526B50] text-white border-[#171717]'
                        : 'bg-white text-[#333] border-[#171717]/20 hover:border-[#171717]/50'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add other skill you want to learn..."
                value={customToDevelop}
                onChange={(e) => setCustomToDevelop(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomToDevelop();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-lg border border-[#171717]/20 bg-white text-xs"
              />
              <button
                type="button"
                onClick={addCustomToDevelop}
                className="px-3 py-1.5 rounded-lg bg-[#526B50] text-white text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#171717]/10 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('interests')}
              className="px-4 py-2 text-xs font-bold text-[#666] hover:text-[#171717]"
            >
              ← Back to Interests
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ambitions')}
              className="px-6 py-2.5 rounded-xl bg-[#171717] text-white font-bold text-xs md:text-sm flex items-center gap-2 hover:bg-[#333]"
            >
              <span>Next: Ambitions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION E: AMBITIONS */}
      {activeTab === 'ambitions' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-[#171717] shadow-[3px_3px_0px_#171717] space-y-6">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFE76B] text-[#171717] border border-[#171717]/20">
              Section E of F
            </span>
            <h2 className="text-2xl font-black text-[#171717] mt-2">
              What would you ideally like to achieve?
            </h2>
            <p className="text-xs sm:text-sm text-[#666] mt-1 font-medium">
              Select all ambitions that speak to you. There are no right or wrong answers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {POSSIBILITY_AMBITIONS.map((ambition: string) => {
              const isSelected = (data.ambitions || []).includes(ambition);
              return (
                <button
                  key={ambition}
                  type="button"
                  onClick={() => toggleAmbition(ambition)}
                  className={`p-3.5 rounded-xl text-left border-2 transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-[#FFE76B]/30 border-[#171717] font-bold text-[#171717] shadow-[2px_2px_0px_#171717]'
                      : 'bg-[#FDF5EB]/40 border-[#171717]/15 text-[#333] hover:border-[#171717]/40 hover:bg-white'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-md border shrink-0 flex items-center justify-center mt-0.5 ${
                      isSelected ? 'bg-[#171717] text-white border-[#171717]' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs md:text-sm">{ambition}</span>
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
              Describe your bigger vision: What would you like your life to look like in 3–5 years?
            </label>
            <textarea
              rows={3}
              value={data.visionThreeToFiveYears}
              onChange={(e) => onChange({ visionThreeToFiveYears: e.target.value })}
              placeholder="e.g., Living in a walkable city, working 30 hours a week on products I believe in, having financial peace of mind and time for creative pursuits..."
              className="w-full p-3.5 rounded-xl border border-[#171717]/20 bg-[#FDF5EB]/30 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#526B50]"
            />
          </div>

          <div className="pt-4 border-t border-[#171717]/10 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('skills')}
              className="px-4 py-2 text-xs font-bold text-[#666] hover:text-[#171717]"
            >
              ← Back to Skills
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('boundaries')}
              className="px-6 py-2.5 rounded-xl bg-[#171717] text-white font-bold text-xs md:text-sm flex items-center gap-2 hover:bg-[#333]"
            >
              <span>Next: Boundaries & Reality</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* SECTION F: PRACTICAL BOUNDARIES & FINAL NOTES */}
      {activeTab === 'boundaries' && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-[#171717] shadow-[3px_3px_0px_#171717] space-y-6">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFE76B] text-[#171717] border border-[#171717]/20">
              Section F of F
            </span>
            <h2 className="text-2xl font-black text-[#171717] mt-2">
              Let’s understand what is realistic for you
            </h2>
            <p className="text-xs sm:text-sm text-[#666] mt-1 font-medium">
              We never recommend impossible leaps. Boundaries protect you from burnout and impractical paths.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
                Weekly Available Learning Time
              </label>
              <select
                value={data.timeAvailableWeekly || '5–15 hrs/week'}
                onChange={(e) => onChange({ timeAvailableWeekly: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#171717]/20 bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#526B50]"
              >
                <option value="1–5 hrs/week (Very limited)">1–5 hrs/week (Very limited)</option>
                <option value="5–15 hrs/week (Evenings/Weekends)">5–15 hrs/week (Evenings/Weekends)</option>
                <option value="15–30 hrs/week (Dedicated part-time)">15–30 hrs/week (Dedicated part-time)</option>
                <option value="40+ hrs/week (Full-time focus)">40+ hrs/week (Full-time focus)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
                Upskilling Budget
              </label>
              <select
                value={data.budgetPreference || 'Free to low-cost ($0–$100)'}
                onChange={(e) => onChange({ budgetPreference: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#171717]/20 bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#526B50]"
              >
                <option value="Free resources only ($0)">Free resources only ($0)</option>
                <option value="Free to low-cost ($0–$100)">Free to low-cost ($0–$100)</option>
                <option value="Moderate ($100–$500)">Moderate ($100–$500)</option>
                <option value="Flexible for high-yield programs">Flexible for high-yield programs</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
                Work Setting Preference
              </label>
              <select
                value={data.workEnvironment || '100% Remote'}
                onChange={(e) => onChange({ workEnvironment: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#171717]/20 bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#526B50]"
              >
                <option value="100% Remote">100% Remote</option>
                <option value="Hybrid (Office + Home)">Hybrid (Office + Home)</option>
                <option value="On-site / In-person">On-site / In-person</option>
                <option value="Flexible / Open">Flexible / Open</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FDF5EB] border border-[#171717]/20 space-y-3">
            <div className="flex items-center gap-3">
              <input
                id="immediate-income-checkbox"
                type="checkbox"
                checked={data.needImmediateIncome}
                onChange={(e) => onChange({ needImmediateIncome: e.target.checked })}
                className="w-4 h-4 text-[#526B50] rounded border-gray-300 focus:ring-[#526B50]"
              />
              <label htmlFor="immediate-income-checkbox" className="text-xs md:text-sm font-bold text-[#171717] cursor-pointer">
                I have an immediate need for income (within 3 months)
              </label>
            </div>
            <p className="text-[11px] text-[#666] pl-7">
              When checked, FOYC instructs ChatGPT to prioritize opportunities with rapid entry velocity (such as technical freelancing or bridging roles) alongside longer-term ambitions.
            </p>
          </div>

          {/* Optional Final Open Field */}
          <div>
            <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
              Is there anything else we should understand about you before exploring your possibilities? (Optional)
            </label>
            <textarea
              rows={3}
              value={data.additionalNotes}
              onChange={(e) => onChange({ additionalNotes: e.target.value })}
              placeholder="Any past attempts, doubts, family expectations, or non-negotiables you want considered..."
              className="w-full p-3.5 rounded-xl border border-[#171717]/20 bg-[#FDF5EB]/30 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#526B50]"
            />
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-[#171717]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('ambitions')}
              className="px-4 py-2 text-xs font-bold text-[#666] hover:text-[#171717]"
            >
              ← Back to Ambitions
            </button>

            <button
              type="button"
              onClick={onNext}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#FFE76B] text-[#171717] font-extrabold text-sm md:text-base border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-center justify-center gap-2 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#171717] transition-all"
            >
              <span>Generate My Exploration Prompt</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
