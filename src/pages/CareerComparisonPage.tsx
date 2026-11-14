import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GitCompare,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Download,
  FileText,
  AlertCircle,
  Clock,
  Target,
  ShieldCheck,
  Award,
  ChevronRight,
  Plus,
  Trash2,
} from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Button } from '../components/common/Button';
import { CareerComparisonReport, DEFAULT_DIMENSIONS } from '../types/comparison';
import { generateComparisonPrompt, parseComparisonHandoff } from '../utils/comparisonEngine';
import { generateComparisonPdf, generateComparisonDocx } from '../utils/comparisonDocExport';
import { openChatGPTWithPrompt } from '../utils/chatGptLauncher';
import { useCareer } from '../context/CareerContext';

const POPULAR_COMPARISON_PRESETS = [
  { p1: 'AI & Full Stack Developer', p2: 'AI Product Manager' },
  { p1: 'Data Analyst & BI Specialist', p2: 'Digital Marketing Strategist' },
  { p1: 'UI/UX Designer & Researcher', p2: 'Front-End Engineer' },
  { p1: 'Technical Writer & Content Strategist', p2: 'Cybersecurity Analyst' },
];

export const CareerComparisonPage: React.FC = () => {
  const navigate = useNavigate();
  const { applyHandoffText, userName } = useCareer();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  const handleBuildDirectDashboard = (targetTitle: string) => {
    const primaryDesc = report?.recommendation?.strategicRationale || 'Strategic trajectory selected from career path comparison.';
    const altPaths = (report?.comparedPaths || []).map(p => ({
      title: p.title,
      description: p.summary || '',
      overlap_score: p.scores ? Math.round(Object.values(p.scores).reduce((a, b) => a + b, 0) * 1.5) : 85,
    }));

    const synthesized = `\`\`\`json
{
  "schema_version": "2.0",
  "profile": {
    "preferred_name": "${userName || 'Explorer'}",
    "current_career_stage": "Career Pivot",
    "work_experience": "${currentBackground.replace(/"/g, '\\"') || 'Prior professional background'}"
  },
  "career_direction": {
    "primary_career_direction": "${targetTitle.replace(/"/g, '\\"')}",
    "career_description": "${primaryDesc.replace(/"/g, '\\"')}",
    "confidence_level": ${report?.recommendation?.confidenceScore || 90},
    "alternative_career_paths": ${JSON.stringify(altPaths)}
  },
  "next7DayExperiment": ${JSON.stringify(report?.next7DayExperiment || null)}
}
\`\`\``;

    applyHandoffText(synthesized);
    navigate('/dashboard');
  };

  // Step 1: Paths
  const [paths, setPaths] = useState<{ title: string; notes?: string }[]>([
    { title: 'AI & Full Stack Engineer', notes: 'Building web applications and AI agent integrations' },
    { title: 'AI Product Manager', notes: 'Managing feature roadmaps and cross-functional AI tooling' },
  ]);

  // Step 2: Context & Dimensions
  const [currentBackground, setCurrentBackground] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('Career pivot with strong income in 6-12 months');
  const [timelineMonths, setTimelineMonths] = useState(12);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([
    'income_speed',
    'ai_resilience',
    'learning_curve',
    'work_life_balance',
  ]);
  const [constraints, setConstraints] = useState('15-20 hours per week available for study/practice');

  // Step 3: Prompt
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Step 4: JSON Input
  const [handoffInput, setHandoffInput] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);

  // Step 5: Report
  const [report, setReport] = useState<CareerComparisonReport | null>(null);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingDocx, setExportingDocx] = useState(false);

  const toggleDimension = (id: string) => {
    if (selectedDimensions.includes(id)) {
      if (selectedDimensions.length > 2) {
        setSelectedDimensions(selectedDimensions.filter((d) => d !== id));
      }
    } else {
      setSelectedDimensions([...selectedDimensions, id]);
    }
  };

  const addPath = () => {
    if (paths.length < 4) {
      setPaths([...paths, { title: '', notes: '' }]);
    }
  };

  const removePath = (idx: number) => {
    if (paths.length > 2) {
      setPaths(paths.filter((_, i) => i !== idx));
    }
  };

  const updatePath = (idx: number, field: 'title' | 'notes', val: string) => {
    const updated = [...paths];
    updated[idx] = { ...updated[idx], [field]: val };
    setPaths(updated);
  };

  const applyPreset = (p1: string, p2: string) => {
    setPaths([
      { title: p1, notes: 'Targeting industry standard competencies' },
      { title: p2, notes: 'Alternative high-growth track' },
    ]);
  };

  const generatedPrompt = generateComparisonPrompt({
    paths: paths.filter((p) => p.title.trim().length > 0),
    currentBackground,
    primaryGoal,
    timelineMonths,
    selectedDimensions,
    constraints,
  });

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(generatedPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const handleValidateHandoff = () => {
    setParseError(null);
    if (!handoffInput.trim()) {
      setParseError('Please paste your ChatGPT comparison handoff block.');
      return;
    }
    const result = parseComparisonHandoff(handoffInput);
    if (!result.success || !result.data) {
      setParseError(result.error || 'Failed to parse JSON. Please ensure the full code block is copied.');
      return;
    }
    setReport(result.data);
    setStep(5);
  };

  const loadSampleReport = () => {
    const sample: CareerComparisonReport = {
      version: '1.0',
      executiveSummary:
        'Both pathways offer strong upward mobility, but AI & Full Stack Engineering provides significantly faster freelance monetization within 90 days. Conversely, AI Product Management commands a higher long-term ceiling but requires prior leadership or domain expertise to break into.',
      comparedPaths: [
        {
          id: 'p1',
          title: paths[0]?.title || 'AI & Full Stack Engineer',
          category: 'Software Engineering',
          timeHorizon: '6-9 months',
          summary: 'End-to-end web architecture, Python APIs, and LLM orchestration for modern SaaS applications.',
          scores: {
            income_speed: 9,
            ai_resilience: 8,
            learning_curve: 7,
            work_life_balance: 7,
            remote_flexibility: 10,
            capital_required: 2,
          },
          pros: [
            'Immediate freelance demand for AI integrations',
            'Independent portfolio proves competence without credentials',
            'Abundance of global remote job opportunities',
          ],
          cons: [
            'High continuous learning requirement as tooling evolves weekly',
            'Initial debugging friction during first 3 months',
          ],
          breakEvenMonths: 4,
          bestFitIf: 'You enjoy direct technical execution and building software from scratch.',
        },
        {
          id: 'p2',
          title: paths[1]?.title || 'AI Product Manager',
          category: 'Product Strategy',
          timeHorizon: '9-14 months',
          summary: 'Translating business objectives and user problems into clear AI feature roadmaps and team deliverables.',
          scores: {
            income_speed: 6,
            ai_resilience: 9,
            learning_curve: 6,
            work_life_balance: 6,
            remote_flexibility: 7,
            capital_required: 1,
          },
          pros: [
            'High strategic influence across executive and tech teams',
            'Top-tier base salaries at enterprise and growth-stage firms',
            'Strong interpersonal and commercial leverage',
          ],
          cons: [
            'High barrier to entry without prior formal PM or domain experience',
            'Fewer entry-level or junior freelance opportunities',
          ],
          breakEvenMonths: 9,
          bestFitIf: 'You thrive at stakeholder alignment, prioritization, and business models.',
        },
      ],
      recommendation: {
        primaryPathTitle: paths[0]?.title || 'AI & Full Stack Engineer',
        confidenceScore: 88,
        strategicRationale:
          'Given your goal of achieving traction within 12 months, building technical AI prototypes creates immediate proof-of-work. You can monetize freelance services in 4-6 months while retaining the option to transition into Technical PM later.',
        secondaryPathTitle: paths[1]?.title || 'AI Product Manager',
        hedgeStrategy:
          'Treat Product Management as your Stage 2 trajectory once you have shipped 2-3 functional AI web apps.',
      },
      decisionMatrix: [
        {
          criterion: 'Speed to First Real Income',
          weight: 5,
          analysis: {
            [paths[0]?.title || 'AI & Full Stack Engineer']: '3-5 months via niche agency or direct client projects.',
            [paths[1]?.title || 'AI Product Manager']: '8-12 months due to rigorous hiring loops and credential scrutiny.',
          },
        },
        {
          criterion: 'Obsolescence Resistance',
          weight: 4,
          analysis: {
            [paths[0]?.title || 'AI & Full Stack Engineer']: 'Very high if combined with deep problem solving and AI orchestrations.',
            [paths[1]?.title || 'AI Product Manager']: 'Extremely high; human context, user empathy, and business intuition cannot be automated.',
          },
        },
      ],
      next7DayExperiment: {
        title: '7-Day Micro-App Validation Sprint',
        description: 'Build and deploy a 1-page Next.js micro-tool solving an actual workflow bottleneck in your field.',
        validationMetric: 'Ship live URL and get 3 genuine user reactions before spending money on bootcamps.',
        timeCommitmentHours: 8,
      },
    };
    setReport(sample);
    setStep(5);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF5EB] text-[#171717]">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Navigation Breadcrumb back to Home */}
        <div className="mb-6 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs font-bold text-[#666666]">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-[#171717] hover:text-[#526B50] hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => navigate('/explore')}
              className="text-[#666666] hover:text-[#171717] hover:underline"
            >
              Explore
            </button>
            <span>/</span>
            <span className="text-[#526B50] font-black">Career Path Comparison</span>
          </nav>
        </div>

        {/* Header Breadcrumbs & Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 border-[#171717] bg-white shadow-[2px_2px_0px_#171717] mb-4">
            <GitCompare className="w-4 h-4 text-[#526B50]" />
            <span className="text-xs font-black uppercase tracking-wider text-[#171717]">
              FOYC Discovery Studio • Feature 03
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#171717] tracking-tight">
            Career Path <span className="underline decoration-[#FFE76B] decoration-wavy">Comparison</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#444444] font-medium leading-relaxed">
            Torn between two or three career directions? Run an objective, AI-resilient trade-off analysis before committing months of your life.
          </p>

          {/* Stepper Bar */}
          <div className="mt-8 flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto py-2">
            {[
              { num: 1, label: 'Paths' },
              { num: 2, label: 'Priorities' },
              { num: 3, label: 'AI Prompt' },
              { num: 4, label: 'Import' },
              { num: 5, label: 'Report' },
            ].map((s) => (
              <button
                key={s.num}
                onClick={() => {
                  if (s.num <= step || report) setStep(s.num as any);
                }}
                disabled={s.num > step && !report}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-[#171717] text-white shadow-[2px_2px_0px_#526B50]'
                    : s.num < step || report
                    ? 'bg-white text-[#171717] border border-[#171717]'
                    : 'bg-[#EAE6DF] text-[#888888] cursor-not-allowed'
                }`}
              >
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-black/10">
                  {s.num}
                </span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* STAGE 1: SELECT PATHS */}
        {step === 1 && (
          <div className="bg-white rounded-3xl border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-black text-[#171717] mb-2 flex items-center gap-2">
              <span>Step 1: Which careers do you want to compare?</span>
            </h2>
            <p className="text-sm text-[#555555] mb-6">
              Enter 2 to 4 career paths you are currently considering. You can also pick from common presets below.
            </p>

            {/* Presets */}
            <div className="mb-6">
              <span className="text-xs font-black uppercase text-[#666666] tracking-wider block mb-2.5">
                Popular Comparisons:
              </span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_COMPARISON_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(p.p1, p.p2)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl border border-[#D5D0C7] bg-[#FDFBF7] hover:border-[#171717] hover:bg-[#FFE76B]/30 transition-all text-[#171717]"
                  >
                    {p.p1} <span className="text-[#888888]">vs</span> {p.p2}
                  </button>
                ))}
              </div>
            </div>

            {/* Path Inputs */}
            <div className="space-y-4 mb-6">
              {paths.map((p, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border-2 border-[#E8E5DE] bg-[#FAF8F5] flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FFE76B] border border-[#171717] font-black text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      placeholder={`Career Path #${idx + 1} (e.g., Full Stack Engineer, Product Designer)`}
                      value={p.title}
                      onChange={(e) => updatePath(idx, 'title', e.target.value)}
                      className="w-full px-3.5 py-2 text-sm font-bold bg-white border border-[#D5D0C7] rounded-xl focus:border-[#171717] focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Optional notes / what appeals to you about this path"
                      value={p.notes || ''}
                      onChange={(e) => updatePath(idx, 'notes', e.target.value)}
                      className="w-full px-3.5 py-1.5 text-xs text-[#555555] bg-white border border-[#D5D0C7] rounded-xl focus:border-[#171717] focus:outline-none"
                    />
                  </div>
                  {paths.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removePath(idx)}
                      className="p-2 text-[#999999] hover:text-[#D9383A] transition-colors"
                      title="Remove path"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {paths.length < 4 && (
              <button
                type="button"
                onClick={addPath}
                className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#171717]/30 hover:border-[#171717] text-xs font-bold text-[#555555] hover:text-[#171717] transition-all flex items-center justify-center gap-1.5 mb-6"
              >
                <Plus className="w-4 h-4" /> Add Another Path (Up to 4)
              </button>
            )}

            <div className="flex justify-end">
              <Button
                variant="primary"
                size="md"
                disabled={paths.filter((p) => p.title.trim().length > 0).length < 2}
                onClick={() => setStep(2)}
                className="gap-2 font-black bg-[#FFE76B] text-[#171717] border-2 border-[#171717] shadow-[2px_2px_0px_#171717]"
              >
                <span>Continue to Priorities</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STAGE 2: PRIORITIES & CRITERIA */}
        {step === 2 && (
          <div className="bg-white rounded-3xl border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-black text-[#171717] mb-2">
              Step 2: What matters most in your decision?
            </h2>
            <p className="text-sm text-[#555555] mb-6">
              Define your constraints and choose the evaluation dimensions that ChatGPT will use to compare your paths.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-xs font-black uppercase text-[#555555] tracking-wider block mb-1.5">
                  Your Current Background / Skills
                </label>
                <textarea
                  rows={3}
                  value={currentBackground}
                  onChange={(e) => setCurrentBackground(e.target.value)}
                  placeholder="e.g. 2 years in customer support, familiar with basic Python, strong written English..."
                  className="w-full p-3 text-xs font-medium border border-[#D5D0C7] rounded-xl focus:border-[#171717] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-[#555555] tracking-wider block mb-1.5">
                  Primary Ambition / Goal
                </label>
                <textarea
                  rows={3}
                  value={primaryGoal}
                  onChange={(e) => setPrimaryGoal(e.target.value)}
                  placeholder="e.g. Break into remote tech, earn $50k+ within 12 months with sustainable work hours..."
                  className="w-full p-3 text-xs font-medium border border-[#D5D0C7] rounded-xl focus:border-[#171717] focus:outline-none"
                />
              </div>
            </div>

            {/* Evaluation Dimensions */}
            <div className="mb-6">
              <span className="text-xs font-black uppercase text-[#555555] tracking-wider block mb-3">
                Select Comparison Dimensions (Choose at least 3):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {DEFAULT_DIMENSIONS.map((dim) => {
                  const selected = selectedDimensions.includes(dim.id);
                  return (
                    <button
                      key={dim.id}
                      type="button"
                      onClick={() => toggleDimension(dim.id)}
                      className={`text-left p-3.5 rounded-2xl border-2 transition-all ${
                        selected
                          ? 'border-[#171717] bg-[#FFE76B]/20 shadow-[2px_2px_0px_#171717]'
                          : 'border-[#E8E5DE] bg-[#FAF8F5] hover:border-[#CCCCCC]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-[#171717]">{dim.label}</span>
                        {selected ? (
                          <div className="w-4 h-4 rounded-full bg-[#171717] text-white flex items-center justify-center text-[10px]">
                            ✓
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-[#CCCCCC]" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#666666] leading-tight">{dim.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E8E5DE]">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setStep(1)}
                className="gap-2 font-bold border-[#171717]"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button
                variant="primary"
                size="md"
                disabled={selectedDimensions.length < 2}
                onClick={() => setStep(3)}
                className="gap-2 font-black bg-[#FFE76B] text-[#171717] border-2 border-[#171717] shadow-[2px_2px_0px_#171717]"
              >
                <span>Generate Comparison Prompt</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STAGE 3: CHATGPT PROMPT HANDOFF */}
        {step === 3 && (
          <div className="bg-white rounded-3xl border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-black text-[#171717] mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D97706]" />
              <span>Step 3: Run Decision Strategist in ChatGPT</span>
            </h2>
            <p className="text-sm text-[#555555] mb-6">
              Copy this high-density prompt into your ChatGPT account. It guides ChatGPT to conduct an objective trade-off analysis and output a structured JSON report.
            </p>

            <div className="relative mb-6">
              <div className="p-4 bg-[#171717] text-[#EEEEEE] font-mono text-xs rounded-2xl max-h-72 overflow-y-auto leading-relaxed border border-[#333333]">
                <pre className="whitespace-pre-wrap">{generatedPrompt}</pre>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 items-center justify-between">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleCopyPrompt}
                  className="gap-2 font-black bg-[#FFE76B] text-[#171717] border-2 border-[#171717] shadow-[2px_2px_0px_#171717]"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-4 h-4 text-[#526B50]" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy AI Prompt</span>
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => openChatGPTWithPrompt(generatedPrompt)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-[#171717] bg-white hover:bg-[#F4F3EF] text-[#171717] shadow-xs cursor-pointer"
                >
                  <span>Open in ChatGPT (Auto-pasted)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF9EA] border border-[#F3DE9C] mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
              <div className="text-xs text-[#854D0E] space-y-1">
                <p className="font-bold">How to bring your results back to FOYC:</p>
                <p>
                  1. Paste the prompt into ChatGPT and let it generate your comparison.
                </p>
                <p>
                  2. At the end, copy the complete <code className="bg-white px-1 py-0.5 rounded font-mono font-bold">```json ... ```</code> block and paste it in Step 4.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E8E5DE]">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setStep(2)}
                className="gap-2 font-bold border-[#171717]"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep(4)}
                className="gap-2 font-black bg-[#171717] text-white"
              >
                <span>Paste ChatGPT Handoff</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STAGE 4: PASTE HANDOFF & VALIDATION */}
        {step === 4 && (
          <div className="bg-white rounded-3xl border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-black text-[#171717] mb-2">
              Step 4: Paste Your Comparison Handoff
            </h2>
            <p className="text-sm text-[#555555] mb-4">
              Paste the structured JSON block returned by ChatGPT below. Our system validates the schema and renders your interactive comparison matrix.
            </p>

            <div className="mb-4">
              <textarea
                rows={9}
                value={handoffInput}
                onChange={(e) => {
                  setHandoffInput(e.target.value);
                  setParseError(null);
                }}
                placeholder='Paste the ```json ... ``` block from ChatGPT here...'
                className="w-full p-4 font-mono text-xs border-2 border-[#171717] rounded-2xl bg-[#FAF8F5] focus:bg-white focus:outline-none"
              />
            </div>

            {parseError && (
              <div className="p-3.5 mb-4 rounded-xl bg-[#FEE2E2] border border-[#F87171] text-xs text-[#991B1B] font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{parseError}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E8E5DE]">
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setStep(3)}
                  className="gap-1 font-bold border-[#171717]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </Button>
                <button
                  type="button"
                  onClick={loadSampleReport}
                  className="text-xs font-bold text-[#526B50] hover:underline"
                >
                  Preview with Sample Comparison
                </button>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleValidateHandoff}
                className="gap-2 font-black bg-[#FFE76B] text-[#171717] border-2 border-[#171717] shadow-[2px_2px_0px_#171717]"
              >
                <span>Render Comparison Report</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STAGE 5: COMPLETE COMPARISON REPORT */}
        {step === 5 && report && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Action Bar */}
            <div className="bg-white rounded-2xl border-2 border-[#171717] p-4 flex flex-wrap items-center justify-between gap-3 shadow-[3px_3px_0px_#171717]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#526B50] bg-[#EDF2E9] px-2.5 py-1 rounded-full border border-[#A8B99A]">
                  Report Active
                </span>
                <span className="text-xs text-[#666666] font-medium">
                  {report.comparedPaths.length} Career Tracks Evaluated
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={exportingPdf}
                  onClick={async () => {
                    setExportingPdf(true);
                    await generateComparisonPdf(report);
                    setExportingPdf(false);
                  }}
                  className="gap-1.5 text-xs font-bold border-[#171717]"
                >
                  <Download className="w-3.5 h-3.5 text-[#526B50]" />
                  <span>PDF Report</span>
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  disabled={exportingDocx}
                  onClick={async () => {
                    setExportingDocx(true);
                    await generateComparisonDocx(report);
                    setExportingDocx(false);
                  }}
                  className="gap-1.5 text-xs font-bold border-[#171717]"
                >
                  <FileText className="w-3.5 h-3.5 text-[#171717]" />
                  <span>DOCX Report</span>
                </Button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-[#666666] hover:text-[#171717] ml-2"
                >
                  New Comparison
                </button>
              </div>
            </div>

            {/* Winning Recommendation Hero Card */}
            <div className="bg-[#FEFAF7] rounded-3xl border-3 border-[#171717] p-6 sm:p-8 shadow-[5px_5px_0px_#171717]">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#E8E5DE]">
                <div>
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#526B50] mb-1">
                    <Award className="w-4 h-4 text-[#D97706]" />
                    <span>Strategist Recommendation</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#171717]">
                    Primary Path: {report.recommendation.primaryPathTitle}
                  </h2>
                </div>

                <div className="bg-[#FFE76B] border-2 border-[#171717] px-4 py-2 rounded-2xl shadow-[2px_2px_0px_#171717] text-center">
                  <span className="text-[10px] uppercase font-black text-[#171717] block">Match Confidence</span>
                  <span className="text-2xl font-black text-[#171717]">
                    {report.recommendation.confidenceScore}%
                  </span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#333333] font-medium leading-relaxed mb-6">
                {report.recommendation.strategicRationale}
              </p>

              {report.recommendation.secondaryPathTitle && (
                <div className="p-4 rounded-2xl bg-white border border-[#E8E5DE] text-xs space-y-1">
                  <span className="font-bold text-[#171717]">
                    Secondary Hedge Option: {report.recommendation.secondaryPathTitle}
                  </span>
                  <p className="text-[#666666]">{report.recommendation.hedgeStrategy}</p>
                </div>
              )}
            </div>

            {/* Executive Takeaway */}
            <div className="bg-white rounded-3xl border-2 border-[#171717] p-6 sm:p-8 shadow-[4px_4px_0px_#171717]">
              <h3 className="text-lg font-black text-[#171717] mb-2 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#526B50]" />
                <span>Executive Decision Summary</span>
              </h3>
              <p className="text-sm text-[#444444] font-medium leading-relaxed">
                {report.executiveSummary}
              </p>
            </div>

            {/* Side-by-Side Path Cards */}
            <div>
              <h3 className="text-xl font-black text-[#171717] mb-4">
                Detailed Trajectory Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.comparedPaths.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="bg-white rounded-3xl border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-black uppercase text-[#526B50] bg-[#EDF2E9] px-2.5 py-0.5 rounded-full border border-[#A8B99A]">
                          {p.category}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-[#666666]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{p.timeHorizon}</span>
                        </div>
                      </div>

                      <h4 className="text-xl font-black text-[#171717] mb-2">{p.title}</h4>
                      <p className="text-xs text-[#555555] leading-relaxed mb-4">{p.summary}</p>

                      {/* Dimension Scores */}
                      <div className="space-y-2 mb-4 p-3 bg-[#FAF8F5] rounded-2xl border border-[#E8E5DE]">
                        <span className="text-[10px] font-black uppercase text-[#666666] tracking-wider block">
                          Dimension Ratings (1-10):
                        </span>
                        {Object.entries(p.scores || {}).map(([dimKey, rawScore]) => {
                          const score = Number(rawScore) || 5;
                          return (
                          <div key={dimKey} className="flex items-center justify-between text-xs">
                            <span className="capitalize text-[#444444] font-medium">
                              {dimKey.replace(/_/g, ' ')}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-[#171717] h-full"
                                  style={{ width: `${Math.min(100, (score / 10) * 100)}%` }}
                                />
                              </div>
                              <span className="font-mono font-bold text-[11px] w-4 text-right">
                                {score}
                              </span>
                            </div>
                          </div>
                          );
                        })}
                      </div>

                      {/* Pros & Cons */}
                      <div className="space-y-3 text-xs mb-4">
                        <div>
                          <span className="font-bold text-[#2E7D32] block mb-1">Key Advantages:</span>
                          <ul className="space-y-1 text-[#444444]">
                            {p.pros.map((pro, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-1.5">
                                <span className="text-[#2E7D32] font-black">•</span>
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <span className="font-bold text-[#C62828] block mb-1">Risks & Friction:</span>
                          <ul className="space-y-1 text-[#444444]">
                            {p.cons.map((con, cIdx) => (
                              <li key={cIdx} className="flex items-start gap-1.5">
                                <span className="text-[#C62828] font-black">•</span>
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#E8E5DE] flex items-center justify-between text-xs">
                      <span className="text-[#777777]">
                        Break-even: <strong className="text-[#171717]">{p.breakEvenMonths} mos</strong>
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleBuildDirectDashboard(p.title)}
                        className="text-xs font-bold gap-1 border-[#171717] hover:bg-[#FFE76B]"
                      >
                        <span>Build Dashboard</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next 7-Day Experiment */}
            {report.next7DayExperiment && (
              <div className="bg-[#FFF8EE] rounded-3xl border-2 border-[#EA580C] p-6 sm:p-8 shadow-[4px_4px_0px_#EA580C]">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#EA580C] mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Validation Protocol</span>
                </div>
                <h3 className="text-xl font-black text-[#171717] mb-2">
                  7-Day Low-Risk Experiment: {report.next7DayExperiment.title}
                </h3>
                <p className="text-sm text-[#444444] mb-4">
                  {report.next7DayExperiment.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-[#171717]">
                  <span className="bg-white px-3 py-1.5 rounded-xl border border-[#EA580C]/40">
                    Target Metric: {report.next7DayExperiment.validationMetric}
                  </span>
                  <span className="bg-white px-3 py-1.5 rounded-xl border border-[#EA580C]/40">
                    Time Investment: {report.next7DayExperiment.timeCommitmentHours} Hours
                  </span>
                </div>
              </div>
            )}

            {/* Bottom Final CTA */}
            <div className="bg-[#171717] rounded-3xl p-6 sm:p-8 text-center text-white space-y-4">
              <h3 className="text-2xl font-black">
                Ready to commit to your chosen career path?
              </h3>
              <p className="text-sm text-gray-300 max-w-xl mx-auto">
                Turn your chosen direction into a structured 12-month roadmap, milestone checklist, and daily habit routine.
              </p>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => handleBuildDirectDashboard(report.recommendation.primaryPathTitle)}
                  className="font-black bg-[#FFE76B] text-[#171717] border-2 border-white shadow-[3px_3px_0px_#FFFFFF] hover:bg-[#FADB3D]"
                >
                  <span>Build My Career Dashboard Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
export default CareerComparisonPage;
