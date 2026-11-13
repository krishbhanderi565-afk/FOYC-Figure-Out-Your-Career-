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
  Sparkles,
  ListTodo,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const OverviewPage: React.FC = () => {
  const { dashboardData, toggleTask, toggleHabit } = useCareer();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const completedTasksCount = dashboardData.tasks.filter((t) => t.completed).length;
  const totalTasks = dashboardData.tasks.length || 1;
  const taskProgressPercent = Math.round((completedTasksCount / totalTasks) * 100);

  const completedMilestones = dashboardData.milestones.filter((m) => m.completed).length;
  const totalMilestones = dashboardData.milestones.length || 1;
  const milestoneProgress = Math.round((completedMilestones / totalMilestones) * 100);

  const bestStreak = Math.max(...dashboardData.habits.map((h) => h.currentStreak), 0);

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        title={`Welcome back, ${dashboardData.profile.preferredName || 'Explorer'}!`}
        subtitle="Here is your active career trajectory and daily momentum."
      />

      <main className="p-4 sm:p-8 space-y-8 max-w-7xl">
        {/* Mission Banner Card */}
        <Card variant="yellow" shadowSize="lg" className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="dark" size="sm">
                  Active Career Direction
                </Badge>
                <span className="text-xs font-bold text-[#17172B]/60">• Updated recently</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#17172B] tracking-tight">
                {dashboardData.direction.primaryTitle}
              </h2>
              <p className="text-sm sm:text-base text-[#17172B]/85 font-semibold max-w-3xl leading-relaxed">
                {dashboardData.direction.summary}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link to="/dashboard/career">
                <Button variant="dark" size="md" className="gap-2">
                  <Target className="w-4 h-4 text-[#FFE76B]" />
                  Career Blueprint
                </Button>
              </Link>
              <Link to="/dashboard/roadmap">
                <Button variant="secondary" size="md" className="gap-2">
                  Roadmap
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* 4 Stat Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card variant="white" shadowSize="md" className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#17172B]/60">
                Roadmap Progress
              </span>
              <Badge variant="yellow" size="sm">{milestoneProgress}%</Badge>
            </div>
            <div>
              <span className="text-3xl font-black text-[#17172B] block">
                {completedMilestones} / {totalMilestones}
              </span>
              <span className="text-xs text-[#17172B]/60 font-semibold">Milestone phases finished</span>
            </div>
            <div className="w-full bg-[#FFF8E9] h-2.5 rounded-full border border-[#17172B] mt-4 overflow-hidden">
              <div
                className="bg-[#FFE76B] h-full transition-all duration-300 border-r border-[#17172B]"
                style={{ width: `${milestoneProgress}%` }}
              />
            </div>
          </Card>

          <Card variant="white" shadowSize="md" className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#17172B]/60">
                Tasks Completed
              </span>
              <Badge variant="green" size="sm">{taskProgressPercent}%</Badge>
            </div>
            <div>
              <span className="text-3xl font-black text-[#17172B] block">
                {completedTasksCount} / {totalTasks}
              </span>
              <span className="text-xs text-[#17172B]/60 font-semibold">Sprint items resolved</span>
            </div>
            <div className="w-full bg-[#FFF8E9] h-2.5 rounded-full border border-[#17172B] mt-4 overflow-hidden">
              <div
                className="bg-[#DDF5C9] h-full transition-all duration-300 border-r border-[#17172B]"
                style={{ width: `${taskProgressPercent}%` }}
              />
            </div>
          </Card>

          <Card variant="white" shadowSize="md" className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#17172B]/60">
                Active Streak
              </span>
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-600" /> Top Habit
              </span>
            </div>
            <div>
              <span className="text-3xl font-black text-[#17172B] block">
                {bestStreak} Days
              </span>
              <span className="text-xs text-[#17172B]/60 font-semibold">Consistent daily focus</span>
            </div>
            <div className="mt-4 pt-2 border-t border-[#17172B]/10 flex items-center justify-between text-xs font-bold text-[#17172B]">
              <span>Consistency: 86%</span>
              <Link to="/dashboard/habits" className="text-blue-700 hover:underline">View All</Link>
            </div>
          </Card>

          <Card variant="white" shadowSize="md" className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#17172B]/60">
                Capstone Projects
              </span>
              <Badge variant="blue" size="sm">Portfolio</Badge>
            </div>
            <div>
              <span className="text-3xl font-black text-[#17172B] block">
                {dashboardData.projects.length} Projects
              </span>
              <span className="text-xs text-[#17172B]/60 font-semibold">Practical proof of work</span>
            </div>
            <div className="mt-4 pt-2 border-t border-[#17172B]/10 flex items-center justify-between text-xs font-bold text-[#17172B]">
              <span>1 In Progress</span>
              <Link to="/dashboard/projects" className="text-blue-700 hover:underline">View Spec</Link>
            </div>
          </Card>
        </div>

        {/* 2 Column Layout: Today Checklist & Habits */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Today's Tasks */}
          <div className="lg:col-span-7">
            <Card variant="white" shadowSize="md" className="p-6">
              <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-[#17172B]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FFE76B] border border-[#17172B] flex items-center justify-center">
                    <ListTodo className="w-4 h-4 text-[#17172B]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-[#17172B]">Today's Action Items</h3>
                    <span className="text-[11px] text-[#17172B]/60 font-semibold">
                      Click to mark complete
                    </span>
                  </div>
                </div>
                <Link to="/dashboard/tasks">
                  <Button variant="secondary" size="sm" className="text-xs">
                    Manage Checklist
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {dashboardData.tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      task.completed
                        ? 'bg-[#F0FDF4] border-emerald-500/60 text-[#17172B]/50'
                        : 'bg-[#FFFDF7] border-[#17172B] hover:bg-[#FFF8E9] shadow-[2px_2px_0px_#17172B]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                          task.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-[#17172B]'
                        }`}
                      >
                        {task.completed && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <span className={`text-xs sm:text-sm font-bold truncate ${task.completed ? 'line-through' : ''}`}>
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white border border-[#17172B]">
                        {task.category}
                      </span>
                      <span className="text-[11px] font-bold text-[#17172B]/60 hidden sm:inline">
                        {task.dueDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Daily Habit Streaks */}
          <div className="lg:col-span-5">
            <Card variant="white" shadowSize="md" className="p-6">
              <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-[#17172B]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#B8E986] border border-[#17172B] flex items-center justify-center">
                    <Flame className="w-4 h-4 text-[#D97706] fill-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-[#17172B]">Daily Habit Loops</h3>
                    <span className="text-[11px] text-[#17172B]/60 font-semibold">
                      Consistency builds mastery
                    </span>
                  </div>
                </div>
                <Link to="/dashboard/habits">
                  <Button variant="secondary" size="sm" className="text-xs">
                    Tracker
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {dashboardData.habits.map((habit) => (
                  <div
                    key={habit.id}
                    className="p-3.5 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] flex items-center justify-between shadow-[2px_2px_0px_#17172B]"
                  >
                    <div className="min-w-0 pr-2">
                      <h5 className="font-bold text-xs sm:text-sm text-[#17172B] truncate">
                        {habit.title}
                      </h5>
                      <span className="text-[11px] font-semibold text-[#17172B]/60">
                        🔥 {habit.currentStreak} day streak • Target: {habit.targetDaysPerWeek}d/wk
                      </span>
                    </div>

                    <button
                      onClick={() => toggleHabit(habit.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black border-2 transition-all shrink-0 ${
                        habit.completedToday
                          ? 'bg-[#DDF5C9] text-emerald-950 border-[#17172B]'
                          : 'bg-white hover:bg-[#FFE76B] text-[#17172B] border-[#17172B]'
                      }`}
                    >
                      {habit.completedToday ? '✓ Done' : 'Mark'}
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Active Roadmap Timeline Mini Preview */}
        <Card variant="white" shadowSize="md" className="p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-[#17172B]">
            <div>
              <h3 className="font-extrabold text-lg text-[#17172B]">Active Milestone Progression</h3>
              <p className="text-xs text-[#17172B]/60 font-medium">From foundational mastery to career readiness.</p>
            </div>
            <Link to="/dashboard/roadmap">
              <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                View Full Timeline
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardData.milestones.map((m, i) => (
              <div
                key={m.id}
                className={`p-4 rounded-xl border-2 ${
                  m.completed
                    ? 'bg-[#F0FDF4] border-emerald-500/80 shadow-[2px_2px_0px_#10B981]'
                    : i === 1
                    ? 'bg-[#FFFDF7] border-[#17172B] shadow-[4px_4px_0px_#FFE76B]'
                    : 'bg-[#FFFDF7] border-[#17172B]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white border border-[#17172B]">
                    {m.stage}
                  </span>
                  <span className="text-[11px] font-bold text-[#17172B]/60">{m.estimatedDuration}</span>
                </div>
                <h4 className="font-bold text-sm text-[#17172B] line-clamp-1">{m.title}</h4>
                <p className="text-xs text-[#17172B]/70 mt-1 line-clamp-2">{m.description}</p>
                <div className="mt-4 pt-2 border-t border-[#17172B]/10 flex items-center justify-between text-[11px] font-extrabold">
                  <span className={m.completed ? 'text-emerald-700' : 'text-[#17172B]/60'}>
                    {m.completed ? '✓ Completed' : i === 1 ? '● In Progress' : 'Upcoming'}
                  </span>
                  <span>{m.targetDate}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};
