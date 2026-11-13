import React, { useState } from 'react';
import { ClarityFinalReport } from '../../types/clarity';
import { parseClarityHandoff } from '../../utils/clarityEngine';
import { 
  ClipboardPaste, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Check, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface StageHandoffSubmitProps {
  initialText?: string;
  onSuccess: (report: ClarityFinalReport, rawText: string) => void;
  onBack: () => void;
}

export const StageHandoffSubmit: React.FC<StageHandoffSubmitProps> = ({
  initialText = '',
  onSuccess,
  onBack,
}) => {
  const [rawText, setRawText] = useState(initialText);
  const [error, setError] = useState<string | null>(null);
  const [validationSuccess, setValidationSuccess] = useState<ClarityFinalReport | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setRawText(text);
        setError(null);
      }
    } catch {
      setError('Unable to read directly from clipboard. Please paste (Ctrl+V) into the text box.');
    }
  };

  const handleValidate = () => {
    if (!rawText.trim()) {
      setError('Please paste your ChatGPT response first.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    setTimeout(() => {
      const result = parseClarityHandoff(rawText);
      setIsProcessing(false);

      if (result.success && result.data) {
        setValidationSuccess(result.data as any);
        setError(null);
      } else {
        setError(
          result.errors?.length
            ? result.errors.join(' ')
            : 'Could not extract the structured FOYC handoff block. Please ensure you copied ChatGPT\'s full JSON block.'
        );
        setValidationSuccess(null);
      }
    }, 400);
  };

  const handleProceed = () => {
    if (validationSuccess) {
      onSuccess(validationSuccess, rawText);
    }
  };

  // Helper sample load for preview / testing
  const handleLoadSample = () => {
    const sample = {
      user_profile: {
        name: 'Alex Johnson',
        life_stage: 'career_switcher',
        current_context: 'Marketing coordinator transitioning to UX & Product Strategy',
      },
      executive_summary:
        'Alex is strategically positioned to bridge customer research and digital product design. By leveraging prior marketing analytics skills, the 6-month ramp focuses on interactive prototyping and user research systems, minimizing financial risk while building a portfolio.',
      uncertainty_resolution: {
        root_causes_addressed: [
          'Fear of choosing wrong resolved by targeting Product UX, which blends analytical marketing with creative design.',
          'Experience gap bridged through 2 end-to-end case studies built with real-world open source projects.',
        ],
        key_breakthrough_insights: [
          'Your existing copywriting and user psychology experience is a rare superpower in technical UX.',
          'Do not start from scratch: position yourself as a Hybrid Growth UX Designer.',
        ],
        confidence_score: 88,
      },
      trajectories_evaluated: [
        {
          title: 'Full-Stack Software Engineer',
          fit_score: 65,
          pros: ['High earning ceiling', 'Abundant remote jobs'],
          cons: ['Steeper 12-month ramp', 'Underutilizes existing writing/communication strengths'],
          recommended: false,
        },
        {
          title: 'Product & UX Designer (Hybrid Growth UX)',
          fit_score: 92,
          pros: ['Direct transfer of marketing/user psychology', 'Portfolio-driven hiring in 4-6 months', 'High autonomous creative impact'],
          cons: ['Requires mastering Figma systems and design critique'],
          recommended: true,
        },
        {
          title: 'Growth Product Manager',
          fit_score: 80,
          pros: ['High leverage', 'Strategic ownership'],
          cons: ['Rarely hires entry-level switchers without design or engineering track record'],
          recommended: false,
        },
      ],
      selected_direction: {
        primary_title: 'Product & UX Designer (Hybrid Growth UX)',
        rationale:
          'Maximizes Alex’s background in user psychology, campaign analytics, and storytelling while offering rapid entry into tech products with strong remote demand.',
        target_timeline_months: 6,
        target_role_types: ['Junior Product Designer', 'UX/UI Associate', 'Growth UX Specialist'],
      },
      roadmap_phases: [
        {
          phase_name: 'Phase 1: Foundations & Systems',
          duration_weeks: 'Weeks 1–6',
          objectives: [
            'Master Figma auto-layout, design tokens, and interactive components',
            'Conduct 5 user interviews and produce heuristic evaluation teardowns',
          ],
          deliverables: ['Design System Kit in Figma', 'Audit Case Study of a SaaS checkout flow'],
        },
        {
          phase_name: 'Phase 2: Live Prototype & User Testing',
          duration_weeks: 'Weeks 7–14',
          objectives: [
            'Design mobile & desktop web application from zero to interactive prototype',
            'Run moderated usability testing sessions with 3 real users',
          ],
          deliverables: ['Full interactive SaaS prototype with documented user validation loops'],
        },
        {
          phase_name: 'Phase 3: Portfolio & Strategic Outreach',
          duration_weeks: 'Weeks 15–24',
          objectives: [
            'Build custom portfolio site highlighting problem-solution-impact frameworks',
            'Direct cold reachouts to 30 early-stage tech founders and design leads',
          ],
          deliverables: ['Live Webflow/Framer portfolio with 2 deep case studies', 'Resume & case study presentation deck'],
        },
      ],
      skill_mastery_matrix: {
        immediate_priorities: ['Figma Component Architecture', 'User Research & Synthesis', 'Design Systems (Tokens, Variables)'],
        secondary_skills: ['Basic HTML/CSS understanding', 'Micro-interactions', 'Product Analytics (Mixpanel/PostHog)'],
        skills_to_deprioritize: ['Full-stack backend code', 'Advanced 3D animation', 'Heavy print graphic design'],
      },
      living_action_checklist: [
        { id: 'chk-1', text: 'Set up personal Figma workspace and complete Advanced Auto-Layout course', completed: true, week: 1 },
        { id: 'chk-2', text: 'Conduct 3 heuristic usability audits of favorite products', completed: false, week: 2 },
        { id: 'chk-3', text: 'Select capstone project domain and interview 5 target users', completed: false, week: 4 },
        { id: 'chk-4', text: 'Build responsive high-fidelity prototype with interactive states', completed: false, week: 8 },
        { id: 'chk-5', text: 'Publish case study #1 with user testing video snippets', completed: false, week: 12 },
        { id: 'chk-6', text: 'Launch live portfolio and begin 5 targeted company reachouts per week', completed: false, week: 16 },
      ],
      personal_commitment_statement:
        'I commit to 10 focused hours per week dedicated to building real design case studies and shipping prototypes, rather than endlessly consuming passive tutorials.',
    };

    setRawText(`\`\`\`json\n${JSON.stringify(sample, null, 2)}\n\`\`\``);
    setValidationSuccess(sample as any);
    setError(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-block text-xs font-bold tracking-wider uppercase px-3 py-1 bg-[#FFE76B]/60 text-[#171717] rounded-full border border-[#171717]/20 mb-3">
          Stage 6 of 7: Handoff Submission
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#171717] tracking-tight mb-2">
          Bring Your Clarity Back to FOYC
        </h2>
        <p className="text-sm md:text-base text-[#555] max-w-2xl mx-auto font-medium">
          Paste the complete final response or the structured JSON block generated by ChatGPT below. FOYC will parse and transform it into your permanent clarity dashboard.
        </p>
      </div>

      {/* Main Submission Box */}
      <div className="bg-white rounded-2xl border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <label htmlFor="clarity-handoff-textarea" className="text-xs font-bold uppercase tracking-wider text-[#171717] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#526B50]" />
            <span>Paste ChatGPT Output or JSON Block</span>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePasteClipboard}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FDF5EB] text-[#171717] border border-[#171717]/20 hover:border-[#171717] flex items-center gap-1.5 transition-colors"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>Paste from Clipboard</span>
            </button>

            <button
              type="button"
              onClick={handleLoadSample}
              className="text-[11px] font-semibold text-[#526B50] hover:underline"
            >
              (Load Sample Handoff)
            </button>
          </div>
        </div>

        <textarea
          id="clarity-handoff-textarea"
          rows={12}
          value={rawText}
          onChange={(e) => {
            setRawText(e.target.value);
            if (error) setError(null);
            if (validationSuccess) setValidationSuccess(null);
          }}
          placeholder="Paste here... either the full message from ChatGPT or just the ```json block starting with FOYC PERSONAL CLARITY REPORT..."
          className="w-full p-4 font-mono text-xs md:text-sm rounded-xl border border-[#171717]/20 bg-[#FAF8F5] text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#526B50] leading-relaxed resize-y"
        />

        <div className="flex items-center justify-between mt-3 text-xs text-[#666]">
          <span>{rawText.length.toLocaleString()} characters entered</span>
          <span>Supports full conversational markdown or raw JSON</span>
        </div>

        {/* Diagnostic Error Banner */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 border-2 border-red-300 text-red-800 text-xs md:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Validation Note:</p>
              <p>{error}</p>
              <div className="mt-2 pt-2 border-t border-red-200 text-xs text-red-700">
                <span className="font-bold">💡 How to fix in ChatGPT:</span> Ask ChatGPT:
                <code className="block mt-1 p-2 bg-white rounded border border-red-200 font-mono text-[11px] text-gray-800">
                  "Please output the structured handoff block for FOYC inside a single ```json code block with all fields: user_profile, executive_summary, selected_direction, roadmap_phases, skill_mastery_matrix, living_action_checklist."
                </code>
              </div>
            </div>
          </div>
        )}

        {/* Validation Success Banner */}
        {validationSuccess && (
          <div className="mt-4 p-4 rounded-xl bg-[#526B50]/15 border-2 border-[#526B50] text-[#171717] text-xs md:text-sm">
            <div className="flex items-center gap-2 mb-2 font-bold text-[#526B50]">
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>Structured Clarity Handoff Successfully Validated!</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#526B50]/20 text-xs">
              <div>
                <span className="text-[#666] block">Selected Direction:</span>
                <span className="font-bold text-[#171717]">
                  {validationSuccess.selected_direction?.primary_title || 'Validated Trajectory'}
                </span>
              </div>
              <div>
                <span className="text-[#666] block">Roadmap Phases:</span>
                <span className="font-bold text-[#171717]">
                  {validationSuccess.roadmap_phases?.length || 0} Phases Defined
                </span>
              </div>
              <div>
                <span className="text-[#666] block">Action Checklist:</span>
                <span className="font-bold text-[#171717]">
                  {validationSuccess.living_action_checklist?.length || 0} Action Items Ready
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
          {!validationSuccess ? (
            <button
              type="button"
              onClick={handleValidate}
              disabled={isProcessing || !rawText.trim()}
              className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                rawText.trim() && !isProcessing
                  ? 'bg-[#FFE76B] text-[#171717] border-[#171717] shadow-[3px_3px_0px_#171717] hover:translate-x-[1px] hover:translate-y-[1px]'
                  : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
              }`}
            >
              {isProcessing ? 'Validating schema...' : 'Validate & Preview Master Report'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleProceed}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#526B50] text-white font-extrabold text-sm border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-center justify-center gap-2 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#171717] transition-all"
            >
              <span>View My Personal Clarity Report</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Back Button */}
      <div className="pt-2 flex justify-start">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl font-bold text-sm text-[#171717] border border-[#171717]/30 hover:bg-[#171717]/5 transition-colors"
        >
          ← Back to Prompt
        </button>
      </div>
    </div>
  );
};
