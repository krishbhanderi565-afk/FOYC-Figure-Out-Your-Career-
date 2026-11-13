import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { getSupabaseAdminClient } from '../config/supabase.js';

// In-memory persistent fallback store for Possibility Explorer
const possibilityStore = new Map<string, any>();

export const savePossibilityDraft = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  const sessionId = (req.headers['x-session-id'] as string) || req.sessionId || 'anonymous-session';
  const {
    stage = 1,
    life_stage,
    life_stage_other,
    background_data,
    interests,
    interests_other,
    skills_possessed,
    skills_to_develop,
    ambitions,
    ambition_vision,
    practical_boundaries,
    additional_context,
    generated_prompt,
    status = 'in_progress',
  } = req.body;

  const supabase = getSupabaseAdminClient();

  const recordPayload = {
    user_id: userId && userId !== 'default-user' && !userId.startsWith('demo-') ? userId : null,
    session_id: sessionId,
    status,
    stage,
    life_stage,
    life_stage_other,
    background_data: background_data || {},
    interests: interests || [],
    interests_other,
    skills_possessed: skills_possessed || [],
    skills_to_develop: skills_to_develop || [],
    ambitions: ambitions || [],
    ambition_vision,
    practical_boundaries: practical_boundaries || {},
    additional_context,
    generated_prompt,
    updated_at: new Date().toISOString(),
  };

  const storeKey = userId && userId !== 'default-user' ? `user:${userId}` : `session:${sessionId}`;
  possibilityStore.set(storeKey, {
    ...(possibilityStore.get(storeKey) || {}),
    ...recordPayload,
  });

  if (supabase && userId && !userId.startsWith('demo-')) {
    try {
      const { data: existing } = await supabase
        .from('possibility_explorations')
        .select('id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing?.id) {
        await supabase
          .from('possibility_explorations')
          .update(recordPayload)
          .eq('id', existing.id);
      } else {
        await supabase
          .from('possibility_explorations')
          .insert(recordPayload);
      }
    } catch (err) {
      console.warn('[Possibility] Supabase draft update fallback to memory:', err);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Possibility exploration draft saved successfully.',
    data: recordPayload,
  });
};

export const getPossibilityExploration = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  const sessionId = (req.headers['x-session-id'] as string) || req.sessionId || 'anonymous-session';
  const supabase = getSupabaseAdminClient();

  if (supabase && userId && !userId.startsWith('demo-')) {
    try {
      const { data, error } = await supabase
        .from('possibility_explorations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        res.status(200).json({ success: true, exploration: data });
        return;
      }
    } catch (err) {
      console.warn('[Possibility] Supabase fetch fallback to memory:', err);
    }
  }

  const storeKey = userId && userId !== 'default-user' ? `user:${userId}` : `session:${sessionId}`;
  const localData = possibilityStore.get(storeKey);

  res.status(200).json({
    success: true,
    exploration: localData || null,
  });
};

export const finalizePossibilityReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  const sessionId = (req.headers['x-session-id'] as string) || req.sessionId || 'anonymous-session';
  const { final_report, raw_handoff_text, shortlist = [], experiments_state = [], checklist_state = [] } = req.body;

  const supabase = getSupabaseAdminClient();
  const updatePayload = {
    user_id: userId && userId !== 'default-user' && !userId.startsWith('demo-') ? userId : null,
    session_id: sessionId,
    status: 'completed',
    final_report,
    handoff_raw: raw_handoff_text,
    shortlist,
    experiments_state,
    checklist_state,
    updated_at: new Date().toISOString(),
  };

  const storeKey = userId && userId !== 'default-user' ? `user:${userId}` : `session:${sessionId}`;
  possibilityStore.set(storeKey, {
    ...(possibilityStore.get(storeKey) || {}),
    ...updatePayload,
  });

  if (supabase && userId && !userId.startsWith('demo-')) {
    try {
      const { data: existing } = await supabase
        .from('possibility_explorations')
        .select('id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing?.id) {
        await supabase
          .from('possibility_explorations')
          .update(updatePayload)
          .eq('id', existing.id);
      } else {
        await supabase
          .from('possibility_explorations')
          .insert(updatePayload);
      }
    } catch (err) {
      console.warn('[Possibility] Supabase finalize error:', err);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Possibility report finalized and saved successfully.',
    data: updatePayload,
  });
};

export const transferPossibilityToDashboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  const { selected_possibility, secondary_possibility, target_timeline_months = 6, user_notes = '' } = req.body;

  if (!selected_possibility || !selected_possibility.name) {
    res.status(400).json({ success: false, error: 'A selected possibility is required to build the career dashboard.' });
    return;
  }

  const supabase = getSupabaseAdminClient();
  const primaryTitle = selected_possibility.name;
  const summary = selected_possibility.description || `Target trajectory: ${primaryTitle}`;
  const whyItMatches = selected_possibility.why_it_matches || '';

  // 1. Build career plan data structure compatible with FOYC dashboard
  const newCareerPlan = {
    user_id: userId && userId !== 'default-user' && !userId.startsWith('demo-') ? userId : null,
    career_name: primaryTitle,
    target_role: primaryTitle,
    overview: `${summary}\n\nStrategic Fit: ${whyItMatches}${secondary_possibility?.name ? `\n\nSecondary Exploration Horizon: ${secondary_possibility.name}` : ''}`,
    status: 'active',
    updated_at: new Date().toISOString(),
  };

  // 2. Build milestones from preparation steps & experiments
  const rawMilestones = [
    `Phase 1: Explore & Prototype (${selected_possibility.category || 'Foundations'})`,
    `Phase 2: Build Proof-of-Work & Portfolio Artifacts`,
    `Phase 3: Market Outreach & Transition Execution`,
  ];

  const milestonesPayload = rawMilestones.map((title, idx) => ({
    title,
    description: `Core milestone phase for ${primaryTitle}. Target timeframe: Month ${idx * 2 + 1}–${idx * 2 + 2}`,
    order_index: idx + 1,
    status: idx === 0 ? 'in_progress' : 'pending',
  }));

  // 3. Build tasks from required skills and immediate actions
  const requiredSkills = selected_possibility.required_skills || [];
  const tasksPayload = [
    {
      title: `Complete Initial Experiment: Research & validate day-to-day requirements for ${primaryTitle}`,
      description: 'Review 3 live job openings or client projects to understand real-world expectations.',
      category: 'Research',
      priority: 'high',
      is_completed: false,
    },
    ...requiredSkills.slice(0, 4).map((skill: string) => ({
      title: `Skill Development: Begin hands-on practice in ${skill}`,
      description: `Build a small concrete project demonstrating proficiency in ${skill}.`,
      category: 'Upskilling',
      priority: 'medium',
      is_completed: false,
    })),
    {
      title: `Setup Weekly Progress & Proof-of-Work Log`,
      description: 'Document weekly findings, code repositories, or design iterations.',
      category: 'Execution',
      priority: 'high',
      is_completed: false,
    },
  ];

  // If Supabase authenticated user, write to tables
  if (supabase && userId && !userId.startsWith('demo-')) {
    try {
      // Archive existing active plans
      await supabase
        .from('career_plans')
        .update({ status: 'archived' })
        .eq('user_id', userId)
        .eq('status', 'active');

      const { data: planRecord, error: planError } = await supabase
        .from('career_plans')
        .insert(newCareerPlan)
        .select('id')
        .single();

      if (!planError && planRecord?.id) {
        // Insert milestones
        await supabase
          .from('milestones')
          .insert(milestonesPayload.map((m) => ({ ...m, career_plan_id: planRecord.id })));

        // Insert tasks
        await supabase
          .from('tasks')
          .insert(tasksPayload.map((t) => ({ ...t, user_id: userId })));
      }
    } catch (err) {
      console.warn('[Possibility] Supabase dashboard transfer error:', err);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Possibility successfully transferred to your live FOYC Career Dashboard.',
    data: {
      careerPlan: newCareerPlan,
      milestones: milestonesPayload,
      tasks: tasksPayload,
      primaryTitle,
    },
  });
};
