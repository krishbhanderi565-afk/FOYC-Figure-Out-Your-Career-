import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Highlight } from '../../components/common/Highlight';
import {
  CalendarCheck,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  History,
  ThumbsUp,
  Target,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface PastReview {
  id: string;
  weekNumber: number;
  date: string;
  accomplishments: string;
  struggles: string;
  learnings: string;
  stillInterested: string;
  nextPriorities: string;
  momentumScore: number;
}

export const WeeklyReviewPage: React.FC = () => {
  const { dashboardData } = useCareer();
  const [submitted, setSubmitted] = useState(false);
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>('rev-2');

  // Form states for current review
  const [accomplishments, setAccomplishments] = useState(
    'Finished foundational JWT auth module and wrote unit test coverage for the authentication controller.'
  );
  const [struggles, setStruggles] = useState(
    'Struggled with complex composite index performance in PostgreSQL under high mock concurrency.'
  );
  const [learnings, setLearnings] = useState(
    'Learned how EXPLAIN ANALYZE works and how to eliminate sequential table scans.'
  );
  const [stillInterested, setStillInterested] = useState('yes');
  const [nextPriorities, setNextPriorities] = useState(
    'Scope the capstone project README and set up continuous integration with GitHub Actions.'
  );

  // Historical reviews
  const [pastReviews, setPastReviews] = useState<PastReview[]>([
    {
      id: 'rev-2',
      weekNumber: 2,
      date: 'November 09, 2026',
      accomplishments: 'Configured Dockerized PostgreSQL database, created database schema migration files, and established API routes.',
      struggles: 'TypeScript strictly typed request handler typing issues in Express middleware.',
      learnings: 'Using declaration merging to extend Express.Request with custom authenticated user claims.',
      stillInterested: 'yes',
      nextPriorities: 'Build out authentication controller and rate limiting middleware.',
      momentumScore: 92,
    },
    {
      id: 'rev-1',
      weekNumber: 1,
      date: 'November 02, 2026',
      accomplishments: 'Completed onboarding discovery, clarified software architecture direction, and installed development tools.',
      struggles: 'Balancing full-time commitments with evening study schedule.',
      learnings: 'Timeblocking 90 minutes every morning before work yields 3x higher retention than late night coding.',
      stillInterested: 'yes',
      nextPriorities: 'Deep-dive into SQL relational algebra and database normalization.',
      momentumScore: 88,
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRev: PastReview = {
      id: `rev-${Date.now()}`,
      weekNumber: pastReviews.length + 1,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      accomplishments,
      struggles,
      learnings,
      stillInterested,
      nextPriorities,
      momentumScore: 95,
    };
    setPastReviews([newRev, ...pastReviews]);
    setSubmitted(true);
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        onOpenMobileMenu={() => {}}
        title="Weekly Review & Calibration"
        subtitle="Reflect on weekly momentum, resolve blockers, and recalibrate milestones."
      />

      <main className="p-4 sm:p-8 space-y-8 max-w-4xl">
        {/* Momentum Metric Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card variant="yellow" shadowSize="sm" className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-[#17172B] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#17172B]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#17172B]/70">Weekly Momentum</p>
              <p className="text-xl font-black text-[#17172B]">94% High</p>
            </div>
          </Card>

          <Card variant="blue" shadowSize="sm" className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-[#17172B] flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-blue-800" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#17172B]/70">Reviews Logged</p>
              <p className="text-xl font-black text-[#17172B]">{pastReviews.length + (submitted ? 0 : 0)} Weeks</p>
            </div>
          </Card>

          <Card variant="green" shadowSize="sm" className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-[#17172B] flex items-center justify-center">
              <ThumbsUp className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#17172B]/70">Direction Clarity</p>
              <p className="text-xl font-black text-[#17172B]">100% Locked</p>
            </div>
          </Card>
        </div>

        {submitted ? (
          <Card variant="green" shadowSize="lg" className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-white border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#17172B]">
              Weekly Review Logged Successfully!
            </h2>
            <p className="text-sm font-semibold text-[#17172B]/80 max-w-md mx-auto">
              Your insights have been captured and archived. Your habit streak and weekly momentum score have been updated.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Button
                variant="dark"
                size="md"
                onClick={() => setSubmitted(false)}
                className="gap-2"
              >
                Log Another Note / Edit
              </Button>
            </div>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card variant="white" shadowSize="lg" className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#17172B]">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-[#17172B]" />
                  <span className="font-black text-sm uppercase tracking-wider text-[#17172B]">
                    Week {pastReviews.length + 1} Check-in • Sunday Calibration
                  </span>
                </div>
                <Badge variant="yellow" size="sm">Reflection</Badge>
              </div>

              {/* Q1 */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1.5">
                  1. What did you accomplish this week?
                </label>
                <textarea
                  value={accomplishments}
                  onChange={(e) => setAccomplishments(e.target.value)}
                  rows={3}
                  required
                  className="w-full p-3.5 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] text-sm font-semibold text-[#17172B] focus:ring-2 focus:ring-[#FFE76B]"
                />
              </div>

              {/* Q2 */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1.5">
                  2. What did you struggle with or get stuck on?
                </label>
                <textarea
                  value={struggles}
                  onChange={(e) => setStruggles(e.target.value)}
                  rows={3}
                  required
                  className="w-full p-3.5 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] text-sm font-semibold text-[#17172B] focus:ring-2 focus:ring-[#FFE76B]"
                />
              </div>

              {/* Q3 */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1.5">
                  3. Key insight or technical principle learned:
                </label>
                <textarea
                  value={learnings}
                  onChange={(e) => setLearnings(e.target.value)}
                  rows={2}
                  required
                  className="w-full p-3.5 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] text-sm font-semibold text-[#17172B] focus:ring-2 focus:ring-[#FFE76B]"
                />
              </div>

              {/* Q4 */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-2">
                  4. Are you still genuinely energized by your direction ({dashboardData.direction.primaryTitle})?
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 p-3 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] cursor-pointer font-bold text-xs hover:bg-[#FFE76B]/20 transition-colors">
                    <input
                      type="radio"
                      name="interest"
                      value="yes"
                      checked={stillInterested === 'yes'}
                      onChange={() => setStillInterested('yes')}
                      className="accent-[#17172B]"
                    />
                    <span>Yes, 100% engaged</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] cursor-pointer font-bold text-xs hover:bg-[#FFE76B]/20 transition-colors">
                    <input
                      type="radio"
                      name="interest"
                      value="unsure"
                      checked={stillInterested === 'unsure'}
                      onChange={() => setStillInterested('unsure')}
                      className="accent-[#17172B]"
                    />
                    <span>Feeling some hesitation (Need adjustment)</span>
                  </label>
                </div>
              </div>

              {/* Q5 */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-1.5">
                  5. What are your non-negotiable priorities for next week?
                </label>
                <textarea
                  value={nextPriorities}
                  onChange={(e) => setNextPriorities(e.target.value)}
                  rows={3}
                  required
                  className="w-full p-3.5 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] text-sm font-semibold text-[#17172B] focus:ring-2 focus:ring-[#FFE76B]"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                className="gap-2 font-black shadow-[4px_4px_0px_#17172B]"
              >
                <span>Save Weekly Review & Recalibrate</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Card>
          </form>
        )}

        {/* Past Reviews Archive */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-[#17172B] flex items-center gap-2">
              <History className="w-5 h-5 text-[#17172B]" />
              Past Calibration Logs ({pastReviews.length})
            </h3>
            <span className="text-xs font-bold text-[#17172B]/70">Chronological history</span>
          </div>

          <div className="space-y-3">
            {pastReviews.map((rev) => {
              const isExpanded = expandedReviewId === rev.id;
              return (
                <Card key={rev.id} variant="white" shadowSize="sm" className="p-5 overflow-hidden transition-all">
                  <div
                    onClick={() => setExpandedReviewId(isExpanded ? null : rev.id)}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[#FFE76B] border border-[#17172B] flex items-center justify-center font-black text-xs">
                        W{rev.weekNumber}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-sm text-[#17172B]">
                          Week {rev.weekNumber} Calibration
                        </h4>
                        <p className="text-[11px] font-bold text-[#17172B]/60">{rev.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="green" size="sm">
                        {rev.momentumScore}% Momentum
                      </Badge>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#17172B]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#17172B]" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-[#17172B]/15 space-y-3 text-xs">
                      <div>
                        <span className="font-black text-[#17172B] uppercase tracking-wider block mb-1">
                          Key Accomplishments:
                        </span>
                        <p className="font-medium text-[#17172B]/85 bg-[#FFF8E9] p-2.5 rounded-lg border border-[#17172B]/15">
                          {rev.accomplishments}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="font-black text-[#17172B] uppercase tracking-wider block mb-1">
                            Blockers Overcome:
                          </span>
                          <p className="font-medium text-[#17172B]/85 bg-[#FFF8E9] p-2.5 rounded-lg border border-[#17172B]/15">
                            {rev.struggles}
                          </p>
                        </div>
                        <div>
                          <span className="font-black text-[#17172B] uppercase tracking-wider block mb-1">
                            Principles Learned:
                          </span>
                          <p className="font-medium text-[#17172B]/85 bg-[#FFF8E9] p-2.5 rounded-lg border border-[#17172B]/15">
                            {rev.learnings}
                          </p>
                        </div>
                      </div>

                      <div>
                        <span className="font-black text-[#17172B] uppercase tracking-wider block mb-1">
                          Next Week Commitments:
                        </span>
                        <p className="font-medium text-[#17172B]/85 bg-[#D7EAFE] p-2.5 rounded-lg border border-[#17172B]/20">
                          {rev.nextPriorities}
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
