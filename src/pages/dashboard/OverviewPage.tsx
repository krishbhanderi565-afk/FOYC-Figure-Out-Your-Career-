import React, { useState, useEffect, useMemo } from 'react';
import { useCareer } from '../../context/CareerContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { DashboardConfigReview } from '../../components/dashboard/DashboardConfigReview';
import {
  Flame,
  CheckCircle2,
  Calendar,
  ArrowRight,
  TrendingUp,
  Target,
  ListTodo,
  ExternalLink,
  Plus,
  BookOpen,
  Award,
  Clock,
  Sparkles,
  Milestone as MilestoneIcon,
  Play,
  Pause,
  RotateCcw,
  ArrowUpRight,
  Check,
  Compass,
  SlidersHorizontal,
  ChevronRight,
  Layers,
  CheckSquare,
} from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';

interface DashboardOutletContext {
  onOpenMobileMenu: () => void;
}

export const OverviewPage: React.FC = () => {
  const {
    dashboardData,
    dashboardConfig,
    updateDashboardConfig,
    toggleTask,
    addTask,
    toggleHabit,
    userName,
    userEmail,
    userState,
    isDemoMode,
    enterDemoMode,
    exitDemoMode,
  } = useCareer();

  const outletCtx = useOutletContext<DashboardOutletContext | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // Focus Timer State (Donezo reference: 01:24:08)
  const [timerSeconds, setTimerSeconds] = useState(25 * 60); // 25 min default
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [focusLabel, setFocusLabel] = useState('Deep Work Sprint');

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Metrics
  const tasks = dashboardData?.tasks || [];
  const milestones = dashboardData?.milestones || [];
  const habits = dashboardData?.habits || [];

  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length || 0;
  const pendingTasksCount = tasks.filter((t) => !t.completed).length;
  const taskProgressPercent = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  const completedMilestones = milestones.filter((m) => m.completed).length;
  const totalMilestones = milestones.length || 0;
  const runningMilestones = milestones.filter((m) => !m.completed).length;
  const milestoneProgress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  const bestStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.currentStreak || 0), 0) : 0;
  const activeHabitsCount = habits.filter((h) => h.completedToday).length;

  const selectedModules = dashboardConfig?.selected_modules || [
    'personal_vision',
    'career_roadmap',
    'daily_priorities',
    'habit_tracker',
    'focus_timer',
  ];

  // Search filter
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    return tasks.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [tasks, searchQuery]);

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    addTask({
      title: newTaskInput.trim(),
      category: 'Foundation',
      priority: 'high',
      completed: false,
      dueDate: 'This week',
    });
    setNewTaskInput('');
    setShowAddTaskModal(false);
  };

  const displayName = userName || userEmail?.split('@')[0] || 'Explorer';

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#FDFBF7]">
      {/* HEADER */}
      <DashboardHeader
        onOpenMobileMenu={outletCtx?.onOpenMobileMenu || (() => {})}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* DEMO MODE BANNER */}
      {isDemoMode && (
        <div className="bg-[#171717] text-white px-4 py-2.5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-black px-2 py-0.5 rounded bg-[#FFE76B] text-[#171717]">DEMO MODE</span>
            <span className="text-stone-300 font-medium hidden sm:inline">
              Exploring sample career data (Alex • Full-Stack Engineer). Your personal account is unaffected.
            </span>
          </div>
          <button
            onClick={exitDemoMode}
            className="text-xs font-black text-[#FFE76B] hover:underline cursor-pointer"
          >
            Exit Demo & Return to My Account →
          </button>
        </div>
      )}

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* =========================================================================
            STATE A: NEW USER (No Dummy Alex Data, Welcoming Onboarding)
            ========================================================================= */}
        {userState === 'new_user' && (
          <div className="space-y-8 animate-fadeIn py-6">
            <div className="bg-white rounded-3xl border-2 border-stone-900 p-8 sm:p-12 shadow-[6px_6px_0px_#171717] relative overflow-hidden">
              <div className="max-w-2xl space-y-4">
                <Badge variant="parrot" size="sm">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-[#315B28]" />
                  Welcome to Your Career Space
                </Badge>
                <h2 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-tight">
                  Welcome to FOYC, {displayName}.
                </h2>
                <p className="text-base sm:text-lg text-stone-700 font-semibold leading-relaxed">
                  Your personalized career operating system is ready to be synthesized. Rather than giving you a generic template, FOYC calibrates around your exact stage, ambitions, strengths, and life situation.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                  <Link to="/clarity-compass">
                    <Button
                      variant="dark"
                      size="lg"
                      className="w-full sm:w-auto gap-3 text-base font-black shadow-[4px_4px_0px_#FFE76B] bg-stone-900 text-white"
                    >
                      <Compass className="w-5 h-5 text-[#FFE76B]" />
                      <span>Start My Clarity Journey</span>
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>

                  <button
                    onClick={enterDemoMode}
                    className="px-6 py-3.5 rounded-xl border-2 border-stone-900 bg-[#FFFDF8] hover:bg-stone-100 text-stone-900 font-black text-sm transition-all shadow-[2px_2px_0px_#171717] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-stone-600" />
                    <span>Explore Demo Dashboard</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Feature preview cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border-2 border-stone-900 p-6 shadow-[3px_3px_0px_#171717] space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#EDF2E9] border border-[#A8B99A] flex items-center justify-center font-black text-sm text-[#526B50]">
                  01
                </div>
                <h3 className="text-base font-black text-stone-900">Clarity Compass</h3>
                <p className="text-xs text-stone-600 font-semibold leading-relaxed">
                  Evaluate uncertainty across direction, skills, and market fit with structured guided reflection.
                </p>
              </div>

              <div className="bg-white rounded-2xl border-2 border-stone-900 p-6 shadow-[3px_3px_0px_#171717] space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#FFF9D2] border border-[#FFE76B] flex items-center justify-center font-black text-sm text-stone-900">
                  02
                </div>
                <h3 className="text-base font-black text-stone-900">Possibility Explorer</h3>
                <p className="text-xs text-stone-600 font-semibold leading-relaxed">
                  Uncover diversified career trajectories across established fields, emerging niches, and side projects.
                </p>
              </div>

              <div className="bg-white rounded-2xl border-2 border-stone-900 p-6 shadow-[3px_3px_0px_#171717] space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] flex items-center justify-center font-black text-sm text-purple-900">
                  03
                </div>
                <h3 className="text-base font-black text-stone-900">Adaptive Dashboard</h3>
                <p className="text-xs text-stone-600 font-semibold leading-relaxed">
                  Generate milestone roadmaps, daily task checklist, habit loops, and deep work sprint timers.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STATE B: EXPLORATION COMPLETED (Prompt/Reflection ready for Dashboard)
            ========================================================================= */}
        {userState === 'exploration_completed' && (
          <div className="bg-white rounded-3xl border-2 border-stone-900 p-8 sm:p-12 shadow-[6px_6px_0px_#171717] space-y-6">
            <div className="max-w-2xl space-y-3">
              <Badge variant="parrot" size="sm">
                <Check className="w-3.5 h-3.5 mr-1" />
                Discovery Report Calibrated
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                Your Career Blueprint is Ready to Generate
              </h2>
              <p className="text-sm sm:text-base text-stone-700 font-semibold leading-relaxed">
                You've completed your reflection and discovery inputs. Have your 1-on-1 discussion with ChatGPT or import your completed FOYC block to generate your adaptive dashboard.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/prompt-ready">
                <Button variant="dark" size="lg" className="gap-2.5 font-black text-sm shadow-[3px_3px_0px_#FFE76B]">
                  <Compass className="w-4 h-4 text-[#FFE76B]" />
                  <span>View Discovery Prompt</span>
                </Button>
              </Link>
              <Link to="/import">
                <Button variant="secondary" size="lg" className="gap-2 font-black text-sm shadow-[3px_3px_0px_#171717]">
                  <Sparkles className="w-4 h-4" />
                  <span>Import Completed Handoff</span>
                </Button>
              </Link>
              <button
                onClick={enterDemoMode}
                className="px-5 py-3 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs"
              >
                Preview with Demo Data
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STATE C: DASHBOARD GENERATED (Donezo-Inspired Modular Dashboard)
            ========================================================================= */}
        {userState === 'dashboard_generated' && (
          <>
            {/* Top Title & Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  {dashboardConfig?.dashboard_title || 'Dashboard'}
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 font-semibold">
                  {dashboardConfig?.primary_purpose || 'Plan, prioritize, and accomplish your milestones with ease.'}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowAddTaskModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
                <button
                  onClick={() => setShowConfigModal(true)}
                  className="px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 hover:border-stone-900 text-stone-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Manage Modules</span>
                </button>
              </div>
            </div>

            {/* DONEZO ROW OF 4 STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Primary Dark Theme Card (Donezo Signature) */}
              <div
                className="rounded-2xl p-5 text-white flex flex-col justify-between shadow-sm relative overflow-hidden"
                style={{ backgroundColor: 'var(--foyc-theme-sidebar-active-bg, #171717)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold opacity-85">Total Milestones</span>
                  <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                    <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <div className="my-4">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight block">
                    {totalMilestones}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/20 text-white">
                    {milestoneProgress}% overall completed
                  </span>
                </div>
              </div>

              {/* Card 2: Completed Milestones */}
              <div className="rounded-2xl p-5 bg-white border border-stone-200 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-500">Ended Milestones</span>
                  <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center">
                    <ArrowUpRight className="w-3.5 h-3.5 text-stone-600" />
                  </div>
                </div>
                <div className="my-4">
                  <span className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight block">
                    {completedMilestones}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-stone-500">
                    {runningMilestones} remaining in trajectory
                  </span>
                </div>
              </div>

              {/* Card 3: Active Tasks */}
              <div className="rounded-2xl p-5 bg-white border border-stone-200 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-500">Running Tasks</span>
                  <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center">
                    <ArrowUpRight className="w-3.5 h-3.5 text-stone-600" />
                  </div>
                </div>
                <div className="my-4">
                  <span className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight block">
                    {pendingTasksCount}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-stone-500">
                    {completedTasksCount} finished this sprint
                  </span>
                </div>
              </div>

              {/* Card 4: Daily Habit Streak */}
              <div className="rounded-2xl p-5 bg-white border border-stone-200 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-500">Consistency Streak</span>
                  <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                </div>
                <div className="my-4">
                  <span className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight block">
                    {bestStreak} <span className="text-base font-bold text-stone-400">days</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-stone-500">
                    {activeHabitsCount}/{habits.length} habits done today
                  </span>
                </div>
              </div>
            </div>

            {/* DONEZO MAIN GRID (2 Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT / MAIN COLUMN (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Consistency Analytics & Reminders (Split in 2 sub-columns) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Weekly Consistency Bar Chart Widget */}
                  <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs flex flex-col justify-between">
                    <span className="text-xs font-black text-stone-900 block mb-4">
                      Weekly Momentum
                    </span>
                    <div className="flex items-end justify-between gap-2 h-28 pt-2 px-1">
                      {[
                        { day: 'S', h: 'h-12', active: false },
                        { day: 'M', h: 'h-24', active: true },
                        { day: 'T', h: 'h-20', active: true },
                        { day: 'W', h: 'h-26', active: true },
                        { day: 'T', h: 'h-14', active: false },
                        { day: 'F', h: 'h-10', active: false },
                        { day: 'S', h: 'h-8', active: false },
                      ].map((bar, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                          <div
                            className={`w-full rounded-full transition-all ${
                              bar.active
                                ? 'bg-stone-900'
                                : 'bg-stone-200'
                            } ${bar.h}`}
                          />
                          <span className="text-[10px] font-bold text-stone-400">{bar.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reminders / Current Focus Card */}
                  <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-black text-stone-900 block mb-1">Current Focus</span>
                      <p className="text-sm font-bold text-stone-800 line-clamp-2 mt-1">
                        {dashboardData?.direction?.primaryTitle || dashboardData?.primaryCareer?.title || 'Personal Direction'}
                      </p>
                      <p className="text-xs text-stone-500 font-medium line-clamp-2 mt-1">
                        {dashboardData?.direction?.summary || dashboardData?.primaryCareer?.overview || 'Daily execution towards defined milestones.'}
                      </p>
                    </div>

                    <Link to="/dashboard/roadmap" className="mt-4">
                      <button className="w-full py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer">
                        <Target className="w-3.5 h-3.5 text-[#FFE76B]" />
                        <span>Open Roadmap</span>
                      </button>
                    </Link>
                  </div>
                </div>

                {/* 2. Active Tasks List Widget */}
                {selectedModules.includes('daily_priorities') && (
                  <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
                      <div>
                        <h3 className="text-sm font-black text-stone-900">Active Tasks</h3>
                        <span className="text-xs text-stone-400 font-medium">
                          {pendingTasksCount} tasks remaining
                        </span>
                      </div>
                      <Link
                        to="/dashboard/tasks"
                        className="text-xs font-bold text-stone-700 hover:text-stone-900 flex items-center gap-1"
                      >
                        <span>View all</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="space-y-2">
                      {filteredTasks.slice(0, 5).map((task) => (
                        <div
                          key={task.id}
                          onClick={() => toggleTask(task.id)}
                          className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                            task.completed
                              ? 'bg-stone-50 border-stone-200 text-stone-400'
                              : 'bg-white border-stone-200 hover:border-stone-400 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                                task.completed
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'border-stone-300 bg-white'
                              }`}
                            >
                              {task.completed && <Check className="w-3 h-3" />}
                            </div>
                            <span
                              className={`text-xs font-bold truncate ${
                                task.completed ? 'line-through text-stone-400' : 'text-stone-900'
                              }`}
                            >
                              {task.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                              {task.category || 'Sprint'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT / SIDE COLUMN (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                {/* 1. Project Progress Donut Widget (Donezo Style) */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs">
                  <span className="text-xs font-black text-stone-900 block mb-4">Milestone Trajectory</span>
                  <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
                    {/* Progress percentage callout */}
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-stone-100"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-stone-900 transition-all duration-500"
                          strokeDasharray={`${milestoneProgress}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-stone-900">{milestoneProgress}%</span>
                        <span className="text-[9px] font-bold text-stone-400">Completed</span>
                      </div>
                    </div>

                    {/* Progress Legend */}
                    <div className="space-y-2.5 text-xs font-bold text-stone-600">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-stone-900" />
                        <span>Completed: {completedMilestones}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
                        <span>In Progress: {runningMilestones}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-stone-200" />
                        <span>Total Milestones: {totalMilestones}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Deep Work Focus Timer Widget (Donezo Signature: 01:24:08) */}
                {selectedModules.includes('focus_timer') && (
                  <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-stone-950 via-stone-900 to-[#121c11] text-white border border-stone-800 shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black text-stone-300 uppercase tracking-wider">
                        Time Tracker
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-800 text-stone-300">
                        {focusLabel}
                      </span>
                    </div>

                    <div className="text-center py-3">
                      <span className="font-mono text-3xl sm:text-4xl font-black tracking-wider block text-white">
                        {formatTimer(timerSeconds)}
                      </span>
                      <span className="text-[11px] text-stone-400 font-semibold block mt-1">
                        {isTimerRunning ? 'Sprint in progress...' : 'Sprint paused'}
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-3">
                      <button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className="w-10 h-10 rounded-full bg-white text-stone-900 hover:bg-stone-200 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                        title={isTimerRunning ? 'Pause' : 'Start'}
                      >
                        {isTimerRunning ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current translate-x-0.5" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setIsTimerRunning(false);
                          setTimerSeconds(25 * 60);
                        }}
                        className="w-10 h-10 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
                        title="Reset Timer"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Daily Habit Tracker Widget */}
                {selectedModules.includes('habit_tracker') && (
                  <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
                      <div>
                        <h3 className="text-sm font-black text-stone-900">Habit Loops</h3>
                        <span className="text-xs text-stone-400 font-medium">
                          {activeHabitsCount}/{habits.length} marked today
                        </span>
                      </div>
                      <Link
                        to="/dashboard/habits"
                        className="text-xs font-bold text-stone-700 hover:text-stone-900 flex items-center gap-1"
                      >
                        <span>Tracker</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="space-y-2.5">
                      {habits.slice(0, 4).map((h) => (
                        <div
                          key={h.id}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-stone-100 bg-stone-50/50"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="text-xs font-bold text-stone-900 truncate block">
                              {h.title}
                            </span>
                            <span className="text-[10px] text-stone-500 font-medium flex items-center gap-1 mt-0.5">
                              <Flame className="w-3 h-3 text-amber-500" />
                              {h.currentStreak || 0}d streak
                            </span>
                          </div>

                          <button
                            onClick={() => toggleHabit(h.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                              h.completedToday
                                ? 'bg-stone-900 text-white'
                                : 'bg-white border border-stone-300 text-stone-700 hover:border-stone-900'
                            }`}
                          >
                            {h.completedToday ? 'Done' : 'Mark'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* QUICK ADD TASK MODAL */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-stone-900 shadow-2xl max-w-md w-full p-6 animate-scaleUp space-y-4">
            <h3 className="text-base font-black text-stone-900">Add New Sprint Task</h3>
            <form onSubmit={handleAddNewTask} className="space-y-4">
              <input
                type="text"
                autoFocus
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                placeholder="What is your immediate next action?"
                className="w-full px-4 py-2.5 text-xs font-bold rounded-xl border border-stone-300 focus:outline-none focus:border-stone-900 text-stone-900"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold shadow-sm"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANAGE MODULES MODAL */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border-2 border-stone-900 shadow-2xl max-w-4xl w-full p-6 my-8 animate-scaleUp">
            <DashboardConfigReview
              initialConfig={dashboardConfig}
              onConfirm={(updated) => {
                updateDashboardConfig(updated);
                setShowConfigModal(false);
              }}
              onBack={() => setShowConfigModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
