import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClarityAssessment, 
  ClarityFinalReport, 
  ClarityPersonData, 
  LifeStageId, 
  LifeStageKey,
  UncertaintyId 
} from '../types/clarity';
import { 
  generateDeterministicInitialReport, 
  generateChatGPTMasterPrompt 
} from '../utils/clarityEngine';
import { ClarityProgressBar, ClarityStep } from '../components/clarity/ClarityProgressBar';
import { StageSituation } from '../components/clarity/StageSituation';
import { StageUncertainty } from '../components/clarity/StageUncertainty';
import { StageUnderstand } from '../components/clarity/StageUnderstand';
import { StageInitialReport } from '../components/clarity/StageInitialReport';
import { StagePromptGenerator } from '../components/clarity/StagePromptGenerator';
import { StageHandoffSubmit } from '../components/clarity/StageHandoffSubmit';
import { StageFinalReport } from '../components/clarity/StageFinalReport';
import { api } from '../services/api';
import { useCareer } from '../context/CareerContext';
import { Navbar } from '../components/common/Navbar';

const DRAFT_STORAGE_KEY = 'foyc_clarity_compass_draft';

const STAGE_KEYS: ClarityStep[] = [
  'situation',
  'uncertainty',
  'understand',
  'initial-report',
  'prompt',
  'handoff-submit',
  'final-report',
];

export const ClarityCompassPage: React.FC = () => {
  const navigate = useNavigate();
  const { applyHandoffText } = useCareer();

  // Primary state
  const [stage, setStage] = useState<number>(1);
  const [lifeStage, setLifeStage] = useState<LifeStageId | null>(null);
  const [lifeStageOther, setLifeStageOther] = useState<string>('');
  const [selectedUncertainties, setSelectedUncertainties] = useState<UncertaintyId[]>([]);
  const [customUncertainty, setCustomUncertainty] = useState<string>('');
  const [reflectionText, setReflectionText] = useState<string>('');
  const [personData, setPersonData] = useState<ClarityPersonData>({
    interests: [],
    skillsPossessed: [],
    skillsToDevelop: [],
    visionDriver: '',
    timeAvailable: '5-15 hrs/week',
    budget: 'Free resources only',
    timeline: '3-6 months',
    workStyle: 'Flexible / Open',
    environmentPreference: 'Open to all',
    specificDrillDowns: {},
    personalContext: {},
  });
  const [assessment, setAssessment] = useState<ClarityAssessment | null>(null);
  const [promptText, setPromptText] = useState<string>('');
  const [finalReport, setFinalReport] = useState<ClarityFinalReport | null>(null);
  const [rawHandoffText, setRawHandoffText] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<string>('All progress saved');

  // Load draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.stage) setStage(parsed.stage);
        if (parsed.lifeStage) setLifeStage(parsed.lifeStage);
        if (parsed.lifeStageOther) setLifeStageOther(parsed.lifeStageOther);
        if (parsed.selectedUncertainties) setSelectedUncertainties(parsed.selectedUncertainties);
        if (parsed.customUncertainty) setCustomUncertainty(parsed.customUncertainty);
        if (parsed.reflectionText) setReflectionText(parsed.reflectionText);
        if (parsed.personData) setPersonData(parsed.personData);
        if (parsed.assessment) setAssessment(parsed.assessment);
        if (parsed.promptText) setPromptText(parsed.promptText);
        if (parsed.finalReport) setFinalReport(parsed.finalReport);
        if (parsed.rawHandoffText) setRawHandoffText(parsed.rawHandoffText);
      }
    } catch (e) {
      console.warn('Failed to parse clarity draft from localStorage', e);
    }

    // Try cloud draft if available
    api.getClarityAssessment().then((res) => {
      if (res && res.assessment) {
        const cloudData = res.assessment;
        if (cloudData.final_report) {
          setFinalReport(cloudData.final_report);
          setStage(7);
        }
      }
    }).catch(() => {});
  }, []);

  // Save draft on every change
  useEffect(() => {
    const draft = {
      stage,
      lifeStage,
      lifeStageOther,
      selectedUncertainties,
      customUncertainty,
      reflectionText,
      personData,
      assessment,
      promptText,
      finalReport,
      rawHandoffText,
      lastUpdated: new Date().toISOString(),
    };

    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      setSaveStatus('Draft saved locally');
    } catch {}

    const timer = setTimeout(() => {
      api.saveClarityAssessment({
        stage,
        life_stage: lifeStage,
        life_stage_other: lifeStageOther,
        selected_uncertainties: selectedUncertainties,
        custom_uncertainty: customUncertainty,
        reflection_text: reflectionText,
        person_data: personData,
        initial_report: assessment?.initial_report,
        prompt_text: promptText,
        final_report: finalReport,
        raw_handoff_text: rawHandoffText,
      }).then(() => {
        setSaveStatus('Synced with cloud');
      }).catch(() => {
        setSaveStatus('Saved locally');
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [
    stage,
    lifeStage,
    lifeStageOther,
    selectedUncertainties,
    customUncertainty,
    reflectionText,
    personData,
    assessment,
    promptText,
    finalReport,
    rawHandoffText,
  ]);

  // Scroll to top on stage change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stage]);

  // Transitions
  const handleStage1Next = () => {
    setStage(2);
  };

  const handleStage2Next = () => {
    setStage(3);
  };

  const handleStage3Next = () => {
    // Generate deterministic initial report
    const initialReport = generateDeterministicInitialReport(
      lifeStage,
      lifeStageOther,
      selectedUncertainties,
      customUncertainty,
      personData,
      reflectionText
    );

    const generatedPrompt = generateChatGPTMasterPrompt(
      lifeStage,
      lifeStageOther,
      selectedUncertainties,
      customUncertainty,
      personData,
      reflectionText,
      initialReport
    );

    setAssessment({
      id: assessment?.id || 'draft-assessment',
      user_id: assessment?.user_id,
      session_id: assessment?.session_id,
      current_stage: 4,
      life_stage: lifeStage,
      life_stage_other: lifeStageOther,
      uncertainties: selectedUncertainties,
      custom_uncertainty: customUncertainty,
      reflection_text: reflectionText,
      person_data: personData,
      initial_report: initialReport,
      chatgpt_prompt: generatedPrompt,
      final_report: finalReport,
      raw_handoff_text: rawHandoffText,
      status: 'assessment_generated',
      created_at: assessment?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    setPromptText(generatedPrompt);
    setStage(4);
  };

  const handleStage4ContinueToPrompt = () => {
    setStage(5);
  };

  const handleStage5ProceedToHandoff = () => {
    setStage(6);
  };

  const handleStage6Success = (report: ClarityFinalReport, rawText: string) => {
    setFinalReport(report);
    setRawHandoffText(rawText);
    setStage(7);

    // Save final report to API
    api.finalizeClarityReport({
      final_report: report,
      raw_handoff_text: rawText,
    }).catch(() => {});
  };

  const handleTransferToDashboard = async () => {
    if (!finalReport) return;

    try {
      // 1. Call backend to persist career plan, tasks, milestones
      await api.transferClarityToDashboard(finalReport);
    } catch (e) {
      console.warn('Backend transfer failed or offline, updating frontend state', e);
    }

    // 2. Also pass into CareerContext so client immediately sees new plan
    if (rawHandoffText) {
      applyHandoffText(rawHandoffText);
    } else {
      // Synthesize a JSON block handoff
      applyHandoffText(`\`\`\`json\n${JSON.stringify(finalReport, null, 2)}\n\`\`\``);
    }

    // 3. Navigate to live dashboard
    navigate('/dashboard');
  };

  const handleRestart = () => {
    if (window.confirm('Are you sure you want to start a fresh Clarity Compass assessment? Your current responses will be reset.')) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setStage(1);
      setLifeStage(null);
      setLifeStageOther('');
      setSelectedUncertainties([]);
      setCustomUncertainty('');
      setReflectionText('');
      setPersonData({
        interests: [],
        skillsPossessed: [],
        skillsToDevelop: [],
        visionDriver: '',
        timeAvailable: '5-15 hrs/week',
        budget: 'Free resources only',
        timeline: '3-6 months',
        workStyle: 'Flexible / Open',
        environmentPreference: 'Open to all',
        specificDrillDowns: {},
        personalContext: {},
      });
      setAssessment(null);
      setPromptText('');
      setFinalReport(null);
      setRawHandoffText('');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF5EB] text-[#171717] font-sans flex flex-col">
      <Navbar />

      {/* Top Banner Navigation / Progress */}
      <div className="bg-white border-b-2 border-[#171717]/15 sticky top-0 z-30 shadow-sm">
        <ClarityProgressBar
          currentStep={STAGE_KEYS[stage - 1] || 'situation'}
          onStepChange={(targetStep: ClarityStep) => {
            const idx = STAGE_KEYS.indexOf(targetStep);
            if (idx !== -1 && idx + 1 < stage) {
              setStage(idx + 1);
            }
          }}
          onBack={stage > 1 ? () => setStage(stage - 1) : undefined}
        />
      </div>

      {/* Main Stage Content */}
      <main className="flex-1 pb-16">
        {stage === 1 && (
          <StageSituation
            selectedStage={lifeStage || ''}
            otherText={lifeStageOther}
            onSelectStage={(s: LifeStageKey) => setLifeStage(s)}
            onChangeOtherText={(val: string) => setLifeStageOther(val)}
            onNext={handleStage1Next}
          />
        )}

        {stage === 2 && (
          <StageUncertainty
            selectedUncertainties={selectedUncertainties}
            customUncertainty={customUncertainty}
            reflectionText={reflectionText}
            onChange={(d) => {
              setSelectedUncertainties(d.uncertainties);
              if (d.customUncertainty !== undefined) setCustomUncertainty(d.customUncertainty);
              if (d.reflectionText !== undefined) setReflectionText(d.reflectionText);
            }}
            onNext={handleStage2Next}
            onBack={() => setStage(1)}
          />
        )}

        {stage === 3 && (
          <StageUnderstand
            lifeStage={lifeStage}
            uncertainties={selectedUncertainties}
            data={personData}
            onChange={(updated) => setPersonData({ ...personData, ...updated })}
            onNext={handleStage3Next}
            onBack={() => setStage(2)}
          />
        )}

        {stage === 4 && (
          <StageInitialReport
            assessment={assessment}
            onContinueToPrompt={handleStage4ContinueToPrompt}
            onEditResponses={() => setStage(3)}
          />
        )}

        {stage === 5 && (
          <StagePromptGenerator
            promptText={promptText}
            onProceedToHandoff={handleStage5ProceedToHandoff}
            onBack={() => setStage(4)}
          />
        )}

        {stage === 6 && (
          <StageHandoffSubmit
            initialText={rawHandoffText}
            onSuccess={handleStage6Success}
            onBack={() => setStage(5)}
          />
        )}

        {stage === 7 && finalReport && (
          <StageFinalReport
            report={finalReport}
            onTransferToDashboard={handleTransferToDashboard}
            onRestart={handleRestart}
            onUpdateChecklist={(chk) => {
              setFinalReport({ ...finalReport, living_action_checklist: chk });
            }}
          />
        )}
      </main>

      {/* Subtle Bottom Auto-save indicator */}
      <footer className="py-3 px-4 bg-white/70 border-t border-[#171717]/10 text-center text-[11px] text-[#666]">
        <span>FOYC Clarity Compass • {saveStatus}</span>
      </footer>
    </div>
  );
};
export default ClarityCompassPage;
