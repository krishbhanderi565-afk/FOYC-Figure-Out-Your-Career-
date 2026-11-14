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
 * Normalizes common aliases from various ChatGPT outputs and older schemas
 */
function normalizeAliasedObject(raw: any): any {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return raw;

  const out = { ...raw };

  // Profile alias
  if (!out.profile && (out.user_profile || out.user_name || out.preferred_name)) {
    out.profile = {
      preferred_name: out.preferred_name || out.user_name || 'Explorer',
      country: out.country || 'Global',
      current_education_or_profession: out.current_education || out.education || 'Professional Exploration',
      current_career_stage: out.career_stage || out.current_stage || 'Discovery',
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
      out.recommendation?.primaryPathTitle ||
      out.report_title?.replace(/^(My Career Plan:\s*|Career Direction:\s*)/i, '') ||
      'Career Direction Exploration';

    out.career_direction = {
      primary_career_direction: primaryDir,
      career_description:
        out.career_description ||
        out.strategic_direction?.rationale ||
        out.executive_summary?.summary ||
        out.executiveSummary ||
        '',
      why_this_direction_was_suggested:
        out.why_this_direction_was_suggested ||
        out.strategic_direction?.rationale ||
        out.recommendation?.strategicRationale ||
        '',
      key_responsibilities: out.key_responsibilities || [],
      expected_opportunities: out.expected_opportunities || out.opportunities || [],
      alternative_career_paths:
        out.alternative_career_paths ||
        out.explored_directions?.map((d: any) => ({
          title: d.title,
          description: d.reasoning || '',
          overlap_score: d.fit_score || 85,
        })) ||
        [],
      important_trade_offs: out.important_trade_offs || [],
      confidence_level: out.confidence_level || out.recommendation?.confidenceScore || 92,
    };
  }

  // Roadmap & Milestones alias
  if (!out.roadmap) {
    const rawMilestones = out.milestones || out.career_milestones || [];
    out.roadmap = {
      long_term_goal: out.long_term_goal || out.long_term_goals || 'Achieve professional clarity and execution',
      short_term_goals: out.short_term_goals || [],
      career_stages: out.career_stages || [],
      milestones: Array.isArray(rawMilestones) ? rawMilestones : [],
    };
  }

  // Tasks alias
  if (!out.tasks && (out.action_items || out.action_checklist || out.weekly_actions || out.checklist)) {
    const rawTasks = out.action_items || out.action_checklist || out.weekly_actions || out.checklist;
    if (Array.isArray(rawTasks)) {
      out.tasks = rawTasks.map((t: any, idx: number) => ({
        id: t.id || `task-${idx + 1}`,
        title: typeof t === 'string' ? t : t.title || t.task || `Action Item ${idx + 1}`,
        description: t.description || '',
        category: t.category || 'Core',
        priority: t.priority || 'High',
        due_date: t.due_date || t.timeframe || 'Next Week',
        is_completed: t.is_completed || t.completed || false,
      }));
    }
  }

  // Skill Gaps alias
  if (!out.skill_gaps && (out.skills_plan || out.learning_plan || out.skills_roadmap || out.skills_to_develop)) {
    const rawSkills = out.skills_plan || out.learning_plan || out.skills_roadmap || out.skills_to_develop;
    if (Array.isArray(rawSkills)) {
      out.skill_gaps = rawSkills.map((s: any, idx: number) => ({
        skill_name: typeof s === 'string' ? s : s.skill_name || s.name || `Core Competency ${idx + 1}`,
        current_level: s.current_level || 'Beginner',
        target_level: s.target_level || 'Intermediate',
        priority: s.priority || 'High',
        explanation: s.importance || s.explanation || s.learning_activity || '',
        recommended_learning_order: idx + 1,
      }));
    }
  }

  // Habits alias
  if (!out.habits && out.routines) {
    out.habits = out.routines;
  }

  return out;
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

  // Safe Milestones
  const rawMilestones = d.roadmap?.milestones?.length ? d.roadmap.milestones : d.milestones || [];
  const safeMilestones: Milestone[] = rawMilestones.map((m, idx) => ({
    id: m.id || `ms-${idx + 1}`,
    title: m.title || `Milestone ${idx + 1}`,
    description: m.description || '',
    priority: (m.priority?.toLowerCase() === 'high' ? 'high' : m.priority?.toLowerCase() === 'low' ? 'low' : 'medium') as any,
    stage: (m.stage as any) || 'Foundation',
    estimatedDuration: m.target_duration || 'Weeks 1-4',
    targetDate: 'Week 4',
    completed: m.is_completed || false,
    associatedTasksCount: 2,
  }));

  // Safe Tasks
  const safeTasks: TaskItem[] = (d.tasks || []).map((t, idx) => ({
    id: t.id || `task-${idx + 1}`,
    title: t.title || `Task ${idx + 1}`,
    description: t.description || '',
    category: (t.category as any) || 'Technical',
    priority: (t.priority?.toLowerCase() === 'high' ? 'high' : t.priority?.toLowerCase() === 'low' ? 'low' : 'medium') as any,
    dueDate: t.due_date || 'Next Week',
    completed: t.is_completed || false,
  }));

  // Safe Habits
  const safeHabits: HabitItem[] = (d.habits || []).map((h, idx) => ({
    id: h.id || `habit-${idx + 1}`,
    title: h.title || `Habit ${idx + 1}`,
    frequency: (h.frequency as any) || 'daily',
    targetDaysPerWeek: typeof (h as any).target_days_per_week === 'number' ? (h as any).target_days_per_week : 5,
    currentStreak: h.streak || 0,
    bestStreak: h.streak || 0,
    completedToday: h.completed_today || false,
    history: {},
    category: h.category || 'Skill Building',
    schedule: 'everyday',
    unit: 'mins',
    target: 45,
    color: '#526B50',
  }));

  // Safe Projects
  const safeProjects: ProjectItem[] = (d.projects || []).map((p, idx) => ({
    id: p.id || `proj-${idx + 1}`,
    title: p.title || `Capstone Project ${idx + 1}`,
    description: p.description || '',
    skillsDeveloped: p.skills_developed || [],
    status: (p.status as any) || 'planned',
    targetDate: 'Month 2',
    projectUrl: p.github_url || p.live_demo_url || '',
  }));

  // Safe Resources
  const safeResources: ResourceItem[] = (d.resources || []).map((r, idx) => ({
    id: r.id || `res-${idx + 1}`,
    title: r.title || 'Core Documentation',
    type: (r.resource_type as any) || 'Documentation',
    provider: 'Official Guide',
    url: r.url || 'https://developer.mozilla.org/',
    isVerified: r.is_verified ?? true,
    isFree: true,
  }));

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
