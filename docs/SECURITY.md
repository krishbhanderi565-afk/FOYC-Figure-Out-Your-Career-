# FOYC Security & Privacy Architecture

## 1. Principles of Security

1. **User Data Sovereignty:** Users own their career data and can export it as JSON or purge it at any time.
2. **Zero ChatGPT Session Intrusions:** FOYC never touches user ChatGPT browser sessions, tokens, or private conversational threads.
3. **Defense in Depth:** Rate limiting, strict payload size ceilings, sanitized JSON schemas, and Row Level Security (RLS).

---

## 2. Network & Boundary Defenses

### 2.1 In-Memory Rate Limiting
- Middleware: `backend/src/middleware/rateLimiter.ts`
- Window: 60 seconds
- Quota: 150 requests per IP address
- Behavior: Returns HTTP 429 Too Many Requests with retry-after metadata when exceeded.

### 2.2 Payload Size Constraints
- Body Parser Limit: Set strictly to `500KB` on all incoming POST/PUT routes.
- Prevents memory ballooning and JSON parsing denial-of-service attacks.

### 2.3 Cross-Origin Resource Sharing (CORS)
- Middleware: Configured via Express `cors` middleware.
- Permitted origins: Local development hosts (`localhost`, `127.0.0.1`), Vite dev ports, and production domains.

---

## 3. Database Security & PostgreSQL RLS

- Target Database: Supabase PostgreSQL (`rlrzdvebvbtegxixyfrb`).
- All 11 tables have PostgreSQL Row Level Security enabled.
- User data isolation is enforced at the database layer via `auth.uid() = user_id`.
- Even in the event of an application logic anomaly, PostgreSQL prevents any cross-tenant record reads or writes.

---

## 4. Input Sanitization & Handoff Schema Integrity

- Delimited boundary parser isolates content strictly between:
  `FOYC_HANDOFF_START` and `FOYC_HANDOFF_END`
- Parsed payload must conform strictly to `foyc_handoff_v1` JSON Schema specifications (`docs/DASHBOARD_HANDOFF_SCHEMA.json`).
- Prevents prompt injection, script execution, or malformed data insertion into the relational tables.

---

## 5. Authentication & Token Handling

- Built on Supabase Auth (JWT based).
- Anonymous sessions persist locally in browser `localStorage`.
- During signup/login, the anonymous discovery session token is exchanged and transferred to the authenticated profile via `POST /api/dashboard/save`.
