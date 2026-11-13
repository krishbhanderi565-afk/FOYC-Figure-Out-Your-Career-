import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  Target,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Compass,
  Check,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyCareerPage: React.FC = () => {
  const { dashboardData, loadSampleProfession } = useCareer();
  const dir = dashboardData.direction;

  const [showReassessModal, setShowReassessModal] = useState(false);
  const [proposedDirection, setProposedDirection] = useState('');
  const [reassessmentReason, setReassessmentReason] = useState('');
  const [successToast, setSuccessToast] = useState(false);

  const handleApplyReassessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedDirection.trim()) return;

    // Apply update to current direction
    dashboardData.direction.primaryTitle = proposedDirection.trim();
    dashboardData.direction.lastReassessedDate = new Date().toLocaleDateString();
    if (reassessmentReason) {
      dashboardData.direction.summary = `${dashboardData.direction.summary} (Recalibrated: ${reassessmentReason})`;
    }

    setShowReassessModal(false);
    setProposedDirection('');
    setReassessmentReason('');
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        onOpenMobileMenu={() => {}}
        title="My Career Direction"
        subtitle="Detailed alignment analysis, transferable strengths and skill gap matrix."
      />

      <main className="p-4 sm:p-8 space-y-8 max-w-6xl">
        {/* Toast confirmation */}
        {successToast && (
          <div className="p-4 rounded-2xl bg-[#DDF5C9] border-2 border-[#17172B] shadow-[3px_3px_0px_#17172B] flex items-center gap-3 animate-in fade-in-50">
            <CheckCircle2 className="w-5 h-5 text-emerald-800" />
            <span className="font-bold text-sm text-[#17172B]">
              Career trajectory successfully recalibrated! Your dashboard has updated.
            </span>
          </div>
        )}

        {/* Main Career Header Card */}
        <Card variant="yellow" shadowSize="lg" className="p-6 sm:p-10">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="dark" size="sm">
                  Verified Primary Path
                </Badge>
                <span className="text-xs font-bold text-[#17172B]/60">
                  Last reassessed: {dir.lastReassessedDate}
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-[#17172B] tracking-tight mb-3">
                {dir.primaryTitle}
              </h2>
              <p className="text-base sm:text-lg text-[#17172B]/85 font-semibold max-w-3xl leading-relaxed">
                {dir.summary}
              </p>
            </div>

            <Button
              variant="dark"
              size="md"
              onClick={() => setShowReassessModal(true)}
              className="gap-2 shrink-0 font-extrabold shadow-[4px_4px_0px_#0A0A14]"
            >
              <RefreshCw className="w-4 h-4 text-[#FFE76B]" />
              Revisit & Reassess
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-[#17172B] grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-2xl border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B]">
              <span className="text-xs font-black uppercase tracking-wider text-[#17172B]/60 block mb-1">
                Why this direction fits you:
              </span>
              <p className="text-sm font-bold text-[#17172B] leading-relaxed">
                {dir.matchReason}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B]">
              <span className="text-xs font-black uppercase tracking-wider text-[#17172B]/60 block mb-1">
                Long-Term Horizon (2-3 Years):
              </span>
              <p className="text-sm font-bold text-[#17172B] leading-relaxed">
                {dir.longTermGoal}
              </p>
            </div>
          </div>
        </Card>

        {/* Modal: Reassess & Recalibrate */}
        {showReassessModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border-3 border-[#17172B] shadow-[8px_8px_0px_#17172B] p-6 sm:p-8 max-w-xl w-full animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#17172B]">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-[#17172B]" />
                  <h3 className="font-black text-xl text-[#17172B]">Recalibrate Career Direction</h3>
                </div>
                <button
                  onClick={() => setShowReassessModal(false)}
                  className="w-8 h-8 rounded-lg bg-[#F2F9E9] border border-[#17172B] font-black text-sm flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleApplyReassessment} className="space-y-4">
                {/* Current vs Proposed Diff Comparison */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#F2F9E9] border-2 border-[#17172B] text-xs">
                  <div>
                    <span className="font-black uppercase text-[#17172B]/60 block">Current Focus</span>
                    <span className="font-bold text-[#17172B]">{dir.primaryTitle}</span>
                  </div>
                  <div>
                    <span className="font-black uppercase text-emerald-800 block">Proposed Focus</span>
                    <span className="font-bold text-emerald-950">
                      {proposedDirection || 'Enter new title below...'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1">
                    New Target Career Title
                  </label>
                  <input
                    type="text"
                    value={proposedDirection}
                    onChange={(e) => setProposedDirection(e.target.value)}
                    placeholder="e.g. Applied AI Engineer, Solutions Architect..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-bold text-sm focus:ring-2 focus:ring-[#FFE76B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1">
                    What triggered this shift? (Interests, new opportunity, market changes)
                  </label>
                  <textarea
                    value={reassessmentReason}
                    onChange={(e) => setReassessmentReason(e.target.value)}
                    rows={3}
                    placeholder="e.g. After 3 weeks of coding, I realized I enjoy data modeling and LLM agent orchestration more than standard frontend."
                    className="w-full p-3 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-medium text-xs focus:ring-2 focus:ring-[#FFE76B]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[11px] font-semibold text-amber-900">
                  ⚠️ Note: Explicit user approval is required before updating milestones. Your existing completed tasks and habit streaks will remain intact.
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowReassessModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="font-black">
                    Confirm & Apply Trajectory Shift
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Skills Radar & Gap Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Strengths & Existing Skills */}
          <Card variant="white" shadowSize="md" className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-[#17172B]">
              <div className="w-8 h-8 rounded-lg bg-[#DDF5C9] border border-[#17172B] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-800" />
              </div>
              <h3 className="font-extrabold text-lg text-[#17172B]">
                Your Existing Strengths
              </h3>
            </div>
            <p className="text-xs text-[#17172B]/70 font-medium mb-4">
              Transferable advantages you already bring to the table:
            </p>
            <div className="space-y-2.5">
              {dir.strengths.map((str, i) => (
                <div key={i} className="flex items-center gap-2.5 bg-[#F0FDF4] p-3 rounded-xl border border-[#17172B]">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span className="text-xs sm:text-sm font-bold text-[#17172B]">{str}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Skill Gaps to Close */}
          <Card variant="white" shadowSize="md" className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-[#17172B]">
              <div className="w-8 h-8 rounded-lg bg-[#FFE76B] border border-[#17172B] flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-700" />
              </div>
              <h3 className="font-extrabold text-lg text-[#17172B]">
                Skill Gaps in Your Roadmap
              </h3>
            </div>
            <p className="text-xs text-[#17172B]/70 font-medium mb-4">
              Competencies you will actively build through your checklist & capstone projects:
            </p>
            <div className="space-y-2.5">
              {dir.skillGaps.map((gap, i) => (
                <div key={i} className="flex items-center gap-2.5 bg-[#FFF5F5] p-3 rounded-xl border border-[#17172B]">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-xs sm:text-sm font-bold text-[#17172B]">{gap}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Alternative Paths Explored */}
        <Card variant="white" shadowSize="md" className="p-6 sm:p-8">
          <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#17172B]">
            <div>
              <h3 className="font-extrabold text-lg text-[#17172B]">Alternative Paths Considered</h3>
              <p className="text-xs text-[#17172B]/60 font-medium">Adjacent careers you can pivot into if your interests shift.</p>
            </div>
            <Badge variant="lavender">Flexible Options</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {dir.alternativeTitles.map((alt, idx) => (
              <div key={idx} className="p-4 rounded-xl border-2 border-[#17172B] bg-[#F2F9E9] shadow-[2px_2px_0px_#17172B]">
                <span className="text-[10px] font-black uppercase text-[#17172B]/60 block mb-1">Adjacent Role 0{idx + 1}</span>
                <h4 className="font-black text-sm text-[#17172B]">{alt}</h4>
              </div>
            ))}
          </div>
        </Card>

        {/* Reassessment Prompts */}
        <Card variant="blue" shadowSize="md" className="p-6 sm:p-8">
          <h3 className="font-extrabold text-lg text-[#17172B] mb-2 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#17172B]" />
            Continuous Reassessment Questions
          </h3>
          <p className="text-xs sm:text-sm text-[#17172B]/80 font-medium mb-4">
            Ask yourself these questions during your weekly reviews to confirm you are still excited:
          </p>
          <div className="space-y-2.5">
            {dir.reassessmentQuestions.map((q, i) => (
              <div key={i} className="bg-white p-3.5 rounded-xl border-2 border-[#17172B] text-xs sm:text-sm font-bold text-[#17172B]">
                ❓ "{q}"
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};
