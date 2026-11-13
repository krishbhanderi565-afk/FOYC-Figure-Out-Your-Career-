import React from 'react';
import { useCareer } from '../../context/CareerContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  Flame,
  CheckCircle2,
  Calendar,
  ArrowRight,
  TrendingUp,
  Target,
  ListTodo,
  ExternalLink,
  Plus,
  BookOpen,
  Award,
  Clock,
  Sparkles,
  Milestone as MilestoneIcon,
} from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';

interface DashboardOutletContext {
  onOpenMobileMenu: () => void;
}

export const OverviewPage: React.FC = () => {
  const { dashboardData, toggleTask, toggleHabit } = useCareer();
  const outletCtx = useOutletContext<DashboardOutletContext | undefined>();

  const completedTasksCount = dashboardData.tasks.filter((t) => t.completed).length;
  const totalTasks = dashboardData.tasks.length || 1;
  const taskProgressPercent = Math.round((completedTasksCount / totalTasks) * 100);

  const completedMilestones = dashboardData.milestones.filter((m) => m.completed).length;
  const totalMilestones = dashboardData.milestones.length || 1;
  const milestoneProgress = Math.round((completedMilestones / totalMilestones) * 100);

  const bestStreak = Math.max(...dashboardData.habits.map((h) => h.currentStreak), 0);
  const activeHabitsCount = dashboardData.habits.filter((h) => h.completedToday).length;

  return (
    <div className="flex-1 flex flex-col">
      {/* 1. GREETING & USER NAME */}
      <DashboardHeader
        onOpenMobileMenu={outletCtx?.onOpenMobileMenu || (() => {})}
        title={`Welcome back, ${dashboardData.profile.preferredName || 'Explorer'}!`}
        subtitle="Here is your active career trajectory and daily momentum."
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl">
        {/* 2. PRIMARY CAREER DIRECTION */}
        <Card variant="yellow" shadowSize="lg" className="p-5 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="dark" size="sm">
                  Active Career Direction
                </Badge>
                <span className="text-xs font-bold text-[#17172B]/60">• Universal Engine</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#17172B] tracking-tight">
                {dashboardData.direction.primaryTitle}
              </h2>
              <p className="text-xs sm:text-base text-[#17172B]/85 font-semibold max-w-3xl leading-relaxed">
                {dashboardData.direction.summary}
              </p>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 pt-2 lg:pt-0">
              <Link to="/dashboard/career" className="flex-1 sm:flex-initial">
                <Button variant="dark" size="md" className="w-full gap-2 text-xs sm:text-sm">
                  <Target className="w-4 h-4 text-[#FFE76B]" />
                  <span>Blueprint</span>
                </Button>
              </Link>
              <Link to="/dashboard/roadmap" className="flex-1 sm:flex-initial">
                <Button variant="secondary" size="md" className="w-full gap-2 text-xs sm:text-sm">
                  <span>Roadmap</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* 3. OVERALL CAREER PROGRESS (2-col on mobile, 4-col on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card variant="white" shadowSize="md" className="p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#17172B]/60 truncate">
                Roadmap
              </span>
              <Badge variant="yellow" size="sm">{milestoneProgress}%</Badge>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-[#17172B] block">
                {completedMilestones} / {totalMilestones}
              </span>
              <span className="text-[11px] sm:text-xs text-[#17172B]/60 font-semibold truncate block">
                Milestones done
              </span>
            </div>
            <div className="w-full bg-[#F2F9E9] h-2 sm:h-2.5 rounded-full border border-[#17172B] mt-3 sm:mt-4 overflow-hidden">
              <div
                className="bg-[#FFE76B] h-full transition-all duration-300 border-r border-[#17172B]"
                style={{ width: `${milestoneProgress}%` }}
              />
            </div>
          </Card>

          <Card variant="white" shadowSize="md" className="p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#17172B]/60 truncate">
                Tasks
              </span>
              <Badge variant="green" size="sm">{taskProgressPercent}%</Badge>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-[#17172B] block">
                {completedTasksCount} / {totalTasks}
              </span>
              <span className="text-[11px] sm:text-xs text-[#17172B]/60 font-semibold truncate block">
                Sprints finished
              </span>
            </div>
            <div className="w-full bg-[#F2F9E9] h-2 sm:h-2.5 rounded-full border border-[#17172B] mt-3 sm:mt-4 overflow-hidden">
              <div
                className="bg-[#DDF5C9] h-full transition-all duration-300 border-r border-[#17172B]"
                style={{ width: `${taskProgressPercent}%` }}
              />
            </div>
          </Card>

          <Card variant="white" shadowSize="md" className="p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#17172B]/60 truncate">
                Streak
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-amber-600 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                <span className="hidden sm:inline">Active</span>
              </span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-[#17172B] block">
                {bestStreak}d
              </span>
              <span className="text-[11px] sm:text-xs text-[#17172B]/60 font-semibold truncate block">
                Top streak
              </span>
            </div>
            <div className="mt-3 sm:mt-4 pt-2 border-t border-[#17172B]/10 flex items-center justify-between text-[11px] sm:text-xs font-bold text-[#17172B]">
              <span>{activeHabitsCount}/{dashboardData.habits.length || 0} today</span>
              <Link to="/habit-tracker" className="text-blue-700 hover:underline">Track</Link>
            </div>
          </Card>

          <Card variant="white" shadowSize="md" className="p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#17172B]/60 truncate">
                Projects
              </span>
              <Badge variant="blue" size="sm">Proof</Badge>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-[#17172B] block">
                {dashboardData.projects.length}
              </span>
              <span className="text-[11px] sm:text-xs text-[#17172B]/60 font-semibold truncate block">
                Proof of work
              </span>
            </div>
            <div className="mt-3 sm:mt-4 pt-2 border-t border-[#17172B]/10 flex items-center justify-between text-[11px] sm:text-xs font-bold text-[#17172B]">
              <span>1 Active</span>
              <Link to="/dashboard/projects" className="text-blue-700 hover:underline">Spec</Link>
            </div>
          </Card>
        </div>

        {/* 4. TODAY'S ACTION CHECKLIST */}
        <Card variant="white" shadowSize="md" className="p-5 sm:p-6">
          <div className="flex items-center justify-between pb-3 sm:pb-4 mb-4 border-b-2 border-[#17172B]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FFE76B] border border-[#17172B] flex items-center justify-center shadow-xs shrink-0">
                <ListTodo className="w-4 h-4 text-[#17172B]" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#17172B]">Today's Action Items</h3>
                <span className="text-[10px] sm:text-[11px] text-[#17172B]/60 font-semibold">
                  Tap to check off
                </span>
              </div>
            </div>
            <Link to="/dashboard/tasks">
              <Button variant="secondary" size="sm" className="text-xs">
                Checklist
              </Button>
            </Link>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {dashboardData.tasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3 sm:p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 min-h-[48px] active:scale-[0.99] ${
                  task.completed
                    ? 'bg-[#F0FDF4] border-emerald-500/60 text-[#17172B]/50'
                    : 'bg-[#FFFDF7] border-[#17172B] hover:bg-[#F2F9E9] shadow-[2px_2px_0px_#17172B]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 ${
                      task.completed
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-[#17172B] bg-white'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <span className={`text-xs sm:text-sm font-bold truncate ${task.completed ? 'line-through' : ''}`}>
                    {task.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white border border-[#17172B]">
                    {task.category}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#17172B]/60 hidden sm:inline">
                    {task.dueDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 5. UPCOMING MILESTONES */}
        <Card variant="white" shadowSize="md" className="p-5 sm:p-8">
          <div className="flex items-center justify-between pb-3 sm:pb-4 mb-4 sm:mb-6 border-b-2 border-[#17172B]">
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-[#17172B]">Active Milestone Progression</h3>
              <p className="text-[11px] sm:text-xs text-[#17172B]/60 font-medium">Foundation to career readiness.</p>
            </div>
            <Link to="/dashboard/roadmap">
              <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                Timeline
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {dashboardData.milestones.map((m, i) => (
              <div
                key={m.id}
                className={`p-3.5 sm:p-4 rounded-xl border-2 ${
                  m.completed
                    ? 'bg-[#F0FDF4] border-emerald-500/80 shadow-[2px_2px_0px_#10B981]'
                    : i === 1
                    ? 'bg-[#FFFDF7] border-[#17172B] shadow-[3px_3px_0px_#FFE76B]'
                    : 'bg-[#FFFDF7] border-[#17172B]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white border border-[#17172B]">
                    {m.stage}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#17172B]/60">{m.estimatedDuration}</span>
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-[#17172B] line-clamp-1">{m.title}</h4>
                <p className="text-[11px] sm:text-xs text-[#17172B]/70 mt-1 line-clamp-2">{m.description}</p>
                <div className="mt-3 pt-2 border-t border-[#17172B]/10 flex items-center justify-between text-[10px] sm:text-[11px] font-extrabold">
                  <span className={m.completed ? 'text-emerald-700 font-black' : 'text-[#17172B]/60'}>
                    {m.completed ? '✓ Completed' : i === 1 ? '● In Progress' : 'Upcoming'}
                  </span>
                  <span>{m.targetDate}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 6. HABIT COMPLETION SUMMARY */}
        <Card variant="white" shadowSize="md" className="p-5 sm:p-6">
          <div className="flex items-center justify-between pb-3 sm:pb-4 mb-4 border-b-2 border-[#17172B]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#526B50] text-white flex items-center justify-center shadow-xs shrink-0">
                <Flame className="w-4 h-4 fill-[#FFE76B] text-[#FFE76B]" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#17172B]">Daily Habit Loops</h3>
                <span className="text-[10px] sm:text-[11px] text-[#17172B]/60 font-semibold">
                  Consistent momentum
                </span>
              </div>
            </div>
            <Link to="/habit-tracker">
              <Button variant="secondary" size="sm" className="text-xs">
                Open Tracker
              </Button>
            </Link>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {dashboardData.habits.length > 0 ? (
              dashboardData.habits.map((habit) => (
                <div
                  key={habit.id}
                  className="p-3 sm:p-3.5 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] flex items-center justify-between shadow-[2px_2px_0px_#171717] gap-3"
                >
                  <div className="min-w-0 pr-2">
                    <h5 className="font-bold text-xs sm:text-sm text-[#17172B] truncate">
                      {habit.title}
                    </h5>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-[#17172B]/60 flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#526B50]" />
                      🔥 {habit.currentStreak}d streak • Target: {habit.targetDaysPerWeek}d/wk
                    </span>
                  </div>

                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className={`min-h-[44px] px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black border-2 transition-all shrink-0 active:scale-95 flex items-center gap-1.5 shadow-xs ${
                      habit.completedToday
                        ? 'bg-[#EDF2E9] text-[#526B50] border-[#526B50]'
                        : 'bg-[#FFE76B] hover:bg-[#FADB3D] text-[#171717] border-[#171717]'
                    }`}
                  >
                    {habit.completedToday ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </>
                    ) : (
                      <span>Mark Today</span>
                    )}
                  </button>
                </div>
              ))
            ) : (
              <div className="p-5 rounded-xl border border-dashed border-[#17172B]/30 text-center text-xs font-medium text-[#17172B]/70 space-y-1">
                <p>No active routines configured yet.</p>
                <Link to="/habit-tracker" className="text-[#526B50] font-bold underline inline-block">
                  + Add your first habit in tracker
                </Link>
              </div>
            )}
          </div>
        </Card>

        {/* 7. SKILL DEVELOPMENT PROGRESS */}
        <Card variant="white" shadowSize="md" className="p-5 sm:p-6">
          <div className="flex items-center justify-between pb-3 sm:pb-4 mb-4 border-b-2 border-[#17172B]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#EDF2E9] border border-[#A8B99A] flex items-center justify-center shrink-0">
                <Award className="w-4 h-4 text-[#526B50]" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#17172B]">Skill Development Progress</h3>
                <span className="text-[10px] sm:text-[11px] text-[#17172B]/60 font-semibold">
                  Closing gap to target mastery
                </span>
              </div>
            </div>
            <Link to="/dashboard/skills">
              <Button variant="secondary" size="sm" className="text-xs">
                Skills Engine
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Existing Competencies */}
            <div className="p-3.5 rounded-xl bg-[#FFFDF8] border border-[#E8E5DE] space-y-2">
              <div className="flex items-center justify-between text-xs font-black uppercase text-[#526B50]">
                <span>Validated Strengths</span>
                <Badge variant="green" size="sm">Active</Badge>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {dashboardData.direction.existingSkills.length > 0 ? (
                  dashboardData.direction.existingSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#EDF2E9] text-[#526B50] border border-[#A8B99A]"
                    >
                      ✓ {sk}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#777777]">None specified</span>
                )}
              </div>
            </div>

            {/* Target Skill Gaps */}
            <div className="p-3.5 rounded-xl bg-[#FFFDF8] border border-[#E8E5DE] space-y-2">
              <div className="flex items-center justify-between text-xs font-black uppercase text-[#333333]">
                <span>Target Skill Gaps</span>
                <Badge variant="yellow" size="sm">In Progress</Badge>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {dashboardData.direction.skillGaps.length > 0 ? (
                  dashboardData.direction.skillGaps.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FFFDF7] text-[#171717] border border-[#171717]"
                    >
                      ● {sk}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#777777]">Core stack complete</span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* 8. WEEKLY ACTIVITY REVIEW */}
        <Card variant="white" shadowSize="md" className="p-5 sm:p-6">
          <div className="flex items-center justify-between pb-3 sm:pb-4 mb-4 border-b-2 border-[#17172B]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FFE76B] border border-[#171717] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-[#171717]" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#171717]">Weekly Activity Review</h3>
                <span className="text-[10px] sm:text-[11px] text-[#171717]/60 font-semibold">
                  Reflect, calibrate and stay focused
                </span>
              </div>
            </div>
            <Link to="/dashboard/review">
              <Button variant="secondary" size="sm" className="text-xs">
                Log Review
              </Button>
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#E8E5DE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-bold text-[#171717]">
                Last Calibrated: <span className="font-medium text-[#555555]">{dashboardData.direction.lastReassessedDate || 'This week'}</span>
              </p>
              <p className="text-xs text-[#555555]">
                Weekly calibration keeps your career trajectory aligned with market opportunities and your actual energy.
              </p>
            </div>
            <Link to="/dashboard/review" className="shrink-0">
              <Button variant="primary" size="sm" className="w-full sm:w-auto text-xs bg-[#526B50] hover:bg-[#435942] text-white border-[#526B50]">
                Conduct Weekly Review
              </Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
};
