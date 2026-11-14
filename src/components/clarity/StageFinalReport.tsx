import React, { useState, useEffect, useRef } from 'react';
import { ClarityFinalReport, ClarityHandoff } from '../../types/clarity';
import { generateClarityPdf, generateClarityDocx } from '../../utils/clarityDocExport';
import { 
  Download, 
  FileText, 
  LayoutDashboard, 
  CheckCircle2, 
  Target, 
  Calendar, 
  TrendingUp, 
  Compass, 
  Sparkles, 
  RotateCcw, 
  Check, 
  ShieldCheck, 
  AlertTriangle,
  Layers,
  ArrowRight
} from 'lucide-react';
import Chart from 'chart.js/auto';

interface StageFinalReportProps {
  report: ClarityFinalReport;
  onTransferToDashboard: () => void;
  onRestart: () => void;
  onUpdateChecklist?: (updatedChecklist: any[]) => void;
}

export const StageFinalReport: React.FC<StageFinalReportProps> = ({
  report,
  onTransferToDashboard,
  onRestart,
  onUpdateChecklist,
}) => {
  const [checklist, setChecklist] = useState(report.living_action_checklist || []);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Toggle checklist item
  const toggleChecklistItem = (id: string) => {
    const next = checklist.map((item: any) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(next);
    if (onUpdateChecklist) {
      onUpdateChecklist(next);
    }
  };

  // Render Chart.js for Trajectory Fit / Uncertainty Resolution
  useEffect(() => {
    if (!chartCanvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const trajectories = report.trajectories_evaluated || [];
    const labels = trajectories.length > 0
      ? trajectories.map((t: any) => t.title.length > 20 ? t.title.slice(0, 18) + '...' : t.title)
      : ['Selected Direction', 'Alternative 1', 'Alternative 2'];
    const data = trajectories.length > 0
      ? trajectories.map((t: any) => t.fit_score)
      : [88, 65, 52];

    const ctx = chartCanvasRef.current.getContext('2d');
    if (ctx) {
      chartInstanceRef.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: ['#526B50', '#FFE76B', '#D97706', '#9CA3AF'],
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
                boxWidth: 12,
                font: { size: 11, family: 'Inter, sans-serif', weight: 'bold' },
                color: '#171717',
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => ` Fit Score: ${context.raw}%`,
              },
            },
          },
          cutout: '62%',
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [report]);

  const adaptToHandoff = (rep: ClarityFinalReport, chk: any[]): ClarityHandoff => {
    if (rep.raw_handoff_data) {
      return {
        ...rep.raw_handoff_data,
        action_checklist: chk.map((c: any) => ({
          id: c.id,
          timeframe: c.week ? `Week ${c.week}` : 'Immediate',
          task: c.text || c.task || '',
          completed: !!c.completed,
        })),
      };
    }
    return {
      report_title: 'Personal Clarity Report',
      user_name: rep.user_profile?.name || 'Explorer',
      current_stage: rep.user_profile?.life_stage || 'Career Exploration',
      primary_uncertainty: 'Career Direction Resolution',
      executive_summary: {
        summary: typeof rep.executive_summary === 'string' ? rep.executive_summary : (rep.executive_summary as any)?.summary || '',
        primary_uncertainty: '',
        key_insight: '',
      },
      understanding_you: {
        education_and_background: rep.user_profile?.current_context || '',
        interests: [],
        strengths_possessed: [],
        skills_to_develop: [],
        work_preferences: '',
        constraints: [],
      },
      uncertainty_map: {
        primary: 'Career Exploration',
        secondary: [],
        breakdown: [],
      },
      strengths_and_interests: {
        core_strengths: rep.skill_mastery_matrix?.immediate_priorities || [],
        deep_curiosities: [],
        transferable_gems: [],
      },
      explored_directions: (rep.trajectories_evaluated || []).map((t: any) => ({
        title: t.title,
        fit_score: t.fit_score,
        reasoning: '',
        pros: t.pros || [],
        cons: t.cons || [],
        open_questions: [],
        recommended: !!t.recommended,
      })),
      strategic_direction: {
        selected_direction: rep.selected_direction?.primary_title || '',
        primary_title: rep.selected_direction?.primary_title,
        is_decided: true,
        rationale: rep.selected_direction?.rationale || '',
        target_timeline_months: rep.selected_direction?.target_timeline_months || 6,
        target_role_types: rep.selected_direction?.target_role_types || [],
        next_decisions_to_investigate: [],
      },
      roadmap: (rep.roadmap_phases || []).map((p: any) => ({
        timeframe: p.duration_weeks || 'Phase',
        title: p.phase_name,
        description: '',
        objectives: p.objectives || [],
        deliverables: p.deliverables || [],
        milestones: p.deliverables || [],
      })),
      skills_plan: (rep.skill_mastery_matrix?.immediate_priorities || []).map((s: string) => ({
        skill_name: s,
        importance: 'Core Priority',
        learning_activity: 'Applied projects',
        evidence_of_progress: 'Live proof of work',
      })),
      risks_and_considerations: {
        potential_obstacles: [],
        assumptions_to_validate: [],
        risk_mitigations: [],
      },
      action_checklist: chk.map((c: any) => ({
        id: c.id,
        timeframe: c.week ? `Week ${c.week}` : 'Immediate',
        task: c.text || c.task || '',
        completed: !!c.completed,
      })),
      personal_commitment: {
        first_concrete_step: rep.living_action_checklist?.[0]?.text || 'Start phase 1',
        commitment_statement: rep.personal_commitment_statement || 'I commit to steady execution.',
      },
      reassessment: {
        recommended_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        reflection_prompt: 'Review milestone progress.',
      },
    };
  };

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      await generateClarityPdf(adaptToHandoff(report, checklist));
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Could not generate PDF. Please try again or download DOCX.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    setDownloadingDocx(true);
    try {
      await generateClarityDocx(adaptToHandoff(report, checklist));
    } catch (err) {
      console.error('DOCX generation error:', err);
      alert('Could not generate DOCX. Please try again.');
    } finally {
      setDownloadingDocx(false);
    }
  };

  const completedCount = checklist.filter((i: any) => i.completed).length;
  const progressPercent = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Top Banner / Actions */}
      <div className="bg-[#FFE76B] border-2 border-[#171717] rounded-2xl p-6 shadow-[4px_4px_0px_#171717] mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 bg-[#171717] text-white rounded-full mb-2">
              Stage 7: Official Personal Clarity Report
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#171717] tracking-tight">
              {report.user_profile?.name ? `${report.user_profile.name}'s Clarity Blueprint` : 'Your Personal Clarity Blueprint'}
            </h1>
            <p className="text-xs md:text-sm font-semibold text-[#171717]/80 mt-1">
              Target: <strong className="text-[#171717]">{report.selected_direction?.primary_title || (report as any).selected_direction?.selected_direction || (report as any).strategic_direction?.selected_direction || 'Strategic Trajectory'}</strong> • Generated on {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Primary Integration CTA */}
          <button
            type="button"
            onClick={onTransferToDashboard}
            className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-[#526B50] text-white font-extrabold text-sm border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-center justify-center gap-2 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#171717] transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Turn Into My Live Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Secondary Download Action Buttons */}
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
            <span>Start Fresh Assessment</span>
          </button>
        </div>
      </div>

      {/* Grid: Executive Summary & Uncertainty Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Executive Summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl border-2 border-[#171717] p-6 shadow-[3px_3px_0px_#171717] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-8 h-8 rounded-lg bg-[#526B50] text-white flex items-center justify-center font-bold text-xs">
                01
              </span>
              <h2 className="text-lg font-bold text-[#171717]">Executive Summary & Core Thesis</h2>
            </div>
            <p className="text-sm md:text-base text-[#222] leading-relaxed">
              {typeof report.executive_summary === 'string'
                ? report.executive_summary
                : (report.executive_summary as any)?.summary || 'Executive summary synthesized from your clarity exploration.'}
            </p>
          </div>

          {report.uncertainty_resolution?.confidence_score && (
            <div className="mt-6 pt-4 border-t border-[#171717]/10 flex items-center justify-between">
              <span className="text-xs font-bold text-[#666] uppercase tracking-wider">
                Strategic Confidence Rating
              </span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2.5 bg-gray-200 rounded-full overflow-hidden border border-[#171717]/20">
                  <div
                    className="h-full bg-[#526B50] rounded-full"
                    style={{ width: `${report.uncertainty_resolution.confidence_score}%` }}
                  />
                </div>
                <span className="text-sm font-extrabold text-[#171717]">
                  {report.uncertainty_resolution.confidence_score}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Uncertainty Resolution Chart */}
        <div className="bg-white rounded-2xl border-2 border-[#171717] p-6 shadow-[3px_3px_0px_#171717] flex flex-col items-center justify-between">
          <div className="w-full">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-8 h-8 rounded-lg bg-[#FFE76B] text-[#171717] border border-[#171717] flex items-center justify-center font-bold text-xs">
                02
              </span>
              <h2 className="text-lg font-bold text-[#171717]">Trajectories Analyzed</h2>
            </div>
            <p className="text-[11px] text-[#666] mb-4">Fit score distribution across explored paths</p>
          </div>

          <div className="w-full h-44 relative my-auto">
            <canvas ref={chartCanvasRef} />
          </div>

          <div className="w-full pt-3 border-t border-[#171717]/10 text-center">
            <span className="text-[11px] font-bold text-[#526B50]">
              ✓ Highest fit: {report.selected_direction?.primary_title}
            </span>
          </div>
        </div>
      </div>

      {/* Uncertainty Breakdown & Key Breakthroughs */}
      {report.uncertainty_resolution && (
        <div className="bg-[#FDF5EB] rounded-2xl border-2 border-[#171717] p-6 shadow-[3px_3px_0px_#171717] mb-8 space-y-4">
          <h3 className="text-base font-bold text-[#171717] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#526B50]" />
            <span>How Your Core Dilemmas Were Resolved</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border border-[#171717]/15 space-y-2">
              <span className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                Root Causes Addressed
              </span>
              <ul className="space-y-1.5 text-xs text-[#333]">
                {report.uncertainty_resolution.root_causes_addressed?.map((item: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#526B50] font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-white rounded-xl border border-[#171717]/15 space-y-2">
              <span className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                Key Breakthrough Insights
              </span>
              <ul className="space-y-1.5 text-xs text-[#333]">
                {report.uncertainty_resolution.key_breakthrough_insights?.map((item: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#D97706] font-bold mt-0.5">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Trajectories Evaluated Cards */}
      {report.trajectories_evaluated && report.trajectories_evaluated.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-8 h-8 rounded-lg bg-[#171717] text-white flex items-center justify-center font-bold text-xs">
              03
            </span>
            <h2 className="text-xl font-bold text-[#171717]">Evaluated Career Trajectories</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.trajectories_evaluated.map((traj: any, idx: number) => {
              const isSelected = traj.recommended || traj.title === report.selected_direction?.primary_title;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border-2 p-5 flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'bg-white border-[#526B50] shadow-[3px_3px_0px_#526B50]'
                      : 'bg-[#FAF8F5] border-[#171717]/20 opacity-90'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-[#526B50] text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {isSelected ? 'Recommended Direction' : 'Alternative'}
                      </span>
                      <span className="text-xs font-extrabold text-[#171717]">
                        {traj.fit_score}% Fit
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-[#171717] mb-3 leading-snug">
                      {traj.title}
                    </h3>

                    <div className="space-y-2 mb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#526B50] block">Strengths / Pros:</span>
                        <ul className="text-xs text-[#444] space-y-0.5 mt-0.5">
                          {traj.pros?.map((p: any, pIdx: number) => (
                            <li key={pIdx}>+ {p}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase text-red-700 block">Tradeoffs / Cons:</span>
                        <ul className="text-xs text-[#666] space-y-0.5 mt-0.5">
                          {traj.cons?.map((c: any, cIdx: number) => (
                            <li key={cIdx}>- {c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#171717]/10 flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#555]">
                      {isSelected ? 'Active Selection' : 'Deprioritized'}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-[#526B50] stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Strategic Roadmap Phases */}
      {report.roadmap_phases && report.roadmap_phases.length > 0 && (
        <div className="bg-white rounded-2xl border-2 border-[#171717] p-6 shadow-[3px_3px_0px_#171717] mb-8">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-8 h-8 rounded-lg bg-[#526B50] text-white flex items-center justify-center font-bold text-xs">
              04
            </span>
            <div>
              <h2 className="text-xl font-bold text-[#171717]">Strategic Execution Roadmap</h2>
              <p className="text-xs text-[#666]">Structured milestone phases for real traction</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {report.roadmap_phases.map((phase: any, pIdx: number) => (
              <div key={pIdx} className="p-4 rounded-xl bg-[#FDF5EB]/50 border border-[#171717]/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#526B50] uppercase tracking-wider">
                      {phase.duration_weeks || `Phase ${pIdx + 1}`}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-[#171717] text-white text-[10px] font-bold flex items-center justify-center">
                      {pIdx + 1}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#171717] mb-3">
                    {phase.phase_name}
                  </h3>

                  <div className="space-y-2 mb-3">
                    <span className="text-[10px] font-bold uppercase text-[#555] block">Key Objectives:</span>
                    <ul className="text-xs text-[#333] space-y-1">
                      {phase.objectives?.map((obj: any, oIdx: number) => (
                        <li key={oIdx} className="flex items-start gap-1.5">
                          <span className="text-[#526B50] font-bold mt-0.5">•</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#171717]/10">
                  <span className="text-[10px] font-bold uppercase text-[#526B50] block mb-1">Tangible Deliverables:</span>
                  <div className="flex flex-wrap gap-1">
                    {phase.deliverables?.map((del: any, dIdx: number) => (
                      <span key={dIdx} className="px-2 py-0.5 rounded bg-white border border-[#171717]/20 text-[11px] font-semibold text-[#171717]">
                        {del}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Mastery Matrix */}
      {report.skill_mastery_matrix && (
        <div className="bg-white rounded-2xl border-2 border-[#171717] p-6 shadow-[3px_3px_0px_#171717] mb-8">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-8 h-8 rounded-lg bg-[#FFE76B] border border-[#171717] text-[#171717] flex items-center justify-center font-bold text-xs">
              05
            </span>
            <div>
              <h2 className="text-xl font-bold text-[#171717]">Skills Mastery Matrix</h2>
              <p className="text-xs text-[#666]">Focus on high-yield capabilities and deliberately ignore distractions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Immediate Priorities */}
            <div className="p-4 rounded-xl bg-[#526B50]/10 border border-[#526B50]/30 space-y-2">
              <span className="text-xs font-bold text-[#526B50] uppercase tracking-wider block">
                🟢 Immediate Priorities
              </span>
              <ul className="space-y-1.5 text-xs font-medium text-[#171717]">
                {report.skill_mastery_matrix.immediate_priorities?.map((s: any, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#526B50]" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Secondary Skills */}
            <div className="p-4 rounded-xl bg-[#FDF5EB] border border-[#171717]/15 space-y-2">
              <span className="text-xs font-bold text-[#171717] uppercase tracking-wider block">
                🟡 Secondary / Supporting
              </span>
              <ul className="space-y-1.5 text-xs text-[#333]">
                {report.skill_mastery_matrix.secondary_skills?.map((s: any, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills to Deprioritize */}
            <div className="p-4 rounded-xl bg-gray-100 border border-gray-300 space-y-2">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
                ⚪ Deprioritize / Avoid
              </span>
              <ul className="space-y-1.5 text-xs text-gray-600">
                {report.skill_mastery_matrix.skills_to_deprioritize?.map((s: any, idx: number) => (
                  <li key={idx} className="flex items-center gap-2 line-through text-gray-500">
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Living Action Checklist (Interactive) */}
      <div className="bg-white rounded-2xl border-2 border-[#171717] p-6 shadow-[3px_3px_0px_#171717] mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#171717] text-white flex items-center justify-center font-bold text-xs">
              06
            </span>
            <div>
              <h2 className="text-xl font-bold text-[#171717]">Living Action Checklist</h2>
              <p className="text-xs text-[#666]">Tick items off directly here — status persists automatically</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold bg-[#FDF5EB] px-3.5 py-1.5 rounded-xl border border-[#171717]/20">
            <span>{completedCount} of {checklist.length} Complete</span>
            <span>({progressPercent}%)</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {checklist.map((item: any) => (
            <div
              key={item.id}
              onClick={() => toggleChecklistItem(item.id)}
              className={`p-3.5 rounded-xl border-2 transition-all flex items-start gap-3.5 cursor-pointer ${
                item.completed
                  ? 'bg-[#526B50]/10 border-[#526B50] line-through text-[#666]'
                  : 'bg-white border-[#171717]/20 hover:border-[#171717]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center mt-0.5 transition-all ${
                  item.completed
                    ? 'bg-[#526B50] border-[#526B50] text-white'
                    : 'border-[#171717]/40 bg-transparent'
                }`}
              >
                {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-xs md:text-sm font-semibold leading-relaxed ${item.completed ? 'text-gray-500' : 'text-[#171717]'}`}>
                  {item.text}
                </p>
              </div>

              {item.week && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FDF5EB] text-[#555] border border-[#171717]/15 shrink-0">
                  Week {item.week}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Personal Commitment Statement */}
      {report.personal_commitment_statement && (
        <div className="bg-[#FFE76B]/30 rounded-2xl border-2 border-[#171717] p-6 shadow-[3px_3px_0px_#171717] mb-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✍️</span>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#171717] mb-1">
                Your Personal Commitment
              </h3>
              <p className="text-sm md:text-base font-semibold text-[#171717] italic leading-relaxed">
                "{report.personal_commitment_statement}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Transfer Action */}
      <div className="bg-[#171717] rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[4px_4px_0px_#FFE76B]">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Ready to start tracking your daily progress?</h3>
          <p className="text-xs text-gray-300">
            Transfer this entire plan, milestones, and habit schedule into your interactive FOYC dashboard.
          </p>
        </div>

        <button
          type="button"
          onClick={onTransferToDashboard}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#FFE76B] text-[#171717] font-extrabold text-sm border-2 border-[#FFE76B] flex items-center justify-center gap-2 hover:bg-[#ffe040] transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Launch In Career Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
