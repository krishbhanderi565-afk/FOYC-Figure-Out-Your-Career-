import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  UserProfile,
  UserReflection,
  CareerDashboardData,
  TaskItem,
  HabitItem,
  Milestone
} from '../types/career';
import { parseHandoffText } from '../utils/handoffParser';
import { SAMPLE_HANDOFFS } from '../utils/sampleHandoffs';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { api } from '../services/api';
import {
  DashboardConfiguration,
  DashboardThemeId,
  DEFAULT_DASHBOARD_CONFIG,
  DASHBOARD_THEMES,
} from '../types/moduleRegistry';

export interface HabitInput {
  title: string;
  frequency?: 'daily' | 'weekly' | 'custom';
  targetDaysPerWeek?: number;
  category?: string;
  schedule?: 'weekday' | 'weekend' | 'everyday';
  unit?: string | null;
  target?: number | null;
  color?: string;
}

export type DashboardUserState = 'new_user' | 'exploration_completed' | 'dashboard_generated';

export interface CareerContextType {
  profile: UserProfile;
  reflection: UserReflection;
  dashboardData: CareerDashboardData;
  activeProfessionId: string;
  isDataLoading: boolean;
  syncFromCloud: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => void;
  updateReflection: (data: Partial<UserReflection>) => void;
  applyHandoffText: (text: string) => { success: boolean; errors: string[] };
  loadSampleProfession: (professionId: string) => void;
  toggleTask: (taskId: string) => void;
  addTask: (task: Omit<TaskItem, 'id'>) => void;
  deleteTask: (taskId: string) => void;
  addHabit: (habit: HabitInput) => Promise<HabitItem>;
  updateHabit: (habitId: string, updates: Partial<HabitItem>) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  toggleHabit: (habitId: string, dateStr?: string) => Promise<void>;
  toggleMilestone: (milestoneId: string) => void;
  isAuthenticated: boolean;
  userEmail: string | null;
  userName: string | null;
  userAvatar: string | null;
  userId: string | null;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  loginDemo: (email?: string) => void;
  logoutDemo: () => void;
  resetToDefault: () => void;
  // Adaptive Dashboard & Theme Engine
  dashboardConfig: DashboardConfiguration;
  updateDashboardConfig: (updates: Partial<DashboardConfiguration>) => Promise<void>;
  currentTheme: DashboardThemeId;
  setTheme: (theme: DashboardThemeId) => void;
  isDemoMode: boolean;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
  hasGeneratedDashboard: boolean;
  userState: DashboardUserState;
}

const DEFAULT_PROFILE: UserProfile = {
  preferredName: '',
  ageRange: '18-22',
  country: 'Global',
  educationStatus: 'college-student',
  currentField: 'Undecided / Exploring',
  careerStage: 'exploring',
  workExperience: '',
  preferredLanguage: 'English',
  availableHoursPerWeek: 15,
};

const DEFAULT_REFLECTION: UserReflection = {
  mindText: '',
  keyInterests: [],
  keyStruggles: [],
};

const DEFAULT_DIRECTION = {
  primaryTitle: '',
  summary: '',
  matchReason: '',
  longTermGoal: '',
  shortTermObjective: '',
  alternativeTitles: [],
  strengths: [],
  existingSkills: [],
  skillGaps: [],
  reassessmentQuestions: [],
  assumptions: [],
  lastReassessedDate: '',
};

export const EMPTY_DASHBOARD_DATA: CareerDashboardData = {
  profile: DEFAULT_PROFILE,
  reflection: DEFAULT_REFLECTION,
  direction: DEFAULT_DIRECTION,
  primaryCareer: {
    title: '',
    field: '',
    overview: '',
    whyFit: '',
    estimatedTimelineMonths: 6,
    requiredSkills: [],
  },
  milestones: [],
  tasks: [],
  habits: [],
  projects: [],
  resources: [],
};

// First sample handoff data used strictly for DEMO MODE
const sampleDemoParsed = parseHandoffText(
  SAMPLE_HANDOFFS[0].rawText,
  DEFAULT_PROFILE,
  DEFAULT_REFLECTION
).data as CareerDashboardData;

export function applyThemeVariables(themeId: DashboardThemeId) {
  const theme = DASHBOARD_THEMES[themeId] || DASHBOARD_THEMES.green;
  const root = document.documentElement;

  // Modern Reference Theme Tokens
  root.style.setProperty('--theme-bg-gradient', theme.bgGradient);
  root.style.setProperty('--theme-bg-canvas', theme.bgCanvas);
  root.style.setProperty('--theme-sidebar-bg', theme.sidebarBg);
  root.style.setProperty('--theme-sidebar-border', theme.sidebarBorder);
  root.style.setProperty('--theme-sidebar-active-bg', theme.sidebarActiveBg);
  root.style.setProperty('--theme-sidebar-active-text', theme.sidebarActiveText);
  root.style.setProperty('--theme-card-bg', theme.cardBg);
  root.style.setProperty('--theme-card-border', theme.cardBorder);
  root.style.setProperty('--theme-primary', theme.primaryColor);
  root.style.setProperty('--theme-primary-hover', theme.primaryHover);
  root.style.setProperty('--theme-badge', theme.badgeColor);
  root.style.setProperty('--theme-accent-bg', theme.accentBg);
  root.style.setProperty('--theme-accent-border', theme.accentBorder);
  root.style.setProperty('--theme-accent-text', theme.accentText);
  root.style.setProperty('--theme-pill-bg', theme.pillBg);
  root.style.setProperty('--theme-text-primary', theme.textPrimary);
  root.style.setProperty('--theme-text-secondary', theme.textSecondary);
  root.style.setProperty('--theme-chart-1', theme.chartLine1);
  root.style.setProperty('--theme-chart-2', theme.chartLine2);
  root.style.setProperty('--theme-chart-3', theme.chartLine3);

  // Backward-compatible legacy variables
  root.style.setProperty('--foyc-theme-primary', theme.primaryColor);
  root.style.setProperty('--foyc-theme-primary-hover', theme.primaryHover);
  root.style.setProperty('--foyc-theme-badge', theme.badgeColor);
  root.style.setProperty('--foyc-theme-accent-bg', theme.accentBg);
  root.style.setProperty('--foyc-theme-accent-border', theme.accentBorder);
  root.style.setProperty('--foyc-theme-accent-text', theme.accentText);
  root.style.setProperty('--foyc-theme-pill-bg', theme.pillBg);
  root.style.setProperty('--foyc-theme-sidebar-active-bg', theme.sidebarActiveBg);
  root.style.setProperty('--foyc-theme-sidebar-active-text', theme.sidebarActiveText);

  if (themeId === 'black') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

const CareerContext = createContext<CareerContextType | undefined>(undefined);

export const CareerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('foyc_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [reflection, setReflection] = useState<UserReflection>(() => {
    try {
      const saved = localStorage.getItem('foyc_reflection');
      return saved ? JSON.parse(saved) : DEFAULT_REFLECTION;
    } catch {
      return DEFAULT_REFLECTION;
    }
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem('foyc_demo_mode') === 'true';
  });

  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfiguration>(() => {
    try {
      const saved = localStorage.getItem('foyc_dashboard_config');
      return saved ? JSON.parse(saved) : DEFAULT_DASHBOARD_CONFIG;
    } catch {
      return DEFAULT_DASHBOARD_CONFIG;
    }
  });

  const [dashboardData, setDashboardData] = useState<CareerDashboardData>(() => {
    if (localStorage.getItem('foyc_demo_mode') === 'true') {
      return sampleDemoParsed;
    }
    try {
      const hasGenerated = localStorage.getItem('foyc_dashboard_generated') === 'true';
      const saved = localStorage.getItem('foyc_dashboard_data');
      if (saved && hasGenerated) {
        const parsed = JSON.parse(saved);
        if (parsed?.habits && Array.isArray(parsed.habits)) {
          parsed.habits = parsed.habits.map((h: any) => ({
            ...h,
            history: h.history || {},
            currentStreak: typeof h.currentStreak === 'number' ? h.currentStreak : 0,
            bestStreak: typeof h.bestStreak === 'number' ? h.bestStreak : 0,
          }));
        }
        return parsed;
      }
      return EMPTY_DASHBOARD_DATA;
    } catch {
      return EMPTY_DASHBOARD_DATA;
    }
  });

  const [activeProfessionId, setActiveProfessionId] = useState<string>(() => {
    return localStorage.getItem('foyc_active_profession') || 'software-engineer';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('foyc_auth') === 'true';
  });

  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('foyc_user_email') || null;
  });

  const [userName, setUserName] = useState<string | null>(() => {
    return localStorage.getItem('foyc_user_name') || null;
  });

  const [userAvatar, setUserAvatar] = useState<string | null>(() => {
    return localStorage.getItem('foyc_user_avatar') || null;
  });

  const [userId, setUserId] = useState<string | null>(() => {
    return localStorage.getItem('foyc_user_id') || null;
  });

  const [isDataLoading, setIsDataLoading] = useState(false);

  // Apply theme whenever dashboardConfig.theme changes
  useEffect(() => {
    if (dashboardConfig?.theme) {
      applyThemeVariables(dashboardConfig.theme);
    }
  }, [dashboardConfig?.theme]);

  // Derive whether real dashboard has been generated
  const hasGeneratedDashboard = useMemo(() => {
    if (isDemoMode) return true;
    const title = dashboardData?.direction?.primaryTitle || dashboardData?.primaryCareer?.title;
    return Boolean(
      title &&
      title.trim().length > 0 &&
      localStorage.getItem('foyc_dashboard_generated') === 'true'
    );
  }, [dashboardData, isDemoMode]);

  // User lifecycle state: State A ('new_user'), State B ('exploration_completed'), State C ('dashboard_generated')
  const userState: DashboardUserState = useMemo(() => {
    if (isDemoMode || hasGeneratedDashboard) {
      return 'dashboard_generated';
    }
    const hasReflection = Boolean(
      (reflection?.mindText && reflection.mindText.trim().length > 15) ||
      (profile?.currentField && profile.currentField !== 'Undecided / Exploring')
    );
    if (hasReflection) {
      return 'exploration_completed';
    }
    return 'new_user';
  }, [isDemoMode, hasGeneratedDashboard, reflection, profile]);

  // Cross-device synchronization function: Cloud is the permanent source of truth
  const syncFromCloud = useCallback(async () => {
    try {
      setIsDataLoading(true);
      const [profileRes, dashRes, configRes] = await Promise.all([
        api.getProfile(),
        api.getDashboardData(),
        api.getDashboardConfig(),
      ]);

      if (profileRes?.profile) {
        setProfile((prev) => ({
          ...prev,
          preferredName: profileRes.profile.fullName || profileRes.profile.preferredName || prev.preferredName,
          country: profileRes.profile.country || prev.country,
          educationStatus: (profileRes.profile.education || profileRes.profile.educationStatus || prev.educationStatus) as any,
          currentField: profileRes.profile.profession || prev.currentField,
          careerStage: (profileRes.profile.careerStage || prev.careerStage) as any,
        }));
        if (profileRes.profile.fullName) {
          setUserName(profileRes.profile.fullName);
          localStorage.setItem('foyc_user_name', profileRes.profile.fullName);
        }
      }

      const activeTitle = dashboardData?.direction?.primaryTitle || dashboardData?.primaryCareer?.title;
      if (localStorage.getItem('foyc_pending_draft_transfer') === 'true' && activeTitle) {
        localStorage.removeItem('foyc_pending_draft_transfer');
        await api.transferPlanToAccount(dashboardData);
      }

      const cloudTitle = dashRes?.data?.direction?.primaryTitle || dashRes?.data?.primaryCareer?.title;
      if (dashRes?.success && dashRes.data && cloudTitle) {
        setDashboardData(dashRes.data);
        localStorage.setItem('foyc_dashboard_generated', 'true');
        localStorage.setItem('foyc_dashboard_data', JSON.stringify(dashRes.data));
      }

      if (configRes?.success && configRes.config) {
        setDashboardConfig(configRes.config);
        localStorage.setItem('foyc_dashboard_config', JSON.stringify(configRes.config));
        if (configRes.config.theme) {
          applyThemeVariables(configRes.config.theme);
        }
      }
    } catch {
    } finally {
      setIsDataLoading(false);
    }
  }, [dashboardData]);

  // Check Supabase session on mount
  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setIsAuthenticated(true);
          setUserEmail(session.user.email || null);
          setUserId(session.user.id);
          const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0];
          setUserName(name || null);
          const avatar = session.user.user_metadata?.avatar_url || null;
          setUserAvatar(avatar);
          if (avatar) localStorage.setItem('foyc_user_avatar', avatar);
          localStorage.setItem('foyc_auth', 'true');
          if (session.user.email) localStorage.setItem('foyc_user_email', session.user.email);
          if (name) localStorage.setItem('foyc_user_name', name);
          if (session.access_token) localStorage.setItem('foyc_auth_token', session.access_token);
          syncFromCloud();
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setIsAuthenticated(true);
          setUserEmail(session.user.email || null);
          setUserId(session.user.id);
          const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0];
          setUserName(name || null);
          const avatar = session.user.user_metadata?.avatar_url || null;
          setUserAvatar(avatar);
          if (avatar) localStorage.setItem('foyc_user_avatar', avatar);
          localStorage.setItem('foyc_auth', 'true');
          if (session.user.email) localStorage.setItem('foyc_user_email', session.user.email);
          if (name) localStorage.setItem('foyc_user_name', name);
          if (session.access_token) localStorage.setItem('foyc_auth_token', session.access_token);
          syncFromCloud();
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else if (isAuthenticated) {
      syncFromCloud();
    }
  }, [isAuthenticated, syncFromCloud]);

  useEffect(() => {
    localStorage.setItem('foyc_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('foyc_reflection', JSON.stringify(reflection));
  }, [reflection]);

  useEffect(() => {
    const hasData = dashboardData?.direction?.primaryTitle || dashboardData?.primaryCareer?.title;
    if (!isDemoMode && hasData) {
      localStorage.setItem('foyc_dashboard_data', JSON.stringify(dashboardData));
    }
  }, [dashboardData, isDemoMode]);

  useEffect(() => {
    localStorage.setItem('foyc_active_profession', activeProfessionId);
  }, [activeProfessionId]);

  useEffect(() => {
    localStorage.setItem('foyc_dashboard_config', JSON.stringify(dashboardConfig));
  }, [dashboardConfig]);

  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }));
    api.updateProfile(data).catch(() => {});
  };

  const updateReflection = (data: Partial<UserReflection>) => {
    setReflection((prev) => ({ ...prev, ...data }));
  };

  const updateDashboardConfig = async (updates: Partial<DashboardConfiguration>) => {
    setDashboardConfig((prev) => {
      const next = { ...prev, ...updates, updated_at: new Date().toISOString() };
      localStorage.setItem('foyc_dashboard_config', JSON.stringify(next));
      if (updates.theme) {
        applyThemeVariables(updates.theme);
      }
      return next;
    });

    if (isAuthenticated && !isDemoMode) {
      try {
        await api.saveDashboardConfig(updates);
      } catch {}
    }
  };

  const setTheme = (theme: DashboardThemeId) => {
    updateDashboardConfig({ theme });
  };

  const enterDemoMode = () => {
    setIsDemoMode(true);
    localStorage.setItem('foyc_demo_mode', 'true');
    setDashboardData(sampleDemoParsed);
  };

  const exitDemoMode = () => {
    setIsDemoMode(false);
    localStorage.removeItem('foyc_demo_mode');
    const hasGenerated = localStorage.getItem('foyc_dashboard_generated') === 'true';
    const saved = localStorage.getItem('foyc_dashboard_data');
    if (hasGenerated && saved) {
      try {
        setDashboardData(JSON.parse(saved));
      } catch {
        setDashboardData(EMPTY_DASHBOARD_DATA);
      }
    } else {
      setDashboardData(EMPTY_DASHBOARD_DATA);
    }
  };

  const applyHandoffText = (text: string) => {
    const res = parseHandoffText(text, profile, reflection);
    if (res.success && res.data) {
      const parsed = res.data as CareerDashboardData;
      setDashboardData(parsed);
      localStorage.setItem('foyc_dashboard_generated', 'true');
      localStorage.setItem('foyc_dashboard_data', JSON.stringify(parsed));
      setIsDemoMode(false);
      localStorage.removeItem('foyc_demo_mode');

      // If handoff included custom dashboard_configuration, apply it
      if (parsed.dashboard_configuration) {
        setDashboardConfig(parsed.dashboard_configuration);
        localStorage.setItem('foyc_dashboard_config', JSON.stringify(parsed.dashboard_configuration));
        if (parsed.dashboard_configuration.theme) {
          applyThemeVariables(parsed.dashboard_configuration.theme);
        }
        if (isAuthenticated) {
          api.saveDashboardConfig(parsed.dashboard_configuration).catch(() => {});
        }
      }

      if (isAuthenticated) {
        api.transferPlanToAccount(parsed).catch(() => {});
      }
      return { success: true, errors: [] };
    }
    return { success: false, errors: res.errors };
  };

  const loadSampleProfession = (professionId: string) => {
    const sample = SAMPLE_HANDOFFS.find((s) => s.id === professionId);
    if (sample) {
      const res = parseHandoffText(sample.rawText, profile, reflection);
      if (res.success && res.data) {
        setDashboardData(res.data as CareerDashboardData);
        setActiveProfessionId(professionId);
      }
    }
  };

  const toggleTask = async (taskId: string) => {
    let nextStatus = false;
    setDashboardData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => {
        if (t.id === taskId) {
          nextStatus = !t.completed;
          return { ...t, completed: nextStatus };
        }
        return t;
      }),
    }));
    if (!isDemoMode) {
      try {
        await api.updateTask(taskId, { completed: nextStatus });
      } catch {}
    }
  };

  const addTask = async (taskInput: Omit<TaskItem, 'id'>) => {
    const tempId = `t-${Date.now()}`;
    const newTask: TaskItem = {
      ...taskInput,
      id: tempId,
    };
    setDashboardData((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
    if (!isDemoMode) {
      try {
        const res = await api.createTask(taskInput);
        if (res?.task?.id) {
          setDashboardData((prev) => ({
            ...prev,
            tasks: prev.tasks.map((t) => (t.id === tempId ? { ...t, id: res.task.id } : t)),
          }));
        }
      } catch {}
    }
  };

  const deleteTask = async (taskId: string) => {
    setDashboardData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
    if (!isDemoMode) {
      try {
        await api.deleteTask(taskId);
      } catch {}
    }
  };

  // Habit Management: Add, Update, Delete, Toggle
  const addHabit = async (habitInput: HabitInput): Promise<HabitItem> => {
    const newId = `h-${Date.now()}`;
    const newHabit: HabitItem = {
      id: newId,
      title: habitInput.title.trim(),
      frequency: habitInput.frequency || 'daily',
      targetDaysPerWeek: habitInput.targetDaysPerWeek || 5,
      currentStreak: 0,
      bestStreak: 0,
      completedToday: false,
      history: {},
      category: habitInput.category || 'Skill',
      schedule: habitInput.schedule || (habitInput.frequency === 'weekly' ? 'weekend' : 'everyday'),
      unit: habitInput.unit || null,
      target: habitInput.target || null,
      color: habitInput.color || '#526B50',
    };

    setDashboardData((prev) => ({
      ...prev,
      habits: [...prev.habits, newHabit],
    }));

    if (!isDemoMode) {
      try {
        await api.createHabit({
          title: newHabit.title,
          frequency: newHabit.frequency,
          targetDaysPerWeek: newHabit.targetDaysPerWeek,
          category: newHabit.category,
        });
      } catch {}
    }

    return newHabit;
  };

  const updateHabit = async (habitId: string, updates: Partial<HabitItem>): Promise<void> => {
    setDashboardData((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => (h.id === habitId ? { ...h, ...updates } : h)),
    }));

    if (!isDemoMode) {
      try {
        await api.updateHabit(habitId, updates);
      } catch {}
    }
  };

  const deleteHabit = async (habitId: string): Promise<void> => {
    setDashboardData((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== habitId),
    }));

    if (!isDemoMode) {
      try {
        await api.deleteHabit(habitId);
      } catch {}
    }
  };

  const toggleHabit = async (habitId: string, dateStr?: string): Promise<void> => {
    const today = dateStr || new Date().toISOString().split('T')[0];
    const isToday = today === new Date().toISOString().split('T')[0];

    setDashboardData((prev) => ({
      ...prev,
      habits: (prev.habits || []).map((h) => {
        if (h.id === habitId) {
          const hist = h.history || {};
          const wasCompleted = !!hist[today];
          const newStatus = !wasCompleted;
          const newHistory = { ...hist, [today]: newStatus };
          const curStreak = typeof h.currentStreak === 'number' ? h.currentStreak : 0;
          const bestStreak = typeof h.bestStreak === 'number' ? h.bestStreak : 0;
          const newStreak = newStatus ? curStreak + 1 : Math.max(0, curStreak - 1);
          return {
            ...h,
            completedToday: isToday ? newStatus : (h.completedToday ?? false),
            currentStreak: newStreak,
            bestStreak: Math.max(bestStreak, newStreak),
            history: newHistory,
          };
        }
        return h;
      }),
    }));

    if (!isDemoMode) {
      try {
        await api.toggleHabit(habitId, today);
      } catch {}
    }
  };

  const toggleMilestone = async (milestoneId: string) => {
    setDashboardData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      ),
    }));
    if (!isDemoMode) {
      try {
        await api.toggleMilestone(milestoneId);
      } catch {}
    }
  };

  // Auth Functions
  const signUp = async (email: string, password: string, fullName?: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName || email.split('@')[0] },
          },
        });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          setIsAuthenticated(true);
          setUserEmail(data.user.email || email);
          setUserId(data.user.id);
          const name = fullName || data.user.user_metadata?.full_name || email.split('@')[0];
          setUserName(name);
          localStorage.setItem('foyc_auth', 'true');
          localStorage.setItem('foyc_user_email', email);
          if (name) localStorage.setItem('foyc_user_name', name);
          if (data.session?.access_token) {
            localStorage.setItem('foyc_auth_token', data.session.access_token);
          }
          await syncFromCloud();
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Signup failed' };
      }
    }

    // Local / Dev fallback
    setIsAuthenticated(true);
    setUserEmail(email);
    setUserName(fullName || email.split('@')[0]);
    setUserId(`user-${Date.now()}`);
    localStorage.setItem('foyc_auth', 'true');
    localStorage.setItem('foyc_user_email', email);
    if (fullName) localStorage.setItem('foyc_user_name', fullName);
    await syncFromCloud();
    return { success: true };
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          setIsAuthenticated(true);
          setUserEmail(data.user.email || email);
          setUserId(data.user.id);
          const name = data.user.user_metadata?.full_name || email.split('@')[0];
          setUserName(name);
          const avatar = data.user.user_metadata?.avatar_url || null;
          setUserAvatar(avatar);
          if (avatar) localStorage.setItem('foyc_user_avatar', avatar);
          localStorage.setItem('foyc_auth', 'true');
          localStorage.setItem('foyc_user_email', email);
          localStorage.setItem('foyc_user_name', name);
          if (data.session?.access_token) {
            localStorage.setItem('foyc_auth_token', data.session.access_token);
          }
          await syncFromCloud();
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Login failed' };
      }
    }

    // Local / Dev fallback
    setIsAuthenticated(true);
    setUserEmail(email);
    const name = email.split('@')[0];
    setUserName(name);
    setUserId(`user-${Date.now()}`);
    localStorage.setItem('foyc_auth', 'true');
    localStorage.setItem('foyc_user_email', email);
    localStorage.setItem('foyc_user_name', name);
    await syncFromCloud();
    return { success: true };
  };

  const signOut = async (): Promise<void> => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserName(null);
    setUserAvatar(null);
    setUserId(null);
    setIsDemoMode(false);
    localStorage.removeItem('foyc_auth');
    localStorage.removeItem('foyc_user_email');
    localStorage.removeItem('foyc_user_name');
    localStorage.removeItem('foyc_user_avatar');
    localStorage.removeItem('foyc_auth_token');
    localStorage.removeItem('foyc_user_id');
    localStorage.removeItem('foyc_dashboard_data');
    localStorage.removeItem('foyc_dashboard_generated');
    localStorage.removeItem('foyc_demo_mode');
    setDashboardData(EMPTY_DASHBOARD_DATA);
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin + '/dashboard',
          },
        });
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Google authentication failed' };
      }
    }
    return {
      success: false,
      error: 'Google OAuth provider is not yet enabled in Supabase. Please sign in with email and password.',
    };
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/auth',
        });
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Reset password request failed' };
      }
    }
    return { success: true };
  };

  const loginDemo = (email = 'alex.chen@example.com') => {
    setIsAuthenticated(true);
    setUserEmail(email);
    setUserName('Alex Chen');
    enterDemoMode();
    localStorage.setItem('foyc_auth', 'true');
    localStorage.setItem('foyc_user_email', email);
    localStorage.setItem('foyc_user_name', 'Alex Chen');
  };

  const logoutDemo = () => {
    exitDemoMode();
    signOut();
  };

  const resetToDefault = () => {
    setProfile(DEFAULT_PROFILE);
    setReflection(DEFAULT_REFLECTION);
    setDashboardData(EMPTY_DASHBOARD_DATA);
    localStorage.removeItem('foyc_dashboard_generated');
    localStorage.removeItem('foyc_dashboard_data');
  };

  return (
    <CareerContext.Provider
      value={{
        profile,
        reflection,
        dashboardData,
        activeProfessionId,
        isDataLoading,
        syncFromCloud,
        updateProfile,
        updateReflection,
        applyHandoffText,
        loadSampleProfession,
        toggleTask,
        addTask,
        deleteTask,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabit,
        toggleMilestone,
        isAuthenticated,
        userEmail,
        userName,
        userAvatar,
        userId,
        signUp,
        signIn,
        signOut,
        signInWithGoogle,
        resetPassword,
        loginDemo,
        logoutDemo,
        resetToDefault,
        dashboardConfig,
        updateDashboardConfig,
        currentTheme: dashboardConfig.theme || 'green',
        setTheme,
        isDemoMode,
        enterDemoMode,
        exitDemoMode,
        hasGeneratedDashboard,
        userState,
      }}
    >
      {children}
    </CareerContext.Provider>
  );
};

export const useCareer = () => {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareer must be used within a CareerProvider');
  }
  return context;
};
