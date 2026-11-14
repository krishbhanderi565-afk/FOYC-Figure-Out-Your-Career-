import React, { useState, useMemo } from 'react';
import { useCareer } from '../../context/CareerContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import {
  TrendingUp,
  ClipboardList,
  Flame,
  Award,
  Hourglass,
  MapPin,
  Calendar,
  ArrowRight,
  Check,
  CheckCircle2,
  Lock,
  Sparkles,
  Target,
  ExternalLink,
  ChevronRight,
  Layers,
  Compass,
} from 'lucide-react';
import { Link, useOutletContext, useNavigate } from 'react-router-dom';

interface DashboardOutletContext {
  onOpenMobileMenu: () => void;
}

export const OverviewPage: React.FC = () => {
  const {
    dashboardData,
    dashboardConfig,
    toggleTask,
    toggleHabit,
    userName,
    userEmail,
    userState,
    isDemoMode,
    enterDemoMode,
    exitDemoMode,
  } = useCareer();

  const outletCtx = useOutletContext<DashboardOutletContext | undefined>();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [careerChartRange, setCareerChartRange] = useState<'6W' | '3M' | '6M' | '1Y'>('6W');

  // Real calculations
  const tasks = dashboardData?.tasks || [];
  const milestones = dashboardData?.milestones || [];
  const habits = dashboardData?.habits || [];

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length || (isDemoMode ? 36 : 0);
  const taskDisplayCount = isDemoMode ? 24 : completedTasks;
  const taskTotalDisplay = isDemoMode ? 36 : totalTasks;

  const completedMilestones = milestones.filter((m) => m.completed).length;
  const totalMilestones = milestones.length || (isDemoMode ? 5 : 0);
  const roadmapPct = totalMilestones > 0
    ? Math.round((completedMilestones / totalMilestones) * 100)
    : (isDemoMode ? 68 : 0);

  const bestStreak = habits.length > 0
    ? Math.max(...habits.map((h) => h.currentStreak || 0), 0)
    : (isDemoMode ? 12 : 0);

  const habitConsistency = isDemoMode
    ? 82
    : habits.length > 0
    ? Math.round((habits.filter((h) => h.completedToday).length / habits.length) * 100)
    : 0;

  const displayName = userName || userEmail?.split('@')[0] || (isDemoMode ? 'Alex' : 'Explorer');
  const careerTitle = dashboardData?.direction?.primaryTitle || dashboardData?.primaryCareer?.title || (isDemoMode ? 'Product Designer' : 'Career Direction');
  const nextMilestoneTitle = milestones.find((m) => !m.completed)?.title || (isDemoMode ? 'Build your portfolio' : 'Define initial milestone');

  // Interactive chart data depending on range
  const chartPoints = useMemo(() => {
    switch (careerChartRange) {
      case '3M':
        return {
          labels: ['M1', 'M2', 'M3'],
          skills: [30, 60, 85],
          projects: [20, 50, 72],
          learning: [15, 40, 60],
        };
      case '6M':
        return {
          labels: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'],
          skills: [20, 35, 50, 65, 78, 88],
          projects: [15, 28, 42, 58, 68, 76],
          learning: [10, 25, 38, 50, 62, 70],
        };
      case '1Y':
        return {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          skills: [25, 50, 75, 92],
          projects: [20, 45, 68, 82],
          learning: [18, 38, 58, 75],
        };
      case '6W':
      default:
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
          skills: [35, 50, 62, 70, 78, 85],
          projects: [25, 38, 48, 58, 65, 72],
          learning: [18, 28, 35, 45, 52, 60],
        };
    }
  }, [careerChartRange]);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Header */}
      <DashboardHeader
        onOpenMobileMenu={outletCtx?.onOpenMobileMenu || (() => {})}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Demo Mode Notice Banner */}
      {isDemoMode && (
        <div className="mx-4 sm:mx-8 mb-4 px-4 py-2.5 rounded-2xl bg-stone-900 text-white flex items-center justify-between text-xs font-bold shadow-sm">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#22C55E] text-stone-950 font-black text-[10px]">
              DEMO MODE
            </span>
            <span className="text-stone-300">
              Exploring sample career data matching Reference Image 1 (Alex • Product Designer).
            </span>
          </div>
          <button
            onClick={exitDemoMode}
            className="text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
          >
            Exit Demo & Return to My Account →
          </button>
        </div>
      )}

      <main className="px-4 sm:px-8 pb-12 space-y-6 max-w-[1400px] w-full mx-auto">
        {/* =========================================================================
            STATE A: NEW USER ONBOARDING (Zero Dummy Data for real accounts)
            ========================================================================= */}
        {userState === 'new_user' && !isDemoMode && (
          <div className="rounded-3xl p-8 sm:p-12 border border-white/80 shadow-md backdrop-blur-xl bg-white/85 space-y-6 max-w-3xl mx-auto my-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center">
              <Compass className="w-6 h-6 text-emerald-700" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full">
                Welcome to FOYC
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                Welcome, {displayName}. Your journey begins here.
              </h2>
              <p className="text-stone-600 font-medium text-sm sm:text-base leading-relaxed">
                Your personalized career dashboard is ready to be configured around your unique strengths, goals, and daily momentum. Complete your Clarity Compass session or explore our interactive demo.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link to="/clarity-compass" className="w-full sm:w-auto">
                <button className="w-full px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-sm flex items-center justify-center gap-2 transition-all">
                  <Compass className="w-4 h-4 text-emerald-200" />
                  <span>Start Clarity Compass</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              <button
                onClick={enterDemoMode}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-stone-300 bg-white/80 hover:bg-white text-stone-800 font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all"
              >
                <Layers className="w-4 h-4 text-stone-500" />
                <span>Explore Demo Dashboard</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STATE B / C / DEMO: FULL REFERENCE DASHBOARD (Matches Reference 1)
            ========================================================================= */}
        {(userState === 'dashboard_generated' || isDemoMode || userState === 'exploration_completed') && (
          <>
            {/* 1. PERSONALIZED WELCOME / NEXT MILESTONE HERO CARD (Reference 1) */}
            <div className="rounded-3xl p-6 sm:p-8 border border-white/90 shadow-sm backdrop-blur-xl bg-white/85 relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                {/* Left: Greeting & Goal */}
                <div className="flex items-start gap-4 max-w-md">
                  {/* Sparkle badge */}
                  <div className="w-12 h-12 rounded-full bg-emerald-100/90 border border-emerald-300/60 flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="w-6 h-6 text-emerald-600" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight leading-snug">
                      Good morning, {displayName} 👋
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500 font-semibold">
                      Your next milestone awaits!
                    </p>
                    <div className="inline-flex items-center gap-1.5 pt-1 text-xs font-black text-emerald-800">
                      <Target className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Become a {careerTitle}</span>
                    </div>
                  </div>
                </div>

                {/* Center: Next Milestone with Progress Bar */}
                <div className="w-full lg:w-72 space-y-2">
                  <span className="text-[11px] font-bold text-stone-500 block uppercase tracking-wider">
                    Next Milestone
                  </span>
                  <Link
                    to="/dashboard/roadmap"
                    className="flex items-center justify-between gap-2 text-stone-900 hover:text-emerald-700 transition-colors group"
                  >
                    <span className="text-sm font-black truncate">{nextMilestoneTitle}</span>
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
                      <ArrowRight className="w-3 h-3 text-emerald-700" />
                    </div>
                  </Link>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-stone-200/80 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                        style={{ width: `${roadmapPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-black text-stone-700">{roadmapPct}%</span>
                  </div>
                </div>

                {/* Right: Rolling Green Hills Landscape Illustration (Reference 1) */}
                <div className="hidden lg:block w-72 h-28 relative shrink-0 overflow-hidden rounded-2xl pointer-events-none">
                  <svg viewBox="0 0 300 120" className="w-full h-full">
                    <defs>
                      <linearGradient id="hillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#86efac" />
                        <stop offset="100%" stopColor="#4ade80" />
                      </linearGradient>
                      <linearGradient id="hillGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4ade80" />
                        <stop offset="100%" stopColor="#22c55e" />
                      </linearGradient>
                      <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="100%" stopColor="#fef9c3" />
                      </linearGradient>
                    </defs>

                    {/* Background Hills */}
                    <path d="M0,120 Q80,40 180,70 T300,30 L300,120 Z" fill="url(#hillGrad1)" opacity="0.6" />
                    <path d="M0,120 Q120,60 220,50 T300,20 L300,120 Z" fill="url(#hillGrad2)" opacity="0.9" />

                    {/* Winding Yellow/Cream Pathway */}
                    <path
                      d="M20,120 Q100,90 140,80 T260,28"
                      fill="none"
                      stroke="url(#pathGrad)"
                      strokeWidth="9"
                      strokeLinecap="round"
                    />

                    {/* Pine trees along the path */}
                    <polygon points="90,75 85,90 95,90" fill="#15803d" />
                    <polygon points="170,60 165,75 175,75" fill="#166534" />
                    <polygon points="215,45 210,58 220,58" fill="#14532d" />
                    <polygon points="235,40 231,52 239,52" fill="#15803d" />

                    {/* Mountain Summit Flag */}
                    <line x1="260" y1="28" x2="260" y2="10" stroke="#14532d" strokeWidth="2" />
                    <polygon points="260,10 275,15 260,20" fill="#15803d" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 2. FOUR SUMMARY CARDS (Reference 1) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Roadmap Progress */}
              <div className="rounded-3xl p-5 border border-white/90 shadow-sm backdrop-blur-xl bg-white/85 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-stone-500">Roadmap Progress</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                      {roadmapPct}%
                    </span>
                    <span className="text-xs font-black text-emerald-700 flex items-center">
                      ▲ +12%
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-2xs">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  {/* Mini sparkline curve */}
                  <svg className="w-16 h-5 text-emerald-500" viewBox="0 0 60 20" fill="none">
                    <path
                      d="M2,16 Q20,14 30,8 T58,3"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Card 2: Tasks Completed */}
              <div className="rounded-3xl p-5 border border-white/90 shadow-sm backdrop-blur-xl bg-white/85 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-stone-500">Tasks Completed</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                      {taskDisplayCount} / {taskTotalDisplay}
                    </span>
                    <span className="text-xs font-black text-blue-700 flex items-center">
                      ▲ +3
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700 shadow-2xs">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <svg className="w-16 h-5 text-purple-400" viewBox="0 0 60 20" fill="none">
                    <path
                      d="M2,18 Q18,10 32,12 T58,4"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Card 3: Habit Consistency */}
              <div className="rounded-3xl p-5 border border-white/90 shadow-sm backdrop-blur-xl bg-white/85 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-stone-500">Habit Consistency</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                      {habitConsistency}%
                    </span>
                    <span className="text-xs font-black text-emerald-700 flex items-center">
                      ▲ +5%
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 shadow-2xs">
                    <Flame className="w-5 h-5" />
                  </div>
                  <svg className="w-16 h-5 text-blue-500" viewBox="0 0 60 20" fill="none">
                    <path
                      d="M2,15 Q15,16 30,10 T58,4"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Card 4: Current Streak */}
              <div className="rounded-3xl p-5 border border-white/90 shadow-sm backdrop-blur-xl bg-white/85 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-stone-500">Current Streak</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                      {bestStreak} days
                    </span>
                    <span className="text-xs font-black text-amber-700 flex items-center">
                      ▲ +2
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 shadow-2xs">
                    <Award className="w-5 h-5" />
                  </div>
                  <svg className="w-16 h-5 text-amber-500" viewBox="0 0 60 20" fill="none">
                    <path
                      d="M2,17 Q22,8 36,12 T58,3"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* 3. MIDDLE SECTION: CAREER PROGRESS & SKILL READINESS (Reference 1) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left (7 cols): Career Progress Line Chart */}
              <div className="lg:col-span-7 rounded-3xl p-6 sm:p-7 border border-white/90 shadow-sm backdrop-blur-xl bg-white/85 space-y-5 flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-black text-stone-900">Career Progress</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Range filters: 6W, 3M, 6M, 1Y */}
                    <div className="flex items-center bg-stone-100/80 p-1 rounded-xl border border-stone-200/60">
                      {(['6W', '3M', '6M', '1Y'] as const).map((r) => (
                        <button
                          key={r}
                          onClick={() => setCareerChartRange(r)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            careerChartRange === r
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-stone-600 hover:text-stone-900'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-end gap-4 text-xs font-bold text-stone-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Skills
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    Projects
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    Learning
                  </span>
                </div>

                {/* Interactive SVG Chart */}
                <div className="w-full h-56 relative pt-2">
                  <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="skillsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="projectsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="learningGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    {[0, 25, 50, 75, 100].map((val) => {
                      const y = 160 - (val / 100) * 140;
                      return (
                        <g key={val}>
                          <line x1="30" y1={y} x2="480" y2={y} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3 3" />
                          <text x="5" y={y + 4} fontSize="9" fontWeight="700" fill="#9CA3AF">{val}%</text>
                        </g>
                      );
                    })}

                    {/* Area under curves */}
                    <path
                      d="M40,110 Q120,90 200,75 T360,55 T460,35 L460,160 L40,160 Z"
                      fill="url(#skillsGrad)"
                    />
                    <path
                      d="M40,125 Q120,105 200,90 T360,70 T460,55 L460,160 L40,160 Z"
                      fill="url(#projectsGrad)"
                    />
                    <path
                      d="M40,135 Q120,120 200,105 T360,90 T460,75 L460,160 L40,160 Z"
                      fill="url(#learningGrad)"
                    />

                    {/* Curve 1: Skills (Emerald) */}
                    <path
                      d="M40,110 Q120,90 200,75 T360,55 T460,35"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Points */}
                    {[40, 120, 200, 280, 360, 460].map((cx, i) => {
                      const cy = [110, 95, 80, 68, 55, 35][i];
                      return <circle key={i} cx={cx} cy={cy} r="4" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />;
                    })}

                    {/* Curve 2: Projects (Blue) */}
                    <path
                      d="M40,125 Q120,105 200,90 T360,70 T460,55"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {[40, 120, 200, 280, 360, 460].map((cx, i) => {
                      const cy = [125, 110, 96, 82, 70, 55][i];
                      return <circle key={i} cx={cx} cy={cy} r="4" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />;
                    })}

                    {/* Curve 3: Learning (Purple) */}
                    <path
                      d="M40,135 Q120,120 200,105 T360,90 T460,75"
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {[40, 120, 200, 280, 360, 460].map((cx, i) => {
                      const cy = [135, 122, 110, 98, 90, 75][i];
                      return <circle key={i} cx={cx} cy={cy} r="4" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="2" />;
                    })}

                    {/* Endpoint badges (85%, 72%, 60%) */}
                    <g transform="translate(465, 27)">
                      <rect width="30" height="16" rx="4" fill="#10B981" />
                      <text x="15" y="11" fill="#fff" fontSize="9" fontWeight="900" textAnchor="middle">85%</text>
                    </g>
                    <g transform="translate(465, 47)">
                      <rect width="30" height="16" rx="4" fill="#3B82F6" />
                      <text x="15" y="11" fill="#fff" fontSize="9" fontWeight="900" textAnchor="middle">72%</text>
                    </g>
                    <g transform="translate(465, 67)">
                      <rect width="30" height="16" rx="4" fill="#8B5CF6" />
                      <text x="15" y="11" fill="#fff" fontSize="9" fontWeight="900" textAnchor="middle">60%</text>
                    </g>

                    {/* X-axis labels */}
                    {chartPoints.labels.map((lbl, idx) => {
                      const x = 40 + idx * (420 / (chartPoints.labels.length - 1));
                      return (
                        <text key={idx} x={x} y="176" fontSize="9" fontWeight="700" fill="#6B7280" textAnchor="middle">
                          {lbl}
                        </text>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Right (5 cols): Skill Readiness Donut Chart */}
              <div className="lg:col-span-5 rounded-3xl p-6 sm:p-7 border border-white/90 shadow-sm backdrop-blur-xl bg-white/85 space-y-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                      <Hourglass className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-black text-stone-900">Skill Readiness</h3>
                  </div>

                  <Link
                    to="/dashboard/skills"
                    className="text-xs font-bold text-stone-600 hover:text-emerald-700 flex items-center gap-1 group"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                {/* Donut Chart with Breakdown Legend (Reference 1) */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
                  {/* Donut graphic */}
                  <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                      {/* Segment 1: Design 35% */}
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="4"
                        strokeDasharray="31, 88"
                        strokeDashoffset="0"
                      />
                      {/* Segment 2: UX Research 25% */}
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="4"
                        strokeDasharray="22, 88"
                        strokeDashoffset="-31"
                      />
                      {/* Segment 3: Prototyping 25% */}
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#8B5CF6"
                        strokeWidth="4"
                        strokeDasharray="22, 88"
                        strokeDashoffset="-53"
                      />
                      {/* Segment 4: Portfolio 15% */}
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="4"
                        strokeDasharray="13, 88"
                        strokeDashoffset="-75"
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-stone-900 tracking-tight">72%</span>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Overall</span>
                    </div>
                  </div>

                  {/* Legend items */}
                  <div className="space-y-2.5 w-full max-w-[180px]">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-2 text-stone-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        Design
                      </span>
                      <span className="text-stone-900">35%</span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-2 text-stone-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        UX Research
                      </span>
                      <span className="text-stone-900">25%</span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-2 text-stone-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                        Prototyping
                      </span>
                      <span className="text-stone-900">25%</span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-2 text-stone-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        Portfolio
                      </span>
                      <span className="text-stone-900">15%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. BOTTOM SECTION: ROADMAP & THIS WEEK (Reference 1) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left (7 cols): Your Roadmap Horizontal Preview */}
              <div className="lg:col-span-7 rounded-3xl p-6 sm:p-7 border border-white/90 shadow-sm backdrop-blur-xl bg-white/85 space-y-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-black text-stone-900">Your Roadmap</h3>
                  </div>

                  <Link
                    to="/dashboard/roadmap"
                    className="text-xs font-bold text-stone-600 hover:text-emerald-700 flex items-center gap-1 group"
                  >
                    <span>View Full Roadmap</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                {/* 5 Milestone connected nodes (Reference 1) */}
                <div className="relative py-4">
                  {/* Connector line */}
                  <div className="absolute top-[28px] left-6 right-6 h-0.5 bg-stone-200 z-0">
                    <div className="h-full bg-emerald-500 w-[55%]" />
                  </div>

                  <div className="grid grid-cols-5 gap-2 relative z-10">
                    {[
                      { title: 'Foundation', status: 'Completed', state: 'done' },
                      { title: 'Skill Development', status: 'Completed', state: 'done' },
                      { title: 'Practical Application', status: 'In Progress', state: 'current' },
                      { title: 'Professional Readiness', status: 'Upcoming', state: 'upcoming' },
                      { title: 'Career Growth', status: 'Upcoming', state: 'upcoming' },
                    ].map((step, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center space-y-2">
                        {/* Node circle */}
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                            step.state === 'done'
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : step.state === 'current'
                              ? 'bg-white text-emerald-600 border-2 border-emerald-500 shadow-sm ring-4 ring-emerald-100'
                              : 'bg-stone-200 text-stone-400'
                          }`}
                        >
                          {step.state === 'done' ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : step.state === 'current' ? (
                            <div className="w-2 h-2 rounded-full bg-emerald-600" />
                          ) : (
                            <Lock className="w-3 h-3 text-stone-500" />
                          )}
                        </div>

                        {/* Title */}
                        <span className="text-[11px] font-black text-stone-800 leading-tight">
                          {step.title}
                        </span>

                        {/* Status pill */}
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                            step.state === 'done'
                              ? 'bg-emerald-100 text-emerald-800'
                              : step.state === 'current'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          {step.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right (5 cols): This Week Activity & Tasks */}
              <div className="lg:col-span-5 rounded-3xl p-6 sm:p-7 border border-white/90 shadow-sm backdrop-blur-xl bg-white/85 space-y-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-black text-stone-900">This Week</h3>
                  </div>

                  <Link
                    to="/dashboard/tasks"
                    className="text-xs font-bold text-stone-600 hover:text-emerald-700 flex items-center gap-1 group"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Left: 7 weekly bars */}
                  <div className="sm:col-span-5 flex items-end justify-between gap-1.5 h-28 px-1 pb-1 border-r border-stone-100 sm:pr-3">
                    {[
                      { day: 'Mon', h: 'h-14', active: true },
                      { day: 'Tue', h: 'h-20', active: true },
                      { day: 'Wed', h: 'h-24', active: true },
                      { day: 'Thu', h: 'h-16', active: true },
                      { day: 'Fri', h: 'h-22', active: true },
                      { day: 'Sat', h: 'h-10', active: true },
                      { day: 'Sun', h: 'h-6', active: false },
                    ].map((b, i) => (
                      <div key={i} className="flex flex-col items-center gap-1 flex-1">
                        <div
                          className={`w-full rounded-full transition-all ${
                            b.active ? 'bg-emerald-500' : 'bg-stone-200'
                          } ${b.h}`}
                        />
                        <span className="text-[9px] font-bold text-stone-400">{b.day}</span>
                      </div>
                    ))}
                  </div>

                  {/* Right: 3 actionable tasks */}
                  <div className="sm:col-span-7 space-y-2">
                    {[
                      { id: 't1', title: 'Complete UI/UX course', due: 'Due Today', pill: 'bg-emerald-100 text-emerald-800' },
                      { id: 't2', title: 'Build portfolio draft', due: 'Due Fri', pill: 'bg-blue-100 text-blue-800' },
                      { id: 't3', title: 'Join career community', due: 'Due Sun', pill: 'bg-purple-100 text-purple-800' },
                    ].map((task) => (
                      <div
                        key={task.id}
                        className="p-2.5 rounded-2xl bg-white/70 border border-stone-200/70 hover:border-emerald-300 flex items-center justify-between gap-2 shadow-2xs transition-colors cursor-pointer"
                        onClick={() => toggleTask(task.id)}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <input
                            type="checkbox"
                            checked={tasks.some((t) => t.id === task.id && t.completed)}
                            onChange={() => toggleTask(task.id)}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-400 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-stone-800 truncate">
                            {task.title}
                          </span>
                        </div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${task.pill}`}>
                          {task.due}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. BOTTOM FLOATING ACTION BAR (Reference 1) */}
            <div className="p-4 rounded-3xl border border-white/90 shadow-sm backdrop-blur-xl bg-white/85 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-stone-800">
                <span className="text-lg">💡</span>
                <span>Insight: Consistency is up 12% this week. Keep going!</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </div>

              <Link to="/dashboard/roadmap">
                <button className="px-6 py-2.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black flex items-center gap-2 shadow-xs transition-transform hover:scale-105 cursor-pointer">
                  <span>Continue Roadmap</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
