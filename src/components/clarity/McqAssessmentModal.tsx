import React, { useState } from 'react';
import { Check, ArrowRight, X, Sparkles, HelpCircle } from 'lucide-react';
import { Button } from '../common/Button';

export interface McqAnswer {
  questionId: number;
  question: string;
  selectedOption: string;
}

interface McqAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (answers: McqAnswer[]) => void;
  userName?: string;
}

interface McqQuestion {
  id: number;
  title: string;
  subtitle: string;
  options: string[];
}

export const MCQ_QUESTIONS: McqQuestion[] = [
  {
    id: 1,
    title: 'Working Style Preference',
    subtitle: 'Under what conditions do you produce your best creative and intellectual work?',
    options: [
      'High autonomy — Independent problem-solving with minimal supervision',
      'Collaborative team environment — Bouncing ideas off peers in real-time',
      'Structured execution — Clear specifications, defined processes, and milestones',
      'Flexible mix — Alternating between deep solo work and team syncs',
      'Not sure / Open to exploring',
    ],
  },
  {
    id: 2,
    title: 'Risk Tolerance & Career Stability',
    subtitle: 'How do you view financial uncertainty and career experimentation right now?',
    options: [
      'Low risk — I prioritize steady income, job security, and predictable hours',
      'Calculated risk — Willing to invest 6-12 months into skills if upside is proven',
      'High risk & upside — Comfortable with freelance, startups, or entrepreneurial ventures',
      'Side-project approach — Keep current stability while experimenting in spare time',
      'Not sure / Depends on financial runway',
    ],
  },
  {
    id: 3,
    title: 'Primary Learning Style',
    subtitle: 'How do you absorb complex new concepts most effectively?',
    options: [
      'Building tangible projects — Learn by debugging real code or practical problems',
      'Structured step-by-step courses — Video lectures with clear sequential progression',
      'Reading documentation & books — Deep conceptual immersion and note-taking',
      'Mentorship & peer feedback — Asking questions and learning from practitioners',
      'Not sure / Trial-and-error',
    ],
  },
  {
    id: 4,
    title: 'Work Environment & Location',
    subtitle: 'Where do you thrive physically and geographically?',
    options: [
      '100% Remote — Full geographic independence and home/café workspace',
      'Hybrid — 2-3 days in a vibrant office for social connection, rest remote',
      'In-person office — Thrives in a physical workspace with shared team energy',
      'Location flexible — Willing to relocate anywhere for the right career break',
      'Not sure / Open to all options',
    ],
  },
  {
    id: 5,
    title: 'Income Velocity vs. Long-Term Mastery',
    subtitle: 'What is your immediate financial and career timeline priority?',
    options: [
      'Immediate income needed — Must monetize or land an entry role within 3-6 months',
      'Medium-term transition — Can invest 6-12 months for a substantially higher tier role',
      'Long-term mastery — Prepared to invest 1-2+ years for deep expertise or degrees',
      'Non-monetary focus — Primarily focused on purpose, creative outlet, or personal growth',
      'Not sure / Balancing multiple priorities',
    ],
  },
  {
    id: 6,
    title: 'Preferred Problem Domain',
    subtitle: 'What type of challenges energize you rather than drain you?',
    options: [
      'Technical & Systems — Software architecture, coding, algorithms, and data logic',
      'Design & Visual — UI/UX design, aesthetic craft, storytelling, and user experience',
      'People & Strategy — Management, coaching, product roadmaps, and stakeholder alignment',
      'Business & Commercial — Marketing, sales, growth loops, and entrepreneurial revenue',
      'Research & Synthesis — Deep investigation, writing, and structured analysis',
    ],
  },
  {
    id: 7,
    title: 'Feedback & Evaluation Preference',
    subtitle: 'How do you prefer your work to be evaluated?',
    options: [
      'Objective proof of work — Code that works, live URLs, metrics that moved',
      'Direct human feedback — Qualitative critiques from mentors or managers',
      'User adoption & revenue — Market response, customer reviews, and sales',
      'Personal satisfaction — Knowing I met my own high standards of craft',
      'Not sure / Combination of proof and feedback',
    ],
  },
  {
    id: 8,
    title: 'Level of Structure & Routine',
    subtitle: 'How structured do you like your daily schedule to be?',
    options: [
      'Strict daily calendar — Time-blocked routines with clear start/end boundaries',
      'Outcome-based freedom — Work whenever I feel peak focus, as long as goals are met',
      'Moderate cadence — Fixed core working hours with flexible afternoon blocks',
      'Dynamic & unpredictable — Enjoys varied days, rapid pivots, and new stimuli',
      'Not sure / Still establishing my routine',
    ],
  },
  {
    id: 9,
    title: 'Attitude Towards AI Disruption',
    subtitle: 'How do you feel about artificial intelligence in your chosen domain?',
    options: [
      'Eager adopter — Want to leverage AI tools daily as a productivity multiplier',
      'Cautious explorer — Learning to use AI while focusing on uniquely human skills',
      'Concerned about obsolescence — Want a path with high long-term barrier to entry',
      'Tool-agnostic — Technology changes, but fundamental problem-solving remains king',
      'Not sure / Need more guidance on AI impact',
    ],
  },
  {
    id: 10,
    title: 'Confidence in Current Direction',
    subtitle: 'How clear do you feel about where you want to go next?',
    options: [
      'Very clear on the goal — Just need a concrete 12-month roadmap and task checklist',
      'Torn between 2-3 specific paths — Need an objective trade-off and comparison test',
      'Wide open & confused — Overwhelmed by too many possibilities and advice',
      'Seeking a reality check — Want honest validation before committing time/money',
      'Not sure / Exploring with an open mind',
    ],
  },
];

export const McqAssessmentModal: React.FC<McqAssessmentModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  userName,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [customText, setCustomText] = useState<Record<number, string>>({});

  if (!isOpen) return null;

  const currentQ = MCQ_QUESTIONS[currentQIndex];
  const isSelected = (opt: string) => selectedAnswers[currentQ.id] === opt;
  const isAnswered = Boolean(selectedAnswers[currentQ.id]);
  const progressPct = Math.round(((currentQIndex + 1) / MCQ_QUESTIONS.length) * 100);

  const handleSelectOption = (opt: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: opt,
    }));
  };

  const handleNext = () => {
    if (currentQIndex < MCQ_QUESTIONS.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      // Completed all 10 questions
      const formattedAnswers: McqAnswer[] = MCQ_QUESTIONS.map((q) => ({
        questionId: q.id,
        question: q.title,
        selectedOption:
          selectedAnswers[q.id] === 'Other / Custom'
            ? `Custom: ${customText[q.id] || 'Not specified'}`
            : selectedAnswers[q.id] || 'Skipped',
      }));
      onComplete(formattedAnswers);
    }
  };

  const handleSkipQuestion = () => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: 'Skipped / Not sure',
    }));
    handleNext();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="10-Question Clarity MCQ Assessment"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
    >
      <div className="bg-[#FEFAF7] rounded-3xl border-3 border-[#171717] shadow-[6px_6px_0px_#171717] max-w-2xl w-full p-6 sm:p-8 relative max-h-[92vh] flex flex-col justify-between">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DE] mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FFE76B] border border-[#171717] text-xs font-black flex items-center justify-center">
                {currentQ.id}
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-[#526B50]">
                Optional Deep Clarity Assessment • Question {currentQ.id} of {MCQ_QUESTIONS.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#666666] hover:text-[#171717] hover:bg-black/5 transition-colors"
              title="Close assessment"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#EAE6DF] h-2 rounded-full overflow-hidden mb-6">
            <div
              className="bg-[#526B50] h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Question Title & Subtitle */}
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
              {currentQ.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#555555] font-medium mt-1 leading-relaxed">
              {currentQ.subtitle}
            </p>
          </div>

          {/* Options List */}
          <div className="space-y-2.5 mb-6 max-h-[46vh] overflow-y-auto pr-1">
            {currentQ.options.map((opt, idx) => {
              const selected = isSelected(opt);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-start justify-between gap-3 ${
                    selected
                      ? 'border-[#171717] bg-[#FFE76B]/30 shadow-[2px_2px_0px_#171717]'
                      : 'border-[#E8E5DE] bg-white hover:border-[#171717] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-bold text-[#171717] leading-snug">
                    {opt}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors mt-0.5 ${
                      selected ? 'bg-[#171717] border-[#171717] text-white' : 'border-[#CCCCCC] bg-white'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#E8E5DE] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSkipQuestion}
            className="text-xs font-bold text-[#777777] hover:text-[#171717] hover:underline"
          >
            Skip this question
          </button>

          <div className="flex items-center gap-2">
            {currentQIndex > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentQIndex((prev) => prev - 1)}
                className="text-xs font-bold border-[#171717]"
              >
                Back
              </Button>
            )}

            <Button
              variant="primary"
              size="md"
              disabled={!isAnswered}
              onClick={handleNext}
              className="gap-2 font-black bg-[#FFE76B] text-[#171717] border-2 border-[#171717] shadow-[2px_2px_0px_#171717]"
            >
              <span>{currentQIndex === MCQ_QUESTIONS.length - 1 ? 'Finish & Apply Insights' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
