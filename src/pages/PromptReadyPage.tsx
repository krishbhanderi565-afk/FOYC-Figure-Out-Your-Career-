import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCareer } from '../context/CareerContext';
import { Navbar } from '../components/common/Navbar';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Highlight } from '../components/common/Highlight';
import { Badge } from '../components/common/Badge';
import { generateDiscoveryPrompt } from '../utils/promptGenerator';
import {
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  ShieldAlert,
  MessageSquareCode,
} from 'lucide-react';

export const PromptReadyPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, reflection } = useCareer();
  const [copied, setCopied] = useState(false);

  const promptText = generateDiscoveryPrompt(profile, reflection);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleOpenChatGPT = () => {
    window.open('https://chatgpt.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#FFF8E9] flex flex-col text-[#17172B]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#17172B]/60 mb-6">
          <Link to="/reflection" className="hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Stage 3: Reflection
          </Link>
          <span>/</span>
          <span className="text-[#17172B]">Stage 4: Generated Prompt Ready</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF5C9] border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B] text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-[#17172B]" />
            Prompt Successfully Synthesized
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#17172B] tracking-tight leading-[1.12]">
            Your personalized career discovery prompt is <Highlight color="#FFE76B">ready.</Highlight>
          </h1>
          <p className="text-base sm:text-lg text-[#17172B]/75 font-medium mt-3">
            Copy this structured prompt and paste it into ChatGPT. It instructs ChatGPT to act as a patient, objective career coach.
          </p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border-3 border-[#17172B] shadow-[5px_5px_0px_#17172B] mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFE76B] border-2 border-[#17172B] flex items-center justify-center shrink-0">
              <MessageSquareCode className="w-5 h-5 text-[#17172B]" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#17172B] block">Personalized Career Prompt</span>
              <span className="text-xs text-[#17172B]/60 font-semibold">{promptText.length} characters • Formatted with guidelines</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant={copied ? 'green' : 'primary'}
              size="md"
              onClick={handleCopy}
              className="gap-2 flex-1 sm:flex-none"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-800" />
                  <span className="text-emerald-950">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Prompt</span>
                </>
              )}
            </Button>

            <Button
              variant="dark"
              size="md"
              onClick={handleOpenChatGPT}
              className="gap-2 flex-1 sm:flex-none"
            >
              <span>Open ChatGPT</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Prompt Preview Text Container */}
        <Card variant="white" shadowSize="md" className="p-6 relative mb-8">
          <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#17172B]/20">
            <span className="text-xs font-black uppercase tracking-wider text-[#17172B]/70">
              Prompt Preview
            </span>
            <button
              onClick={handleCopy}
              className="text-xs font-bold text-[#17172B] hover:underline flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>
          <pre className="font-mono text-xs sm:text-sm text-[#17172B]/90 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto bg-[#FFFDF7] p-4 rounded-xl border border-[#17172B]/30 select-all">
            {promptText}
          </pre>
        </Card>

        {/* 4 Step Instructions Card */}
        <Card variant="blue" shadowSize="md" className="p-6 sm:p-8 mb-8">
          <h3 className="font-extrabold text-lg sm:text-xl text-[#17172B] mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-[#17172B]" />
            What to do next:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border-2 border-[#17172B]">
              <span className="text-xs font-black uppercase tracking-wider text-[#17172B]/60 block mb-1">
                Step 1: Paste & Chat
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[#17172B]">
                Open ChatGPT, paste the prompt, and answer ChatGPT's questions honestly one at a time.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border-2 border-[#17172B]">
              <span className="text-xs font-black uppercase tracking-wider text-[#17172B]/60 block mb-1">
                Step 2: Request Handoff
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[#17172B]">
                When you agree on a direction, ChatGPT will ask to generate your FOYC Handoff. Say "YES".
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border-2 border-[#17172B]">
              <span className="text-xs font-black uppercase tracking-wider text-[#17172B]/60 block mb-1">
                Step 3: Copy Handoff Block
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[#17172B]">
                Copy the entire delimited text block starting with <code>---BEGIN FOYC...</code>.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border-2 border-[#17172B]">
              <span className="text-xs font-black uppercase tracking-wider text-[#17172B]/60 block mb-1">
                Step 4: Return to FOYC
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[#17172B]">
                Click below to go to the Import screen, paste the handoff, and unlock your live dashboard.
              </p>
            </div>
          </div>
        </Card>

        {/* Privacy & Transparency Notice */}
        <div className="bg-[#FFF8E9] p-4 rounded-xl border-2 border-[#17172B]/30 flex items-start gap-3 mb-8 text-xs text-[#17172B]/75">
          <ShieldAlert className="w-4 h-4 text-[#17172B] shrink-0 mt-0.5" />
          <p>
            <strong>Transparent Architecture:</strong> FOYC never reads, tracks or intercepts your ChatGPT session. Your conversation takes place strictly inside your own ChatGPT account for maximum privacy and safety.
          </p>
        </div>

        {/* Bottom Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/reflection">
            <Button variant="secondary" size="md" className="gap-2 w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4" />
              Edit Reflection
            </Button>
          </Link>

          <Link to="/import" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="gap-3 w-full sm:w-auto font-black shadow-[5px_5px_0px_#17172B]">
              <span>Ready? Proceed to Import Handoff</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};
