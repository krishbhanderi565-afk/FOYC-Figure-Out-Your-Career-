# FOYC Application Routing Reference

All routes are fully configured using React Router (`react-router-dom` v7).

## 1. Public Discovery Flow (Zero Forced Login)

| Route | Component | Stage | Description |
| :--- | :--- | :--- | :--- |
| `/` | `LandingPage` | Stage 1 | High-converting neo-editorial landing page with 10 sections |
| `/onboarding` | `OnboardingPage` | Stage 2 | 3-step personal background questionnaire (optional fields skip enabled) |
| `/reflection` | `MindReflectionPage` | Stage 3 | "What's on your mind" open reflection canvas with guidance questions |
| `/mind` | `Redirect` | - | Alias redirecting to `/reflection` |
| `/prompt-ready`| `PromptReadyPage` | Stage 4 | Formatted ChatGPT Coach Prompt, one-click copy & ChatGPT link |
| `/import` | `HandoffImportPage`| Stage 7 | Delimited handoff text importer with clipboard & demo pre-fills |
| `/import-preview`| `HandoffPreviewPage`| Stage 7 Preview | Visual inspection, editing, and approval of parsed roadmap |
| `/auth` | `AuthPage` | Stage 8 | Clean signup/login modal with 1-click instant demo access |
| `/signup` | `AuthPage` | Stage 8 | Alias to signup view |
| `/login` | `AuthPage` | Stage 8 | Alias to login view |

---

## 2. Living Personalized Dashboard Engine (`/dashboard/*`)

| Route | Component | Section | Description |
| :--- | :--- | :--- | :--- |
| `/dashboard` | `OverviewPage` | Section A | Command centre with progress stats, today's checklist, and streak summary |
| `/dashboard/career` | `MyCareerPage` | Section B | Primary career direction, match reasons, skill gaps, and alternatives |
| `/dashboard/roadmap` | `RoadmapPage` | Section C | Chronological interactive timeline with milestone phase toggles |
| `/dashboard/tasks` | `ChecklistPage` | Section D | Task manager with category filtering, modal creation, and status toggles |
| `/dashboard/habits` | `HabitTrackerPage` | Section E | 7-day consistency matrix, streak counter, and habit completion tracker |
| `/dashboard/projects`| `ProjectsPage` | Section F | Proof-of-work capstone portfolio projects with GitHub/URL links |
| `/dashboard/resources`| `ResourcesPage` | Section G | Vetted documentation, courses, books, and practice sandboxes |
| `/dashboard/review` | `WeeklyReviewPage` | Section H | Guided Sunday reflection on accomplishments, blockers, and next priorities |
| `/dashboard/settings`| `SettingsPage` | Section I | Profile preferences, full JSON career plan export, and data reset |
