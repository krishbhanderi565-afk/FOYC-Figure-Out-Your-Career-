import React, { useState } from 'react';
import {
  Target,
  Plus,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Clock,
  Calendar,
  AlertCircle,
  Trash2,
  Edit2,
  MoreVertical,
  Sparkles,
  Layers,
  X,
  Flag,
} from 'lucide-react';
import { Milestone, TaskItem } from '../../types/career';

interface GoalChecklistSectionProps {
  milestones: Milestone[];
  tasks: TaskItem[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<TaskItem, 'id'>) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleMilestone: (milestoneId: string) => void;
  onAddMilestone: (milestone: Omit<Milestone, 'id'>) => Promise<Milestone>;
  onUpdateMilestone: (milestoneId: string, updates: Partial<Milestone>) => Promise<void>;
  onDeleteMilestone: (milestoneId: string) => Promise<void>;
}

export const GoalChecklistSection: React.FC<GoalChecklistSectionProps> = ({
  milestones,
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onToggleMilestone,
  onAddMilestone,
  onUpdateMilestone,
  onDeleteMilestone,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'in_progress' | 'completed' | 'upcoming'>('all');
  const [expandedGoalIds, setExpandedGoalIds] = useState<Record<string, boolean>>({});
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [newChecklistText, setNewChecklistText] = useState<Record<string, string>>({});
  const [goalToDelete, setGoalToDelete] = useState<Milestone | null>(null);

  // New Goal Form State
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [goalPriority, setGoalPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [goalTargetDate, setGoalTargetDate] = useState('Month 1');
  const [initialChecklistItems, setInitialChecklistItems] = useState<string[]>(['']);

  // Toggle card expansion
  const toggleExpand = (id: string) => {
    setExpandedGoalIds((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id],
    }));
  };

  const isExpanded = (id: string, idx: number) => {
    if (expandedGoalIds[id] !== undefined) return expandedGoalIds[id];
    // By default expand the first 2 goals
    return idx < 2;
  };

  // Group tasks by milestone
  // If task has milestoneId, match directly; otherwise distribute evenly or show general
  const getTasksForGoal = (milestone: Milestone, idx: number): TaskItem[] => {
    const directMatches = tasks.filter((t) => t.milestoneId === milestone.id);
    if (directMatches.length > 0) return directMatches;

    // Fallback: If no milestoneId assigned (e.g. legacy or handoff imported),
    // allocate a slice of tasks so user has immediate checklist items
    const countPerGoal = Math.max(1, Math.ceil(tasks.length / Math.max(1, milestones.length)));
    const start = idx * countPerGoal;
    return tasks.slice(start, start + countPerGoal);
  };

  // Filter goals
  const filteredMilestones = milestones.filter((m) => {
    if (activeFilter === 'completed') return m.completed || m.status === 'completed';
    if (activeFilter === 'upcoming') return !m.completed && m.status === 'upcoming';
    if (activeFilter === 'in_progress') return !m.completed && m.status !== 'upcoming';
    return true; // 'all'
  });

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    const created = await onAddMilestone({
      title: goalTitle.trim(),
      description: goalDescription.trim(),
      priority: goalPriority,
      stage: 'Skill Development',
      estimatedDuration: goalTargetDate,
      targetDate: goalTargetDate,
      completed: false,
      associatedTasksCount: initialChecklistItems.filter((i) => i.trim()).length,
      status: 'in_progress',
    });

    // Add initial checklist items attached to this milestone
    initialChecklistItems
      .filter((item) => item.trim())
      .forEach((itemText) => {
        onAddTask({
          title: itemText.trim(),
          category: 'Technical',
          priority: goalPriority,
          dueDate: goalTargetDate,
          completed: false,
          milestoneId: created.id,
        });
      });

    // Reset form
    setGoalTitle('');
    setGoalDescription('');
    setGoalPriority('high');
    setGoalTargetDate('Month 1');
    setInitialChecklistItems(['']);
    setIsAddGoalModalOpen(false);
  };

  const handleAddInlineChecklistItem = (milestoneId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = newChecklistText[milestoneId]?.trim();
    if (!text) return;

    onAddTask({
      title: text,
      category: 'Technical',
      priority: 'medium',
      dueDate: 'This Week',
      completed: false,
      milestoneId,
    });

    setNewChecklistText((prev) => ({ ...prev, [milestoneId]: '' }));
  };

  const confirmDeleteGoal = async () => {
    if (!goalToDelete) return;
    await onDeleteMilestone(goalToDelete.id);
    setGoalToDelete(null);
  };

  return (
    <section className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-[0_4px_18px_rgba(0,0,0,0.02)] space-y-6" aria-label="Goal Checklist Section">
      {/* Header with Filters & Add Goal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Goal Checklist</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              {milestones.length} Goals
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5 font-medium">
            Personalized milestones and actionable checklist items
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200/70 text-xs font-semibold">
            {(['all', 'in_progress', 'completed'] as const).map((filterKey) => (
              <button
                key={filterKey}
                type="button"
                onClick={() => setActiveFilter(filterKey)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  activeFilter === filterKey
                    ? 'bg-white text-neutral-900 shadow-sm font-bold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {filterKey.replace('_', ' ')}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsAddGoalModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Goal</span>
          </button>
        </div>
      </div>

      {/* Goal Cards List */}
      {filteredMilestones.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50/50">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">Turn your vision into achievable steps</h3>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mt-1 mb-5">
            Break big career aspirations into structured milestones and manageable daily checklist actions.
          </p>
          <button
            type="button"
            onClick={() => setIsAddGoalModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add My First Goal</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMilestones.map((goal, idx) => {
            const goalTasks = getTasksForGoal(goal, idx);
            const completedCount = goalTasks.filter((t) => t.completed).length;
            const totalCount = goalTasks.length;
            const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : (goal.completed ? 100 : 0);
            const expanded = isExpanded(goal.id, idx);

            return (
              <div
                key={goal.id}
                className={`rounded-2xl border transition-all ${
                  goal.completed
                    ? 'bg-neutral-50/60 border-neutral-200/70'
                    : 'bg-white border-neutral-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-neutral-300'
                }`}
              >
                {/* Goal Main Card Header */}
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1 cursor-pointer" onClick={() => toggleExpand(goal.id)}>
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                        goal.completed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      <Target className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-base font-bold tracking-tight ${goal.completed ? 'line-through text-neutral-500' : 'text-neutral-900'}`}>
                          {goal.title}
                        </h3>

                        {/* Priority Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            goal.priority === 'high'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                              : goal.priority === 'medium'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {goal.priority || 'Medium'} Priority
                        </span>

                        {/* Target Date */}
                        {goal.targetDate && (
                          <span className="text-[11px] font-semibold text-neutral-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            {goal.targetDate}
                          </span>
                        )}
                      </div>

                      {goal.description && (
                        <p className="text-xs text-neutral-500 mt-1 line-clamp-2 font-medium">
                          {goal.description}
                        </p>
                      )}

                      {/* Progress bar inside goal header */}
                      <div className="flex items-center gap-3 mt-3 max-w-md">
                        <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              goal.completed || progressPct === 100
                                ? 'bg-emerald-500'
                                : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-neutral-700">
                          {completedCount} / {totalCount} ({progressPct}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Expand Toggle */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => onToggleMilestone(goal.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                        goal.completed
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      {goal.completed ? 'Completed ✓' : 'Mark Done'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setGoalToDelete(goal)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleExpand(goal.id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all"
                      title={expanded ? 'Collapse Checklist' : 'Expand Checklist'}
                    >
                      {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expandable Actionable Checklist */}
                {expanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-neutral-100 space-y-3 bg-neutral-50/30 rounded-b-2xl">
                    <div className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                      Actionable Checklist Items ({completedCount} of {totalCount} completed)
                    </div>

                    <div className="space-y-2">
                      {goalTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                            task.completed
                              ? 'bg-neutral-50/80 border-neutral-200/60 text-neutral-500'
                              : 'bg-white border-neutral-200 text-neutral-900 shadow-xs'
                          }`}
                        >
                          <label className="flex items-center gap-3 flex-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => onToggleTask(task.id)}
                              className="sr-only"
                            />
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                                task.completed
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'border-neutral-300 hover:border-neutral-500 bg-white'
                              }`}
                            >
                              {task.completed && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <span className={`text-xs font-semibold ${task.completed ? 'line-through text-neutral-400' : 'text-neutral-800'}`}>
                              {task.title}
                            </span>
                          </label>

                          <div className="flex items-center gap-2">
                            {task.dueDate && (
                              <span className="text-[11px] font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                                {task.dueDate}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => onDeleteTask(task.id)}
                              className="text-neutral-400 hover:text-rose-500 p-1 transition-colors"
                              title="Delete Checklist Item"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Inline Add Checklist Item */}
                    <form
                      onSubmit={(e) => handleAddInlineChecklistItem(goal.id, e)}
                      className="flex items-center gap-2 pt-1"
                    >
                      <input
                        type="text"
                        placeholder="Add an actionable step to this goal..."
                        value={newChecklistText[goal.id] || ''}
                        onChange={(e) =>
                          setNewChecklistText((prev) => ({ ...prev, [goal.id]: e.target.value }))
                        }
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white focus:border-neutral-900 outline-none"
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all"
                      >
                        Add Step
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {isAddGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-100 space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-lg font-bold text-neutral-900">Add New Goal</h3>
              <button
                type="button"
                onClick={() => setIsAddGoalModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  Goal Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master React & System Design, Launch B2B SaaS MVP"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-sm font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Briefly state why this goal matters and what success looks like."
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-xs font-medium outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    Priority
                  </label>
                  <select
                    value={goalPriority}
                    onChange={(e) => setGoalPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-800 bg-white outline-none"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    Target Timeframe
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4 Weeks, Month 2, Q1"
                    value={goalTargetDate}
                    onChange={(e) => setGoalTargetDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-800 outline-none"
                  />
                </div>
              </div>

              {/* Initial Actionable Steps */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  Initial Actionable Steps (Optional)
                </label>
                <div className="space-y-2">
                  {initialChecklistItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Action step #${idx + 1}`}
                        value={item}
                        onChange={(e) => {
                          const updated = [...initialChecklistItems];
                          updated[idx] = e.target.value;
                          setInitialChecklistItems(updated);
                        }}
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-neutral-200 outline-none"
                      />
                      {initialChecklistItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setInitialChecklistItems((prev) => prev.filter((_, i) => i !== idx))}
                          className="text-neutral-400 hover:text-rose-500 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setInitialChecklistItems((prev) => [...prev, ''])}
                    className="text-xs font-bold text-neutral-600 hover:text-neutral-900 inline-flex items-center gap-1 mt-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add another step</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddGoalModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-sm"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {goalToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-100 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-neutral-900">Delete Goal?</h4>
              <p className="text-xs text-neutral-500 mt-1">
                Are you sure you want to remove <span className="font-semibold text-neutral-800">"{goalToDelete.title}"</span>? Associated checklist items will also be removed.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setGoalToDelete(null)}
                className="px-3.5 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteGoal}
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
