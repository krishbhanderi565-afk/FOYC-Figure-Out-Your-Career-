import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import {
  FolderGit2,
  ExternalLink,
  Plus,
  Calendar,
  CheckCircle2,
  Code2,
  Trophy,
  Trash2,
  ArrowRight,
  Sparkles,
  Layers,
  X,
} from 'lucide-react';
import { ProjectItem } from '../../types/career';
import { useOutletContext } from 'react-router-dom';

interface DashboardOutletContext {
  onOpenMobileMenu: () => void;
}

export const ProjectsPage: React.FC = () => {
  const { dashboardData, isDemoMode } = useCareer();
  const outletCtx = useOutletContext<DashboardOutletContext | undefined>();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillsStr, setSkillsStr] = useState('');
  const [targetDate, setTargetDate] = useState('Month 3');
  const [projectUrl, setProjectUrl] = useState('');
  const [status, setStatus] = useState<ProjectItem['status']>('planned');

  const rawProjects = dashboardData?.projects || [];
  const projects = rawProjects.length > 0
    ? rawProjects
    : (isDemoMode
        ? [
            {
              id: 'p1',
              title: 'Career Roadmap Planner App',
              description: 'Interactive visual workflow platform with real-time state sync and custom themes.',
              skillsDeveloped: ['Web App', 'React.js', 'Tailwind'],
              status: 'completed' as const,
              targetDate: 'Nov 2026',
              projectUrl: 'https://github.com',
            },
            {
              id: 'p2',
              title: 'Skill Tracker Dashboard',
              description: 'Analytics engine calculating habit streaks, skill mastery points, and weekly review summaries.',
              skillsDeveloped: ['SaaS App', 'TypeScript', 'Node.js'],
              status: 'completed' as const,
              targetDate: 'Dec 2026',
            },
            {
              id: 'p3',
              title: 'AI Career Coach',
              description: 'AI-guided prompt generator and intelligent handoff parser for personalized growth blueprints.',
              skillsDeveloped: ['AI Tool', 'Next.js', 'LLMs'],
              status: 'in-progress' as const,
              targetDate: 'Jan 2027',
            },
          ]
        : []);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProject: ProjectItem = {
      id: `p-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      skillsDeveloped: skillsStr.split(',').map((s) => s.trim()).filter(Boolean),
      status,
      targetDate,
      projectUrl: projectUrl.trim() || undefined,
      achievements: ['Core architecture implemented'],
    };

    dashboardData.projects.unshift(newProject);
    setTitle('');
    setDescription('');
    setSkillsStr('');
    setProjectUrl('');
    setShowAddModal(false);
  };

  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const portfolioPct = projects.length > 0 ? Math.round((completedProjects / projects.length) * 100) : 85;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <DashboardHeader
        onOpenMobileMenu={outletCtx?.onOpenMobileMenu || (() => {})}
        title="Projects & Portfolio"
        subtitle="Showcase your skills and achievements."
      />

      <main className="px-4 sm:px-8 pb-12 space-y-6 max-w-[1400px] w-full mx-auto">
        {/* Top Header Controls (Reference 2 Bottom-Right) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl border border-white/90 shadow-sm backdrop-blur-xl bg-white/85">
          <div>
            <h2 className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
              Capstone Portfolio Showcase
            </h2>
            <p className="text-xs text-stone-500 font-semibold">
              Live proof-of-work to prove real competence to employers and collaborators.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
        </div>

        {/* 2-Column Main Section (Reference 2 Bottom-Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (8 cols): Your Projects */}
          <div className="lg:col-span-8 rounded-3xl p-6 sm:p-7 border border-white/90 shadow-sm backdrop-blur-xl bg-white/85 space-y-5 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-stone-900">Your Projects</h3>
              </div>

              <span className="text-xs font-bold text-stone-500">{projects.length} Total</span>
            </div>

            {/* Project Cards (Reference 2) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.map((proj) => {
                const isCompleted = proj.status === 'completed';
                return (
                  <div
                    key={proj.id}
                    className="rounded-2xl p-4 bg-white/80 border border-stone-200/80 hover:border-emerald-300 shadow-2xs transition-all flex flex-col justify-between space-y-3 group"
                  >
                    {/* Thumbnail mock header */}
                    <div className="h-24 rounded-xl bg-gradient-to-br from-stone-900 via-stone-800 to-emerald-950 p-3 flex flex-col justify-between relative overflow-hidden text-white">
                      <div className="flex items-center justify-between">
                        <Code2 className="w-4 h-4 text-emerald-400" />
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                            isCompleted
                              ? 'bg-emerald-500 text-white'
                              : 'bg-amber-400 text-stone-950'
                          }`}
                        >
                          {isCompleted ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                      <span className="text-xs font-black text-white leading-tight line-clamp-1">
                        {proj.title}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-1.5 flex-1">
                      <h4 className="text-xs font-black text-stone-900 group-hover:text-emerald-700 transition-colors">
                        {proj.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 font-medium line-clamp-2 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      {proj.skillsDeveloped.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-stone-100 text-stone-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Motivational Banner at bottom (Reference 2) */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 flex items-center justify-between text-xs font-bold text-emerald-900">
              <span className="flex items-center gap-2">
                <span>⭐</span>
                <span>Great work! Your portfolio is looking strong.</span>
              </span>
              <span className="text-[11px] text-emerald-700 hidden sm:inline">Active Capstones</span>
            </div>
          </div>

          {/* Right Column (4 cols): Portfolio Stats Donut (Reference 2) */}
          <div className="lg:col-span-4 rounded-3xl p-6 sm:p-7 border border-white/90 shadow-sm backdrop-blur-xl bg-white/85 space-y-4 flex flex-col justify-between">
            <h3 className="text-base font-black text-stone-900">Portfolio Stats</h3>

            {/* Center Donut with 85% */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="4"
                    strokeDasharray={`${portfolioPct * 0.88}, 88`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-stone-900 tracking-tight">
                    {portfolioPct}%
                  </span>
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">
                    Readiness
                  </span>
                </div>
              </div>
            </div>

            {/* Stat counts list */}
            <div className="space-y-3 w-full border-t border-stone-100 pt-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-2 text-stone-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Projects
                </span>
                <span className="text-stone-900 font-black">{projects.length}</span>
              </div>

              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-2 text-stone-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  Skills Verified
                </span>
                <span className="text-stone-900 font-black">12+</span>
              </div>

              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-2 text-stone-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  Experience Equivalent
                </span>
                <span className="text-stone-900 font-black">2 yrs</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white shadow-2xl max-w-md w-full p-6 animate-scaleUp space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-base font-black text-stone-900">Add Capstone Project</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-full text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div>
                <label className="text-xs font-black text-stone-600 block mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Next-Gen Portfolio Engine"
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs font-black text-stone-600 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key features and problem solved..."
                  className="w-full px-3.5 py-2 text-xs font-medium rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs font-black text-stone-600 block mb-1">Skills Developed (comma separated)</label>
                <input
                  type="text"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  placeholder="e.g. React.js, Tailwind, TypeScript"
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-stone-600 block mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-stone-300"
                  >
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-stone-600 block mb-1">Target Horizon</label>
                  <input
                    type="text"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    placeholder="e.g. Month 3"
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
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
