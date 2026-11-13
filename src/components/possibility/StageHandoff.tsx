import React, { useState } from 'react';
import { PossibilityHandoff } from '../../types/possibility';
import { parsePossibilityHandoff, getSamplePossibilityHandoff } from '../../utils/possibilityEngine';
import {
  ClipboardPaste,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FileText,
  RotateCcw,
} from 'lucide-react';

interface StageHandoffProps {
  initialText?: string;
  onSuccess: (report: PossibilityHandoff, rawText: string) => void;
  onBack: () => void;
}

export const StageHandoff: React.FC<StageHandoffProps> = ({
  initialText = '',
  onSuccess,
  onBack,
}) => {
  const [rawText, setRawText] = useState(initialText);
  const [error, setError] = useState<string | null>(null);
  const [validationSuccess, setValidationSuccess] = useState<PossibilityHandoff | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setRawText(text);
        setError(null);
      }
    } catch {
      setError('Unable to read directly from clipboard. Please paste (Ctrl+V) into the text box below.');
    }
  };

  const handleValidate = () => {
    if (!rawText.trim()) {
      setError('Please paste your ChatGPT response first.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    setTimeout(() => {
      const result = parsePossibilityHandoff(rawText);
      setIsProcessing(false);

      if (result.success && result.data) {
        setValidationSuccess(result.data);
        setError(null);
      } else {
        setError(
          result.errors?.length
            ? result.errors.join(' ')
            : 'Could not extract the structured FOYC Possibility handoff block. Please ensure you copied ChatGPT\'s full JSON block.'
        );
        setValidationSuccess(null);
      }
    }, 400);
  };

  const handleLoadSample = () => {
    const sample = getSamplePossibilityHandoff('Alex');
    setRawText(`\`\`\`json\n${JSON.stringify(sample, null, 2)}\n\`\`\``);
    setValidationSuccess(sample);
    setError(null);
  };

  const handleProceed = () => {
    if (validationSuccess) {
      onSuccess(validationSuccess, rawText);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-block text-xs font-bold tracking-wider uppercase px-3 py-1 bg-[#FFE76B]/60 text-[#171717] rounded-full border border-[#171717]/20 mb-3">
          Stage 4: Bring Your Discoveries Back
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-[#171717] tracking-tight mb-2">
          Bring Your Discoveries Back to FOYC
        </h2>
        <p className="text-sm md:text-base text-[#555] max-w-2xl mx-auto font-medium">
          You've explored different directions with ChatGPT. Paste your complete final response or the structured JSON code block below to generate your interactive report.
        </p>
      </div>

      {/* Main Submission Box */}
      <div className="bg-white rounded-2xl border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <label htmlFor="possibility-handoff-textarea" className="text-xs font-bold uppercase tracking-wider text-[#171717] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#526B50]" />
            <span>Paste ChatGPT Exploration Handoff</span>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePasteClipboard}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FDF5EB] text-[#171717] border border-[#171717]/20 hover:border-[#171717] flex items-center gap-1.5 transition-colors"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>Paste from Clipboard</span>
            </button>

            <button
              type="button"
              onClick={handleLoadSample}
              className="text-[11px] font-semibold text-[#526B50] hover:underline"
            >
              (Load Sample Exploration)
            </button>
          </div>
        </div>

        <textarea
          id="possibility-handoff-textarea"
          rows={12}
          value={rawText}
          onChange={(e) => {
            setRawText(e.target.value);
            if (error) setError(null);
            if (validationSuccess) setValidationSuccess(null);
          }}
          placeholder="Paste your complete FOYC POSSIBILITY EXPLORATION REPORT — STRUCTURED HANDOFF here..."
          className="w-full p-4 font-mono text-xs md:text-sm rounded-xl border border-[#171717]/20 bg-[#FAF8F5] text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#526B50] leading-relaxed resize-y"
        />

        <div className="flex items-center justify-between mt-3 text-xs text-[#666]">
          <span>{rawText.length.toLocaleString()} characters entered</span>
          <span>Supports full markdown chat response or direct JSON</span>
        </div>

        {/* Diagnostic Error Banner */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 border-2 border-red-300 text-red-800 text-xs md:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Validation Issue:</p>
              <p>{error}</p>
              <div className="mt-2 pt-2 border-t border-red-200 text-xs text-red-700">
                <span className="font-bold">💡 How to fix in ChatGPT:</span> Ask ChatGPT:
                <code className="block mt-1 p-2 bg-white rounded border border-red-200 font-mono text-[11px] text-gray-800">
                  "Please output the structured handoff block titled 'FOYC POSSIBILITY EXPLORATION REPORT — STRUCTURED HANDOFF' inside a single ```json code block with all fields: profile, exploration_summary, possibilities, shortlisted_options, recommended_experiments, next_steps."
                </code>
              </div>
            </div>
          </div>
        )}

        {/* Validation Success Banner */}
        {validationSuccess && (
          <div className="mt-4 p-4 rounded-xl bg-[#526B50]/15 border-2 border-[#526B50] text-[#171717] text-xs md:text-sm">
            <div className="flex items-center gap-2 mb-2 font-bold text-[#526B50]">
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>Possibility Exploration Handoff Successfully Validated!</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#526B50]/20 text-xs">
              <div>
                <span className="text-[#666] block">Possibilities Discovered:</span>
                <span className="font-bold text-[#171717]">
                  {validationSuccess.possibilities?.length || 0} Opportunities Identified
                </span>
              </div>
              <div>
                <span className="text-[#666] block">Shortlisted Candidates:</span>
                <span className="font-bold text-[#171717]">
                  {validationSuccess.shortlisted_options?.length || 0} Priority Options
                </span>
              </div>
              <div>
                <span className="text-[#666] block">Experiments Ready:</span>
                <span className="font-bold text-[#171717]">
                  {validationSuccess.recommended_experiments?.length || 0} Practical Tests
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
          {!validationSuccess ? (
            <button
              type="button"
              onClick={handleValidate}
              disabled={isProcessing || !rawText.trim()}
              className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                rawText.trim() && !isProcessing
                  ? 'bg-[#FFE76B] text-[#171717] border-[#171717] shadow-[3px_3px_0px_#171717] hover:translate-x-[1px] hover:translate-y-[1px]'
                  : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
              }`}
            >
              {isProcessing ? 'Validating schema...' : 'Validate & Preview Possibility Report'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleProceed}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#526B50] text-white font-extrabold text-sm border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-center justify-center gap-2 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#171717] transition-all"
            >
              <span>View My Possibility Report</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Back Button */}
      <div className="pt-2 flex justify-start">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl font-bold text-sm text-[#171717] border border-[#171717]/30 hover:bg-[#171717]/5 transition-colors"
        >
          ← Back to Exploration Prompt
        </button>
      </div>
    </div>
  );
};
