import React, { useState } from 'react';
import { Highlight } from '../common/Highlight';
import { Badge } from '../common/Badge';
import { ChevronDown, Plus, Minus } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do I need to sign up or enter a credit card to start?',
      a: 'Absolutely not. FOYC requires zero login or registration for your initial discovery. You can share your background, write your personal reflection, generate your ChatGPT coach prompt, and even test the handoff completely free.',
    },
    {
      q: 'Why does FOYC use ChatGPT instead of an embedded chatbot inside the website?',
      a: 'Embedded chatbots inside websites are usually constrained by tokens, generic system prompts, and privacy compromises. By running the discovery conversation in your personal ChatGPT account, you get unlimited conversational depth, full conversation ownership, and total privacy. FOYC simply provides the structured coach prompt and transforms the final handoff into your living dashboard.',
    },
    {
      q: 'Does FOYC claim to see or spy on my private ChatGPT chats?',
      a: 'Never. FOYC has zero automated access to your ChatGPT account, and cannot read or intercept your private session. You have full control: you manually copy the prompt into ChatGPT, have your conversation, and copy only the structured handoff block back into FOYC.',
    },
    {
      q: 'What if I have never attended college or come from a non-traditional background?',
      a: 'FOYC was designed intentionally for everyone—whether you are a high schooler, self-taught programmer, blue-collar worker pivoting to tech, or a college graduate. The system evaluates real transferable skills and practical proof of work rather than pedigree.',
    },
    {
      q: 'Can I change my career direction after setting up my dashboard?',
      a: 'Yes, anytime! Your dashboard includes a dedicated "Revisit My Career Direction" feature. You can adjust your targets, add new milestones, switch tracks, or import an updated handoff whenever your goals evolve.',
    },
    {
      q: 'What is the "Universal Personalization Engine"?',
      a: 'FOYC avoids creating rigid, hardcoded silos for every job title. Instead, our universal engine powers all professions using the same structured modules: Career Fit, Interactive Roadmap, Learning Checklist, Habit Tracker, Projects, and Weekly Reviews, customized dynamically by your approved data.',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#FFFDF7] border-t-3 border-[#17172B]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="lavender" className="mb-4">
            Got Questions?
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#17172B] tracking-tight leading-[1.15] mb-4">
            Everything you need to <Highlight color="#FFE76B">know about FOYC.</Highlight>
          </h2>
          <p className="text-base sm:text-lg text-[#17172B]/75 font-medium">
            Clear, honest answers. No marketing spin.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border-2 border-[#17172B] bg-white overflow-hidden shadow-[3px_3px_0px_#17172B] transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-extrabold text-base sm:text-lg text-[#17172B] hover:bg-[#FFF8E9]/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <div
                    className={`w-8 h-8 rounded-lg border-2 border-[#17172B] flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? 'bg-[#FFE76B]' : 'bg-white'
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#17172B]/80 font-medium leading-relaxed border-t border-[#17172B]/10 animate-in fade-in-50 duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
