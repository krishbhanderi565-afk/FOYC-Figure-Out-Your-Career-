import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Highlight } from '../../components/common/Highlight';
import {
  Layers,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  BookOpen,
  Filter,
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export const SkillDevelopmentPage: React.FC = () => {
  const { dashboardData } = useCareer();
  const outletCtx = useOutletContext<{ onOpenMobileMenu?: () => void } | undefined>();
  const [filterPriority, setFilterPriority] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  const detailedGaps: any[] = (dashboardData.direction as any).detailedSkillGaps || [
    {
      skill_name: 'Relational Indexing & Query Tuning',
      current_level: 'Beginner',
      target_level: 'Advanced',
      priority: 'High',
      explanation: 'Production databases degrade rapidly without composite indexes and efficient query plans.',
      recommended_learning_order: 1,
    },
    {
      skill_name: 'Docker Multi-stage Builds & Containerization',
      current_level: 'Beginner',
      target_level: 'Intermediate',
      priority: 'High',
      explanation: 'Essential for reproducible deployment and isolation across cloud environments.',
      recommended_learning_order: 2,
    },
    {
      skill_name: 'Distributed Background Queues (BullMQ / Redis)',
      current_level: 'None',
      target_level: 'Intermediate',
      priority: 'Medium',
      explanation: 'Prevents slow external API calls and email processing from blocking the HTTP event loop.',
      recommended_learning_order: 3,
    },
  ];

  const filteredGaps = filterPriority === 'All'
    ? detailedGaps
    : detailedGaps.filter((g) => g.priority.toLowerCase() === filterPriority.toLowerCase());

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <DashboardHeader
        onOpenMobileMenu={outletCtx?.onOpenMobileMenu || (() => {})}
        title="Skill Development & Gap Analysis"
        subtitle="Master the required capabilities, prioritize knowledge gaps, and follow a recommended learning order."
      />

      <main className="px-4 sm:px-8 pb-12 space-y-6 max-w-[1400px] w-full mx-auto">
        {/* Metric Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card variant="yellow" shadowSize="sm" className="p-5 flex items-center gap-3.5 border-2">
            <div className="w-11 h-11 rounded-xl bg-white border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B] flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 text-[#17172B]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#17172B]/70">Identified Gaps</p>
              <p className="text-2xl font-black text-[#17172B]">{detailedGaps.length} Target Skills</p>
            </div>
          </Card>

          <Card variant="parrot" shadowSize="sm" className="p-5 flex items-center gap-3.5 border-2 bg-[#B8E986]">
            <div className="w-11 h-11 rounded-xl bg-white border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B] flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-[#315B28]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#17172B]/80">Primary Focus</p>
              <p className="text-xl font-black text-[#17172B]">Order #1 Priority</p>
            </div>
          </Card>

          <Card variant="blue" shadowSize="sm" className="p-5 flex items-center gap-3.5 border-2">
            <div className="w-11 h-11 rounded-xl bg-white border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-blue-800" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#17172B]/70">Target Standard</p>
              <p className="text-xl font-black text-[#17172B]">Production Grade</p>
            </div>
          </Card>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border-2 border-[#17172B] shadow-[3px_3px_0px_#17172B]">
          <span className="text-xs font-black uppercase tracking-wider text-[#17172B] flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-[#17172B]" /> Filter by Priority:
          </span>
          <div className="flex flex-wrap gap-2">
            {(['All', 'High', 'Medium', 'Low'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border border-[#17172B] transition-all ${
                  filterPriority === p
                    ? 'bg-[#17172B] text-white shadow-[2px_2px_0px_#B8E986]'
                    : 'bg-[#F2F9E9] text-[#17172B] hover:bg-[#FFE76B]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Gap Matrix Cards */}
        <div className="space-y-4">
          {filteredGaps.map((item, idx) => (
            <Card
              key={idx}
              variant="white"
              shadowSize="md"
              className="p-6 border-2 bg-[#FFFDF8] hover:border-[#17172B] transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#17172B]/10">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#FFE76B] border-2 border-[#17172B] flex items-center justify-center font-black text-xs text-[#17172B] shrink-0">
                    #{item.recommended_learning_order || idx + 1}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-[#17172B]">
                      {item.skill_name}
                    </h3>
                    <span className="text-[11px] font-bold text-[#17172B]/60">
                      Recommended Learning Order: #{item.recommended_learning_order || idx + 1}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={item.priority === 'High' ? 'parrot' : item.priority === 'Medium' ? 'yellow' : 'blue'}
                    size="sm"
                  >
                    {item.priority} Priority
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="p-3 bg-[#F2F9E9] rounded-xl border border-[#17172B]/20">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#17172B]/60 block mb-1">
                    Current Level
                  </span>
                  <span className="text-xs font-extrabold text-[#17172B]">
                    {item.current_level || 'Beginner'}
                  </span>
                </div>

                <div className="p-3 bg-[#DDF5C5] rounded-xl border border-[#17172B]/20">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#315B28] block mb-1">
                    Target Capability Level
                  </span>
                  <span className="text-xs font-extrabold text-[#17172B]">
                    {item.target_level || 'Production / Advanced'}
                  </span>
                </div>

                <div className="md:col-span-1 p-3 bg-[#D7EAFE]/40 rounded-xl border border-[#17172B]/20">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 block mb-1">
                    Verification Method
                  </span>
                  <span className="text-xs font-bold text-[#17172B]">
                    Shipped code in Portfolio Capstone
                  </span>
                </div>
              </div>

              {item.explanation && (
                <div className="mt-3 pt-3 border-t border-[#17172B]/10">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#17172B]/70 block mb-1">
                    Why This Skill is Crucial:
                  </span>
                  <p className="text-xs sm:text-sm text-[#17172B]/85 font-medium leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};
