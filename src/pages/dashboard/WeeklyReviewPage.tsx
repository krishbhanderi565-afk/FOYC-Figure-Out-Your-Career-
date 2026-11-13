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
} from 'lucide-react';

export const WeeklyReviewPage: React.FC = () => {
  const { dashboardData } = useCareer();
  const [submitted, setSubmitted] = useState(false);

  // Form states
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        {submitted ? (
          <Card variant="green" shadowSize="lg" className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-emerald-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#17172B]">
              Weekly Review Logged Successfully!
            </h2>
            <p className="text-sm font-semibold text-[#17172B]/80 max-w-md mx-auto">
              Your insights have been captured. Your habit streak and weekly momentum score have been updated.
            </p>
            <div className="pt-2">
              <Button
                variant="dark"
                size="md"
                onClick={() => setSubmitted(false)}
                className="gap-2"
              >
                Edit Review
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
                    Week 03 Check-in • Sunday Calibration
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
                  className="w-full p-3.5 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] text-sm font-semibold text-[#17172B] focus:ring-2 focus:ring-[#FFE76B]"
                />
              </div>

              {/* Q4 */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#17172B] mb-2">
                  4. Are you still genuinely energized by your direction ({dashboardData.direction.primaryTitle})?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 p-3 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] cursor-pointer font-bold text-xs">
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
                  <label className="flex items-center gap-2 p-3 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] cursor-pointer font-bold text-xs">
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
      </main>
    </div>
  );
};
