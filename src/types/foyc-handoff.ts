import { z } from 'zod';

/**
 * FOYC Canonical Handoff Schema (v2)
 * Corresponds to docs/DASHBOARD_HANDOFF_SCHEMA.json
 */

export const PersonalProfileSchema = z.object({
  preferred_name: z.string().default('Explorer'),
  country: z.string().nullable().optional().default('Global'),
  current_education_or_profession: z.string().nullable().optional().default('Professional Exploration'),
  current_career_stage: z.string().nullable().optional().default('Discovery'),
  work_experience: z.string().nullable().optional().default('Not specified'),
  current_field: z.string().nullable().optional().default('Exploring'),
});

export const CareerDirectionSchema = z.object({
  primary_career_direction: z.string().default('Career Direction Exploration'),
  career_description: z.string().default(''),
  why_this_direction_was_suggested: z.string().default(''),
  key_responsibilities: z.array(z.string()).default([]),
  expected_opportunities: z.array(z.string()).default([]),
  alternative_career_paths: z.array(
    z.union([
      z.string(),
      z.object({
        title: z.string(),
        description: z.string().optional(),
        overlap_score: z.number().optional(),
      }),
    ])
  ).default([]),
  important_trade_offs: z.array(z.string()).default([]),
  confidence_level: z.union([z.number(), z.string()]).default('High (92%)'),
});

export const StrengthsAndSkillsSchema = z.object({
  existing_strengths: z.array(z.string()).default([]),
  transferable_skills: z.array(z.string()).default([]),
  current_technical_skills: z.array(z.string()).default([]),
  current_professional_skills: z.array(z.string()).default([]),
  skills_to_improve: z.array(z.string()).default([]),
});

export const SkillGapItemSchema = z.object({
  skill_name: z.string(),
  current_level: z.string().nullable().optional().default('Beginner'),
  target_level: z.string().nullable().optional().default('Intermediate'),
  priority: z.string().default('High'),
  explanation: z.string().default(''),
  recommended_learning_order: z.number().nullable().optional().default(1),
});

export const CareerMilestoneSchema = z.object({
  id: z.string().default(() => `ms-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`),
  stage: z.string().default('Foundation'),
  title: z.string(),
  description: z.string().default(''),
  priority: z.string().default('High'),
  target_duration: z.string().default('Weeks 1-4'),
  completion_criteria: z.string().default(''),
  dependencies: z.array(z.string()).default([]),
  is_completed: z.boolean().default(false),
});

export const CareerStageSchema = z.object({
  stage_name: z.string(),
  target_duration: z.string().default(''),
  completion_criteria: z.string().default(''),
});

export const CareerRoadmapSchema = z.object({
  long_term_goal: z.string().default('Achieve mastery and professional clarity'),
  short_term_goals: z.array(z.string()).default([]),
  career_stages: z.array(CareerStageSchema).default([]),
  milestones: z.array(CareerMilestoneSchema).default([]),
});

export const ActionChecklistItemSchema = z.object({
  id: z.string().default(() => `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`),
  title: z.string(),
  description: z.string().default(''),
  category: z.string().default('Core'),
  priority: z.string().default('Medium'),
  estimated_duration: z.string().default('2 hours'),
  due_date: z.string().nullable().optional().default(null),
  related_milestone: z.string().nullable().optional().default(null),
  is_completed: z.boolean().default(false),
});

export const HabitItemSchema = z.object({
  id: z.string().default(() => `habit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`),
  title: z.string(),
  description: z.string().default(''),
  frequency: z.string().default('daily'),
  target: z.string().default('45 mins deep work'),
  category: z.string().default('Skill Building'),
  streak: z.number().default(0),
  completed_today: z.boolean().default(false),
});

export const ProjectItemSchema = z.object({
  id: z.string().default(() => `proj-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`),
  title: z.string(),
  description: z.string().default(''),
  skills_developed: z.array(z.string()).default([]),
  expected_output: z.string().default(''),
  milestones: z.array(z.string()).default([]),
  status: z.string().default('planned'),
  github_url: z.string().nullable().optional().default(''),
  live_demo_url: z.string().nullable().optional().default(''),
});

export const LearningResourceItemSchema = z.object({
  id: z.string().default(() => `res-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`),
  title: z.string(),
  resource_type: z.string().default('Documentation'),
  description: z.string().default(''),
  url: z.string().default('#'),
  related_skill: z.string().default('General'),
  is_verified: z.boolean().default(true),
});

export const DashboardConfigHandoffSchema = z.object({
  dashboard_title: z.string().default('Personal Growth Workspace'),
  dashboard_description: z.string().default('An adaptive workspace tailored to your goals and routines.'),
  dashboard_type: z.string().default('custom'),
  primary_purpose: z.string().default('Clarity and execution'),
  selected_modules: z.array(z.string()).default([
    'personal_vision',
    'personal_goals',
    'career_roadmap',
    'daily_priorities',
    'habit_tracker',
    'focus_timer',
    'skills_learning',
    'weekly_review',
  ]),
  required_modules: z.array(z.string()).default(['personal_vision', 'personal_goals', 'daily_priorities']),
  optional_modules: z.array(z.string()).default(['projects', 'resources', 'career_comparison']),
  excluded_modules: z.array(z.string()).default([]),
  module_reasons: z.record(z.string(), z.string()).default({}),
  module_order: z.array(z.string()).default([]),
  dashboard_widgets: z.array(z.string()).default([]),
  theme: z.string().default('green'),
});

export const ReviewScheduleSchema = z.object({
  frequency: z.string().default('Sunday evening calibration'),
  weekly_goals: z.array(z.string()).default([]),
  reflection_questions: z.array(z.string()).default([
    'What key milestone or concept was mastered this week?',
    'What blockers or ambiguities were encountered?',
    'Are you still energized by this direction?',
    'What are the non-negotiable commitments for next week?',
  ]),
  progress_indicators: z.array(z.string()).default([]),
  suggested_reassessment_date: z.string().nullable().optional().default(null),
});

export const FoycHandoffSchema = z.object({
  schema_version: z.string().default('foyc_dashboard_v2'),
  dashboard_configuration: DashboardConfigHandoffSchema.optional(),
  profile: PersonalProfileSchema.default(() => ({
    preferred_name: 'Explorer',
    country: 'Global',
    current_education_or_profession: 'Professional Exploration',
    current_career_stage: 'Discovery',
    work_experience: 'Not specified',
    current_field: 'Exploring',
  })),
  career_direction: CareerDirectionSchema.default(() => ({
    primary_career_direction: 'Career Direction Exploration',
    career_description: '',
    why_this_direction_was_suggested: '',
    key_responsibilities: [],
    expected_opportunities: [],
    alternative_career_paths: [],
    important_trade_offs: [],
    confidence_level: 'High (92%)',
  })),
  strengths_and_skills: StrengthsAndSkillsSchema.optional().default(() => ({
    existing_strengths: [],
    transferable_skills: [],
    current_technical_skills: [],
    current_professional_skills: [],
    skills_to_improve: [],
  })),
  strengths: z.array(z.string()).optional().default([]),
  existing_skills: z.array(z.string()).optional().default([]),
  skill_gaps: z.array(SkillGapItemSchema).default([]),
  long_term_goals: z.string().optional().default(''),
  roadmap: CareerRoadmapSchema.default(() => ({
    long_term_goal: 'Achieve mastery and professional clarity',
    short_term_goals: [],
    career_stages: [],
    milestones: [],
  })),
  milestones: z.array(CareerMilestoneSchema).optional().default([]),
  tasks: z.array(ActionChecklistItemSchema).default([]),
  habits: z.array(HabitItemSchema).default([]),
  projects: z.array(ProjectItemSchema).default([]),
  resources: z.array(LearningResourceItemSchema).default([]),
  review_schedule: ReviewScheduleSchema.default(() => ({
    frequency: 'Sunday evening calibration',
    weekly_goals: [],
    reflection_questions: [
      'What key milestone or concept was mastered this week?',
      'What blockers or ambiguities were encountered?',
      'Are you still energized by this direction?',
      'What are the non-negotiable commitments for next week?',
    ],
    progress_indicators: [],
    suggested_reassessment_date: null,
  })),
  assumptions: z.array(z.string()).default([]),
  confidence_and_uncertainties: z.union([z.string(), z.record(z.string(), z.any())]).nullable().optional().default(''),
});

export type FoycHandoff = z.infer<typeof FoycHandoffSchema>;
export type SkillGapItem = z.infer<typeof SkillGapItemSchema>;
export type CareerMilestone = z.infer<typeof CareerMilestoneSchema>;
export type ActionChecklistItem = z.infer<typeof ActionChecklistItemSchema>;
export type HabitItem = z.infer<typeof HabitItemSchema>;
export type ProjectItem = z.infer<typeof ProjectItemSchema>;
export type LearningResourceItem = z.infer<typeof LearningResourceItemSchema>;

/**
 * Deterministic Parser for FOYC Handoff
 * Extracts JSON between FOYC_DASHBOARD_START and FOYC_DASHBOARD_END
 */
export interface ParseResult {
  success: boolean;
  data?: FoycHandoff;
  error?: string;
  rawJson?: string;
  missingOptionalFields?: string[];
}

export function parseAndValidateFoycHandoff(rawInput: string): ParseResult {
  if (!rawInput || typeof rawInput !== 'string' || !rawInput.trim()) {
    return {
      success: false,
      error: 'The input is empty. Please paste your complete FOYC handoff block from ChatGPT.',
    };
  }

  // 1. Locate markers
  let startMarker = 'FOYC_DASHBOARD_START';
  let endMarker = 'FOYC_DASHBOARD_END';

  let startIndex = rawInput.indexOf(startMarker);
  let endIndex = rawInput.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1) {
    startMarker = 'FOYC_HANDOFF_START';
    endMarker = 'FOYC_HANDOFF_END';
    startIndex = rawInput.indexOf(startMarker);
    endIndex = rawInput.indexOf(endMarker);
  }

  let jsonText = '';

  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    jsonText = rawInput.slice(startIndex + startMarker.length, endIndex).trim();
  } else {
    const firstBrace = rawInput.indexOf('{');
    const lastBrace = rawInput.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonText = rawInput.slice(firstBrace, lastBrace + 1).trim();
    } else {
      return {
        success: false,
        error:
          'Could not find the FOYC_DASHBOARD_START and FOYC_DASHBOARD_END markers. Please make sure to copy the entire block including the start and end markers from your ChatGPT conversation.',
      };
    }
  }

  // 2. Safe JSON Parse
  let rawParsed: any;
  try {
    rawParsed = JSON.parse(jsonText);
  } catch (err: any) {
    return {
      success: false,
      error: `The content between markers is not valid JSON (${err?.message || 'Syntax error'}). Please ensure no Markdown or conversational text is mixed into the code block.`,
      rawJson: jsonText,
    };
  }

  // 3. Normalization layer
  const normalized: any = { ...rawParsed };

  if (rawParsed.direction && !rawParsed.career_direction) {
    normalized.career_direction = {
      primary_career_direction: rawParsed.direction.primaryTitle || rawParsed.direction.primary_career_direction || 'Career Direction',
      career_description: rawParsed.direction.summary || rawParsed.direction.career_description || '',
      why_this_direction_was_suggested: rawParsed.direction.whyRecommended || rawParsed.direction.why_this_direction_was_suggested || '',
      key_responsibilities: rawParsed.direction.keyResponsibilities || rawParsed.direction.key_responsibilities || [],
      expected_opportunities: rawParsed.direction.expectedOpportunities || rawParsed.direction.expected_opportunities || [],
      alternative_career_paths: rawParsed.direction.alternativePaths || rawParsed.direction.alternative_career_paths || [],
      important_trade_offs: rawParsed.direction.tradeOffs || rawParsed.direction.important_trade_offs || [],
      confidence_level: rawParsed.direction.fitScore || rawParsed.direction.confidence_level || '95%',
    };
  }

  if (Array.isArray(rawParsed.milestones) && (!normalized.roadmap || !normalized.roadmap.milestones || normalized.roadmap.milestones.length === 0)) {
    if (!normalized.roadmap) normalized.roadmap = {};
    normalized.roadmap.milestones = rawParsed.milestones;
  }

  if (Array.isArray(rawParsed.skillGaps) && (!normalized.skill_gaps || normalized.skill_gaps.length === 0)) {
    normalized.skill_gaps = rawParsed.skillGaps.map((sg: any) => ({
      skill_name: sg.skill || sg.skill_name || 'Skill',
      current_level: sg.currentLevel || sg.current_level || 'Beginner',
      target_level: sg.targetLevel || sg.target_level || 'Intermediate',
      priority: sg.priority || 'High',
      explanation: sg.explanation || sg.whyNeeded || '',
      recommended_learning_order: sg.order || 1,
    }));
  }

  // 4. Schema validation with Zod
  const validation = FoycHandoffSchema.safeParse(normalized);

  if (!validation.success) {
    const errorDetails = validation.error.issues.map(
      (e: any) => `${e.path.join('.')}: ${e.message}`
    );
    return {
      success: false,
      error: `Schema validation failed: ${errorDetails.slice(0, 3).join(', ')}`,
      rawJson: jsonText,
    };
  }

  const resultData = validation.data;

  if (resultData.roadmap.milestones.length > 0 && (!resultData.milestones || resultData.milestones.length === 0)) {
    resultData.milestones = resultData.roadmap.milestones;
  } else if (resultData.milestones && resultData.milestones.length > 0 && resultData.roadmap.milestones.length === 0) {
    resultData.roadmap.milestones = resultData.milestones;
  }

  return {
    success: true,
    data: resultData,
    rawJson: jsonText,
  };
}
