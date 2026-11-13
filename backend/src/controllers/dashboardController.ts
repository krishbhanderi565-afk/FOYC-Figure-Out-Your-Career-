import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { getSupabaseAdminClient } from '../config/supabase.js';

// Cache store for user dashboard plans (in-memory persistent fallback)
const userDashboardStore = new Map<string, any>();

export const getDashboardData = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const supabase = getSupabaseAdminClient();

  if (supabase && userId !== 'default-user' && !userId.startsWith('mock-')) {
    try {
      // 1. Fetch active career plan
      const { data: plan, error: planError } = await supabase
        .from('career_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!planError && plan) {
        // If plan has raw_approved_plan JSON, retrieve sub-entities to ensure latest state
        const raw = plan.raw_approved_plan || {};

        // Fetch user tasks
        const { data: tasks } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', userId)
          .order('display_order', { ascending: true });

        // Fetch user milestones
        const { data: milestones } = await supabase
          .from('milestones')
          .select('*')
          .eq('user_id', userId)
          .order('sequence_order', { ascending: true });

        // Fetch user habits with logs
        const { data: habits } = await supabase
          .from('habits')
          .select('*, habit_logs(*)')
          .eq('user_id', userId);

        // Fetch user projects
        const { data: projects } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', userId);

        const today = new Date().toISOString().split('T')[0];

        const mappedHabits = Array.isArray(habits)
          ? habits.map((h: any) => {
              const history: Record<string, boolean> = {};
              if (Array.isArray(h.habit_logs)) {
                h.habit_logs.forEach((l: any) => {
                  history[l.completion_date] = l.completed;
                });
              }
              return {
                id: h.id,
                title: h.title || h.name,
                frequency: h.frequency || 'daily',
                targetDaysPerWeek: h.target_days_per_week || 5,
                currentStreak: h.current_streak || 0,
                bestStreak: h.best_streak || 0,
                completedToday: Boolean(history[today]),
                history,
                category: h.category || 'Skill',
                schedule: h.schedule || 'everyday',
                unit: h.unit || null,
                target: h.target_count || null,
                color: h.color || '#526B50',
              };
            })
          : raw.habits || [];

        const mappedTasks = Array.isArray(tasks)
          ? tasks.map((t: any) => ({
              id: t.id,
              title: t.title,
              category: t.category || 'Technical',
              priority: t.priority || 'medium',
              dueDate: t.due_date || 'This week',
              completed: t.completed || t.status === 'completed',
              notes: t.notes || undefined,
            }))
          : raw.tasks || [];

        const mappedMilestones = Array.isArray(milestones)
          ? milestones.map((m: any) => ({
              id: m.id,
              title: m.title,
              stage: m.stage || m.category || 'Skill Development',
              priority: m.priority || 'medium',
              duration: m.estimated_duration || '3-4 weeks',
              targetDate: m.target_date || 'Month 1',
              completed: m.completed || m.status === 'completed',
            }))
          : raw.milestones || [];

        const mappedProjects = Array.isArray(projects)
          ? projects.map((p: any) => ({
              id: p.id,
              title: p.title || p.name,
              description: p.description,
              skillsDeveloped: Array.isArray(p.skills_developed) ? p.skills_developed : p.skills_used || [],
              status: p.status || 'planned',
              targetDate: p.target_date || 'Month 2',
              projectUrl: p.project_url || undefined,
            }))
          : raw.projects || [];

        const dashboardData = {
          ...raw,
          planId: plan.id,
          direction: {
            primaryTitle: plan.primary_career_direction || plan.title || raw.direction?.primaryTitle || 'Career Direction',
            matchConfidence: raw.direction?.matchConfidence || 'High (95%)',
            timeHorizon: plan.time_horizon || raw.direction?.timeHorizon || '6 Months',
            summary: plan.career_summary || raw.direction?.summary || '',
          },
          tasks: mappedTasks,
          milestones: mappedMilestones,
          habits: mappedHabits,
          projects: mappedProjects,
        };

        res.json({ success: true, data: dashboardData, source: 'supabase' });
        return;
      }
    } catch {}
  }

  // Fallback to in-memory store
  const data = userDashboardStore.get(userId);
  if (!data) {
    res.json({
      success: true,
      hasSavedPlan: false,
      message: 'No saved career plan found for this account. Create one or load a preset.',
    });
    return;
  }

  res.json({ success: true, hasSavedPlan: true, data, source: 'memory-cache' });
};

export const transferAnonymousDraftToUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.userId || 'default-user';
  const { approvedPlanDraft } = req.body;

  if (!approvedPlanDraft) {
    res.status(400).json({ success: false, error: 'No approved plan draft provided to transfer.' });
    return;
  }

  const supabase = getSupabaseAdminClient();

  if (supabase && userId !== 'default-user' && !userId.startsWith('mock-')) {
    try {
      // 1. Mark existing plans as archived
      await supabase
        .from('career_plans')
        .update({ status: 'archived' })
        .eq('user_id', userId)
        .eq('status', 'active');

      // 2. Insert new career plan
      const { data: newPlan, error: insertPlanErr } = await supabase
        .from('career_plans')
        .insert({
          user_id: userId,
          title: approvedPlanDraft.direction?.primaryTitle || 'Personalized Career Plan',
          primary_career_direction: approvedPlanDraft.direction?.primaryTitle || 'Personalized Career Plan',
          career_summary: approvedPlanDraft.direction?.summary || '',
          career_goals: approvedPlanDraft.direction?.careerGoals || [],
          strengths: approvedPlanDraft.strengths?.coreStrengths || [],
          skill_gaps: approvedPlanDraft.skillGaps || [],
          alternative_career_paths: approvedPlanDraft.direction?.alternativePaths || [],
          roadmap_summary: approvedPlanDraft.direction?.summary || '',
          raw_approved_plan: approvedPlanDraft,
          status: 'active',
        })
        .select()
        .single();

      if (!insertPlanErr && newPlan) {
        const planId = newPlan.id;

        // 3. Insert Milestones
        if (Array.isArray(approvedPlanDraft.milestones) && approvedPlanDraft.milestones.length > 0) {
          const milestoneRecords = approvedPlanDraft.milestones.map((m: any, idx: number) => ({
            user_id: userId,
            career_plan_id: planId,
            title: m.title,
            description: m.description || '',
            stage: m.stage || 'Skill Development',
            category: m.stage || 'Skill Development',
            target_date: m.targetDate || 'Month 1',
            completed: Boolean(m.completed),
            status: m.completed ? 'completed' : 'planned',
            sequence_order: idx + 1,
            display_order: idx + 1,
          }));
          await supabase.from('milestones').insert(milestoneRecords);
        }

        // 4. Insert Tasks
        if (Array.isArray(approvedPlanDraft.tasks) && approvedPlanDraft.tasks.length > 0) {
          const taskRecords = approvedPlanDraft.tasks.map((t: any, idx: number) => ({
            user_id: userId,
            career_plan_id: planId,
            title: t.title,
            description: t.description || '',
            category: t.category || 'Technical',
            priority: t.priority || 'medium',
            due_date: t.dueDate || 'This week',
            completed: Boolean(t.completed),
            status: t.completed ? 'completed' : 'pending',
            display_order: idx + 1,
          }));
          await supabase.from('tasks').insert(taskRecords);
        }

        // 5. Insert Habits
        if (Array.isArray(approvedPlanDraft.habits) && approvedPlanDraft.habits.length > 0) {
          const habitRecords = approvedPlanDraft.habits.map((h: any) => ({
            user_id: userId,
            career_plan_id: planId,
            title: h.title,
            name: h.title,
            frequency: h.frequency || 'daily',
            target_days_per_week: h.targetDaysPerWeek || 5,
            schedule: h.schedule || 'everyday',
            color: h.color || '#526B50',
            category: h.category || 'Skill',
            current_streak: h.currentStreak || 0,
            best_streak: h.bestStreak || 0,
            is_active: true,
          }));
          await supabase.from('habits').insert(habitRecords);
        }

        // 6. Insert Projects
        if (Array.isArray(approvedPlanDraft.projects) && approvedPlanDraft.projects.length > 0) {
          const projectRecords = approvedPlanDraft.projects.map((p: any) => ({
            user_id: userId,
            career_plan_id: planId,
            title: p.title,
            name: p.title,
            description: p.description || '',
            skills_developed: Array.isArray(p.skillsDeveloped) ? p.skillsDeveloped : [],
            skills_used: Array.isArray(p.skillsDeveloped) ? p.skillsDeveloped : [],
            status: p.status || 'planned',
            target_date: p.targetDate || 'Month 2',
            project_url: p.projectUrl || null,
          }));
          await supabase.from('projects').insert(projectRecords);
        }
      }
    } catch {}
  }

  // Always update memory store
  userDashboardStore.set(userId, {
    ...approvedPlanDraft,
    userId,
    savedAt: new Date().toISOString(),
  });

  res.json({
    success: true,
    message: 'Approved career plan successfully saved to authenticated account.',
    userId,
  });
};

export const reassessDirection = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const { newDirection } = req.body;

  const current = userDashboardStore.get(userId);
  if (current && newDirection) {
    current.direction = {
      ...current.direction,
      primaryTitle: newDirection,
      lastReassessedDate: new Date().toLocaleDateString(),
    };
    userDashboardStore.set(userId, current);
  }

  res.json({ success: true, message: 'Direction updated.' });
};
