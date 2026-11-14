export type AgeRange = 'under-18' | '18-22' | '23-27' | '28-35' | '36+';

export type EducationStatus =
  | 'high-school'
  | 'college-student'
  | 'recent-graduate'
  | 'working-professional'
  | 'career-switcher'
  | 'self-taught'
  | 'freelancer'
  | 'other';

export type CareerStage =
  | 'exploring'
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'pivoting';

export interface UserProfile {
  preferredName?: string;
  ageRange?: AgeRange;
  country?: string;
  educationStatus?: EducationStatus;
  currentField?: string;
  careerStage?: CareerStage;
  workExperience?: string;
  preferredLanguage?: string;
  availableHoursPerWeek?: number;
}

export interface UserReflection {
  mindText: string;
  questionnaireAnswers?: Record<number, string>;
  keyInterests?: string[];
  keyStruggles?: string[];
  dreamVision?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  stage: 'Foundation' | 'Skill Development' | 'Practical Application' | 'Professional Readiness' | 'Career Growth';
  estimatedDuration: string;
  startDate?: string;
  targetDate: string;
  completed: boolean;
  associatedTasksCount: number;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  category: 'Foundation' | 'Technical' | 'Portfolio' | 'Networking' | 'Job Prep';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  completed: boolean;
  notes?: string;
}

export interface HabitItem {
  id: string;
  title: string;
  frequency: 'daily' | 'weekly' | 'custom';
  targetDaysPerWeek: number;
  currentStreak: number;
  bestStreak: number;
  completedToday: boolean;
  history: { [dateStr: string]: boolean };
  category: string;
  unit?: string | null;
  target?: number | null;
  schedule?: 'weekday' | 'weekend' | 'everyday';
  color?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  skillsDeveloped: string[];
  status: 'planned' | 'in-progress' | 'completed';
  startDate?: string;
  targetDate: string;
  projectUrl?: string;
  achievements?: string[];
}

export interface ResourceItem {
  id: string;
  title: string;
  type: 'Documentation' | 'Course' | 'Book' | 'Video' | 'Practice' | 'Certification';
  provider: string;
  url: string;
  isVerified: boolean;
  isFree: boolean;
  estimatedHours?: number;
}

export interface CareerDirection {
  primaryTitle: string;
  summary: string;
  matchReason: string;
  longTermGoal: string;
  shortTermObjective: string;
  alternativeTitles: string[];
  strengths: string[];
  existingSkills: string[];
  skillGaps: string[];
  reassessmentQuestions: string[];
  assumptions: string[];
  lastReassessedDate: string;
}

export interface CareerDashboardData {
  profile: UserProfile;
  reflection: UserReflection;
  direction: CareerDirection;
  milestones: Milestone[];
  tasks: TaskItem[];
  habits: HabitItem[];
  projects: ProjectItem[];
  resources: ResourceItem[];
  primaryCareer?: any;
  dashboard_configuration?: any;
}
