import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import {
  ClipboardList,
  CheckCircle2,
  Plus,
  Trash2,
  Calendar,
  Search,
  BookOpen,
  ArrowRight,
  Sparkles,
  Star,
  Clock,
  Check,
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { TaskItem } from '../../types/career';

interface DashboardOutletContext {
  onOpenMobileMenu: () => void;
}

export const ChecklistPage: React.FC = () => {
  const { dashboardData, toggleTask, addTask, deleteTask, isDemoMode } = useCareer();
  const outletCtx = useOutletContext<DashboardOutletContext | undefined>();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskItem['category']>('Technical');
  const [newDueDate, setNewDueDate] = useState('This week');

  const rawTasks = dashboardData?.tasks || [];
  const tasks = rawTasks.length > 0
    ? rawTasks
    : (isDemoMode
        ? [
            { id: 't1', title: 'Learn Python Basics', category: 'Technical' as const, priority: 'high' as const, dueDate: 'Due: Nov 5', completed: true },
            { id: 't2', title: 'Complete Data Analysis Course', category: 'Soft Skills' as const, priority: 'medium' as const, dueDate: 'Due: Nov 10', completed: true },
            { id: 't3', title: 'Improve Communication Skills', category: 'Technical' as const, priority: 'high' as const, dueDate: 'Due: Nov 15', completed: false },
            { id: 't4', title: 'Explore UI/UX Design Fundamentals', category: 'Portfolio' as const, priority: 'medium' as const, dueDate: 'Due: Nov 20', completed: false },
          ]
        : []);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length || (isDemoMode ? 10 : 0);
  const overallPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : (isDemoMode ? 65 : 0);

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || t.category?.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask({
      title: newTitle.trim(),
      category: newCategory,
      priority: 'high',
      dueDate: newDueDate,
      completed: false,
    });
    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <DashboardHeader
        onOpenMobileMenu={outletCtx?.onOpenMobileMenu || (() => {})}
        title="Learning Checklist"
        subtitle="Learn the right skills, at the right time."
      />

      <main className="px-4 sm:px-8 pb-12 space-y-6 max-w-[1400px] w-full mx-auto">
        {/* Top Controls: Filter by Category */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl border border-white/90 shadow-sm backdrop-blur-xl bg-white/85">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-stone-500">Filter Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs font-black text-stone-900 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-full focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories ▾</option>
              <option value="Technical">Technical</option>
              <option value="Soft Skills">Soft Skills</option>
              <option value="Portfolio">Career / Portfolio</option>
              <option value="Foundation">Foundation</option>
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Item</span>
          </button>
        </div>

        {/* 5 Category Metric Cards (Reference Image 2 Middle-Right) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Card 1: Overall Completion Donut */}
          <div className="rounded-3xl p-5 border border-white/90 shadow-sm backdrop-blur-xl bg-white/85 flex items-center gap-3">
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="4"
                  strokeDasharray={`${overallPct * 0.88}, 88`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-stone-900">
                {overallPct}%
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-stone-500 block leading-tight">Overall</span>
              <span className="text-xs font-black text-stone-900 block">Completion</span>
              <span className="text-[10px] font-black text-emerald-700">▲ +8%</span>
            </div>
          </div>

          {/* Card 2: Technical Skills */}
          <div className="rounded-3xl p-5 border border-white/90 shadow-sm backdrop-blur-xl bg-blue-50/60 flex flex-col justify-between">
            <span className="text-xs font-bold text-blue-900">Technical Skills</span>
            <div className="my-1">
              <span className="text-2xl font-black text-blue-950">10 / 15</span>
            </div>
            <span className="text-[10px] font-semibold text-blue-700">Core competencies</span>
          </div>

          {/* Card 3: Soft Skills */}
          <div className="rounded-3xl p-5 border border-white/90 shadow-sm backdrop-blur-xl bg-amber-50/60 flex flex-col justify-between">
            <span className="text-xs font-bold text-amber-900">Soft Skills</span>
            <div className="my-1">
              <span className="text-2xl font-black text-amber-950">6 / 10</span>
            </div>
            <span className="text-[10px] font-semibold text-amber-700">Communication & Team</span>
          </div>

          {/* Card 4: Career Skills */}
          <div className="rounded-3xl p-5 border border-white/90 shadow-sm backdrop-blur-xl bg-orange-50/60 flex flex-col justify-between">
            <span className="text-xs font-bold text-orange-900">Career Skills</span>
            <div className="my-1">
              <span className="text-2xl font-black text-orange-950">4 / 8</span>
            </div>
            <span className="text-[10px] font-semibold text-orange-700">Portfolio & Pitch</span>
          </div>

          {/* Card 5: Others */}
          <div className="rounded-3xl p-5 border border-white/90 shadow-sm backdrop-blur-xl bg-purple-50/60 flex flex-col justify-between col-span-2 sm:col-span-1">
            <span className="text-xs font-bold text-purple-900">Others</span>
            <div className="my-1">
              <span className="text-2xl font-black text-purple-950">2 / 5</span>
            </div>
            <span className="text-[10px] font-semibold text-purple-700">Elective learning</span>
          </div>
        </div>

        {/* 2-Column Main Section: Your Checklist & Recommended For You (Reference 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Checklist items */}
          <div className="lg:col-span-7 rounded-3xl p-6 sm:p-7 border border-white/90 shadow-sm backdrop-blur-xl bg-white/85 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-base font-black text-stone-900">Your Checklist</h3>
              <span className="text-xs font-bold text-stone-500">{filteredTasks.length} items</span>
            </div>

            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    task.completed
                      ? 'bg-emerald-50/40 border-emerald-300 text-stone-400'
                      : 'bg-white/80 border-stone-200/80 hover:border-emerald-400 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTask(task.id);
                      }}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        task.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <span
                      className={`text-xs sm:text-sm font-bold truncate ${
                        task.completed ? 'line-through text-stone-400' : 'text-stone-900'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {task.category || 'Skill'}
                    </span>
                    <span className="text-[11px] font-bold text-stone-500 hidden sm:inline">
                      {task.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (5 cols): Recommended for You (Reference 2) */}
          <div className="lg:col-span-5 rounded-3xl p-6 sm:p-7 border border-white/90 shadow-sm backdrop-blur-xl bg-white/85 space-y-4 flex flex-col justify-between">
            <h3 className="text-base font-black text-stone-900">Recommended for You</h3>

            <div className="rounded-2xl border border-stone-200/80 bg-white/80 p-5 space-y-4 shadow-xs">
              {/* Course illustration banner */}
              <div className="h-32 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute right-[-10px] bottom-[-10px] opacity-20 pointer-events-none">
                  <BookOpen className="w-32 h-32" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 self-start">
                  Featured
                </span>
                <div>
                  <h4 className="text-sm sm:text-base font-black leading-tight text-white">
                    Machine Learning Basics
                  </h4>
                  <p className="text-[11px] text-blue-100 font-medium mt-0.5">
                    Fundamental algorithms & hands-on models
                  </p>
                </div>
              </div>

              {/* Meta & CTA */}
              <div className="flex items-center justify-between text-xs font-bold text-stone-600">
                <span className="flex items-center gap-1 text-amber-600 font-black">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  4.8
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  2.5h
                </span>

                <button className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-colors">
                  Start Learning →
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 flex items-center justify-between text-xs font-bold text-emerald-900">
              <span>Looking for curated learning materials?</span>
              <a href="/dashboard/resources" className="text-emerald-700 underline font-black">
                View Library
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white shadow-2xl max-w-md w-full p-6 animate-scaleUp space-y-4">
            <h3 className="text-base font-black text-stone-900">Add New Learning Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-black text-stone-600 block mb-1">Task Title</label>
                <input
                  type="text"
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Master React Query caching"
                  className="w-full px-4 py-2.5 text-xs font-bold rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-stone-600 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-stone-300"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Portfolio">Portfolio</option>
                    <option value="Foundation">Foundation</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-stone-600 block mb-1">Due Date</label>
                  <input
                    type="text"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    placeholder="e.g. Due: Nov 25"
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-emerald-600 text-white text-xs font-black"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
