-- ==============================================================================
-- FOYC (Figure Out Your Career) — Clarity Compass Persistence Schema
-- Version: 1.0
-- Target Project ID: rlrzdvebvbtegxixyfrb
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.clarity_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'prompt_generated', 'handoff_imported', 'completed', 'archived')),
    
    -- Stage 1-3 Questionnaire Answers
    situation_stage TEXT,
    situation_other TEXT,
    uncertainties JSONB DEFAULT '[]'::jsonb,
    uncertainty_other TEXT,
    uncertainty_mind_text TEXT,
    adaptive_answers JSONB DEFAULT '{}'::jsonb,
    
    -- Stage 4-5 Generated Assets
    initial_assessment JSONB DEFAULT '{}'::jsonb,
    generated_prompt TEXT,
    
    -- Stage 6-7 Handoff & Final Report
    handoff_raw TEXT,
    final_report JSONB DEFAULT '{}'::jsonb,
    checklist_state JSONB DEFAULT '{}'::jsonb,
    user_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_clarity_assessments_user_id ON public.clarity_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_clarity_assessments_session_id ON public.clarity_assessments(session_id);
CREATE INDEX IF NOT EXISTS idx_clarity_assessments_status ON public.clarity_assessments(status);

-- Enable Row Level Security
ALTER TABLE public.clarity_assessments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own clarity assessments" ON public.clarity_assessments;
DROP POLICY IF EXISTS "Users can insert their own clarity assessments" ON public.clarity_assessments;
DROP POLICY IF EXISTS "Users can update their own clarity assessments" ON public.clarity_assessments;
DROP POLICY IF EXISTS "Users can delete their own clarity assessments" ON public.clarity_assessments;

-- Row Level Security: Authenticated users can manage only their own records
CREATE POLICY "Users can view their own clarity assessments"
    ON public.clarity_assessments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clarity assessments"
    ON public.clarity_assessments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clarity assessments"
    ON public.clarity_assessments FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clarity assessments"
    ON public.clarity_assessments FOR DELETE
    USING (auth.uid() = user_id);
