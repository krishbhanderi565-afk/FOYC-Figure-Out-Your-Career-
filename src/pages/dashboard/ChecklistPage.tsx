import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  CheckCircle2,
  ListTodo,
  Plus,
  Trash2,
  Calendar,
  Filter,
  Check,
  AlertCircle,
} from 'lucide-react';
import { TaskItem } from '../../types/career';

export const ChecklistPage: React.FC = () => {
  const { dashboardData, toggleTask, addTask, deleteTask } = useCareer();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'high'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form fields
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskItem['category']>('Technical');
  const [newPriority, setNewPriority] = useState<TaskItem['priority']>('high');
  const [newDueDate, setNewDueDate] = useState('This week');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask({
      title: newTitle,
      category: newCategory,
      priority: newPriority,
      dueDate: newDueDate,
      completed: false,
    });
    setNewTitle('');
    setShowAddModal(false);
  };

  const filteredTasks = dashboardData.tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    if (filter === 'high') return t.priority === 'high';
    return true;
  });

  const completedCount = dashboardData.tasks.filter((t) => t.completed).length;

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        onOpenMobileMenu={() => {}}
        title="Learning Checklist & Tasks"
        subtitle="Manage daily technical milestones, portfolio sprints and prep tasks."
      />

      <main className="p-4 sm:p-8 space-y-6 max-w-6xl">
        {/* Top Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border-2 border-[#17172B] shadow-[3px_3px_0px_#17172B]">
          {/* Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-xs font-black uppercase tracking-wider text-[#17172B]/50 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {(['all', 'pending', 'completed', 'high'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  filter === mode
                    ? 'bg-[#FFE76B] text-[#17172B] border border-[#17172B] shadow-[1.5px_1.5px_0px_#17172B]'
                    : 'text-[#17172B]/70 hover:bg-[#FFF8E9]'
                }`}
              >
                {mode === 'all'
                  ? `All (${dashboardData.tasks.length})`
                  : mode === 'pending'
                  ? `Pending (${dashboardData.tasks.length - completedCount})`
                  : mode === 'completed'
                  ? `Done (${completedCount})`
                  : 'High Priority'}
              </button>
            ))}
          </div>

          {/* Add Task Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="gap-2 shrink-0 font-bold"
          >
            <Plus className="w-4 h-4" />
            Add New Task
          </Button>
        </div>

        {/* Modal: Add Task */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border-3 border-[#17172B] shadow-[8px_8px_0px_#17172B] p-6 sm:p-8 max-w-lg w-full animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#17172B]">
                <h3 className="font-black text-xl text-[#17172B]">Add Actionable Task</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-lg bg-[#FFF8E9] border border-[#17172B] font-black text-sm flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1">
                    Task Title / Objective
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Build prototype API endpoint with JWT auth"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#FFE76B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-bold text-xs"
                    >
                      <option value="Foundation">Foundation</option>
                      <option value="Technical">Technical</option>
                      <option value="Portfolio">Portfolio</option>
                      <option value="Networking">Networking</option>
                      <option value="Job Prep">Job Prep</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1">
                      Priority
                    </label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-bold text-xs"
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1">
                    Target Due Date
                  </label>
                  <input
                    type="text"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    placeholder="e.g. In 3 days, End of Week 2"
                    className="w-full px-4 py-2 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-semibold text-sm"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="font-black">
                    Save Task
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Task List Container */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <Card variant="white" className="p-12 text-center">
              <ListTodo className="w-10 h-10 text-[#17172B]/40 mx-auto mb-3" />
              <h4 className="font-bold text-lg text-[#17172B]">No tasks matching this filter</h4>
              <p className="text-xs text-[#17172B]/60 mt-1">Try switching to 'All' or add a new task.</p>
            </Card>
          ) : (
            filteredTasks.map((t) => {
              const priorityBadges = {
                high: 'bg-red-100 text-red-800 border-red-300',
                medium: 'bg-amber-100 text-amber-800 border-amber-300',
                low: 'bg-emerald-100 text-emerald-800 border-emerald-300',
              };

              return (
                <div
                  key={t.id}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 ${
                    t.completed
                      ? 'bg-[#F9FFF9] border-emerald-500/50 text-[#17172B]/50'
                      : 'bg-white border-[#17172B] shadow-[3px_3px_0px_#17172B]'
                  }`}
                >
                  <div
                    onClick={() => toggleTask(t.id)}
                    className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                  >
                    <div
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
                        t.completed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-[#17172B] bg-[#FFF8E9]'
                      }`}
                    >
                      {t.completed && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>

                    <div className="min-w-0">
                      <span className={`text-sm sm:text-base font-bold block truncate ${t.completed ? 'line-through' : 'text-[#17172B]'}`}>
                        {t.title}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#FFF8E9] border border-[#17172B]">
                          {t.category}
                        </span>
                        <span className="text-[11px] font-semibold text-[#17172B]/60">
                          Due: {t.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded border hidden sm:inline ${priorityBadges[t.priority]}`}>
                      {t.priority}
                    </span>
                    <button
                      onClick={() => deleteTask(t.id)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};
