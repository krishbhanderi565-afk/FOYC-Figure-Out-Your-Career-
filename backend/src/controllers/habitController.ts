import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';

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

  const userHabits = habitStore.get(userId) || [];
  userHabits.push(newHabit);
  habitStore.set(userId, userHabits);

  res.status(201).json({ success: true, habit: newHabit });
};

export const toggleHabitLog = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const { habitId } = req.params;
  const { date } = req.body;

  const today = date || new Date().toISOString().split('T')[0];
  const userHabits = habitStore.get(userId) || [];
  const habit = userHabits.find((h) => h.id === habitId);

  if (!habit) {
    res.status(404).json({ success: false, error: 'Habit not found.' });
    return;
  }

  const wasCompleted = !!habit.history[today];
  const newStatus = !wasCompleted;

  habit.history[today] = newStatus;
  habit.completedToday = newStatus;

  if (newStatus) {
    habit.currentStreak += 1;
    habit.bestStreak = Math.max(habit.bestStreak, habit.currentStreak);
  } else {
    habit.currentStreak = Math.max(0, habit.currentStreak - 1);
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

  const userHabits = habitStore.get(userId) || [];
  habitStore.set(userId, userHabits.filter((h) => h.id !== habitId));

  res.json({ success: true, message: 'Habit removed successfully.' });
};
