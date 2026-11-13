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
  Compass,
  Milestone as MilestoneIcon,
  ListTodo,
  Flame,
  FolderGit2,
  Layers,
  BookOpen,
  Target,
  Edit3,
  ShieldCheck,
  UserCheck,
  Lock,
} from 'lucide-react';

export const HandoffPreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { dashboardData, deleteTask, isAuthenticated, updateProfile } = useCareer();
  const [editableTitle, setEditableTitle] = useState(dashboardData.direction.primaryTitle);
  const [editableSummary, setEditableSummary] = useState(dashboardData.direction.summary);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const detailedSkillGaps = (dashboardData.direction as any).detailedSkillGaps || [
    { skill_name: 'Core System Design', current_level: 'Beginner', target_level: 'Intermediate', priority: 'High', explanation: 'Essential for scaling applications.' }
  ];

  const handleCreateDashboardClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleContinueAsGuest = () => {
    setShowAuthModal(false);
    navigate('/dashboard');
  };

  const handleGoToAuth = () => {
    setShowAuthModal(false);
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-[#FDF5EB] flex flex-col text-[#171717]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#17172B]/60 mb-6">
          <Link to="/import" className="hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Stage 7: Import
          </Link>
          <span>/</span>
          <span className="text-[#17172B]">Plan Preview & Customization</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <Badge variant="parrot" size="sm">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#315B28]" />
            Handoff Parsed & Validated
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-[#17172B] tracking-tight leading-[1.12]">
            Preview Your <Highlight color="#FFE76B">Career Blueprint</Highlight>
          </h1>
          <p className="text-base sm:text-lg text-[#17172B]/80 font-semibold">
            Inspect your career direction, skill gaps, milestones, tasks, and daily habits. You can edit any details before finalizing your dashboard.
          </p>
        </div>

        {/* Section 1: Career Direction Card */}
        <Card variant="white" shadowSize="lg" className="p-6 sm:p-8 mb-8 border-3 bg-[#FFFDF8]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#17172B]/15">
            <span className="text-xs font-black uppercase tracking-wider text-[#17172B] flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#315B28]" />
              Primary Career Direction & Executive Rationale
            </span>
            <Badge variant="parrot" size="sm">
              Ready to Populate
            </Badge>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#17172B]/70 mb-1">
                Primary Career Title
              </label>
              <input
                type="text"
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-[#17172B] bg-[#F2F9E9] font-black text-xl text-[#17172B] shadow-[2px_2px_0px_#17172B]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#17172B]/70 mb-1">
                Career Description & Value Proposition
              </label>
              <textarea
                value={editableSummary}
                onChange={(e) => setEditableSummary(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-[#17172B] bg-[#F2F9E9] font-medium text-sm text-[#17172B] shadow-[2px_2px_0px_#17172B]"
              />
            </div>

            {/* Alternatives and Strengths */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#DDF5C5] p-4 rounded-xl border-2 border-[#17172B]">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#17172B]/70 block mb-2">
                  Alternative Paths Explored:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {dashboardData.direction.alternativeTitles.map((alt, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-white border border-[#17172B] text-xs font-bold text-[#17172B]"
                    >
                      {alt}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#DDF5C5] p-4 rounded-xl border-2 border-[#17172B]">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#315B28] block mb-2">
                  Identified Strengths & Transferable Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {dashboardData.direction.strengths.map((str, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-white border border-[#17172B] text-xs font-bold text-[#17172B]"
                    >
                      {str}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Section 2: Skill Gaps Card */}
        <Card variant="white" shadowSize="md" className="p-6 sm:p-8 mb-8 border-2 bg-[#FFFDF8]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#17172B]/15">
            <h3 className="font-extrabold text-base text-[#17172B] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#17172B]" />
              Skill Gap Analysis ({detailedSkillGaps.length})
            </h3>
            <Badge variant="yellow" size="sm">
              Competency Matrix
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {detailedSkillGaps.map((sg: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border-2 border-[#17172B] bg-[#F2F9E9] shadow-[2px_2px_0px_#17172B] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-[#17172B]">{sg.skill_name}</span>
                  <Badge variant={sg.priority === 'High' ? 'parrot' : 'blue'} size="sm">
                    {sg.priority} Priority
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-bold text-[#17172B]/70">
                  <span>Current: <strong>{sg.current_level || 'Beginner'}</strong></span>
                  <span>→</span>
                  <span>Target: <strong>{sg.target_level || 'Intermediate'}</strong></span>
                </div>
                {sg.explanation && (
                  <p className="text-[11px] text-[#17172B]/80 font-medium">
                    {sg.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Section 3: Milestones & Sprint Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Milestones Card */}
          <Card variant="white" shadowSize="md" className="p-6 border-2 bg-[#FFFDF8]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#17172B]/15">
              <h3 className="font-extrabold text-base text-[#17172B] flex items-center gap-2">
                <MilestoneIcon className="w-5 h-5 text-[#17172B]" />
                Roadmap Milestones ({dashboardData.milestones.length})
              </h3>
              <Badge variant="blue" size="sm">Timeline</Badge>
            </div>

            <div className="space-y-3">
              {dashboardData.milestones.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-xl border-2 border-[#17172B] bg-[#F2F9E9] shadow-[2px_2px_0px_#17172B]"
                >
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

          {/* Action Tasks Card */}
          <Card variant="white" shadowSize="md" className="p-6 border-2 bg-[#FFFDF8]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#17172B]/15">
              <h3 className="font-extrabold text-base text-[#17172B] flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-[#17172B]" />
                Action Checklist Tasks ({dashboardData.tasks.length})
              </h3>
              <Badge variant="parrot" size="sm">Checklist</Badge>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {dashboardData.tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl border-2 border-[#17172B] bg-[#F2F9E9] flex items-center justify-between gap-3 shadow-[1.5px_1.5px_0px_#17172B]"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs sm:text-sm text-[#17172B] leading-snug">
                      {task.title}
                    </p>
                    <span className="text-[10px] font-bold text-[#17172B]/60 uppercase mt-0.5 inline-block">
                      {task.category} • Due: {task.dueDate}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200"
                    title="Remove task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Section 4: Habits, Projects & Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Habits */}
          <Card variant="white" shadowSize="sm" className="p-5 border-2 bg-[#FFFDF8] space-y-3">
            <div className="flex items-center justify-between border-b pb-2 border-[#17172B]/10">
              <h4 className="font-extrabold text-sm text-[#17172B] flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#315B28]" /> Habits ({dashboardData.habits.length})
              </h4>
              <Badge variant="parrot" size="sm">Daily</Badge>
            </div>
            <div className="space-y-2 text-xs">
              {dashboardData.habits.map((h) => (
                <div key={h.id} className="p-2.5 rounded-lg bg-[#F2F9E9] border border-[#17172B]">
                  <p className="font-bold text-[#17172B]">{h.title}</p>
                  <span className="text-[10px] text-[#315B28] font-bold">{h.frequency}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Projects */}
          <Card variant="white" shadowSize="sm" className="p-5 border-2 bg-[#FFFDF8] space-y-3">
            <div className="flex items-center justify-between border-b pb-2 border-[#17172B]/10">
              <h4 className="font-extrabold text-sm text-[#17172B] flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4 text-[#17172B]" /> Projects ({dashboardData.projects.length})
              </h4>
              <Badge variant="yellow" size="sm">Capstones</Badge>
            </div>
            <div className="space-y-2 text-xs">
              {dashboardData.projects.map((p) => (
                <div key={p.id} className="p-2.5 rounded-lg bg-[#F2F9E9] border border-[#17172B]">
                  <p className="font-bold text-[#17172B]">{p.title}</p>
                  <span className="text-[10px] text-[#17172B]/60 font-semibold">{(p.skillsDeveloped || []).slice(0, 2).join(', ')}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Resources */}
          <Card variant="white" shadowSize="sm" className="p-5 border-2 bg-[#FFFDF8] space-y-3">
            <div className="flex items-center justify-between border-b pb-2 border-[#17172B]/10">
              <h4 className="font-extrabold text-sm text-[#17172B] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-800" /> Resources ({dashboardData.resources.length})
              </h4>
              <Badge variant="blue" size="sm">Learning</Badge>
            </div>
            <div className="space-y-2 text-xs">
              {dashboardData.resources.map((r) => (
                <div key={r.id} className="p-2.5 rounded-lg bg-[#D7EAFE]/40 border border-[#17172B]">
                  <p className="font-bold text-[#17172B] truncate">{r.title}</p>
                  <span className="text-[10px] text-blue-900 font-bold">{r.type}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bottom Actions Card as required in Section 11 */}
        <Card variant="parrot" shadowSize="lg" className="p-8 text-center space-y-4 border-3 bg-[#B8E986]">
          <h3 className="text-2xl sm:text-3xl font-black text-[#17172B] tracking-tight">
            Ready to initialize your personalized career dashboard?
          </h3>
          <p className="text-sm sm:text-base text-[#17172B]/90 font-semibold max-w-xl mx-auto">
            Your plan has been organized into FOYC's predefined dashboard template. Create your dashboard now to start tracking milestones and habits.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/import">
              <Button variant="secondary" size="lg" className="gap-2 font-black shadow-[4px_4px_0px_#17172B]">
                <Edit3 className="w-4 h-4" />
                <span>Edit My Plan</span>
              </Button>
            </Link>

            <Button
              variant="dark"
              size="lg"
              onClick={handleCreateDashboardClick}
              className="gap-3 font-black text-base shadow-[4px_4px_0px_#171717] bg-[#171717] text-white"
            >
              <Compass className="w-5 h-5 text-[#FFE76B]" />
              <span>Create My Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      </main>

      {/* Delayed Account Save Modal (Section 13) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-[#17172B]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border-3 border-[#17172B] rounded-2xl shadow-[6px_6px_0px_#17172B] max-w-md w-full p-6 space-y-5 animate-scaleUp">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-[#315B28] bg-[#B8E986] px-2.5 py-0.5 rounded-full border border-[#17172B]">
                Save Your Blueprint
              </span>
              <h3 className="text-2xl font-black text-[#17172B] tracking-tight">
                Save Your Personalized Dashboard
              </h3>
              <p className="text-xs sm:text-sm text-[#17172B]/80 font-semibold leading-relaxed">
                Create a free FOYC account to sync your career milestones, task progress, and habit streaks across devices.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <Button
                variant="parrot"
                size="md"
                fullWidth
                onClick={handleGoToAuth}
                className="gap-2 font-black shadow-[3px_3px_0px_#17172B]"
              >
                <Lock className="w-4 h-4" />
                <span>Create Free Account / Sign In</span>
              </Button>

              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={handleContinueAsGuest}
                className="gap-2 font-bold shadow-[2px_2px_0px_#17172B]"
              >
                <UserCheck className="w-4 h-4" />
                <span>Continue as Guest (Store in Browser)</span>
              </Button>
            </div>

            <p className="text-[11px] text-center text-[#17172B]/60 font-semibold">
              Zero risk: your approved draft remains fully intact either way.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
