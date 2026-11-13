# Supabase Configuration & Verification Guide

**Target Project ID:** `rlrzdvebvbtegxixyfrb`  
**Host URL:** `https://rlrzdvebvbtegxixyfrb.supabase.co`

---

## 1. Project Pinning & Integrity Verification

FOYC is strictly bound to Supabase project `rlrzdvebvbtegxixyfrb`.

### Verification Steps:
1. Check backend configuration: `backend/.env`
   ```env
   SUPABASE_URL=https://rlrzdvebvbtegxixyfrb.supabase.co
   SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
2. Verify via health check endpoint:
   ```bash
   curl http://127.0.0.1:5000/api/health
   ```
   Output:
   ```json
   {
     "status": "healthy",
     "targetProjectId": "rlrzdvebvbtegxixyfrb"
   }
   ```

---

## 2. Applying Schema Migrations

The full core schema migration is stored at:  
`supabase/migrations/20261113000000_foyc_core_schema.sql`

To apply using Supabase CLI:
```bash
supabase db push
```

Or apply via the Supabase SQL Editor in project `rlrzdvebvbtegxixyfrb`:
1. Navigate to the SQL Editor in the Supabase Dashboard.
2. Open `supabase/migrations/20261113000000_foyc_core_schema.sql`.
3. Execute the SQL script.

---

## 3. Resilient Dual-Mode Architecture

The backend includes a dual-mode Supabase connector (`backend/src/config/supabase.ts`):
- **Live Supabase Mode:** When valid credentials are provided, all sessions, tasks, and roadmaps persist to the remote PostgreSQL database.
- **Graceful Local Fallback:** If remote credentials are being rotated or network is offline, the backend continues servicing requests via memory cache and returns clean, structured data without crashing or throwing 500 errors.
