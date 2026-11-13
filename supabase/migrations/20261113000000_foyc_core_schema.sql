-- ==============================================================================
-- FOYC (Figure Out Your Career) — Core Production Database Schema
-- Version: 1.0 (MVP)
-- Target Project ID: rlrzdvebvbtegxixyfrb
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    preferred_name TEXT,
    country TEXT,
    age_range TEXT CHECK (age_range IN ('under-18', '18-22', '23-27', '28-35', '36+')),
    education_status TEXT,
    profession TEXT,
    experience_level TEXT,
    preferred_language TEXT DEFAULT 'English',
    available_hours INTEGER DEFAULT 15,
    timezone TEXT DEFAULT 'UTC',
    email_notifications BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ANONYMOUS DISCOVERY SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.discovery_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    anonymous_session_id TEXT UNIQUE NOT NULL,
    profile_data JSONB DEFAULT '{}'::jsonb,
    original_reflection TEXT,
    generated_prompt TEXT,
    approved_plan_draft JSONB,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'handoff_imported', 'converted_to_user', 'expired')),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_discovery_sessions_token ON public.discovery_sessions(anonymous_session_id);

-- 3. CAREER REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.career_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    primary_direction TEXT NOT NULL,
    summary TEXT,
    match_reason TEXT,
    alternative_directions TEXT[] DEFAULT '{}',
    strengths TEXT[] DEFAULT '{}',
    skill_gaps TEXT[] DEFAULT '{}',
    assumptions TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_career_reports_user ON public.career_reports(user_id);

-- 4. CAREER PLANS TABLE
CREATE TABLE IF NOT EXISTS public.career_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    career_report_id UUID REFERENCES public.career_reports(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    career_goal TEXT NOT NULL,
    time_horizon TEXT,
    plan_status TEXT DEFAULT 'active' CHECK (plan_status IN ('active', 'paused', 'completed', 'archived')),
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_career_plans_user ON public.career_plans(user_id);

-- 5. MILESTONES TABLE
CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES public.career_plans(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    stage TEXT NOT NULL CHECK (stage IN ('Foundation', 'Skill Development', 'Practical Application', 'Professional Readiness', 'Career Growth')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    estimated_duration TEXT,
    start_date DATE,
    target_date TEXT,
    completion_criteria TEXT,
    dependencies TEXT[] DEFAULT '{}',
    completed BOOLEAN DEFAULT FALSE,
    sequence_order INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_milestones_plan ON public.milestones(plan_id);
CREATE INDEX IF NOT EXISTS idx_milestones_user ON public.milestones(user_id);

-- 6. TASKS TABLE (Learning Checklist)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES public.milestones(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'Technical' CHECK (category IN ('Foundation', 'Technical', 'Portfolio', 'Networking', 'Job Prep')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    due_date TEXT,
    notes TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_user ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_milestone ON public.tasks(milestone_id);

-- 7. HABITS TABLE
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'custom')),
    target_days_per_week INTEGER DEFAULT 5 CHECK (target_days_per_week BETWEEN 1 AND 7),
    category TEXT DEFAULT 'Skill',
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_habits_user ON public.habits(user_id);

-- 8. HABIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.habit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    completion_date DATE NOT NULL,
    completed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(habit_id, completion_date)
);

CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_date ON public.habit_logs(habit_id, completion_date);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user ON public.habit_logs(user_id);

-- 9. PROJECTS TABLE (Practical Portfolio Proof)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    skills_developed TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in-progress', 'completed')),
    start_date DATE,
    target_date TEXT,
    project_url TEXT,
    achievements TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_user ON public.projects(user_id);

-- 10. RESOURCES TABLE
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Documentation', 'Course', 'Book', 'Video', 'Practice', 'Certification')),
    provider TEXT,
    url TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_free BOOLEAN DEFAULT TRUE,
    estimated_hours INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resources_user ON public.resources(user_id);

-- 11. WEEKLY REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.weekly_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    review_date DATE NOT NULL DEFAULT CURRENT_DATE,
    accomplishments TEXT NOT NULL,
    blockers TEXT,
    lessons TEXT,
    next_priorities TEXT NOT NULL,
    direction_satisfaction TEXT DEFAULT 'satisfied' CHECK (direction_satisfaction IN ('satisfied', 'hesitant', 'reassessing')),
    proposed_adjustments JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weekly_reviews_user ON public.weekly_reviews(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: Users can ONLY access their own records (auth.uid() = user_id)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reviews ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Career Reports Policies
CREATE POLICY "Users can view own career reports" ON public.career_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own career reports" ON public.career_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own career reports" ON public.career_reports FOR UPDATE USING (auth.uid() = user_id);

-- 3. Career Plans Policies
CREATE POLICY "Users can view own career plans" ON public.career_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own career plans" ON public.career_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own career plans" ON public.career_plans FOR UPDATE USING (auth.uid() = user_id);

-- 4. Milestones Policies
CREATE POLICY "Users can view own milestones" ON public.milestones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own milestones" ON public.milestones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own milestones" ON public.milestones FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own milestones" ON public.milestones FOR DELETE USING (auth.uid() = user_id);

-- 5. Tasks Policies
CREATE POLICY "Users can view own tasks" ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON public.tasks FOR DELETE USING (auth.uid() = user_id);

-- 6. Habits Policies
CREATE POLICY "Users can view own habits" ON public.habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habits" ON public.habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habits" ON public.habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habits" ON public.habits FOR DELETE USING (auth.uid() = user_id);

-- 7. Habit Logs Policies
CREATE POLICY "Users can view own habit logs" ON public.habit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habit logs" ON public.habit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habit logs" ON public.habit_logs FOR UPDATE USING (auth.uid() = user_id);

-- 8. Projects Policies
CREATE POLICY "Users can view own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- 9. Resources Policies
CREATE POLICY "Users can view own resources" ON public.resources FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own resources" ON public.resources FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own resources" ON public.resources FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own resources" ON public.resources FOR DELETE USING (auth.uid() = user_id);

-- 10. Weekly Reviews Policies
CREATE POLICY "Users can view own reviews" ON public.weekly_reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reviews" ON public.weekly_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.weekly_reviews FOR UPDATE USING (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATED PROFILE TRIGGER ON NEW AUTH SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, preferred_name)
  VALUES (new.id, new.raw_user_meta_data->>'preferred_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
