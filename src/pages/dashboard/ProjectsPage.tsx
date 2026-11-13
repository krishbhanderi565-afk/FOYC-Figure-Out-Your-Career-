import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  FolderGit2,
  ExternalLink,
  Plus,
  Calendar,
  CheckCircle2,
  Code2,
  Trophy,
  Trash2,
} from 'lucide-react';
import { ProjectItem } from '../../types/career';

export const ProjectsPage: React.FC = () => {
  const { dashboardData } = useCareer();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillsStr, setSkillsStr] = useState('');
  const [targetDate, setTargetDate] = useState('Month 3');
  const [projectUrl, setProjectUrl] = useState('');
  const [status, setStatus] = useState<ProjectItem['status']>('planned');

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
      achievements: ['Project architecture specified'],
    };

    dashboardData.projects.unshift(newProject);
    setTitle('');
    setDescription('');
    setSkillsStr('');
    setProjectUrl('');
    setShowAddModal(false);
  };

  const handleDeleteProject = (id: string) => {
    dashboardData.projects = dashboardData.projects.filter((p) => p.id !== id);
    // trigger re-render
    setTitle((prev) => prev);
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        onOpenMobileMenu={() => {}}
        title="Projects & Portfolio Proof"
        subtitle="Tangible proof-of-work capstones to demonstrate real competence to employers."
      />

      <main className="p-4 sm:p-8 space-y-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-[#17172B]/80 font-medium max-w-2xl">
            "Don't tell people you know how to build. Show them the deployed URL, test suite, and source code."
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="gap-1.5 font-bold shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Capstone Project
          </Button>
        </div>

        {/* Modal: Add Project */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border-3 border-[#17172B] shadow-[8px_8px_0px_#17172B] p-6 sm:p-8 max-w-lg w-full animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#17172B]">
                <h3 className="font-black text-xl text-[#17172B]">Add Proof-of-Work Project</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-lg bg-[#F2F9E9] border border-[#17172B] font-black text-sm flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Distributed WebSocket Telemetry Engine"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-semibold text-sm focus:ring-2 focus:ring-[#FFE76B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1">
                    Problem & Core Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Explain what practical customer pain point this project solves..."
                    className="w-full p-2.5 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-medium text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1">
                    Skills Developed (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={skillsStr}
                    onChange={(e) => setSkillsStr(e.target.value)}
                    placeholder="e.g. TypeScript, Docker, PostgreSQL, Next.js"
                    className="w-full px-4 py-2 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-semibold text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-bold text-xs"
                    >
                      <option value="planned">Planned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1">
                      Target Completion Date
                    </label>
                    <input
                      type="text"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      placeholder="e.g. Month 3, End of Sprint"
                      className="w-full px-3 py-2 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-semibold text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1">
                    GitHub / Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={projectUrl}
                    onChange={(e) => setProjectUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-semibold text-xs"
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
                    Save Capstone
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {dashboardData.projects.map((proj, idx) => {
            const statusVariants = {
              'in-progress': 'bg-[#FFE76B] text-[#17172B]',
              planned: 'bg-[#D7EAFE] text-[#17172B]',
              completed: 'bg-[#DDF5C9] text-emerald-950',
            };

            return (
              <Card
                key={proj.id}
                variant="white"
                shadowSize="lg"
                className="p-6 sm:p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-[#17172B]">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-[#F2F9E9] border-2 border-[#17172B] flex items-center justify-center">
                        <FolderGit2 className="w-5 h-5 text-[#17172B]" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-[#17172B]/70">
                        Capstone 0{idx + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border border-[#17172B] ${statusVariants[proj.status]}`}>
                        {proj.status.replace('-', ' ')}
                      </span>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-[#17172B] mb-2 leading-snug">
                    {proj.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#17172B]/80 font-medium mb-6 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Skills being developed */}
                  <div className="mb-6">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#17172B]/60 block mb-2">
                      Skills Demonstrated
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.skillsDeveloped.map((sk) => (
                        <span
                          key={sk}
                          className="px-2.5 py-0.5 rounded-md bg-[#F2F9E9] border border-[#17172B] text-xs font-bold text-[#17172B]"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Achievements if any */}
                  {proj.achievements && proj.achievements.length > 0 && (
                    <div className="bg-[#FFFDF7] p-3.5 rounded-xl border border-[#17172B]/40 mb-6 space-y-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#17172B]/60 block">
                        Verified Milestones
                      </span>
                      {proj.achievements.map((ach, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-bold text-[#17172B]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{ach}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer bar */}
                <div className="pt-4 border-t-2 border-[#17172B] flex items-center justify-between text-xs font-bold text-[#17172B]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Target: {proj.targetDate}
                  </span>

                  {proj.projectUrl ? (
                    <a
                      href={proj.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#17172B] hover:underline flex items-center gap-1 font-black"
                    >
                      <span>Repository</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-[#17172B]/40 italic">Link pending launch</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};
