import { z } from 'zod';

export type LifeStageKey =
  | 'school-student'
  | 'college-student'
  | 'recent-graduate'
  | 'working-professional'
  | 'career-switcher'
  | 'entrepreneur'
  | 'career-break'
  | 'other';

export type LifeStageId = LifeStageKey;

export interface LifeStageOption {
  key: LifeStageKey;
  id?: LifeStageKey;
  label: string;
  tagline: string;
  description: string;
  iconName: string;
}

export const LIFE_STAGE_OPTIONS: LifeStageOption[] = [
  {
    key: 'school-student',
    id: 'school-student',
    label: 'School Student',
    tagline: 'Foundations & Exploration',
    description: 'Exploring interests and thinking about future education, streams, or early career paths.',
    iconName: 'GraduationCap',
  },
  {
    key: 'college-student',
    id: 'college-student',
    label: 'College / University Student',
    tagline: 'Degrees & Specialization',
    description: 'Studying, developing skills, and deciding what direction, internships, or roles to pursue.',
    iconName: 'BookOpen',
  },
  {
    key: 'recent-graduate',
    id: 'recent-graduate',
    label: 'Recent Graduate',
    tagline: 'First Professional Steps',
    description: 'Preparing to enter the professional world or exploring diverse entry-level opportunities.',
    iconName: 'Briefcase',
  },
  {
    key: 'working-professional',
    id: 'working-professional',
    label: 'Working Professional',
    tagline: 'Growth & Advancement',
    description: 'Building a career, seeking upskilling, promotion, or reconsidering current trajectory.',
    iconName: 'TrendingUp',
  },
  {
    key: 'career-switcher',
    id: 'career-switcher',
    label: 'Career Switcher',
    tagline: 'Pivoting Direction',
    description: 'Considering a transition into a completely different profession, stack, or industry.',
    iconName: 'Shuffle',
  },
  {
    key: 'entrepreneur',
    id: 'entrepreneur',
    label: 'Entrepreneur / Freelancer',
    tagline: 'Independent Ventures',
    description: 'Building an independent career, freelancing niche, business, or personal venture.',
    iconName: 'Rocket',
  },
  {
    key: 'career-break',
    id: 'career-break',
    label: 'Returning After a Break',
    tagline: 'Career Re-Entry',
    description: 'Planning to restart professional activities, balance family, and refresh your skillset.',
    iconName: 'RotateCcw',
  },
  {
    key: 'other',
    id: 'other',
    label: 'Other Situation',
    tagline: 'Unique Crossroads',
    description: 'A personal journey that combines multiple paths or requires tailored self-discovery.',
    iconName: 'Compass',
  },
];

export type UncertaintyId = string;

export interface UncertaintyOption {
  id: string;
  key: string;
  label: string;
  category: string;
}

export const UNCERTAINTY_OPTIONS: UncertaintyOption[] = [
  { id: 'too_many_options', key: 'too_many_options', label: "Too many options — I don't know which to commit to", category: 'Direction' },
  { id: 'dont_know_strengths', key: 'dont_know_strengths', label: "I don't know what my real strengths or interests are", category: 'Self-Awareness' },
  { id: 'fear_of_choosing_wrong', key: 'fear_of_choosing_wrong', label: "Fear of choosing wrong and wasting time or money", category: 'Risk & Anxiety' },
  { id: 'lack_experience', key: 'lack_experience', label: "Lack of relevant experience or skills for what I want", category: 'Capabilities' },
  { id: 'financial_pressure', key: 'financial_pressure', label: "Financial pressure — I need income quickly", category: 'Constraints' },
  { id: 'ai_anxiety', key: 'ai_anxiety', label: "Concern about AI taking over or changing this field", category: 'AI & Future' },
  { id: 'social_expectations', key: 'social_expectations', label: "Family or social expectations pulling in different directions", category: 'External Pressure' },
  { id: 'burnt_out', key: 'burnt_out', label: "Burnt out, unmotivated, or lost momentum in current work", category: 'Energy & Focus' },
  { id: 'no_clear_roadmap', key: 'no_clear_roadmap', label: "Have a goal, but no clear roadmap or sequence to follow", category: 'Execution' },
  { id: 'career_switch_risk', key: 'career_switch_risk', label: "Need to switch careers but don't know how to transition safely", category: 'Transition' },
  { id: 'nontraditional_background', key: 'nontraditional_background', label: "No degree, non-traditional background, or self-taught disadvantage", category: 'Credentials' },
  { id: 'feeling_behind', key: 'feeling_behind', label: "Feeling behind peers and overwhelmed by where to start", category: 'Mindset' },
  { id: 'other', key: 'other', label: "Other specific challenge or situation", category: 'Other' },
];

export const INTEREST_AREAS = [
  'Building software / Web apps',
  'UI/UX & Product Design',
  'Data science & AI agents',
  'Entrepreneurship & Startups',
  'Content, Writing & Media',
  'Finance, Stocks & Investing',
  'Hardware, Robotics & IoT',
  'Sales, Marketing & Growth',
  'Cybersecurity & Networks',
  'Education, Coaching & Teaching',
  'BioTech & Healthcare',
  'Operations & Management',
];

export const SKILL_OPTIONS = [
  'JavaScript / TypeScript',
  'React / Next.js',
  'Python / Data Analysis',
  'Figma & UI Prototyping',
  'SQL & Database Design',
  'Copywriting & Content Creation',
  'Prompt Engineering & AI Tools',
  'Public Speaking & Presenting',
  'Digital Marketing & SEO',
  'Product Analytics & Metrics',
  'Project Management (Agile)',
  'System Architecture & DevOps',
];

export const VISION_OPTIONS = [
  'High-income / Rapid financial independence',
  'Creative autonomy & Intellectual freedom',
  'Deep subject mastery / Industry specialist',
  'Work-life harmony & Low stress',
  'Building and scaling my own venture',
  'Social impact & Serving communities',
  '100% Location-independent digital nomad',
  'Still clarifying my primary ambition',
];

export interface AdaptiveAnswers {
  highestEducation?: string;
  fieldOfStudy?: string;
  currentRole?: string;
  yearsExperience?: string;
  currentIndustry?: string;
  curiosityTopics?: string[];
  deepDiveTopics?: string;
  enjoyedProblems?: string;
  possessedSkills?: string[];
  skillsToDevelop?: string[];
  threeToFiveYearVision?: string;
  incomePriority?: string;
  workEnvironment?: string;
  employmentType?: string;
  workNature?: string;
  weeklyLearningHours?: number;
  learningBudget?: string;
  needImmediateIncome?: boolean;
  geographicOrLanguageConstraints?: string;
  additionalContext?: string;
  aiIndustryConcern?: string;
  consideredOptions?: string;
  specificGoal?: string;
}

export interface ClarityPersonData {
  education?: string;
  currentRole?: string;
  experience?: string;
  interests?: string[];
  interestsDeepDive?: string;
  skillsPossessed?: string[];
  skillsToDevelop?: string[];
  visionDriver?: string;
  workStyle?: string;
  environmentPreference?: string;
  timeAvailable?: string;
  budget?: string;
  timeline?: string;
  specificDrillDowns?: {
    aiConcern?: string;
    competingOptions?: string;
    targetGoal?: string;
  };
  personalContext?: {
    favoriteSubjects?: string;
    placementStatus?: string;
    targetField?: string;
    notes?: string;
  };
}

export interface InitialClarityAssessment {
  currentPositionSummary: string;
  primaryUncertainty: string;
  secondaryUncertainties: string[];
  knownStrengthsAndInterests: string[];
  personalPriorities: string[];
  practicalConstraints: string[];
  unresolvedQuestions: string[];
  recommendedNextStep: string;
}

export interface ClarityInitialReport {
  currentPosition: string;
  uncertaintyBreakdown: string;
  strengthsSynthesis: string;
  areasNeedingExploration: string;
  worthExploringQuestions: string[];
  recommendedNextStep: string;
}

// Zod Schema for Structured Clarity Handoff
export const ClarityHandoffSchema = z.object({
  report_title: z.string().default('My Personal Clarity Report'),
  user_name: z.string().nullable().optional().default('Explorer'),
  current_stage: z.string().default('Career Exploration'),
  primary_uncertainty: z.string().default('Career Direction Ambiguity'),

  executive_summary: z.union([
    z.string(),
    z.object({
      summary: z.string(),
      primary_uncertainty: z.string().default(''),
      key_insight: z.string().default(''),
    }),
  ]).transform((val) => {
    if (typeof val === 'string') {
      return {
        summary: val,
        primary_uncertainty: '',
        key_insight: '',
      };
    }
    return val;
  }),

  understanding_you: z.object({
    education_and_background: z.string().default(''),
    interests: z.array(z.string()).default([]),
    strengths_possessed: z.array(z.string()).default([]),
    skills_to_develop: z.array(z.string()).default([]),
    work_preferences: z.string().default(''),
    constraints: z.array(z.string()).default([]),
  }).default({
    education_and_background: '',
    interests: [],
    strengths_possessed: [],
    skills_to_develop: [],
    work_preferences: '',
    constraints: [],
  }),

  uncertainty_map: z.object({
    primary: z.string().default(''),
    secondary: z.array(z.string()).default([]),
    breakdown: z.array(
      z.object({
        category: z.string(),
        description: z.string(),
      })
    ).default([]),
  }).default({
    primary: '',
    secondary: [],
    breakdown: [],
  }),

  strengths_and_interests: z.object({
    core_strengths: z.array(z.string()).default([]),
    deep_curiosities: z.array(z.string()).default([]),
    transferable_gems: z.array(z.string()).default([]),
  }).default({
    core_strengths: [],
    deep_curiosities: [],
    transferable_gems: [],
  }),

  explored_directions: z.array(
    z.object({
      title: z.string(),
      fit_score: z.number().optional().default(80),
      reasoning: z.string().default(''),
      pros: z.array(z.string()).default([]),
      cons: z.array(z.string()).default([]),
      open_questions: z.array(z.string()).default([]),
      recommended: z.boolean().optional().default(false),
    })
  ).default([]),

  strategic_direction: z.object({
    selected_direction: z.string().default('Exploratory Trajectory'),
    primary_title: z.string().optional(),
    is_decided: z.boolean().default(false),
    rationale: z.string().default(''),
    target_timeline_months: z.number().optional().default(6),
    target_role_types: z.array(z.string()).optional().default([]),
    next_decisions_to_investigate: z.array(z.string()).default([]),
  }).default({
    selected_direction: 'Exploratory Trajectory',
    primary_title: 'Exploratory Trajectory',
    is_decided: false,
    rationale: '',
    target_timeline_months: 6,
    target_role_types: [],
    next_decisions_to_investigate: [],
  }),

  roadmap: z.array(
    z.object({
      timeframe: z.string(),
      phase_name: z.string().optional(),
      duration_weeks: z.string().optional(),
      title: z.string().default('Roadmap Phase'),
      description: z.string().default(''),
      objectives: z.array(z.string()).optional().default([]),
      deliverables: z.array(z.string()).optional().default([]),
      milestones: z.array(z.string()).default([]),
    })
  ).default([]),

  skills_plan: z.array(
    z.object({
      skill_name: z.string(),
      importance: z.string().default(''),
      learning_activity: z.string().default(''),
      evidence_of_progress: z.string().default(''),
    })
  ).default([]),

  risks_and_considerations: z.object({
    potential_obstacles: z.array(z.string()).default([]),
    assumptions_to_validate: z.array(z.string()).default([]),
    risk_mitigations: z.array(z.string()).default([]),
  }).default({
    potential_obstacles: [],
    assumptions_to_validate: [],
    risk_mitigations: [],
  }),

  action_checklist: z.array(
    z.object({
      id: z.string().default(() => `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`),
      timeframe: z.string().default('Immediate'),
      task: z.string().default(''),
      text: z.string().optional(),
      completed: z.boolean().default(false),
      week: z.number().optional(),
    })
  ).default([]),

  personal_commitment: z.object({
    first_concrete_step: z.string().default('Take immediate action on milestone #1'),
    commitment_statement: z.string().default('I am moving with clarity and momentum.'),
  }).default({
    first_concrete_step: 'Take immediate action on milestone #1',
    commitment_statement: 'I am moving with clarity and momentum.',
  }),

  reassessment: z.object({
    recommended_date: z.string().default(() => {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      return d.toISOString().split('T')[0];
    }),
    reflection_prompt: z.string().default('Review progress on core skills and calibrate trajectory.'),
  }).default({
    recommended_date: new Date().toISOString().split('T')[0],
    reflection_prompt: 'Review progress on core skills and calibrate trajectory.',
  }),
});

export type ClarityHandoff = z.infer<typeof ClarityHandoffSchema>;

// Unified Final Report with helpful view properties
export interface ClarityFinalReport {
  user_profile?: {
    name?: string;
    life_stage?: string;
    current_context?: string;
  };
  executive_summary?: string;
  uncertainty_resolution?: {
    root_causes_addressed?: string[];
    key_breakthrough_insights?: string[];
    confidence_score?: number;
  };
  trajectories_evaluated?: Array<{
    title: string;
    fit_score: number;
    pros: string[];
    cons: string[];
    recommended?: boolean;
  }>;
  selected_direction?: {
    primary_title: string;
    rationale: string;
    target_timeline_months?: number;
    target_role_types?: string[];
  };
  roadmap_phases?: Array<{
    phase_name: string;
    duration_weeks: string;
    objectives: string[];
    deliverables: string[];
  }>;
  skill_mastery_matrix?: {
    immediate_priorities: string[];
    secondary_skills: string[];
    skills_to_deprioritize: string[];
  };
  living_action_checklist?: Array<{
    id: string;
    text: string;
    completed: boolean;
    week?: number;
  }>;
  personal_commitment_statement?: string;
  raw_handoff_data?: ClarityHandoff;
}

export interface ClarityAssessment {
  id: string;
  user_id?: string;
  session_id?: string;
  current_stage: number;
  life_stage?: LifeStageKey | null;
  life_stage_other?: string;
  uncertainties?: UncertaintyId[];
  custom_uncertainty?: string;
  reflection_text?: string;
  person_data?: ClarityPersonData;
  initial_report?: ClarityInitialReport;
  chatgpt_prompt?: string;
  final_report?: ClarityFinalReport | null;
  raw_handoff_text?: string;
  status: string;
  created_at: string;
  updated_at: string;
}
