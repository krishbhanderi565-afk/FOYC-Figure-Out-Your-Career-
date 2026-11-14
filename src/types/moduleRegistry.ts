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
    name: 'Fresh Green (Default)',
    badgeColor: '#22C55E',
    primaryColor: '#166534',
    primaryHover: '#14532D',
    bgGradient: 'linear-gradient(135deg, #e8f9e7 0%, #c8f5c6 25%, #eafce6 60%, #baf2bb 100%)',
    bgCanvas: '#d2f7cf',
    sidebarBg: 'rgba(255, 255, 255, 0.72)',
    sidebarBorder: 'rgba(255, 255, 255, 0.85)',
    sidebarActiveBg: '#bdf5bc',
    sidebarActiveText: '#133e19',
    cardBg: 'rgba(255, 255, 255, 0.88)',
    cardBorder: 'rgba(255, 255, 255, 0.95)',
    accentBg: '#e1f9df',
    accentBorder: '#86efac',
    accentText: '#15803d',
    pillBg: '#bcf5bb',
    textPrimary: '#111827',
    textSecondary: '#4b5563',
    chartLine1: '#10B981',
    chartLine2: '#3B82F6',
    chartLine3: '#8B5CF6',
  },
  blue: {
    id: 'blue',
    name: 'Executive Blue',
    badgeColor: '#3B82F6',
    primaryColor: '#1D4ED8',
    primaryHover: '#1E40AF',
    bgGradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 30%, #f0fdf4 65%, #bfdbfe 100%)',
    bgCanvas: '#dbeafe',
    sidebarBg: 'rgba(255, 255, 255, 0.75)',
    sidebarBorder: 'rgba(255, 255, 255, 0.85)',
    sidebarActiveBg: '#bfdbfe',
    sidebarActiveText: '#1e3a8a',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(255, 255, 255, 0.95)',
    accentBg: '#eff6ff',
    accentBorder: '#93c5fd',
    accentText: '#1d4ed8',
    pillBg: '#bfdbfe',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    chartLine1: '#2563EB',
    chartLine2: '#06B6D4',
    chartLine3: '#6366F1',
  },
  red: {
    id: 'red',
    name: 'Crimson Accent',
    badgeColor: '#EF4444',
    primaryColor: '#B91C1C',
    primaryHover: '#991B1B',
    bgGradient: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 30%, #fff7ed 65%, #fecaca 100%)',
    bgCanvas: '#fee2e2',
    sidebarBg: 'rgba(255, 255, 255, 0.75)',
    sidebarBorder: 'rgba(255, 255, 255, 0.85)',
    sidebarActiveBg: '#fecaca',
    sidebarActiveText: '#7f1d1d',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(255, 255, 255, 0.95)',
    accentBg: '#fef2f2',
    accentBorder: '#fca5a5',
    accentText: '#b91c1c',
    pillBg: '#fecaca',
    textPrimary: '#1c1917',
    textSecondary: '#57534e',
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
    bgGradient: 'linear-gradient(135deg, #090d0b 0%, #111a14 35%, #0d1310 70%, #152219 100%)',
    bgCanvas: '#0f1712',
    sidebarBg: 'rgba(18, 25, 20, 0.85)',
    sidebarBorder: 'rgba(255, 255, 255, 0.1)',
    sidebarActiveBg: 'rgba(34, 197, 94, 0.2)',
    sidebarActiveText: '#86efac',
    cardBg: 'rgba(20, 30, 24, 0.85)',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    accentBg: 'rgba(34, 197, 94, 0.15)',
    accentBorder: 'rgba(34, 197, 94, 0.3)',
    accentText: '#4ade80',
    pillBg: 'rgba(34, 197, 94, 0.25)',
    textPrimary: '#f9fafb',
    textSecondary: '#9ca3af',
    chartLine1: '#10B981',
    chartLine2: '#38BDF8',
    chartLine3: '#A78BFA',
  },
  white: {
    id: 'white',
    name: 'Minimal White',
    badgeColor: '#64748B',
    primaryColor: '#0F172A',
    primaryHover: '#334155',
    bgGradient: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 40%, #f1f5f9 100%)',
    bgCanvas: '#f8fafc',
    sidebarBg: 'rgba(255, 255, 255, 0.9)',
    sidebarBorder: '#e2e8f0',
    sidebarActiveBg: '#e2e8f0',
    sidebarActiveText: '#0f172a',
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    accentBg: '#f1f5f9',
    accentBorder: '#cbd5e1',
    accentText: '#334155',
    pillBg: '#e2e8f0',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    chartLine1: '#0F172A',
    chartLine2: '#3B82F6',
    chartLine3: '#10B981',
  },
  purple: {
    id: 'purple',
    name: 'Creative Violet',
    badgeColor: '#8B5CF6',
    primaryColor: '#6D28D9',
    primaryHover: '#5B21B6',
    bgGradient: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 30%, #fdf2f8 65%, #e9d5ff 100%)',
    bgCanvas: '#f3e8ff',
    sidebarBg: 'rgba(255, 255, 255, 0.75)',
    sidebarBorder: 'rgba(255, 255, 255, 0.85)',
    sidebarActiveBg: '#e9d5ff',
    sidebarActiveText: '#4c1d95',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(255, 255, 255, 0.95)',
    accentBg: '#faf5ff',
    accentBorder: '#d8b4fe',
    accentText: '#6d28d9',
    pillBg: '#e9d5ff',
    textPrimary: '#1e1b4b',
    textSecondary: '#4c1d95',
    chartLine1: '#8B5CF6',
    chartLine2: '#EC4899',
    chartLine3: '#3B82F6',
  },
  sunset: {
    id: 'sunset',
    name: 'Warm Sunset',
    badgeColor: '#F97316',
    primaryColor: '#C2410C',
    primaryHover: '#9A3412',
    bgGradient: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 30%, #fdf4ff 65%, #fed7aa 100%)',
    bgCanvas: '#ffedd5',
    sidebarBg: 'rgba(255, 255, 255, 0.75)',
    sidebarBorder: 'rgba(255, 255, 255, 0.85)',
    sidebarActiveBg: '#fed7aa',
    sidebarActiveText: '#7c2d12',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(255, 255, 255, 0.95)',
    accentBg: '#fff7ed',
    accentBorder: '#fdba74',
    accentText: '#c2410c',
    pillBg: '#fed7aa',
    textPrimary: '#27272a',
    textSecondary: '#52525b',
    chartLine1: '#F97316',
    chartLine2: '#E11D48',
    chartLine3: '#F59E0B',
  },
  neutral: {
    id: 'neutral',
    name: 'Warm Sunset (Neutral)',
    badgeColor: '#F97316',
    primaryColor: '#C2410C',
    primaryHover: '#9A3412',
    bgGradient: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 30%, #fdf4ff 65%, #fed7aa 100%)',
    bgCanvas: '#ffedd5',
    sidebarBg: 'rgba(255, 255, 255, 0.75)',
    sidebarBorder: 'rgba(255, 255, 255, 0.85)',
    sidebarActiveBg: '#fed7aa',
    sidebarActiveText: '#7c2d12',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(255, 255, 255, 0.95)',
    accentBg: '#fff7ed',
    accentBorder: '#fdba74',
    accentText: '#c2410c',
    pillBg: '#fed7aa',
    textPrimary: '#27272a',
    textSecondary: '#52525b',
    chartLine1: '#F97316',
    chartLine2: '#E11D48',
    chartLine3: '#F59E0B',
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
