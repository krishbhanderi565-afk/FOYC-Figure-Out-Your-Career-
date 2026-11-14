import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import {
  Target,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Compass,
  Check,
  Brain,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';

interface DashboardOutletContext {
  onOpenMobileMenu: () => void;
}

export const MyCareerPage: React.FC = () => {
  const { dashboardData, userState, isDemoMode } = useCareer();
  const outletCtx = useOutletContext<DashboardOutletContext | undefined>();
  const dir = dashboardData?.direction;

  const [activeTab, setActiveTab] = useState<'matches' | 'analysis'>('matches');

  // Top career matches from user data or calibrated defaults
  const careerMatches = [
    {
      id: 'm1',
      title: dir?.primaryTitle || 'Product Manager',
      match: 92,
      tags: ['Strategy', 'Leadership', 'Innovation'],
      badge: 'Top Alignment',
      summary: 'High synergy with product sense, user-centric thinking and collaborative execution.',
    },
    {
      id: 'm2',
      title: dir?.alternativeTitles?.[0] || 'Data & AI Strategist',
      match: 88,
      tags: ['AI Tech', 'Analytics', 'High Growth'],
      badge: 'High Potential',
      summary: 'Capitalizes on analytical problem solving and fast-evolving AI workflows.',
    },
    {
      id: 'm3',
      title: dir?.alternativeTitles?.[1] || 'Technical Product Designer',
      match: 85,
      tags: ['Design', 'Development', 'UX Research'],
      badge: 'Creative Fit',
      summary: 'Bridges interface design, visual empathy and modular software engineering.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <DashboardHeader
        onOpenMobileMenu={outletCtx?.onOpenMobileMenu || (() => {})}
        title="My Career"
        subtitle="Discover your career potential and explore possibilities."
      />

      <main className="px-4 sm:px-8 pb-12 space-y-6 max-w-[1400px] w-full mx-auto">
        {/* Top Header Row with status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Strategic Career Direction
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-stone-500">
              Calibrated from your diagnostic profile, strengths, and life goals.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-bold text-stone-500 bg-white/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/80 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Last Updated: Today</span>
            <Link to="/clarity-compass" className="text-emerald-700 hover:underline ml-1">
              ↺ Recalibrate
            </Link>
          </div>
        </div>

        {/* 2-Column Main Section (Reference Image 2 Top-Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Top Career Matches */}
          <div className="lg:col-span-7 rounded-3xl p-6 sm:p-7 border border-white/90 shadow-sm backdrop-blur-xl bg-white/85 space-y-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-stone-900">Your Top Career Matches</h3>
              </div>

              <Link
                to="/possibility-explorer"
                className="text-xs font-bold text-stone-600 hover:text-emerald-700 flex items-center gap-1 group"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Match Cards */}
            <div className="space-y-3.5">
              {careerMatches.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white/80 border border-stone-200/80 hover:border-emerald-300 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700 shrink-0 font-black text-sm">
                      0{idx + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-black text-stone-900">
                          {item.title}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {item.tags.map((t, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-base sm:text-lg font-black text-emerald-700 block leading-tight">
                        {item.match}%
                      </span>
                      <span className="text-[10px] font-bold text-stone-400">Match</span>
                    </div>

                    <Link to="/dashboard/roadmap">
                      <button className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors">
                        Explore
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (5 cols): Career Insights Radar Chart */}
          <div className="lg:col-span-5 rounded-3xl p-6 sm:p-7 border border-white/90 shadow-sm backdrop-blur-xl bg-white/85 space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Brain className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-stone-900">Career Insights</h3>
              </div>

              <span className="text-xs font-bold text-stone-400">Holistic Fit</span>
            </div>

            {/* Radar / Spider Graphic (SVG) */}
            <div className="relative w-full h-64 flex items-center justify-center py-2">
              <svg viewBox="0 0 300 240" className="w-full h-full overflow-visible">
                {/* 6-point concentric polygons */}
                {[0.25, 0.5, 0.75, 1.0].map((scale, sIdx) => {
                  const points = [
                    [150, 120 - 90 * scale], // Top: Technical Skills
                    [150 + 78 * scale, 120 - 45 * scale], // Problem Solving
                    [150 + 78 * scale, 120 + 45 * scale], // Creativity
                    [150, 120 + 90 * scale], // Communication
                    [150 - 78 * scale, 120 + 45 * scale], // Leadership
                    [150 - 78 * scale, 120 - 45 * scale], // Adaptability
                  ].map(([x, y]) => `${x},${y}`).join(' ');

                  return (
                    <polygon
                      key={sIdx}
                      points={points}
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="1"
                      strokeDasharray={scale === 1.0 ? 'none' : '2 2'}
                    />
                  );
                })}

                {/* Axis lines from center */}
                {[
                  [150, 30],
                  [228, 75],
                  [228, 165],
                  [150, 210],
                  [72, 165],
                  [72, 75],
                ].map(([x, y], idx) => (
                  <line key={idx} x1="150" y1="120" x2={x} y2={y} stroke="#E5E7EB" strokeWidth="1" />
                ))}

                {/* User Radar Polygon (Green fill) */}
                <polygon
                  points="150,48 218,85 212,155 150,195 90,158 85,82"
                  fill="rgba(34, 197, 94, 0.25)"
                  stroke="#16a34a"
                  strokeWidth="2.5"
                />

                {/* Point nodes */}
                {[
                  [150, 48],
                  [218, 85],
                  [212, 155],
                  [150, 195],
                  [90, 158],
                  [85, 82],
                ].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="4" fill="#16a34a" stroke="#fff" strokeWidth="2" />
                ))}

                {/* Axis labels */}
                <text x="150" y="18" fontSize="10" fontWeight="800" fill="#374151" textAnchor="middle">Technical Skills</text>
                <text x="240" y="75" fontSize="10" fontWeight="800" fill="#374151" textAnchor="start">Problem Solving</text>
                <text x="240" y="170" fontSize="10" fontWeight="800" fill="#374151" textAnchor="start">Creativity</text>
                <text x="150" y="228" fontSize="10" fontWeight="800" fill="#374151" textAnchor="middle">Communication</text>
                <text x="60" y="170" fontSize="10" fontWeight="800" fill="#374151" textAnchor="end">Leadership</text>
                <text x="60" y="75" fontSize="10" fontWeight="800" fill="#374151" textAnchor="end">Adaptability</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Section: Career Summary & Quote Card (Reference Image 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Career Summary Card (8 cols) */}
          <div className="lg:col-span-8 rounded-3xl p-6 sm:p-7 border border-white/90 shadow-sm backdrop-blur-xl bg-white/85 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-3.5">
              <span className="text-2xl">💡</span>
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800">
                  Your Career Summary
                </h4>
                <p className="text-xs sm:text-sm font-semibold text-stone-700 leading-relaxed max-w-xl">
                  {dir?.summary || 'You are a curious mind with strong analytical skills and a passion for technology. You thrive in innovative environments and love solving complex problems.'}
                </p>
              </div>
            </div>

            <Link to="/clarity-compass" className="shrink-0">
              <button className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-colors shadow-2xs">
                See Detailed Analysis →
              </button>
            </Link>
          </div>

          {/* Inspirational Quote Card (4 cols) */}
          <div className="lg:col-span-4 rounded-3xl p-6 border border-white/90 shadow-sm backdrop-blur-xl bg-gradient-to-br from-emerald-50/90 to-white/90 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-black text-stone-900 italic leading-snug">
                "Dream big, plan well, and keep going."
              </p>
              <span className="text-[10px] font-bold text-emerald-700 block">
                FOYC Daily Momentum
              </span>
            </div>
            <span className="text-3xl shrink-0">🌱</span>
          </div>
        </div>
      </main>
    </div>
  );
};
