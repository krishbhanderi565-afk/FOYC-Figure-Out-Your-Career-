import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  UserProfile,
  UserReflection,
  CareerDashboardData,
  TaskItem,
  HabitItem,
  Milestone,
} from '../types/career';
import { parseHandoffText } from '../utils/handoffParser';
import { SAMPLE_HANDOFFS } from '../utils/sampleHandoffs';
import {
  DashboardConfiguration,
  DashboardThemeId,
  DEFAULT_DASHBOARD_CONFIG,
  DASHBOARD_THEMES,
} from '../types/moduleRegistry';
import {
  localStorageService,
  FoycLocalData,
  DEFAULT_LOCAL_PROFILE,
  DEFAULT_LOCAL_REFLECTION,
  DEFAULT_LOCAL_DASHBOARD_DATA,
} from '../services/localStorageService';

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
  updateTask: (taskId: string, updates: Partial<TaskItem>) => Promise<void>;
  deleteTask: (taskId: string) => void;
  addHabit: (habit: HabitInput) => Promise<HabitItem>;
  updateHabit: (habitId: string, updates: Partial<HabitItem>) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  toggleHabit: (habitId: string, dateStr?: string) => Promise<void>;
  toggleMilestone: (milestoneId: string) => void;
  addMilestone: (milestone: Omit<Milestone, 'id'>) => Promise<Milestone>;
  updateMilestone: (milestoneId: string, updates: Partial<Milestone>) => Promise<void>;
  deleteMilestone: (milestoneId: string) => Promise<void>;

  // Local-First Identity & Storage Controls
  isAuthenticated: boolean; // Always true — zero login wall
  userEmail: string | null;
  userName: string;
  userAvatar: string | null;
  userId: string;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  loginDemo: (email?: string) => void;
  logoutDemo: () => void;
  resetToDefault: () => void;

  // Local Data Backup & Restore
  exportLocalBackup: () => string;
  importLocalBackup: (backup: any, mode?: 'replace' | 'merge') => boolean;
  clearLocalData: () => void;

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

// Sample fallback for instant demo exploration
const sampleDemoParsed = parseHandoffText(SAMPLE_HANDOFFS[0].rawText, DEFAULT_LOCAL_PROFILE, DEFAULT_LOCAL_REFLECTION).data as CareerDashboardData;

export function applyThemeVariables(themeId: DashboardThemeId) {
  const theme = DASHBOARD_THEMES[themeId] || DASHBOARD_THEMES.green;
  const root = document.documentElement;

  root.style.setProperty('--theme-name', theme.name);
  root.style.setProperty('--theme-bg', theme.bgCanvas);
  root.style.setProperty('--theme-sidebar-bg', theme.sidebarBg);
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

  // Backward-compatible variables
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
  // Load unified storage on mount
  const initialStore = useMemo(() => localStorageService.load(), []);

  const [profile, setProfile] = useState<UserProfile>(initialStore.profile);
  const [reflection, setReflection] = useState<UserReflection>(initialStore.reflection);
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfiguration>(initialStore.dashboard.configuration);
  const [hasGeneratedDashboard, setHasGeneratedDashboard] = useState<boolean>(initialStore.dashboard.hasGenerated);
  const [currentTheme, setCurrentThemeState] = useState<DashboardThemeId>(initialStore.preferences.theme || 'green');

  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem('foyc_demo_mode') === 'true';
  });

  const [dashboardData, setDashboardData] = useState<CareerDashboardData>(() => {
    if (localStorage.getItem('foyc_demo_mode') === 'true') {
      return sampleDemoParsed;
    }
    return initialStore.dashboard.data;
  });

  const [activeProfessionId, setActiveProfessionId] = useState<string>('software-engineer');
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  // Apply initial theme variables
  useEffect(() => {
    applyThemeVariables(currentTheme);
  }, [currentTheme]);

  // Dynamic user display name from local profile
  const userName = profile.preferredName?.trim() || 'Explorer';
  const userEmail = null;
  const userAvatar = null;
  const userId = 'local-user';
  const isAuthenticated = true; // Always unlocked for seamless instant access

  // User journey state derivation
  const userState: DashboardUserState = useMemo(() => {
    if (hasGeneratedDashboard || dashboardData?.direction?.primaryTitle) {
      return 'dashboard_generated';
    }
    if (reflection.mindText || (reflection.questionnaireAnswers && Object.keys(reflection.questionnaireAnswers).length > 0)) {
      return 'exploration_completed';
    }
    return 'new_user';
  }, [hasGeneratedDashboard, dashboardData, reflection]);

  // Profile & Reflection updates
  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...data };
      localStorageService.updateProfile(next);
      return next;
    });
  };

  const updateReflection = (data: Partial<UserReflection>) => {
    setReflection((prev) => {
      const next = { ...prev, ...data };
      localStorageService.updateReflection(next);
      return next;
    });
  };

  const updateDashboardConfig = async (updates: Partial<DashboardConfiguration>) => {
    setDashboardConfig((prev) => {
      const next = { ...prev, ...updates, updated_at: new Date().toISOString() };
      localStorageService.updateDashboard(undefined, next);
      if (updates.theme) {
        applyThemeVariables(updates.theme);
        setCurrentThemeState(updates.theme);
      }
      return next;
    });
  };

  const setTheme = (theme: DashboardThemeId) => {
    applyThemeVariables(theme);
    setCurrentThemeState(theme);
    localStorageService.updatePreferences({ theme });
  };

  // Demo Mode Switchers
  const enterDemoMode = () => {
    setIsDemoMode(true);
    localStorage.setItem('foyc_demo_mode', 'true');
    setDashboardData(sampleDemoParsed);
  };

  const exitDemoMode = () => {
    setIsDemoMode(false);
    localStorage.removeItem('foyc_demo_mode');
    const stored = localStorageService.load();
    setDashboardData(stored.dashboard.data);
  };

  // Apply Structured Handoff
  const applyHandoffText = (text: string) => {
    const res = parseHandoffText(text, profile, reflection);
    if (res.success && res.data) {
      const parsed = res.data as CareerDashboardData;
      setDashboardData(parsed);
      setHasGeneratedDashboard(true);
      setIsDemoMode(false);
      localStorage.removeItem('foyc_demo_mode');

      const newConfig = parsed.dashboard_configuration || dashboardConfig;
      if (parsed.dashboard_configuration) {
        setDashboardConfig(parsed.dashboard_configuration);
        if (parsed.dashboard_configuration.theme) {
          applyThemeVariables(parsed.dashboard_configuration.theme);
          setCurrentThemeState(parsed.dashboard_configuration.theme);
        }
      }

      // Persist centrally in unified local store
      localStorageService.updateDashboard(parsed, newConfig, true);
      localStorageService.recordActivity('Generated Personalized Dashboard', parsed.direction?.primaryTitle);

      return { success: true, errors: [] };
    }
    return { success: false, errors: res.errors };
  };

  const loadSampleProfession = (professionId: string) => {
    const sample = SAMPLE_HANDOFFS.find((s) => s.id === professionId);
    if (sample) {
      const res = parseHandoffText(sample.rawText, profile, reflection);
      if (res.success && res.data) {
        const parsed = res.data as CareerDashboardData;
        setDashboardData(parsed);
        setActiveProfessionId(professionId);
        localStorageService.updateDashboard(parsed, undefined, true);
      }
    }
  };

  // Task / Checklist Operations
  const toggleTask = (taskId: string) => {
    setDashboardData((prev) => {
      const nextTasks = prev.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
      const nextData = { ...prev, tasks: nextTasks };
      if (!isDemoMode) {
        localStorageService.updateDashboard(nextData);
      }
      return nextData;
    });
  };

  const addTask = (taskInput: Omit<TaskItem, 'id'>) => {
    const newTask: TaskItem = {
      ...taskInput,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setDashboardData((prev) => {
      const nextTasks = [newTask, ...prev.tasks];
      const nextData = { ...prev, tasks: nextTasks };
      if (!isDemoMode) {
        localStorageService.updateDashboard(nextData);
      }
      return nextData;
    });
  };

  const updateTask = async (taskId: string, updates: Partial<TaskItem>) => {
    setDashboardData((prev) => {
      const nextTasks = prev.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
      const nextData = { ...prev, tasks: nextTasks };
      if (!isDemoMode) {
        localStorageService.updateDashboard(nextData);
      }
      return nextData;
    });
  };

  const deleteTask = (taskId: string) => {
    setDashboardData((prev) => {
      const nextTasks = prev.tasks.filter((t) => t.id !== taskId);
      const nextData = { ...prev, tasks: nextTasks };
      if (!isDemoMode) {
        localStorageService.updateDashboard(nextData);
      }
      return nextData;
    });
  };

  // Milestone / Goal Operations
  const addMilestone = async (milestoneInput: Omit<Milestone, 'id'>): Promise<Milestone> => {
    const newMs: Milestone = {
      ...milestoneInput,
      id: `ms-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setDashboardData((prev) => {
      const nextMs = [...prev.milestones, newMs];
      const nextData = { ...prev, milestones: nextMs };
      if (!isDemoMode) {
        localStorageService.updateDashboard(nextData);
      }
      return nextData;
    });
    return newMs;
  };

  const updateMilestone = async (milestoneId: string, updates: Partial<Milestone>) => {
    setDashboardData((prev) => {
      const nextMs = prev.milestones.map((m) => (m.id === milestoneId ? { ...m, ...updates } : m));
      const nextData = { ...prev, milestones: nextMs };
      if (!isDemoMode) {
        localStorageService.updateDashboard(nextData);
      }
      return nextData;
    });
  };

  const deleteMilestone = async (milestoneId: string) => {
    setDashboardData((prev) => {
      const nextMs = prev.milestones.filter((m) => m.id !== milestoneId);
      const nextTasks = prev.tasks.filter((t) => t.milestoneId !== milestoneId);
      const nextData = { ...prev, milestones: nextMs, tasks: nextTasks };
      if (!isDemoMode) {
        localStorageService.updateDashboard(nextData);
      }
      return nextData;
    });
  };

  const toggleMilestone = (milestoneId: string) => {
    setDashboardData((prev) => {
      const nextMs = prev.milestones.map((m) => (m.id === milestoneId ? { ...m, completed: !m.completed } : m));
      const nextData = { ...prev, milestones: nextMs };
      if (!isDemoMode) {
        localStorageService.updateDashboard(nextData);
      }
      return nextData;
    });
  };

  // Habit Operations
  const addHabit = async (habitInput: HabitInput): Promise<HabitItem> => {
    const newHabit: HabitItem = {
      id: `h-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: habitInput.title.trim(),
      frequency: habitInput.frequency || 'daily',
      targetDaysPerWeek: habitInput.targetDaysPerWeek || 7,
      currentStreak: 0,
      bestStreak: 0,
      completedToday: false,
      history: {},
      category: habitInput.category || 'Skill',
      schedule: habitInput.schedule || 'everyday',
      color: habitInput.color || '#10B981',
    };

    setDashboardData((prev) => {
      const nextHabits = [newHabit, ...prev.habits];
      const nextData = { ...prev, habits: nextHabits };
      if (!isDemoMode) {
        localStorageService.updateDashboard(nextData);
      }
      return nextData;
    });

    return newHabit;
  };

  const updateHabit = async (habitId: string, updates: Partial<HabitItem>): Promise<void> => {
    setDashboardData((prev) => {
      const nextHabits = prev.habits.map((h) => (h.id === habitId ? { ...h, ...updates } : h));
      const nextData = { ...prev, habits: nextHabits };
      if (!isDemoMode) {
        localStorageService.updateDashboard(nextData);
      }
      return nextData;
    });
  };

  const deleteHabit = async (habitId: string): Promise<void> => {
    setDashboardData((prev) => {
      const nextHabits = prev.habits.filter((h) => h.id !== habitId);
      const nextData = { ...prev, habits: nextHabits };
      if (!isDemoMode) {
        localStorageService.updateDashboard(nextData);
      }
      return nextData;
    });
  };

  const toggleHabit = async (habitId: string, dateStr?: string): Promise<void> => {
    const today = dateStr || new Date().toISOString().split('T')[0];
    const isToday = today === new Date().toISOString().split('T')[0];

    setDashboardData((prev) => {
      const nextHabits = (prev.habits || []).map((h) => {
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
      });
      const nextData = { ...prev, habits: nextHabits };
      if (!isDemoMode) {
        localStorageService.updateDashboard(nextData);
      }
      return nextData;
    });
  };

  // Local Backup and Restore Controls
  const exportLocalBackup = (): string => {
    return localStorageService.exportBackup();
  };

  const importLocalBackup = (backupData: any, mode: 'replace' | 'merge' = 'replace'): boolean => {
    const success = localStorageService.importBackup(backupData, mode);
    if (success) {
      const reloaded = localStorageService.load();
      setProfile(reloaded.profile);
      setReflection(reloaded.reflection);
      setDashboardConfig(reloaded.dashboard.configuration);
      setDashboardData(reloaded.dashboard.data);
      setCurrentThemeState(reloaded.preferences.theme);
      setHasGeneratedDashboard(reloaded.dashboard.hasGenerated);
      applyThemeVariables(reloaded.preferences.theme);
    }
    return success;
  };

  const clearLocalData = () => {
    localStorageService.clearAllData();
    const fresh = localStorageService.load();
    setProfile(fresh.profile);
    setReflection(fresh.reflection);
    setDashboardConfig(fresh.dashboard.configuration);
    setDashboardData(fresh.dashboard.data);
    setCurrentThemeState(fresh.preferences.theme);
    setHasGeneratedDashboard(false);
    applyThemeVariables(fresh.preferences.theme);
  };

  const resetToDefault = () => {
    clearLocalData();
  };

  // Safe mock auth functions for backwards compatibility
  const signUp = async () => ({ success: true });
  const signIn = async () => ({ success: true });
  const signOut = async () => {};
  const signInWithGoogle = async () => ({ success: true });
  const resetPassword = async () => ({ success: true });
  const loginDemo = () => {};
  const logoutDemo = () => {};
  const syncFromCloud = async () => {};

  const contextValue: CareerContextType = {
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
    updateTask,
    deleteTask,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    toggleMilestone,
    addMilestone,
    updateMilestone,
    deleteMilestone,
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
    exportLocalBackup,
    importLocalBackup,
    clearLocalData,
    dashboardConfig,
    updateDashboardConfig,
    currentTheme,
    setTheme,
    isDemoMode,
    enterDemoMode,
    exitDemoMode,
    hasGeneratedDashboard,
    userState,
  };

  return <CareerContext.Provider value={contextValue}>{children}</CareerContext.Provider>;
};

export const useCareer = () => {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareer must be used within a CareerProvider');
  }
  return context;
};
