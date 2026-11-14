import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  UserProfile,
  CareerDashboardData,
  TaskItem,
  HabitItem,
  Milestone,
  ProjectItem,
  ResourceItem,
} from '../types/career';

export const supabaseService = {
  isConfigured: (): boolean => isSupabaseConfigured(),

  getCurrentUserId: async (): Promise<string | null> => {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.user?.id || null;
    } catch {
      return null;
    }
  },

  // 1. Profile Management
  getProfile: async (userId: string): Promise<any | null> => {
    if (!isSupabaseConfigured() || !userId) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error || !data) return null;
      return {
        profile: {
          id: data.id,
          fullName: data.full_name || data.preferred_name,
          preferredName: data.preferred_name || data.full_name,
          email: data.email,
          country: data.country,
          profession: data.profession,
          education: data.education || data.education_status,
          educationStatus: data.education_status || data.education,
          careerStage: data.career_stage,
          availableHours: data.available_hours,
          avatarUrl: data.avatar_url,
        },
      };
    } catch {
      return null;
    }
  },

  upsertProfile: async (
    userId: string,
    data: {
      fullName?: string;
      preferredName?: string;
      email?: string;
      country?: string;
      educationStatus?: string;
      currentField?: string;
      careerStage?: string;
      availableHoursPerWeek?: number;
    }
  ): Promise<boolean> => {
    if (!isSupabaseConfigured() || !userId) return false;
    try {
      const payload: Record<string, any> = {
        id: userId,
        updated_at: new Date().toISOString(),
      };
      if (data.fullName) payload.full_name = data.fullName;
      if (data.preferredName) payload.preferred_name = data.preferredName;
      if (data.email) payload.email = data.email;
      if (data.country) payload.country = data.country;
      if (data.educationStatus) {
        payload.education_status = data.educationStatus;
        payload.education = data.educationStatus;
      }
      if (data.currentField) payload.profession = data.currentField;
      if (data.careerStage) payload.career_stage = data.careerStage;
      if (typeof data.availableHoursPerWeek === 'number') {
        payload.available_hours = data.availableHoursPerWeek;
      }

      const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  },

  // 2. Dashboard Data Persistence
  getDashboardData: async (userId: string): Promise<CareerDashboardData | null> => {
    if (!isSupabaseConfigured() || !userId) return null;
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

      if (planError || !plan) return null;

      const raw = plan.raw_approved_plan || {};

      // 2. Fetch tasks
      const { data: dbTasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('display_order', { ascending: true });

      // 3. Fetch milestones
      const { data: dbMilestones } = await supabase
        .from('milestones')
        .select('*')
        .eq('user_id', userId)
        .order('sequence_order', { ascending: true });

      // 4. Fetch habits with habit_logs
      const { data: dbHabits } = await supabase
        .from('habits')
        .select('*, habit_logs(*)')
        .eq('user_id', userId);

      // 5. Fetch projects
      const { data: dbProjects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId);

      // 6. Fetch resources
      const { data: dbResources } = await supabase
        .from('resources')
        .select('*')
        .eq('user_id', userId);

      const today = new Date().toISOString().split('T')[0];

      const habits: HabitItem[] = Array.isArray(dbHabits) && dbHabits.length > 0
        ? dbHabits.map((h: any) => {
            const history: Record<string, boolean> = {};
            if (Array.isArray(h.habit_logs)) {
              h.habit_logs.forEach((log: any) => {
                if (log.completion_date) {
                  history[log.completion_date] = Boolean(log.completed);
                }
              });
            }
            return {
              id: h.id,
              title: h.title || h.name || 'Personal Habit',
              frequency: (h.frequency || 'daily') as any,
              targetDaysPerWeek: h.target_days_per_week || 5,
              currentStreak: h.current_streak || 0,
              bestStreak: h.best_streak || 0,
              completedToday: Boolean(history[today]),
              history,
              category: h.category || 'Skill',
              schedule: (h.schedule || 'everyday') as any,
              unit: h.unit || null,
              target: h.target_count || null,
              color: h.color || '#526B50',
            };
          })
        : raw.habits || [];

      const tasks: TaskItem[] = Array.isArray(dbTasks) && dbTasks.length > 0
        ? dbTasks.map((t: any) => ({
            id: t.id,
            title: t.title,
            category: (t.category || 'Foundation') as any,
            priority: (t.priority || 'medium') as any,
            dueDate: t.due_date || t.dueDate || 'This week',
            completed: Boolean(t.completed || t.status === 'completed'),
            notes: t.notes || undefined,
          }))
        : raw.tasks || [];

      const milestones: Milestone[] = Array.isArray(dbMilestones) && dbMilestones.length > 0
        ? dbMilestones.map((m: any) => ({
            id: m.id,
            title: m.title,
            description: m.description || '',
            priority: (m.priority || 'medium') as any,
            stage: (m.stage || m.category || 'Skill Development') as any,
            estimatedDuration: m.estimated_duration || m.estimatedDuration || '3-4 weeks',
            targetDate: m.target_date || m.targetDate || 'Month 1',
            completed: Boolean(m.completed || m.status === 'completed'),
            associatedTasksCount: m.associated_tasks_count || 3,
          }))
        : raw.milestones || [];

      const projects: ProjectItem[] = Array.isArray(dbProjects) && dbProjects.length > 0
        ? dbProjects.map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description || '',
            skillsDeveloped: p.skills_developed || [],
            status: (p.status || 'in-progress') as any,
            targetDate: p.target_date || 'Month 2',
            projectUrl: p.project_url,
          }))
        : raw.projects || [];

      const resources: ResourceItem[] = Array.isArray(dbResources) && dbResources.length > 0
        ? dbResources.map((r: any) => ({
            id: r.id,
            title: r.title,
            type: (r.type || 'Course') as any,
            provider: r.provider || 'Online',
            url: r.url || '#',
            isVerified: Boolean(r.is_verified),
            isFree: Boolean(r.is_free),
          }))
        : raw.resources || [];

      return {
        profile: raw.profile || {},
        reflection: raw.reflection || { mindText: '' },
        direction: {
          primaryTitle: plan.primary_career_direction || plan.title || raw.direction?.primaryTitle || 'Career Direction',
          summary: plan.career_summary || raw.direction?.summary || '',
          matchReason: raw.direction?.matchReason || 'Strong alignment with your background and goals.',
          longTermGoal: raw.direction?.longTermGoal || 'Senior Professional / Team Lead',
          shortTermObjective: raw.direction?.shortTermObjective || 'Master core fundamentals and build portfolio',
          alternativeTitles: raw.direction?.alternativeTitles || plan.alternative_career_paths || [],
          strengths: raw.direction?.strengths || plan.strengths || [],
          existingSkills: raw.direction?.existingSkills || [],
          skillGaps: raw.direction?.skillGaps || plan.skill_gaps || [],
          reassessmentQuestions: raw.direction?.reassessmentQuestions || [],
          assumptions: raw.direction?.assumptions || [],
          lastReassessedDate: raw.direction?.lastReassessedDate || new Date().toISOString(),
        },
        primaryCareer: raw.primaryCareer || {
          title: plan.primary_career_direction || plan.title || 'Career Direction',
          overview: plan.career_summary || '',
        },
        milestones,
        tasks,
        habits,
        projects,
        resources,
        dashboard_configuration: raw.dashboard_configuration,
      };
    } catch {
      return null;
    }
  },

  transferPlanToAccount: async (
    userId: string,
    planData: CareerDashboardData
  ): Promise<{ success: boolean; error?: string; planId?: string }> => {
    if (!isSupabaseConfigured() || !userId) {
      return { success: false, error: 'Supabase client is not configured.' };
    }

    try {
      // 1. Archive previously active plans for this user
      await supabase
        .from('career_plans')
        .update({ status: 'archived', updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('status', 'active');

      const title =
        planData.direction?.primaryTitle ||
        planData.primaryCareer?.title ||
        'Personalized Career Plan';
      const summary =
        planData.direction?.summary ||
        planData.primaryCareer?.overview ||
        '';

      // 2. Insert new active career plan
      const { data: newPlan, error: insertPlanErr } = await supabase
        .from('career_plans')
        .insert({
          user_id: userId,
          title,
          primary_career_direction: title,
          career_summary: summary,
          career_goals: planData.direction?.longTermGoal ? [planData.direction.longTermGoal] : [],
          strengths: planData.direction?.strengths || [],
          skill_gaps: planData.direction?.skillGaps || [],
          alternative_career_paths: planData.direction?.alternativeTitles || [],
          roadmap_summary: summary,
          raw_approved_plan: planData,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertPlanErr || !newPlan) {
        return { success: false, error: insertPlanErr?.message || 'Failed to save career plan.' };
      }

      const planId = newPlan.id;

      // 3. Insert Milestones
      if (Array.isArray(planData.milestones) && planData.milestones.length > 0) {
        const milestoneRecords = planData.milestones.map((m, idx) => ({
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
      if (Array.isArray(planData.tasks) && planData.tasks.length > 0) {
        const taskRecords = planData.tasks.map((t, idx) => ({
          user_id: userId,
          career_plan_id: planId,
          title: t.title,
          category: t.category || 'Foundation',
          priority: t.priority || 'medium',
          due_date: t.dueDate || 'This week',
          completed: Boolean(t.completed),
          status: t.completed ? 'completed' : 'pending',
          notes: t.notes || '',
          display_order: idx + 1,
        }));
        await supabase.from('tasks').insert(taskRecords);
      }

      // 5. Insert Habits
      if (Array.isArray(planData.habits) && planData.habits.length > 0) {
        const habitRecords = planData.habits.map((h) => ({
          user_id: userId,
          career_plan_id: planId,
          title: h.title,
          frequency: h.frequency || 'daily',
          target_days_per_week: h.targetDaysPerWeek || 5,
          current_streak: h.currentStreak || 0,
          best_streak: h.bestStreak || 0,
          category: h.category || 'Skill',
          color: h.color || '#526B50',
        }));
        await supabase.from('habits').insert(habitRecords);
      }

      // 6. Insert Projects
      if (Array.isArray(planData.projects) && planData.projects.length > 0) {
        const projectRecords = planData.projects.map((p) => ({
          user_id: userId,
          career_plan_id: planId,
          title: p.title,
          description: p.description || '',
          skills_developed: p.skillsDeveloped || [],
          status: p.status || 'in-progress',
          target_date: p.targetDate || 'Month 2',
          project_url: p.projectUrl || '',
        }));
        await supabase.from('projects').insert(projectRecords);
      }

      // 7. Insert Resources
      if (Array.isArray(planData.resources) && planData.resources.length > 0) {
        const resourceRecords = planData.resources.map((r) => ({
          user_id: userId,
          career_plan_id: planId,
          title: r.title,
          type: r.type || 'Course',
          provider: r.provider || 'Online',
          url: r.url || '#',
          is_verified: Boolean(r.isVerified),
          is_free: Boolean(r.isFree),
        }));
        await supabase.from('resources').insert(resourceRecords);
      }

      return { success: true, planId };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error transferring plan to account' };
    }
  },

  // 3. Interactive updates: Task toggle, Milestone toggle, Habit log
  updateTaskStatus: async (userId: string, taskId: string, completed: boolean): Promise<boolean> => {
    if (!isSupabaseConfigured() || !userId) return false;
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          completed,
          status: completed ? 'completed' : 'pending',
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .eq('user_id', userId);
      return !error;
    } catch {
      return false;
    }
  },

  createTask: async (userId: string, task: Omit<TaskItem, 'id'>): Promise<string | null> => {
    if (!isSupabaseConfigured() || !userId) return null;
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: userId,
          title: task.title,
          category: task.category,
          priority: task.priority,
          due_date: task.dueDate,
          completed: Boolean(task.completed),
          status: task.completed ? 'completed' : 'pending',
          notes: task.notes || '',
        })
        .select()
        .single();
      if (error || !data) return null;
      return data.id;
    } catch {
      return null;
    }
  },

  deleteTask: async (userId: string, taskId: string): Promise<boolean> => {
    if (!isSupabaseConfigured() || !userId) return false;
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', userId);
      return !error;
    } catch {
      return false;
    }
  },

  updateMilestoneStatus: async (userId: string, milestoneId: string, completed: boolean): Promise<boolean> => {
    if (!isSupabaseConfigured() || !userId) return false;
    try {
      const { error } = await supabase
        .from('milestones')
        .update({
          completed,
          status: completed ? 'completed' : 'in-progress',
          updated_at: new Date().toISOString(),
        })
        .eq('id', milestoneId)
        .eq('user_id', userId);
      return !error;
    } catch {
      return false;
    }
  },

  logHabitCompletion: async (
    userId: string,
    habitId: string,
    dateStr: string,
    completed: boolean
  ): Promise<boolean> => {
    if (!isSupabaseConfigured() || !userId) return false;
    try {
      const { error } = await supabase
        .from('habit_logs')
        .upsert(
          {
            user_id: userId,
            habit_id: habitId,
            completion_date: dateStr,
            completed,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'habit_id,completion_date' }
        );
      return !error;
    } catch {
      return false;
    }
  },
};
