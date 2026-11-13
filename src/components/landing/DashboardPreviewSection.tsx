import React, { useState } from 'react';
import { Highlight } from '../common/Highlight';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  CheckCircle2,
  Calendar,
  Flame,
  LayoutDashboard,
  Milestone as MilestoneIcon,
  ListTodo,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPreviewSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'habits' | 'projects'>('overview');
  const [checkedTasks, setCheckedTasks] = useState<{ [id: string]: boolean }>({
    't-1': true,
    't-2': true,
    't-3': false,
  });

  const toggleMockTask = (id: string) => {
    setCheckedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="py-20 md:py-28 bg-[#17172B] text-[#FFF8E9] border-t-3 border-[#17172B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE76B] text-[#17172B] border-2 border-white text-xs font-black uppercase tracking-wider mb-4 shadow-[2px_2px_0px_#FFFFFF]">
            <Sparkles className="w-3.5 h-3.5 text-[#17172B]" />
            Your Command Centre
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-4">
            A living dashboard.{' '}
            <span className="text-[#FFE76B] underline decoration-white decoration-2">
              Not a static PDF.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#FFF8E9]/75 font-medium leading-relaxed">
            Your career evolves as you learn. FOYC gives you a persistent personal workspace that turns long-term ambition into daily micro-wins.
          </p>

          {/* Interactive Preview Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#FFE76B] text-[#17172B] border-white shadow-[2px_2px_0px_#FFFFFF]'
                  : 'bg-[#252542] text-[#FFF8E9] border-[#3E3E66] hover:bg-[#323254]'
              }`}
            >
              Overview Command
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all ${
                activeTab === 'roadmap'
                  ? 'bg-[#FFD9E8] text-[#17172B] border-white shadow-[2px_2px_0px_#FFFFFF]'
                  : 'bg-[#252542] text-[#FFF8E9] border-[#3E3E66] hover:bg-[#323254]'
              }`}
            >
              Interactive Roadmap
            </button>
            <button
              onClick={() => setActiveTab('habits')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all ${
                activeTab === 'habits'
                  ? 'bg-[#DDF5C9] text-[#17172B] border-white shadow-[2px_2px_0px_#FFFFFF]'
                  : 'bg-[#252542] text-[#FFF8E9] border-[#3E3E66] hover:bg-[#323254]'
              }`}
            >
              Habit Streaks
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all ${
                activeTab === 'projects'
                  ? 'bg-[#D7EAFE] text-[#17172B] border-white shadow-[2px_2px_0px_#FFFFFF]'
                  : 'bg-[#252542] text-[#FFF8E9] border-[#3E3E66] hover:bg-[#323254]'
              }`}
            >
              Capstone Portfolio
            </button>
          </div>
        </div>

        {/* Dashboard Shell Frame */}
        <div className="bg-[#1F1F38] rounded-3xl border-3 border-[#3E3E66] shadow-[8px_8px_0px_#0A0A14] overflow-hidden p-6 sm:p-10">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top Banner */}
              <div className="bg-gradient-to-r from-[#2A2A4E] to-[#252542] p-6 rounded-2xl border-2 border-[#454570] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#FFE76B]">
                      Active Mission
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="text-xs text-white/70">Sprint Week 03 of 16</span>
                  </div>
                  <h3 className="text-2xl font-black text-white">Full-Stack Software Engineer</h3>
                  <p className="text-xs sm:text-sm text-white/70 mt-1">
                    Goal: Land a high-growth product role with verified proof of work.
                  </p>
                </div>
                <Link to="/dashboard">
                  <Button variant="primary" size="sm" className="gap-2 shrink-0">
                    Open Full Engine
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Stat Cards 4-grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#262646] p-4 rounded-xl border border-[#3E3E66]">
                  <span className="text-xs text-white/60 font-bold block mb-1">Roadmap Progress</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#FFE76B]">42%</span>
                  <div className="w-full bg-[#17172B] h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#FFE76B] h-full w-[42%]" />
                  </div>
                </div>

                <div className="bg-[#262646] p-4 rounded-xl border border-[#3E3E66]">
                  <span className="text-xs text-white/60 font-bold block mb-1">Learning Streak</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#FFD9E8]">6 Days</span>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-2 font-bold">
                    <Flame className="w-3.5 h-3.5 fill-current" /> High momentum
                  </div>
                </div>

                <div className="bg-[#262646] p-4 rounded-xl border border-[#3E3E66]">
                  <span className="text-xs text-white/60 font-bold block mb-1">Tasks Completed</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#DDF5C9]">14 / 22</span>
                  <span className="text-[11px] text-white/50 block mt-2">8 pending this sprint</span>
                </div>

                <div className="bg-[#262646] p-4 rounded-xl border border-[#3E3E66]">
                  <span className="text-xs text-white/60 font-bold block mb-1">Portfolio Proof</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#D7EAFE]">2 Projects</span>
                  <span className="text-[11px] text-white/50 block mt-2">1 live • 1 in progress</span>
                </div>
              </div>

              {/* Checklist Section inside Overview */}
              <div className="bg-[#1A1A30] p-6 rounded-2xl border border-[#323254]">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#2C2C4E]">
                  <h4 className="font-extrabold text-sm uppercase tracking-wider text-white flex items-center gap-2">
                    <ListTodo className="w-4 h-4 text-[#FFE76B]" />
                    Interactive Today Checklist (Try clicking!)
                  </h4>
                  <span className="text-xs text-white/50">3 tasks for today</span>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 't-1', title: 'Implement JWT refresh token rotation with HTTP-only cookies', tag: 'Security' },
                    { id: 't-2', title: 'Write unit tests for authentication endpoint with Vitest', tag: 'Testing' },
                    { id: 't-3', title: 'Scope capstone telemetry dashboard architecture in README', tag: 'Architecture' },
                  ].map((t) => (
                    <div
                      key={t.id}
                      onClick={() => toggleMockTask(t.id)}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        checkedTasks[t.id]
                          ? 'bg-[#262646]/60 border-emerald-500/50 text-white/50'
                          : 'bg-[#262646] border-[#3E3E66] hover:border-[#FFE76B] text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                            checkedTasks[t.id]
                              ? 'bg-emerald-500 border-emerald-500 text-[#17172B]'
                              : 'border-white/40'
                          }`}
                        >
                          {checkedTasks[t.id] && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <span className={`text-sm font-bold ${checkedTasks[t.id] ? 'line-through' : ''}`}>
                          {t.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white/10 text-white/80">
                        {t.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-lg text-white mb-4">Interactive Phase Progression</h4>
              {[
                { stage: 'Stage 01', title: 'Foundation & Core Systems', dur: 'Weeks 1-4', stat: 'Completed', color: 'bg-emerald-500' },
                { stage: 'Stage 02', title: 'Scalable Databases & Auth Pipelines', dur: 'Weeks 5-8', stat: 'Current Stage (70%)', color: 'bg-[#FFE76B]' },
                { stage: 'Stage 03', title: 'Distributed Micro-SaaS Capstone', dur: 'Weeks 9-12', stat: 'Upcoming', color: 'bg-white/20' },
                { stage: 'Stage 04', title: 'Technical Interview Screening & Portfolio Launch', dur: 'Weeks 13-16', stat: 'Upcoming', color: 'bg-white/20' },
              ].map((m, i) => (
                <div key={i} className="bg-[#262646] p-4 rounded-xl border border-[#3E3E66] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-10 rounded-full ${m.color}`} />
                    <div>
                      <span className="text-xs uppercase font-extrabold text-[#FFE76B]">{m.stage} • {m.dur}</span>
                      <h5 className="font-extrabold text-base text-white">{m.title}</h5>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-white/70 px-3 py-1 rounded-full bg-white/10">
                    {m.stat}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'habits' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-lg text-white mb-4">Habit Streak Engine</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: '45 mins Deep Code Sprint', streak: '7 Days', target: '5 days/week', comp: true },
                  { name: 'Read 1 Technical Case Study', streak: '4 Days', target: '4 days/week', comp: false },
                  { name: 'Document Daily Learning Note', streak: '5 Days', target: '5 days/week', comp: true },
                ].map((h, i) => (
                  <div key={i} className="bg-[#262646] p-5 rounded-2xl border-2 border-[#3E3E66] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-white/50">{h.target}</span>
                        <span className="text-xs font-extrabold text-[#FFE76B]">🔥 {h.streak}</span>
                      </div>
                      <h5 className="font-bold text-white text-base mb-4">{h.name}</h5>
                    </div>
                    <button
                      className={`w-full py-2 rounded-xl text-xs font-bold border-2 ${
                        h.comp
                          ? 'bg-[#DDF5C9] text-[#17172B] border-white'
                          : 'bg-white/10 text-white border-white/20'
                      }`}
                    >
                      {h.comp ? '✓ Completed Today' : 'Mark as Done Today'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-lg text-white mb-4">Demonstrable Capstone Projects</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#262646] p-6 rounded-2xl border-2 border-[#3E3E66]">
                  <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    In Progress
                  </span>
                  <h5 className="text-lg font-black text-white mt-3">PulseTrack: High-Throughput API Telemetry</h5>
                  <p className="text-xs text-white/70 mt-2 leading-relaxed">
                    Real-time WebSocket telemetry dashboard monitoring API latency, throughput, and error rates with PostgreSQL composite indexing.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {['TypeScript', 'Next.js', 'PostgreSQL', 'Docker'].map((tag) => (
                      <span key={tag} className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#262646] p-6 rounded-2xl border-2 border-[#3E3E66]">
                  <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded bg-white/10 text-white/70 border border-white/20">
                    Planned
                  </span>
                  <h5 className="text-lg font-black text-white mt-3">CloudSync: Distributed Asset Storage Engine</h5>
                  <p className="text-xs text-white/70 mt-2 leading-relaxed">
                    S3-compatible distributed file storage with automated image compression workers and signed expiring URL sharing.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {['Node.js', 'Redis', 'AWS S3', 'BullMQ'].map((tag) => (
                      <span key={tag} className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link to="/dashboard">
            <Button variant="primary" size="lg" className="gap-2">
              Launch Live Interactive Dashboard Engine
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
