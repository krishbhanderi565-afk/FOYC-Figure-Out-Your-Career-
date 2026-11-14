import React, { useState } from 'react';
import {
  Sparkles,
  Target,
  ClipboardCheck,
  Flame,
  TrendingUp,
  Calendar,
  Layers,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { ProgressSummary } from '../../utils/progressCalculator';

interface MyProgressSectionProps {
  summary: ProgressSummary;
  displayName: string;
  careerTitle?: string;
  onNavigateToGoals?: () => void;
  onNavigateToHabits?: () => void;
}

export const MyProgressSection: React.FC<MyProgressSectionProps> = ({
  summary,
  displayName,
  careerTitle,
  onNavigateToGoals,
  onNavigateToHabits,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | '30days'>('week');
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | null>(null);

  // Time-of-day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // SVG Donut calculation
  // Radius = 68, Circumference = 2 * PI * 68 ≈ 427.26
  const radius = 68;
  const circumference = 2 * Math.PI * radius;

  // Real Segments: Goal Completed, Goal Remaining, Habit Completed, Habit Remaining
  const goalCompletedWeight = Math.max(summary.completedChecklistItems, summary.completedGoals);
  const goalRemainingWeight = Math.max(summary.remainingChecklistItems, summary.remainingGoals);
  const habitCompletedWeight = summary.habitsCompletedThisWeek;
  const habitRemainingWeight = Math.max(0, summary.habitsScheduledThisWeek - summary.habitsCompletedThisWeek);

  const totalWeights = goalCompletedWeight + goalRemainingWeight + habitCompletedWeight + habitRemainingWeight;

  const segments = totalWeights > 0
    ? [
        {
          label: 'Completed Goals & Tasks',
          count: goalCompletedWeight,
          color: '#10B981', // Emerald
          pct: Math.round((goalCompletedWeight / totalWeights) * 100),
          ratio: goalCompletedWeight / totalWeights,
        },
        {
          label: 'Remaining Goals & Tasks',
          count: goalRemainingWeight,
          color: '#F59E0B', // Amber
          pct: Math.round((goalRemainingWeight / totalWeights) * 100),
          ratio: goalRemainingWeight / totalWeights,
        },
        {
          label: 'Completed Habit Occurrences',
          count: habitCompletedWeight,
          color: '#8B5CF6', // Purple
          pct: Math.round((habitCompletedWeight / totalWeights) * 100),
          ratio: habitCompletedWeight / totalWeights,
        },
        {
          label: 'Remaining Habit Occurrences',
          count: habitRemainingWeight,
          color: '#E2E8F0', // Neutral Slate
          pct: Math.round((habitRemainingWeight / totalWeights) * 100),
          ratio: habitRemainingWeight / totalWeights,
        },
      ]
    : [
        {
          label: 'No Activity Yet',
          count: 0,
          color: '#E2E8F0',
          pct: 100,
          ratio: 1,
        },
      ];

  // Cumulative offset calculations for SVG dasharray
  let cumulativeRatio = 0;
  const donutSlices = segments.map((seg, idx) => {
    const strokeDasharray = `${seg.ratio * circumference} ${circumference}`;
    const strokeDashoffset = -cumulativeRatio * circumference;
    cumulativeRatio += seg.ratio;
    return {
      ...seg,
      strokeDasharray,
      strokeDashoffset,
      index: idx,
    };
  });

  return (
    <section className="space-y-6" aria-label="My Progress Section">
      {/* 1. Personalized Greeting Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
            <span>{greeting}, {displayName}!</span>
            <span className="inline-block animate-wiggle">👋</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 mt-1 font-medium">
            Here's how you're progressing toward your goals.
            {careerTitle && (
              <span className="hidden md:inline ml-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                {careerTitle}
              </span>
            )}
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl border border-neutral-200/70 self-start sm:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSelectedTimeframe('week')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedTimeframe === 'week'
                ? 'bg-white text-neutral-900 shadow-sm font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            This Week
          </button>
          <button
            type="button"
            onClick={() => setSelectedTimeframe('month')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedTimeframe === 'month'
                ? 'bg-white text-neutral-900 shadow-sm font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            This Month
          </button>
          <button
            type="button"
            onClick={() => setSelectedTimeframe('30days')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedTimeframe === '30days'
                ? 'bg-white text-neutral-900 shadow-sm font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* 2. Four Compact Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Overall Progress */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-[0_4px_18px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Overall Progress
            </span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-neutral-900">
              {summary.hasData ? `${summary.overallProgress}%` : '0%'}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              {summary.calculationBasis === 'both' ? 'Active' : summary.calculationBasis === 'goals_only' ? 'Goals' : 'Habits'}
            </span>
          </div>
          <div className="mt-3 w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-700"
              style={{ width: `${summary.overallProgress}%` }}
            />
          </div>
        </div>

        {/* Card 2: Goals Completed */}
        <div
          onClick={onNavigateToGoals}
          className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-[0_4px_18px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Goals Completed
            </span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-neutral-900">
              {summary.totalGoals > 0 ? `${summary.completedGoals} / ${summary.totalGoals}` : '0 / 0'}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              {summary.goalCompletionRate}% done
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-2 font-medium">
            {summary.remainingChecklistItems} checklist items remaining
          </p>
        </div>

        {/* Card 3: Habits Completed This Week */}
        <div
          onClick={onNavigateToHabits}
          className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-[0_4px_18px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Habits This Week
            </span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <ClipboardCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-neutral-900">
              {summary.habitsCompletedThisWeek} / {summary.habitsScheduledThisWeek}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              {summary.habitCompletionRate}% consistency
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-2 font-medium">
            {summary.activeHabitsCount} active habits scheduled
          </p>
        </div>

        {/* Card 4: Current Habit Streak */}
        <div
          onClick={onNavigateToHabits}
          className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-[0_4px_18px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Current Streak
            </span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-neutral-900">
              {summary.currentBestStreak} {summary.currentBestStreak === 1 ? 'Day' : 'Days'}
            </span>
            <span className="text-xs font-semibold text-orange-600">
              🔥 In Flow
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-2 font-medium">
            Keep momentum alive today
          </p>
        </div>
      </div>

      {/* 3. Deep Progress Visualizations Grid: Donut + Weekly Activity + Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Donut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-[0_4px_18px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-neutral-900">Progress Breakdown</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Calculated from verified goals & habit logs</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-600">
                {summary.calculationBasis === 'both' ? 'Composite' : summary.calculationBasis === 'goals_only' ? 'Goals Focus' : 'Habit Focus'}
              </span>
            </div>

            {/* Donut graphic */}
            <div className="relative flex items-center justify-center my-6">
              <svg width="190" height="190" viewBox="0 0 190 190" className="transform -rotate-90">
                <circle
                  cx="95"
                  cy="95"
                  r={radius}
                  fill="transparent"
                  stroke="#F3F4F6"
                  strokeWidth="20"
                />
                {donutSlices.map((slice) => (
                  <circle
                    key={slice.label}
                    cx="95"
                    cy="95"
                    r={radius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={activeSegmentIndex === slice.index ? 24 : 20}
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setActiveSegmentIndex(slice.index)}
                    onMouseLeave={() => setActiveSegmentIndex(null)}
                  />
                ))}
              </svg>

              {/* Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-3xl font-extrabold text-neutral-900">
                  {summary.hasData ? `${summary.overallProgress}%` : '0%'}
                </span>
                <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider mt-0.5">
                  Overall
                </span>
              </div>
            </div>

            {/* Metric Breakdown Legend */}
            <div className="space-y-2.5 pt-2">
              {segments.map((seg, idx) => (
                <div
                  key={seg.label}
                  onMouseEnter={() => setActiveSegmentIndex(idx)}
                  onMouseLeave={() => setActiveSegmentIndex(null)}
                  className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer text-xs ${
                    activeSegmentIndex === idx ? 'bg-neutral-100' : 'hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span className="font-semibold text-neutral-700">{seg.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500 font-medium">{seg.count} items</span>
                    <span className="font-bold text-neutral-900 w-10 text-right">{seg.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>Formula: (Goal Rate + Habit Rate) / 2</span>
            <span className="text-emerald-700 font-semibold">100% Real User Data</span>
          </div>
        </div>

        {/* Right Column: Weekly Activity Graph & Goal Distribution (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Weekly Habit Activity Bar Chart */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-[0_4px_18px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-neutral-900">Weekly Habit Consistency</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Completions across the current week</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                {summary.habitsCompletedThisWeek} / {summary.habitsScheduledThisWeek} Done
              </span>
            </div>

            {/* 7-Day Bar Chart */}
            <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2">
              {summary.weeklyActivity.map((day) => {
                const heightPct = Math.max(day.completionRate, day.completedCount > 0 ? 15 : 6);
                return (
                  <div key={day.dateStr} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full flex items-end justify-center h-32">
                      {/* Tooltip on hover */}
                      <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-[10px] font-bold py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10 shadow-lg">
                        {day.completedCount} / {day.scheduledCount} completed ({day.completionRate}%)
                      </div>

                      {/* Bar Background Track */}
                      <div className="w-full max-w-[36px] bg-neutral-100 rounded-xl h-full flex items-end overflow-hidden p-1">
                        <div
                          className={`w-full rounded-lg transition-all duration-500 ${
                            day.isToday
                              ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                              : day.completedCount > 0
                              ? 'bg-neutral-800'
                              : 'bg-neutral-200'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                    </div>

                    <span
                      className={`text-xs font-semibold ${
                        day.isToday ? 'text-emerald-600 font-extrabold' : 'text-neutral-500'
                      }`}
                    >
                      {day.dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Goal Completion Comparison Progress Card */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-[0_4px_18px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-bold text-neutral-900">Goal Checklist Execution</h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {summary.completedChecklistItems} of {summary.totalChecklistItems} actionable items completed
                </p>
              </div>
              <span className="text-sm font-extrabold text-neutral-900">
                {summary.goalCompletionRate}%
              </span>
            </div>

            {/* Split Progress Track */}
            <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all duration-700"
                style={{ width: `${summary.goalCompletionRate}%` }}
                title={`Completed: ${summary.completedChecklistItems}`}
              />
              <div
                className="bg-amber-400/80 h-full transition-all duration-700"
                style={{ width: `${100 - summary.goalCompletionRate}%` }}
                title={`Remaining: ${summary.remainingChecklistItems}`}
              />
            </div>

            <div className="flex items-center justify-between mt-3 text-xs text-neutral-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Completed: {summary.completedChecklistItems}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                Remaining: {summary.remainingChecklistItems}
              </span>
              <span className="font-semibold text-neutral-700">
                {summary.completedGoals} / {summary.totalGoals} Main Goals Finished
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
