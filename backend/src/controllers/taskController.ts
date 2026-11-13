import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { getSupabaseAdminClient } from '../config/supabase.js';

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
  const supabase = getSupabaseAdminClient();

  if (supabase && userId !== 'default-user' && !userId.startsWith('mock-')) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('display_order', { ascending: true });

      if (!error && data) {
        const mapped = data.map((t: any) => ({
          id: t.id,
          userId: t.user_id,
          title: t.title,
          description: t.description,
          category: t.category || 'Technical',
          priority: t.priority || 'medium',
          dueDate: t.due_date || 'This week',
          completed: t.completed || t.status === 'completed',
          notes: t.notes,
        }));
        res.json({ success: true, tasks: mapped });
        return;
      }
    } catch {}
  }

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

  const supabase = getSupabaseAdminClient();

  if (supabase && userId !== 'default-user' && !userId.startsWith('mock-')) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: userId,
          title: title.trim(),
          description: description || '',
          category: category || 'Technical',
          priority: priority || 'medium',
          due_date: dueDate || 'This week',
          completed: false,
          status: 'pending',
          notes,
        })
        .select()
        .single();

      if (!error && data) {
        res.status(201).json({
          success: true,
          task: {
            id: data.id,
            userId: data.user_id,
            title: data.title,
            description: data.description,
            category: data.category,
            priority: data.priority,
            dueDate: data.due_date,
            completed: data.completed,
            notes: data.notes,
          },
        });
        return;
      }
    } catch {}
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

  const supabase = getSupabaseAdminClient();

  if (supabase && userId !== 'default-user' && !userId.startsWith('mock-')) {
    try {
      const dbPayload: any = { updated_at: new Date().toISOString() };
      if (updates.title !== undefined) dbPayload.title = updates.title;
      if (updates.description !== undefined) dbPayload.description = updates.description;
      if (updates.completed !== undefined) {
        dbPayload.completed = updates.completed;
        dbPayload.status = updates.completed ? 'completed' : 'pending';
        dbPayload.completed_at = updates.completed ? new Date().toISOString() : null;
      }
      if (updates.priority !== undefined) dbPayload.priority = updates.priority;
      if (updates.dueDate !== undefined) dbPayload.due_date = updates.dueDate;
      if (updates.category !== undefined) dbPayload.category = updates.category;

      const { data, error } = await supabase
        .from('tasks')
        .update(dbPayload)
        .eq('id', taskId)
        .eq('user_id', userId)
        .select()
        .single();

      if (!error && data) {
        res.json({
          success: true,
          task: {
            id: data.id,
            userId: data.user_id,
            title: data.title,
            description: data.description,
            category: data.category,
            priority: data.priority,
            dueDate: data.due_date,
            completed: data.completed,
          },
        });
        return;
      }
    } catch {}
  }

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
  const supabase = getSupabaseAdminClient();

  if (supabase && userId !== 'default-user' && !userId.startsWith('mock-')) {
    try {
      await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', userId);

      res.json({ success: true, message: 'Task deleted successfully.' });
      return;
    } catch {}
  }

  const userTasks = taskStore.get(userId) || [];
  const filtered = userTasks.filter((t) => t.id !== taskId);
  taskStore.set(userId, filtered);

  res.json({ success: true, message: 'Task deleted successfully.' });
};
