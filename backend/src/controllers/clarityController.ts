import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { getSupabaseAdminClient } from '../config/supabase.js';

// In-memory persistent fallback store for Clarity Compass
const clarityStore = new Map<string, any>();

export const saveAssessmentDraft = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  const sessionId = (req.headers['x-session-id'] as string) || req.sessionId || 'anonymous-session';
  const {
    situation_stage,
    situation_other,
    uncertainties,
    uncertainty_other,
    uncertainty_mind_text,
    adaptive_answers,
    initial_assessment,
    generated_prompt,
    status = 'in_progress',
  } = req.body;

  const supabase = getSupabaseAdminClient();

  const recordPayload = {
    user_id: userId && userId !== 'default-user' && !userId.startsWith('demo-') ? userId : null,
    session_id: sessionId,
    status,
    situation_stage,
    situation_other,
    uncertainties: uncertainties || [],
    uncertainty_other,
    uncertainty_mind_text,
    adaptive_answers: adaptive_answers || {},
    initial_assessment: initial_assessment || {},
    generated_prompt,
    updated_at: new Date().toISOString(),
  };

  const storeKey = userId && userId !== 'default-user' ? `user:${userId}` : `session:${sessionId}`;
  clarityStore.set(storeKey, {
    ...(clarityStore.get(storeKey) || {}),
    ...recordPayload,
  });

  if (supabase && userId && !userId.startsWith('demo-')) {
    try {
      const { data: existing } = await supabase
        .from('clarity_assessments')
        .select('id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing?.id) {
        await supabase
          .from('clarity_assessments')
          .update(recordPayload)
          .eq('id', existing.id);
      } else {
        await supabase
          .from('clarity_assessments')
          .insert(recordPayload);
      }
    } catch (err) {
      console.warn('[Clarity] Supabase draft update fallback to memory:', err);
    }
  }

  res.json({
    success: true,
    message: 'Assessment progress saved successfully.',
    data: clarityStore.get(storeKey),
  });
};

export const getAssessment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  const sessionId = (req.headers['x-session-id'] as string) || req.sessionId || 'anonymous-session';
  const supabase = getSupabaseAdminClient();

  if (supabase && userId && !userId.startsWith('demo-')) {
    try {
      const { data, error } = await supabase
        .from('clarity_assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        res.json({ success: true, data });
        return;
      }
    } catch (err) {
      console.warn('[Clarity] Supabase fetch fallback to memory:', err);
    }
  }

  const storeKey = userId && userId !== 'default-user' ? `user:${userId}` : `session:${sessionId}`;
  const localData = clarityStore.get(storeKey) || null;

  res.json({ success: true, data: localData });
};

export const finalizeReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  const sessionId = (req.headers['x-session-id'] as string) || req.sessionId || 'anonymous-session';
  const { handoff_raw, final_report, checklist_state, user_notes } = req.body;

  const storeKey = userId && userId !== 'default-user' ? `user:${userId}` : `session:${sessionId}`;
  const existing = clarityStore.get(storeKey) || {};

  const updatedRecord = {
    ...existing,
    status: 'completed',
    handoff_raw,
    final_report,
    checklist_state: checklist_state || {},
    user_notes,
    updated_at: new Date().toISOString(),
  };

  clarityStore.set(storeKey, updatedRecord);

  const supabase = getSupabaseAdminClient();
  if (supabase && userId && !userId.startsWith('demo-')) {
    try {
      await supabase
        .from('clarity_assessments')
        .update({
          status: 'completed',
          handoff_raw,
          final_report,
          checklist_state: checklist_state || {},
          user_notes,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);
    } catch (err) {
      console.warn('[Clarity] Supabase finalize error:', err);
    }
  }

  res.json({
    success: true,
    message: 'Personal clarity report finalized successfully.',
    data: updatedRecord,
  });
};

export const transferClarityToDashboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId || 'default-user';
  const { final_report } = req.body;

  if (!final_report) {
    res.status(400).json({ success: false, error: 'Final report data is required.' });
    return;
  }

  const supabase = getSupabaseAdminClient();

  const careerTitle = final_report.strategic_direction?.selected_direction || 'Personal Career Trajectory';
  const summary = final_report.executive_summary?.summary || 'Tailored from Clarity Compass';

  // Create plan structure
  const rawApprovedPlan = {
    profile: {
      preferred_name: final_report.user_name || 'Explorer',
      current_field: final_report.current_stage || 'Career Transition',
    },
    career_direction: {
      primary_career_direction: careerTitle,
      career_description: summary,
      why_this_direction_was_suggested: final_report.strategic_direction?.rationale || '',
      alternative_career_paths: (final_report.explored_directions || []).map((d: any) => d.title),
      confidence_level: 'High (Clarity Compass Verified)',
    },
    strengths_and_skills: {
      existing_strengths: final_report.understanding_you?.strengths_possessed || [],
      skills_to_improve: (final_report.skills_plan || []).map((s: any) => s.skill_name),
    },
    roadmap: {
      long_term_goal: final_report.personal_commitment?.commitment_statement || 'Master target career trajectory',
      milestones: (final_report.roadmap || []).flatMap((r: any, rIdx: number) =>
        (r.milestones || []).map((m: string, mIdx: number) => ({
          id: `ms-clarity-${rIdx}-${mIdx}`,
          stage: r.timeframe?.includes('Immediate') ? 'Foundation' : 'Skill Development',
          title: m,
          description: r.description || '',
          target_duration: r.timeframe || '30 days',
          is_completed: false,
        }))
      ),
    },
    action_checklist: (final_report.action_checklist || []).map((act: any, idx: number) => ({
      id: act.id || `act-${idx}`,
      title: act.task,
      category: 'Core',
      priority: act.timeframe === 'Immediate' ? 'High' : 'Medium',
      is_completed: Boolean(act.completed),
    })),
  };

  if (supabase && userId !== 'default-user' && !userId.startsWith('demo-')) {
    try {
      // 1. Insert or update active career plan
      const { data: planRecord, error: planError } = await supabase
        .from('career_plans')
        .insert({
          user_id: userId,
          title: careerTitle,
          primary_career_direction: careerTitle,
          career_summary: summary,
          raw_approved_plan: rawApprovedPlan,
          status: 'active',
        })
        .select()
        .single();

      if (!planError && planRecord) {
        // 2. Insert milestones
        const milestones = rawApprovedPlan.roadmap.milestones.map((m: any, idx: number) => ({
          user_id: userId,
          career_plan_id: planRecord.id,
          title: m.title,
          description: m.description,
          stage: m.stage,
          sequence_order: idx + 1,
          is_completed: false,
        }));

        if (milestones.length) {
          await supabase.from('milestones').insert(milestones);
        }

        // 3. Insert tasks
        const tasks = rawApprovedPlan.action_checklist.map((t: any, idx: number) => ({
          user_id: userId,
          career_plan_id: planRecord.id,
          title: t.title,
          category: t.category,
          priority: t.priority,
          display_order: idx + 1,
          is_completed: t.is_completed,
        }));

        if (tasks.length) {
          await supabase.from('tasks').insert(tasks);
        }
      }
    } catch (err) {
      console.warn('[Clarity] Supabase dashboard transfer fallback:', err);
    }
  }

  res.json({
    success: true,
    message: 'Clarity Compass successfully converted into your active Career Dashboard!',
    data: rawApprovedPlan,
  });
};
