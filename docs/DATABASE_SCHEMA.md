# FOYC Database Architecture & Schema Reference

**Target Supabase Project ID:** `rlrzdvebvbtegxixyfrb`  
**Migration Path:** `supabase/migrations/20261113000000_foyc_core_schema.sql`  
**Database Engine:** PostgreSQL 15+ (with `pgcrypto` and `uuid-ossp`)

---

## 1. Relational Entity Overview

FOYC utilizes a normalized, 11-table schema designed for strict user data sovereignty, relational integrity, and rapid indexed querying.

```
auth.users (Supabase Managed)
    └── profiles (1:1 via foreign key auth.uid())
            ├── discovery_sessions (1:N anonymous / authenticated exploration)
            │       └── career_reports (1:1 generated discovery findings)
            ├── career_plans (1:N active career roadmaps)
            │       ├── milestones (1:N chronological progress stages)
            │       ├── tasks (1:N learning checklist actions)
            │       ├── habits (1:N daily micro-practices)
            │       │       └── habit_logs (1:N daily check-in records)
            │       ├── projects (1:N proof-of-work capstones)
            │       └── resources (1:N curated learning assets)
            └── weekly_reviews (1:N weekly reflections & calibrations)
```

---

## 2. Table Definitions & Constraints

### 2.1 `profiles`
Stores user profile attributes, career stage, and preference flags.
- `id` (UUID, PK): References `auth.users.id` with `ON DELETE CASCADE`.
- `email` (TEXT, NOT NULL).
- `full_name` (TEXT): Display name.
- `avatar_url` (TEXT): Optional profile picture URL.
- `career_stage` (TEXT): e.g. `student`, `career_switcher`, `working_professional`, `self_taught`, `founder`.
- `current_profession` (TEXT): Free text input from onboarding.
- `target_weekly_hours` (INTEGER): Default `10`.
- `created_at` / `updated_at` (TIMESTAMPTZ).

### 2.2 `discovery_sessions`
Tracks discovery journeys, whether initiated anonymously before signup or after login.
- `id` (UUID, PK, `gen_random_uuid()`).
- `user_id` (UUID, FK -> `profiles.id`, nullable for pre-auth sessions).
- `session_token` (TEXT, UNIQUE): Browser-persisted identifier.
- `status` (TEXT): `draft`, `prompt_generated`, `handoff_received`, `completed`.
- `onboarding_answers` (JSONB): Structured answers to 3 onboarding questions.
- `reflection_notes` (TEXT): Raw "What's On Your Mind" user submission.
- `created_at` / `updated_at` (TIMESTAMPTZ).

### 2.3 `career_reports`
Stores intermediate recommendations and analysis.
- `id` (UUID, PK).
- `session_id` (UUID, FK -> `discovery_sessions.id`, `ON DELETE CASCADE`).
- `primary_title` (TEXT, NOT NULL).
- `fit_score` (INTEGER): Estimated percentage alignment (e.g. 96).
- `summary` (TEXT): Executive summary.
- `recommended_paths` (JSONB): Alternative career trajectories.
- `strengths_identified` (JSONB): Discovered competitive advantages.
- `skill_gaps` (JSONB): Matrix of missing competencies.

### 2.4 `career_plans`
The central command entity powering the user's dashboard.
- `id` (UUID, PK).
- `user_id` (UUID, FK -> `profiles.id`, `ON DELETE CASCADE`).
- `discovery_session_id` (UUID, FK -> `discovery_sessions.id`, nullable).
- `primary_title` (TEXT, NOT NULL).
- `tagline` (TEXT): Short career positioning statement.
- `executive_summary` (TEXT).
- `long_term_ambition` (TEXT).
- `is_active` (BOOLEAN, DEFAULT true).
- `version` (INTEGER, DEFAULT 1).
- `created_at` / `updated_at` (TIMESTAMPTZ).

### 2.5 `milestones`
Chronological career timeline stages.
- `id` (UUID, PK).
- `plan_id` (UUID, FK -> `career_plans.id`, `ON DELETE CASCADE`).
- `sequence_order` (INTEGER, NOT NULL).
- `stage` (TEXT): `Foundation`, `Skill Development`, `Practical Application`, `Professional Readiness`, `Career Growth`.
- `title` (TEXT, NOT NULL).
- `description` (TEXT).
- `estimated_duration` (TEXT): e.g. `Weeks 1-4`.
- `status` (TEXT): `completed`, `in_progress`, `upcoming`.
- `start_date` / `target_date` / `completed_at` (TIMESTAMPTZ).

### 2.6 `tasks`
Atomic checklist items linked to learning milestones.
- `id` (UUID, PK).
- `plan_id` (UUID, FK -> `career_plans.id`, `ON DELETE CASCADE`).
- `milestone_id` (UUID, FK -> `milestones.id`, nullable).
- `title` (TEXT, NOT NULL).
- `category` (TEXT): `Foundation`, `Backend`, `Database`, `DevOps`, `Portfolio`, `Career`.
- `priority` (TEXT): `high`, `medium`, `low`.
- `estimated_hours` (NUMERIC(5,2)).
- `is_completed` (BOOLEAN, DEFAULT false).
- `completed_at` (TIMESTAMPTZ).
- `due_date` (TIMESTAMPTZ).
- `notes` (TEXT).

### 2.7 `habits`
Repeatable daily micro-habits building professional momentum.
- `id` (UUID, PK).
- `plan_id` (UUID, FK -> `career_plans.id`, `ON DELETE CASCADE`).
- `title` (TEXT, NOT NULL).
- `frequency` (TEXT): `daily`, `weekdays`, `weekly`.
- `target_duration_minutes` (INTEGER).
- `current_streak` (INTEGER, DEFAULT 0).
- `longest_streak` (INTEGER, DEFAULT 0).
- `is_active` (BOOLEAN, DEFAULT true).

### 2.8 `habit_logs`
Historical log of habit executions preventing duplicate daily entries.
- `id` (UUID, PK).
- `habit_id` (UUID, FK -> `habits.id`, `ON DELETE CASCADE`).
- `log_date` (DATE, NOT NULL).
- `completed` (BOOLEAN, DEFAULT true).
- `notes` (TEXT).
- **Unique Constraint:** `(habit_id, log_date)`.

### 2.9 `projects`
Proof-of-work portfolio capstones.
- `id` (UUID, PK).
- `plan_id` (UUID, FK -> `career_plans.id`, `ON DELETE CASCADE`).
- `title` (TEXT, NOT NULL).
- `description` (TEXT).
- `skills_demonstrated` (TEXT[]).
- `difficulty` (TEXT): `Beginner`, `Intermediate`, `Advanced`.
- `status` (TEXT): `planned`, `in_progress`, `completed`.
- `github_url` (TEXT).
- `live_demo_url` (TEXT).

### 2.10 `resources`
Curated learning materials categorized by media type.
- `id` (UUID, PK).
- `plan_id` (UUID, FK -> `career_plans.id`, `ON DELETE CASCADE`).
- `title` (TEXT, NOT NULL).
- `type` (TEXT): `Documentation`, `Course`, `Book`, `Practice`, `Video`.
- `url` (TEXT).
- `is_free` (BOOLEAN, DEFAULT true).
- `estimated_hours` (INTEGER).
- `difficulty` (TEXT): `Foundational`, `Intermediate`, `Advanced`.

### 2.11 `weekly_reviews`
Sunday calibration logs for reflection and habit feedback.
- `id` (UUID, PK).
- `plan_id` (UUID, FK -> `career_plans.id`, `ON DELETE CASCADE`).
- `week_number` (INTEGER, NOT NULL).
- `review_date` (DATE, NOT NULL).
- `accomplishments` (TEXT, NOT NULL).
- `blockers` (TEXT).
- `key_learnings` (TEXT).
- `direction_clarity_score` (INTEGER, 1-100).
- `next_week_priorities` (TEXT).

---

## 3. Row Level Security (RLS) Policies

All tables have RLS explicitly enabled:
`ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;`

Each policy verifies that `auth.uid()` matches the owner:
```sql
CREATE POLICY "Users can manage own career plans"
  ON career_plans FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

For child tables (`milestones`, `tasks`, `habits`, `projects`, `resources`, `weekly_reviews`), policies join against `career_plans`:
```sql
CREATE POLICY "Users can manage plan milestones"
  ON milestones FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM career_plans
      WHERE career_plans.id = milestones.plan_id
      AND career_plans.user_id = auth.uid()
    )
  );
```
