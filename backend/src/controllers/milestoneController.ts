import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { getSupabaseAdminClient } from '../config/supabase.js';

interface Milestone {
  id: string;
  userId: string;
  planId?: string;
  title: string;
  stage: string;
  priority: string;
  duration: string;
  targetDate: string;
  completed: boolean;
}

const milestoneStore = new Map<string, Milestone[]>();

export const getMilestones = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const supabase = getSupabaseAdminClient();

  if (supabase && userId !== 'default-user' && !userId.startsWith('mock-')) {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('user_id', userId)
        .order('sequence_order', { ascending: true });

      if (!error && data) {
        const mapped = data.map((m: any) => ({
          id: m.id,
          userId: m.user_id,
          planId: m.career_plan_id,
          title: m.title,
          stage: m.stage || m.category || 'Skill Development',
          priority: m.priority || 'medium',
          duration: m.estimated_duration || '3-4 weeks',
          targetDate: m.target_date || 'Month 1',
          completed: m.completed || m.status === 'completed',
        }));
        res.json({ success: true, milestones: mapped });
        return;
      }
    } catch {}
  }

  const milestones = milestoneStore.get(userId) || [];
  res.json({ success: true, milestones });
};

export const toggleMilestone = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const { milestoneId } = req.params;
  const supabase = getSupabaseAdminClient();

  if (supabase && userId !== 'default-user' && !userId.startsWith('mock-')) {
    try {
      const { data: existing } = await supabase
        .from('milestones')
        .select('completed')
        .eq('id', milestoneId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        const newStatus = !existing.completed;
        await supabase
          .from('milestones')
          .update({
            completed: newStatus,
            status: newStatus ? 'completed' : 'in-progress',
            completion_date: newStatus ? new Date().toISOString().split('T')[0] : null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', milestoneId)
          .eq('user_id', userId);

        res.json({ success: true, milestoneId, completed: newStatus });
        return;
      }
    } catch {}
  }

  const userMilestones = milestoneStore.get(userId) || [];
  const m = userMilestones.find((item) => item.id === milestoneId);
  if (m) {
    m.completed = !m.completed;
    res.json({ success: true, milestoneId, completed: m.completed });
    return;
  }

  res.json({ success: true, milestoneId, toggled: true });
};
