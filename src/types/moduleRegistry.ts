import {
  Compass,
  Target,
  ListTodo,
  Milestone as MilestoneIcon,
  BookOpen,
  FolderGit2,
  CalendarCheck,
  RotateCcw,
  Library,
  GitCompare,
  Timer,
  LucideIcon,
} from 'lucide-react';

export type ModuleCategory = 'personal' | 'career' | 'execution' | 'reflection';

export interface DashboardModuleDefinition {
  id: string;
  name: string;
  shortDescription: string;
  category: ModuleCategory;
  iconName: string;
  icon: LucideIcon;
  route?: string;
  enabledByDefault: boolean;
  configurable: boolean;
  implemented: boolean;
  suitableArchetypes: string[]; // e.g. ['student', 'professional', 'entrepreneur', 'homemaker', 'freelancer', 'retired']
}

export const DASHBOARD_MODULE_REGISTRY: Record<string, DashboardModuleDefinition> = {
  personal_vision: {
    id: 'personal_vision',
    name: 'Personal Vision & Direction',
    shortDescription: 'Core ambition, North Star statement, and strategic decision criteria.',
    category: 'personal',
    iconName: 'Compass',
    icon: Compass,
    route: '/dashboard/career',
    enabledByDefault: true,
    configurable: true,
    implemented: true,
    suitableArchetypes: ['all', 'student', 'professional', 'entrepreneur', 'homemaker', 'freelancer', 'retired'],
  },
  personal_goals: {
    id: 'personal_goals',
    name: 'Goals & Targets',
    shortDescription: 'Short-term and long-term milestones with defined time horizons.',
    category: 'personal',
    iconName: 'Target',
    icon: Target,
    route: '/dashboard/career',
    enabledByDefault: true,
    configurable: true,
    implemented: true,
    suitableArchetypes: ['all', 'student', 'professional', 'entrepreneur', 'homemaker', 'freelancer', 'retired'],
  },
  career_roadmap: {
    id: 'career_roadmap',
    name: 'Interactive Roadmap',
    shortDescription: 'Floating milestone blocks and progression trajectory.',
    category: 'career',
    iconName: 'Milestone',
    icon: MilestoneIcon,
    route: '/dashboard/roadmap',
    enabledByDefault: true,
    configurable: true,
    implemented: true,
    suitableArchetypes: ['student', 'professional', 'entrepreneur', 'career_switcher'],
  },
  skills_learning: {
    id: 'skills_learning',
    name: 'Skills & Learning Plan',
    shortDescription: 'Competencies to develop, practice projects, and mastery tracking.',
    category: 'career',
    iconName: 'BookOpen',
    icon: BookOpen,
    route: '/dashboard/skills',
    enabledByDefault: true,
    configurable: true,
    implemented: true,
    suitableArchetypes: ['student', 'professional', 'freelancer', 'career_switcher'],
  },
  daily_priorities: {
    id: 'daily_priorities',
    name: 'Checklist & Tasks',
    shortDescription: 'Actionable weekly and daily tasks organized by priority and stage.',
    category: 'execution',
    iconName: 'ListTodo',
    icon: ListTodo,
    route: '/dashboard/tasks',
    enabledByDefault: true,
    configurable: true,
    implemented: true,
    suitableArchetypes: ['all', 'student', 'professional', 'entrepreneur', 'homemaker', 'freelancer'],
  },
  habit_tracker: {
    id: 'habit_tracker',
    name: 'Habit Tracker',
    shortDescription: 'Daily consistency routines, streak logs, and weekly check-ins.',
    category: 'execution',
    iconName: 'CalendarCheck',
    icon: CalendarCheck,
    route: '/dashboard/habits',
    enabledByDefault: true,
    configurable: true,
    implemented: true,
    suitableArchetypes: ['all', 'student', 'professional', 'entrepreneur', 'homemaker', 'freelancer', 'retired'],
  },
  projects: {
    id: 'projects',
    name: 'Projects & Proof of Work',
    shortDescription: 'Real capstone projects, client deliverables, and portfolio proof.',
    category: 'execution',
    iconName: 'FolderGit2',
    icon: FolderGit2,
    route: '/dashboard/projects',
    enabledByDefault: true,
    configurable: true,
    implemented: true,
    suitableArchetypes: ['student', 'professional', 'freelancer', 'entrepreneur'],
  },
  focus_timer: {
    id: 'focus_timer',
    name: 'Deep Work Focus Timer',
    shortDescription: 'Dedicated focus block tracker with structured study/work sprints.',
    category: 'execution',
    iconName: 'Timer',
    icon: Timer,
    route: '/dashboard',
    enabledByDefault: true,
    configurable: true,
    implemented: true,
    suitableArchetypes: ['student', 'professional', 'freelancer', 'entrepreneur'],
  },
  weekly_review: {
    id: 'weekly_review',
    name: 'Weekly Review & Reflection',
    shortDescription: 'Structured weekly wins, blocker analysis, and commitment check.',
    category: 'reflection',
    iconName: 'RotateCcw',
    icon: RotateCcw,
    route: '/dashboard/review',
    enabledByDefault: true,
    configurable: true,
    implemented: true,
    suitableArchetypes: ['all', 'student', 'professional', 'entrepreneur', 'homemaker', 'freelancer', 'retired'],
  },
  resources: {
    id: 'resources',
    name: 'Learning Resources & Tools',
    shortDescription: 'Curated books, documentation, courses, and recommended software.',
    category: 'career',
    iconName: 'Library',
    icon: Library,
    route: '/dashboard/resources',
    enabledByDefault: true,
    configurable: true,
    implemented: true,
    suitableArchetypes: ['student', 'professional', 'freelancer', 'career_switcher'],
  },
  career_comparison: {
    id: 'career_comparison',
    name: 'Career Path Comparison',
    shortDescription: 'Side-by-side trade-offs, break-even periods, and AI resilience tests.',
    category: 'career',
    iconName: 'GitCompare',
    icon: GitCompare,
    route: '/career-comparison',
    enabledByDefault: false,
    configurable: true,
    implemented: true,
    suitableArchetypes: ['student', 'career_switcher', 'professional'],
  },
};

export type DashboardThemeId = 'green' | 'blue' | 'red' | 'black' | 'white' | 'purple' | 'sunset' | 'neutral';

export interface DashboardThemeDefinition {
  id: DashboardThemeId;
  name: string;
  badgeColor: string;
  primaryColor: string;
  primaryHover: string;
  bgGradient: string;
  bgCanvas: string;
  sidebarBg: string;
  sidebarBorder: string;
  sidebarActiveBg: string;
  sidebarActiveText: string;
  cardBg: string;
  cardBorder: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  pillBg: string;
  textPrimary: string;
  textSecondary: string;
  chartLine1: string;
  chartLine2: string;
  chartLine3: string;
}

export const DASHBOARD_THEMES: Record<DashboardThemeId, DashboardThemeDefinition> = {
  green: {
    id: 'green',
    name: 'Fresh Emerald (Default)',
    badgeColor: '#10B981',
    primaryColor: '#10B981',
    primaryHover: '#059669',
    bgGradient: 'linear-gradient(135deg, #FAF8F5 0%, #F5F2EB 100%)',
    bgCanvas: '#F8F6F0',
    sidebarBg: '#FFFFFF',
    sidebarBorder: '#EBE8DF',
    sidebarActiveBg: '#10B981',
    sidebarActiveText: '#FFFFFF',
    cardBg: '#FFFFFF',
    cardBorder: '#EFECE6',
    accentBg: '#ECFDF5',
    accentBorder: '#A7F3D0',
    accentText: '#047857',
    pillBg: '#10B981',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    chartLine1: '#10B981',
    chartLine2: '#3B82F6',
    chartLine3: '#8B5CF6',
  },
  blue: {
    id: 'blue',
    name: 'Executive Blue',
    badgeColor: '#3B82F6',
    primaryColor: '#2563EB',
    primaryHover: '#1D4ED8',
    bgGradient: 'linear-gradient(135deg, #FAF8F5 0%, #F0F4FA 100%)',
    bgCanvas: '#F5F7FA',
    sidebarBg: '#FFFFFF',
    sidebarBorder: '#E2E8F0',
    sidebarActiveBg: '#2563EB',
    sidebarActiveText: '#FFFFFF',
    cardBg: '#FFFFFF',
    cardBorder: '#EFECE6',
    accentBg: '#EFF6FF',
    accentBorder: '#BFDBFE',
    accentText: '#1D4ED8',
    pillBg: '#2563EB',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    chartLine1: '#2563EB',
    chartLine2: '#06B6D4',
    chartLine3: '#6366F1',
  },
  red: {
    id: 'red',
    name: 'Crimson Accent',
    badgeColor: '#EF4444',
    primaryColor: '#DC2626',
    primaryHover: '#B91C1C',
    bgGradient: 'linear-gradient(135deg, #FAF8F5 0%, #FAF0F0 100%)',
    bgCanvas: '#FAF5F5',
    sidebarBg: '#FFFFFF',
    sidebarBorder: '#F1E4E4',
    sidebarActiveBg: '#DC2626',
    sidebarActiveText: '#FFFFFF',
    cardBg: '#FFFFFF',
    cardBorder: '#EFECE6',
    accentBg: '#FEF2F2',
    accentBorder: '#FECACA',
    accentText: '#B91C1C',
    pillBg: '#DC2626',
    textPrimary: '#1C1917',
    textSecondary: '#78716C',
    chartLine1: '#DC2626',
    chartLine2: '#F97316',
    chartLine3: '#EC4899',
  },
  black: {
    id: 'black',
    name: 'Obsidian Minimal',
    badgeColor: '#10B981',
    primaryColor: '#10B981',
    primaryHover: '#059669',
    bgGradient: 'linear-gradient(135deg, #090D0B 0%, #111A14 35%, #0D1310 70%, #152219 100%)',
    bgCanvas: '#0F1712',
    sidebarBg: 'rgba(18, 25, 20, 0.95)',
    sidebarBorder: 'rgba(255, 255, 255, 0.1)',
    sidebarActiveBg: '#10B981',
    sidebarActiveText: '#FFFFFF',
    cardBg: 'rgba(20, 30, 24, 0.92)',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    accentBg: 'rgba(34, 197, 94, 0.15)',
    accentBorder: 'rgba(34, 197, 94, 0.3)',
    accentText: '#4ADE80',
    pillBg: '#10B981',
    textPrimary: '#F9FAFB',
    textSecondary: '#9CA3AF',
    chartLine1: '#10B981',
    chartLine2: '#38BDF8',
    chartLine3: '#A78BFA',
  },
  white: {
    id: 'white',
    name: 'Minimal Clean',
    badgeColor: '#64748B',
    primaryColor: '#0F172A',
    primaryHover: '#334155',
    bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #FAF8F5 100%)',
    bgCanvas: '#F8F7F4',
    sidebarBg: '#FFFFFF',
    sidebarBorder: '#E2E8F0',
    sidebarActiveBg: '#0F172A',
    sidebarActiveText: '#FFFFFF',
    cardBg: '#FFFFFF',
    cardBorder: '#E2E8F0',
    accentBg: '#F1F5F9',
    accentBorder: '#CBD5E1',
    accentText: '#334155',
    pillBg: '#0F172A',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    chartLine1: '#0F172A',
    chartLine2: '#3B82F6',
    chartLine3: '#10B981',
  },
  purple: {
    id: 'purple',
    name: 'Creative Violet',
    badgeColor: '#8B5CF6',
    primaryColor: '#6366F1',
    primaryHover: '#4F46E5',
    bgGradient: 'linear-gradient(135deg, #FAF8F5 0%, #F5F0FA 100%)',
    bgCanvas: '#F7F5FB',
    sidebarBg: '#FFFFFF',
    sidebarBorder: '#ECE7F6',
    sidebarActiveBg: '#6366F1',
    sidebarActiveText: '#FFFFFF',
    cardBg: '#FFFFFF',
    cardBorder: '#EFECE6',
    accentBg: '#F5F3FF',
    accentBorder: '#DDD6FE',
    accentText: '#6D28D9',
    pillBg: '#6366F1',
    textPrimary: '#1E1B4B',
    textSecondary: '#6B7280',
    chartLine1: '#8B5CF6',
    chartLine2: '#EC4899',
    chartLine3: '#3B82F6',
  },
  sunset: {
    id: 'sunset',
    name: 'Warm Sunset',
    badgeColor: '#F97316',
    primaryColor: '#F97316',
    primaryHover: '#EA580C',
    bgGradient: 'linear-gradient(135deg, #FAF8F5 0%, #FDF4E9 100%)',
    bgCanvas: '#FAF6F0',
    sidebarBg: '#FFFFFF',
    sidebarBorder: '#F0E8DC',
    sidebarActiveBg: '#F97316',
    sidebarActiveText: '#FFFFFF',
    cardBg: '#FFFFFF',
    cardBorder: '#EFECE6',
    accentBg: '#FFF7ED',
    accentBorder: '#FED7AA',
    accentText: '#C2410C',
    pillBg: '#F97316',
    textPrimary: '#27272A',
    textSecondary: '#71717A',
    chartLine1: '#F97316',
    chartLine2: '#E11D48',
    chartLine3: '#F59E0B',
  },
  neutral: {
    id: 'neutral',
    name: 'Warm Neutral',
    badgeColor: '#78716C',
    primaryColor: '#44403C',
    primaryHover: '#292524',
    bgGradient: 'linear-gradient(135deg, #FAF8F5 0%, #F5F2EB 100%)',
    bgCanvas: '#F8F6F0',
    sidebarBg: '#FFFFFF',
    sidebarBorder: '#E7E5E4',
    sidebarActiveBg: '#44403C',
    sidebarActiveText: '#FFFFFF',
    cardBg: '#FFFFFF',
    cardBorder: '#EFECE6',
    accentBg: '#F5F5F4',
    accentBorder: '#D6D3D1',
    accentText: '#44403C',
    pillBg: '#44403C',
    textPrimary: '#1C1917',
    textSecondary: '#78716C',
    chartLine1: '#44403C',
    chartLine2: '#78716C',
    chartLine3: '#A8A29E',
  },
};

export type DashboardType =
  | 'career_transition'
  | 'student'
  | 'homemaker'
  | 'entrepreneur'
  | 'working_professional'
  | 'freelancer'
  | 'personal_development'
  | 'custom';

export interface DashboardConfiguration {
  schema_version: '2.0';
  dashboard_title: string;
  dashboard_description: string;
  dashboard_type: DashboardType;
  primary_purpose: string;
  selected_modules: string[];
  required_modules: string[];
  optional_modules: string[];
  excluded_modules: string[];
  module_reasons: Record<string, string>;
  module_order: string[];
  dashboard_widgets: string[];
  theme: DashboardThemeId;
  updated_at?: string;
}

export const DEFAULT_DASHBOARD_CONFIG: DashboardConfiguration = {
  schema_version: '2.0',
  dashboard_title: 'Personal Career Workspace',
  dashboard_description: 'An adaptive workspace configured around your goals, daily routines, and progression.',
  dashboard_type: 'custom',
  primary_purpose: 'Clarity, milestone execution, and daily habit consistency.',
  selected_modules: [
    'personal_vision',
    'personal_goals',
    'career_roadmap',
    'daily_priorities',
    'habit_tracker',
    'focus_timer',
    'skills_learning',
    'projects',
    'resources',
    'weekly_review',
  ],
  required_modules: ['personal_vision', 'personal_goals', 'daily_priorities'],
  optional_modules: ['projects', 'resources', 'career_comparison'],
  excluded_modules: [],
  module_reasons: {
    personal_vision: 'Core anchor to clarify strategic direction and avoid confusion.',
    personal_goals: 'Translates high-level vision into concrete 3-month and 12-month outcomes.',
    daily_priorities: 'Breaks large ambitions down into bite-sized actionable tasks.',
    habit_tracker: 'Ensures daily execution consistency through continuous streak tracking.',
  },
  module_order: [
    'personal_vision',
    'personal_goals',
    'career_roadmap',
    'daily_priorities',
    'habit_tracker',
    'focus_timer',
    'skills_learning',
    'projects',
    'resources',
    'weekly_review',
  ],
  dashboard_widgets: ['goal_summary', 'focus_timer', 'today_priorities', 'habit_streak', 'weekly_analytics'],
  theme: 'green',
};
