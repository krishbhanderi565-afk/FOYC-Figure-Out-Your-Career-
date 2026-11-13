import React, { useState, useEffect, useRef } from 'react';
import {
  PossibilityHandoff,
  PossibilityItem,
  PossibilityExperiment,
  PossibilityActionStep,
  POSSIBILITY_CATEGORIES,
} from '../../types/possibility';
import { generatePossibilityPdf, generatePossibilityDocx } from '../../utils/possibilityDocExport';
import {
  Download,
  FileText,
  LayoutDashboard,
  CheckCircle2,
  Bookmark,
  Star,
  Check,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Layers,
  ArrowRight,
  Filter,
  Columns,
  Cpu,
  Compass,
  Lightbulb,
  Clock,
  Sparkles,
  ExternalLink,
  Info,
} from 'lucide-react';
import Chart from 'chart.js/auto';

interface StageReportProps {
  report: PossibilityHandoff;
  onTransferToDashboard: (selected: {
    selected_possibility: PossibilityItem;
    secondary_possibility?: PossibilityItem;
    target_timeline_months: number;
    user_notes?: string;
  }) => void;
  onRestart: () => void;
  onUpdateReport?: (updated: PossibilityHandoff) => void;
}

export const StageReport: React.FC<StageReportProps> = ({
  report,
  onTransferToDashboard,
  onRestart,
  onUpdateReport,
}) => {
  const [possibilities, setPossibilities] = useState<PossibilityItem[]>(report.possibilities || []);
  const [experiments, setExperiments] = useState<PossibilityExperiment[]>(report.recommended_experiments || []);
  const [nextSteps, setNextSteps] = useState<PossibilityActionStep[]>(report.next_steps || []);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);

  // Vision Dashboard Modal / Selection
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [primaryChoiceId, setPrimaryChoiceId] = useState<string>(
    report.possibilities?.[0]?.id || ''
  );
  const [secondaryChoiceId, setSecondaryChoiceId] = useState<string>('');
  const [targetHorizon, setTargetHorizon] = useState<number>(6);
  const [transferNotes, setTransferNotes] = useState<string>('');

  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Sync state changes with parent
  const syncReportUpdates = (
    updatedPossibilities: PossibilityItem[],
    updatedExperiments: PossibilityExperiment[],
    updatedSteps: PossibilityActionStep[]
  ) => {
    if (onUpdateReport) {
      const shortlistedNames = updatedPossibilities
        .filter((p) => p.is_shortlisted)
        .map((p) => p.name);

      onUpdateReport({
        ...report,
        possibilities: updatedPossibilities,
        shortlisted_options: shortlistedNames,
        recommended_experiments: updatedExperiments,
        next_steps: updatedSteps,
      });
    }
  };

  // Toggle shortlist on possibility
  const toggleShortlist = (id: string) => {
    const next = possibilities.map((p) =>
      p.id === id ? { ...p, is_shortlisted: !p.is_shortlisted } : p
    );
    setPossibilities(next);
    syncReportUpdates(next, experiments, nextSteps);
  };

  // Change possibility status
  const updatePossibilityStatus = (id: string, status: 'interested' | 'not_sure' | 'save_later') => {
    const next = possibilities.map((p) =>
      p.id === id ? { ...p, status } : p
    );
    setPossibilities(next);
    syncReportUpdates(next, experiments, nextSteps);
  };

  // Update possibility notes
  const updatePossibilityNotes = (id: string, user_notes: string) => {
    const next = possibilities.map((p) =>
      p.id === id ? { ...p, user_notes } : p
    );
    setPossibilities(next);
    syncReportUpdates(next, experiments, nextSteps);
  };

  // Toggle comparison selection
  const toggleComparison = (id: string) => {
    if (comparedIds.includes(id)) {
      setComparedIds(comparedIds.filter((item) => item !== id));
    } else {
      if (comparedIds.length >= 3) {
        alert('You can compare up to 3 possibilities simultaneously.');
        return;
      }
      setComparedIds([...comparedIds, id]);
    }
  };

  // Toggle experiment completion
  const toggleExperiment = (id: string) => {
    const next = experiments.map((exp) =>
      exp.id === id ? { ...exp, is_completed: !exp.is_completed } : exp
    );
    setExperiments(next);
    syncReportUpdates(possibilities, next, nextSteps);
  };

  // Toggle next step completion
  const toggleNextStep = (id: string) => {
    const next = nextSteps.map((step) =>
      step.id === id ? { ...step, completed: !step.completed } : step
    );
    setNextSteps(next);
    syncReportUpdates(possibilities, experiments, next);
  };

  // Render Chart.js for Discovered Possibility Landscape
  useEffect(() => {
    if (!chartCanvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Tally possibilities per category
    const categoryCounts: Record<string, number> = {};
    possibilities.forEach((pos) => {
      const cat = pos.category || 'Other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const labels = Object.keys(categoryCounts);
    const data = Object.values(categoryCounts);

    const ctx = chartCanvasRef.current.getContext('2d');
    if (ctx) {
      chartInstanceRef.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: ['#526B50', '#FFE76B', '#D97706', '#2563EB', '#7C3AED', '#DB2777', '#059669'],
              borderColor: '#171717',
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 10,
                font: { size: 10, family: 'Inter, sans-serif', weight: 'bold' },
                color: '#171717',
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => ` ${context.label}: ${context.raw} identified`,
              },
            },
          },
          cutout: '60%',
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [possibilities]);

  // Download handlers
  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      await generatePossibilityPdf({
        ...report,
        possibilities,
        recommended_experiments: experiments,
        next_steps: nextSteps,
      });
    } catch (e) {
      console.error('PDF generation error', e);
      alert('Could not export PDF. Please try again.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    setDownloadingDocx(true);
    try {
      await generatePossibilityDocx({
        ...report,
        possibilities,
        recommended_experiments: experiments,
        next_steps: nextSteps,
      });
    } catch (e) {
      console.error('DOCX generation error', e);
      alert('Could not export Word DOCX. Please try again.');
    } finally {
      setDownloadingDocx(false);
    }
  };

  // Launch Dashboard Transfer
  const handleConfirmDashboardTransfer = () => {
    const primary = possibilities.find((p) => p.id === primaryChoiceId) || possibilities[0];
    const secondary = possibilities.find((p) => p.id === secondaryChoiceId);

    onTransferToDashboard({
      selected_possibility: primary,
      secondary_possibility: secondary,
      target_timeline_months: targetHorizon,
      user_notes: transferNotes,
    });
  };

  // Filtered possibilities
  const filteredPossibilities = possibilities.filter(
    (p) => selectedCategory === 'All' || p.category.toLowerCase().includes(selectedCategory.toLowerCase())
  );

  const shortlistedList = possibilities.filter((p) => p.is_shortlisted);
  const comparedPossibilities = possibilities.filter((p) => comparedIds.includes(p.id));

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner / Actions */}
      <div className="bg-[#FFE76B] border-2 border-[#171717] rounded-2xl p-6 shadow-[4px_4px_0px_#171717] mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 bg-[#171717] text-white rounded-full mb-2">
              Official Possibility Report
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#171717] tracking-tight">
              {report.profile?.user_name ? `${report.profile.user_name}'s Possibility Report` : 'My Possibility Report'}
            </h1>
            <p className="text-xs md:text-sm font-semibold text-[#171717]/80 mt-1">
              "A broader view of what you could pursue." • {possibilities.length} Possibilities Explored • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Primary Vision CTA */}
          <button
            type="button"
            onClick={() => setShowDashboardModal(true)}
            className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-[#526B50] text-white font-extrabold text-sm border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-center justify-center gap-2 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#171717] transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Turn Into My Live Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Action Bar (PDF, DOCX, Restart) */}
        <div className="mt-4 pt-4 border-t border-[#171717]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="px-4 py-2 rounded-xl bg-white text-[#171717] font-bold border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center gap-2 hover:bg-gray-50 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadingPdf ? 'Exporting PDF...' : 'Download PDF'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadDocx}
              disabled={downloadingDocx}
              className="px-4 py-2 rounded-xl bg-white text-[#171717] font-bold border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center gap-2 hover:bg-gray-50 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{downloadingDocx ? 'Exporting Word DOCX...' : 'Download Editable DOCX'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onRestart}
            className="text-xs font-semibold text-[#171717]/70 hover:text-[#171717] flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start Fresh Exploration</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: EXECUTIVE SUMMARY & SECTION 3: LANDSCAPE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Executive Summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl border-2 border-[#171717] p-6 shadow-[3px_3px_0px_#171717] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-8 h-8 rounded-lg bg-[#526B50] text-white flex items-center justify-center font-bold text-xs">
                01
              </span>
              <h2 className="text-lg font-bold text-[#171717]">Executive Summary & Horizon Overview</h2>
            </div>
            <p className="text-sm md:text-base text-[#222] leading-relaxed">
              {report.exploration_summary?.summary || 'Diversified range of career and entrepreneurial opportunities explored.'}
            </p>

            {report.exploration_summary?.high_level_insight && (
              <div className="mt-4 p-3.5 rounded-xl bg-[#FDF5EB] border border-[#171717]/20 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-[#171717] leading-snug">
                  Key Insight: {report.exploration_summary.high_level_insight}
                </p>
              </div>
            )}
          </div>

          {/* Key Discoveries List */}
          {report.exploration_summary?.key_discoveries?.length > 0 && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <span className="text-[11px] font-bold text-[#666] uppercase tracking-wider block mb-2">
                Strategic Discoveries:
              </span>
              <ul className="space-y-1.5 text-xs text-[#333]">
                {report.exploration_summary.key_discoveries.map((disc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#526B50] font-bold">•</span>
                    <span>{disc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Possibility Landscape Chart */}
        <div className="bg-white rounded-2xl border-2 border-[#171717] p-6 shadow-[3px_3px_0px_#171717] flex flex-col items-center justify-between">
          <div className="w-full">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-8 h-8 rounded-lg bg-[#FFE76B] text-[#171717] border border-[#171717] flex items-center justify-center font-bold text-xs">
                03
              </span>
              <h2 className="text-lg font-bold text-[#171717]">Possibility Landscape</h2>
            </div>
            <p className="text-[11px] text-[#666] mb-3">Actual distribution of explored opportunities</p>
          </div>

          <div className="w-full h-44 relative my-auto">
            <canvas ref={chartCanvasRef} />
          </div>

          <div className="w-full pt-3 border-t border-[#171717]/10 text-center">
            <span className="text-[11px] font-bold text-[#526B50]">
              ✓ {possibilities.length} verified possibilities mapped
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: UNDERSTANDING YOU */}
      <div className="bg-[#FDF5EB] rounded-2xl border-2 border-[#171717] p-6 shadow-[3px_3px_0px_#171717] mb-8">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="w-8 h-8 rounded-lg bg-[#171717] text-white flex items-center justify-center font-bold text-xs">
            02
          </span>
          <div>
            <h2 className="text-xl font-bold text-[#171717]">Personal Baseline & Grounding</h2>
            <p className="text-xs text-[#666]">The real foundation behind all recommendations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border border-[#171717]/15 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#666] block">Education & Roles</span>
            <p className="text-xs font-bold text-[#171717]">{report.profile?.education || 'Self-directed pathway'}</p>
            <p className="text-xs text-[#444]">{report.profile?.experience || 'Active career transition'}</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#171717]/15 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#666] block">Natural Curiosities</span>
            <p className="text-xs text-[#333]">{(report.profile?.interests || []).join(', ') || 'Interdisciplinary'}</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#171717]/15 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#666] block">Real Constraints</span>
            <p className="text-xs font-bold text-[#171717]">
              {report.profile?.practical_boundaries?.learning_hours_per_week || '5–15 hrs/wk'} • {report.profile?.practical_boundaries?.budget || 'Free/Low'}
            </p>
            <p className="text-xs text-[#555]">{report.profile?.practical_boundaries?.location_preference || 'Remote/Flexible'}</p>
          </div>
        </div>
      </div>

      {/* SECTION 4: EXPLORE YOUR POSSIBILITIES (Main Cards) */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#526B50] text-white flex items-center justify-center font-bold text-xs">
              04
            </span>
            <div>
              <h2 className="text-xl font-bold text-[#171717]">Explore Your Possibilities</h2>
              <p className="text-xs text-[#666]">Interactive candidate opportunities tailored for you</p>
            </div>
          </div>

          {/* Comparison Bar Pill */}
          {comparedIds.length > 0 && (
            <div className="flex items-center gap-2 bg-[#FFE76B] px-3.5 py-1.5 rounded-full border border-[#171717] text-xs font-bold">
              <span>{comparedIds.length} Selected for Comparison</span>
              <a href="#comparison-section" className="underline hover:text-[#526B50]">
                View Comparison ↓
              </a>
            </div>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none">
          {['All', 'Hybrid', 'Emerging', 'Entrepreneurship', 'Traditional', 'Freelance', 'Creative', 'Education'].map(
            (cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#171717] text-white border-[#171717] shadow-[2px_2px_0px_#526B50]'
                    : 'bg-white text-[#444] border-[#171717]/20 hover:border-[#171717]'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* Possibility Cards Grid */}
        <div className="space-y-5">
          {filteredPossibilities.map((pos) => {
            const isShortlisted = pos.is_shortlisted;
            const isCompared = comparedIds.includes(pos.id);

            return (
              <div
                key={pos.id}
                className={`rounded-2xl border-2 p-6 transition-all ${
                  isShortlisted
                    ? 'bg-white border-[#526B50] shadow-[4px_4px_0px_#526B50]'
                    : 'bg-white border-[#171717]/25 shadow-[3px_3px_0px_#171717]'
                }`}
              >
                {/* Top Control Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#171717] text-white">
                      {pos.category}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        pos.fit_level === 'Potentially Strong Fit'
                          ? 'bg-[#526B50]/15 text-[#526B50]'
                          : pos.fit_level === 'Worth Exploring'
                          ? 'bg-[#FFE76B] text-[#171717]'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {pos.fit_level}
                    </span>
                  </div>

                  {/* Interactive Status & Shortlist Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => toggleComparison(pos.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                        isCompared
                          ? 'bg-[#171717] text-white border-[#171717]'
                          : 'bg-white text-[#555] border-[#171717]/20 hover:border-[#171717]'
                      }`}
                    >
                      <Columns className="w-3.5 h-3.5" />
                      <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleShortlist(pos.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                        isShortlisted
                          ? 'bg-[#FFE76B] text-[#171717] border-[#171717] shadow-[2px_2px_0px_#171717]'
                          : 'bg-white text-[#555] border-[#171717]/20 hover:border-[#171717]'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-[#171717]' : ''}`} />
                      <span>{isShortlisted ? 'Shortlisted ★' : 'Shortlist'}</span>
                    </button>
                  </div>
                </div>

                {/* Main Content */}
                <div className="pt-4">
                  <h3 className="text-xl font-extrabold text-[#171717] mb-2">{pos.name}</h3>
                  <p className="text-sm text-[#333] leading-relaxed mb-4">{pos.description}</p>

                  <div className="p-3.5 rounded-xl bg-[#FDF5EB]/50 border border-[#171717]/15 mb-4">
                    <span className="text-[11px] font-bold text-[#526B50] uppercase tracking-wider block mb-1">
                      Why This Might Fit You:
                    </span>
                    <p className="text-xs text-[#222] leading-relaxed">{pos.why_it_matches}</p>
                  </div>

                  {/* Required Skills & Prep */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs">
                    <div>
                      <span className="font-bold text-[#171717] uppercase tracking-wider block mb-1">
                        Required Capabilities:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {pos.required_skills?.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-gray-100 text-[#222] font-semibold border border-gray-200"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p>
                        <strong className="text-[#171717]">Entry Requirements:</strong>{' '}
                        <span className="text-[#555]">{pos.entry_requirements}</span>
                      </p>
                      <p>
                        <strong className="text-[#171717]">Prep Time:</strong>{' '}
                        <span className="text-[#555]">{pos.estimated_preparation_time}</span>
                      </p>
                      <p>
                        <strong className="text-[#171717]">Estimated Cost:</strong>{' '}
                        <span className="text-[#555]">{pos.estimated_cost}</span>
                      </p>
                    </div>
                  </div>

                  {/* Opportunities & Challenges */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-100 text-xs">
                    <div>
                      <span className="font-bold text-[#526B50] uppercase tracking-wider block mb-1">
                        Opportunities / Upside:
                      </span>
                      <ul className="space-y-1 text-[#333]">
                        {pos.opportunities?.map((opp, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#526B50] font-bold">+</span>
                            <span>{opp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="font-bold text-red-700 uppercase tracking-wider block mb-1">
                        Friction & Challenges:
                      </span>
                      <ul className="space-y-1 text-[#555]">
                        {pos.challenges?.map((ch, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-red-600 font-bold">-</span>
                            <span>{ch}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* AI Nuance */}
                  {pos.ai_impact && (
                    <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-[#555] flex items-start gap-2">
                      <Cpu className="w-4 h-4 text-[#526B50] shrink-0 mt-0.5" />
                      <p>
                        <strong>AI Impact Nuance:</strong> {pos.ai_impact}
                      </p>
                    </div>
                  )}

                  {/* Personal Notes Editor */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#666] font-semibold">Your status:</span>
                      <select
                        value={pos.status || 'interested'}
                        onChange={(e) => updatePossibilityStatus(pos.id, e.target.value as any)}
                        className="px-2.5 py-1 rounded-lg border border-[#171717]/20 bg-white font-bold text-xs"
                      >
                        <option value="interested">Interested</option>
                        <option value="not_sure">Not Sure</option>
                        <option value="save_later">Save for Later</option>
                      </select>
                    </div>

                    <input
                      type="text"
                      placeholder="Add personal note (e.g. want to talk to cousin in this field)..."
                      value={pos.user_notes || ''}
                      onChange={(e) => updatePossibilityNotes(pos.id, e.target.value)}
                      className="flex-1 max-w-md px-3 py-1 rounded-lg border border-[#171717]/20 bg-[#FAF8F5] text-xs"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 5: OPPORTUNITY COMPARISON (If items selected) */}
      <div id="comparison-section" className="bg-white rounded-2xl border-2 border-[#171717] p-6 shadow-[3px_3px_0px_#171717] mb-8">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="w-8 h-8 rounded-lg bg-[#FFE76B] text-[#171717] border border-[#171717] flex items-center justify-center font-bold text-xs">
            05
          </span>
          <div>
            <h2 className="text-xl font-bold text-[#171717]">Opportunity Comparison Matrix</h2>
            <p className="text-xs text-[#666]">
              {comparedPossibilities.length > 0
                ? 'Side-by-side comparison of selected candidate paths'
                : 'Click "Compare" on any possibility cards above to see them side-by-side'}
            </p>
          </div>
        </div>

        {comparedPossibilities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#171717]">
                  <th className="p-3 font-bold text-[#171717] bg-[#FDF5EB] w-1/4">Dimension</th>
                  {comparedPossibilities.map((p) => (
                    <th key={p.id} className="p-3 font-bold text-[#171717] bg-[#FAF8F5]">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="p-3 font-bold text-[#666]">Category & Fit</td>
                  {comparedPossibilities.map((p) => (
                    <td key={p.id} className="p-3">
                      <span className="font-bold text-[#171717]">{p.category}</span>
                      <span className="block text-[11px] text-[#526B50]">{p.fit_level}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#666]">Prep Time & Cost</td>
                  {comparedPossibilities.map((p) => (
                    <td key={p.id} className="p-3 text-[#333]">
                      {p.estimated_preparation_time} • {p.estimated_cost}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#666]">Required Skills</td>
                  {comparedPossibilities.map((p) => (
                    <td key={p.id} className="p-3 text-[#333]">
                      {(p.required_skills || []).join(', ')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#666]">Main Trade-off</td>
                  {comparedPossibilities.map((p) => (
                    <td key={p.id} className="p-3 text-red-700">
                      {p.challenges?.[0] || 'Requires focused consistency'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center bg-[#FAF8F5] rounded-xl border border-dashed border-[#171717]/20 text-xs text-[#777]">
            Select "Compare" on 2 or 3 cards above to analyze their trade-offs side by side.
          </div>
        )}
      </div>

      {/* SECTION 9: TRY BEFORE YOU COMMIT (Practical Experiments) */}
      <div className="bg-white rounded-2xl border-2 border-[#171717] p-6 shadow-[3px_3px_0px_#171717] mb-8">
        <div className="flex items-center gap-2.5 mb-5">
          <span className="w-8 h-8 rounded-lg bg-[#526B50] text-white flex items-center justify-center font-bold text-xs">
            09
          </span>
          <div>
            <h2 className="text-xl font-bold text-[#171717]">Try Before You Commit (Micro-Experiments)</h2>
            <p className="text-xs text-[#666]">
              Low-risk practical tests to validate your curiosity before investing months
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {experiments.map((exp) => (
            <div
              key={exp.id}
              onClick={() => toggleExperiment(exp.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                exp.is_completed
                  ? 'bg-[#526B50]/10 border-[#526B50] line-through text-[#666]'
                  : 'bg-white border-[#171717]/20 hover:border-[#171717]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center mt-0.5 ${
                  exp.is_completed ? 'bg-[#526B50] border-[#526B50] text-white' : 'border-gray-400'
                }`}
              >
                {exp.is_completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#FDF5EB] text-[#171717] border border-[#171717]/20">
                    {exp.type}
                  </span>
                  <span className="text-xs font-bold text-[#526B50]">{exp.possibility_name}</span>
                  <span className="text-[11px] text-[#777]">({exp.estimated_time})</span>
                </div>
                <h4 className="text-sm font-bold text-[#171717]">{exp.title}</h4>
                <p className="text-xs text-[#555] mt-0.5">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 10: ACTION CHECKLIST & NEXT STEPS */}
      <div className="bg-white rounded-2xl border-2 border-[#171717] p-6 shadow-[3px_3px_0px_#171717] mb-8">
        <div className="flex items-center gap-2.5 mb-5">
          <span className="w-8 h-8 rounded-lg bg-[#171717] text-white flex items-center justify-center font-bold text-xs">
            10
          </span>
          <div>
            <h2 className="text-xl font-bold text-[#171717]">Your Next Steps & Decision Timeline</h2>
            <p className="text-xs text-[#666]">Tangible execution checkpoints</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {nextSteps.map((step) => (
            <div
              key={step.id}
              onClick={() => toggleNextStep(step.id)}
              className={`p-3.5 rounded-xl border-2 transition-all flex items-start gap-3 cursor-pointer ${
                step.completed
                  ? 'bg-[#526B50]/10 border-[#526B50] line-through text-gray-500'
                  : 'bg-white border-[#171717]/20 hover:border-[#171717]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center mt-0.5 ${
                  step.completed ? 'bg-[#526B50] border-[#526B50] text-white' : 'border-gray-400'
                }`}
              >
                {step.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#526B50] block">
                  {step.timeframe}
                </span>
                <p className={`text-xs md:text-sm font-semibold ${step.completed ? 'text-gray-500' : 'text-[#171717]'}`}>
                  {step.task}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRIMARY CONVERSION BANNER (Feature 12 Integration) */}
      <div className="bg-[#171717] rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[4px_4px_0px_#FFE76B]">
        <div>
          <span className="inline-block text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#FFE76B] text-[#171717] mb-2">
            Next Level: Career Command OS
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            I've Explored My Possibilities. Now Build My Vision.
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mt-1 leading-relaxed">
            You've discovered different directions. Now let's turn the possibilities that matter most to you into a living, milestone-driven FOYC dashboard.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowDashboardModal(true)}
          className="w-full md:w-auto px-7 py-3.5 rounded-xl bg-[#FFE76B] text-[#171717] font-extrabold text-sm border-2 border-[#FFE76B] flex items-center justify-center gap-2 hover:bg-[#ffe040] transition-colors shrink-0"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Build My Dashboard Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* MODAL: BUILD MY DASHBOARD NOW */}
      {showDashboardModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-[#171717] shadow-[6px_6px_0px_#171717] max-w-xl w-full p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[#526B50] text-white">
                Dashboard Generator Bridge
              </span>
              <h3 className="text-2xl font-black text-[#171717] mt-1">
                Select Your Target Direction
              </h3>
              <p className="text-xs text-[#666]">
                FOYC will transform your chosen possibility into your active personalized career dashboard, tasks, milestones, and habit tracker.
              </p>
            </div>

            {/* Primary Direction Selector */}
            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
                Primary Career Direction (Required)
              </label>
              <select
                value={primaryChoiceId}
                onChange={(e) => setPrimaryChoiceId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#171717]/30 bg-white text-xs md:text-sm font-bold text-[#171717] focus:ring-2 focus:ring-[#526B50]"
              >
                {possibilities.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Secondary Direction Selector (Optional) */}
            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
                Secondary Direction / Hybrid Complement (Optional)
              </label>
              <select
                value={secondaryChoiceId}
                onChange={(e) => setSecondaryChoiceId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#171717]/30 bg-white text-xs md:text-sm text-[#171717] focus:ring-2 focus:ring-[#526B50]"
              >
                <option value="">None (Focus purely on primary)</option>
                {possibilities
                  .filter((p) => p.id !== primaryChoiceId)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category})
                    </option>
                  ))}
              </select>
            </div>

            {/* Target Time Horizon */}
            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
                Target Execution Horizon
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { months: 3, label: '3 Months (Sprint)' },
                  { months: 6, label: '6 Months (Standard)' },
                  { months: 12, label: '12 Months (Pacing)' },
                ].map((hz) => (
                  <button
                    key={hz.months}
                    type="button"
                    onClick={() => setTargetHorizon(hz.months)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      targetHorizon === hz.months
                        ? 'bg-[#171717] text-white border-[#171717]'
                        : 'bg-white text-[#555] border-[#171717]/20 hover:border-[#171717]'
                    }`}
                  >
                    {hz.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDashboardModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#666] hover:text-[#171717]"
              >
                Cancel / Keep Exploring
              </button>

              <button
                type="button"
                onClick={handleConfirmDashboardTransfer}
                className="px-6 py-2.5 rounded-xl bg-[#526B50] text-white font-extrabold text-xs md:text-sm border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center gap-2 hover:bg-[#3f533d]"
              >
                <span>Launch My Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
