-- ==============================================================================
-- FOYC (Figure Out Your Career) — Production Schema Update & Complete Alignment
-- Version: 2.0 (Account-based persistent career command platform)
-- Target Project ID: rlrzdvebvbtegxixyfrb
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. PROFILES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    preferred_name TEXT,
    email TEXT,
    country TEXT,
    education TEXT,
    education_status TEXT,
    profession TEXT,
    career_stage TEXT,
    experience_level TEXT,
    profile_summary TEXT,
    avatar_url TEXT,
    age_range TEXT,
    preferred_language TEXT DEFAULT 'English',
    available_hours INTEGER DEFAULT 15,
    timezone TEXT DEFAULT 'UTC',
    email_notifications BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all suggested columns exist if table was previously created
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS education TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS career_stage TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_summary TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- ==============================================================================
-- 2. CAREER PLANS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.career_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    primary_career_direction TEXT,
    career_summary TEXT,
    career_goals JSONB DEFAULT '[]'::jsonb,
    strengths JSONB DEFAULT '[]'::jsonb,
    skill_gaps JSONB DEFAULT '[]'::jsonb,
    alternative_career_paths JSONB DEFAULT '[]'::jsonb,
    roadmap_summary TEXT,
    raw_approved_plan JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.career_plans ADD COLUMN IF NOT EXISTS primary_career_direction TEXT;
ALTER TABLE public.career_plans ADD COLUMN IF NOT EXISTS career_summary TEXT;
ALTER TABLE public.career_plans ADD COLUMN IF NOT EXISTS career_goals JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.career_plans ADD COLUMN IF NOT EXISTS strengths JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.career_plans ADD COLUMN IF NOT EXISTS skill_gaps JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.career_plans ADD COLUMN IF NOT EXISTS alternative_career_paths JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.career_plans ADD COLUMN IF NOT EXISTS roadmap_summary TEXT;
ALTER TABLE public.career_plans ADD COLUMN IF NOT EXISTS raw_approved_plan JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.career_plans ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

CREATE INDEX IF NOT EXISTS idx_career_plans_user ON public.career_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_career_plans_status ON public.career_plans(status);

-- ==============================================================================
-- 3. CAREER MILESTONES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    career_plan_id UUID REFERENCES public.career_plans(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'Skill Development',
    stage TEXT,
    target_date TEXT,
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in-progress', 'completed')),
    completion_date DATE,
    completed BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 1,
    sequence_order INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.milestones ADD COLUMN IF NOT EXISTS career_plan_id UUID REFERENCES public.career_plans(id) ON DELETE CASCADE;
ALTER TABLE public.milestones ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Skill Development';
ALTER TABLE public.milestones ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'planned';
ALTER TABLE public.milestones ADD COLUMN IF NOT EXISTS completion_date DATE;
ALTER TABLE public.milestones ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_milestones_user ON public.milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_milestones_plan ON public.milestones(career_plan_id);

-- ==============================================================================
-- 4. TASKS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    career_plan_id UUID REFERENCES public.career_plans(id) ON DELETE SET NULL,
    milestone_id UUID REFERENCES public.milestones(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'Technical',
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    due_date TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    display_order INTEGER DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS career_plan_id UUID REFERENCES public.career_plans(id) ON DELETE SET NULL;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_tasks_user ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_milestone ON public.tasks(milestone_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);

-- ==============================================================================
-- 5. HABITS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    career_plan_id UUID REFERENCES public.career_plans(id) ON DELETE SET NULL,
    name TEXT,
    title TEXT NOT NULL,
    description TEXT,
    frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'custom')),
    target_count INTEGER,
    target_days_per_week INTEGER DEFAULT 5,
    unit TEXT,
    color TEXT DEFAULT '#526B50',
    schedule TEXT DEFAULT 'everyday' CHECK (schedule IN ('everyday', 'weekday', 'weekend', 'custom')),
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    category TEXT DEFAULT 'Skill',
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS career_plan_id UUID REFERENCES public.career_plans(id) ON DELETE SET NULL;
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS target_count INTEGER;
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS unit TEXT;
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#526B50';
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS schedule TEXT DEFAULT 'everyday';
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS start_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

CREATE INDEX IF NOT EXISTS idx_habits_user ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_status ON public.habits(is_active);

-- ==============================================================================
-- 6. HABIT LOGS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.habit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    completion_date DATE NOT NULL,
    completion_value NUMERIC,
    completed BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(habit_id, completion_date)
);

ALTER TABLE public.habit_logs ADD COLUMN IF NOT EXISTS completion_value NUMERIC;
ALTER TABLE public.habit_logs ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.habit_logs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_date ON public.habit_logs(habit_id, completion_date);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user ON public.habit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_date ON public.habit_logs(completion_date);

-- ==============================================================================
-- 7. PROJECTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    career_plan_id UUID REFERENCES public.career_plans(id) ON DELETE SET NULL,
    name TEXT,
    title TEXT NOT NULL,
    description TEXT,
    project_url TEXT,
    skills_used JSONB DEFAULT '[]'::jsonb,
    skills_developed TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in-progress', 'completed')),
    start_date DATE,
    end_date DATE,
    target_date TEXT,
    achievements TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS career_plan_id UUID REFERENCES public.career_plans(id) ON DELETE SET NULL;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS skills_used JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS end_date DATE;

CREATE INDEX IF NOT EXISTS idx_projects_user ON public.projects(user_id);

-- ==============================================================================
-- 8. WEEKLY REVIEWS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.weekly_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    career_plan_id UUID REFERENCES public.career_plans(id) ON DELETE SET NULL,
    week_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    review_date DATE DEFAULT CURRENT_DATE,
    completed_tasks INTEGER DEFAULT 0,
    completed_habits INTEGER DEFAULT 0,
    achievements TEXT,
    accomplishments TEXT,
    challenges TEXT,
    blockers TEXT,
    lessons TEXT,
    next_week_priorities TEXT,
    next_priorities TEXT,
    notes TEXT,
    direction_satisfaction TEXT DEFAULT 'satisfied',
    proposed_adjustments JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.weekly_reviews ADD COLUMN IF NOT EXISTS career_plan_id UUID REFERENCES public.career_plans(id) ON DELETE SET NULL;
ALTER TABLE public.weekly_reviews ADD COLUMN IF NOT EXISTS week_start_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.weekly_reviews ADD COLUMN IF NOT EXISTS completed_tasks INTEGER DEFAULT 0;
ALTER TABLE public.weekly_reviews ADD COLUMN IF NOT EXISTS completed_habits INTEGER DEFAULT 0;
ALTER TABLE public.weekly_reviews ADD COLUMN IF NOT EXISTS achievements TEXT;
ALTER TABLE public.weekly_reviews ADD COLUMN IF NOT EXISTS challenges TEXT;
ALTER TABLE public.weekly_reviews ADD COLUMN IF NOT EXISTS next_week_priorities TEXT;
ALTER TABLE public.weekly_reviews ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.weekly_reviews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_weekly_reviews_user ON public.weekly_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_reviews_week ON public.weekly_reviews(week_start_date);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: Users can ONLY access their own records (auth.uid() = user_id)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reviews ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Career Plans Policies
DROP POLICY IF EXISTS "Users can view own career plans" ON public.career_plans;
DROP POLICY IF EXISTS "Users can insert own career plans" ON public.career_plans;
DROP POLICY IF EXISTS "Users can update own career plans" ON public.career_plans;
DROP POLICY IF EXISTS "Users can delete own career plans" ON public.career_plans;

CREATE POLICY "Users can view own career plans" ON public.career_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own career plans" ON public.career_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own career plans" ON public.career_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own career plans" ON public.career_plans FOR DELETE USING (auth.uid() = user_id);

-- 3. Milestones Policies
DROP POLICY IF EXISTS "Users can view own milestones" ON public.milestones;
DROP POLICY IF EXISTS "Users can insert own milestones" ON public.milestones;
DROP POLICY IF EXISTS "Users can update own milestones" ON public.milestones;
DROP POLICY IF EXISTS "Users can delete own milestones" ON public.milestones;

CREATE POLICY "Users can view own milestones" ON public.milestones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own milestones" ON public.milestones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own milestones" ON public.milestones FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own milestones" ON public.milestones FOR DELETE USING (auth.uid() = user_id);

-- 4. Tasks Policies
DROP POLICY IF EXISTS "Users can view own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON public.tasks;

CREATE POLICY "Users can view own tasks" ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON public.tasks FOR DELETE USING (auth.uid() = user_id);

-- 5. Habits Policies
DROP POLICY IF EXISTS "Users can view own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can insert own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can update own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can delete own habits" ON public.habits;

CREATE POLICY "Users can view own habits" ON public.habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habits" ON public.habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habits" ON public.habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habits" ON public.habits FOR DELETE USING (auth.uid() = user_id);

-- 6. Habit Logs Policies
DROP POLICY IF EXISTS "Users can view own habit logs" ON public.habit_logs;
DROP POLICY IF EXISTS "Users can insert own habit logs" ON public.habit_logs;
DROP POLICY IF EXISTS "Users can update own habit logs" ON public.habit_logs;
DROP POLICY IF EXISTS "Users can delete own habit logs" ON public.habit_logs;

CREATE POLICY "Users can view own habit logs" ON public.habit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habit logs" ON public.habit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habit logs" ON public.habit_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habit logs" ON public.habit_logs FOR DELETE USING (auth.uid() = user_id);

-- 7. Projects Policies
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;

CREATE POLICY "Users can view own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- 8. Weekly Reviews Policies
DROP POLICY IF EXISTS "Users can view own reviews" ON public.weekly_reviews;
DROP POLICY IF EXISTS "Users can insert own reviews" ON public.weekly_reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON public.weekly_reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON public.weekly_reviews;

CREATE POLICY "Users can view own reviews" ON public.weekly_reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reviews" ON public.weekly_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.weekly_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.weekly_reviews FOR DELETE USING (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATED PROFILE TRIGGER ON NEW AUTH SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, preferred_name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'preferred_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'preferred_name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
