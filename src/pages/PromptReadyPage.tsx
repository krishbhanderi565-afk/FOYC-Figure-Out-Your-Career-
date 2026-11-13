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
  Compass,
  Info,
  ShieldCheck,
  MessageSquareCode,
  AlertCircle,
} from 'lucide-react';

export const PromptReadyPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, reflection } = useCareer();
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const promptText = generateDiscoveryPrompt(profile, reflection);

  const copyToClipboard = async (): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(promptText);
        return true;
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = promptText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        textArea.remove();
        return successful;
      }
    } catch {
      return false;
    }
  };

  const handleContinueWithChatGPT = async () => {
    const success = await copyToClipboard();
    if (success) {
      setCopied(true);
      setCopyFailed(false);
      setStatusMessage('Your personalized prompt is copied!');
      // Open ChatGPT in a new tab
      window.open('https://chatgpt.com/', '_blank', 'noopener,noreferrer');
    } else {
      setCopyFailed(true);
      setStatusMessage('Clipboard access was blocked by your browser. Please use the Copy button below.');
    }
  };

  const handleManualCopy = async () => {
    const success = await copyToClipboard();
    if (success) {
      setCopied(true);
      setCopyFailed(false);
      setStatusMessage('Your personalized prompt is copied!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col text-[#171717]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#17172B]/60 mb-6">
          <Link to="/reflection" className="hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Reflection
          </Link>
          <span>/</span>
          <span className="text-[#17172B]">Prompt Ready</span>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <Badge variant="parrot" size="sm">
            <Compass className="w-3.5 h-3.5 mr-1" />
            Prompt Successfully Synthesized
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-[#17172B] tracking-tight leading-[1.12]">
            Your career discovery prompt is <Highlight color="#FFE76B">ready.</Highlight>
          </h1>
          <p className="text-base sm:text-lg text-[#17172B]/80 font-semibold">
            One click copies your prompt and launches ChatGPT to begin your personalized career discussion.
          </p>
        </div>

        {/* Primary Action Card */}
        <Card variant="white" shadowSize="lg" className="p-6 sm:p-8 space-y-6 border-3 bg-[#FFFDF8] mb-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#17172B]/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFE76B] border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B] flex items-center justify-center shrink-0">
                <MessageSquareCode className="w-6 h-6 text-[#17172B]" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-[#17172B]">
                  Personalized Discovery Coach Prompt
                </h3>
                <p className="text-xs text-[#17172B]/65 font-bold">
                  {promptText.length} characters • Includes handoff markers & schema rules
                </p>
              </div>
            </div>

            {/* Primary Action: Continue with ChatGPT */}
            <Button
              variant="parrot"
              size="lg"
              onClick={handleContinueWithChatGPT}
              className="gap-2.5 font-black text-base shadow-[4px_4px_0px_#17172B]"
            >
              <ExternalLink className="w-5 h-5 text-[#17172B]" />
              <span>Continue with ChatGPT</span>
            </Button>
          </div>

          {/* Feedback & Instructions Notification */}
          {statusMessage && (
            <div
              className={`p-4 rounded-xl border-2 flex items-start gap-3 transition-all ${
                copyFailed
                  ? 'bg-red-50 border-red-300 text-red-900'
                  : 'bg-[#DDF5C5] border-[#315B28] text-[#17172B]'
              }`}
            >
              {copyFailed ? (
                <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
              ) : (
                <Check className="w-5 h-5 text-[#315B28] shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 text-xs sm:text-sm">
                <p className="font-black">{statusMessage}</p>
                <p className="font-semibold text-[#17172B]/85">
                  Your prompt is ready. Paste it into ChatGPT using <strong>Ctrl+V</strong> (or long-press Paste on mobile), then press Enter to begin.
                </p>
              </div>
            </div>
          )}

          {/* Manual Copy Button (Always Available for Accessibility) */}
          <div className="flex items-center justify-between bg-[#F2F9E9] p-3 rounded-xl border-2 border-[#17172B]">
            <span className="text-xs font-bold text-[#17172B]/80 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#315B28]" />
              Manual clipboard control:
            </span>
            <Button
              variant={copied ? 'parrot' : 'secondary'}
              size="sm"
              onClick={handleManualCopy}
              className="gap-1.5 text-xs font-black shadow-[2px_2px_0px_#17172B]"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#315B28]" />
                  <span>Prompt Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#17172B]" />
                  <span>Copy Prompt Manually</span>
                </>
              )}
            </Button>
          </div>

          {/* Prompt Preview Block */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#17172B]/70">
                Prompt Preview
              </span>
              <span className="text-[11px] font-bold text-[#17172B]/50">
                Read-only preview
              </span>
            </div>
            <div className="max-h-72 overflow-y-auto p-4 rounded-xl bg-[#F2F9E9] border-2 border-[#17172B] font-mono text-xs text-[#17172B] whitespace-pre-wrap leading-relaxed select-all">
              {promptText}
            </div>
          </div>
        </Card>

        {/* 3 Step Guide Card */}
        <Card variant="white" shadowSize="md" className="p-6 space-y-4 border-2 bg-white">
          <h4 className="font-extrabold text-sm uppercase tracking-wider text-[#17172B] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#17172B]" />
            What happens next:
          </h4>
          <ol className="space-y-3 text-xs sm:text-sm font-semibold text-[#17172B]/85 list-decimal ml-5">
            <li>
              <strong>Paste into ChatGPT:</strong> Press Ctrl+V (or tap Paste) in the ChatGPT message box and send the prompt.
            </li>
            <li>
              <strong>Have your 1-on-1 discussion:</strong> ChatGPT will ask one question at a time to explore your strengths, interests, and potential directions.
            </li>
            <li>
              <strong>Say YES to the handoff:</strong> When you're ready, ChatGPT will ask if you'd like your personalized FOYC Career Dashboard block. Say YES to receive the <code className="bg-white px-1.5 py-0.5 rounded border border-[#17172B] font-bold">FOYC_DASHBOARD_START</code> block.
            </li>
          </ol>

          <div className="pt-3 border-t border-[#17172B]/15 flex items-center justify-between">
            <span className="text-xs font-bold text-[#17172B]/70">
              Already have your FOYC handoff block?
            </span>
            <Link to="/import">
              <Button variant="parrot" size="sm" className="gap-1.5 font-black text-xs">
                <span>Create Dashboard Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
};
