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
  ZoomIn,
  ZoomOut,
  RotateCcw,
  BookOpen,
  FolderGit2,
  Users,
} from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';

interface DashboardOutletContext {
  onOpenMobileMenu: () => void;
}

export const RoadmapPage: React.FC = () => {
  const { dashboardData, toggleMilestone, toggleTask, userState, enterDemoMode, isDemoMode } = useCareer();
  const outletCtx = useOutletContext<DashboardOutletContext | undefined>();

  const [activeStageFilter, setActiveStageFilter] = useState<string>('All');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'journey' | 'canvas'>('journey');

  const rawMilestones = dashboardData?.milestones || [];
  const careerTitle = dashboardData?.direction?.primaryTitle || 'Target Career';
  const defaultMilestones = [
    { id: 'm1', title: 'Foundation & Toolchain Calibration', stage: 'Foundation', description: `Establish core workflow principles and setup environment for ${careerTitle}.`, targetDate: 'Month 1', estimatedDuration: '3 weeks', completed: true, associatedTasksCount: 3, priority: 'high' as const },
    { id: 'm2', title: 'Build Core Competencies & Skills', stage: 'Skill Development', description: 'Master high-leverage tools, modern practices, and industry standards.', targetDate: 'Month 2-3', estimatedDuration: '6 weeks', completed: false, associatedTasksCount: 5, priority: 'high' as const },
    { id: 'm3', title: 'Build Practical Proof-of-Work Artifacts', stage: 'Practical Application', description: 'Build and document 2 comprehensive capstone projects solving real problems.', targetDate: 'Month 4-6', estimatedDuration: '8 weeks', completed: false, associatedTasksCount: 4, priority: 'high' as const },
    { id: 'm4', title: 'Professional Positioning & Showcase', stage: 'Professional Readiness', description: 'Polish portfolio showcase, resume, and connect with senior practitioners.', targetDate: 'Month 7-9', estimatedDuration: '4 weeks', completed: false, associatedTasksCount: 3, priority: 'medium' as const },
    { id: 'm5', title: 'Career Transition & Market Launch', stage: 'Career Growth', description: 'Initiate outreach, interview pipelines, or client consulting projects.', targetDate: 'Month 10-12', estimatedDuration: '12 weeks', completed: false, associatedTasksCount: 5, priority: 'high' as const },
  ];
  const milestones = rawMilestones.length > 0 ? rawMilestones : defaultMilestones;

  const tasks = dashboardData?.tasks || [];

  const completedCount = milestones.filter((m) => m.completed).length;
  const inProgressCount = milestones.filter((m) => !m.completed).length > 0 ? 1 : 0;
  const upcomingCount = Math.max(0, milestones.length - completedCount - inProgressCount);
  const progressPct = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 40;

  const selectedMilestone = milestones.find((m) => m.id === selectedMilestoneId) || null;

  const milestoneTasks = selectedMilestone
    ? tasks.filter(
        (t) =>
          t.category?.toLowerCase() === selectedMilestone.stage?.toLowerCase() ||
          t.title.toLowerCase().includes(selectedMilestone.title.slice(0, 10).toLowerCase())
      )
    : [];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <DashboardHeader
        onOpenMobileMenu={outletCtx?.onOpenMobileMenu || (() => {})}
        title="My Roadmap"
        subtitle="A step-by-step plan to achieve your career goals."
      />

      <main className="px-4 sm:px-8 pb-12 space-y-6 max-w-[1400px] w-full mx-auto">
        {/* Empty State when no milestones yet and not demo */}
        {milestones.length === 0 && !isDemoMode && (
          <div className="rounded-3xl p-8 sm:p-12 border border-white/90 shadow-sm backdrop-blur-xl bg-white/85 text-center space-y-4 max-w-xl mx-auto my-12">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto text-emerald-700 shadow-xs">
              <MilestoneIcon className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-stone-900">No Roadmap Generated Yet</h2>
            <p className="text-xs sm:text-sm text-stone-600 font-semibold leading-relaxed">
              Complete your career discovery with Clarity Compass to generate a connected milestone roadmap.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link to="/clarity-compass">
                <button className="px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-black shadow-xs flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-200" />
                  <span>Start Clarity Compass</span>
                </button>
              </Link>
              <button
                onClick={enterDemoMode}
                className="px-5 py-2.5 rounded-full border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold"
              >
                Explore Sample Roadmap
              </button>
            </div>
          </div>
        )}

        {milestones.length > 0 && (
          <>
            {/* Top Toolbar: Stage Filters & Zoom / View Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl border border-[#EFECE6] shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#64748B] mr-1">
                  Horizon:
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Next 6 Months ▾
                </span>
              </div>

              {/* View Switcher & Canvas Zoom controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-[#F8F6F0] p-1 rounded-xl border border-[#E2E8F0] text-xs font-bold">
                  <button
                    onClick={() => setViewMode('journey')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      viewMode === 'journey' ? 'bg-white text-[#1E293B] shadow-2xs font-black' : 'text-[#64748B]'
                    }`}
                  >
                    Journey View
                  </button>
                  <button
                    onClick={() => setViewMode('canvas')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      viewMode === 'canvas' ? 'bg-white text-[#1E293B] shadow-2xs font-black' : 'text-[#64748B]'
                    }`}
                  >
                    Floating Canvas
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-1 bg-[#F8F6F0] p-1 rounded-xl border border-[#E2E8F0]">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
                    className="p-1 rounded-lg hover:bg-white text-[#64748B]"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-bold text-[#64748B] px-1">{Math.round(zoomLevel * 100)}%</span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                    className="p-1 rounded-lg hover:bg-white text-[#64748B]"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="p-1 rounded-lg hover:bg-white text-[#64748B]"
                    title="Reset zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 2-COLUMN MAIN ROADMAP */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (7 cols): Connected Milestones Flow */}
              <div
                className="lg:col-span-7 rounded-3xl p-6 sm:p-7 border border-[#EFECE6] shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white space-y-4 transition-transform origin-top-left"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#F1EFE9]">
                  <h3 className="text-base font-black text-[#1E293B]">Progression Trajectory</h3>
                  <span className="text-xs font-bold text-[#94A3B8]">Connected milestones</span>
                </div>

                {/* Milestone nodes list */}
                <div className="relative pl-6 space-y-4">
                  {/* Vertical connecting line */}
                  <div className="absolute top-4 bottom-4 left-[15px] w-0.5 bg-emerald-300/60 z-0" />

                  {milestones.map((m, idx) => {
                    const isDone = m.completed;
                    const isCurrent = !isDone && idx === 1;

                    return (
                      <div
                        key={m.id}
                        onClick={() => setSelectedMilestoneId(m.id)}
                        className={`relative z-10 p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                          isDone
                            ? 'bg-[#FAF9F5] border-[#E8E5DC] hover:border-emerald-300 shadow-2xs'
                            : isCurrent
                            ? 'bg-emerald-50/70 border-emerald-400 shadow-xs ring-2 ring-emerald-400/20'
                            : 'bg-white border-[#EFECE6] hover:border-[#CBD5E1]'
                        }`}
                      >
                        {/* Node status circle icon */}
                        <div className="flex items-start gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMilestone(m.id);
                            }}
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-transform hover:scale-110 ${
                              isDone
                                ? 'bg-emerald-500 text-white shadow-xs'
                                : isCurrent
                                ? 'bg-white border-2 border-amber-500 text-amber-600'
                                : 'bg-[#E2E8F0] text-[#94A3B8]'
                            }`}
                          >
                            {isDone ? (
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            ) : isCurrent ? (
                              <div className="w-2 h-2 rounded-full bg-amber-500" />
                            ) : (
                              <span className="text-[10px] font-black">{idx + 1}</span>
                            )}
                          </button>

                          <div className="space-y-0.5">
                            <h4 className="text-xs sm:text-sm font-black text-[#1E293B]">
                              {m.title}
                            </h4>
                            <p className="text-[11px] text-[#64748B] font-medium line-clamp-2">
                              {m.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-800'
                                : isCurrent
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-[#F1EFE9] text-[#64748B]'
                            }`}
                          >
                            {isDone ? 'Completed' : isCurrent ? 'In Progress' : 'Upcoming'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column (5 cols): Roadmap Progress Donut & Quick Actions */}
              <div className="lg:col-span-5 space-y-6">
                {/* 1. Roadmap Progress Donut Card */}
                <div className="rounded-3xl p-6 sm:p-7 border border-[#EFECE6] shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white space-y-4">
                  <h3 className="text-base font-black text-[#1E293B]">Your Roadmap Progress</h3>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
                    {/* Donut graphic */}
                    <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="14" fill="none" stroke="#F1EFE9" strokeWidth="4" />
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="4"
                          strokeDasharray={`${progressPct * 0.88}, 88`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-[#1E293B] tracking-tight">
                          {progressPct}%
                        </span>
                        <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">
                          Finished
                        </span>
                      </div>
                    </div>

                    {/* Progress breakdown list */}
                    <div className="space-y-3 w-full max-w-[170px]">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="flex items-center gap-2 text-[#64748B]">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          Completed
                        </span>
                        <span className="text-[#1E293B]">{completedCount}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="flex items-center gap-2 text-[#64748B]">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          In Progress
                        </span>
                        <span className="text-[#1E293B]">{inProgressCount}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="flex items-center gap-2 text-[#64748B]">
                          <span className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                          Upcoming
                        </span>
                        <span className="text-[#1E293B]">{upcomingCount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Quick Actions Card */}
                <div className="rounded-3xl p-6 border border-[#EFECE6] shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-[#64748B] block">
                    Quick Actions
                  </span>
                  <div className="grid grid-cols-3 gap-2.5 pt-1">
                    <Link
                      to="/dashboard/resources"
                      className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#F0EDE4] hover:border-emerald-400 hover:bg-emerald-50/50 flex flex-col items-center text-center gap-1.5 transition-all group shadow-2xs"
                    >
                      <BookOpen className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-black text-[#1E293B] leading-tight">
                        Explore Courses
                      </span>
                    </Link>

                    <Link
                      to="/dashboard/projects"
                      className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#F0EDE4] hover:border-emerald-400 hover:bg-emerald-50/50 flex flex-col items-center text-center gap-1.5 transition-all group shadow-2xs"
                    >
                      <FolderGit2 className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-black text-[#1E293B] leading-tight">
                        Find Projects
                      </span>
                    </Link>

                    <Link
                      to="/clarity-compass"
                      className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#F0EDE4] hover:border-emerald-400 hover:bg-emerald-50/50 flex flex-col items-center text-center gap-1.5 transition-all group shadow-2xs"
                    >
                      <Users className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-black text-[#1E293B] leading-tight">
                        Join Community
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* MILESTONE DETAIL DRAWER (Section 7) */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white shadow-2xl max-w-lg w-full p-6 animate-scaleUp space-y-4">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-stone-100">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                  {selectedMilestone.stage}
                </span>
                <h3 className="text-lg font-black text-stone-900">
                  {selectedMilestone.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMilestoneId(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase text-stone-400">Description</span>
              <p className="text-xs sm:text-sm text-stone-700 font-semibold bg-stone-50 p-3.5 rounded-2xl border border-stone-100 leading-relaxed">
                {selectedMilestone.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
                <span className="text-[10px] text-stone-400 block mb-0.5">Duration</span>
                <span className="text-stone-900">{selectedMilestone.estimatedDuration}</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
                <span className="text-[10px] text-stone-400 block mb-0.5">Target Horizon</span>
                <span className="text-stone-900">{selectedMilestone.targetDate}</span>
              </div>
            </div>

            {/* Linked Action Items */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-black uppercase text-stone-400 block">Linked Action Items</span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {milestoneTasks.length > 0 ? (
                  milestoneTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => toggleTask(t.id)}
                      className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 flex items-center justify-between text-xs cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={t.completed}
                          onChange={() => toggleTask(t.id)}
                          className="w-4 h-4 rounded text-emerald-600 cursor-pointer"
                        />
                        <span className={`font-bold ${t.completed ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                          {t.title}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-stone-400 italic">No specific sub-tasks linked yet.</p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  toggleMilestone(selectedMilestone.id);
                  setSelectedMilestoneId(null);
                }}
                className={`flex-1 py-2.5 rounded-full text-xs font-black transition-colors ${
                  selectedMilestone.completed
                    ? 'bg-stone-200 text-stone-800'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {selectedMilestone.completed ? 'Reopen Milestone' : 'Mark Milestone as Completed'}
              </button>

              <button
                onClick={() => setSelectedMilestoneId(null)}
                className="px-5 py-2.5 rounded-full border border-stone-200 hover:bg-stone-100 text-xs font-bold text-stone-600"
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
