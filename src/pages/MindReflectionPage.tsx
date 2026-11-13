import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCareer } from '../context/CareerContext';
import { Navbar } from '../components/common/Navbar';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    title: 'Current Situation',
    subtitle: 'What are you currently studying, learning or working on?',
    placeholder: 'e.g. Currently in 3rd year of Computer Science; or working in customer service while learning web development on weekends...',
    hint: 'Give your coach a clear picture of where you stand today.',
  },
  {
    id: 2,
    title: 'Interests & Curiosities',
    subtitle: 'What subjects, topics or activities genuinely interest or excite you?',
    placeholder: 'e.g. Building interactive web apps, experimenting with AI prompting, designing clean user interfaces, solving logical backend puzzles...',
    hint: 'Think about things you enjoy exploring even when no one is grading or paying you.',
  },
  {
    id: 3,
    title: 'Existing Skills & Strengths',
    subtitle: 'What skills, strengths or past experiences do you already have?',
    placeholder: 'e.g. Basic Python and JavaScript, good communication, ability to break complex problems into steps, fast self-directed learner...',
    hint: 'Include technical tools, soft skills, or domain knowledge you have accumulated.',
  },
  {
    id: 4,
    title: 'Career Aspirations',
    subtitle: 'What kind of career or daily work life do you aspire to build?',
    placeholder: 'e.g. Working as a full-stack engineer at a fast-moving product team, having high autonomy, earning well while building products people use...',
    hint: 'Focus on both the role and the lifestyle you want in 2–3 years.',
  },
  {
    id: 5,
    title: 'Current Confusion',
    subtitle: 'What is causing you the most confusion or uncertainty right now?',
    placeholder: 'e.g. Confused between deep AI/ML versus Full-Stack development. Worried whether AI will automate junior coders before I land my first job...',
    hint: 'Be completely honest—there are no wrong answers.',
  },
  {
    id: 6,
    title: 'What Have You Already Tried?',
    subtitle: 'What steps, courses, tutorials or attempts have you made so far?',
    placeholder: 'e.g. Completed a couple of freeCodeCamp modules, watched YouTube roadmaps, built a simple to-do app, but keep getting stuck in tutorial hell...',
    hint: 'Knowing what you tried helps avoid repeating things that did not work.',
  },
  {
    id: 7,
    title: 'Constraints & Limitations',
    subtitle: 'What constraints (time, finances, location, commitments) must be respected?',
    placeholder: 'e.g. Can commit 15 hours per week around college; cannot afford an expensive boot camp; need a remote or hybrid role within 6 months...',
    hint: 'Pragmatic career roadmaps must fit your actual life reality.',
  },
  {
    id: 8,
    title: 'Anything Else On Your Mind?',
    subtitle: 'Any additional fears, doubts, or specific questions for your coach?',
    placeholder: 'e.g. Feeling like everyone else is ahead of me; wanting to know if switching from mechanical engineering to tech is still realistic this year...',
    hint: 'Anything else you want ChatGPT to take into consideration during your discussion.',
  },
];

export const MindReflectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { reflection, updateReflection } = useCareer();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    if (reflection.questionnaireAnswers && Object.keys(reflection.questionnaireAnswers).length > 0) {
      return { ...reflection.questionnaireAnswers };
    }
    // Initialize question 0 with existing mindText if available
    return {
      0: reflection.mindText || '',
    };
  });

  const currentQ = QUESTIONS[currentIndex];
  const currentAnswer = answers[currentIndex] || '';
  const progressPct = Math.round(((currentIndex + 1) / QUESTIONS.length) * 100);

  const handleAnswerChange = (val: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: val,
    }));
  };

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Save full reflection & navigate
      saveAndContinue();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const saveAndContinue = () => {
    // Compile summary mindText from all 8 answers
    const compiledText = QUESTIONS.map((q, idx) => {
      const a = (answers[idx] || '').trim();
      return a ? `${q.title}:\n${a}` : null;
    })
      .filter(Boolean)
      .join('\n\n');

    updateReflection({
      mindText: compiledText || currentAnswer,
      questionnaireAnswers: answers,
    });
    navigate('/prompt-ready');
  };

  return (
    <div className="min-h-screen bg-[#FDF5EB] flex flex-col text-[#171717]">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Top Header & Progress */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#333333] hover:text-[#171717]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Profile</span>
            </Link>

            <span className="text-xs font-mono font-bold text-[#526B50] bg-[#EDF2E9] px-2.5 py-1 rounded-full border border-[#A8B99A]">
              Question {currentIndex + 1} of {QUESTIONS.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-[#F4F3EF] rounded-full overflow-hidden border border-[#E8E5DE]">
            <div
              className="h-full bg-[#526B50] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl border border-[#E8E5DE] shadow-xs p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#526B50] inline-block">
              {currentQ.title}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight leading-snug">
              {currentQ.subtitle}
            </h1>
            <p className="text-xs text-[#666666] font-medium">
              {currentQ.hint}
            </p>
          </div>

          {/* Text Area */}
          <div className="relative">
            <textarea
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              rows={6}
              placeholder={currentQ.placeholder}
              className="w-full p-4 rounded-xl border border-[#E8E5DE] bg-[#FFFDF8] text-sm text-[#171717] font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#526B50] focus:border-transparent placeholder:text-[#999999] transition-all resize-y"
              autoFocus
            />
            <div className="flex justify-between items-center mt-2 px-1 text-[11px] font-mono text-[#888888]">
              <span>Text input only • Preserved across questions</span>
              <span>{currentAnswer.length} characters</span>
            </div>
          </div>

          {/* Question Dots Navigation */}
          <div className="pt-2 flex items-center justify-center gap-1.5 flex-wrap">
            {QUESTIONS.map((q, idx) => {
              const isDone = (answers[idx] || '').trim().length > 0;
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-[#171717] text-white'
                      : isDone
                      ? 'bg-[#EDF2E9] text-[#526B50] border border-[#A8B99A]'
                      : 'bg-[#F4F3EF] text-[#888888] hover:bg-[#E8E5DE]'
                  }`}
                  title={`${q.title}: ${isDone ? 'Answered' : 'Pending'}`}
                >
                  {q.id}
                </button>
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-[#E8E5DE] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                currentIndex === 0
                  ? 'opacity-40 cursor-not-allowed text-[#888888]'
                  : 'bg-[#F4F3EF] hover:bg-[#E8E5DE] text-[#171717]'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={saveAndContinue}
                className="text-xs font-semibold text-[#666666] hover:text-[#171717] px-3 py-2"
              >
                Skip to Prompt
              </button>

              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                className="gap-2 text-xs font-bold bg-[#FFE76B] hover:bg-[#FADB3D] text-[#171717] border border-[#171717] shadow-[2px_2px_0px_#171717]"
              >
                <span>{currentIndex === QUESTIONS.length - 1 ? 'Generate Prompt' : 'Next Question'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
