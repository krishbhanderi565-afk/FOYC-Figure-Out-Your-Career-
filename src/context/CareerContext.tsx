import React, { createContext, useContext, useState, useEffect } from 'react';
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

interface CareerContextType {
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
  userId: string | null;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  loginDemo: (email?: string) => void;
  logoutDemo: () => void;
  resetToDefault: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  preferredName: 'Alex',
  ageRange: '18-22',
  country: 'Global',
  educationStatus: 'college-student',
  currentField: 'Computer Science & Technology',
  careerStage: 'exploring',
  workExperience: 'Personal coding projects and coursework',
  preferredLanguage: 'English',
  availableHoursPerWeek: 15,
};

const DEFAULT_REFLECTION: UserReflection = {
  mindText:
    "I'm currently studying computer science and trying to figure out where to focus. Everyone around me says AI is going to replace standard coding, and I feel overwhelmed by having too many directions (full stack, AI, cloud, design). I enjoy building real things and solving logical puzzles, but I don't know what career direction gives me both job safety and creative fulfillment.",
  keyInterests: ['Full-stack web', 'AI tools', 'Building products', 'Clean UI'],
  keyStruggles: ['Information overload', 'Imposter syndrome', 'Unsure what to build next'],
};

// Initialize with first sample handoff data
const initialParsed = parseHandoffText(
  SAMPLE_HANDOFFS[0].rawText,
  DEFAULT_PROFILE,
  DEFAULT_REFLECTION
).data as CareerDashboardData;

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

  const [dashboardData, setDashboardData] = useState<CareerDashboardData>(() => {
    try {
      const saved = localStorage.getItem('foyc_dashboard_data');
      if (saved) {
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
      return initialParsed;
    } catch {
      return initialParsed;
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

  const [userId, setUserId] = useState<string | null>(() => {
    return localStorage.getItem('foyc_user_id') || null;
  });

  const [isDataLoading, setIsDataLoading] = useState(false);

  // Cross-device synchronization function: Cloud is the permanent source of truth
  const syncFromCloud = async () => {
    try {
      setIsDataLoading(true);
      const [profileRes, dashRes] = await Promise.all([
        api.getProfile(),
        api.getDashboardData(),
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
      }

      if (localStorage.getItem('foyc_pending_draft_transfer') === 'true') {
        localStorage.removeItem('foyc_pending_draft_transfer');
        await api.transferPlanToAccount(dashboardData);
      }

      if (dashRes?.success && dashRes.data) {
        setDashboardData(dashRes.data);
      }
    } catch {
    } finally {
      setIsDataLoading(false);
    }
  };

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
          localStorage.setItem('foyc_auth', 'true');
          if (session.user.email) localStorage.setItem('foyc_user_email', session.user.email);
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
          localStorage.setItem('foyc_auth', 'true');
          if (session.user.email) localStorage.setItem('foyc_user_email', session.user.email);
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
  }, []);

  useEffect(() => {
    localStorage.setItem('foyc_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('foyc_reflection', JSON.stringify(reflection));
  }, [reflection]);

  useEffect(() => {
    localStorage.setItem('foyc_dashboard_data', JSON.stringify(dashboardData));
  }, [dashboardData]);

  useEffect(() => {
    localStorage.setItem('foyc_active_profession', activeProfessionId);
  }, [activeProfessionId]);

  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }));
    api.updateProfile(data).catch(() => {});
  };

  const updateReflection = (data: Partial<UserReflection>) => {
    setReflection((prev) => ({ ...prev, ...data }));
  };

  const applyHandoffText = (text: string) => {
    const res = parseHandoffText(text, profile, reflection);
    if (res.success && res.data) {
      const parsed = res.data as CareerDashboardData;
      setDashboardData(parsed);
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
    try {
      await api.updateTask(taskId, { completed: nextStatus });
    } catch {}
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
    try {
      const res = await api.createTask(taskInput);
      if (res?.task?.id) {
        setDashboardData((prev) => ({
          ...prev,
          tasks: prev.tasks.map((t) => (t.id === tempId ? { ...t, id: res.task.id } : t)),
        }));
      }
    } catch {}
  };

  const deleteTask = async (taskId: string) => {
    setDashboardData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
    try {
      await api.deleteTask(taskId);
    } catch {}
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

    // Sync with backend / Supabase
    try {
      await api.createHabit({
        title: newHabit.title,
        frequency: newHabit.frequency,
        targetDaysPerWeek: newHabit.targetDaysPerWeek,
        category: newHabit.category,
      });
    } catch {}

    return newHabit;
  };

  const updateHabit = async (habitId: string, updates: Partial<HabitItem>): Promise<void> => {
    setDashboardData((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => (h.id === habitId ? { ...h, ...updates } : h)),
    }));

    try {
      await api.updateHabit(habitId, updates);
    } catch {}
  };

  const deleteHabit = async (habitId: string): Promise<void> => {
    setDashboardData((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== habitId),
    }));

    try {
      await api.deleteHabit(habitId);
    } catch {}
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

    try {
      await api.toggleHabit(habitId, today);
    } catch {}
  };

  const toggleMilestone = async (milestoneId: string) => {
    setDashboardData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      ),
    }));
    try {
      await api.toggleMilestone(milestoneId);
    } catch {}
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
          setUserName(fullName || email.split('@')[0]);
          localStorage.setItem('foyc_auth', 'true');
          localStorage.setItem('foyc_user_email', email);
          if (fullName) localStorage.setItem('foyc_user_name', fullName);
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
    setUserId(null);
    localStorage.removeItem('foyc_auth');
    localStorage.removeItem('foyc_user_email');
    localStorage.removeItem('foyc_user_name');
    localStorage.removeItem('foyc_auth_token');
    localStorage.removeItem('foyc_user_id');
    localStorage.removeItem('foyc_dashboard_data');
    setDashboardData(initialParsed);
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
      error: 'Google OAuth provider is not yet enabled in Supabase Project rlrzdvebvbtegxixyfrb. Please sign in with email and password.',
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
    localStorage.setItem('foyc_auth', 'true');
    localStorage.setItem('foyc_user_email', email);
    localStorage.setItem('foyc_user_name', 'Alex Chen');
  };

  const logoutDemo = () => {
    signOut();
  };

  const resetToDefault = () => {
    setProfile(DEFAULT_PROFILE);
    setReflection(DEFAULT_REFLECTION);
    loadSampleProfession('software-engineer');
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
        userId,
        signUp,
        signIn,
        signOut,
        signInWithGoogle,
        resetPassword,
        loginDemo,
        logoutDemo,
        resetToDefault,
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
