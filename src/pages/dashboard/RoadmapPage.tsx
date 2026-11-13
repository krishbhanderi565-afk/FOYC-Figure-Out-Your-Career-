import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  Milestone as MilestoneIcon,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const { dashboardData, toggleMilestone } = useCareer();
  const [selectedStage, setSelectedStage] = useState<string>('All');

  const stages = [
    'All',
    'Foundation',
    'Skill Development',
    'Practical Application',
    'Professional Readiness',
    'Career Growth',
  ];

  const filteredMilestones =
    selectedStage === 'All'
      ? dashboardData.milestones
      : dashboardData.milestones.filter((m) => m.stage === selectedStage);

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        onOpenMobileMenu={() => {}}
        title="My Career Roadmap"
        subtitle="Chronological phases from foundation mastery to professional readiness."
      />

      <main className="p-4 sm:p-8 space-y-8 max-w-6xl">
        {/* Stage Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {stages.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStage(st)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-2 whitespace-nowrap transition-all ${
                selectedStage === st
                  ? 'bg-[#FFE76B] text-[#17172B] border-[#17172B] shadow-[2px_2px_0px_#17172B]'
                  : 'bg-white text-[#17172B]/70 border-[#17172B]/30 hover:border-[#17172B]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Timeline Sequence */}
        <div className="space-y-6">
          {filteredMilestones.map((m, index) => {
            const priorityColors = {
              high: 'bg-red-100 text-red-800 border-red-300',
              medium: 'bg-amber-100 text-amber-800 border-amber-300',
              low: 'bg-emerald-100 text-emerald-800 border-emerald-300',
            };

            return (
              <Card
                key={m.id}
                variant="white"
                shadowSize="md"
                className={`p-6 sm:p-8 border-3 transition-all ${
                  m.completed ? 'bg-[#F9FFF9] border-emerald-600' : 'border-[#17172B]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b-2 border-[#17172B]/20">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleMilestone(m.id)}
                      className={`w-8 h-8 rounded-xl border-2 border-[#17172B] flex items-center justify-center font-bold transition-all shadow-[2px_2px_0px_#17172B] ${
                        m.completed ? 'bg-emerald-400 text-white' : 'bg-[#F2F9E9] hover:bg-[#FFE76B]'
                      }`}
                      title={m.completed ? 'Mark pending' : 'Mark completed'}
                    >
                      {m.completed ? <CheckCircle2 className="w-5 h-5 text-[#17172B]" /> : index + 1}
                    </button>

                    <div>
                      <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#FFE76B] border border-[#17172B]">
                        {m.stage}
                      </span>
                      <span className="ml-2 text-xs font-bold text-[#17172B]/60">
                        Phase 0{index + 1}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${priorityColors[m.priority]}`}>
                      {m.priority} Priority
                    </span>
                    <span className="text-xs font-bold text-[#17172B] px-3 py-1 rounded-lg bg-[#F2F9E9] border border-[#17172B]">
                      ⏱️ {m.estimatedDuration}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className={`text-xl sm:text-2xl font-black text-[#17172B] ${m.completed ? 'line-through text-[#17172B]/50' : ''}`}>
                    {m.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#17172B]/80 font-medium leading-relaxed">
                    {m.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-[#17172B]/10 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-[#17172B]/75">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#17172B]" />
                    Target Timeline: {m.targetDate}
                  </span>
                  <span className="bg-[#F2F9E9] px-2.5 py-1 rounded-md border border-[#17172B]">
                    📋 {m.associatedTasksCount} associated checklist tasks
                  </span>
                  <button
                    onClick={() => toggleMilestone(m.id)}
                    className="text-xs font-black underline hover:text-black"
                  >
                    {m.completed ? 'Reopen Milestone' : 'Mark Phase as Completed'}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};
