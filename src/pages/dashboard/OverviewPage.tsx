import React, { useState, useMemo } from 'react';
import { useCareer } from '../../context/CareerContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import {
  TrendingUp,
  ClipboardList,
  Flame,
  Award,
  Sparkles,
  Target,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Circle,
  MoreVertical,
  Layers,
  Compass,
  Lightbulb,
  Check,
  CalendarCheck,
  FolderKanban,
  BookOpen,
  Route,
  User,
  Zap,
} from 'lucide-react';
import { Link, useOutletContext, useNavigate } from 'react-router-dom';
import { PERSONA_PRESETS } from '../../data/personaPresets';

interface DashboardOutletContext {
  onOpenMobileMenu: () => void;
}

export const OverviewPage: React.FC = () => {
  const {
    dashboardData,
    dashboardConfig,
    toggleTask,
    toggleHabit,
    toggleMilestone,
    userName,
    userEmail,
    userState,
    isDemoMode,
    enterDemoMode,
    exitDemoMode,
    currentTheme,
    setTheme,
  } = useCareer();

  const outletCtx = useOutletContext<DashboardOutletContext | undefined>();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [focusTimeframe, setFocusTimeframe] = useState<'month' | 'quarter' | 'all'>('month');
  const [selectedDonutSegment, setSelectedDonutSegment] = useState<number | null>(null);
  const [activePersonaId, setActivePersonaId] = useState<string>('student');

  // Real calculations from authenticated user or active preset
  const activePreset = isDemoMode ? PERSONA_PRESETS[activePersonaId] || PERSONA_PRESETS.student : null;
  const currentData = activePreset ? activePreset.data : dashboardData;
  const currentConfig = activePreset ? activePreset.config : dashboardConfig;

  const tasks = currentData?.tasks || [];
  const milestones = currentData?.milestones || [];
  const habits = currentData?.habits || [];
  const projects = currentData?.projects || [];

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length || (isDemoMode ? 36 : 0);
  const taskDisplayCount = isDemoMode && completedTasks === 0 ? 24 : completedTasks;
  const taskTotalDisplay = isDemoMode && totalTasks === 0 ? 36 : totalTasks;

  const completedMilestones = milestones.filter((m) => m.completed).length;
  const totalMilestones = milestones.length || (isDemoMode ? 4 : 0);
  const roadmapPct = totalMilestones > 0
    ? Math.round((completedMilestones / totalMilestones) * 100)
    : (isDemoMode ? 68 : 0);

  const bestStreak = habits.length > 0
    ? Math.max(...habits.map((h) => h.currentStreak || 0), 0)
    : (isDemoMode ? 14 : 0);

  const habitConsistency = isDemoMode
    ? 82
    : habits.length > 0
    ? Math.round((habits.filter((h) => h.completedToday).length / habits.length) * 100)
    : 0;

  const displayName = isDemoMode
    ? activePreset?.name?.split(' ')[0] || 'Alex'
    : userName || userEmail?.split('@')[0] || 'Explorer';

  const careerTitle =
    currentData?.direction?.primaryTitle ||
    currentData?.primaryCareer?.title ||
    (isDemoMode ? activePreset?.role || 'Product Designer' : 'Personal Vision');

  const nextMilestone = milestones.find((m) => !m.completed) || milestones[0] || {
    id: 'm-default',
    title: 'Define initial direction & milestones',
    targetDate: 'Month 1',
    stage: 'Foundation',
  };

  // Adaptive Focus Categories & Donut Breakdown (Matches FinTrack Donut Chart)
  const focusCategories = useMemo(() => {
    const archetype = currentConfig?.dashboard_type || 'student';
    if (archetype === 'homemaker') {
      return [
        { name: 'Family & Home Ops', pct: 35, count: '12 tasks', color: '#8B5CF6' },
        { name: 'Creative Writing', pct: 28, count: '8 hrs', color: '#EC4899' },
        { name: 'Mindful Wellbeing', pct: 22, count: '7 days', color: '#10B981' },
        { name: 'Financial Planning', pct: 15, count: '4 goals', color: '#F59E0B' },
      ];
    }
    if (archetype === 'entrepreneur') {
      return [
        { name: 'Product Architecture', pct: 40, count: '18 PRs', color: '#F97316' },
        { name: 'Customer Discovery', pct: 25, count: '14 calls', color: '#3B82F6' },
        { name: 'Enterprise Compliance', pct: 20, count: '6 docs', color: '#10B981' },
        { name: 'Growth & Outreach', pct: 15, count: '30 leads', color: '#8B5CF6' },
      ];
    }
    if (archetype === 'working_professional') {
      return [
        { name: 'Leadership & Strategy', pct: 35, count: '10 sessions', color: '#3B82F6' },
        { name: 'Platform Reliability', pct: 30, count: '14 tasks', color: '#10B981' },
        { name: 'Mentorship & Hiring', pct: 20, count: '5 1-on-1s', color: '#8B5CF6' },
        { name: 'Executive Alignment', pct: 15, count: '3 reviews', color: '#F59E0B' },
      ];
    }
    // Default Student / Tech / Designer
    return [
      { name: 'UI & Product Design', pct: 35, count: '14 tasks', color: '#6366F1' },
      { name: 'User Research & Tests', pct: 25, count: '8 sessions', color: '#10B981' },
      { name: 'Design Tokens & System', pct: 25, count: '9 modules', color: '#F59E0B' },
      { name: 'Portfolio Showcase', pct: 15, count: '5 artifacts', color: '#EC4899' },
    ];
  }, [currentConfig?.dashboard_type]);

  // SVG Donut Path Calculator
  const donutSegments = useMemo(() => {
    let cumulativeAngle = 0;
    const radius = 58;
    const center = 75;
    return focusCategories.map((cat, idx) => {
      const angle = (cat.pct / 100) * 360;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;
      cumulativeAngle += angle;

      const startRad = ((startAngle - 90) * Math.PI) / 180;
      const endRad = ((endAngle - 90) * Math.PI) / 180;

      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);

      const largeArcFlag = angle > 180 ? 1 : 0;
      const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;

      return {
        ...cat,
        pathData,
        index: idx,
      };
    });
  }, [focusCategories]);

  // Recent Activity Items (Matches FinTrack Recent Transactions)
  const recentActivities = useMemo(() => {
    const archetype = currentConfig?.dashboard_type || 'student';
    if (archetype === 'homemaker') {
      return [
        {
          id: 'act-1',
          title: 'Morning 20m Meditation & Tea',
          category: 'Wellbeing Routine',
          time: 'Today • 7:30 AM',
          badge: '+ Streak 18',
          iconBg: 'bg-emerald-100 text-emerald-700',
          emoji: '🍵',
        },
        {
          id: 'act-2',
          title: 'Completed Memoir Chapter 2 Draft',
          category: 'Creative Writing',
          time: 'Yesterday',
          badge: '500 Words',
          iconBg: 'bg-purple-100 text-purple-700',
          emoji: '📖',
        },
        {
          id: 'act-3',
          title: 'Automated 14-Day Family Meal Plan',
          category: 'Household Ops',
          time: '18 May',
          badge: 'Organized',
          iconBg: 'bg-amber-100 text-amber-700',
          emoji: '🥗',
        },
      ];
    }
    if (archetype === 'entrepreneur') {
      return [
        {
          id: 'act-1',
          title: 'Shipped Automated Audit PDF Parser',
          category: 'Product Sprint',
          time: 'Today • 2:15 PM',
          badge: 'Deploys Live',
          iconBg: 'bg-orange-100 text-orange-700',
          emoji: '⚡',
        },
        {
          id: 'act-2',
          title: 'Completed Security Director Demo',
          category: 'Customer Discovery',
          time: 'Yesterday',
          badge: '+1 Pilot Lead',
          iconBg: 'bg-blue-100 text-blue-700',
          emoji: '💼',
        },
        {
          id: 'act-3',
          title: 'Daily 2-Hour Deep Architecture Block',
          category: 'Focus Session',
          time: '18 May',
          badge: 'Streak 24',
          iconBg: 'bg-emerald-100 text-emerald-700',
          emoji: '🎯',
        },
      ];
    }
    // Default Student / Professional
    return [
      {
        id: 'act-1',
        title: 'Finalize mobile fintech wireframe user flows',
        category: 'UI/UX Design',
        time: 'Today',
        badge: 'Completed',
        iconBg: 'bg-indigo-100 text-indigo-700',
        emoji: '📱',
      },
      {
        id: 'act-2',
        title: 'Milestone: Foundations Reached',
        category: 'Career Roadmap',
        time: 'Yesterday',
        badge: 'Verified',
        iconBg: 'bg-emerald-100 text-emerald-700',
        emoji: '🚩',
      },
      {
        id: 'act-3',
        title: 'Daily 45m Figma Component Practice',
        category: 'Habit Tracker',
        time: '18 May',
        badge: 'Streak 14',
        iconBg: 'bg-amber-100 text-amber-700',
        emoji: '🔥',
      },
      {
        id: 'act-4',
        title: 'Refined Case Study Problem Statement',
        category: 'Portfolio',
        time: '16 May',
        badge: 'Published',
        iconBg: 'bg-rose-100 text-rose-700',
        emoji: '✨',
      },
    ];
  }, [currentConfig?.dashboard_type]);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Header */}
      <DashboardHeader
        onOpenMobileMenu={outletCtx?.onOpenMobileMenu || (() => {})}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Demo Mode & Archetype Switcher Bar */}
      {isDemoMode && (
        <div className="mx-4 sm:mx-8 mb-5 p-4 rounded-3xl bg-white border border-[#EBE8DF] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-black text-[10px] tracking-wider uppercase">
              Persona Preview
            </span>
            <div className="text-xs">
              <span className="font-black text-[#1E293B]">
                {activePreset?.name} • {activePreset?.role}
              </span>
              <p className="text-[11px] text-[#64748B] font-medium hidden sm:block">
                {activePreset?.bio}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {Object.keys(PERSONA_PRESETS).map((key) => {
              const p = PERSONA_PRESETS[key];
              const isActive = activePersonaId === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setActivePersonaId(key);
                    setTheme(p.theme);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#1E293B] text-white shadow-xs'
                      : 'bg-[#F8F6F0] text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  {p.name.split(' ')[0]} ({p.archetype})
                </button>
              );
            })}
            <button
              type="button"
              onClick={exitDemoMode}
              className="text-xs font-bold text-emerald-700 hover:underline shrink-0 ml-2 cursor-pointer"
            >
              Exit Demo
            </button>
          </div>
        </div>
      )}

      <main className="px-4 sm:px-8 pb-16 space-y-6 max-w-[1440px] w-full mx-auto">
        {/* =========================================================================
            STATE A: NEW USER ONBOARDING (Zero Dummy Data for real accounts)
            ========================================================================= */}
        {userState === 'new_user' && !isDemoMode && (
          <div className="rounded-3xl p-8 sm:p-14 border border-[#EBE8DF] shadow-[0_4px_24px_rgba(0,0,0,0.04)] bg-white space-y-6 max-w-3xl mx-auto my-10">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
              <Compass className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Personalized Career Workspace
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1E293B] tracking-tight">
                Your personalized workspace is waiting.
              </h2>
              <p className="text-[#64748B] font-medium text-sm sm:text-base leading-relaxed">
                Start with your FOYC conversation and turn your direction into an actionable plan. We tailor your dashboard modules, milestones, and habit trackers specifically to who you are.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link to="/clarity-compass" className="w-full sm:w-auto">
                <button className="w-full px-7 py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-black text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer">
                  <Compass className="w-4 h-4 text-emerald-100" />
                  <span>Create My Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              <button
                type="button"
                onClick={enterDemoMode}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl border border-[#E2E8F0] bg-white hover:bg-[#F8F6F0] text-[#1E293B] font-bold text-sm shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[#64748B]" />
                <span>Explore Demo Dashboard</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STATE B / C / DEMO: FINTRACK-INSPIRED FOYC DASHBOARD
            ========================================================================= */}
        {(userState === 'dashboard_generated' || isDemoMode || userState === 'exploration_completed') && (
          <>
            {/* 1. GREETING HEADING & SUBTITLE (FinTrack Reference) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#1E293B] tracking-tight flex items-center gap-2">
                  <span>Good morning, {displayName}!</span>
                  <span className="text-2xl">👋</span>
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B] font-medium mt-1">
                  Here's what's happening with your {currentConfig?.dashboard_type === 'homemaker' ? 'personal growth' : currentConfig?.dashboard_type === 'entrepreneur' ? 'product venture' : 'career roadmap'} today.
                </p>
              </div>

              {/* Next Milestone Quick Callout */}
              <div className="hidden md:flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-[#EFECE6] shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Next Focus</span>
                  <span className="font-bold text-[#1E293B] truncate max-w-[200px] block">
                    {nextMilestone.title}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. FOUR COMPACT SUMMARY CARDS (Exact FinTrack Reference Style with 3D tactile icons) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Primary Direction (FinTrack Wallet style) */}
              <div className="rounded-2xl p-5 bg-white border border-[#EFECE6] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all flex items-start justify-between relative group">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                    {currentConfig?.dashboard_type === 'homemaker' ? 'Primary Vision' : 'Direction'}
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight truncate max-w-[170px]" title={careerTitle}>
                    {careerTitle}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 pt-1">
                    <span className="text-emerald-500">↑</span>
                    <span>94% Alignment</span>
                  </div>
                </div>

                {/* 3D Tactile Icon (Purple Wallet Style) */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 shadow-md shadow-indigo-200 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
              </div>

              {/* Card 2: Roadmap Milestones (FinTrack Green Bag style) */}
              <div className="rounded-2xl p-5 bg-white border border-[#EFECE6] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all flex items-start justify-between relative group">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                    Roadmap Milestones
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight">
                    {roadmapPct}%
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 pt-1">
                    <span className="text-emerald-500">↑</span>
                    <span>{completedMilestones} of {totalMilestones} done</span>
                  </div>
                </div>

                {/* 3D Tactile Icon (Green Bag Style) */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 shadow-md shadow-emerald-200 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                  <Route className="w-6 h-6" />
                </div>
              </div>

              {/* Card 3: Priority Tasks (FinTrack Pink Bag style) */}
              <div className="rounded-2xl p-5 bg-white border border-[#EFECE6] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all flex items-start justify-between relative group">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                    Tasks Completed
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight">
                    {taskDisplayCount} / {taskTotalDisplay}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 pt-1">
                    <span className="text-emerald-500">↑</span>
                    <span>3 this week</span>
                  </div>
                </div>

                {/* 3D Tactile Icon (Rose/Pink Bag Style) */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 shadow-md shadow-rose-200 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                  <ClipboardList className="w-6 h-6" />
                </div>
              </div>

              {/* Card 4: Habit Consistency (FinTrack Gold Coins style) */}
              <div className="rounded-2xl p-5 bg-white border border-[#EFECE6] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all flex items-start justify-between relative group">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                    Habit Streak
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight">
                    {bestStreak} Days
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 pt-1">
                    <span>🔥</span>
                    <span>{habitConsistency}% consistency</span>
                  </div>
                </div>

                {/* 3D Tactile Icon (Amber Gold Coins Style) */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 shadow-md shadow-amber-200 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                  <Flame className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* 3. TWO-COLUMN MAIN CONTENT (Exact FinTrack Composition) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT COLUMN: Focus & Skill Allocation (FinTrack Donut Chart Style) */}
              <div className="lg:col-span-5 rounded-3xl p-6 bg-white border border-[#EFECE6] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-black text-[#1E293B]">Focus Overview</h3>
                    <select
                      value={focusTimeframe}
                      onChange={(e) => setFocusTimeframe(e.target.value as any)}
                      className="text-xs font-bold text-[#64748B] bg-[#F8F6F0] border border-[#E2E8F0] rounded-xl px-2.5 py-1.5 cursor-pointer outline-none hover:text-[#1E293B]"
                    >
                      <option value="month">This Month ▾</option>
                      <option value="quarter">This Quarter</option>
                      <option value="all">All Time</option>
                    </select>
                  </div>

                  {/* Donut Chart & Legend Composition */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
                    {/* SVG Donut */}
                    <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
                      <svg viewBox="0 0 150 150" className="w-full h-full transform -rotate-90">
                        {donutSegments.map((seg) => (
                          <circle
                            key={seg.name}
                            cx="75"
                            cy="75"
                            r="54"
                            fill="transparent"
                            stroke={seg.color}
                            strokeWidth="22"
                            strokeDasharray={`${(seg.pct / 100) * 339.29} 339.29`}
                            strokeDashoffset={-((donutSegments.slice(0, seg.index).reduce((acc, curr) => acc + curr.pct, 0) / 100) * 339.29)}
                            className="transition-all duration-500 cursor-pointer hover:opacity-85"
                            onClick={() => setSelectedDonutSegment(seg.index === selectedDonutSegment ? null : seg.index)}
                          />
                        ))}
                      </svg>
                      {/* Center Label */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                        <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                          Overall
                        </span>
                        <span className="text-2xl font-black text-[#1E293B] leading-none my-0.5">
                          {selectedDonutSegment !== null ? `${focusCategories[selectedDonutSegment]?.pct}%` : '78%'}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600">
                          {selectedDonutSegment !== null ? focusCategories[selectedDonutSegment]?.name : 'Readiness'}
                        </span>
                      </div>
                    </div>

                    {/* Category Legend Breakdown */}
                    <div className="space-y-3 flex-1 w-full">
                      {focusCategories.map((cat, idx) => (
                        <div
                          key={cat.name}
                          onClick={() => setSelectedDonutSegment(idx === selectedDonutSegment ? null : idx)}
                          className={`flex items-center justify-between text-xs p-1.5 rounded-xl transition-all cursor-pointer ${
                            selectedDonutSegment === idx ? 'bg-[#F8F6F0] font-black' : 'hover:bg-black/5 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: cat.color }}
                            />
                            <span className="text-[#1E293B] truncate">{cat.name}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[#64748B] text-[11px]">{cat.count}</span>
                            <span className="font-bold text-[#1E293B]">{cat.pct}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#F1EFE9] flex items-center justify-between text-xs text-[#64748B]">
                  <span>Total Effort Tracked</span>
                  <span className="font-black text-[#1E293B]">142.5 hrs</span>
                </div>
              </div>

              {/* RIGHT COLUMN: Recent Activity + Friendly Desk Character & Smart Tip */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-6">
                {/* Recent Activity List (FinTrack Recent Transactions Style) */}
                <div className="rounded-3xl p-6 bg-white border border-[#EFECE6] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-black text-[#1E293B]">Recent Activity</h3>
                    <Link
                      to="/dashboard/tasks"
                      className="text-xs font-bold text-[#64748B] hover:text-[#1E293B] flex items-center gap-1"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {recentActivities.map((act) => (
                      <div
                        key={act.id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF9F5] border border-[#F0EDE4] hover:bg-white hover:shadow-xs transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0 ${act.iconBg} shadow-2xs`}>
                            {act.emoji}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#1E293B]">{act.title}</h4>
                            <p className="text-[11px] text-[#64748B] font-medium">{act.category} • {act.time}</p>
                          </div>
                        </div>

                        <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                          {act.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desk Workspace Vignette & Smart Tip (Matching FinTrack Character & Tip) */}
                <div className="rounded-3xl p-5 bg-gradient-to-r from-[#FAF8F2] to-[#F5F1E6] border border-[#EFECE6] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
                  {/* Left: Smart Tip Card */}
                  <div className="flex-1 space-y-1 z-10">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-[11px] font-black uppercase tracking-wider">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                      <span>Smart Insight</span>
                    </div>
                    <h4 className="text-sm font-black text-[#1E293B] pt-1">
                      Consistency is up 15% this week!
                    </h4>
                    <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                      Maintaining small daily routines creates compounding momentum toward your long-term goal. Keep building forward!
                    </p>
                  </div>

                  {/* Right: Friendly 3D Desk Workspace Illustration (FinTrack character scene) */}
                  <div className="w-48 h-28 relative shrink-0 overflow-hidden rounded-2xl flex items-center justify-center bg-white/70 border border-white/80 shadow-2xs">
                    <svg viewBox="0 0 200 120" className="w-full h-full">
                      {/* Ambient Desk background */}
                      <rect x="0" y="0" width="200" height="120" fill="#fdfbf7" />

                      {/* Desk surface */}
                      <path d="M10,85 L190,85 L180,105 L20,105 Z" fill="#e8dfd1" />
                      <rect x="15" y="105" width="10" height="15" fill="#cfc2af" />
                      <rect x="175" y="105" width="10" height="15" fill="#cfc2af" />

                      {/* Cute Potted Plant */}
                      <path d="M30,85 L35,68 L45,68 L50,85 Z" fill="#d97706" />
                      <circle cx="40" cy="58" r="8" fill="#10b981" />
                      <circle cx="34" cy="62" r="6" fill="#059669" />
                      <circle cx="46" cy="62" r="6" fill="#34d399" />

                      {/* Laptop with screen */}
                      <rect x="80" y="52" width="46" height="32" rx="3" fill="#334155" />
                      <rect x="83" y="55" width="40" height="26" rx="2" fill="#38bdf8" />
                      <path d="M72,84 L134,84 L130,87 L76,87 Z" fill="#94a3b8" />

                      {/* Coffee Mug with steam */}
                      <rect x="145" y="70" width="12" height="15" rx="2" fill="#8b5cf6" />
                      <path d="M157,74 Q162,77 157,81" fill="none" stroke="#8b5cf6" strokeWidth="2" />
                      <path d="M149,66 Q151,62 149,58" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />

                      {/* Floating achievement sparkles */}
                      <circle cx="103" cy="30" r="3" fill="#fbbf24" />
                      <circle cx="120" cy="38" r="2" fill="#f43f5e" />
                      <circle cx="65" cy="40" r="2.5" fill="#10b981" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. GOALS PROGRESS SECTION (Exact FinTrack Reference Style) */}
            <div className="rounded-3xl p-6 bg-white border border-[#EFECE6] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-black text-[#1E293B]">Goals Progress</h3>
                <Link
                  to="/dashboard/roadmap"
                  className="text-xs font-bold text-[#64748B] hover:text-[#1E293B] flex items-center gap-1"
                >
                  <span>View All Goals</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {milestones.slice(0, 2).map((m, idx) => {
                  const pct = m.completed ? 100 : idx === 0 ? 60 : 45;
                  const icon = idx === 0 ? '🌴' : '💻';
                  return (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#F0EDE4] flex items-center gap-4 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8E5DC] flex items-center justify-center text-xl shrink-0 shadow-2xs">
                        {icon}
                      </div>

                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-black text-[#1E293B] truncate">{m.title}</h4>
                          <span className="text-xs font-bold text-[#64748B]">{pct}%</span>
                        </div>

                        <div className="w-full h-2 rounded-full bg-[#EBE8DF] overflow-hidden">
                          <div
                            className="h-full bg-[#10B981] rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[#64748B] font-medium">
                          <span>Target: {m.targetDate || 'This Quarter'}</span>
                          <span className="text-emerald-700 font-bold">{m.stage}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
