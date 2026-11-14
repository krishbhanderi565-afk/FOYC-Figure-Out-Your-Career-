import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowRight, 
  MessageSquare, 
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { openChatGPTWithPrompt } from '../../utils/chatGptLauncher';

interface StagePromptGeneratorProps {
  promptText: string;
  onProceedToHandoff: () => void;
  onBack: () => void;
}

export const StagePromptGenerator: React.FC<StagePromptGeneratorProps> = ({
  promptText,
  onProceedToHandoff,
  onBack,
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = promptText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Stage Header */}
      <div className="text-center mb-8">
        <span className="inline-block text-xs font-bold tracking-wider uppercase px-3 py-1 bg-[#FFE76B]/60 text-[#171717] rounded-full border border-[#171717]/20 mb-3">
          Stage 5 of 7: ChatGPT Exploration Master Prompt
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#171717] tracking-tight mb-2">
          Your Advisory Master Prompt is Ready
        </h2>
        <p className="text-sm md:text-base text-[#555] max-w-2xl mx-auto font-medium">
          FOYC has converted your inputs into an exhaustive, highly structured prompt. Paste it into ChatGPT to conduct a rigorous, 1-on-1 career exploration session.
        </p>
      </div>

      {/* Guide Callout Card */}
      <div className="bg-[#526B50]/10 border-2 border-[#526B50]/30 rounded-2xl p-5 mb-6 shadow-[2px_2px_0px_#526B50]">
        <div className="flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-[#526B50] text-white flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="text-xs md:text-sm text-[#171717] space-y-1.5 leading-relaxed">
            <p className="font-bold text-sm text-[#171717]">How this works:</p>
            <ol className="list-decimal list-inside space-y-1 text-[#333]">
              <li><strong>Copy</strong> the master prompt below and click <strong>Open ChatGPT</strong>.</li>
              <li>Engage in a 10–15 minute thoughtful exploration interview with ChatGPT.</li>
              <li>At the conclusion of your conversation, ChatGPT will generate a <strong>structured JSON handoff block</strong>.</li>
              <li>Return here, paste the handoff block, and FOYC will construct your permanent <strong>Personal Clarity Report & Live Dashboard</strong>.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* The Master Prompt Container */}
      <div className="bg-white rounded-2xl border-2 border-[#171717] shadow-[4px_4px_0px_#171717] overflow-hidden mb-8">
        {/* Top Control Bar */}
        <div className="bg-[#FDF5EB] px-5 py-3.5 border-b-2 border-[#171717] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#526B50]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#171717]">
              Advisory Master Prompt
            </span>
            <span className="text-[11px] text-[#666] hidden sm:inline">
              ({promptText.length.toLocaleString()} characters)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 border-2 transition-all ${
                copied
                  ? 'bg-[#526B50] text-white border-[#171717]'
                  : 'bg-[#FFE76B] text-[#171717] border-[#171717] hover:bg-[#ffe040]'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Prompt'}</span>
            </button>

            <button
              type="button"
              onClick={() => openChatGPTWithPrompt(promptText)}
              className="px-4 py-2 rounded-xl font-bold text-xs bg-[#171717] text-white flex items-center gap-2 border-2 border-[#171717] hover:bg-[#333] transition-colors cursor-pointer"
            >
              <span>Open in ChatGPT (Auto-pasted)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Prompt Content Preview */}
        <div className="relative">
          <div
            className={`p-5 font-mono text-xs md:text-sm text-[#222] bg-[#FAF8F5] leading-relaxed whitespace-pre-wrap overflow-y-auto ${
              expanded ? 'max-h-[600px]' : 'max-h-[260px]'
            }`}
          >
            {promptText}
          </div>

          {!expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FAF8F5] to-transparent pointer-events-none" />
          )}
        </div>

        {/* Bottom Expand Toggle */}
        <div className="bg-[#FAF8F5] px-5 py-2.5 border-t border-[#171717]/10 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-bold text-[#555] hover:text-[#171717] flex items-center gap-1.5 transition-colors"
          >
            <span>{expanded ? 'Collapse preview' : 'Expand full prompt preview'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#171717]/15">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl font-bold text-sm text-[#171717] border border-[#171717]/30 hover:bg-[#171717]/5 transition-colors"
        >
          ← Back to Assessment
        </button>

        <button
          type="button"
          onClick={onProceedToHandoff}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#526B50] text-white font-extrabold text-sm md:text-base border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-center justify-center gap-3 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#171717] transition-all"
        >
          <span>I Have the Response → Bring Clarity Back to FOYC</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
