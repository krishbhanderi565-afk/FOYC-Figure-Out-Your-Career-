# FOYC REST API Specification

**Base URL:** `http://127.0.0.1:5000/api`  
**Protocol:** REST / JSON  
**Rate Limiting:** 150 requests per minute per IP address (`X-RateLimit-*` headers returned)

---

## 1. System Health

### `GET /api/health`
Checks server health, target Supabase project ID, and uptime.
- **Request:** None
- **Response `200 OK`:**
```json
{
  "status": "healthy",
  "product": "FOYC (Figure Out Your Career)",
  "version": "1.0.0",
  "targetProjectId": "rlrzdvebvbtegxixyfrb",
  "databaseMode": "live_supabase_or_fallback",
  "timestamp": "2026-11-13T06:23:00.000Z"
}
```

---

## 2. Discovery & Onboarding Session

### `POST /api/discovery/session`
Initiates an anonymous or user-linked discovery session.
- **Request Body:**
```json
{
  "onboardingAnswers": {
    "situation": "career_switcher",
    "hoursPerWeek": 15,
    "confidence": "moderate"
  },
  "reflectionNotes": "I love systems architecture and logic but feel overwhelmed by conflicting roadmaps."
}
```
- **Response `201 Created`:**
```json
{
  "success": true,
  "sessionId": "b472e391-72da-4b0e-9419-482f347891ba",
  "token": "sess_813f41...",
  "status": "draft"
}
```

### `GET /api/discovery/session/:sessionId`
Retrieves an existing session state and generated prompts.
- **Response `200 OK`**

---

## 3. ChatGPT Coach Prompt Engine

### `POST /api/prompt/generate`
Generates the customized ChatGPT Discovery Coach system prompt.
- **Request Body:**
```json
{
  "sessionId": "b472e391-72da-4b0e-9419-482f347891ba",
  "preferredName": "Alex",
  "careerStage": "career_switcher",
  "reflectionText": "Raw reflections from user...",
  "targetHours": 15
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "coachPrompt": "You are the FOYC Senior Career Discovery Partner & Pragmatic Career Coach...",
  "instructions": [
    "Copy the generated prompt",
    "Open ChatGPT in your browser",
    "Paste prompt and conduct interview",
    "Ask for the FOYC_HANDOFF_START block when satisfied",
    "Copy and paste JSON back into FOYC"
  ]
}
```

---

## 4. Handoff Import & Parsing

### `POST /api/handoff/parse`
Parses and validates the raw text containing delimited `FOYC_HANDOFF_START` and `FOYC_HANDOFF_END` blocks against schema `foyc_handoff_v1`. Payload size limit: 500KB.
- **Request Body:**
```json
{
  "rawHandoffText": "FOYC_HANDOFF_START\n{\n  \"schemaVersion\": \"foyc_handoff_v1\",\n  \"direction\": { ... }\n}\nFOYC_HANDOFF_END"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "parsedPlan": {
    "schemaVersion": "foyc_handoff_v1",
    "direction": {
      "primaryTitle": "Full-Stack Software Engineer",
      "fitScore": 96,
      "tagline": "Architecting resilient web applications...",
      "whyRecommended": "High logical curiosity and structured problem solving.",
      "longTermAmbition": "Lead engineer or engineering founder."
    },
    "milestones": [ ... ],
    "tasks": [ ... ],
    "habits": [ ... ],
    "projects": [ ... ],
    "resources": [ ... ]
  }
}
```
- **Response `400 Bad Request`:**
```json
{
  "success": false,
  "error": "Missing FOYC_HANDOFF delimiters or invalid JSON schema"
}
```

---

## 5. Dashboard Command Centre APIs

### `GET /api/dashboard`
Fetches complete dashboard datasets (roadmap, tasks, habits, projects, resources, reviews).
- **Headers:** `Authorization: Bearer <token>` or session token.
- **Response `200 OK`:** Returns aggregated `DashboardState`.

### `POST /api/dashboard/save`
Saves or updates the active career plan.
- **Request Body:** `DashboardData` JSON object.
- **Response `200 OK`:** `{ "success": true, "planId": "uuid" }`

### `POST /api/dashboard/reassess`
Generates a side-by-side comparison for career pivot or direction change.
- **Request Body:**
```json
{
  "currentDirection": "Full-Stack Software Engineer",
  "targetDirection": "AI Systems & Applied ML Engineer"
}
```
- **Response `200 OK`:**
```json
{
  "currentRole": "Full-Stack Software Engineer",
  "proposedRole": "AI Systems & Applied ML Engineer",
  "transferableSkills": ["TypeScript", "API Architecture", "PostgreSQL"],
  "skillGaps": ["PyTorch", "Embeddings & Vector Databases", "RAG Evaluation"],
  "transitionWeeks": 12,
  "comparisonRecommendation": "High degree of reuse. Foundational CS and database skills transfer directly."
}
```

---

## 6. Granular CRUD Endpoints

- `PATCH /api/tasks/:taskId/toggle`: Toggle checklist task completion.
- `POST /api/tasks`: Create custom learning task.
- `DELETE /api/tasks/:taskId`: Delete checklist task.
- `POST /api/habits/:habitId/log`: Record daily habit completion (idempotent for current date).
- `POST /api/habits`: Create custom daily habit.
- `POST /api/projects`: Add portfolio project capstone.
- `POST /api/reviews`: Submit Sunday weekly calibration review.
