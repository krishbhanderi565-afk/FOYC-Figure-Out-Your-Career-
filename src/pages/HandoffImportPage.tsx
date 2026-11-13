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
  Trash2,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

export const HandoffImportPage: React.FC = () => {
  const navigate = useNavigate();
  const { applyHandoffText } = useCareer();
  const [handoffInput, setHandoffInput] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [validationSuccess, setValidationSuccess] = useState(false);

  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setHandoffInput(text);
          setErrors([]);
          setValidationSuccess(false);
        }
      } else {
        alert('Clipboard API unavailable. Please paste into the box with Ctrl+V (or long-press on mobile).');
      }
    } catch {
      alert('Clipboard permission denied by browser. Please paste into the box manually with Ctrl+V or Cmd+V.');
    }
  };

  const handleClear = () => {
    setHandoffInput('');
    setErrors([]);
    setValidationSuccess(false);
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_HANDOFFS.find((s) => s.id === sampleId);
    if (sample) {
      setHandoffInput(sample.rawText);
      setErrors([]);
      setValidationSuccess(false);
    }
  };

  const handleValidate = () => {
    setErrors([]);
    setValidationSuccess(false);

    if (!handoffInput.trim()) {
      setErrors(['Please paste your FOYC-ready handoff block from ChatGPT before validating.']);
      return;
    }

    const res = applyHandoffText(handoffInput);
    if (res.success) {
      setValidationSuccess(true);
      // Give visual feedback then transition to preview
      setTimeout(() => {
        navigate('/import-preview');
      }, 400);
    } else {
      setErrors(res.errors);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCEEE9] flex flex-col text-[#17172B]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#17172B]/60 mb-6">
          <Link to="/prompt-ready" className="hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Stage 4: ChatGPT Prompt
          </Link>
          <span>/</span>
          <span className="text-[#17172B]">Create My Dashboard</span>
        </div>

        {/* Official Section 9 Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <Badge variant="parrot" size="sm">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Handoff Import & Extraction
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-[#17172B] tracking-tight leading-[1.12]">
            Create My Personalized <Highlight color="#FFE76B">Dashboard</Highlight>
          </h1>
          <p className="text-base sm:text-lg text-[#17172B]/80 font-semibold">
            Your career discussion is complete. Paste your FOYC-ready prompt below and let us organize your next steps.
          </p>
        </div>

        {/* Quick Demo Example Links */}
        <div className="bg-[#FFFDF8] p-4 rounded-2xl border-2 border-[#17172B] shadow-[3px_3px_0px_#17172B] mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#17172B] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#315B28]" />
            Example Handoffs (Quick Test):
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_HANDOFFS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleLoadSample(sample.id)}
                className="px-3 py-1 bg-[#DDF5C5] hover:bg-[#B8E986] text-xs font-bold rounded-lg border-2 border-[#17172B] shadow-[1.5px_1.5px_0px_#17172B] transition-colors"
              >
                {sample.role}
              </button>
            ))}
          </div>
        </div>

        {/* Large Paste Box Card */}
        <Card variant="white" shadowSize="lg" className="p-6 sm:p-8 mb-6 border-3 bg-[#FFFDF8]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#17172B]/15">
            <span className="text-xs font-black uppercase tracking-wider text-[#17172B]">
              Paste FOYC Handoff Block
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePasteFromClipboard}
                className="gap-1.5 text-xs font-bold py-1 bg-[#F2F9E9] hover:bg-[#DDF5C5]"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                Paste from Clipboard
              </Button>

              {handoffInput && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="gap-1 text-xs py-1 border border-[#17172B] text-red-700 hover:bg-red-50"
                  title="Clear paste box"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          <textarea
            value={handoffInput}
            onChange={(e) => {
              setHandoffInput(e.target.value);
              if (errors.length) setErrors([]);
              setValidationSuccess(false);
            }}
            rows={13}
            placeholder={`FOYC_DASHBOARD_START\n{\n  "schema_version": "foyc_dashboard_v2",\n  "profile": {\n    "preferred_name": "Alex",\n    ...\n  },\n  "career_direction": {\n    "primary_career_direction": "Full-Stack Software Engineer",\n    ...\n  },\n  "roadmap": { ... },\n  "tasks": [ ... ],\n  "habits": [ ... ]\n}\nFOYC_DASHBOARD_END`}
            className="w-full p-4 rounded-xl border-2 border-[#17172B] bg-[#F2F9E9] font-mono text-xs sm:text-sm text-[#17172B] focus:outline-none focus:ring-2 focus:ring-[#B8E986] shadow-[2px_2px_0px_#17172B] resize-y leading-relaxed"
          />

          {/* Validation Error Feedback */}
          {errors.length > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border-2 border-red-400 text-red-900 text-xs sm:text-sm space-y-1 animate-fadeIn">
              <div className="flex items-center gap-2 font-black text-red-700">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Handoff Parsing Issue:</span>
              </div>
              {errors.map((err, i) => (
                <p key={i} className="font-semibold">• {err}</p>
              ))}
            </div>
          )}

          {/* Validation Success Feedback */}
          {validationSuccess && (
            <div className="mt-4 p-4 rounded-xl bg-[#DDF5C5] border-2 border-[#315B28] text-[#17172B] text-xs sm:text-sm flex items-center gap-2 font-black animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-[#315B28]" />
              <span>Handoff validated successfully! Generating dashboard preview...</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 mt-2 text-xs font-bold text-[#17172B]/60 border-t border-[#17172B]/10">
            <span>{handoffInput.length} characters pasted</span>
            <span>Deterministic schema validation (Zero AI API required)</span>
          </div>
        </Card>

        {/* Simple Instructions */}
        <Card variant="white" shadowSize="sm" className="p-4 mb-6 border-2 flex items-start gap-3 bg-white">
          <HelpCircle className="w-5 h-5 text-[#17172B] shrink-0 mt-0.5" />
          <div className="text-xs font-semibold text-[#17172B]/85 space-y-1">
            <span className="font-black text-[#17172B] block uppercase tracking-wider">
              Simple Instructions:
            </span>
            <p>
              1. Ask ChatGPT: "Would you like me to prepare your personalized FOYC Career Dashboard Prompt?" and reply YES.
            </p>
            <p>
              2. Copy the entire code block including <code className="font-bold bg-white px-1 py-0.5 rounded border border-[#17172B]">FOYC_DASHBOARD_START</code> and <code className="font-bold bg-white px-1 py-0.5 rounded border border-[#17172B]">FOYC_DASHBOARD_END</code>.
            </p>
            <p>
              3. Click <strong>Validate & Preview Plan</strong> below to inspect and customize your roadmap before saving.
            </p>
          </div>
        </Card>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/prompt-ready">
            <Button variant="secondary" size="md" className="gap-2 w-full sm:w-auto font-bold">
              <ArrowLeft className="w-4 h-4" />
              Back to Prompt
            </Button>
          </Link>

          <Button
            variant="parrot"
            size="lg"
            onClick={handleValidate}
            disabled={!handoffInput.trim()}
            className="gap-3 w-full sm:w-auto font-black shadow-[4px_4px_0px_#17172B]"
          >
            <FileCheck2 className="w-5 h-5 text-[#17172B]" />
            <span>Validate & Preview Plan</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </main>
    </div>
  );
};
