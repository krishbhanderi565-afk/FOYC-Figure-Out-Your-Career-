import React, { useState } from 'react';
import { 
  ClarityPersonData, 
  LifeStageId, 
  UncertaintyId,
  INTEREST_AREAS,
  SKILL_OPTIONS,
  VISION_OPTIONS
} from '../../types/clarity';
import { 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  Target, 
  Clock, 
  Briefcase, 
  Compass, 
  Check, 
  Plus
} from 'lucide-react';

interface StageUnderstandProps {
  lifeStage: LifeStageId | null;
  uncertainties: UncertaintyId[];
  data: ClarityPersonData;
  onChange: (updated: Partial<ClarityPersonData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StageUnderstand: React.FC<StageUnderstandProps> = ({
  lifeStage,
  uncertainties,
  data,
  onChange,
  onNext,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'education' | 'interests' | 'skills' | 'vision' | 'constraints'>('education');
  const [customPossessed, setCustomPossessed] = useState('');
  const [customToDevelop, setCustomToDevelop] = useState('');

  const toggleInterest = (interest: string) => {
    const list = data.interests || [];
    const next = list.includes(interest)
      ? list.filter((i: string) => i !== interest)
      : [...list, interest];
    onChange({ interests: next });
  };

  const togglePossessedSkill = (skill: string) => {
    const list = data.skillsPossessed || [];
    const next = list.includes(skill)
      ? list.filter((s: string) => s !== skill)
      : [...list, skill];
    onChange({ skillsPossessed: next });
  };

  const toggleToDevelopSkill = (skill: string) => {
    const list = data.skillsToDevelop || [];
    const next = list.includes(skill)
      ? list.filter((s: string) => s !== skill)
      : [...list, skill];
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

  // Has AI anxiety or too many options?
  const hasAiAnxiety = uncertainties.includes('ai_anxiety');
  const hasTooManyOptions = uncertainties.includes('too_many_options');
  const hasNoRoadmap = uncertainties.includes('no_clear_roadmap');

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-block text-xs font-bold tracking-wider uppercase px-3 py-1 bg-[#FFE76B]/60 text-[#171717] rounded-full border border-[#171717]/20 mb-3">
          Stage 3 of 7: Understand You
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#171717] tracking-tight mb-3">
          Let’s map your real foundations
        </h2>
        <p className="text-base md:text-lg text-[#555] max-w-2xl mx-auto font-medium">
          Fill in each section to help FOYC and ChatGPT tailor strategic, realistic directions for you.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-start overflow-x-auto gap-2 pb-2 mb-6 border-b border-[#171717]/15">
        {[
          { id: 'education', label: '1. Background', icon: BookOpen },
          { id: 'interests', label: '2. Interests', icon: Sparkles },
          { id: 'skills', label: '3. Skills', icon: Target },
          { id: 'vision', label: '4. Vision & Style', icon: Compass },
          { id: 'constraints', label: '5. Reality & Constraints', icon: Clock },
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

      {/* Tab 1: Background & Education */}
      {activeTab === 'education' && (
        <div className="bg-white/95 rounded-2xl p-6 md:p-8 border-2 border-[#171717]/20 shadow-[3px_3px_0px_#171717] space-y-6">
          <div>
            <h3 className="text-xl font-bold text-[#171717] mb-1">Your Educational & Professional Context</h3>
            <p className="text-xs text-[#666]">Grounds recommendations in your real past experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
                Highest Qualification
              </label>
              <input
                type="text"
                value={data.education || ''}
                onChange={(e) => onChange({ education: e.target.value })}
                placeholder="e.g. 12th Standard, B.Tech CS, B.Com, Self-taught, MBA..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#171717]/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#526B50]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
                Current Role / Field
              </label>
              <input
                type="text"
                value={data.currentRole || ''}
                onChange={(e) => onChange({ currentRole: e.target.value })}
                placeholder="e.g. 3rd-year Student, Junior Support Exec, Freelance, Seeking..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#171717]/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#526B50]"
              />
            </div>
          </div>

          {/* Conditional life stage details */}
          {(lifeStage === 'school-student' || lifeStage === 'college-student') && (
            <div className="p-4 rounded-xl bg-[#FDF5EB] border border-[#171717]/15 space-y-3">
              <span className="text-xs font-bold text-[#526B50] uppercase tracking-wider">Student Focus</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Favorite or strongest subjects..."
                  value={data.personalContext?.favoriteSubjects || ''}
                  onChange={(e) => onChange({ personalContext: { ...data.personalContext, favoriteSubjects: e.target.value } })}
                  className="px-3.5 py-2 rounded-lg border border-[#171717]/20 bg-white text-xs"
                />
                <input
                  type="text"
                  placeholder="Stream choice dilemmas or campus placement status..."
                  value={data.personalContext?.placementStatus || ''}
                  onChange={(e) => onChange({ personalContext: { ...data.personalContext, placementStatus: e.target.value } })}
                  className="px-3.5 py-2 rounded-lg border border-[#171717]/20 bg-white text-xs"
                />
              </div>
            </div>
          )}

          {(lifeStage === 'working-professional' || lifeStage === 'career-switcher') && (
            <div className="p-4 rounded-xl bg-[#FDF5EB] border border-[#171717]/15 space-y-3">
              <span className="text-xs font-bold text-[#526B50] uppercase tracking-wider">Professional Switch / Context</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Years of experience & current industry..."
                  value={data.experience || ''}
                  onChange={(e) => onChange({ experience: e.target.value })}
                  className="px-3.5 py-2 rounded-lg border border-[#171717]/20 bg-white text-xs"
                />
                <input
                  type="text"
                  placeholder="Target field or industry (if any in mind)..."
                  value={data.personalContext?.targetField || ''}
                  onChange={(e) => onChange({ personalContext: { ...data.personalContext, targetField: e.target.value } })}
                  className="px-3.5 py-2 rounded-lg border border-[#171717]/20 bg-white text-xs"
                />
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setActiveTab('interests')}
              className="px-5 py-2 rounded-xl bg-[#171717] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#333]"
            >
              <span>Next: Interests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Interests & Curiosity */}
      {activeTab === 'interests' && (
        <div className="bg-white/95 rounded-2xl p-6 md:p-8 border-2 border-[#171717]/20 shadow-[3px_3px_0px_#171717] space-y-6">
          <div>
            <h3 className="text-xl font-bold text-[#171717] mb-1">What Genuinely Sparks Your Curiosity?</h3>
            <p className="text-xs text-[#666]">Select the domains you feel naturally drawn to or curious about.</p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {INTEREST_AREAS.map((interest: string) => {
              const isSelected = (data.interests || []).includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold border transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#526B50] text-white border-[#171717] shadow-[2px_2px_0px_#171717]'
                      : 'bg-[#FDF5EB]/60 text-[#222] border-[#171717]/20 hover:border-[#171717]/40 hover:bg-white'
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
              What topics or projects make you lose track of time?
            </label>
            <textarea
              rows={3}
              value={data.interestsDeepDive || ''}
              onChange={(e) => onChange({ interestsDeepDive: e.target.value })}
              placeholder="e.g. Tinkering with Notion templates, reading psychology articles, editing videos, fixing bicycles, debating financial trends..."
              className="w-full p-3.5 rounded-xl border border-[#171717]/20 bg-[#FDF5EB]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#526B50]"
            />
          </div>

          <div className="pt-2 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('education')}
              className="px-4 py-2 text-xs font-bold text-[#555] hover:text-[#171717]"
            >
              ← Back to Background
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('skills')}
              className="px-5 py-2 rounded-xl bg-[#171717] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#333]"
            >
              <span>Next: Skills Mapping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Skills Mapping (Possessed vs To Develop) */}
      {activeTab === 'skills' && (
        <div className="bg-white/95 rounded-2xl p-6 md:p-8 border-2 border-[#171717]/20 shadow-[3px_3px_0px_#171717] space-y-6">
          <div>
            <h3 className="text-xl font-bold text-[#171717] mb-1">Your Skills & Capabilities</h3>
            <p className="text-xs text-[#666]">Distinguish between what you can already do and what you want to learn next.</p>
          </div>

          {/* Column 1: Skills Possessed */}
          <div className="p-4 rounded-xl border border-[#171717]/15 bg-[#FDF5EB]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                🟢 Skills I already possess
              </span>
              <span className="text-[11px] text-[#666]">{(data.skillsPossessed || []).length} selected</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map((skill: string) => {
                const isSelected = (data.skillsPossessed || []).includes(skill);
                return (
                  <button
                    key={`poss-${skill}`}
                    type="button"
                    onClick={() => togglePossessedSkill(skill)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
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
                placeholder="Add other skill you possess..."
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
          <div className="p-4 rounded-xl border border-[#171717]/15 bg-[#FFE76B]/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                🎯 Skills I want / need to build
              </span>
              <span className="text-[11px] text-[#666]">{(data.skillsToDevelop || []).length} selected</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map((skill: string) => {
                const isSelected = (data.skillsToDevelop || []).includes(skill);
                return (
                  <button
                    key={`dev-${skill}`}
                    type="button"
                    onClick={() => toggleToDevelopSkill(skill)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
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

          <div className="pt-2 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('interests')}
              className="px-4 py-2 text-xs font-bold text-[#555] hover:text-[#171717]"
            >
              ← Back to Interests
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('vision')}
              className="px-5 py-2 rounded-xl bg-[#171717] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#333]"
            >
              <span>Next: Vision & Style</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Ambitions, Vision & Lifestyle */}
      {activeTab === 'vision' && (
        <div className="bg-white/95 rounded-2xl p-6 md:p-8 border-2 border-[#171717]/20 shadow-[3px_3px_0px_#171717] space-y-6">
          <div>
            <h3 className="text-xl font-bold text-[#171717] mb-1">Your 3–5 Year Ambitions & Preferred Style</h3>
            <p className="text-xs text-[#666]">What kind of outcome feels truly worth working toward?</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-2">
              Primary Driver in the Next 3–5 Years
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {VISION_OPTIONS.map((vis: string) => {
                const isSelected = data.visionDriver === vis;
                return (
                  <button
                    key={vis}
                    type="button"
                    onClick={() => onChange({ visionDriver: vis })}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-[#FFE76B]/40 border-[#171717] font-bold text-[#171717] shadow-[2px_2px_0px_#171717]'
                        : 'bg-white border-[#171717]/20 text-[#333] hover:border-[#171717]/40'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-[#171717] bg-[#171717]' : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-xs md:text-sm">{vis}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Work Style & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
                Work Location Preference
              </label>
              <select
                value={data.workStyle || 'Flexible / Open'}
                onChange={(e) => onChange({ workStyle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#171717]/20 bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#526B50]"
              >
                <option value="Flexible / Open">Flexible / Open</option>
                <option value="100% Remote">100% Remote</option>
                <option value="Hybrid (Office + Home)">Hybrid (Office + Home)</option>
                <option value="On-site / In-person">On-site / In-person</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
                Ideal Environment
              </label>
              <select
                value={data.environmentPreference || 'Open to all'}
                onChange={(e) => onChange({ environmentPreference: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#171717]/20 bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#526B50]"
              >
                <option value="Open to all">Open to all</option>
                <option value="Fast-paced Tech Startup">Fast-paced Tech Startup</option>
                <option value="Stable Established Enterprise">Stable Established Enterprise</option>
                <option value="Freelancing / Boutique Agency">Freelancing / Boutique Agency</option>
                <option value="Solo Founder / Bootstrapper">Solo Founder / Bootstrapper</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('skills')}
              className="px-4 py-2 text-xs font-bold text-[#555] hover:text-[#171717]"
            >
              ← Back to Skills
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('constraints')}
              className="px-5 py-2 rounded-xl bg-[#171717] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#333]"
            >
              <span>Next: Constraints & Reality</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: Real-Life Constraints & Drill-Downs */}
      {activeTab === 'constraints' && (
        <div className="bg-white/95 rounded-2xl p-6 md:p-8 border-2 border-[#171717]/20 shadow-[3px_3px_0px_#171717] space-y-6">
          <div>
            <h3 className="text-xl font-bold text-[#171717] mb-1">Real-Life Constraints & Execution Realities</h3>
            <p className="text-xs text-[#666]">
              A great career plan respects your actual time, budget, and immediate financial requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
                Weekly Available Hours
              </label>
              <select
                value={data.timeAvailable || '5-15 hrs/week'}
                onChange={(e) => onChange({ timeAvailable: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#171717]/20 bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#526B50]"
              >
                <option value="1-5 hrs/week (Very limited)">1-5 hrs/week (Very limited)</option>
                <option value="5-15 hrs/week (Evenings/Weekends)">5-15 hrs/week (Evenings/Weekends)</option>
                <option value="15-30 hrs/week (Part-time dedication)">15-30 hrs/week (Part-time dedication)</option>
                <option value="40+ hrs/week (Full-time focus)">40+ hrs/week (Full-time focus)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
                Upskilling Budget
              </label>
              <select
                value={data.budget || 'Free resources only'}
                onChange={(e) => onChange({ budget: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#171717]/20 bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#526B50]"
              >
                <option value="Free resources only ($0)">Free resources only ($0)</option>
                <option value="Under $100 / ₹5,000">Under $100 / ₹5,000</option>
                <option value="$100 - $500 / ₹10,000-₹40,000">$100 - $500 / ₹10,000-₹40,000</option>
                <option value="Flexible for high-yield programs">Flexible for high-yield programs</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
                Income / Switch Timeline
              </label>
              <select
                value={data.timeline || '3-6 months'}
                onChange={(e) => onChange({ timeline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#171717]/20 bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#526B50]"
              >
                <option value="Immediate (< 3 months, high urgency)">Immediate (&lt; 3 months, high urgency)</option>
                <option value="3-6 months (Balanced ramp)">3-6 months (Balanced ramp)</option>
                <option value="6-12 months (Steady shift)">6-12 months (Steady shift)</option>
                <option value="1-2 years (Long-term build)">1-2 years (Long-term build)</option>
              </select>
            </div>
          </div>

          {/* Stage 2 Adaptive Drill-Downs */}
          {hasAiAnxiety && (
            <div className="p-4 rounded-xl bg-[#FFE76B]/20 border border-[#171717]/20 space-y-2">
              <span className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                🤖 AI Uncertainty Drill-Down
              </span>
              <p className="text-xs text-[#555]">
                You noted concern about AI changing or taking over fields. Which specific tasks or tools worry you most?
              </p>
              <input
                type="text"
                placeholder="e.g. Coding automation, generative writing, entry-level job shrinkage..."
                value={data.specificDrillDowns?.aiConcern || ''}
                onChange={(e) =>
                  onChange({
                    specificDrillDowns: {
                      ...data.specificDrillDowns,
                      aiConcern: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2 rounded-lg border border-[#171717]/20 bg-white text-xs"
              />
            </div>
          )}

          {hasTooManyOptions && (
            <div className="p-4 rounded-xl bg-[#526B50]/10 border border-[#171717]/20 space-y-2">
              <span className="text-xs font-bold text-[#526B50] uppercase tracking-wider">
                🧭 Competing Options Drill-Down
              </span>
              <p className="text-xs text-[#555]">
                You noted having too many choices. What are the 2 or 3 specific roles or industries currently competing in your head?
              </p>
              <input
                type="text"
                placeholder="e.g. Full-Stack Dev vs UI/UX Design vs Product Management..."
                value={data.specificDrillDowns?.competingOptions || ''}
                onChange={(e) =>
                  onChange({
                    specificDrillDowns: {
                      ...data.specificDrillDowns,
                      competingOptions: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2 rounded-lg border border-[#171717]/20 bg-white text-xs"
              />
            </div>
          )}

          {hasNoRoadmap && (
            <div className="p-4 rounded-xl bg-[#FDF5EB] border border-[#171717]/20 space-y-2">
              <span className="text-xs font-bold text-[#171717] uppercase tracking-wider">
                🎯 Target Goal Drill-Down
              </span>
              <p className="text-xs text-[#555]">
                You mentioned having a goal without a roadmap. What is that goal in one or two sentences?
              </p>
              <input
                type="text"
                placeholder="e.g. Land a remote junior frontend developer role within 6 months..."
                value={data.specificDrillDowns?.targetGoal || ''}
                onChange={(e) =>
                  onChange({
                    specificDrillDowns: {
                      ...data.specificDrillDowns,
                      targetGoal: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2 rounded-lg border border-[#171717]/20 bg-white text-xs"
              />
            </div>
          )}

          <div className="pt-2 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setActiveTab('vision')}
              className="px-4 py-2 text-xs font-bold text-[#555] hover:text-[#171717]"
            >
              ← Back to Vision
            </button>
            <button
              type="button"
              onClick={onNext}
              className="px-7 py-3 rounded-xl bg-[#FFE76B] text-[#171717] font-bold text-sm border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-center gap-2 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#171717] transition-all"
            >
              <span>Generate Initial Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Footer Back */}
      <div className="mt-8 pt-4 border-t border-[#171717]/10 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl font-bold text-sm text-[#171717] border border-[#171717]/30 hover:bg-[#171717]/5 transition-colors"
        >
          ← Back to Uncertainties
        </button>
      </div>
    </div>
  );
};
