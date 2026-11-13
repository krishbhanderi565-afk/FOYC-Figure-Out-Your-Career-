import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';

interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: 'Foundation' | 'Technical' | 'Portfolio' | 'Networking' | 'Job Prep';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  completed: boolean;
  notes?: string;
}

const taskStore = new Map<string, Task[]>();

export const getTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const tasks = taskStore.get(userId) || [];
  res.json({ success: true, tasks });
};

export const createTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const { title, description, category, priority, dueDate, notes } = req.body;

  if (!title || typeof title !== 'string') {
    res.status(400).json({ success: false, error: 'Task title is required.' });
    return;
  }

  const newTask: Task = {
    id: `t-${Date.now()}`,
    userId,
    title: title.trim(),
    description,
    category: category || 'Technical',
    priority: priority || 'medium',
    dueDate: dueDate || 'This week',
    completed: false,
    notes,
  };

  const userTasks = taskStore.get(userId) || [];
  userTasks.unshift(newTask);
  taskStore.set(userId, userTasks);

  res.status(201).json({ success: true, task: newTask });
};

export const updateTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const { taskId } = req.params;
  const updates = req.body;

  const userTasks = taskStore.get(userId) || [];
  const idx = userTasks.findIndex((t) => t.id === taskId);

  if (idx === -1) {
    res.status(404).json({ success: false, error: 'Task not found.' });
    return;
  }

  userTasks[idx] = { ...userTasks[idx], ...updates };
  taskStore.set(userId, userTasks);

  res.json({ success: true, task: userTasks[idx] });
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const { taskId } = req.params;

  const userTasks = taskStore.get(userId) || [];
  const filtered = userTasks.filter((t) => t.id !== taskId);
  taskStore.set(userId, filtered);

  res.json({ success: true, message: 'Task removed successfully.' });
};
