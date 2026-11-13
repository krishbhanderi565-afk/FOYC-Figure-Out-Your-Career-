import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCareer } from '../context/CareerContext';
import { Navbar } from '../components/common/Navbar';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Highlight } from '../components/common/Highlight';
import {
  CheckCircle2,
  Trash2,
  Plus,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Milestone as MilestoneIcon,
  ListTodo,
  Flame,
  FolderGit2,
  Layers,
} from 'lucide-react';

export const HandoffPreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { dashboardData, deleteTask } = useCareer();
  const [editableTitle, setEditableTitle] = useState(dashboardData.direction.primaryTitle);
  const [editableSummary, setEditableSummary] = useState(dashboardData.direction.summary);

  const handleApprove = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-[#FFF8E9] flex flex-col text-[#17172B]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#17172B]/60 mb-6">
          <Link to="/import" className="hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Stage 7: Import
          </Link>
          <span>/</span>
          <span className="text-[#17172B]">Handoff Review & Edit</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge variant="green" dot className="mb-3">
            Handoff Parsed Successfully
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#17172B] tracking-tight leading-[1.12]">
            Review & approve your <Highlight color="#FFE76B">career blueprint.</Highlight>
          </h1>
          <p className="text-base sm:text-lg text-[#17172B]/75 font-medium mt-3">
            Inspect the parsed roadmap, tasks, and habits below. You can fine-tune or approve them before we launch your personal workspace.
          </p>
        </div>

        {/* Top Approved Direction Card */}
        <Card variant="yellow" shadowSize="lg" className="p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#17172B]">
            <span className="text-xs font-black uppercase tracking-wider text-[#17172B]">
              Primary Career Direction
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white border border-[#17172B]">
              Ready for Dashboard
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#17172B]/70 mb-1">
                Career Title
              </label>
              <input
                type="text"
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-[#17172B] bg-white font-black text-xl text-[#17172B] shadow-[2px_2px_0px_#17172B]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#17172B]/70 mb-1">
                Executive Direction Summary
              </label>
              <textarea
                value={editableSummary}
                onChange={(e) => setEditableSummary(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 rounded-xl border-2 border-[#17172B] bg-white font-medium text-sm text-[#17172B] shadow-[2px_2px_0px_#17172B]"
              />
            </div>

            {/* Alternatives and Strengths pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white/80 p-3.5 rounded-xl border border-[#17172B]">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#17172B]/60 block mb-2">
                  Alternative Paths Explored
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {dashboardData.direction.alternativeTitles.map((alt, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-md bg-[#FFF8E9] border border-[#17172B] text-xs font-bold">
                      {alt}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white/80 p-3.5 rounded-xl border border-[#17172B]">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#17172B]/60 block mb-2">
                  Identified Strengths
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {dashboardData.direction.strengths.map((str, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-md bg-[#DDF5C9] border border-[#17172B] text-xs font-bold">
                      {str}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 2-Column Section: Milestones & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Milestones Card */}
          <Card variant="white" shadowSize="md" className="p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#17172B]">
              <h3 className="font-extrabold text-base text-[#17172B] flex items-center gap-2">
                <MilestoneIcon className="w-5 h-5 text-[#17172B]" />
                Parsed Milestones ({dashboardData.milestones.length})
              </h3>
              <Badge variant="blue" size="sm">Roadmap</Badge>
            </div>

            <div className="space-y-3">
              {dashboardData.milestones.map((m, idx) => (
                <div key={m.id} className="p-3.5 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] shadow-[2px_2px_0px_#17172B]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#FFE76B] border border-[#17172B]">
                      {m.stage}
                    </span>
                    <span className="text-xs font-bold text-[#17172B]/60">{m.estimatedDuration}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-[#17172B]">{m.title}</h4>
                  <p className="text-xs text-[#17172B]/75 mt-1 font-medium">{m.description}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Actionable Tasks Card */}
          <Card variant="white" shadowSize="md" className="p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#17172B]">
              <h3 className="font-extrabold text-base text-[#17172B] flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-[#17172B]" />
                Sprint Tasks ({dashboardData.tasks.length})
              </h3>
              <Badge variant="pink" size="sm">Checklist</Badge>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {dashboardData.tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] flex items-center justify-between gap-3 shadow-[1.5px_1.5px_0px_#17172B]"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs sm:text-sm text-[#17172B] leading-snug">{task.title}</p>
                    <span className="text-[10px] font-bold text-[#17172B]/50 uppercase mt-0.5 inline-block">
                      {task.category} • Due: {task.dueDate}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200"
                    title="Remove task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 2-Column Section: Habits & Capstones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Habits */}
          <Card variant="white" shadowSize="md" className="p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#17172B]">
              <h3 className="font-extrabold text-base text-[#17172B] flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#D97706]" />
                Daily & Weekly Habits ({dashboardData.habits.length})
              </h3>
              <Badge variant="green" size="sm">Consistency</Badge>
            </div>

            <div className="space-y-3">
              {dashboardData.habits.map((h) => (
                <div key={h.id} className="p-3.5 rounded-xl border-2 border-[#17172B] bg-[#F7FEE7] flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-[#17172B]">{h.title}</h5>
                    <span className="text-[10px] text-[#17172B]/60 font-semibold">
                      Target: {h.targetDaysPerWeek} days/week • Frequency: {h.frequency}
                    </span>
                  </div>
                  <span className="text-xs font-black text-[#17172B] px-2 py-1 rounded-md bg-white border border-[#17172B]">
                    🔥 0 Streak
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Projects */}
          <Card variant="white" shadowSize="md" className="p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#17172B]">
              <h3 className="font-extrabold text-base text-[#17172B] flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-[#17172B]" />
                Portfolio Capstones ({dashboardData.projects.length})
              </h3>
              <Badge variant="lavender" size="sm">Proof of Work</Badge>
            </div>

            <div className="space-y-3">
              {dashboardData.projects.map((proj) => (
                <div key={proj.id} className="p-3.5 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] shadow-[2px_2px_0px_#17172B]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#E8DDFF] border border-[#17172B]">
                      {proj.status}
                    </span>
                    <span className="text-xs font-bold text-[#17172B]/60">Target: {proj.targetDate}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-[#17172B]">{proj.title}</h4>
                  <p className="text-xs text-[#17172B]/75 mt-1 font-medium">{proj.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Approval Bottom Card */}
        <Card variant="pink" shadowSize="lg" className="p-8 text-center flex flex-col items-center justify-center">
          <h3 className="text-2xl sm:text-3xl font-black text-[#17172B] tracking-tight mb-2">
            Ready to initialize your personal career command centre?
          </h3>
          <p className="text-sm sm:text-base text-[#17172B]/80 font-medium max-w-xl mx-auto mb-6">
            Everything is configured. Proceed to save your plan and begin tracking your daily momentum.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              variant="dark"
              size="lg"
              onClick={handleApprove}
              className="gap-3 font-extrabold px-8 shadow-[5px_5px_0px_#0A0A14]"
            >
              <Sparkles className="w-5 h-5 text-[#FFE76B]" />
              Approve Plan & Launch Dashboard
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Link to="/import">
              <Button variant="secondary" size="md">
                Edit Raw Handoff
              </Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
};
