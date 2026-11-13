-- ==============================================================================
-- FOYC (Figure Out Your Career) — Possibility Explorer Persistence Schema
-- Version: 1.0 (Feature 02 of FOYC Discovery Studio)
-- Target Project ID: rlrzdvebvbtegxixyfrb
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.possibility_explorations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'prompt_generated', 'handoff_imported', 'completed', 'archived')),
    
    -- Questionnaire Responses
    life_stage TEXT,
    life_stage_other TEXT,
    background_data JSONB DEFAULT '{}'::jsonb,
    interests JSONB DEFAULT '[]'::jsonb,
    interests_other TEXT,
    skills_possessed JSONB DEFAULT '[]'::jsonb,
    skills_to_develop JSONB DEFAULT '[]'::jsonb,
    ambitions JSONB DEFAULT '[]'::jsonb,
    ambition_vision TEXT,
    practical_boundaries JSONB DEFAULT '{}'::jsonb,
    additional_context TEXT,
    
    -- Generated Master Prompt
    generated_prompt TEXT,
    
    -- Handoff & Parsed Possibility Report
    handoff_raw TEXT,
    final_report JSONB DEFAULT '{}'::jsonb,
    shortlist JSONB DEFAULT '[]'::jsonb,
    experiments_state JSONB DEFAULT '[]'::jsonb,
    checklist_state JSONB DEFAULT '[]'::jsonb,
    selected_direction JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_possibility_explorations_user_id ON public.possibility_explorations(user_id);
CREATE INDEX IF NOT EXISTS idx_possibility_explorations_session_id ON public.possibility_explorations(session_id);
CREATE INDEX IF NOT EXISTS idx_possibility_explorations_status ON public.possibility_explorations(status);

-- Enable Row Level Security
ALTER TABLE public.possibility_explorations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own possibility explorations" ON public.possibility_explorations;
DROP POLICY IF EXISTS "Users can insert their own possibility explorations" ON public.possibility_explorations;
DROP POLICY IF EXISTS "Users can update their own possibility explorations" ON public.possibility_explorations;
DROP POLICY IF EXISTS "Users can delete their own possibility explorations" ON public.possibility_explorations;

-- Row Level Security: Authenticated users can manage only their own records
CREATE POLICY "Users can view their own possibility explorations"
    ON public.possibility_explorations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own possibility explorations"
    ON public.possibility_explorations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own possibility explorations"
    ON public.possibility_explorations FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own possibility explorations"
    ON public.possibility_explorations FOR DELETE
    USING (auth.uid() = user_id);
