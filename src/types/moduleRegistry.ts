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
    enabledByDefault: false,
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
    enabledByDefault: false,
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

export type DashboardThemeId = 'green' | 'blue' | 'black' | 'red' | 'purple' | 'neutral';

export interface DashboardThemeDefinition {
  id: DashboardThemeId;
  name: string;
  badgeColor: string;
  primaryColor: string; // Tailwind hex
  primaryHover: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  pillBg: string;
  sidebarActiveBg: string;
  sidebarActiveText: string;
}

export const DASHBOARD_THEMES: Record<DashboardThemeId, DashboardThemeDefinition> = {
  green: {
    id: 'green',
    name: 'FOYC Forest Green',
    badgeColor: '#526B50',
    primaryColor: '#171717',
    primaryHover: '#2A3B29',
    accentBg: '#EDF2E9',
    accentBorder: '#A8B99A',
    accentText: '#526B50',
    pillBg: '#FFE76B',
    sidebarActiveBg: '#171717',
    sidebarActiveText: '#FFFFFF',
  },
  blue: {
    id: 'blue',
    name: 'Executive Blue',
    badgeColor: '#2563EB',
    primaryColor: '#1E3A8A',
    primaryHover: '#172554',
    accentBg: '#EFF6FF',
    accentBorder: '#BFDBFE',
    accentText: '#1D4ED8',
    pillBg: '#93C5FD',
    sidebarActiveBg: '#1E3A8A',
    sidebarActiveText: '#FFFFFF',
  },
  black: {
    id: 'black',
    name: 'Obsidian Minimal',
    badgeColor: '#171717',
    primaryColor: '#000000',
    primaryHover: '#262626',
    accentBg: '#F5F5F5',
    accentBorder: '#D4D4D4',
    accentText: '#171717',
    pillBg: '#E5E5E5',
    sidebarActiveBg: '#000000',
    sidebarActiveText: '#FFFFFF',
  },
  red: {
    id: 'red',
    name: 'Crimson Accent',
    badgeColor: '#DC2626',
    primaryColor: '#991B1B',
    primaryHover: '#7F1D1D',
    accentBg: '#FEF2F2',
    accentBorder: '#FECACA',
    accentText: '#B91C1C',
    pillBg: '#FCA5A5',
    sidebarActiveBg: '#991B1B',
    sidebarActiveText: '#FFFFFF',
  },
  purple: {
    id: 'purple',
    name: 'Creative Violet',
    badgeColor: '#7C3AED',
    primaryColor: '#5B21B6',
    primaryHover: '#4C1D95',
    accentBg: '#F5F3FF',
    accentBorder: '#DDD6FE',
    accentText: '#6D28D9',
    pillBg: '#C4B5FD',
    sidebarActiveBg: '#5B21B6',
    sidebarActiveText: '#FFFFFF',
  },
  neutral: {
    id: 'neutral',
    name: 'Warm Stone',
    badgeColor: '#78716C',
    primaryColor: '#292524',
    primaryHover: '#1C1917',
    accentBg: '#F5F5F4',
    accentBorder: '#D6D3D1',
    accentText: '#44403C',
    pillBg: '#E7E5E4',
    sidebarActiveBg: '#292524',
    sidebarActiveText: '#FFFFFF',
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
    'weekly_review',
  ],
  dashboard_widgets: ['goal_summary', 'focus_timer', 'today_priorities', 'habit_streak', 'weekly_analytics'],
  theme: 'green',
};
