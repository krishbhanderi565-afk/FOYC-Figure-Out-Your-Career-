import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCareer } from '../context/CareerContext';
import { Navbar } from '../components/common/Navbar';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Highlight } from '../components/common/Highlight';
import { SAMPLE_HANDOFFS } from '../utils/sampleHandoffs';
import {
  ClipboardPaste,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export const HandoffImportPage: React.FC = () => {
  const navigate = useNavigate();
  const { applyHandoffText } = useCareer();
  const [handoffInput, setHandoffInput] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setHandoffInput(text);
        setErrors([]);
      }
    } catch {
      alert('Clipboard permission denied. Please paste manually into the text box using Ctrl+V or Cmd+V.');
    }
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_HANDOFFS.find((s) => s.id === sampleId);
    if (sample) {
      setHandoffInput(sample.rawText);
      setErrors([]);
    }
  };

  const handleValidateAndContinue = () => {
    setErrors([]);
    const res = applyHandoffText(handoffInput);
    if (res.success) {
      navigate('/import-preview');
    } else {
      setErrors(res.errors);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8E9] flex flex-col text-[#17172B]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#17172B]/60 mb-6">
          <Link to="/prompt-ready" className="hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Stage 4: Prompt
          </Link>
          <span>/</span>
          <span className="text-[#17172B]">Stage 7: Import Handoff</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="yellow" className="mb-3">
            Stage 07 • Handoff Import
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#17172B] tracking-tight leading-[1.12]">
            Your career direction is ready.{' '}
            <Highlight color="#FFE76B">Let's build your dashboard.</Highlight>
          </h1>
          <p className="text-base sm:text-lg text-[#17172B]/75 font-medium mt-3">
            Paste the FOYC Dashboard Handoff Prompt generated during your ChatGPT conversation. We'll organize your career direction, learning roadmap, tasks and habits into your personal workspace.
          </p>
        </div>

        {/* Quick Demo Pre-fill Pills */}
        <div className="bg-white p-4 rounded-2xl border-2 border-[#17172B] shadow-[3px_3px_0px_#17172B] mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#17172B] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            Quick Demo: Load a Pre-Generated Sample:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_HANDOFFS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleLoadSample(sample.id)}
                className="px-3 py-1 bg-[#FFF8E9] hover:bg-[#FFE76B] text-xs font-bold rounded-lg border border-[#17172B] transition-colors"
              >
                {sample.role}
              </button>
            ))}
          </div>
        </div>

        {/* Big Paste Area Card */}
        <Card variant="white" shadowSize="lg" className="p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#17172B]/20">
            <span className="text-xs font-black uppercase tracking-wider text-[#17172B]/70">
              Paste Handoff Text Block
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePasteFromClipboard}
              className="gap-1.5 text-xs py-1"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              Paste from Clipboard
            </Button>
          </div>

          <textarea
            value={handoffInput}
            onChange={(e) => {
              setHandoffInput(e.target.value);
              if (errors.length) setErrors([]);
            }}
            rows={12}
            placeholder={`FOYC CAREER DASHBOARD HANDOFF\n\n---BEGIN FOYC CAREER DIRECTION---\nPrimary: Full-Stack Software Engineer\nSummary: ...\n---END FOYC CAREER DIRECTION---\n\n---BEGIN FOYC MILESTONES---\n1. Foundation ...\n---END FOYC MILESTONES---`}
            className="w-full p-4 rounded-xl border-2 border-[#17172B] bg-[#FFFDF7] font-mono text-xs sm:text-sm text-[#17172B] focus:outline-none focus:ring-2 focus:ring-[#FFE76B] shadow-[2px_2px_0px_#17172B] resize-y leading-relaxed"
          />

          {/* Error messages if validation failed */}
          {errors.length > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border-2 border-red-400 text-red-900 text-xs sm:text-sm space-y-1">
              <div className="flex items-center gap-2 font-bold text-red-700">
                <AlertTriangle className="w-4 h-4" />
                Handoff Validation Issue:
              </div>
              {errors.map((err, i) => (
                <p key={i}>• {err}</p>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 mt-2 text-xs font-bold text-[#17172B]/60">
            <span>{handoffInput.length} characters pasted</span>
            <span>Must include standard FOYC section markers</span>
          </div>
        </Card>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/prompt-ready">
            <Button variant="secondary" size="md" className="gap-2 w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4" />
              Back to Prompt
            </Button>
          </Link>

          <Button
            variant="primary"
            size="lg"
            onClick={handleValidateAndContinue}
            disabled={!handoffInput.trim()}
            className="gap-3 w-full sm:w-auto font-black shadow-[5px_5px_0px_#17172B]"
          >
            <FileCheck2 className="w-5 h-5" />
            <span>Validate & Preview Dashboard Draft</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </main>
    </div>
  );
};
