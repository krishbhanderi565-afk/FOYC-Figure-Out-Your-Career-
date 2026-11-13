import { UserProfile, UserReflection, CareerDashboardData, TaskItem } from '../types/career';

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

export const api = {
  // Health
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await res.json();
    } catch {
      return { status: 'offline-client-mode' };
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
    } catch (err) {
      // Graceful client fallback
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
      const data = await res.json();
      return data;
    } catch (err) {
      return null;
    }
  },

  // Transfer approved plan to user account
  transferPlanToAccount: async (approvedPlanDraft: CareerDashboardData) => {
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

  // Tasks CRUD
  createTask: async (task: Omit<TaskItem, 'id'>) => {
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

  deleteTask: async (taskId: string) => {
    try {
      await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
    } catch {}
  },

  // Habit toggle
  toggleHabit: async (habitId: string, dateStr?: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/habits/${habitId}/toggle`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ date: dateStr }),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  // Weekly review
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
};
