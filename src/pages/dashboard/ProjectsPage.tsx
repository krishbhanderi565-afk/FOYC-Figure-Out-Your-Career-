import React from 'react';
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
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { dashboardData } = useCareer();

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
            onClick={() => alert('New capstone modal opened. In production, this saves to projects table.')}
            className="gap-1.5 font-bold shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Capstone Project
          </Button>
        </div>

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
                      <div className="w-9 h-9 rounded-xl bg-[#FFF8E9] border-2 border-[#17172B] flex items-center justify-center">
                        <FolderGit2 className="w-5 h-5 text-[#17172B]" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-[#17172B]/70">
                        Capstone 0{idx + 1}
                      </span>
                    </div>

                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border border-[#17172B] ${statusVariants[proj.status]}`}>
                      {proj.status.replace('-', ' ')}
                    </span>
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
                          className="px-2.5 py-0.5 rounded-md bg-[#FFF8E9] border border-[#17172B] text-xs font-bold text-[#17172B]"
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
