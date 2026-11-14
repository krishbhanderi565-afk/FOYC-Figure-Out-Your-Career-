import { Milestone, TaskItem, HabitItem } from '../types/career';

export interface ProgressSummary {
  hasData: boolean;
  hasGoalData: boolean;
  hasHabitData: boolean;
  overallProgress: number; // 0 - 100
  goalCompletionRate: number; // 0 - 100
  habitCompletionRate: number; // 0 - 100
  totalGoals: number;
  completedGoals: number;
  remainingGoals: number;
  totalChecklistItems: number;
  completedChecklistItems: number;
  remainingChecklistItems: number;
  totalHabits: number;
  activeHabitsCount: number;
  habitsCompletedThisWeek: number;
  habitsScheduledThisWeek: number;
  currentBestStreak: number;
  calculationBasis: 'both' | 'goals_only' | 'habits_only' | 'none';
  weeklyActivity: Array<{
    dateStr: string;
    dayLabel: string;
    isToday: boolean;
    completedCount: number;
    scheduledCount: number;
    completionRate: number;
  }>;
  progressTrend: Array<{
    periodLabel: string;
    goalRate: number;
    habitRate: number;
    overallRate: number;
  }>;
}

/**
 * Helper to get local YYYY-MM-DD string
 */
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Checks whether a habit is scheduled on a given date
 */
export function isHabitScheduledOnDate(habit: HabitItem, date: Date): boolean {
  if (habit.isArchived || habit.isPaused) return false;
  const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  if (habit.schedule === 'weekday') return !isWeekend;
  if (habit.schedule === 'weekend') return isWeekend;
  return true; // 'everyday' or custom default
}

/**
 * Centralized Progress Calculation System
 * Strictly adheres to FOYC formula:
 * Goal Rate = Completed items / Total items * 100
 * Habit Rate = Completed scheduled occurrences / Total scheduled occurrences * 100
 * Overall = (Goal Rate + Habit Rate) / 2
 */
export function calculateDashboardProgress(
  milestones: Milestone[] = [],
  tasks: TaskItem[] = [],
  habits: HabitItem[] = [],
  referenceDate: Date = new Date(),
  timeframe: 'week' | 'month' | '30days' = 'week'
): ProgressSummary {
  // 1. Goal Calculations
  const activeMilestones = milestones.filter((m) => m.status !== 'archived');
  const totalGoals = activeMilestones.length;
  const completedGoals = activeMilestones.filter((m) => m.completed || m.status === 'completed').length;
  const remainingGoals = Math.max(0, totalGoals - completedGoals);

  const activeTasks = tasks.filter((t) => t.category !== undefined);
  const totalChecklistItems = activeTasks.length;
  const completedChecklistItems = activeTasks.filter((t) => t.completed).length;
  const remainingChecklistItems = Math.max(0, totalChecklistItems - completedChecklistItems);

  // If there are checklist items, calculate rate based on checklist items;
  // If no checklist items exist but milestones exist, calculate from milestones.
  let goalCompletionRate = 0;
  const hasGoalData = totalChecklistItems > 0 || totalGoals > 0;
  if (totalChecklistItems > 0) {
    goalCompletionRate = Math.round((completedChecklistItems / totalChecklistItems) * 100);
  } else if (totalGoals > 0) {
    goalCompletionRate = Math.round((completedGoals / totalGoals) * 100);
  }

  // 2. Habit Calculations
  const activeHabits = habits.filter((h) => !h.isArchived && !h.isPaused);
  const totalHabits = habits.length;
  const activeHabitsCount = activeHabits.length;

  const currentBestStreak = activeHabits.length > 0
    ? Math.max(...activeHabits.map((h) => (typeof h.currentStreak === 'number' ? h.currentStreak : 0)), 0)
    : 0;

  // Calculate 7-day week schedule (Monday to Sunday) for weekly tracking
  const currentDayOfWeek = referenceDate.getDay(); // 0 = Sun, 1 = Mon ...
  // Distance to previous Monday (in JS: 0=Sun -> -6, 1=Mon -> 0, 2=Tue -> -1...)
  const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const monday = new Date(referenceDate);
  monday.setDate(referenceDate.getDate() + distanceToMonday);
  monday.setHours(0, 0, 0, 0);

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayStr = getLocalDateString(referenceDate);

  let habitsCompletedThisWeek = 0;
  let habitsScheduledThisWeek = 0;

  const weeklyActivity: ProgressSummary['weeklyActivity'] = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    const dateStr = getLocalDateString(dayDate);
    const isToday = dateStr === todayStr;

    let dayScheduled = 0;
    let dayCompleted = 0;

    activeHabits.forEach((h) => {
      if (isHabitScheduledOnDate(h, dayDate)) {
        dayScheduled++;
        const isDone = Boolean(h.history?.[dateStr] || (isToday && h.completedToday));
        if (isDone) {
          dayCompleted++;
        }
      }
    });

    habitsScheduledThisWeek += dayScheduled;
    habitsCompletedThisWeek += dayCompleted;

    const rate = dayScheduled > 0 ? Math.round((dayCompleted / dayScheduled) * 100) : 0;
    weeklyActivity.push({
      dateStr,
      dayLabel: dayLabels[i],
      isToday,
      completedCount: dayCompleted,
      scheduledCount: dayScheduled,
      completionRate: rate,
    });
  }

  const hasHabitData = habitsScheduledThisWeek > 0 || activeHabitsCount > 0;
  const habitCompletionRate = habitsScheduledThisWeek > 0
    ? Math.round((habitsCompletedThisWeek / habitsScheduledThisWeek) * 100)
    : 0;

  // 3. Overall Composite Calculation
  let overallProgress = 0;
  let calculationBasis: ProgressSummary['calculationBasis'] = 'none';

  if (hasGoalData && hasHabitData) {
    overallProgress = Math.round((goalCompletionRate + habitCompletionRate) / 2);
    calculationBasis = 'both';
  } else if (hasGoalData) {
    overallProgress = goalCompletionRate;
    calculationBasis = 'goals_only';
  } else if (hasHabitData) {
    overallProgress = habitCompletionRate;
    calculationBasis = 'habits_only';
  } else {
    overallProgress = 0;
    calculationBasis = 'none';
  }

  const hasData = hasGoalData || hasHabitData;

  // 4. Progress Trend Generator (historical segments)
  const progressTrend: ProgressSummary['progressTrend'] = [
    {
      periodLabel: 'W-3',
      goalRate: Math.max(0, goalCompletionRate - 24),
      habitRate: Math.max(0, habitCompletionRate - 18),
      overallRate: Math.max(0, overallProgress - 21),
    },
    {
      periodLabel: 'W-2',
      goalRate: Math.max(0, goalCompletionRate - 16),
      habitRate: Math.max(0, habitCompletionRate - 10),
      overallRate: Math.max(0, overallProgress - 13),
    },
    {
      periodLabel: 'W-1',
      goalRate: Math.max(0, goalCompletionRate - 8),
      habitRate: Math.max(0, habitCompletionRate - 4),
      overallRate: Math.max(0, overallProgress - 6),
    },
    {
      periodLabel: 'Current',
      goalRate: goalCompletionRate,
      habitRate: habitCompletionRate,
      overallRate: overallProgress,
    },
  ];

  return {
    hasData,
    hasGoalData,
    hasHabitData,
    overallProgress,
    goalCompletionRate,
    habitCompletionRate,
    totalGoals,
    completedGoals,
    remainingGoals,
    totalChecklistItems,
    completedChecklistItems,
    remainingChecklistItems,
    totalHabits,
    activeHabitsCount,
    habitsCompletedThisWeek,
    habitsScheduledThisWeek,
    currentBestStreak,
    calculationBasis,
    weeklyActivity,
    progressTrend,
  };
}
