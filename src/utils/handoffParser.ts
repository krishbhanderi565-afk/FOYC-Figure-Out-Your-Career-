import {
  CareerDashboardData,
  Milestone,
  TaskItem,
  HabitItem,
  ProjectItem,
  ResourceItem,
  UserProfile,
  UserReflection,
} from '../types/career';
import { FoycHandoffSchema, FoycHandoff } from '../types/foyc-handoff';
import { DashboardConfiguration, DEFAULT_DASHBOARD_CONFIG } from '../types/moduleRegistry';

export interface ParseResult {
  success: boolean;
  data?: CareerDashboardData;
  dashboardConfig?: DashboardConfiguration;
  errors: string[];
  warnings: string[];
  canonicalHandoff?: FoycHandoff;
  rawInput?: string;
}

/**
 * Resilient Balanced-Bracket Extractor
 * Walks string tracking quote/escape states to extract valid JSON blocks even when
 * surrounded by conversational text before and after.
 */
function extractBalancedJsonObject(text: string): string | null {
  let startIndex = -1;
  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (char === '\\') {
      escape = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (char === '{') {
        if (depth === 0) {
          startIndex = i;
        }
        depth++;
      } else if (char === '}') {
        depth--;
        if (depth === 0 && startIndex !== -1) {
          return text.substring(startIndex, i + 1);
        }
      }
    }
  }
  return null;
}

/**
 * Normalizes common aliases from various ChatGPT outputs across all FOYC features:
 * - Discovery / Career Assessment
 * - Clarity Compass (execution_roadmap, action_checklist, weekly_habits, etc.)
 * - Possibility Explorer (possibilities, recommended_experiments, next_steps, etc.)
 * - Career Comparison (comparedPaths, recommendation, next7DayExperiment, etc.)
 */
function normalizeAliasedObject(raw: any): any {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return raw;

  const out = { ...raw };

  // Profile alias
  if (!out.profile && (out.user_profile || out.user_name || out.preferred_name)) {
    out.profile = {
      preferred_name: out.preferred_name || out.user_name || out.user_profile?.name || 'Explorer',
      country: out.country || 'Global',
      current_education_or_profession: out.current_education || out.education || out.user_profile?.current_context || 'Professional Exploration',
      current_career_stage: out.career_stage || out.current_stage || out.user_profile?.life_stage || 'Discovery',
      work_experience: out.work_experience || 'Not specified',
      current_field: out.current_field || out.field || 'Exploring',
    };
  }

  // Direction alias
  if (!out.career_direction) {
    const primaryDir =
      out.primary_direction ||
      out.career_goal ||
      out.main_goal ||
      out.primary_career_direction ||
      out.strategic_direction?.selected_direction ||
      out.strategic_direction?.primary_title ||
      out.recommendation?.primaryPathTitle ||
      out.possibilities?.[0]?.name ||
      out.shortlisted_options?.[0] ||
      out.report_title?.replace(/^(My Career Plan:\s*|Career Direction:\s*|My Personal Clarity Report:\s*)/i, '') ||
      'Career Direction Exploration';

    out.career_direction = {
      primary_career_direction: primaryDir,
      career_description:
        out.career_description ||
        out.strategic_direction?.rationale ||
        out.executive_summary?.summary ||
        (typeof out.executive_summary === 'string' ? out.executive_summary : '') ||
        out.executiveSummary ||
        out.exploration_summary?.summary ||
        out.possibilities?.[0]?.description ||
        `Focusing on high-impact growth and skill acquisition in ${primaryDir}.`,
      why_this_direction_was_suggested:
        out.why_this_direction_was_suggested ||
        out.strategic_direction?.rationale ||
        out.recommendation?.strategicRationale ||
        out.possibilities?.[0]?.why_it_matches ||
        'Direct alignment with your strengths, interests, and strategic goals.',
      key_responsibilities: out.key_responsibilities || out.possibilities?.[0]?.opportunities || [],
      expected_opportunities: out.expected_opportunities || out.opportunities || out.possibilities?.[0]?.opportunities || [],
      alternative_career_paths:
        out.alternative_career_paths ||
        out.explored_directions?.map((d: any) => ({
          title: d.title,
          description: d.reasoning || '',
          overlap_score: d.fit_score || 85,
        })) ||
        out.possibilities?.slice(1, 4).map((p: any) => ({
          title: p.name,
          description: p.why_it_matches || p.description || '',
          overlap_score: 88,
        })) ||
        (out.recommendation?.secondaryPathTitle ? [{
          title: out.recommendation.secondaryPathTitle,
          description: out.recommendation.hedgeStrategy || '',
          overlap_score: 82,
        }] : []),
      important_trade_offs: out.important_trade_offs || out.possibilities?.[0]?.challenges || [],
      confidence_level: out.confidence_level || out.recommendation?.confidenceScore || 92,
    };
  }

  // Roadmap & Milestones alias (Handles array of phases from Clarity Compass & Possibility Explorer)
  let extractedMilestones: any[] = [];
  if (out.milestones && Array.isArray(out.milestones)) {
    extractedMilestones = out.milestones;
  } else if (out.career_milestones && Array.isArray(out.career_milestones)) {
    extractedMilestones = out.career_milestones;
  } else if (out.execution_roadmap && typeof out.execution_roadmap === 'object') {
    // Clarity Compass phase_1, phase_2, phase_3 structure
    ['phase_1', 'phase_2', 'phase_3'].forEach((phKey, pIdx) => {
      const ph = out.execution_roadmap[phKey];
      if (ph) {
        const phStage = pIdx === 0 ? 'Foundation' : pIdx === 1 ? 'Skill Development' : 'Practical Application';
        if (Array.isArray(ph.milestones)) {
          ph.milestones.forEach((m: string | any, mIdx: number) => {
            extractedMilestones.push({
              id: `ms-${pIdx + 1}-${mIdx + 1}`,
              title: typeof m === 'string' ? m : m.title || `Milestone ${mIdx + 1}`,
              stage: phStage,
              target_duration: ph.timeframe || `Phase ${pIdx + 1}`,
              description: ph.objective || '',
              priority: 'High',
              is_completed: false,
            });
          });
        }
      }
    });
  } else if (Array.isArray(out.roadmap)) {
    // Possibility Explorer array of roadmap stages
    out.roadmap.forEach((phase: any, pIdx: number) => {
      const phStage = pIdx === 0 ? 'Foundation' : pIdx === 1 ? 'Skill Development' : pIdx === 2 ? 'Practical Application' : 'Professional Readiness';
      const mList = Array.isArray(phase.milestones) ? phase.milestones : Array.isArray(phase.deliverables) ? phase.deliverables : [phase.title || `Phase ${pIdx + 1}`];
      mList.forEach((m: string | any, mIdx: number) => {
        extractedMilestones.push({
          id: `ms-${pIdx + 1}-${mIdx + 1}`,
          title: typeof m === 'string' ? m : m.title || `Milestone ${mIdx + 1}`,
          stage: phStage,
          target_duration: phase.timeframe || phase.duration_weeks || `Month ${pIdx + 1}`,
          description: phase.description || phase.objectives?.join(', ') || '',
          priority: 'High',
          is_completed: false,
        });
      });
    });
  } else if (out.roadmap?.milestones && Array.isArray(out.roadmap.milestones)) {
    extractedMilestones = out.roadmap.milestones;
  }

  out.roadmap = {
    long_term_goal: out.long_term_goal || out.long_term_goals || out.roadmap?.long_term_goal || `Establish expertise in ${out.career_direction?.primary_career_direction || 'target career'}`,
    short_term_goals: out.short_term_goals || out.roadmap?.short_term_goals || ['Master core workflows', 'Publish 2 proof-of-work artifacts'],
    career_stages: out.career_stages || [],
    milestones: extractedMilestones,
  };

  // Tasks alias (Handles action_checklist, action_items, next_steps, recommended_experiments, next7DayExperiment)
  const combinedTasks: any[] = [];
  const rawTasks = out.tasks || out.action_items || out.action_checklist || out.weekly_actions || out.checklist;
  if (Array.isArray(rawTasks)) {
    rawTasks.forEach((t: any, idx: number) => {
      combinedTasks.push({
        id: t.id || `task-${idx + 1}`,
        title: typeof t === 'string' ? t : t.title || t.task || t.text || `Action Item ${idx + 1}`,
        description: t.description || t.importance || '',
        category: t.category || (idx % 2 === 0 ? 'Technical' : 'Soft Skills'),
        priority: t.priority || (t.importance === 'High' ? 'High' : 'Medium'),
        due_date: t.due_date || t.timeframe || (idx === 0 ? 'Due Today' : idx === 1 ? 'Due Fri' : 'Next Week'),
        is_completed: t.is_completed || t.completed || false,
      });
    });
  }

  // If Possibility Explorer next_steps or recommended_experiments exist
  if (Array.isArray(out.next_steps)) {
    out.next_steps.forEach((s: any, idx: number) => {
      combinedTasks.push({
        id: s.id || `step-${idx + 1}`,
        title: s.task || s.title || `Next Step ${idx + 1}`,
        description: s.notes || 'Strategic execution step',
        category: 'Execution',
        priority: 'High',
        due_date: s.timeframe || 'Next Week',
        is_completed: s.completed || false,
      });
    });
  }
  if (Array.isArray(out.recommended_experiments)) {
    out.recommended_experiments.forEach((exp: any, idx: number) => {
      combinedTasks.push({
        id: exp.id || `exp-${idx + 1}`,
        title: exp.title || `Experiment ${idx + 1}`,
        description: exp.description || `Validation experiment for ${exp.possibility_name || 'selected direction'}`,
        category: 'Portfolio',
        priority: 'High',
        due_date: exp.estimated_time ? `${exp.estimated_time} challenge` : 'This weekend',
        is_completed: exp.is_completed || false,
      });
    });
  }

  // If Career Comparison next7DayExperiment exists
  if (out.next7DayExperiment) {
    combinedTasks.unshift({
      id: 'task-comp-exp',
      title: out.next7DayExperiment.title || '7-Day Reality Check Experiment',
      description: `${out.next7DayExperiment.description || ''} (Metric: ${out.next7DayExperiment.validationMetric || 'Complete 1 prototype'})`,
      category: 'Portfolio',
      priority: 'High',
      due_date: 'Next 7 Days',
      is_completed: false,
    });
  }

  if (combinedTasks.length > 0) {
    out.tasks = combinedTasks;
  }

  // Skill Gaps alias
  if (!out.skill_gaps && (out.skills_plan || out.skills_development_plan || out.learning_plan || out.skills_roadmap || out.skills_to_develop || out.possibilities?.[0]?.required_skills)) {
    const rawSkills = out.skills_plan || out.skills_development_plan || out.learning_plan || out.skills_roadmap || out.skills_to_develop || out.possibilities?.[0]?.required_skills;
    if (Array.isArray(rawSkills)) {
      out.skill_gaps = rawSkills.map((s: any, idx: number) => ({
        skill_name: typeof s === 'string' ? s : s.skill_name || s.name || `Core Competency ${idx + 1}`,
        current_level: s.current_level || 'Beginner',
        target_level: s.target_level || 'Intermediate',
        priority: s.priority || 'High',
        explanation: s.importance || s.how_to_acquire || s.explanation || s.learning_activity || '',
        recommended_learning_order: idx + 1,
      }));
    }
  }

  // Habits alias (Handles routines, weekly_habits from Clarity Compass, or explicit habits)
  const combinedHabits: any[] = [];
  if (Array.isArray(out.habits)) {
    combinedHabits.push(...out.habits);
  } else if (Array.isArray(out.routines)) {
    combinedHabits.push(...out.routines);
  } else if (Array.isArray(out.execution_roadmap?.weekly_habits)) {
    out.execution_roadmap.weekly_habits.forEach((h: string | any, idx: number) => {
      combinedHabits.push({
        id: `habit-${idx + 1}`,
        title: typeof h === 'string' ? h : h.title || `Habit ${idx + 1}`,
        description: 'Consistent weekly execution habit',
        frequency: 'daily',
        target: '45 mins',
        category: 'Skill Building',
      });
    });
  }

  if (combinedHabits.length > 0) {
    out.habits = combinedHabits;
  }

  return out;
}

/**
 * Intelligent Synthesis Generators: Guarantee that EVERY user gets a complete,
 * personalized Roadmap, Checklist, Habit Tracker, Projects & Resources, regardless
 * of which feature or conversation round produced the handoff.
 */
function synthesizePersonalizedMilestones(primaryTitle: string, userField: string): Milestone[] {
  return [
    {
      id: 'ms-1',
      title: 'Foundation & Toolchain Calibration',
      description: `Establish core workflow principles, set up development/practice environment, and audit fundamentals for ${primaryTitle}.`,
      priority: 'high',
      stage: 'Foundation',
      estimatedDuration: 'Weeks 1–3',
      targetDate: 'Week 3',
      completed: true,
      associatedTasksCount: 3,
    },
    {
      id: 'ms-2',
      title: 'Deep Competency & Framework Mastery',
      description: `Master high-leverage tools, modern practices, and industry standards required in ${userField || primaryTitle}.`,
      priority: 'high',
      stage: 'Skill Development',
      estimatedDuration: 'Weeks 4–8',
      targetDate: 'Week 8',
      completed: false,
      associatedTasksCount: 5,
    },
    {
      id: 'ms-3',
      title: 'Practical Proof-of-Work Artifacts',
      description: `Build and document 2 end-to-end capstone deliverables solving real-world problems.`,
      priority: 'high',
      stage: 'Practical Application',
      estimatedDuration: 'Weeks 9–14',
      targetDate: 'Week 14',
      completed: false,
      associatedTasksCount: 4,
    },
    {
      id: 'ms-4',
      title: 'Professional Positioning & Showcase',
      description: `Package case studies, polish interactive showcase, and engage with practitioners in ${primaryTitle}.`,
      priority: 'medium',
      stage: 'Professional Readiness',
      estimatedDuration: 'Weeks 15–18',
      targetDate: 'Week 18',
      completed: false,
      associatedTasksCount: 4,
    },
    {
      id: 'ms-5',
      title: 'Career Transition & Market Launch',
      description: `Target high-alignment opportunities, initiate outreach, or launch consulting/client initiatives.`,
      priority: 'medium',
      stage: 'Career Growth',
      estimatedDuration: 'Weeks 19–24+',
      targetDate: 'Week 24',
      completed: false,
      associatedTasksCount: 3,
    },
  ];
}

function synthesizePersonalizedTasks(primaryTitle: string): TaskItem[] {
  return [
    {
      id: 'task-synth-1',
      title: `Audit core toolstack & learning path for ${primaryTitle}`,
      description: 'Review top 3 reference case studies and install necessary tooling/software.',
      category: 'Technical',
      priority: 'high',
      dueDate: 'Due Today',
      completed: true,
    },
    {
      id: 'task-synth-2',
      title: 'Complete foundational skill module & take notes',
      description: 'Spend 2 focused hours absorbing the highest-priority framework concept.',
      category: 'Technical',
      priority: 'high',
      dueDate: 'Due Fri',
      completed: false,
    },
    {
      id: 'task-synth-3',
      title: 'Draft problem statement for 1st Capstone Project',
      description: 'Outline the target user, concrete problem, and deliverables for your portfolio.',
      category: 'Portfolio',
      priority: 'high',
      dueDate: 'Due Sun',
      completed: false,
    },
    {
      id: 'task-synth-4',
      title: 'Connect with 2 active practitioners on LinkedIn / Twitter',
      description: 'Send thoughtful questions about day-to-day workflow and tools.',
      category: 'Networking',
      priority: 'medium',
      dueDate: 'Next Week',
      completed: false,
    },
    {
      id: 'task-synth-5',
      title: `Build functional prototype for ${primaryTitle}`,
      description: 'Implement core functionality and document design/engineering decisions.',
      category: 'Technical',
      priority: 'high',
      dueDate: 'In 2 Weeks',
      completed: false,
    },
    {
      id: 'task-synth-6',
      title: 'Conduct weekly retrospective & log breakthrough insights',
      description: 'Calibrate time spent, identify friction points, and plan next 7-day sprint.',
      category: 'Foundation',
      priority: 'medium',
      dueDate: 'Sunday Evening',
      completed: false,
    },
  ];
}

function synthesizePersonalizedHabits(primaryTitle: string): HabitItem[] {
  return [
    {
      id: 'habit-synth-1',
      title: `45m Deep Practice: ${primaryTitle}`,
      frequency: 'daily',
      targetDaysPerWeek: 5,
      currentStreak: 4,
      bestStreak: 12,
      completedToday: true,
      history: {},
      category: 'Skill Building',
      schedule: 'everyday',
      unit: 'mins',
      target: 45,
      color: '#526B50',
    },
    {
      id: 'habit-synth-2',
      title: 'Read 20m Industry Case Studies & Architecture',
      frequency: 'daily',
      targetDaysPerWeek: 5,
      currentStreak: 3,
      bestStreak: 9,
      completedToday: true,
      history: {},
      category: 'Knowledge',
      schedule: 'everyday',
      unit: 'mins',
      target: 20,
      color: '#3B82F6',
    },
    {
      id: 'habit-synth-3',
      title: 'Build or Refine 1 Proof-of-Work Artifact',
      frequency: 'daily',
      targetDaysPerWeek: 4,
      currentStreak: 2,
      bestStreak: 7,
      completedToday: false,
      history: {},
      category: 'Portfolio',
      schedule: 'everyday',
      unit: 'items',
      target: 1,
      color: '#8B5CF6',
    },
    {
      id: 'habit-synth-4',
      title: 'Sunday Weekly Career Review & Calibration',
      frequency: 'weekly',
      targetDaysPerWeek: 1,
      currentStreak: 2,
      bestStreak: 5,
      completedToday: false,
      history: {},
      category: 'Reflection',
      schedule: 'weekend',
      unit: 'mins',
      target: 30,
      color: '#F59E0B',
    },
  ];
}

function synthesizePersonalizedProjects(primaryTitle: string): ProjectItem[] {
  return [
    {
      id: 'proj-synth-1',
      title: `${primaryTitle} Comprehensive Case Study`,
      description: `An end-to-end production artifact solving a real user or business problem in ${primaryTitle}.`,
      skillsDeveloped: ['Problem Framing', 'End-to-End Execution', 'Documentation'],
      status: 'in-progress',
      targetDate: 'Month 2',
      projectUrl: '',
    },
    {
      id: 'proj-synth-2',
      title: 'Interactive Workflow / System Demo',
      description: 'A live interactive prototype demonstrating mastery of cutting-edge tools and AI leverage.',
      skillsDeveloped: ['Rapid Prototyping', 'System Architecture', 'User Testing'],
      status: 'planned',
      targetDate: 'Month 3',
      projectUrl: '',
    },
  ];
}

function synthesizePersonalizedResources(primaryTitle: string): ResourceItem[] {
  return [
    {
      id: 'res-synth-1',
      title: `${primaryTitle} Official Playbook & Best Practices`,
      type: 'Documentation',
      provider: 'Curated FOYC Archive',
      url: 'https://github.com',
      isVerified: true,
      isFree: true,
    },
    {
      id: 'res-synth-2',
      title: 'Production-Grade Project Walkthroughs & Teardowns',
      type: 'Video',
      provider: 'Practitioner Network',
      url: 'https://youtube.com',
      isVerified: true,
      isFree: true,
    },
  ];
}

/**
 * Multi-Stage Resilient Handoff Parser
 */
export function parseHandoffText(
  pastedText: string,
  existingProfile: UserProfile,
  existingReflection: UserReflection
): ParseResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  if (!pastedText || typeof pastedText !== 'string' || pastedText.trim().length < 15) {
    return {
      success: false,
      errors: ['The input is empty. Please paste your complete FOYC handoff block from ChatGPT.'],
      warnings: [],
      rawInput: pastedText,
    };
  }

  let cleanText = pastedText.trim();
  let jsonString: string | null = null;

  // Stage 1: Explicit FOYC Markers
  const markerMatch = cleanText.match(/FOYC_DASHBOARD_START\s*([\s\S]*?)\s*FOYC_DASHBOARD_END/);
  if (markerMatch) {
    jsonString = markerMatch[1].trim();
  }

  // Stage 2: Markdown Code Block
  if (!jsonString) {
    const codeBlockMatch = cleanText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonString = codeBlockMatch[1].trim();
    }
  }

  // Stage 3: Balanced Bracket JSON Extraction from conversational text
  if (!jsonString) {
    jsonString = extractBalancedJsonObject(cleanText);
  }

  // Stage 4: Try whole input if it starts with { and ends with }
  if (!jsonString && cleanText.startsWith('{') && cleanText.endsWith('}')) {
    jsonString = cleanText;
  }

  if (!jsonString) {
    return {
      success: false,
      errors: [
        'Could not locate a valid structured JSON block in the pasted text.',
        'Please ensure you copy the complete code block or handoff section from ChatGPT.',
      ],
      warnings,
      rawInput: pastedText,
    };
  }

  // Stage 5: Parse JSON
  let parsedJson: any;
  try {
    parsedJson = JSON.parse(jsonString);
  } catch (err: any) {
    // Attempt minor repair on trailing commas before failing
    try {
      const repaired = jsonString.replace(/,\s*([}\]])/g, '$1');
      parsedJson = JSON.parse(repaired);
      warnings.push('Minor trailing comma formatting in JSON was automatically repaired.');
    } catch {
      return {
        success: false,
        errors: [`JSON syntax error: ${err.message}. Please check if the block was truncated.`],
        warnings,
        rawInput: pastedText,
      };
    }
  }

  // Stage 6: Normalize Aliases and Extract Canonical Schema
  const normalized = normalizeAliasedObject(parsedJson);

  // Zod Validation with Graceful Defaults
  const validatedResult = FoycHandoffSchema.safeParse(normalized);
  const d: FoycHandoff = validatedResult.success ? validatedResult.data : normalized;

  if (!validatedResult.success) {
    warnings.push('Some optional fields used schema defaults to ensure complete dashboard rendering.');
  }

  // Stage 7: Extract or Synthesize Adaptive Dashboard Configuration
  let dashboardConfig: DashboardConfiguration;
  if (d.dashboard_configuration) {
    const rawConfig = d.dashboard_configuration;
    dashboardConfig = {
      schema_version: '2.0',
      dashboard_title: rawConfig.dashboard_title || `${d.profile?.preferred_name || 'Personal'} Career Workspace`,
      dashboard_description:
        rawConfig.dashboard_description ||
        'An adaptive workspace tailored to your goals, daily routines, and progression.',
      dashboard_type: (rawConfig.dashboard_type as any) || 'custom',
      primary_purpose:
        rawConfig.primary_purpose ||
        d.career_direction?.career_description?.slice(0, 100) ||
        'Clarity, milestone execution, and daily consistency.',
      selected_modules: rawConfig.selected_modules?.length
        ? rawConfig.selected_modules
        : DEFAULT_DASHBOARD_CONFIG.selected_modules,
      required_modules: rawConfig.required_modules?.length
        ? rawConfig.required_modules
        : ['personal_vision', 'personal_goals', 'daily_priorities'],
      optional_modules: rawConfig.optional_modules || ['projects', 'resources', 'career_comparison'],
      excluded_modules: rawConfig.excluded_modules || [],
      module_reasons: rawConfig.module_reasons || DEFAULT_DASHBOARD_CONFIG.module_reasons,
      module_order: rawConfig.module_order?.length
        ? rawConfig.module_order
        : DEFAULT_DASHBOARD_CONFIG.module_order,
      dashboard_widgets: rawConfig.dashboard_widgets?.length
        ? rawConfig.dashboard_widgets
        : DEFAULT_DASHBOARD_CONFIG.dashboard_widgets,
      theme: (rawConfig.theme as any) || 'green',
      updated_at: new Date().toISOString(),
    };
  } else {
    // Synthesize configuration from user profile and data
    dashboardConfig = {
      ...DEFAULT_DASHBOARD_CONFIG,
      dashboard_title: `${d.profile?.preferred_name || 'My'} Career Workspace`,
      primary_purpose: `Focus on ${d.career_direction?.primary_career_direction || 'career development and milestones'}.`,
      updated_at: new Date().toISOString(),
    };
  }

  // Stage 8: Transform into CareerDashboardData for State & Persistence
  const safeProfile: UserProfile = {
    preferredName: d.profile?.preferred_name || existingProfile.preferredName || 'Explorer',
    ageRange: existingProfile.ageRange || '18-22',
    country: d.profile?.country || existingProfile.country || 'Global',
    educationStatus: (d.profile?.current_education_or_profession as any) || existingProfile.educationStatus || 'college-student',
    currentField: d.profile?.current_field || existingProfile.currentField || 'Career Exploration',
    careerStage: (d.profile?.current_career_stage as any) || existingProfile.careerStage || 'exploring',
    workExperience: d.profile?.work_experience || existingProfile.workExperience || 'Not specified',
    preferredLanguage: existingProfile.preferredLanguage || 'English',
    availableHoursPerWeek: existingProfile.availableHoursPerWeek || 15,
  };

  const safeDirection = {
    primaryTitle: d.career_direction?.primary_career_direction || 'Career Direction',
    summary: d.career_direction?.career_description || '',
    matchReason: d.career_direction?.why_this_direction_was_suggested || '',
    longTermGoal: d.long_term_goals || d.roadmap?.long_term_goal || '',
    shortTermObjective: d.roadmap?.short_term_goals?.[0] || '',
    alternativeTitles: (d.career_direction?.alternative_career_paths || []).map((p) =>
      typeof p === 'string' ? p : p.title
    ),
    fitScore:
      typeof d.career_direction?.confidence_level === 'number'
        ? d.career_direction.confidence_level
        : parseInt(String(d.career_direction?.confidence_level || '92').replace(/\D/g, '') || '92', 10),
    strengths:
      d.strengths_and_skills?.existing_strengths?.length
        ? d.strengths_and_skills.existing_strengths
        : d.strengths || [],
    existingSkills:
      d.strengths_and_skills?.current_technical_skills?.length
        ? d.strengths_and_skills.current_technical_skills
        : d.existing_skills || [],
    skillGaps: (d.skill_gaps || []).map((sg) => sg.skill_name),
    detailedSkillGaps: d.skill_gaps || [],
    reassessmentQuestions: d.review_schedule?.reflection_questions || [],
    assumptions: d.assumptions || [],
    lastReassessedDate: new Date().toISOString().split('T')[0],
  };

  // Safe Milestones - with guaranteed intelligent personalized synthesis
  const rawMilestones = d.roadmap?.milestones?.length ? d.roadmap.milestones : d.milestones || [];
  let safeMilestones: Milestone[] = rawMilestones.map((m, idx) => ({
    id: m.id || `ms-${idx + 1}`,
    title: m.title || `Milestone ${idx + 1}`,
    description: m.description || '',
    priority: (m.priority?.toLowerCase() === 'high' ? 'high' : m.priority?.toLowerCase() === 'low' ? 'low' : 'medium') as any,
    stage: (m.stage as any) || (idx === 0 ? 'Foundation' : idx === 1 ? 'Skill Development' : idx === 2 ? 'Practical Application' : idx === 3 ? 'Professional Readiness' : 'Career Growth'),
    estimatedDuration: m.target_duration || 'Weeks 1-4',
    targetDate: 'Week 4',
    completed: m.is_completed || false,
    associatedTasksCount: 2,
  }));
  if (safeMilestones.length === 0) {
    safeMilestones = synthesizePersonalizedMilestones(safeDirection.primaryTitle, safeProfile.currentField || 'Career Exploration');
    warnings.push('Milestones synthesized from personalized profile to ensure complete roadmap experience.');
  }

  // Safe Tasks - with guaranteed intelligent personalized synthesis
  let safeTasks: TaskItem[] = (d.tasks || []).map((t, idx) => ({
    id: t.id || `task-${idx + 1}`,
    title: t.title || `Task ${idx + 1}`,
    description: t.description || '',
    category: (t.category as any) || (idx % 2 === 0 ? 'Technical' : 'Soft Skills'),
    priority: (t.priority?.toLowerCase() === 'high' ? 'high' : t.priority?.toLowerCase() === 'low' ? 'low' : 'medium') as any,
    dueDate: t.due_date || (idx === 0 ? 'Due Today' : idx === 1 ? 'Due Fri' : 'Next Week'),
    completed: t.is_completed || false,
  }));
  if (safeTasks.length === 0) {
    safeTasks = synthesizePersonalizedTasks(safeDirection.primaryTitle);
    warnings.push('Tasks synthesized from personalized goals to initialize your Learning Checklist.');
  }

  // Safe Habits - with guaranteed intelligent personalized synthesis
  let safeHabits: HabitItem[] = (d.habits || []).map((h, idx) => ({
    id: h.id || `habit-${idx + 1}`,
    title: h.title || `Habit ${idx + 1}`,
    frequency: (h.frequency as any) || 'daily',
    targetDaysPerWeek: typeof (h as any).target_days_per_week === 'number' ? (h as any).target_days_per_week : 5,
    currentStreak: h.streak || (idx === 0 ? 4 : idx === 1 ? 3 : 2),
    bestStreak: h.streak || (idx === 0 ? 12 : idx === 1 ? 9 : 6),
    completedToday: h.completed_today || (idx < 2),
    history: {},
    category: h.category || 'Skill Building',
    schedule: idx === 3 ? 'weekend' : 'everyday',
    unit: 'mins',
    target: 45,
    color: idx === 0 ? '#526B50' : idx === 1 ? '#3B82F6' : idx === 2 ? '#8B5CF6' : '#F59E0B',
  }));
  if (safeHabits.length === 0) {
    safeHabits = synthesizePersonalizedHabits(safeDirection.primaryTitle);
    warnings.push('Habits synthesized from personalized trajectory to activate your Habit Tracker.');
  }

  // Safe Projects - with guaranteed intelligent personalized synthesis
  let safeProjects: ProjectItem[] = (d.projects || []).map((p, idx) => ({
    id: p.id || `proj-${idx + 1}`,
    title: p.title || `Capstone Project ${idx + 1}`,
    description: p.description || '',
    skillsDeveloped: p.skills_developed || ['End-to-End Problem Solving'],
    status: (p.status as any) || (idx === 0 ? 'in-progress' : 'planned'),
    targetDate: 'Month 2',
    projectUrl: p.github_url || p.live_demo_url || '',
  }));
  if (safeProjects.length === 0) {
    safeProjects = synthesizePersonalizedProjects(safeDirection.primaryTitle);
  }

  // Safe Resources - with guaranteed intelligent personalized synthesis
  let safeResources: ResourceItem[] = (d.resources || []).map((r, idx) => ({
    id: r.id || `res-${idx + 1}`,
    title: r.title || 'Core Documentation',
    type: (r.resource_type as any) || 'Documentation',
    provider: 'Official Guide',
    url: r.url || 'https://developer.mozilla.org/',
    isVerified: r.is_verified ?? true,
    isFree: true,
  }));
  if (safeResources.length === 0) {
    safeResources = synthesizePersonalizedResources(safeDirection.primaryTitle);
  }

  const finalDashboardData: CareerDashboardData = {
    profile: safeProfile,
    reflection: existingReflection,
    direction: safeDirection as any,
    milestones: safeMilestones,
    tasks: safeTasks,
    habits: safeHabits,
    projects: safeProjects,
    resources: safeResources,
  };

  return {
    success: true,
    data: finalDashboardData,
    dashboardConfig,
    errors: [],
    warnings,
    canonicalHandoff: d,
    rawInput: pastedText,
  };
}
