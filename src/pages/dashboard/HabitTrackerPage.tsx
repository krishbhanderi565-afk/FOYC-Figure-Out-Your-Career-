import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  Flame,
  CheckCircle2,
  Calendar,
  Zap,
  Plus,
  RefreshCw,
  Trophy,
  Trash2,
} from 'lucide-react';

export const HabitTrackerPage: React.FC = () => {
  const { dashboardData, toggleHabit } = useCareer();
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newFrequency, setNewFrequency] = useState<'daily' | 'weekly' | 'custom'>('daily');
  const [newTargetDays, setNewTargetDays] = useState(5);
  const [newCategory, setNewCategory] = useState('Skill');

  // 7 days mock columns: Mon to Sun
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];

  const habits = dashboardData.habits;
  const bestStreak = Math.max(...habits.map((h) => h.bestStreak || h.currentStreak), 0);
  const completedTodayCount = habits.filter((h) => h.completedToday).length;
  const averageConsistency = habits.length ? Math.round((completedTodayCount / habits.length) * 100) : 80;

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;

    dashboardData.habits.push({
      id: `h-${Date.now()}`,
      title: newHabitTitle.trim(),
      frequency: newFrequency,
      targetDaysPerWeek: newTargetDays,
      currentStreak: 0,
      bestStreak: 0,
      completedToday: false,
      history: {},
      category: newCategory,
    });

    setNewHabitTitle('');
    setShowAddHabit(false);
  };

  const handleDeleteHabit = (id: string) => {
    dashboardData.habits = dashboardData.habits.filter((h) => h.id !== id);
    // trigger state update via habit toggle or dummy refresh
    toggleHabit(id);
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        onOpenMobileMenu={() => {}}
        title="Career Habit Tracker"
        subtitle="Build unconscious competence through daily and weekly micro-commitments."
      />

      <main className="p-4 sm:p-8 space-y-8 max-w-6xl">
        {/* Top Momentum Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card variant="yellow" shadowSize="md" className="p-6">
            <span className="text-xs font-black uppercase tracking-wider text-[#17172B]/70 block mb-1">
              Active Habits
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-[#17172B]">{habits.length}</span>
              <span className="text-xs font-bold text-[#17172B]/70">daily & weekly loops</span>
            </div>
          </Card>

          <Card variant="pink" shadowSize="md" className="p-6">
            <span className="text-xs font-black uppercase tracking-wider text-[#17172B]/70 block mb-1">
              All-Time Best Streak
            </span>
            <div className="flex items-center gap-2">
              <Flame className="w-8 h-8 fill-red-500 text-red-600" />
              <span className="text-4xl font-black text-[#17172B]">
                {bestStreak} Days
              </span>
            </div>
          </Card>

          <Card variant="green" shadowSize="md" className="p-6">
            <span className="text-xs font-black uppercase tracking-wider text-[#17172B]/70 block mb-1">
              Today's Completion Rate
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-[#17172B]">{averageConsistency}%</span>
              <span className="text-xs font-bold text-emerald-800">
                {completedTodayCount} of {habits.length} logged
              </span>
            </div>
          </Card>
        </div>

        {/* Modal: Add Custom Habit */}
        {showAddHabit && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border-3 border-[#17172B] shadow-[8px_8px_0px_#17172B] p-6 sm:p-8 max-w-md w-full animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#17172B]">
                <h3 className="font-black text-xl text-[#17172B]">Add Custom Career Habit</h3>
                <button
                  onClick={() => setShowAddHabit(false)}
                  className="w-8 h-8 rounded-lg bg-[#F2F9E9] border border-[#17172B] font-black text-sm flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateHabit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1">
                    Habit Title / Daily Practice
                  </label>
                  <input
                    type="text"
                    value={newHabitTitle}
                    onChange={(e) => setNewHabitTitle(e.target.value)}
                    placeholder="e.g. 45 mins focused LeetCode or Figma practice"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-semibold text-sm focus:ring-2 focus:ring-[#FFE76B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1">
                      Frequency
                    </label>
                    <select
                      value={newFrequency}
                      onChange={(e) => setNewFrequency(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-bold text-xs"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1">
                      Target Days / Week
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="7"
                      value={newTargetDays}
                      onChange={(e) => setNewTargetDays(parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-bold text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g. Skill, Knowledge, Networking, Health"
                    className="w-full px-3 py-2 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-semibold text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowAddHabit(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="font-black">
                    Save Habit
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Habits Matrix Card */}
        <Card variant="white" shadowSize="lg" className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b-2 border-[#17172B]">
            <div>
              <h3 className="font-extrabold text-xl text-[#17172B]">7-Day Consistency Matrix</h3>
              <p className="text-xs text-[#17172B]/60 font-semibold">
                Click "Today" column to toggle your habit status. Date-safe duplicate prevention enabled.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddHabit(true)}
              className="gap-1.5 text-xs font-black"
            >
              <Plus className="w-4 h-4" />
              Add Custom Habit
            </Button>
          </div>

          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#17172B]/20">
                  <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-[#17172B]">Habit Objective</th>
                  <th className="py-3 px-2 text-xs font-black uppercase tracking-wider text-[#17172B] text-center">Streak</th>
                  {weekDays.map((day, i) => (
                    <th
                      key={day}
                      className={`py-3 px-2 text-xs font-black uppercase text-center ${
                        i === 6 ? 'bg-[#FFE76B]/40 rounded-t-lg' : ''
                      }`}
                    >
                      {day}
                    </th>
                  ))}
                  <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-[#17172B] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#17172B]/10">
                {habits.map((h, hIdx) => (
                  <tr key={h.id} className="hover:bg-[#F2F9E9]/50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-bold text-sm text-[#17172B] block">{h.title}</span>
                      <span className="text-[10px] font-semibold text-[#17172B]/60 uppercase">
                        {h.category} • Target {h.targetDaysPerWeek}d/wk
                      </span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <span className="inline-flex items-center gap-1 font-black text-sm text-[#D97706] bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                        🔥 {h.currentStreak}d
                      </span>
                    </td>
                    {/* Mon-Sat history indicators */}
                    {[true, true, hIdx % 2 === 0, true, false, true].map((done, i) => (
                      <td key={i} className="py-4 px-2 text-center">
                        <div
                          className={`w-6 h-6 rounded-md mx-auto border flex items-center justify-center text-xs font-black ${
                            done
                              ? 'bg-emerald-500 text-white border-emerald-600'
                              : 'bg-gray-100 text-gray-300 border-gray-300'
                          }`}
                        >
                          {done ? '✓' : ''}
                        </div>
                      </td>
                    ))}
                    {/* Today Toggleable Cell */}
                    <td className="py-4 px-2 text-center bg-[#FFE76B]/20">
                      <button
                        onClick={() => toggleHabit(h.id)}
                        className={`w-7 h-7 rounded-lg border-2 mx-auto flex items-center justify-center transition-all ${
                          h.completedToday
                            ? 'bg-emerald-500 border-[#17172B] text-white shadow-[1px_1px_0px_#17172B]'
                            : 'bg-white border-[#17172B] hover:bg-[#FFE76B] text-transparent'
                        }`}
                      >
                        ✓
                      </button>
                    </td>
                    {/* Action buttons */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleHabit(h.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-black border border-[#17172B] transition-colors ${
                            h.completedToday ? 'bg-[#DDF5C9] text-emerald-950' : 'bg-[#F2F9E9] text-[#17172B]'
                          }`}
                        >
                          {h.completedToday ? 'Completed' : 'Mark Done'}
                        </button>
                        <button
                          onClick={() => handleDeleteHabit(h.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                          title="Delete habit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
};
