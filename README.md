# Samsung Guardian (Phase 2)

Hackathon-ready architecture:
- React frontend (Vite)
- Supabase Auth + Postgres persistence
- Secure backend LLM APIs (`/api/analyze`, `/api/coach`) using Anthropic

## 1) Setup

1. Install dependencies:
   - `npm install`
2. Create env file:
   - `cp .env.example .env`
3. Fill `.env` with your keys:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`

## 2) Supabase SQL

Run this SQL in your Supabase project:

```sql
create table if not exists public.guardian_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  confidence int not null,
  risk_score int not null,
  explanation text,
  recommendation text,
  signals jsonb default '[]'::jsonb,
  conversation_preview text,
  created_at timestamptz not null default now()
);

alter table public.guardian_analyses enable row level security;

create policy "Users can read own analyses"
on public.guardian_analyses
for select
using (auth.uid() = user_id);

create policy "Users can insert own analyses"
on public.guardian_analyses
for insert
with check (auth.uid() = user_id);
```

## 3) Run local demo

- `npm run dev`
- Open `http://localhost:5173`

This starts:
- frontend on `5173`
- backend API on `8787`

## 4) Demo flow for judges

1. Sign up/sign in.
2. Paste one sample conversation in Analyze.
3. Click **Analyze and save** (this calls real LLM backend).
4. Open **Trends** to show computed per-user snapshots from Postgres.
5. Open **Reply Coach** and generate safer alternatives (real LLM endpoint).
6. Open **History** to show persisted per-user records.

## 5) Files changed

- `Phase2`: frontend with Supabase + real API wiring
- `server.js`: secure backend for analysis + coaching
- `src/main.jsx`, `src/Phase2.jsx`, `index.html`, `vite.config.js`: Vite app bootstrap
- `package.json`: scripts + dependencies
- `.env.example`: required envs
