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

interface CareerContextType {
  profile: UserProfile;
  reflection: UserReflection;
  dashboardData: CareerDashboardData;
  activeProfessionId: string;
  updateProfile: (data: Partial<UserProfile>) => void;
  updateReflection: (data: Partial<UserReflection>) => void;
  applyHandoffText: (text: string) => { success: boolean; errors: string[] };
  loadSampleProfession: (professionId: string) => void;
  toggleTask: (taskId: string) => void;
  addTask: (task: Omit<TaskItem, 'id'>) => void;
  deleteTask: (taskId: string) => void;
  toggleHabit: (habitId: string, dateStr?: string) => void;
  toggleMilestone: (milestoneId: string) => void;
  isAuthenticated: boolean;
  userEmail: string | null;
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
    const saved = localStorage.getItem('foyc_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [reflection, setReflection] = useState<UserReflection>(() => {
    const saved = localStorage.getItem('foyc_reflection');
    return saved ? JSON.parse(saved) : DEFAULT_REFLECTION;
  });

  const [dashboardData, setDashboardData] = useState<CareerDashboardData>(() => {
    const saved = localStorage.getItem('foyc_dashboard_data');
    return saved ? JSON.parse(saved) : initialParsed;
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
  };

  const updateReflection = (data: Partial<UserReflection>) => {
    setReflection((prev) => ({ ...prev, ...data }));
  };

  const applyHandoffText = (text: string) => {
    const res = parseHandoffText(text, profile, reflection);
    if (res.success && res.data) {
      setDashboardData(res.data as CareerDashboardData);
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

  const toggleTask = (taskId: string) => {
    setDashboardData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
    }));
  };

  const addTask = (taskInput: Omit<TaskItem, 'id'>) => {
    const newTask: TaskItem = {
      ...taskInput,
      id: `t-${Date.now()}`,
    };
    setDashboardData((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
  };

  const deleteTask = (taskId: string) => {
    setDashboardData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  };

  const toggleHabit = (habitId: string, dateStr?: string) => {
    const today = dateStr || new Date().toISOString().split('T')[0];
    setDashboardData((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => {
        if (h.id === habitId) {
          const wasCompleted = !!h.history[today];
          const newStatus = !wasCompleted;
          const newHistory = { ...h.history, [today]: newStatus };
          const newStreak = newStatus ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1);
          return {
            ...h,
            completedToday: newStatus,
            currentStreak: newStreak,
            bestStreak: Math.max(h.bestStreak, newStreak),
            history: newHistory,
          };
        }
        return h;
      }),
    }));
  };

  const toggleMilestone = (milestoneId: string) => {
    setDashboardData((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      ),
    }));
  };

  const loginDemo = (email = 'alex.chen@example.com') => {
    setIsAuthenticated(true);
    setUserEmail(email);
    localStorage.setItem('foyc_auth', 'true');
    localStorage.setItem('foyc_user_email', email);
  };

  const logoutDemo = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    localStorage.removeItem('foyc_auth');
    localStorage.removeItem('foyc_user_email');
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
        updateProfile,
        updateReflection,
        applyHandoffText,
        loadSampleProfession,
        toggleTask,
        addTask,
        deleteTask,
        toggleHabit,
        toggleMilestone,
        isAuthenticated,
        userEmail,
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
