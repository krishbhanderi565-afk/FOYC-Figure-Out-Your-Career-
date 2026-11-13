import React from 'react';
import { useCareer } from '../../context/CareerContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Highlight } from '../../components/common/Highlight';
import {
  Target,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Compass,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyCareerPage: React.FC = () => {
  const { dashboardData } = useCareer();
  const dir = dashboardData.direction;

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        onOpenMobileMenu={() => {}}
        title="My Career Direction"
        subtitle="Detailed alignment analysis, transferable strengths and skill gap matrix."
      />

      <main className="p-4 sm:p-8 space-y-8 max-w-6xl">
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

            <Link to="/reflection" className="shrink-0">
              <Button variant="dark" size="md" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Revisit Direction
              </Button>
            </Link>
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
              <div className="w-8 h-8 rounded-lg bg-[#FFD9E8] border border-[#17172B] flex items-center justify-center">
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
              <div key={idx} className="p-4 rounded-xl border-2 border-[#17172B] bg-[#FFF8E9] shadow-[2px_2px_0px_#17172B]">
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
