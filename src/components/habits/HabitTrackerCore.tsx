import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCareer } from '../../context/CareerContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import {
  CalendarCheck,
  Flame,
  Check,
  Plus,
  Trash2,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Target,
  BarChart3,
  TrendingUp,
  PieChart,
  BookOpen,
  CalendarDays,
  X,
  Zap,
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export interface HabitModel {
  id: string;
  name: string;
  type: 'binary' | 'quantity' | 'time' | 'score';
  target?: number | null;
  unit?: string | null;
  color: string;
  schedule: 'everyday' | 'weekday' | 'weekend';
}

export interface GoalModel {
  id: string;
  name: string;
  description?: string;
  targetDate?: string;
  linkedHabits: string[];
}

function localDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const TODAY = localDateStr(new Date());
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS = [1, 2, 3, 4, 5];
const WEEKENDS = [0, 6];

const COLOR_PALETTE = [
  '#526B50', // Deep muted green
  '#A8B99A', // Muted sage
  '#333333', // Charcoal
  '#3b82f6', // Blue
  '#d97706', // Amber
  '#7c3aed', // Violet
  '#ea580c', // Orange
  '#0d9488', // Teal
];

export interface HabitTrackerCoreProps {
  mode?: 'dashboard' | 'standalone';
  onOpenMobileMenu?: () => void;
}

export const HabitTrackerCore: React.FC<HabitTrackerCoreProps> = ({
  mode = 'standalone',
  onOpenMobileMenu,
}) => {
  const { dashboardData, addHabit, updateHabit, deleteHabit, toggleHabit, isAuthenticated } = useCareer();

  // Storage state derived directly from CareerContext for 100% sync
  const habits: HabitModel[] = useMemo(() => {
    if (!dashboardData.habits || dashboardData.habits.length === 0) {
      return [];
    }
    return dashboardData.habits.map((h, i) => ({
      id: h.id,
      name: h.title,
      type: (h.target ? 'time' : 'binary') as any,
      target: h.target ?? null,
      unit: h.unit ?? null,
      color: h.color || COLOR_PALETTE[i % COLOR_PALETTE.length],
      schedule: h.schedule || (h.frequency === 'weekly' ? 'weekend' : 'everyday'),
    }));
  }, [dashboardData.habits]);

  const logs: Record<string, Record<string, any>> = useMemo(() => {
    const res: Record<string, Record<string, any>> = {};
    if (dashboardData.habits) {
      dashboardData.habits.forEach((h) => {
        if (h.history) {
          Object.entries(h.history).forEach(([dateStr, completed]) => {
            if (!res[dateStr]) res[dateStr] = {};
            res[dateStr][h.id] = completed ? (h.target || true) : false;
          });
        }
      });
    }
    return res;
  }, [dashboardData.habits]);

  const [goals, setGoals] = useState<GoalModel[]>(() => {
    try {
      const saved = localStorage.getItem('foyc_habit_goals_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'g-1',
        name: 'Deploy Capstone Portfolio Project',
        description: 'Complete core CRUD architecture and publish documentation.',
        targetDate: '2026-12-31',
        linkedHabits: ['h-1', 'h-4'],
      },
      {
        id: 'g-2',
        name: 'Technical Interview Readiness',
        description: 'Master core system design fundamentals and active coding.',
        targetDate: '2027-02-28',
        linkedHabits: ['h-2', 'h-3'],
      },
    ];
  });

  const [reflections, setReflections] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('foyc_reflections_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      [TODAY]: 'Made solid progress today on the data pipeline. Tomorrow, focus on unit tests.',
    };
  });

  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [activeFilter, setActiveFilter] = useState<'all' | 'weekday' | 'weekend' | 'everyday'>('all');
  const [activeHabitId, setActiveHabitId] = useState<string | null>(null);
  const [chartTab, setChartTab] = useState<'trend' | 'monthly'>('trend');
  const [autoSaveShow, setAutoSaveShow] = useState(false);

  // Modals state
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [habitFormName, setHabitFormName] = useState('');
  const [habitFormType, setHabitFormType] = useState<'binary' | 'quantity' | 'time' | 'score'>('binary');
  const [habitFormTarget, setHabitFormTarget] = useState<number | ''>('');
  const [habitFormUnit, setHabitFormUnit] = useState('');
  const [habitFormSched, setHabitFormSched] = useState<'everyday' | 'weekday' | 'weekend'>('everyday');
  const [habitFormColor, setHabitFormColor] = useState(COLOR_PALETTE[0]);

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalFormName, setGoalFormName] = useState('');
  const [goalFormDesc, setGoalFormDesc] = useState('');
  const [goalFormDate, setGoalFormDate] = useState('');
  const [goalFormLinked, setGoalFormLinked] = useState<string[]>([]);

  const [showLogTodayModal, setShowLogTodayModal] = useState(false);

  // Heatmap tooltip state
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    date: string;
    items: { name: string; color: string; done: boolean }[];
    reflection?: string;
  } | null>(null);

  // Auto-save triggers
  const triggerAutoSave = () => {
    setAutoSaveShow(true);
    setTimeout(() => setAutoSaveShow(false), 2000);
  };

  useEffect(() => {
    localStorage.setItem('foyc_habits_v2', JSON.stringify(habits));
    triggerAutoSave();
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('foyc_habit_logs_v2', JSON.stringify(logs));
    triggerAutoSave();
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('foyc_habit_goals_v2', JSON.stringify(goals));
    triggerAutoSave();
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('foyc_reflections_v2', JSON.stringify(reflections));
    triggerAutoSave();
  }, [reflections]);

  // Schedule logic
  const isHabitActiveOn = (habit: HabitModel, dateStr: string) => {
    const sched = habit.schedule || 'everyday';
    if (sched === 'everyday') return true;
    const dow = new Date(dateStr + 'T00:00:00').getDay();
    if (sched === 'weekday') return WEEKDAYS.includes(dow);
    if (sched === 'weekend') return WEEKENDS.includes(dow);
    return true;
  };

  const isDone = (habit: HabitModel, val: any) => {
    if (val === undefined || val === null) return false;
    switch (habit.type) {
      case 'binary':
        return val === true || val === 1 || val === 'yes';
      case 'quantity':
      case 'time':
        return parseFloat(val) >= (habit.target || 1);
      case 'score':
        return parseInt(val, 10) >= 5;
      default:
        return false;
    }
  };

  // Streak calculations
  const calculateStreak = (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let check = new Date(today);

    for (let i = 0; i < 365; i++) {
      const dateStr = localDateStr(check);
      if (!isHabitActiveOn(habit, dateStr)) {
        check.setDate(check.getDate() - 1);
        continue;
      }
      const done = isDone(habit, (logs[dateStr] || {})[habitId]);
      if (done) {
        streak++;
        check.setDate(check.getDate() - 1);
      } else if (i === 0 && dateStr === TODAY) {
        check.setDate(check.getDate() - 1);
        continue;
      } else {
        break;
      }
    }
    return streak;
  };

  // KPIs
  const overallStreak = useMemo(() => {
    if (!habits.length) return 0;
    return Math.max(...habits.map((h) => calculateStreak(h.id)), 0);
  }, [habits, logs]);

  const todayPct = useMemo(() => {
    const active = habits.filter((h) => isHabitActiveOn(h, TODAY));
    if (!active.length) return 0;
    const todayLog = logs[TODAY] || {};
    const done = active.filter((h) => isDone(h, todayLog[h.id])).length;
    return Math.round((done / active.length) * 100);
  }, [habits, logs]);

  const weeklyPct = useMemo(() => {
    if (!habits.length) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dow = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));

    let total = 0;
    let done = 0;
    for (let i = 0; i <= 6; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      if (d > today) break;
      const dateStr = localDateStr(d);
      habits.forEach((h) => {
        if (!isHabitActiveOn(h, dateStr)) return;
        total++;
        if (isDone(h, (logs[dateStr] || {})[h.id])) done++;
      });
    }
    return total ? Math.round((done / total) * 100) : 0;
  }, [habits, logs]);

  const monthlyPct = useMemo(() => {
    if (!habits.length) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yr = today.getFullYear();
    const mo = today.getMonth();
    let total = 0;
    let done = 0;
    const daysInMo = new Date(yr, mo + 1, 0).getDate();
    for (let d = 1; d <= daysInMo; d++) {
      const day = new Date(yr, mo, d);
      if (day > today) break;
      const dateStr = localDateStr(day);
      habits.forEach((h) => {
        if (!isHabitActiveOn(h, dateStr)) return;
        total++;
        if (isDone(h, (logs[dateStr] || {})[h.id])) done++;
      });
    }
    return total ? Math.round((done / total) * 100) : 0;
  }, [habits, logs]);

  // Week dates for grid
  const weekDates = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dow = today.getDay();
    const mon = new Date(today);
    mon.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(mon);
      d.setDate(mon.getDate() + i);
      return localDateStr(d);
    });
  }, []);

  // Checkbox toggle handler
  const handleToggleCheckbox = async (date: string, habitId: string) => {
    await toggleHabit(habitId, date);
    triggerAutoSave();
  };

  // Add Habit
  const handleOpenAddHabit = (defaultSched?: 'weekday' | 'weekend') => {
    setEditingHabitId(null);
    setHabitFormName('');
    setHabitFormType('binary');
    setHabitFormTarget('');
    setHabitFormUnit('');
    setHabitFormSched(defaultSched || 'everyday');
    setHabitFormColor(COLOR_PALETTE[0]);
    setShowHabitModal(true);
  };

  const handleOpenEditHabit = (h: HabitModel) => {
    setEditingHabitId(h.id);
    setHabitFormName(h.name);
    setHabitFormType(h.type);
    setHabitFormTarget(h.target ?? '');
    setHabitFormUnit(h.unit ?? '');
    setHabitFormSched(h.schedule || 'everyday');
    setHabitFormColor(h.color);
    setShowHabitModal(true);
  };

  const handleSaveHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitFormName.trim()) return;

    if (editingHabitId) {
      await updateHabit(editingHabitId, {
        title: habitFormName.trim(),
        schedule: habitFormSched,
        unit: habitFormUnit.trim() || null,
        target: habitFormTarget ? Number(habitFormTarget) : null,
        color: habitFormColor,
        frequency: habitFormSched === 'weekend' ? 'weekly' : 'daily',
      });
    } else {
      await addHabit({
        title: habitFormName.trim(),
        frequency: habitFormSched === 'weekend' ? 'weekly' : 'daily',
        schedule: habitFormSched,
        unit: habitFormUnit.trim() || null,
        target: habitFormTarget ? Number(habitFormTarget) : null,
        color: habitFormColor,
      });
    }
    setShowHabitModal(false);
    triggerAutoSave();
  };

  const handleDeleteHabit = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this routine? All associated history will be removed.')) {
      await deleteHabit(id);
      if (activeHabitId === id) setActiveHabitId(null);
      triggerAutoSave();
    }
  };

  // Add Goal
  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalFormName.trim()) return;
    const newG: GoalModel = {
      id: `g-${Date.now()}`,
      name: goalFormName.trim(),
      description: goalFormDesc.trim(),
      targetDate: goalFormDate || undefined,
      linkedHabits: goalFormLinked,
    };
    setGoals((prev) => [...prev, newG]);
    setShowGoalModal(false);
    setGoalFormName('');
    setGoalFormDesc('');
    setGoalFormDate('');
    setGoalFormLinked([]);
  };

  const handleDeleteGoal = (id: string) => {
    if (window.confirm('Delete this goal?')) {
      setGoals((prev) => prev.filter((g) => g.id !== id));
    }
  };

  // Goal alignment calculation
  const calculateGoalAlignment = (g: GoalModel): number => {
    if (!g.linkedHabits.length) return 0;
    const scores: number[] = g.linkedHabits.map((hid) => {
      const h = habits.find((hab) => hab.id === hid);
      if (!h) return 0;
      return calculateStreak(hid) > 0 ? 100 : 40;
    });
    return Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length);
  };

  // Heatmap data generator
  const heatmapWeeks = useMemo(() => {
    const start = new Date(year, 0, 1);
    const startDow = (start.getDay() + 6) % 7; // Monday = 0
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const daysInYear = isLeap ? 366 : 365;
    const totalWeeks = Math.ceil((startDow + daysInYear) / 7);

    const weeks: { dateKey: string; level: number; inYear: boolean }[][] = [];

    for (let w = 0; w < totalWeeks; w++) {
      const week: { dateKey: string; level: number; inYear: boolean }[] = [];
      for (let d = 0; d < 7; d++) {
        const dayOffset = w * 7 + d - startDow;
        if (dayOffset < 0 || dayOffset >= daysInYear) {
          week.push({ dateKey: '', level: 0, inYear: false });
        } else {
          const date = new Date(year, 0, dayOffset + 1);
          const dateKey = localDateStr(date);
          const activeHabits = habits.filter((h) =>
            activeHabitId ? h.id === activeHabitId : isHabitActiveOn(h, dateKey)
          );
          if (!activeHabits.length) {
            week.push({ dateKey, level: 0, inYear: true });
          } else {
            const dayLog = logs[dateKey] || {};
            const doneCount = activeHabits.filter((h) => isDone(h, dayLog[h.id])).length;
            const ratio = doneCount / activeHabits.length;
            const level = ratio === 0 ? 0 : ratio < 0.3 ? 1 : ratio < 0.6 ? 2 : ratio < 0.9 ? 3 : 4;
            week.push({ dateKey, level, inYear: true });
          }
        }
      }
      weeks.push(week);
    }
    return weeks;
  }, [year, habits, logs, activeHabitId]);

  // Chart Canvas Refs
  const trendCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const doughnutCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const streakCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const trendChartInstance = useRef<ChartJS | null>(null);
  const doughnutChartInstance = useRef<ChartJS | null>(null);
  const streakChartInstance = useRef<ChartJS | null>(null);

  // Render Charts
  useEffect(() => {
    // 1. Trend Chart
    if (trendCanvasRef.current) {
      if (trendChartInstance.current) trendChartInstance.current.destroy();

      const days = 30;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const labels: string[] = [];
      const values: number[] = [];

      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const k = localDateStr(d);
        labels.push(`${MONTHS[d.getMonth()]} ${d.getDate()}`);

        const active = habits.filter((h) =>
          activeHabitId ? h.id === activeHabitId : isHabitActiveOn(h, k)
        );
        if (!active.length) {
          values.push(0);
        } else {
          const dayLog = logs[k] || {};
          const done = active.filter((h) => isDone(h, dayLog[h.id])).length;
          values.push(Math.round((done / active.length) * 100));
        }
      }

      trendChartInstance.current = new ChartJS(trendCanvasRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              data: values,
              borderColor: '#526B50',
              backgroundColor: 'rgba(82, 107, 80, 0.08)',
              borderWidth: 2,
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#526B50',
              pointRadius: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#171717',
              callbacks: {
                label: (ctx) => `Completion: ${ctx.parsed.y}%`,
              },
            },
          },
          scales: {
            x: {
              grid: { color: '#E8E5DE' },
              ticks: { color: '#666666', font: { size: 9 } },
            },
            y: {
              min: 0,
              max: 100,
              grid: { color: '#E8E5DE' },
              ticks: { color: '#666666', font: { size: 9 } },
            },
          },
        },
      });
    }

    // 2. Doughnut Chart (Habit Breakdown)
    if (doughnutCanvasRef.current && habits.length > 0) {
      if (doughnutChartInstance.current) doughnutChartInstance.current.destroy();

      const labels = habits.map((h) => h.name);
      const data = habits.map((h) => {
        const streak = calculateStreak(h.id);
        return streak > 0 ? streak : 1;
      });
      const bgColors = habits.map((h) => h.color);

      doughnutChartInstance.current = new ChartJS(doughnutCanvasRef.current, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: bgColors,
              borderColor: '#FFFFFF',
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: '#171717',
                font: { size: 10, weight: 600 },
                boxWidth: 8,
              },
            },
          },
        },
      });
    }

    // 3. Streak Leaders
    if (streakCanvasRef.current && habits.length > 0) {
      if (streakChartInstance.current) streakChartInstance.current.destroy();

      const sorted = [...habits]
        .map((h) => ({ name: h.name, streak: calculateStreak(h.id), color: h.color }))
        .sort((a, b) => b.streak - a.streak)
        .slice(0, 6);

      streakChartInstance.current = new ChartJS(streakCanvasRef.current, {
        type: 'bar',
        data: {
          labels: sorted.map((s) => s.name),
          datasets: [
            {
              data: sorted.map((s) => s.streak),
              backgroundColor: sorted.map((s) => s.color),
              borderRadius: 4,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              grid: { color: '#E8E5DE' },
              ticks: { color: '#666666', font: { size: 9 }, stepSize: 1 },
            },
            y: {
              grid: { display: false },
              ticks: { color: '#171717', font: { size: 10, weight: 600 } },
            },
          },
        },
      });
    }

    return () => {
      if (trendChartInstance.current) trendChartInstance.current.destroy();
      if (doughnutChartInstance.current) doughnutChartInstance.current.destroy();
      if (streakChartInstance.current) streakChartInstance.current.destroy();
    };
  }, [habits, logs, activeHabitId]);

  return (
    <div className="flex-1 flex flex-col bg-[#FDF5EB] text-[#171717] min-h-screen">
      {mode === 'dashboard' ? (
        <DashboardHeader
          onOpenMobileMenu={onOpenMobileMenu || (() => {})}
          title="Career Habit Command Centre"
          subtitle="Build unconscious competence through daily and weekly micro-commitments."
        />
      ) : (
        <>
          {/* Standalone Page Header */}
          <div className="bg-[#FFFDF8] border-b border-[#E8E5DE] py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EDF2E9] border border-[#A8B99A] text-[11px] font-bold text-[#526B50]">
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>Daily & Weekly Consistency Engine</span>
                  </span>
                  <span className="text-[11px] font-mono text-[#777777] hidden sm:inline">
                    • 100% Synced With Career Dashboard
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
                  Habit Tracker & Routine Builder
                </h1>
                <p className="text-xs sm:text-sm text-[#555555] font-medium max-w-2xl mt-1">
                  Build the daily discipline and unconscious competence required for your target career. Track streaks, log completions, and monitor your year-round consistency.
                </p>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={() => handleOpenAddHabit('weekday')}
                  className="px-4 py-2.5 rounded-xl bg-[#171717] hover:bg-[#333333] text-white font-bold text-xs border border-[#171717] shadow-[2px_2px_0px_#526B50] inline-flex items-center gap-1.5 transition-transform active:translate-y-0.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Habit</span>
                </button>
                <Link
                  to="/dashboard/habits"
                  className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#F4F3EF] text-[#171717] font-bold text-xs border border-[#171717] shadow-[2px_2px_0px_#171717] inline-flex items-center gap-1.5 transition-transform active:translate-y-0.5"
                >
                  <span>Open In Dashboard →</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Guest Exploration Banner if not authenticated */}
          {!isAuthenticated && (
            <div className="bg-[#FFF8E7] border-b border-[#F5D898] px-4 sm:px-6 lg:px-8 py-3 transition-all">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#854D0E]">
                  <span className="font-bold">✨ Guest Session:</span>
                  <span className="text-[#713F12]">
                    Your habits, check-ins, and streaks are currently saved locally in your browser.
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to="/login"
                    className="font-bold text-[#854D0E] hover:underline"
                  >
                    Log In
                  </Link>
                  <span className="text-[#D97706]">•</span>
                  <Link
                    to="/signup"
                    className="px-3 py-1 rounded-lg bg-[#526B50] hover:bg-[#3F543D] text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    Sign Up to Sync Across Devices
                  </Link>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Auto-save notification pill */}
      <div
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#171717] text-white text-xs font-mono transition-opacity duration-300 shadow-md ${
          autoSaveShow ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
        <span>AUTO SAVED</span>
      </div>

      <main className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Empty state notice if user has 0 habits */}
        {habits.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border-2 border-[#171717] shadow-[3px_3px_0px_#171717] max-w-xl mx-auto space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FFE76B] border border-[#171717] flex items-center justify-center mx-auto shadow-xs">
              <CalendarCheck className="w-6 h-6 text-[#171717]" />
            </div>
            <h3 className="text-lg font-black text-[#171717]">Build Your Daily Routine</h3>
            <p className="text-xs text-[#555555] font-medium max-w-md mx-auto leading-relaxed">
              Your habit command centre is ready. Add routines tailored to your career milestones (e.g. 60 min Deep Work Coding or Weekly Project Review) to build real momentum.
            </p>
            <button
              onClick={() => handleOpenAddHabit('weekday')}
              className="px-5 py-2.5 rounded-xl bg-[#171717] hover:bg-[#333333] text-white font-black text-xs border border-[#171717] shadow-[2px_2px_0px_#526B50] inline-flex items-center gap-1.5 transition-transform active:translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Habit</span>
            </button>
          </div>
        )}
        {/* KPI ROW (4 Cards with animated circular progress) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Current Streak',
              val: `${overallStreak}d`,
              sub: overallStreak === 1 ? 'day consistent' : 'days consistent',
              color: '#526B50',
              pct: Math.min((overallStreak / 30) * 100, 100),
            },
            {
              label: "Today's Tasks",
              val: `${todayPct}%`,
              sub: 'completed today',
              color: '#A8B99A',
              pct: todayPct,
            },
            {
              label: 'Weekly Tasks',
              val: `${weeklyPct}%`,
              sub: 'completed this week',
              color: '#d97706',
              pct: weeklyPct,
            },
            {
              label: 'Monthly Tasks',
              val: `${monthlyPct}%`,
              sub: 'completed this month',
              color: '#3b82f6',
              pct: monthlyPct,
            },
          ].map((kpi, idx) => {
            const circ = 2 * Math.PI * 18;
            const offset = circ - (kpi.pct / 100) * circ;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E8E5DE] p-4 sm:p-5 relative overflow-hidden shadow-xs hover:border-[#171717] transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">
                    {kpi.label}
                  </span>
                  <div className="w-10 h-10 relative flex items-center justify-center">
                    <svg className="w-10 h-10 transform -rotate-90">
                      <circle cx="20" cy="20" r="16" fill="none" stroke="#F4F3EF" strokeWidth="3" />
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        fill="none"
                        stroke={kpi.color}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        strokeDashoffset={offset}
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <span className="absolute text-[10px] font-mono font-bold text-[#666666]">
                      {Math.round(kpi.pct)}%
                    </span>
                  </div>
                </div>

                <div className="text-2xl sm:text-3xl font-black font-mono text-[#171717] leading-none">
                  {kpi.val}
                </div>
                <div className="text-xs text-[#666666] font-medium mt-1">
                  {kpi.sub}
                </div>
              </div>
            );
          })}
        </div>

        {/* WEEKDAY TASKS (Mon - Fri) */}
        <div className="bg-white rounded-2xl border border-[#E8E5DE] shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8E5DE] flex items-center justify-between bg-[#FFFDF8]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#526B50]" />
              <h2 className="text-sm font-black uppercase tracking-wider text-[#171717]">
                Weekday Habits (Mon – Fri)
              </h2>
            </div>
            <button
              onClick={() => handleOpenAddHabit('weekday')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#F4F3EF] hover:bg-[#E8E5DE] text-[#171717] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Weekday Habit</span>
            </button>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[620px]">
              <thead>
                <tr className="border-b border-[#E8E5DE] bg-[#F4F3EF]/50 text-[11px] font-mono text-[#666666]">
                  <th className="py-2.5 px-4 font-bold w-60">Habit Name</th>
                  {weekDates.slice(0, 5).map((d) => {
                    const dow = new Date(d + 'T00:00:00').getDay();
                    const isToday = d === TODAY;
                    return (
                      <th
                        key={d}
                        className={`text-center py-2.5 px-2 ${
                          isToday ? 'text-[#526B50] font-black bg-[#EDF2E9]/60' : ''
                        }`}
                      >
                        {DAY_NAMES[dow]}
                        <span className="block text-[10px] opacity-70">
                          {new Date(d + 'T00:00:00').getDate()}
                        </span>
                      </th>
                    );
                  })}
                  <th className="text-right py-2.5 px-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E5DE] text-xs">
                {habits.filter((h) => h.schedule === 'weekday' || h.schedule === 'everyday').length > 0 ? (
                  habits
                    .filter((h) => h.schedule === 'weekday' || h.schedule === 'everyday')
                    .map((habit) => {
                      const streak = calculateStreak(habit.id);
                      return (
                        <tr key={habit.id} className="hover:bg-[#FFFDF8] transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: habit.color }}
                              />
                              <span className="font-bold text-[#171717] truncate">{habit.name}</span>
                              {streak > 0 && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-[#526B50] bg-[#EDF2E9] px-1.5 py-0.5 rounded">
                                  🔥{streak}
                                </span>
                              )}
                            </div>
                          </td>

                          {weekDates.slice(0, 5).map((d) => {
                            const done = isDone(habit, (logs[d] || {})[habit.id]);
                            const isFuture = d > TODAY;
                            return (
                              <td key={d} className="text-center py-3 px-2">
                                <button
                                  type="button"
                                  disabled={isFuture}
                                  onClick={() => handleToggleCheckbox(d, habit.id)}
                                  className={`w-7 h-7 rounded-lg border flex items-center justify-center mx-auto transition-all ${
                                    done
                                      ? 'bg-[#526B50] border-[#526B50] text-white shadow-xs'
                                      : isFuture
                                      ? 'bg-[#F4F3EF] border-[#E8E5DE] opacity-40 cursor-not-allowed'
                                      : 'bg-white border-[#E8E5DE] hover:border-[#526B50] text-transparent'
                                  }`}
                                >
                                  {done && <Check className="w-4 h-4 stroke-[3]" />}
                                </button>
                              </td>
                            );
                          })}

                          <td className="text-right py-3 px-4">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditHabit(habit)}
                                className="p-1 rounded-md text-[#666666] hover:text-[#171717] hover:bg-[#F4F3EF]"
                                title="Edit habit"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteHabit(habit.id)}
                                className="p-1 rounded-md text-[#666666] hover:text-red-600 hover:bg-red-50"
                                title="Delete habit"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[#888888] font-medium text-xs">
                      No weekday routines added yet. Click "+ Add Weekday Habit" to start tracking.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Dedicated Touch-Friendly Mobile Habit Cards for Weekday (md:hidden) */}
          <div className="md:hidden divide-y divide-[#E8E5DE]">
            {habits.filter((h) => h.schedule === 'weekday' || h.schedule === 'everyday').length > 0 ? (
              habits
                .filter((h) => h.schedule === 'weekday' || h.schedule === 'everyday')
                .map((habit) => {
                  const streak = calculateStreak(habit.id);
                  const doneToday = isDone(habit, (logs[TODAY] || {})[habit.id]);
                  return (
                    <div key={habit.id} className="p-4 bg-[#FFFDF8] space-y-3">
                      {/* Habit Name, Streak, and Actions */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: habit.color }}
                          />
                          <span className="font-bold text-sm text-[#171717] truncate">{habit.name}</span>
                          {streak > 0 && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-[#526B50] bg-[#EDF2E9] px-2 py-0.5 rounded-full shrink-0">
                              🔥{streak}d
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleOpenEditHabit(habit)}
                            className="p-1.5 rounded-lg text-[#666666] hover:text-[#171717] hover:bg-[#F4F3EF]"
                            title="Edit habit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteHabit(habit.id)}
                            className="p-1.5 rounded-lg text-[#666666] hover:text-red-600 hover:bg-red-50"
                            title="Delete habit"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* 5-day mini progress dots (Mon - Fri) */}
                      <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-[#E8E5DE]">
                        <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider">Week:</span>
                        <div className="flex items-center gap-2">
                          {weekDates.slice(0, 5).map((d) => {
                            const dow = new Date(d + 'T00:00:00').getDay();
                            const done = isDone(habit, (logs[d] || {})[habit.id]);
                            const isToday = d === TODAY;
                            const isFuture = d > TODAY;
                            return (
                              <button
                                key={d}
                                type="button"
                                disabled={isFuture}
                                onClick={() => handleToggleCheckbox(d, habit.id)}
                                className={`flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-lg transition-all ${
                                  isToday ? 'bg-[#EDF2E9] font-black' : ''
                                }`}
                              >
                                <span className="text-[9px] text-[#777777]">{DAY_NAMES[dow][0]}</span>
                                <div
                                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] transition-all ${
                                    done
                                      ? 'bg-[#526B50] text-white shadow-xs'
                                      : isFuture
                                      ? 'bg-[#F4F3EF] border border-[#E8E5DE] opacity-40'
                                      : 'bg-white border border-[#E8E5DE] text-transparent'
                                  }`}
                                >
                                  {done && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 1-Tap Large Mobile Completion Control for TODAY */}
                      <button
                        type="button"
                        onClick={() => handleToggleCheckbox(TODAY, habit.id)}
                        className={`w-full min-h-[44px] rounded-xl flex items-center justify-center font-bold text-xs gap-2 transition-all active:scale-[0.98] shadow-xs ${
                          doneToday
                            ? 'bg-[#EDF2E9] text-[#526B50] border-2 border-[#526B50]'
                            : 'bg-[#FFE76B] hover:bg-[#FADB3D] text-[#171717] border-2 border-[#171717]'
                        }`}
                      >
                        {doneToday ? (
                          <>
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>Completed for Today</span>
                          </>
                        ) : (
                          <>
                            <CalendarCheck className="w-4 h-4 text-[#171717]" />
                            <span>Tap to Mark Complete for Today</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
            ) : (
              <div className="p-6 text-center text-[#888888] font-medium text-xs">
                No weekday routines added yet. Click "+ Add Weekday Habit" to start.
              </div>
            )}
          </div>
        </div>

        {/* WEEKEND TASKS (Sat - Sun) */}
        <div className="bg-white rounded-2xl border border-[#E8E5DE] shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8E5DE] flex items-center justify-between bg-[#FFFDF8]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d97706]" />
              <h2 className="text-sm font-black uppercase tracking-wider text-[#171717]">
                Weekend Habits (Sat – Sun)
              </h2>
            </div>
            <button
              onClick={() => handleOpenAddHabit('weekend')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#F4F3EF] hover:bg-[#E8E5DE] text-[#171717] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Weekend Habit</span>
            </button>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-[#E8E5DE] bg-[#F4F3EF]/50 text-[11px] font-mono text-[#666666]">
                  <th className="py-2.5 px-4 font-bold w-60">Habit Name</th>
                  {weekDates.slice(5, 7).map((d) => {
                    const dow = new Date(d + 'T00:00:00').getDay();
                    const isToday = d === TODAY;
                    return (
                      <th
                        key={d}
                        className={`text-center py-2.5 px-2 ${
                          isToday ? 'text-[#d97706] font-black bg-[#FFFBEB]' : ''
                        }`}
                      >
                        {DAY_NAMES[dow]}
                        <span className="block text-[10px] opacity-70">
                          {new Date(d + 'T00:00:00').getDate()}
                        </span>
                      </th>
                    );
                  })}
                  <th className="text-right py-2.5 px-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E5DE] text-xs">
                {habits.filter((h) => h.schedule === 'weekend' || h.schedule === 'everyday').length > 0 ? (
                  habits
                    .filter((h) => h.schedule === 'weekend' || h.schedule === 'everyday')
                    .map((habit) => {
                      const streak = calculateStreak(habit.id);
                      return (
                        <tr key={habit.id} className="hover:bg-[#FFFDF8] transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: habit.color }}
                              />
                              <span className="font-bold text-[#171717] truncate">{habit.name}</span>
                              {streak > 0 && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-[#d97706] bg-[#FFFBEB] px-1.5 py-0.5 rounded">
                                  🔥{streak}
                                </span>
                              )}
                            </div>
                          </td>

                          {weekDates.slice(5, 7).map((d) => {
                            const done = isDone(habit, (logs[d] || {})[habit.id]);
                            const isFuture = d > TODAY;
                            return (
                              <td key={d} className="text-center py-3 px-2">
                                <button
                                  type="button"
                                  disabled={isFuture}
                                  onClick={() => handleToggleCheckbox(d, habit.id)}
                                  className={`w-7 h-7 rounded-lg border flex items-center justify-center mx-auto transition-all ${
                                    done
                                      ? 'bg-[#d97706] border-[#d97706] text-white shadow-xs'
                                      : isFuture
                                      ? 'bg-[#F4F3EF] border-[#E8E5DE] opacity-40 cursor-not-allowed'
                                      : 'bg-white border-[#E8E5DE] hover:border-[#d97706] text-transparent'
                                  }`}
                                >
                                  {done && <Check className="w-4 h-4 stroke-[3]" />}
                                </button>
                              </td>
                            );
                          })}

                          <td className="text-right py-3 px-4">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditHabit(habit)}
                                className="p-1 rounded-md text-[#666666] hover:text-[#171717] hover:bg-[#F4F3EF]"
                                title="Edit habit"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteHabit(habit.id)}
                                className="p-1 rounded-md text-[#666666] hover:text-red-600 hover:bg-red-50"
                                title="Delete habit"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[#888888] font-medium text-xs">
                      No weekend routines added yet. Click "+ Add Weekend Habit" to start tracking.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Dedicated Touch-Friendly Mobile Habit Cards for Weekend (md:hidden) */}
          <div className="md:hidden divide-y divide-[#E8E5DE]">
            {habits.filter((h) => h.schedule === 'weekend' || h.schedule === 'everyday').length > 0 ? (
              habits
                .filter((h) => h.schedule === 'weekend' || h.schedule === 'everyday')
                .map((habit) => {
                  const streak = calculateStreak(habit.id);
                  const doneToday = isDone(habit, (logs[TODAY] || {})[habit.id]);
                  return (
                    <div key={habit.id} className="p-4 bg-[#FFFDF8] space-y-3">
                      {/* Habit Name, Streak, and Actions */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: habit.color }}
                          />
                          <span className="font-bold text-sm text-[#171717] truncate">{habit.name}</span>
                          {streak > 0 && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-[#d97706] bg-[#FFFBEB] px-2 py-0.5 rounded-full shrink-0">
                              🔥{streak}d
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleOpenEditHabit(habit)}
                            className="p-1.5 rounded-lg text-[#666666] hover:text-[#171717] hover:bg-[#F4F3EF]"
                            title="Edit habit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteHabit(habit.id)}
                            className="p-1.5 rounded-lg text-[#666666] hover:text-red-600 hover:bg-red-50"
                            title="Delete habit"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* 2-day mini progress dots (Sat, Sun) */}
                      <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-[#E8E5DE]">
                        <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider">Weekend:</span>
                        <div className="flex items-center gap-2">
                          {weekDates.slice(5, 7).map((d) => {
                            const dow = new Date(d + 'T00:00:00').getDay();
                            const done = isDone(habit, (logs[d] || {})[habit.id]);
                            const isToday = d === TODAY;
                            const isFuture = d > TODAY;
                            return (
                              <button
                                key={d}
                                type="button"
                                disabled={isFuture}
                                onClick={() => handleToggleCheckbox(d, habit.id)}
                                className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-all ${
                                  isToday ? 'bg-[#FFFBEB] font-black' : ''
                                }`}
                              >
                                <span className="text-[9px] text-[#777777]">{DAY_NAMES[dow]}</span>
                                <div
                                  className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] transition-all ${
                                    done
                                      ? 'bg-[#d97706] text-white shadow-xs'
                                      : isFuture
                                      ? 'bg-[#F4F3EF] border border-[#E8E5DE] opacity-40'
                                      : 'bg-white border border-[#E8E5DE] text-transparent'
                                  }`}
                                >
                                  {done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 1-Tap Large Mobile Completion Control for TODAY */}
                      <button
                        type="button"
                        onClick={() => handleToggleCheckbox(TODAY, habit.id)}
                        className={`w-full min-h-[44px] rounded-xl flex items-center justify-center font-bold text-xs gap-2 transition-all active:scale-[0.98] shadow-xs ${
                          doneToday
                            ? 'bg-[#EDF2E9] text-[#526B50] border-2 border-[#526B50]'
                            : 'bg-[#FFE76B] hover:bg-[#FADB3D] text-[#171717] border-2 border-[#171717]'
                        }`}
                      >
                        {doneToday ? (
                          <>
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>Completed for Today</span>
                          </>
                        ) : (
                          <>
                            <CalendarCheck className="w-4 h-4 text-[#171717]" />
                            <span>Tap to Mark Complete for Today</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
            ) : (
              <div className="p-6 text-center text-[#888888] font-medium text-xs">
                No weekend routines added yet. Click "+ Add Weekend Habit" to start.
              </div>
            )}
          </div>
        </div>

        {/* YEAR HEATMAP (Annual Consistency Grid with Tooltip) */}
        <div className="bg-white rounded-2xl border border-[#E8E5DE] p-5 sm:p-6 shadow-xs relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-[#E8E5DE] gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#171717]">
                Year Heatmap ({year})
              </h2>
              <div className="flex items-center gap-1 border border-[#E8E5DE] rounded-lg px-2 py-0.5 text-xs font-mono">
                <button
                  onClick={() => setYear((prev) => prev - 1)}
                  className="hover:text-[#526B50]"
                >
                  ‹
                </button>
                <span className="font-bold px-1">{year}</span>
                <button
                  onClick={() => setYear((prev) => prev + 1)}
                  className="hover:text-[#526B50]"
                >
                  ›
                </button>
              </div>
            </div>

            {/* Intensity legend */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#666666]">
              <span>Less</span>
              <div className="flex gap-1">
                <span className="w-3 h-3 rounded-xs bg-[#F4F3EF] border border-[#E8E5DE]" />
                <span className="w-3 h-3 rounded-xs bg-[#EDF2E9]" />
                <span className="w-3 h-3 rounded-xs bg-[#A8B99A]" />
                <span className="w-3 h-3 rounded-xs bg-[#728C6E]" />
                <span className="w-3 h-3 rounded-xs bg-[#526B50]" />
              </div>
              <span>More</span>
            </div>
          </div>

          {/* Month labels & 52-week grid */}
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-1 min-w-[760px]">
              {heatmapWeeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.map((day, dIdx) => {
                    if (!day.inYear) {
                      return <div key={dIdx} className="w-3.5 h-3.5 opacity-0" />;
                    }
                    const isToday = day.dateKey === TODAY;
                    const levelColors = [
                      'bg-[#F4F3EF] border border-[#E8E5DE]',
                      'bg-[#EDF2E9] border border-[#A8B99A]/30',
                      'bg-[#A8B99A] border border-[#A8B99A]',
                      'bg-[#728C6E]',
                      'bg-[#526B50]',
                    ];
                    return (
                      <div
                        key={dIdx}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const active = habits.filter((h) =>
                            isHabitActiveOn(h, day.dateKey)
                          );
                          const dayLog = logs[day.dateKey] || {};
                          setTooltipData({
                            x: rect.left + window.scrollX,
                            y: rect.top + window.scrollY - 8,
                            date: day.dateKey,
                            items: active.map((h) => ({
                              name: h.name,
                              color: h.color,
                              done: isDone(h, dayLog[h.id]),
                            })),
                            reflection: reflections[day.dateKey],
                          });
                        }}
                        onMouseLeave={() => setTooltipData(null)}
                        className={`w-3.5 h-3.5 rounded-xs transition-transform hover:scale-125 cursor-pointer ${
                          levelColors[day.level]
                        } ${isToday ? 'ring-2 ring-[#171717]' : ''}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap Tooltip */}
          {tooltipData && (
            <div
              className="absolute z-50 p-3 rounded-xl bg-[#171717] text-white text-xs shadow-xl pointer-events-none w-56 -translate-x-1/2 -translate-y-full"
              style={{
                left: `${tooltipData.x}px`,
                top: `${tooltipData.y}px`,
              }}
            >
              <div className="font-mono text-[10px] text-[#A8B99A] font-bold mb-1">
                {tooltipData.date}
              </div>
              <div className="space-y-1">
                {tooltipData.items.map((it, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: it.color }} />
                      <span className="truncate">{it.name}</span>
                    </span>
                    <span className={it.done ? 'text-[#22C55E]' : 'text-white/40'}>
                      {it.done ? '✓' : '—'}
                    </span>
                  </div>
                ))}
              </div>
              {tooltipData.reflection && (
                <div className="mt-2 pt-2 border-t border-white/10 text-[10px] italic text-white/80">
                  "{tooltipData.reflection}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3 ANALYTICS CHARTS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Trend Chart */}
          <div className="bg-white rounded-2xl border border-[#E8E5DE] p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#171717] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#526B50]" />
                30-Day Completion Trend
              </span>
            </div>
            <div className="h-44 relative">
              <canvas ref={trendCanvasRef} />
            </div>
          </div>

          {/* Breakdown Doughnut */}
          <div className="bg-white rounded-2xl border border-[#E8E5DE] p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#171717] flex items-center gap-1.5">
                <PieChart className="w-3.5 h-3.5 text-[#526B50]" />
                Habit Distribution
              </span>
            </div>
            <div className="h-44 relative">
              <canvas ref={doughnutCanvasRef} />
            </div>
          </div>

          {/* Streak Leaders Bar */}
          <div className="bg-white rounded-2xl border border-[#E8E5DE] p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#171717] flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-[#526B50]" />
                Streak Leaders
              </span>
            </div>
            <div className="h-44 relative">
              <canvas ref={streakCanvasRef} />
            </div>
          </div>
        </div>

        {/* GOALS SECTION */}
        <div className="bg-white rounded-2xl border border-[#E8E5DE] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DE]">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#526B50]" />
              <h2 className="text-sm font-black uppercase tracking-wider text-[#171717]">
                Milestone Goals ({goals.length})
              </h2>
            </div>
            <button
              onClick={() => setShowGoalModal(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#F4F3EF] hover:bg-[#E8E5DE] text-[#171717]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Goal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {goals.map((goal) => {
              const alignPct = calculateGoalAlignment(goal);
              return (
                <div
                  key={goal.id}
                  className="p-4 rounded-xl border border-[#E8E5DE] bg-[#FFFDF8] hover:border-[#171717] transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-sm text-[#171717]">{goal.name}</h3>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-[#888888] hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {goal.description && (
                    <p className="text-xs text-[#666666] leading-relaxed">{goal.description}</p>
                  )}
                  {goal.targetDate && (
                    <div className="text-[11px] font-mono text-[#888888]">
                      Target: {goal.targetDate}
                    </div>
                  )}

                  {/* Alignment progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-[#666666]">Habit Alignment</span>
                      <span className="font-bold text-[#526B50]">{alignPct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F4F3EF] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#526B50] rounded-full transition-all duration-500"
                        style={{ width: `${alignPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Linked habits chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {goal.linkedHabits.map((hid) => {
                      const h = habits.find((item) => item.id === hid);
                      if (!h) return null;
                      return (
                        <span
                          key={hid}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-[#E8E5DE]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: h.color }} />
                          {h.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DAILY REFLECTION */}
        <div className="bg-white rounded-2xl border border-[#E8E5DE] p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DE]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#526B50]" />
              <h2 className="text-sm font-black uppercase tracking-wider text-[#171717]">
                Daily Reflection ({TODAY})
              </h2>
            </div>
            <span className="text-xs font-mono text-[#888888]">Auto-saves as you type</span>
          </div>

          <textarea
            value={reflections[TODAY] || ''}
            onChange={(e) => {
              const val = e.target.value;
              setReflections((prev) => ({
                ...prev,
                [TODAY]: val,
              }));
            }}
            rows={3}
            placeholder="What went well today? What challenges or learnings emerged?"
            className="w-full p-3.5 rounded-xl border border-[#E8E5DE] bg-[#FFFDF8] text-xs sm:text-sm text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#526B50]"
          />
        </div>
      </main>

      {/* MODAL: ADD / EDIT HABIT */}
      {showHabitModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E5DE] shadow-xl max-w-md w-full p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E5DE]">
              <h3 className="font-bold text-base text-[#171717]">
                {editingHabitId ? 'Edit Habit' : 'Add New Habit'}
              </h3>
              <button
                onClick={() => setShowHabitModal(false)}
                className="p-1 rounded-md text-[#888888] hover:text-[#171717]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-1">
                  Habit Name
                </label>
                <input
                  type="text"
                  required
                  value={habitFormName}
                  onChange={(e) => setHabitFormName(e.target.value)}
                  placeholder="e.g. Daily LeetCode problem"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DE] bg-[#FFFDF8] text-sm focus:outline-none focus:ring-2 focus:ring-[#526B50]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-1">
                    Type
                  </label>
                  <select
                    value={habitFormType}
                    onChange={(e) => setHabitFormType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8E5DE] bg-[#FFFDF8] text-xs font-semibold"
                  >
                    <option value="binary">Binary (Done / Not done)</option>
                    <option value="time">Time (Minutes)</option>
                    <option value="quantity">Quantity (Number)</option>
                    <option value="score">Score (1–10)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-1">
                    Schedule
                  </label>
                  <select
                    value={habitFormSched}
                    onChange={(e) => setHabitFormSched(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E8E5DE] bg-[#FFFDF8] text-xs font-semibold"
                  >
                    <option value="everyday">Everyday</option>
                    <option value="weekday">Weekday (Mon–Fri)</option>
                    <option value="weekend">Weekend (Sat–Sun)</option>
                  </select>
                </div>
              </div>

              {(habitFormType === 'time' || habitFormType === 'quantity') && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-1">
                      Daily Target
                    </label>
                    <input
                      type="number"
                      value={habitFormTarget}
                      onChange={(e) => setHabitFormTarget(e.target.value ? Number(e.target.value) : '')}
                      placeholder={habitFormType === 'time' ? '30' : '5'}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E8E5DE] bg-[#FFFDF8] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-1">
                      Unit (Optional)
                    </label>
                    <input
                      type="text"
                      value={habitFormUnit}
                      onChange={(e) => setHabitFormUnit(e.target.value)}
                      placeholder={habitFormType === 'time' ? 'min' : 'reps, pages'}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E8E5DE] bg-[#FFFDF8] text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Color Swatches */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-1.5">
                  Accent Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {COLOR_PALETTE.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setHabitFormColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        habitFormColor === c ? 'scale-125 ring-2 ring-[#171717]' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#E8E5DE]">
                <button
                  type="button"
                  onClick={() => setShowHabitModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#666666] hover:bg-[#F4F3EF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#171717] text-white hover:bg-[#333333]"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD GOAL */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E5DE] shadow-xl max-w-md w-full p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E5DE]">
              <h3 className="font-bold text-base text-[#171717]">Add Milestone Goal</h3>
              <button
                onClick={() => setShowGoalModal(false)}
                className="p-1 rounded-md text-[#888888] hover:text-[#171717]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  required
                  value={goalFormName}
                  onChange={(e) => setGoalFormName(e.target.value)}
                  placeholder="e.g. Master Backend Microservices"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5DE] bg-[#FFFDF8] text-sm focus:outline-none focus:ring-2 focus:ring-[#526B50]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={goalFormDesc}
                  onChange={(e) => setGoalFormDesc(e.target.value)}
                  placeholder="What does success look like?"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E5DE] bg-[#FFFDF8] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-1">
                  Target Completion Date
                </label>
                <input
                  type="date"
                  value={goalFormDate}
                  onChange={(e) => setGoalFormDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E5DE] bg-[#FFFDF8] text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-1.5">
                  Link Supporting Habits
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {habits.map((h) => {
                    const isChecked = goalFormLinked.includes(h.id);
                    return (
                      <label
                        key={h.id}
                        className="flex items-center gap-2 p-2 rounded-lg border border-[#E8E5DE] hover:bg-[#F4F3EF] cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setGoalFormLinked((prev) => [...prev, h.id]);
                            } else {
                              setGoalFormLinked((prev) => prev.filter((id) => id !== h.id));
                            }
                          }}
                          className="rounded text-[#526B50]"
                        />
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: h.color }} />
                        <span className="font-semibold text-[#171717]">{h.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#E8E5DE]">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#666666] hover:bg-[#F4F3EF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#171717] text-white hover:bg-[#333333]"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
