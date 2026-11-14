import { UserProfile, UserReflection, CareerDashboardData, TaskItem } from '../types/career';
import { supabaseService } from './supabaseService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('foyc_auth_token') || 'demo-token';
  const sessionId = localStorage.getItem('foyc_session_id') || 'demo-session';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'x-session-id': sessionId,
  };
};

const getUserId = async (): Promise<string | null> => {
  const cloudUserId = await supabaseService.getCurrentUserId();
  if (cloudUserId) return cloudUserId;
  return localStorage.getItem('foyc_user_id') || null;
};

export const api = {
  // Health & Target Project Verification
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await res.json();
    } catch {
      return {
        status: supabaseService.isConfigured() ? 'live-supabase-client-mode' : 'offline-client-mode',
        targetProjectId: 'rlrzdvebvbtegxixyfrb',
        supabaseConfigured: supabaseService.isConfigured(),
      };
    }
  },

  // Profile Management
  getProfile: async () => {
    if (supabaseService.isConfigured()) {
      const userId = await getUserId();
      if (userId) {
        const cloudProfile = await supabaseService.getProfile(userId);
        if (cloudProfile) return cloudProfile;
      }
    }
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        headers: getHeaders(),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  updateProfile: async (profileData: any) => {
    if (supabaseService.isConfigured()) {
      const userId = await getUserId();
      if (userId) {
        await supabaseService.upsertProfile(userId, {
          fullName: profileData.fullName || profileData.preferredName,
          preferredName: profileData.preferredName || profileData.fullName,
          email: profileData.email,
          country: profileData.country,
          currentField: profileData.currentField || profileData.profession,
          educationStatus: profileData.educationStatus || profileData.education,
          careerStage: profileData.careerStage,
          availableHoursPerWeek: profileData.availableHoursPerWeek || profileData.availableHours,
        });
      }
    }
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(profileData),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  // Discovery prompt generation
  generatePrompt: async (profile: UserProfile, reflection: UserReflection) => {
    try {
      const res = await fetch(`${API_BASE_URL}/prompt/generate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ profile, reflection }),
      });
      if (!res.ok) throw new Error('Backend prompt generation failed');
      return await res.json();
    } catch {
      return null;
    }
  },

  // Handoff import & parsing
  importHandoff: async (rawHandoffText: string, profile: UserProfile, reflection: UserReflection) => {
    try {
      const res = await fetch(`${API_BASE_URL}/handoff/import`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          rawHandoffText,
          userProfile: profile,
          userReflection: reflection,
        }),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  // Dashboard & Plan Sync
  getDashboardConfig: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/config`, {
        headers: getHeaders(),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  saveDashboardConfig: async (config: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/config`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(config),
      });
      return await res.json();
    } catch {
      return { success: true, localOnly: true };
    }
  },

  getDashboardData: async () => {
    if (supabaseService.isConfigured()) {
      const userId = await getUserId();
      if (userId) {
        const cloudData = await supabaseService.getDashboardData(userId);
        if (cloudData) {
          return { success: true, data: cloudData, source: 'supabase' };
        }
      }
    }
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard`, {
        headers: getHeaders(),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  transferPlanToAccount: async (approvedPlanDraft: CareerDashboardData) => {
    if (supabaseService.isConfigured()) {
      const userId = await getUserId();
      if (userId) {
        const res = await supabaseService.transferPlanToAccount(userId, approvedPlanDraft);
        if (res.success) {
          return { success: true, source: 'supabase', planId: res.planId };
        }
      }
    }
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/transfer`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ approvedPlanDraft }),
      });
      return await res.json();
    } catch {
      return { success: true, localOnly: true };
    }
  },

  reassessDirection: async (newDirection: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/reassess`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ newDirection }),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  // Milestones CRUD
  getMilestones: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/milestones`, {
        headers: getHeaders(),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  createMilestone: async (milestone: any) => {
    if (supabaseService.isConfigured()) {
      const userId = await getUserId();
      if (userId) {
        const id = await supabaseService.createMilestone(userId, milestone);
        if (id) {
          return { success: true, milestone: { ...milestone, id } };
        }
      }
    }
    return { success: true, milestone: { ...milestone, id: `ms-${Date.now()}` } };
  },

  updateMilestone: async (milestoneId: string, updates: any) => {
    if (supabaseService.isConfigured()) {
      const userId = await getUserId();
      if (userId) {
        await supabaseService.updateMilestone(userId, milestoneId, updates);
      }
    }
    return { success: true };
  },

  deleteMilestone: async (milestoneId: string) => {
    if (supabaseService.isConfigured()) {
      const userId = await getUserId();
      if (userId) {
        await supabaseService.deleteMilestone(userId, milestoneId);
      }
    }
    return { success: true };
  },

  toggleMilestone: async (milestoneId: string, completed?: boolean) => {
    if (supabaseService.isConfigured()) {
      const userId = await getUserId();
      if (userId) {
        await supabaseService.updateMilestoneStatus(userId, milestoneId, completed ?? true);
      }
    }
    try {
      const res = await fetch(`${API_BASE_URL}/milestones/${milestoneId}/toggle`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  // Tasks CRUD
  getTasks: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks`, {
        headers: getHeaders(),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  createTask: async (task: Omit<TaskItem, 'id'>) => {
    if (supabaseService.isConfigured()) {
      const userId = await getUserId();
      if (userId) {
        const id = await supabaseService.createTask(userId, task);
        if (id) {
          return { success: true, task: { ...task, id } };
        }
      }
    }
    try {
      const res = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(task),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  updateTask: async (taskId: string, updates: Partial<TaskItem>) => {
    if (supabaseService.isConfigured()) {
      const userId = await getUserId();
      if (userId && updates.completed !== undefined) {
        await supabaseService.updateTaskStatus(userId, taskId, updates.completed);
      }
    }
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  deleteTask: async (taskId: string) => {
    if (supabaseService.isConfigured()) {
      const userId = await getUserId();
      if (userId) {
        await supabaseService.deleteTask(userId, taskId);
      }
    }
    try {
      await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
    } catch {}
  },

  // Habit CRUD & toggle
  getHabits: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/habits`, {
        headers: getHeaders(),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  createHabit: async (habitData: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/habits`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(habitData),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  updateHabit: async (habitId: string, updates: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/habits/${habitId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  deleteHabit: async (habitId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/habits/${habitId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  toggleHabit: async (habitId: string, dateStr?: string, completed?: boolean) => {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    if (supabaseService.isConfigured()) {
      const userId = await getUserId();
      if (userId) {
        await supabaseService.logHabitCompletion(userId, habitId, targetDate, completed ?? true);
      }
    }
    try {
      const res = await fetch(`${API_BASE_URL}/habits/${habitId}/toggle`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ date: targetDate }),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  // Projects CRUD
  getProjects: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/projects`, {
        headers: getHeaders(),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  createProject: async (projectData: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(projectData),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  updateProject: async (projectId: string, updates: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  deleteProject: async (projectId: string) => {
    try {
      await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
    } catch {}
  },

  // Weekly review
  getWeeklyReviews: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        headers: getHeaders(),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  saveWeeklyReview: async (reviewData: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(reviewData),
      });
      return await res.json();
    } catch {
      return { success: true, localOnly: true };
    }
  },

  // Clarity Compass Persistence
  saveClarityAssessment: async (data: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/clarity/assessment`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return { success: true, localOnly: true };
    }
  },

  getClarityAssessment: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/clarity/assessment`, {
        headers: getHeaders(),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  finalizeClarityReport: async (data: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/clarity/finalize`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return { success: true, localOnly: true };
    }
  },

  transferClarityToDashboard: async (final_report: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/clarity/to-dashboard`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ final_report }),
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Network request failed' };
    }
  },

  // Possibility Explorer Persistence
  savePossibilityExploration: async (data: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/possibility/exploration`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return { success: true, localOnly: true };
    }
  },

  getPossibilityExploration: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/possibility/exploration`, {
        headers: getHeaders(),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  finalizePossibilityReport: async (data: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/possibility/finalize`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return { success: true, localOnly: true };
    }
  },

  transferPossibilityToDashboard: async (data: {
    selected_possibility: any;
    secondary_possibility?: any;
    target_timeline_months?: number;
    user_notes?: string;
  }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/possibility/to-dashboard`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Network request failed' };
    }
  },
};
