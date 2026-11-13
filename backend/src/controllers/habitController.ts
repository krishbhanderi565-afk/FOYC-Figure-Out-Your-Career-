import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { getSupabaseAdminClient } from '../config/supabase.js';

interface Habit {
  id: string;
  userId: string;
  title: string;
  frequency: 'daily' | 'weekly' | 'custom';
  targetDaysPerWeek: number;
  currentStreak: number;
  bestStreak: number;
  category: string;
  completedToday: boolean;
  history: { [dateStr: string]: boolean };
}

const habitStore = new Map<string, Habit[]>();

export const getHabits = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const supabase = getSupabaseAdminClient();

  if (supabase && userId !== 'default-user' && !userId.startsWith('mock-')) {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*, habit_logs(*)')
        .eq('user_id', userId);

      if (!error && data) {
        const today = new Date().toISOString().split('T')[0];
        const mapped = data.map((h: any) => {
          const history: Record<string, boolean> = {};
          if (Array.isArray(h.habit_logs)) {
            h.habit_logs.forEach((log: any) => {
              history[log.completion_date] = log.completed;
            });
          }
          return {
            id: h.id,
            userId: h.user_id,
            title: h.title,
            frequency: h.frequency || 'daily',
            targetDaysPerWeek: h.target_days_per_week || 5,
            currentStreak: h.current_streak || 0,
            bestStreak: h.best_streak || 0,
            category: h.category || 'Skill',
            completedToday: Boolean(history[today]),
            history,
          };
        });
        res.json({ success: true, habits: mapped });
        return;
      }
    } catch {}
  }

  const habits = habitStore.get(userId) || [];
  res.json({ success: true, habits });
};

export const createHabit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const { title, frequency, targetDaysPerWeek, category } = req.body;

  if (!title) {
    res.status(400).json({ success: false, error: 'Habit title is required.' });
    return;
  }

  const newHabit: Habit = {
    id: `h-${Date.now()}`,
    userId,
    title: title.trim(),
    frequency: frequency || 'daily',
    targetDaysPerWeek: targetDaysPerWeek || 5,
    currentStreak: 0,
    bestStreak: 0,
    category: category || 'Skill',
    completedToday: false,
    history: {},
  };

  const supabase = getSupabaseAdminClient();
  if (supabase && userId !== 'default-user' && !userId.startsWith('mock-')) {
    try {
      const { data, error } = await supabase.from('habits').insert({
        user_id: userId,
        title: newHabit.title,
        frequency: newHabit.frequency,
        target_days_per_week: newHabit.targetDaysPerWeek,
        category: newHabit.category,
      }).select().single();
      if (!error && data) {
        newHabit.id = data.id;
      }
    } catch {}
  }

  const userHabits = habitStore.get(userId) || [];
  userHabits.push(newHabit);
  habitStore.set(userId, userHabits);

  res.status(201).json({ success: true, habit: newHabit });
};

export const updateHabit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const { habitId } = req.params;
  const updates = req.body;

  const supabase = getSupabaseAdminClient();
  if (supabase && userId !== 'default-user' && !userId.startsWith('mock-')) {
    try {
      await supabase.from('habits').update({
        title: updates.title,
        frequency: updates.frequency,
        target_days_per_week: updates.targetDaysPerWeek,
        category: updates.category,
      }).eq('id', habitId).eq('user_id', userId);
    } catch {}
  }

  const userHabits = habitStore.get(userId) || [];
  const index = userHabits.findIndex((h) => h.id === habitId);
  if (index !== -1) {
    userHabits[index] = { ...userHabits[index], ...updates };
    habitStore.set(userId, userHabits);
    res.json({ success: true, habit: userHabits[index] });
    return;
  }

  res.json({ success: true, habit: { id: habitId, ...updates } });
};

export const toggleHabitLog = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const { habitId } = req.params;
  const { date } = req.body;

  const today = date || new Date().toISOString().split('T')[0];
  const userHabits = habitStore.get(userId) || [];
  const habit = userHabits.find((h) => h.id === habitId);

  const wasCompleted = habit ? !!habit.history[today] : false;
  const newStatus = !wasCompleted;

  if (habit) {
    habit.history[today] = newStatus;
    habit.completedToday = newStatus;

    if (newStatus) {
      habit.currentStreak += 1;
      habit.bestStreak = Math.max(habit.bestStreak, habit.currentStreak);
    } else {
      habit.currentStreak = Math.max(0, habit.currentStreak - 1);
    }
  }

  const supabase = getSupabaseAdminClient();
  if (supabase && userId !== 'default-user' && !userId.startsWith('mock-')) {
    try {
      if (newStatus) {
        await supabase.from('habit_logs').upsert({
          habit_id: habitId,
          user_id: userId,
          completion_date: today,
          completed: true,
        }, { onConflict: 'habit_id,completion_date' });
      } else {
        await supabase.from('habit_logs')
          .delete()
          .eq('habit_id', habitId)
          .eq('completion_date', today);
      }
    } catch {}
  }

  res.json({
    success: true,
    habit,
    date: today,
    completed: newStatus,
  });
};

export const deleteHabit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const { habitId } = req.params;

  const supabase = getSupabaseAdminClient();
  if (supabase && userId !== 'default-user' && !userId.startsWith('mock-')) {
    try {
      await supabase.from('habits').delete().eq('id', habitId).eq('user_id', userId);
    } catch {}
  }

  const userHabits = habitStore.get(userId) || [];
  habitStore.set(userId, userHabits.filter((h) => h.id !== habitId));

  res.json({ success: true, message: 'Habit removed successfully.' });
};
