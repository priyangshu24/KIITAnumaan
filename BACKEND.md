# Backend

KIITAnumaan is backed by **Supabase** (managed Postgres + Auth), deployed on **Vercel**
alongside the Next.js app, with a small **Piston**-backed judge for the FORCE code
editor. Everything degrades to "signed-out, local-only" mode automatically if
Supabase isn't configured yet — see [Local dev without a Supabase project](#local-dev-without-a-supabase-project).

## Setup (one-time)

1. **Create a Supabase project** at [supabase.com](https://supabase.com/dashboard) (free tier is enough to start).
2. **Run the schema.** Dashboard → SQL Editor → New query → paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql) → Run. This creates every table, enables
   Row Level Security on all of them, and wires the `profiles` auto-create trigger.
3. **Copy your keys.** Project Settings → API → copy the Project URL, `anon` `public`
   key, and `service_role` `secret` key.
4. **Set env vars.** Copy `.env.local.example` to `.env.local` and fill in the three
   Supabase values (see below for what `PISTON_API_URL` is).
5. *(Optional)* **Enable Google sign-in.** Authentication → Providers → Google, if you
   want the "Continue with Google" button on `/login` to work. Email/password auth
   works out of the box with no extra setup.
6. **Regenerate types once you're set up** (replaces the hand-written stand-in):
   ```
   npx supabase gen types typescript --project-id <your-project-ref> > lib/supabase/types.ts
   ```
7. Deploy: on Vercel, add the same env vars in Project Settings → Environment
   Variables. No other infra to provision — Vercel hosts the app + API routes,
   Supabase hosts the database/auth, Piston's public instance handles execution.

## What's wired up

| Area | Where | Notes |
|---|---|---|
| **Auth** | `/login`, `/signup`, `middleware.ts`, `app/auth/callback` | Real Supabase email/password + Google OAuth. Session cookies refreshed on every request by the root middleware. `WorkspaceNavbar` shows the signed-in user and has a working Sign out. |
| **Code execution / judging** | `app/api/judge/route.ts` | Proxies to [Piston](https://github.com/engineer-man/piston) (free, sandboxed, no key needed against the public instance). Runtimes are resolved dynamically from Piston's `/runtimes` so no version strings go stale. Every run is logged to `submissions` (best-effort). Wired into the FORCE editor's Run button for every language except JavaScript, which still runs natively in-browser. |
| **Cross-device sync — System Design boards** | `app/api/boards/[promptId]/route.ts`, `SystemDesignPlayground.tsx` | Boards still autosave to `localStorage` first (instant, works offline/signed-out), then best-effort sync to your account when you're signed in. On load, an account copy (if any) overrides the local snapshot once it arrives — so the same board follows you across devices. |
| **Content/admin layer (schema only)** | `tracks`, `topics`, `questions`, `problems` tables in `supabase/schema.sql` | Public-read, admin-write (via `profiles.is_admin`). **Not yet populated** — the app still reads its interview-track and problem content from the hardcoded `lib/*.ts` files. This gives that data a real home to migrate into; see below. |
| **Generic per-user storage** | `kv_store`, `bookmarks`, `drill_progress` tables | Schema + RLS ready, not yet consumed by any component — the fastest path for migrating the remaining `localStorage` keys (bookmarks, drill "known" flags, solved logs, notebook state, readiness checklists, editor settings, ...) one at a time. |

## Follow-up work (intentionally not done in this pass)

- **Migrate the rest of localStorage.** Every `kiit:*` key outside of boards
  still lives only in the browser. The `kv_store` table (a generic per-user
  JSON bucket) and the typed `bookmarks`/`drill_progress` tables exist for
  exactly this — wire each consumer component to read/write through a small
  `/api/kv` route (or Supabase directly from a Client Component, since RLS
  makes that safe) instead of `localStorage`, falling back to `localStorage`
  the same way boards do.
- **Seed the content tables.** `tracks`/`topics`/`questions`/`problems` are
  empty. A one-time script reading `lib/interview-tracks.ts`,
  `lib/aiml-interview-data.ts`, `lib/playground-data.ts`, etc. and inserting
  into these tables (via `createServiceClient()`) would let that content be
  edited from an admin UI instead of requiring a code deploy.
- **Admin UI.** The `profiles.is_admin` flag and RLS policies are in place;
  there's no UI yet to flip that flag or manage content tables — today that's
  a manual `update profiles set is_admin = true where id = '<uuid>'` in the
  SQL editor.
- **Self-host Piston** if you outgrow the public instance's rate limit — the
  project is a single Docker Compose file; point `PISTON_API_URL` at it and
  nothing else changes.

## Local dev without a Supabase project

Every Supabase client falls back to a harmless placeholder URL/key
(`lib/supabase/env.ts`) when the env vars aren't set, so `npm run dev` /
`npm run build` work immediately after `git clone` — you just get a
signed-out app with no cross-device sync until you complete the setup above.
The FORCE editor's judge still works with zero setup (Piston's public
instance needs no keys).
