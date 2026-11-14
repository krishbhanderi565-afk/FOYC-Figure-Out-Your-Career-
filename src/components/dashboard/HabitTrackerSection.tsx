import React, { useState } from 'react';
import {
  Flame,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Trash2,
  Pause,
  Play,
  Archive,
  Edit2,
  BookOpen,
  Dumbbell,
  Code2,
  Brain,
  Target,
  Sparkles,
  Coffee,
  PenTool,
  X,
  AlertCircle,
} from 'lucide-react';
import { HabitItem } from '../../types/career';
import { getLocalDateString, isHabitScheduledOnDate } from '../../utils/progressCalculator';

interface HabitTrackerSectionProps {
  habits: HabitItem[];
  onToggleHabit: (habitId: string, dateStr?: string) => Promise<void>;
  onAddHabit: (habit: any) => Promise<any>;
  onUpdateHabit: (habitId: string, updates: Partial<HabitItem>) => Promise<void>;
  onDeleteHabit: (habitId: string) => Promise<void>;
}

const HABIT_ICONS = [
  { id: 'book', label: 'Reading', icon: BookOpen },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell },
  { id: 'code', label: 'Coding', icon: Code2 },
  { id: 'mind', label: 'Mindset', icon: Brain },
  { id: 'focus', label: 'Focus', icon: Target },
  { id: 'spark', label: 'Creativity', icon: Sparkles },
  { id: 'coffee', label: 'Routine', icon: Coffee },
  { id: 'write', label: 'Writing', icon: PenTool },
];

export const HabitTrackerSection: React.FC<HabitTrackerSectionProps> = ({
  habits,
  onToggleHabit,
  onAddHabit,
  onUpdateHabit,
  onDeleteHabit,
}) => {
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeMenuHabitId, setActiveMenuHabitId] = useState<string | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<HabitItem | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Skill');
  const [newSchedule, setNewSchedule] = useState<'everyday' | 'weekday' | 'weekend'>('everyday');
  const [selectedIconId, setSelectedIconId] = useState('focus');

  // Compute 7 days for the displayed week
  const today = new Date();
  const todayStr = getLocalDateString(today);

  // Base date shifted by weekOffset
  const baseDate = new Date(today);
  baseDate.setDate(today.getDate() + weekOffset * 7);

  const dayOfWeek = baseDate.getDay();
  const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() + distanceToMonday);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = getLocalDateString(d);
    return {
      date: d,
      dateStr,
      dayName: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      dayNumber: d.getDate(),
      isToday: dateStr === todayStr,
    };
  });

  const weekRangeLabel = `${weekDays[0].dayName} ${weekDays[0].dayNumber} - ${weekDays[6].dayName} ${weekDays[6].dayNumber}`;

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await onAddHabit({
      title: newTitle.trim(),
      category: newCategory,
      schedule: newSchedule,
      targetDaysPerWeek: newSchedule === 'everyday' ? 7 : newSchedule === 'weekday' ? 5 : 2,
    });
    setNewTitle('');
    setIsAddModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!habitToDelete) return;
    await onDeleteHabit(habitToDelete.id);
    setHabitToDelete(null);
  };

  const activeHabits = habits.filter((h) => !h.isArchived);

  return (
    <section className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-[0_4px_18px_rgba(0,0,0,0.02)] space-y-6" aria-label="Habit Tracker Section">
      {/* Header with Navigation & Add Habit */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Habit Tracker</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              {activeHabits.length} Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5 font-medium">
            Track daily micro-actions that build compounding momentum
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Week Navigation */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200/70 text-xs font-semibold text-neutral-700">
            <button
              type="button"
              onClick={() => setWeekOffset((prev) => prev - 1)}
              className="p-1.5 rounded-lg hover:bg-white transition-all text-neutral-600 hover:text-neutral-900"
              title="Previous Week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setWeekOffset(0)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                weekOffset === 0 ? 'bg-white text-neutral-900 font-bold shadow-sm' : 'hover:bg-white'
              }`}
            >
              {weekOffset === 0 ? 'This Week' : weekRangeLabel}
            </button>
            <button
              type="button"
              onClick={() => setWeekOffset((prev) => prev + 1)}
              className="p-1.5 rounded-lg hover:bg-white transition-all text-neutral-600 hover:text-neutral-900"
              title="Next Week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Habit</span>
          </button>
        </div>
      </div>

      {/* Habit List / Weekly Grid */}
      {activeHabits.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50/50">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">Build habits that support the life you want</h3>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mt-1 mb-5">
            Consistency is the secret to career breakthroughs. Add your first daily or weekly habit to start your streak.
          </p>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add My First Habit</span>
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[620px] border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 text-left">
                <th className="py-2.5 px-3 text-xs font-bold text-neutral-600 uppercase tracking-wider w-5/12">
                  Habit & Frequency
                </th>
                <th className="py-2.5 px-3 text-xs font-bold text-neutral-600 uppercase tracking-wider text-center w-2/12">
                  Streak
                </th>
                {weekDays.map((d) => (
                  <th
                    key={d.dateStr}
                    className={`py-2.5 px-2 text-center text-xs font-bold ${
                      d.isToday ? 'text-emerald-700 font-extrabold' : 'text-neutral-600'
                    }`}
                  >
                    <div>{d.dayName}</div>
                    <div className="text-[10px] text-neutral-500 font-medium">{d.dayNumber}</div>
                  </th>
                ))}
                <th className="py-2.5 px-2 text-right text-xs font-bold text-neutral-600 w-1/12">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {activeHabits.map((habit) => {
                const isPaused = habit.isPaused;
                const streak = habit.currentStreak || 0;

                return (
                  <tr key={habit.id} className="group hover:bg-neutral-50/70 transition-colors">
                    {/* Habit Title & Details */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700 flex-shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all">
                          <Target className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                            <span>{habit.title}</span>
                            {isPaused && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                                Paused
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-neutral-500 font-medium flex items-center gap-2 mt-0.5">
                            <span className="capitalize">{habit.category || 'General'}</span>
                            <span>•</span>
                            <span>{habit.schedule === 'weekday' ? 'Mon-Fri' : habit.schedule === 'weekend' ? 'Weekends' : 'Daily'}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Streak Badge */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200/60">
                        <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                        <span>{streak}d</span>
                      </span>
                    </td>

                    {/* 7 Interactive Day Bubbles */}
                    {weekDays.map((d) => {
                      const isScheduled = isHabitScheduledOnDate(habit, d.date);
                      const isDone = Boolean(
                        habit.history?.[d.dateStr] || (d.isToday && habit.completedToday)
                      );

                      if (!isScheduled) {
                        return (
                          <td key={d.dateStr} className="py-3.5 px-2 text-center">
                            <span className="w-7 h-7 rounded-full inline-flex items-center justify-center text-neutral-300 text-xs">
                              -
                            </span>
                          </td>
                        );
                      }

                      return (
                        <td key={d.dateStr} className="py-3.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => onToggleHabit(habit.id, d.dateStr)}
                            className={`w-8 h-8 rounded-full inline-flex items-center justify-center transition-all ${
                              isDone
                                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 hover:bg-emerald-700 scale-100'
                                : d.isToday
                                ? 'border-2 border-dashed border-emerald-500 text-emerald-600 hover:bg-emerald-50'
                                : 'border border-neutral-200 text-transparent hover:border-neutral-400 bg-neutral-50'
                            }`}
                            title={`Toggle ${habit.title} for ${d.dayName} (${d.dateStr})`}
                          >
                            <Check className={`w-4 h-4 stroke-[2.5] ${isDone ? 'opacity-100' : 'opacity-0'}`} />
                          </button>
                        </td>
                      );
                    })}

                    {/* Action Controls */}
                    <td className="py-3.5 px-2 text-right relative">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onUpdateHabit(habit.id, { isPaused: !isPaused })}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all"
                          title={isPaused ? 'Resume Habit' : 'Pause Habit'}
                        >
                          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setHabitToDelete(habit)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                          title="Delete Habit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Habit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-100 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-lg font-bold text-neutral-900">Add New Habit</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  Habit Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read for 20 minutes, 45m Coding, Exercise"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-sm font-medium outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-800 bg-white outline-none"
                  >
                    <option value="Skill">Skill & Learning</option>
                    <option value="Wellness">Health & Fitness</option>
                    <option value="Mindset">Mindset & Focus</option>
                    <option value="Reading">Reading</option>
                    <option value="Personal">Personal Life</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    Schedule
                  </label>
                  <select
                    value={newSchedule}
                    onChange={(e) => setNewSchedule(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-800 bg-white outline-none"
                  >
                    <option value="everyday">Every Day (7 days)</option>
                    <option value="weekday">Weekdays (Mon-Fri)</option>
                    <option value="weekend">Weekends Only</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-sm"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {habitToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-100 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-neutral-900">Delete Habit?</h4>
              <p className="text-xs text-neutral-500 mt-1">
                Are you sure you want to remove <span className="font-semibold text-neutral-800">"{habitToDelete.title}"</span>? Your past streak history will be permanently deleted.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setHabitToDelete(null)}
                className="px-3.5 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
