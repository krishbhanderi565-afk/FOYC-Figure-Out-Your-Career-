import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import {
  Milestone as MilestoneIcon,
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  ChevronRight,
  X,
  ListTodo,
  Check,
  Compass,
  Layers,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';

interface DashboardOutletContext {
  onOpenMobileMenu: () => void;
}

export const RoadmapPage: React.FC = () => {
  const { dashboardData, toggleMilestone, toggleTask, addTask, userState, enterDemoMode } = useCareer();
  const outletCtx = useOutletContext<DashboardOutletContext | undefined>();

  const [activeStageFilter, setActiveStageFilter] = useState<string>('All');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'canvas' | 'list'>('canvas');

  const milestones = dashboardData?.milestones || [];
  const tasks = dashboardData?.tasks || [];

  const stages = [
    'All',
    'Foundation',
    'Skill Development',
    'Practical Application',
    'Career Readiness',
  ];

  const filteredMilestones =
    activeStageFilter === 'All'
      ? milestones
      : milestones.filter((m) => m.stage?.toLowerCase().includes(activeStageFilter.toLowerCase()));

  const selectedMilestone = milestones.find((m) => m.id === selectedMilestoneId) || null;

  // Associated tasks for the selected milestone
  const milestoneTasks = selectedMilestone
    ? tasks.filter(
        (t) =>
          t.category?.toLowerCase() === selectedMilestone.stage?.toLowerCase() ||
          t.title.toLowerCase().includes(selectedMilestone.title.slice(0, 10).toLowerCase())
      )
    : [];

  const completedCount = milestones.filter((m) => m.completed).length;
  const progressPct = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#FDFBF7]">
      <DashboardHeader
        onOpenMobileMenu={outletCtx?.onOpenMobileMenu || (() => {})}
        title="Interactive Roadmap"
        subtitle="Visual progression trajectory from foundational skills to career mastery."
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Empty State when no milestones yet */}
        {milestones.length === 0 && (
          <div className="bg-white rounded-3xl border-2 border-stone-900 p-8 sm:p-12 shadow-[6px_6px_0px_#171717] text-center space-y-4 max-w-xl mx-auto my-12">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE76B] border-2 border-stone-900 flex items-center justify-center mx-auto shadow-sm">
              <MilestoneIcon className="w-6 h-6 text-stone-900" />
            </div>
            <h2 className="text-2xl font-black text-stone-900">No Roadmap Generated Yet</h2>
            <p className="text-xs sm:text-sm text-stone-600 font-semibold leading-relaxed">
              Complete your career discovery with Clarity Compass to generate a connected milestone roadmap.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link to="/clarity-compass">
                <button className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-black shadow-sm flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#FFE76B]" />
                  <span>Start Clarity Compass</span>
                </button>
              </Link>
              <button
                onClick={enterDemoMode}
                className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold"
              >
                Explore Sample Roadmap
              </button>
            </div>
          </div>
        )}

        {milestones.length > 0 && (
          <>
            {/* Top Toolbar: Progress & View Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">
                    Trajectory Progress
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-stone-900">
                      {completedCount} / {milestones.length}
                    </span>
                    <span className="text-xs font-bold text-stone-500">
                      ({progressPct}% completed)
                    </span>
                  </div>
                </div>
                <div className="hidden md:block w-36 h-2 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
                  <div
                    className="h-full bg-stone-900 transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* View Switcher & Stage Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
                  <button
                    onClick={() => setViewMode('canvas')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      viewMode === 'canvas' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'
                    }`}
                  >
                    Canvas Flow
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      viewMode === 'list' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'
                    }`}
                  >
                    Timeline List
                  </button>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {stages.map((st) => (
                    <button
                      key={st}
                      onClick={() => setActiveStageFilter(st)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors whitespace-nowrap ${
                        activeStageFilter === st
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CANVAS FLOW VIEW: Floating Cards with curved connector paths */}
            {viewMode === 'canvas' && (
              <div className="relative py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                  {filteredMilestones.map((m, idx) => {
                    const isCompleted = m.completed;
                    const isSelected = selectedMilestoneId === m.id;

                    return (
                      <div
                        key={m.id}
                        onClick={() => setSelectedMilestoneId(m.id)}
                        className={`group relative rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[220px] ${
                          isCompleted
                            ? 'bg-emerald-50/50 border-emerald-500/80 shadow-xs'
                            : isSelected
                            ? 'bg-white border-stone-900 shadow-md ring-2 ring-stone-900/10'
                            : 'bg-white border-stone-200 hover:border-stone-400 hover:shadow-sm'
                        }`}
                      >
                        {/* Phase Number & Status Pill */}
                        <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-100">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-[10px] font-black flex items-center justify-center">
                              0{idx + 1}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 truncate max-w-[100px]">
                              {m.stage}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {isCompleted ? '✓ Done' : 'In Progress'}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div className="my-3 space-y-1.5 flex-1">
                          <h4
                            className={`text-sm font-black tracking-tight leading-snug line-clamp-2 ${
                              isCompleted ? 'text-stone-500 line-through' : 'text-stone-900'
                            }`}
                          >
                            {m.title}
                          </h4>
                          <p className="text-xs text-stone-500 font-medium line-clamp-3 leading-relaxed">
                            {m.description}
                          </p>
                        </div>

                        {/* Footer: Timeline & Toggle */}
                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                          <span className="flex items-center gap-1 font-semibold">
                            <Clock className="w-3 h-3 text-stone-400" />
                            {m.estimatedDuration}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMilestone(m.id);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-colors ${
                              isCompleted
                                ? 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                                : 'bg-stone-900 text-white hover:bg-stone-800'
                            }`}
                          >
                            {isCompleted ? 'Reopen' : 'Complete'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* LIST VIEW */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {filteredMilestones.map((m, idx) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMilestoneId(m.id)}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      m.completed
                        ? 'bg-emerald-50/40 border-emerald-400'
                        : 'bg-white border-stone-200 hover:border-stone-400 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMilestone(m.id);
                        }}
                        className={`w-7 h-7 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                          m.completed
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-stone-300 bg-white hover:border-stone-900'
                        }`}
                      >
                        {m.completed ? <Check className="w-4 h-4" /> : idx + 1}
                      </button>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                            {m.stage}
                          </span>
                          <span className="text-xs font-bold text-stone-400">
                            ⏱️ {m.estimatedDuration}
                          </span>
                        </div>
                        <h4
                          className={`text-sm sm:text-base font-black ${
                            m.completed ? 'line-through text-stone-400' : 'text-stone-900'
                          }`}
                        >
                          {m.title}
                        </h4>
                        <p className="text-xs text-stone-500 font-medium max-w-2xl line-clamp-1">
                          {m.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <span className="text-xs font-bold text-stone-400">{m.targetDate}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMilestoneId(m.id);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-stone-200 hover:border-stone-900 text-xs font-bold text-stone-700 flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* MILESTONE DETAIL DRAWER / MODAL */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-stone-900 shadow-2xl max-w-lg w-full p-6 animate-scaleUp space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-stone-200">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-stone-100 text-stone-800">
                  {selectedMilestone.stage}
                </span>
                <h3 className="text-lg font-black text-stone-900 leading-tight">
                  {selectedMilestone.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMilestoneId(null)}
                className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-stone-400">
                Phase Objective
              </span>
              <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                {selectedMilestone.description}
              </p>
            </div>

            {/* Target and Duration */}
            <div className="grid grid-cols-2 gap-3 text-xs font-bold">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-[10px] uppercase text-stone-400 block mb-0.5">Estimated Duration</span>
                <span className="text-stone-900">{selectedMilestone.estimatedDuration}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-[10px] uppercase text-stone-400 block mb-0.5">Target Horizon</span>
                <span className="text-stone-900">{selectedMilestone.targetDate}</span>
              </div>
            </div>

            {/* Associated Tasks */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-stone-400">
                  Related Action Items
                </span>
                <Link
                  to="/dashboard/tasks"
                  className="text-[11px] font-bold text-stone-600 hover:text-stone-900 underline"
                >
                  View in Checklist
                </Link>
              </div>

              {milestoneTasks.length > 0 ? (
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {milestoneTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => toggleTask(t.id)}
                      className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 flex items-center justify-between gap-2 cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            t.completed
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-stone-300'
                          }`}
                        >
                          {t.completed && <Check className="w-3 h-3" />}
                        </div>
                        <span className={`truncate ${t.completed ? 'line-through text-stone-400' : 'font-bold text-stone-900'}`}>
                          {t.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-400 italic">No specific sub-tasks linked yet.</p>
              )}
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  toggleMilestone(selectedMilestone.id);
                  setSelectedMilestoneId(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-colors ${
                  selectedMilestone.completed
                    ? 'bg-stone-200 text-stone-800 hover:bg-stone-300'
                    : 'bg-stone-900 text-white hover:bg-stone-800'
                }`}
              >
                {selectedMilestone.completed ? 'Reopen Milestone' : 'Mark Milestone as Completed'}
              </button>

              <button
                onClick={() => setSelectedMilestoneId(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-xs font-bold text-stone-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
