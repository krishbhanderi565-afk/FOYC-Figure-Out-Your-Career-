import {
  LifeStageKey,
  LIFE_STAGE_OPTIONS,
  UNCERTAINTY_OPTIONS,
  AdaptiveAnswers,
  InitialClarityAssessment,
  ClarityHandoffSchema,
  ClarityHandoff,
  ClarityInitialReport,
  ClarityPersonData,
} from '../types/clarity';

/**
 * Deterministic Initial Clarity Assessment Generator
 * Uses 100% transparent, user-supplied logic. Zero fabricated AI stats.
 */
export function generateInitialClarityAssessment(
  lifeStage: LifeStageKey | '',
  lifeStageOther: string,
  uncertainties: string[],
  uncertaintyOther: string,
  mindText: string,
  answers: AdaptiveAnswers
): InitialClarityAssessment {
  const stageOption = LIFE_STAGE_OPTIONS.find((s) => s.key === lifeStage);
  const stageName = lifeStage === 'other' && lifeStageOther.trim()
    ? lifeStageOther.trim()
    : stageOption?.label || 'Self-Discovery Explorer';

  // 1. Current Position Summary
  const educationContext = answers.highestEducation || answers.fieldOfStudy
    ? `${answers.highestEducation ? `Degree/Level: ${answers.highestEducation}` : ''}${answers.fieldOfStudy ? ` (${answers.fieldOfStudy})` : ''}`
    : 'Self-directed educational background';

  const roleContext = answers.currentRole || answers.currentIndustry
    ? `Active role/industry: ${answers.currentRole || 'In transition'} ${answers.currentIndustry ? `in ${answers.currentIndustry}` : ''}`
    : 'Exploring entry or pivot points';

  const currentPositionSummary = `Currently positioned as a ${stageName}. ${educationContext}. ${roleContext}. ${
    answers.yearsExperience ? `Brings ${answers.yearsExperience} of prior practical experience.` : ''
  }`;

  // 2. Primary and Secondary Uncertainties
  const matchedUncertainties = uncertainties.map((uKey) => {
    if (uKey === 'other' && uncertaintyOther.trim()) return uncertaintyOther.trim();
    return UNCERTAINTY_OPTIONS.find((uo) => uo.key === uKey)?.label || uKey;
  });

  const primaryUncertainty = matchedUncertainties[0] || 'Clarifying professional direction and next concrete milestones';
  const secondaryUncertainties = matchedUncertainties.slice(1);

  // 3. Known Strengths and Interests
  const knownStrengthsAndInterests: string[] = [];
  if (answers.curiosityTopics?.length) {
    knownStrengthsAndInterests.push(`Core Curiosities: ${answers.curiosityTopics.join(', ')}`);
  }
  if (answers.deepDiveTopics?.trim()) {
    knownStrengthsAndInterests.push(`Deep Dive Focus: "${answers.deepDiveTopics.trim()}"`);
  }
  if (answers.possessedSkills?.length) {
    knownStrengthsAndInterests.push(`Validated Skills: ${answers.possessedSkills.join(', ')}`);
  }
  if (answers.enjoyedProblems?.trim()) {
    knownStrengthsAndInterests.push(`Problem-Solving Affinity: "${answers.enjoyedProblems.trim()}"`);
  }
  if (!knownStrengthsAndInterests.length) {
    knownStrengthsAndInterests.push('Adaptive learning capacity and exploratory curiosity');
  }

  // 4. Personal Priorities
  const personalPriorities: string[] = [];
  if (answers.incomePriority) {
    personalPriorities.push(`Income Strategy: ${answers.incomePriority.replace(/-/g, ' ')}`);
  }
  if (answers.workEnvironment) {
    personalPriorities.push(`Work Environment: ${answers.workEnvironment}`);
  }
  if (answers.employmentType) {
    personalPriorities.push(`Engagement Model: ${answers.employmentType.replace(/-/g, ' ')}`);
  }
  if (answers.workNature) {
    personalPriorities.push(`Work Style: ${answers.workNature}`);
  }
  if (answers.threeToFiveYearVision?.trim()) {
    personalPriorities.push(`3-5 Year Horizon: "${answers.threeToFiveYearVision.trim().slice(0, 140)}..."`);
  }

  // 5. Practical Constraints
  const practicalConstraints: string[] = [];
  if (answers.weeklyLearningHours) {
    practicalConstraints.push(`Available Learning Time: ~${answers.weeklyLearningHours} hours per week`);
  }
  if (answers.learningBudget) {
    practicalConstraints.push(`Budgetary Flexibility: ${answers.learningBudget.replace(/-/g, ' ')}`);
  }
  if (answers.needImmediateIncome) {
    practicalConstraints.push('Requires immediate income generation alongside learning');
  }
  if (answers.geographicOrLanguageConstraints?.trim()) {
    practicalConstraints.push(`Geographic / Language Context: ${answers.geographicOrLanguageConstraints.trim()}`);
  }

  // 6. Unresolved Questions
  const unresolvedQuestions: string[] = [];
  if (uncertainties.includes('ai-anxiety')) {
    unresolvedQuestions.push(
      answers.aiIndustryConcern?.trim()
        ? `How will AI reshape ${answers.aiIndustryConcern.trim()} and where is human judgment irreplaceable?`
        : 'How will AI advancements specifically impact my target sector over the next 3–5 years?'
    );
  }
  if (uncertainties.includes('too-many-options')) {
    unresolvedQuestions.push(
      answers.consideredOptions?.trim()
        ? `Between options [${answers.consideredOptions.trim()}], which best aligns with my constraints and actual energy?`
        : 'Which 2–3 options have the highest market demand and fit my existing strengths?'
    );
  }
  if (uncertainties.includes('no-roadmap')) {
    unresolvedQuestions.push(
      answers.specificGoal?.trim()
        ? `What are the exact weekly milestones to progress toward "${answers.specificGoal.trim()}"?`
        : 'What is the step-by-step 90-day execution roadmap from fundamentals to proof-of-work?'
    );
  }
  if (answers.skillsToDevelop?.length) {
    unresolvedQuestions.push(
      `In what order should I master [${answers.skillsToDevelop.join(', ')}] without burning out?`
    );
  }
  unresolvedQuestions.push('What are the trade-offs, financial realities, and hidden friction points of this choice?');

  // 7. Recommended Next Step
  const recommendedNextStep =
    'Engage with ChatGPT using the tailored FOYC advisory prompt to challenge assumptions, weigh trade-offs, and produce your structured handoff.';

  return {
    currentPositionSummary,
    primaryUncertainty,
    secondaryUncertainties,
    knownStrengthsAndInterests,
    personalPriorities,
    practicalConstraints,
    unresolvedQuestions,
    recommendedNextStep,
  };
}

/**
 * Generate the Personalized ChatGPT Prompt
 */
export function generateClarityChatGptPrompt(
  lifeStage: LifeStageKey | '',
  lifeStageOther: string,
  uncertainties: string[],
  uncertaintyOther: string,
  mindText: string,
  answers: AdaptiveAnswers,
  assessment: InitialClarityAssessment,
  userName: string = 'Explorer'
): string {
  const stageOption = LIFE_STAGE_OPTIONS.find((s) => s.key === lifeStage);
  const stageName = lifeStage === 'other' && lifeStageOther.trim()
    ? lifeStageOther.trim()
    : stageOption?.label || 'Explorer';

  return `You are acting as the Senior Career & Life-Direction Advisor collaborating with ${userName} through FOYC (Figure Out Your Career).

==================================================
1. USER PROFILE & CURRENT CONTEXT
==================================================
- Name: ${userName}
- Current Life/Career Stage: ${stageName}
- Background Summary: ${assessment.currentPositionSummary}
- Primary Uncertainty: ${assessment.primaryUncertainty}
- Secondary Uncertainties:
${assessment.secondaryUncertainties.map((u) => `  * ${u}`).join('\n') || '  * None additional specified'}

${mindText ? `Unfiltered User Thoughts & Reflection:\n"${mindText}"\n` : ''}

==================================================
2. CAPABILITIES, PRIORITIES & CONSTRAINTS
==================================================
- Validated Strengths & Interests:
${assessment.knownStrengthsAndInterests.map((s) => `  * ${s}`).join('\n')}

- Skills Targeted to Develop:
${answers.skillsToDevelop?.map((s) => `  * ${s}`).join('\n') || '  * To be determined in dialogue'}

- Priorities & Work Preferences:
${assessment.personalPriorities.map((p) => `  * ${p}`).join('\n') || '  * Flexible / Open'}

- Practical Constraints:
${assessment.practicalConstraints.map((c) => `  * ${c}`).join('\n') || '  * Standard exploratory schedule'}

- Key Open Questions:
${assessment.unresolvedQuestions.map((q) => `  * ${q}`).join('\n')}

==================================================
3. ADVISORY CONVERSATION MANDATES
==================================================
Please adhere strictly to these principles during our dialogue:
1. Understand my situation deeply before jumping to conclusions or recommending standard formulas.
2. Address the primary uncertainty directly: help untangle the mental knot with objective questions.
3. If important context is missing, ask 1 or 2 targeted clarifying questions.
4. Evaluate realistic directions: contrast 2 or 3 viable career pathways, clearly showing trade-offs, financial realities, and day-to-day requirements.
5. Address AI's impact objectively without hyperbole or fear-mongering: distinguish between tasks AI automates vs. high-leverage human strengths.
6. Respect my available time (${answers.weeklyLearningHours || 15} hrs/wk) and real-life constraints.
7. Avoid generic motivational clichés (e.g. "follow your passion"). Focus on concrete proof-of-work, skill acquisition, and risk mitigation.
8. Guide me until we reach a clear, agreed-upon direction and action plan.

==================================================
4. FINAL HANDOFF REQUIREMENT (CRITICAL)
==================================================
At the conclusion of our discussion (when we have clarified my direction, milestones, and skills), you MUST output a final section titled:

FOYC PERSONAL CLARITY REPORT — STRUCTURED HANDOFF

Followed by a single, valid JSON code block that exactly adheres to the schema below. This JSON will be parsed directly by FOYC to build my personal interactive clarity dashboard and downloadable strategy documents.

\`\`\`json
{
  "report_title": "My Personal Clarity Report",
  "user_name": "${userName}",
  "current_stage": "${stageName}",
  "primary_uncertainty": "${assessment.primaryUncertainty}",
  "executive_summary": {
    "summary": "2-3 concise paragraphs summarizing current position and momentum",
    "primary_uncertainty": "${assessment.primaryUncertainty}",
    "key_insight": "The single most impactful mindset shift or insight uncovered"
  },
  "understanding_you": {
    "education_and_background": "Detailed synthesis of user background and capabilities",
    "interests": ["Array of genuine interests"],
    "strengths_possessed": ["Array of validated strengths"],
    "skills_to_develop": ["Array of skills to learn"],
    "work_preferences": "Work model (remote/hybrid, style, culture)",
    "constraints": ["Array of practical constraints to honor"]
  },
  "uncertainty_map": {
    "primary": "${assessment.primaryUncertainty}",
    "secondary": ["Array of secondary uncertainties"],
    "breakdown": [
      {
        "category": "Direction / Skills / Execution",
        "description": "Concrete explanation of how to untangle this friction"
      }
    ]
  },
  "strengths_and_interests": {
    "core_strengths": ["Key strengths"],
    "deep_curiosities": ["Curiosity topics"],
    "transferable_gems": ["Valuable transferable skills"]
  },
  "explored_directions": [
    {
      "title": "Direction Name (e.g. Full-Stack Applied AI Engineer)",
      "reasoning": "Why this matches the user profile",
      "pros": ["Advantage 1", "Advantage 2"],
      "cons": ["Trade-off / Risk 1", "Risk 2"],
      "open_questions": ["Question to monitor"]
    }
  ],
  "strategic_direction": {
    "selected_direction": "The primary recommended direction or top prioritized path",
    "is_decided": true,
    "rationale": "Clear rationale connecting strengths and market opportunity",
    "next_decisions_to_investigate": ["Next decision checkpoint"]
  },
  "roadmap": [
    {
      "timeframe": "Immediate Next Steps (Weeks 1-2)",
      "title": "Phase Title",
      "description": "Phase objective",
      "milestones": ["Milestone A", "Milestone B"]
    },
    {
      "timeframe": "Short-Term (Month 1-3)",
      "title": "Phase Title",
      "description": "Phase objective",
      "milestones": ["Milestone C", "Milestone D"]
    },
    {
      "timeframe": "Medium-Term (Month 4-6)",
      "title": "Phase Title",
      "description": "Phase objective",
      "milestones": ["Milestone E", "Milestone F"]
    },
    {
      "timeframe": "Long-Term Vision (Year 1+)",
      "title": "Phase Title",
      "description": "Phase objective",
      "milestones": ["Long-term achievement"]
    }
  ],
  "skills_plan": [
    {
      "skill_name": "Name of Skill",
      "importance": "Why it matters for this trajectory",
      "learning_activity": "How to learn it practically",
      "evidence_of_progress": "Proof of work artifact (project/repo/spec)"
    }
  ],
  "risks_and_considerations": {
    "potential_obstacles": ["Obstacle 1", "Obstacle 2"],
    "assumptions_to_validate": ["Assumption 1"],
    "risk_mitigations": ["Actionable mitigation step"]
  },
  "action_checklist": [
    {
      "id": "act-1",
      "timeframe": "Immediate",
      "task": "First high-priority action item",
      "completed": false
    },
    {
      "id": "act-2",
      "timeframe": "This Week",
      "task": "Second action item",
      "completed": false
    },
    {
      "id": "act-3",
      "timeframe": "This Month",
      "task": "Third action item",
      "completed": false
    }
  ],
  "personal_commitment": {
    "first_concrete_step": "Exact first physical action to take within 24 hours",
    "commitment_statement": "A grounding commitment statement written in first person"
  },
  "reassessment": {
    "recommended_date": "YYYY-MM-DD",
    "reflection_prompt": "Specific calibration question to ask at reassessment"
  }
}
\`\`\`

Let's begin. Please introduce yourself briefly, validate that you understand my current situation, and let's explore my primary uncertainty together.`;
}

/**
 * Robust Handoff Parser for Clarity Compass
 * Extracts JSON from markdown fences or bare objects and validates with Zod.
 */
export function parseClarityHandoff(pastedText: string): {
  success: boolean;
  data?: ClarityHandoff;
  errors: string[];
  warnings: string[];
} {
  if (!pastedText || typeof pastedText !== 'string' || pastedText.trim().length < 30) {
    return {
      success: false,
      errors: ['Submission is empty. Please paste your complete FOYC PERSONAL CLARITY REPORT block from ChatGPT.'],
      warnings: [],
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Try extracting JSON from markdown code fence ```json ... ``` or ``` ... ```
  let rawJsonStr = '';
  const jsonFenceMatch = pastedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (jsonFenceMatch && jsonFenceMatch[1]) {
    rawJsonStr = jsonFenceMatch[1].trim();
  } else {
    // Look for outermost { ... }
    const firstBrace = pastedText.indexOf('{');
    const lastBrace = pastedText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      rawJsonStr = pastedText.slice(firstBrace, lastBrace + 1).trim();
    }
  }

  if (!rawJsonStr) {
    return {
      success: false,
      errors: [
        'Could not find a valid JSON object in the submitted text. Make sure you copied the final "FOYC PERSONAL CLARITY REPORT — STRUCTURED HANDOFF" section including the code block.',
      ],
      warnings: [],
    };
  }

  // 2. Parse JSON
  let parsedObj: any = null;
  try {
    parsedObj = JSON.parse(rawJsonStr);
  } catch (err: any) {
    // Attempt minor repair for trailing commas or extra quotes
    try {
      const sanitized = rawJsonStr
        .replace(/,\s*([\]}])/g, '$1') // remove trailing commas
        .replace(/[\u201C\u201D]/g, '"'); // replace curly quotes
      parsedObj = JSON.parse(sanitized);
      warnings.push('Minor syntax normalization was applied to your JSON.');
    } catch {
      return {
        success: false,
        errors: [`JSON syntax error: ${err?.message || 'Invalid JSON syntax'}. Please ensure the code block was copied completely.`],
        warnings: [],
      };
    }
  }

  // 3. Validate with Zod
  const validationResult = ClarityHandoffSchema.safeParse(parsedObj);
  if (!validationResult.success) {
    const fieldErrors = validationResult.error.issues.map(
      (iss) => `${iss.path.join('.') || 'Root'}: ${iss.message}`
    );
    return {
      success: false,
      errors: ['The submitted data does not completely match the expected FOYC Clarity Schema.', ...fieldErrors.slice(0, 5)],
      warnings,
    };
  }

  return {
    success: true,
    data: validationResult.data,
    errors: [],
    warnings,
  };
}

export function generateDeterministicInitialReport(
  lifeStage: LifeStageKey | null,
  lifeStageOther: string,
  uncertainties: string[],
  customUncertainty: string,
  personData: ClarityPersonData,
  reflectionText: string
): ClarityInitialReport {
  const stageOption = LIFE_STAGE_OPTIONS.find((s) => s.key === lifeStage);
  const stageName = lifeStage === 'other' && lifeStageOther.trim()
    ? lifeStageOther.trim()
    : stageOption?.label || 'Career Explorer';

  const educationContext = personData.education ? `Educational background in ${personData.education}` : 'Self-directed learning path';
  const roleContext = personData.currentRole ? `Currently working or studying as ${personData.currentRole}` : 'Currently seeking clarity';

  const currentPosition = `Positioned as a ${stageName}. ${educationContext}. ${roleContext}. Time commitment: ${personData.timeAvailable || '5-15 hrs/wk'}. Upskilling budget: ${personData.budget || 'Free resources only'}.`;

  const matchedUncertainties = uncertainties.map((uKey) => {
    if (uKey === 'other' && customUncertainty.trim()) return customUncertainty.trim();
    return UNCERTAINTY_OPTIONS.find((uo) => uo.id === uKey || uo.key === uKey)?.label || uKey;
  });

  const uncertaintyBreakdown = matchedUncertainties.length > 0
    ? `Identified primary tensions: ${matchedUncertainties.join('; ')}.`
    : 'Clarifying professional direction and long-term momentum.';

  const strengthsSynthesis = `Selected interests: ${(personData.interests || []).join(', ') || 'Exploratory'}. Possessed capabilities: ${(personData.skillsPossessed || []).join(', ') || 'Foundational problem solving'}. Eager to develop: ${(personData.skillsToDevelop || []).join(', ') || 'High-demand industry skills'}. Preferred environment: ${personData.environmentPreference || 'Open'} (${personData.workStyle || 'Flexible'}).`;

  const areasNeedingExploration = `Requires evaluating viability of directions that connect your curiosity with realistic hiring demand within a ${personData.timeline || '3-6 month'} horizon without excessive financial friction.`;

  const questions: string[] = [];
  if (uncertainties.includes('ai_anxiety') || uncertainties.includes('ai-anxiety')) {
    questions.push('How can I position myself alongside AI leverage rather than being displaced by automated workflows?');
  }
  if (uncertainties.includes('too_many_options') || uncertainties.includes('too-many-options')) {
    questions.push('Between my top competing interests, which pathway has the lowest barrier to first proof-of-work?');
  }
  if (uncertainties.includes('fear_of_choosing_wrong')) {
    questions.push('What low-risk micro-experiments can I run in the next 14 days to validate this direction without risking current income?');
  }
  questions.push(`Which specific portfolio projects will effectively prove mastery to hiring teams in ${personData.timeline || '6 months'}?`);
  questions.push('What are the specific weekly milestones I need to commit to starting this week?');

  return {
    currentPosition,
    uncertaintyBreakdown,
    strengthsSynthesis,
    areasNeedingExploration,
    worthExploringQuestions: questions.slice(0, 5),
    recommendedNextStep: 'Proceed to ChatGPT with your synthesized FOYC Master Advisory Prompt to conduct a structured 1-on-1 career exploration session.',
  };
}

export function generateChatGPTMasterPrompt(
  lifeStage: LifeStageKey | null,
  lifeStageOther: string,
  uncertainties: string[],
  customUncertainty: string,
  personData: ClarityPersonData,
  reflectionText: string,
  initialReport: ClarityInitialReport
): string {
  const stageOption = LIFE_STAGE_OPTIONS.find((s) => s.key === lifeStage);
  const stageName = lifeStage === 'other' && lifeStageOther.trim()
    ? lifeStageOther.trim()
    : stageOption?.label || 'Career Explorer';

  const answers: AdaptiveAnswers = {
    highestEducation: personData.education,
    currentRole: personData.currentRole,
    curiosityTopics: personData.interests,
    deepDiveTopics: personData.interestsDeepDive,
    possessedSkills: personData.skillsPossessed,
    skillsToDevelop: personData.skillsToDevelop,
    threeToFiveYearVision: personData.visionDriver,
    workEnvironment: personData.workStyle,
    workNature: personData.environmentPreference,
    weeklyLearningHours: personData.timeAvailable?.includes('40+') ? 40 : personData.timeAvailable?.includes('15-30') ? 20 : 10,
    learningBudget: personData.budget,
    additionalContext: reflectionText,
    aiIndustryConcern: personData.specificDrillDowns?.aiConcern,
    consideredOptions: personData.specificDrillDowns?.competingOptions,
    specificGoal: personData.specificDrillDowns?.targetGoal,
  };

  const assessmentAdapter: InitialClarityAssessment = {
    currentPositionSummary: initialReport.currentPosition,
    primaryUncertainty: initialReport.uncertaintyBreakdown,
    secondaryUncertainties: uncertainties.map(u => UNCERTAINTY_OPTIONS.find(o => o.id === u || o.key === u)?.label || u),
    knownStrengthsAndInterests: [initialReport.strengthsSynthesis],
    personalPriorities: [personData.visionDriver || 'Long-term sustainability'],
    practicalConstraints: [
      `Time: ${personData.timeAvailable || '5-15 hrs/wk'}`,
      `Budget: ${personData.budget || 'Free resources'}`,
      `Timeline: ${personData.timeline || '3-6 months'}`,
    ],
    unresolvedQuestions: initialReport.worthExploringQuestions,
    recommendedNextStep: initialReport.recommendedNextStep,
  };

  return generateClarityChatGptPrompt(
    (lifeStage as LifeStageKey) || '',
    lifeStageOther,
    uncertainties,
    customUncertainty,
    reflectionText,
    answers,
    assessmentAdapter,
    'Career Explorer'
  );
}
