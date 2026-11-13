import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PossibilityStep,
  PossibilityProgressBar,
} from '../components/possibility/PossibilityProgressBar';
import { StageIntro } from '../components/possibility/StageIntro';
import { StageQuestionnaire } from '../components/possibility/StageQuestionnaire';
import { StagePrompt } from '../components/possibility/StagePrompt';
import { StageHandoff } from '../components/possibility/StageHandoff';
import { StageReport } from '../components/possibility/StageReport';
import {
  PossibilityQuestionnaireData,
  PossibilityHandoff,
  PossibilityItem,
} from '../types/possibility';
import {
  generatePossibilityPrompt,
  getSamplePossibilityHandoff,
} from '../utils/possibilityEngine';
import { api } from '../services/api';
import { useCareer } from '../context/CareerContext';
import { Navbar } from '../components/common/Navbar';

const DRAFT_STORAGE_KEY = 'foyc_possibility_draft';

const DEFAULT_QUESTIONNAIRE: PossibilityQuestionnaireData = {
  lifeStage: 'career-switcher',
  lifeStageOther: '',
  educationLevel: "Bachelor's Degree",
  degreeOrCourse: 'Computer Science & Communications',
  fieldOfStudy: 'Digital Media & Software',
  currentRole: 'Marketing Coordinator',
  industry: 'Technology / Digital Services',
  yearsExperience: '1–3 years',
  certificationsOrAchievements: '',
  interests: ['Technology & AI Systems', 'Design, UX & Visual Creativity', 'Business & Entrepreneurship'],
  interestsOther: '',
  curiosityFreeText: '',
  skillsPossessed: ['Written Communication & Storytelling', 'Data Analysis & Quantitative Reasoning', 'Customer Research & User Empathy'],
  skillsToDevelop: ['Visual Design & Prototyping', 'Prompt Engineering & Applied AI Tools', 'Software Development & Coding'],
  customSkillsPossessed: '',
  customSkillsToDevelop: '',
  ambitions: ['Work 100% remotely with location autonomy', 'Start and run my own business or venture', 'Become financially independent with high earning velocity'],
  visionThreeToFiveYears: '',
  timeAvailableWeekly: '5–15 hrs/week',
  budgetPreference: 'Free to low-cost ($0–$100)',
  needImmediateIncome: false,
  workEnvironment: '100% Remote',
  willingnessToRelocate: 'Flexible / Open',
  riskTolerance: 'Moderate',
  familyResponsibilities: 'Standard responsibilities',
  additionalNotes: '',
};

export const PossibilityExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const { applyHandoffText, userName } = useCareer();

  const [currentStep, setCurrentStep] = useState<PossibilityStep>('intro');
  const [questionnaireData, setQuestionnaireData] = useState<PossibilityQuestionnaireData>(DEFAULT_QUESTIONNAIRE);
  const [promptText, setPromptText] = useState<string>('');
  const [finalReport, setFinalReport] = useState<PossibilityHandoff | null>(null);
  const [rawHandoffText, setRawHandoffText] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<string>('All progress saved');

  // Load draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        if (parsed.questionnaireData) setQuestionnaireData(parsed.questionnaireData);
        if (parsed.promptText) setPromptText(parsed.promptText);
        if (parsed.finalReport) setFinalReport(parsed.finalReport);
        if (parsed.rawHandoffText) setRawHandoffText(parsed.rawHandoffText);
      }
    } catch (e) {
      console.warn('Failed to parse possibility draft from localStorage', e);
    }

    // Try cloud draft if available
    api.getPossibilityExploration().then((res) => {
      if (res && res.exploration) {
        const cloudData = res.exploration;
        if (cloudData.final_report) {
          setFinalReport(cloudData.final_report);
          setCurrentStep('report');
        }
      }
    }).catch(() => {});
  }, []);

  // Save draft on every change
  useEffect(() => {
    const draft = {
      currentStep,
      questionnaireData,
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
      api.savePossibilityExploration({
        stage: currentStep === 'intro' ? 1 : currentStep === 'questionnaire' ? 2 : currentStep === 'prompt' ? 3 : currentStep === 'handoff' ? 4 : 5,
        life_stage: questionnaireData.lifeStage,
        life_stage_other: questionnaireData.lifeStageOther,
        background_data: {
          educationLevel: questionnaireData.educationLevel,
          degreeOrCourse: questionnaireData.degreeOrCourse,
          fieldOfStudy: questionnaireData.fieldOfStudy,
          currentRole: questionnaireData.currentRole,
          industry: questionnaireData.industry,
          yearsExperience: questionnaireData.yearsExperience,
          certificationsOrAchievements: questionnaireData.certificationsOrAchievements,
        },
        interests: questionnaireData.interests,
        interests_other: questionnaireData.interestsOther,
        skills_possessed: questionnaireData.skillsPossessed,
        skills_to_develop: questionnaireData.skillsToDevelop,
        ambitions: questionnaireData.ambitions,
        ambition_vision: questionnaireData.visionThreeToFiveYears,
        practical_boundaries: {
          timeAvailableWeekly: questionnaireData.timeAvailableWeekly,
          budgetPreference: questionnaireData.budgetPreference,
          needImmediateIncome: questionnaireData.needImmediateIncome,
          workEnvironment: questionnaireData.workEnvironment,
          willingnessToRelocate: questionnaireData.willingnessToRelocate,
          riskTolerance: questionnaireData.riskTolerance,
        },
        additional_context: questionnaireData.additionalNotes,
        generated_prompt: promptText,
      }).then(() => {
        setSaveStatus('Synced with cloud');
      }).catch(() => {
        setSaveStatus('Saved locally');
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [currentStep, questionnaireData, promptText, finalReport, rawHandoffText]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Transitions
  const handleStartQuestionnaire = () => {
    setCurrentStep('questionnaire');
  };

  const handleGeneratePrompt = () => {
    const generated = generatePossibilityPrompt(questionnaireData, userName || 'Explorer');
    setPromptText(generated);
    setCurrentStep('prompt');
  };

  const handleProceedToHandoff = () => {
    setCurrentStep('handoff');
  };

  const handleHandoffSuccess = (report: PossibilityHandoff, rawText: string) => {
    setFinalReport(report);
    setRawHandoffText(rawText);
    setCurrentStep('report');

    api.finalizePossibilityReport({
      final_report: report,
      raw_handoff_text: rawText,
      shortlist: report.shortlisted_options,
      experiments_state: report.recommended_experiments,
      checklist_state: report.next_steps,
    }).catch(() => {});
  };

  const handleTransferToDashboard = async (selected: {
    selected_possibility: PossibilityItem;
    secondary_possibility?: PossibilityItem;
    target_timeline_months: number;
    user_notes?: string;
  }) => {
    try {
      await api.transferPossibilityToDashboard(selected);
    } catch (e) {
      console.warn('Backend transfer failed, persisting locally', e);
    }

    // Synthesize handoff text for CareerContext
    const primary = selected.selected_possibility;
    const synthesizedHandoff = `\`\`\`json
{
  "report_title": "My Career Plan: ${primary.name}",
  "user_name": "${userName || 'Explorer'}",
  "current_stage": "${questionnaireData.lifeStage || 'Career Exploration'}",
  "primary_uncertainty": "Execution & Milestones for ${primary.name}",
  "executive_summary": {
    "summary": "${primary.description}\\n\\nStrategic Direction: ${primary.why_it_matches}",
    "primary_uncertainty": "Trajectory Execution",
    "key_insight": "Focus on high-yield portfolio proof-of-work in ${primary.name}."
  },
  "understanding_you": {
    "education_and_background": "${questionnaireData.degreeOrCourse || questionnaireData.educationLevel}",
    "interests": ${JSON.stringify(questionnaireData.interests)},
    "strengths_possessed": ${JSON.stringify(questionnaireData.skillsPossessed)},
    "skills_to_develop": ${JSON.stringify(primary.required_skills || [])},
    "work_preferences": "${questionnaireData.workEnvironment}",
    "constraints": ["${questionnaireData.timeAvailableWeekly}"]
  },
  "uncertainty_map": {
    "primary": "Strategic Execution",
    "secondary": [],
    "breakdown": []
  },
  "strengths_and_interests": {
    "core_strengths": ${JSON.stringify(questionnaireData.skillsPossessed)},
    "deep_curiosities": ${JSON.stringify(questionnaireData.interests)},
    "transferable_gems": []
  },
  "explored_directions": [
    {
      "title": "${primary.name}",
      "fit_score": 92,
      "reasoning": "${primary.why_it_matches}",
      "pros": ${JSON.stringify(primary.opportunities || [])},
      "cons": ${JSON.stringify(primary.challenges || [])},
      "open_questions": []
    }
  ],
  "strategic_direction": {
    "selected_direction": "${primary.name}",
    "primary_title": "${primary.name}",
    "is_decided": true,
    "rationale": "${primary.why_it_matches}",
    "target_timeline_months": ${selected.target_timeline_months},
    "target_role_types": ["${primary.name}"],
    "next_decisions_to_investigate": []
  },
  "roadmap": [
    {
      "timeframe": "Month 1–2",
      "title": "Phase 1: Foundations & Exploratory Prototyping",
      "description": "Establish core tooling and build initial small project.",
      "milestones": ["Set up practice workspace", "Build 1st proof-of-work prototype"]
    },
    {
      "timeframe": "Month 3–4",
      "title": "Phase 2: Portfolio & Deep Skills Building",
      "description": "Master high-demand skills: ${(primary.required_skills || []).slice(0, 3).join(', ')}.",
      "milestones": ["Publish comprehensive case study", "Conduct 3 feedback sessions with practitioners"]
    },
    {
      "timeframe": "Month 5–6",
      "title": "Phase 3: Active Transition & Outreach",
      "description": "Engage clients or apply for target roles in ${primary.name}.",
      "milestones": ["Launch public portfolio", "Initiate outreach to 20 target companies / clients"]
    }
  ],
  "skills_plan": [
    ${(primary.required_skills || []).map((sk: string) => `
    {
      "skill_name": "${sk}",
      "importance": "High priority for ${primary.name}",
      "learning_activity": "Hands-on projects and tutorials",
      "evidence_of_progress": "Code/Design repository"
    }`).join(',')}
  ],
  "risks_and_considerations": {
    "potential_obstacles": ${JSON.stringify(primary.challenges || [])},
    "assumptions_to_validate": [],
    "risk_mitigations": ["Build in public with weekly proof-of-work logs"]
  },
  "action_checklist": [
    {
      "id": "act-1",
      "timeframe": "Immediate",
      "task": "Review day-to-day requirements and 3 job openings for ${primary.name}",
      "completed": false
    },
    {
      "id": "act-2",
      "timeframe": "This Week",
      "task": "Set up learning environment and schedule 10 hours of focused block time",
      "completed": false
    }
  ],
  "personal_commitment": {
    "first_concrete_step": "Dedicate first 3 hours to hands-on exploration this weekend.",
    "commitment_statement": "I commit to steady execution and building real proof of work."
  },
  "reassessment": {
    "recommended_date": "${new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]}",
    "reflection_prompt": "Evaluate proof-of-work traction and adjust pace."
  }
}
\`\`\``;

    applyHandoffText(synthesizedHandoff);
    navigate('/dashboard');
  };

  const handleRestart = () => {
    if (window.confirm('Are you sure you want to start a fresh exploration? Your current unsaved changes will be reset.')) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setCurrentStep('intro');
      setQuestionnaireData(DEFAULT_QUESTIONNAIRE);
      setPromptText('');
      setFinalReport(null);
      setRawHandoffText('');
    }
  };

  const handlePreviewSample = () => {
    const sample = getSamplePossibilityHandoff(userName || 'Alex');
    setFinalReport(sample);
    setCurrentStep('report');
  };

  return (
    <div className="min-h-screen bg-[#FDF5EB] text-[#171717] font-sans flex flex-col">
      <Navbar />

      {/* Top Banner Navigation */}
      <div className="bg-white border-b-2 border-[#171717]/15 sticky top-0 z-30 shadow-xs">
        <PossibilityProgressBar
          currentStep={currentStep}
          onStepChange={(targetStep) => {
            const stepsOrder: PossibilityStep[] = ['intro', 'questionnaire', 'prompt', 'handoff', 'report'];
            const targetIdx = stepsOrder.indexOf(targetStep);
            const currentIdx = stepsOrder.indexOf(currentStep);
            if (targetIdx < currentIdx) {
              setCurrentStep(targetStep);
            }
          }}
          onBack={
            currentStep === 'questionnaire'
              ? () => setCurrentStep('intro')
              : currentStep === 'prompt'
              ? () => setCurrentStep('questionnaire')
              : currentStep === 'handoff'
              ? () => setCurrentStep('prompt')
              : undefined
          }
        />
      </div>

      {/* Main Step Screen */}
      <main className="flex-1 pb-16">
        {currentStep === 'intro' && (
          <StageIntro
            onStart={handleStartQuestionnaire}
            onPreviewSample={handlePreviewSample}
          />
        )}

        {currentStep === 'questionnaire' && (
          <StageQuestionnaire
            data={questionnaireData}
            onChange={(updated) => setQuestionnaireData({ ...questionnaireData, ...updated })}
            onNext={handleGeneratePrompt}
            onBack={() => setCurrentStep('intro')}
          />
        )}

        {currentStep === 'prompt' && (
          <StagePrompt
            promptText={promptText}
            onProceedToHandoff={handleProceedToHandoff}
            onBack={() => setCurrentStep('questionnaire')}
          />
        )}

        {currentStep === 'handoff' && (
          <StageHandoff
            initialText={rawHandoffText}
            onSuccess={handleHandoffSuccess}
            onBack={() => setCurrentStep('prompt')}
          />
        )}

        {currentStep === 'report' && finalReport && (
          <StageReport
            report={finalReport}
            onTransferToDashboard={handleTransferToDashboard}
            onRestart={handleRestart}
            onUpdateReport={(updated) => setFinalReport(updated)}
          />
        )}
      </main>

      {/* Auto-save footer note */}
      <footer className="py-3 px-4 bg-white/70 border-t border-[#171717]/10 text-center text-[11px] text-[#666]">
        <span>FOYC Possibility Explorer • {saveStatus}</span>
      </footer>
    </div>
  );
};
export default PossibilityExplorerPage;
