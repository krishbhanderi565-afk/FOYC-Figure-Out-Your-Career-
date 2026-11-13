import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Filter,
  Sparkles,
  ShieldCheck,
  Video,
  FileText,
  GraduationCap,
} from 'lucide-react';
import { ResourceItem } from '../../types/career';

export const ResourcesPage: React.FC = () => {
  const { dashboardData } = useCareer();
  const [filterType, setFilterType] = useState<string>('All');

  // Curated resource library aligned with active career direction
  const allResources: ResourceItem[] = [
    ...dashboardData.resources,
    {
      id: 'res-extra-1',
      title: 'Full-Stack Modern Web Developer Roadmap',
      type: 'Documentation',
      provider: 'Roadmap.sh',
      url: 'https://roadmap.sh',
      isVerified: true,
      isFree: true,
      estimatedHours: 15,
    },
    {
      id: 'res-extra-2',
      title: 'System Design Primer & Architectural Patterns',
      type: 'Practice',
      provider: 'GitHub Open Source Community',
      url: 'https://github.com/donnemartin/system-design-primer',
      isVerified: true,
      isFree: true,
      estimatedHours: 35,
    },
    {
      id: 'res-extra-3',
      title: 'PostgreSQL Official Architecture & Indexing Guide',
      type: 'Documentation',
      provider: 'PostgreSQL Global Development Group',
      url: 'https://www.postgresql.org/docs/',
      isVerified: true,
      isFree: true,
      estimatedHours: 25,
    },
    {
      id: 'res-extra-4',
      title: 'Designing Data-Intensive Applications',
      type: 'Book',
      provider: "O'Reilly Media / Martin Kleppmann",
      url: 'https://dataintensive.net',
      isVerified: true,
      isFree: false,
      estimatedHours: 50,
    },
    {
      id: 'res-extra-5',
      title: 'Hands-on Microservices & Docker Fundamentals',
      type: 'Video',
      provider: 'FreeCodeCamp Core Lectures',
      url: 'https://youtube.com',
      isVerified: false,
      isFree: true,
      estimatedHours: 12,
    },
  ];

  const types = ['All', 'Documentation', 'Course', 'Book', 'Video', 'Practice'];

  const filtered =
    filterType === 'All' ? allResources : allResources.filter((r) => r.type === filterType);

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        onOpenMobileMenu={() => {}}
        title="Learning Resources & Materials"
        subtitle="High-signal documentation, verified industry books, and practice sandboxes."
      />

      <main className="p-4 sm:p-8 space-y-8 max-w-6xl">
        {/* Verification Legend Banner */}
        <div className="bg-white p-4 rounded-2xl border-2 border-[#17172B] shadow-[3px_3px_0px_#17172B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF5C9] text-[#17172B] border border-[#17172B] text-xs font-black">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Resource
            </span>
            <span className="text-xs text-[#17172B]/70 font-semibold">
              Vetted by engineering practitioners.
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                  filterType === t
                    ? 'bg-[#FFE76B] text-[#17172B] border-[#17172B] font-black'
                    : 'bg-[#FFFDF7] text-[#17172B]/70 border-[#17172B]/30 hover:border-[#17172B]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <Card
              key={item.id}
              variant="white"
              shadowSize="md"
              interactive
              className="p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#17172B]/10">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#F2F9E9] border border-[#17172B]">
                    {item.type}
                  </span>
                  {item.isVerified ? (
                    <span className="text-[10px] font-black uppercase text-emerald-800 bg-[#DDF5C9] px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="text-[10px] font-black uppercase text-amber-900 bg-[#FFE76B]/60 px-2 py-0.5 rounded border border-amber-300">
                      Community
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-base text-[#17172B] mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[#17172B]/70 font-semibold mb-4">
                  Provider: {item.provider}
                </p>
              </div>

              <div className="pt-3 border-t-2 border-[#17172B] flex items-center justify-between text-xs font-bold">
                <span className="text-[#17172B]/60">
                  {item.isFree ? 'Free • Open Access' : 'Paid Material'}
                </span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#17172B] hover:underline flex items-center gap-1 font-black"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};
