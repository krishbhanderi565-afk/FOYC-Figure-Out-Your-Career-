import { z } from 'zod';
import { LifeStageKey } from './clarity';

export type PossibilityCategoryKey =
  | 'traditional'
  | 'emerging'
  | 'entrepreneurship'
  | 'freelance'
  | 'education'
  | 'creative'
  | 'hybrid';

export interface PossibilityCategoryMeta {
  key: PossibilityCategoryKey;
  label: string;
  badgeColor: string;
  description: string;
  iconName: string;
}

export const POSSIBILITY_CATEGORIES: PossibilityCategoryMeta[] = [
  {
    key: 'traditional',
    label: 'Traditional Career Paths',
    badgeColor: '#171717',
    description: 'Established professions with proven career ladders, stable corporate hiring, and structured progression.',
    iconName: 'Briefcase',
  },
  {
    key: 'emerging',
    label: 'Emerging & Future Opportunities',
    badgeColor: '#526B50',
    description: 'Frontier roles shaped by AI advancements, climate technologies, automation, and newly opening markets.',
    iconName: 'Cpu',
  },
  {
    key: 'entrepreneurship',
    label: 'Entrepreneurship & Business',
    badgeColor: '#D97706',
    description: 'Building ventures from zero: startups, boutique agencies, micro-SaaS, and scalable service businesses.',
    iconName: 'Rocket',
  },
  {
    key: 'freelance',
    label: 'Freelancing & Independent Work',
    badgeColor: '#2563EB',
    description: 'Contract-based autonomy, global remote consulting, specialized client engagements, and portfolio careers.',
    iconName: 'Globe',
  },
  {
    key: 'education',
    label: 'Higher Education & Specialization',
    badgeColor: '#7C3AED',
    description: 'Postgraduate degrees, academic research, doctoral fellowships, and deep subject-matter credentials.',
    iconName: 'GraduationCap',
  },
  {
    key: 'creative',
    label: 'Creative & Unconventional Paths',
    badgeColor: '#DB2777',
    description: 'Media production, design ateliers, content creation, arts, narrative crafting, and indie creator models.',
    iconName: 'Palette',
  },
  {
    key: 'hybrid',
    label: 'Hybrid & Alternative Opportunities',
    badgeColor: '#059669',
    description: 'Interdisciplinary intersections combining two diverse passions (e.g., Code + Healthcare, Design + Finance).',
    iconName: 'Shuffle',
  },
];

export const POSSIBILITY_INTERESTS = [
  'Technology & AI Systems',
  'Business & Entrepreneurship',
  'Science & Laboratory Research',
  'Finance, Stocks & Economics',
  'Design, UX & Visual Creativity',
  'Marketing, Growth & Communication',
  'Healthcare & Life Sciences',
  'Education, Coaching & Teaching',
  'Government, Policy & Public Service',
  'Media, Writing & Content Creation',
  'Social Impact & Sustainability',
  'Skilled Trades & Practical Building',
];

export const POSSIBILITY_AMBITIONS = [
  'Build a successful professional career with leadership growth',
  'Become financially independent with high earning velocity',
  'Start and run my own business or venture',
  'Become an acknowledged expert in a specific craft',
  'Pursue higher education, research, or academia',
  'Work internationally or relocate overseas',
  'Work 100% remotely with location autonomy',
  'Create meaningful social or environmental impact',
  'Build and monetize something of my own creation',
  'Explore multiple intersecting interests concurrently',
  'I am still figuring out my primary ambition',
];

export const POSSIBILITY_SKILLS = [
  'Software Development & Coding',
  'Data Analysis & Quantitative Reasoning',
  'Visual Design & Prototyping',
  'Written Communication & Storytelling',
  'Public Speaking & Persuasion',
  'Project Management & Organization',
  'Sales, Business Development & Closing',
  'Leadership & People Management',
  'Critical Problem-Solving & Strategy',
  'Prompt Engineering & Applied AI Tools',
  'Customer Research & User Empathy',
  'Financial Modeling & Budgeting',
];

// Single Discovered Possibility Item
export const PossibilityItemSchema = z.object({
  id: z.string().default(() => `pos-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`),
  name: z.string(),
  category: z.string().default('Traditional Career Paths'),
  fit_level: z.enum(['Potentially Strong Fit', 'Worth Exploring', 'Ambitious Long-Term']).default('Potentially Strong Fit'),
  description: z.string().default(''),
  why_it_matches: z.string().default(''),
  required_skills: z.array(z.string()).default([]),
  entry_requirements: z.string().default('Flexible portfolio-first pathway'),
  estimated_preparation_time: z.string().default('3–6 months'),
  estimated_cost: z.string().default('Low ($0–$100 in self-paced resources)'),
  opportunities: z.array(z.string()).default([]),
  challenges: z.array(z.string()).default([]),
  ai_impact: z.string().default('AI augments routine production tasks; high leverage for practitioners.'),
  evidence_and_sources: z.string().default('Industry hiring patterns and practitioner roadmaps.'),
  confidence_and_uncertainties: z.string().default('Clear entry pathways exist; depends on personal weekly execution.'),
  // Interactive client state
  is_shortlisted: z.boolean().optional().default(false),
  status: z.enum(['interested', 'not_sure', 'save_later']).optional().default('interested'),
  user_notes: z.string().optional().default(''),
});

export type PossibilityItem = z.infer<typeof PossibilityItemSchema>;

// Practical Experiment Schema
export const PossibilityExperimentSchema = z.object({
  id: z.string().default(() => `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`),
  possibility_name: z.string().default('Target Possibility'),
  title: z.string(),
  type: z.enum(['Micro-Project', 'Interview Professional', 'Course / Tutorial', 'Prototype', 'Shadowing / Research']).default('Micro-Project'),
  description: z.string().default(''),
  estimated_time: z.string().default('2–5 hours'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).default('Beginner'),
  is_completed: z.boolean().default(false),
});

export type PossibilityExperiment = z.infer<typeof PossibilityExperimentSchema>;

// Action Step Schema
export const PossibilityActionStepSchema = z.object({
  id: z.string().default(() => `step-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`),
  timeframe: z.enum(['Immediate Actions', "This Week's Actions", "This Month's Actions", 'Longer-Term Exploration']).default('Immediate Actions'),
  task: z.string(),
  completed: z.boolean().default(false),
  notes: z.string().optional().default(''),
});

export type PossibilityActionStep = z.infer<typeof PossibilityActionStepSchema>;

// Complete Structured Handoff Schema from ChatGPT
export const PossibilityHandoffSchema = z.object({
  schema_version: z.string().default('1.0'),
  profile: z.object({
    user_name: z.string().nullable().optional().default('Explorer'),
    life_stage: z.string().default('Career Explorer'),
    current_context: z.string().default(''),
    education: z.string().default(''),
    experience: z.string().default(''),
    interests: z.array(z.string()).default([]),
    skills_possessed: z.array(z.string()).default([]),
    skills_to_develop: z.array(z.string()).default([]),
    ambitions: z.array(z.string()).default([]),
    practical_boundaries: z.object({
      learning_hours_per_week: z.string().default('5–15 hrs/week'),
      budget: z.string().default('Free to Low'),
      immediate_income_needed: z.boolean().default(false),
      location_preference: z.string().default('Flexible / Remote'),
      risk_tolerance: z.string().default('Moderate'),
    }).default({
      learning_hours_per_week: '5–15 hrs/week',
      budget: 'Free to Low',
      immediate_income_needed: false,
      location_preference: 'Flexible / Remote',
      risk_tolerance: 'Moderate',
    }),
  }).default({
    user_name: 'Explorer',
    life_stage: 'Career Explorer',
    current_context: '',
    education: '',
    experience: '',
    interests: [],
    skills_possessed: [],
    skills_to_develop: [],
    ambitions: [],
    practical_boundaries: {
      learning_hours_per_week: '5–15 hrs/week',
      budget: 'Free to Low',
      immediate_income_needed: false,
      location_preference: 'Flexible / Remote',
      risk_tolerance: 'Moderate',
    },
  }),

  exploration_summary: z.object({
    key_discoveries: z.array(z.string()).default([]),
    summary: z.string().default(''),
    high_level_insight: z.string().default(''),
  }),

  possibilities: z.array(PossibilityItemSchema).min(3, 'At least 3 diverse possibilities must be explored'),

  shortlisted_options: z.array(z.string()).default([]),

  recommended_experiments: z.array(PossibilityExperimentSchema).default([]),

  next_steps: z.array(PossibilityActionStepSchema).default([]),

  open_questions: z.array(z.string()).default([]),

  suggested_review_date: z.string().default(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  }),
});

export type PossibilityHandoff = z.infer<typeof PossibilityHandoffSchema>;

// User Questionnaire Answers State
export interface PossibilityQuestionnaireData {
  lifeStage: LifeStageKey | '';
  lifeStageOther: string;
  
  // Section B: Background
  educationLevel: string;
  degreeOrCourse: string;
  fieldOfStudy: string;
  currentRole: string;
  industry: string;
  yearsExperience: string;
  certificationsOrAchievements: string;
  
  // Section C: Interests
  interests: string[];
  interestsOther: string;
  curiosityFreeText: string;
  
  // Section D: Skills
  skillsPossessed: string[];
  skillsToDevelop: string[];
  customSkillsPossessed: string;
  customSkillsToDevelop: string;
  
  // Section E: Ambitions
  ambitions: string[];
  visionThreeToFiveYears: string;
  
  // Section F: Practical Boundaries
  timeAvailableWeekly: string;
  budgetPreference: string;
  needImmediateIncome: boolean;
  workEnvironment: string;
  willingnessToRelocate: string;
  riskTolerance: string;
  familyResponsibilities: string;
  
  // Optional Final Free Text
  additionalNotes: string;
}

export interface PossibilityExplorationRecord {
  id: string;
  user_id?: string;
  session_id?: string;
  current_stage: number;
  questionnaire_data: PossibilityQuestionnaireData;
  generated_prompt?: string;
  final_report?: PossibilityHandoff | null;
  raw_handoff_text?: string;
  status: string;
  created_at: string;
  updated_at: string;
}
