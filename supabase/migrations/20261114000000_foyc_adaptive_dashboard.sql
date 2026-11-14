-- ==============================================================================
-- FOYC MIGRATION: 20261114000000_foyc_adaptive_dashboard.sql
-- ADAPTIVE PERSONALIZED DASHBOARD ENGINE CONFIGURATIONS & THEMES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.dashboard_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dashboard_title TEXT NOT NULL DEFAULT 'Personal Career Workspace',
  dashboard_description TEXT,
  dashboard_type TEXT NOT NULL DEFAULT 'custom',
  primary_purpose TEXT,
  selected_modules JSONB NOT NULL DEFAULT '["personal_vision", "personal_goals", "career_roadmap", "daily_priorities", "habit_tracker", "focus_timer", "skills_learning", "weekly_review"]'::jsonb,
  required_modules JSONB NOT NULL DEFAULT '["personal_vision", "personal_goals", "daily_priorities"]'::jsonb,
  optional_modules JSONB NOT NULL DEFAULT '["projects", "resources", "career_comparison"]'::jsonb,
  excluded_modules JSONB NOT NULL DEFAULT '[]'::jsonb,
  module_reasons JSONB NOT NULL DEFAULT '{}'::jsonb,
  module_order JSONB NOT NULL DEFAULT '["personal_vision", "personal_goals", "career_roadmap", "daily_priorities", "habit_tracker", "focus_timer", "skills_learning", "weekly_review"]'::jsonb,
  dashboard_widgets JSONB NOT NULL DEFAULT '["goal_summary", "focus_timer", "today_priorities", "habit_streak", "weekly_analytics"]'::jsonb,
  theme TEXT NOT NULL DEFAULT 'green',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_dashboard_configurations_user UNIQUE (user_id)
);

-- Index on user_id for high-speed lookup
CREATE INDEX IF NOT EXISTS idx_dashboard_configurations_user_id ON public.dashboard_configurations(user_id);

-- Enable RLS
ALTER TABLE public.dashboard_configurations ENABLE ROW LEVEL SECURITY;

-- Strict User Ownership Policies
DROP POLICY IF EXISTS "Users can view own dashboard configuration" ON public.dashboard_configurations;
CREATE POLICY "Users can view own dashboard configuration"
  ON public.dashboard_configurations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own dashboard configuration" ON public.dashboard_configurations;
CREATE POLICY "Users can create own dashboard configuration"
  ON public.dashboard_configurations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own dashboard configuration" ON public.dashboard_configurations;
CREATE POLICY "Users can update own dashboard configuration"
  ON public.dashboard_configurations FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own dashboard configuration" ON public.dashboard_configurations;
CREATE POLICY "Users can delete own dashboard configuration"
  ON public.dashboard_configurations FOR DELETE
  USING (auth.uid() = user_id);
