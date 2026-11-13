import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCareer } from '../context/CareerContext';
import { Navbar } from '../components/common/Navbar';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Highlight } from '../components/common/Highlight';
import {
  Mic,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Lightbulb,
  HeartHandshake,
  Check,
} from 'lucide-react';

export const MindReflectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { reflection, updateReflection } = useCareer();
  const [mindText, setMindText] = useState(reflection.mindText || '');
  const [isRecording, setIsRecording] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const characterCount = mindText.length;

  const guidanceQuestions = [
    'What are you currently studying, learning or working on?',
    'What genuinely interests or excites you?',
    'What do you enjoy doing when nobody is grading or paying you?',
    'What are you struggling with the most?',
    'Which specific career options are confusing you right now?',
    'What do you want your daily future lifestyle to look like?',
    'What constraints, time limitations or financial responsibilities do you have?',
    'Is there a path you are doing only because family or peers expect you to?',
  ];

  const quickStarters = [
    "I'm torn between Software Engineering and AI...",
    "I have no coding experience but want to enter tech...",
    "I feel overwhelmed by how fast AI is changing...",
    "I want to build my own startup or micro-products...",
  ];

  const handleAppendStarter = (text: string) => {
    if (!mindText.trim()) {
      setMindText(text + ' ');
    } else {
      setMindText((prev) => prev.trim() + ' ' + text + ' ');
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your reflection?')) {
      setMindText('');
    }
  };

  const handleVoiceInputMock = () => {
    setIsRecording(true);
    setToastMessage('Voice input simulation: Listening... (Click to stop)');
    setTimeout(() => {
      setIsRecording(false);
      setToastMessage('Voice transcribed smoothly!');
      if (!mindText.includes('I enjoy building projects and problem solving')) {
        setMindText((prev) =>
          prev
            ? prev + ' I also enjoy building practical projects and problem solving with creative teammates.'
            : 'I enjoy building practical projects and problem solving with creative teammates.'
        );
      }
      setTimeout(() => setToastMessage(null), 3000);
    }, 2500);
  };

  const handleContinue = () => {
    updateReflection({ mindText });
    navigate('/prompt-ready');
  };

  return (
    <div className="min-h-screen bg-[#FFF8E9] flex flex-col text-[#17172B]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Breadcrumb indicator */}
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#17172B]/60 mb-6">
          <Link to="/onboarding" className="hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Stage 2: Profile
          </Link>
          <span>/</span>
          <span className="text-[#17172B]">Stage 3: Personal Reflection</span>
        </div>

        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD9E8] border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B] text-xs font-black uppercase tracking-wider mb-3">
            <HeartHandshake className="w-4 h-4 text-[#17172B]" />
            A Safe, Judgment-Free Space
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#17172B] tracking-tight leading-[1.12]">
            Let's start with <Highlight color="#FFE76B">what's on your mind.</Highlight>
          </h1>
          <p className="text-base sm:text-lg text-[#17172B]/80 font-medium mt-3 leading-relaxed">
            You don't need to have everything figured out. Tell us honestly about your interests, ambitions, struggles and confusion.
          </p>
        </div>

        {/* Main 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Big Textarea Container */}
          <div className="lg:col-span-8">
            <Card variant="white" shadowSize="lg" className="p-6 sm:p-8 relative">
              {/* Top Textarea Toolbar */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#17172B]/20">
                <span className="text-xs font-black uppercase tracking-wider text-[#17172B]/70">
                  Your Open Reflection
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleVoiceInputMock}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border-2 border-[#17172B] flex items-center gap-1.5 transition-all ${
                      isRecording
                        ? 'bg-red-400 text-white animate-pulse'
                        : 'bg-[#FFF8E9] hover:bg-[#FFE76B] text-[#17172B]'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{isRecording ? 'Listening...' : 'Voice Input'}</span>
                  </button>
                  {mindText && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-300 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Toast if recording */}
              {toastMessage && (
                <div className="mb-3 px-3 py-2 rounded-lg bg-[#FFE76B] border border-[#17172B] text-xs font-bold text-[#17172B] animate-in fade-in-50">
                  {toastMessage}
                </div>
              )}

              {/* The large textarea */}
              <textarea
                value={mindText}
                onChange={(e) => setMindText(e.target.value)}
                rows={12}
                placeholder="I'm currently studying computer science. Everyone around me says AI will replace programming, and I'm confused about what skills I should develop. I enjoy building projects and solving problems, but I don't know which career direction is right for me. I want to build something meaningful in the future..."
                className="w-full p-4 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-medium text-base text-[#17172B] focus:outline-none focus:ring-2 focus:ring-[#FFE76B] shadow-[2px_2px_0px_#17172B] leading-relaxed resize-y"
              />

              {/* Bottom Character Counter & Hint */}
              <div className="flex items-center justify-between pt-3 mt-2 text-xs font-bold text-[#17172B]/60">
                <span>{characterCount} characters written</span>
                <span>The more honest you are, the better the guidance.</span>
              </div>

              {/* Quick Thought Starters */}
              <div className="mt-6 pt-4 border-t-2 border-[#17172B]/20">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#17172B]/60 block mb-2">
                  Need inspiration? Click to insert:
                </span>
                <div className="flex flex-wrap gap-2">
                  {quickStarters.map((starter, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAppendStarter(starter)}
                      className="px-3 py-1.5 rounded-lg bg-[#FFF8E9] hover:bg-[#FFE76B] text-xs font-bold text-[#17172B] border border-[#17172B] transition-all"
                    >
                      + {starter}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Bottom Actions */}
            <div className="mt-8 flex items-center justify-between">
              <Link to="/onboarding">
                <Button variant="secondary" size="md" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <Button
                variant="primary"
                size="lg"
                onClick={handleContinue}
                disabled={characterCount < 10}
                className="gap-3 px-8 text-base font-extrabold shadow-[5px_5px_0px_#17172B]"
              >
                <span>Generate ChatGPT Coach Prompt</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Right Column: Guidance Panel */}
          <div className="lg:col-span-4 space-y-5">
            <Card variant="yellow" shadowSize="md" className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-[#17172B]" />
                <h3 className="font-black text-base uppercase tracking-wider text-[#17172B]">
                  Helpful Questions to Consider
                </h3>
              </div>
              <p className="text-xs text-[#17172B]/80 font-medium mb-4">
                You don't need to answer every question. Let these trigger thoughts you might have held back:
              </p>

              <div className="space-y-2.5">
                {guidanceQuestions.map((q, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs font-bold text-[#17172B]/90 bg-white/70 p-2.5 rounded-lg border border-[#17172B]/40">
                    <span className="text-[#17172B] font-mono font-black">•</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Privacy Promise Card */}
            <Card variant="green" shadowSize="sm" className="p-5">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#17172B] block mb-1">
                🔒 Private & Local
              </span>
              <p className="text-xs text-[#17172B]/85 font-medium leading-relaxed">
                Your reflection stays in your browser until you choose to copy it to ChatGPT. FOYC does not monetize or train on your personal text.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
