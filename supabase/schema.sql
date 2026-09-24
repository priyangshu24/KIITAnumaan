-- =============================================================================
-- KIITAnumaan — Supabase schema
--
-- Run once against a fresh Supabase project: paste this whole file into the
-- SQL Editor (Supabase dashboard → SQL Editor → New query) and run it, or
-- `supabase db push` if you've wired up the Supabase CLI locally.
--
-- Design:
--  · Auth is Supabase Auth (auth.users) — nothing custom to build there.
--  · Every per-user table is locked down with Row Level Security: a user can
--    only ever read/write rows where user_id = auth.uid(). The anon/public
--    key is safe to ship to the browser because Postgres enforces this, not
--    application code.
--  · Content tables (tracks/topics/questions/problems) are public-read so the
--    app works for signed-out visitors, and write-restricted to admins via
--    the `is_admin` flag on profiles.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- profiles — one row per auth user; created automatically on signup.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are readable by their owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles are updatable by their owner"
  on public.profiles for update
  using (auth.uid() = id);

-- auto-create a profile row the moment someone signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- boards — System Design playground saves (replaces kiit:sd:board:<id> in
-- localStorage once a user is signed in).
-- ---------------------------------------------------------------------------
create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  prompt_id text not null,
  nodes jsonb not null default '[]',
  edges jsonb not null default '[]',
  notes text not null default '',
  checked text[] not null default '{}',
  updated_at timestamptz not null default now(),
  unique (user_id, prompt_id)
);

alter table public.boards enable row level security;

create policy "boards are owned by their user"
  on public.boards for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- bookmarks — starred coding problems (replaces kiit:pg:bookmarks).
-- ---------------------------------------------------------------------------
create table if not exists public.bookmarks (
  user_id uuid not null references auth.users(id) on delete cascade,
  problem_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, problem_id)
);

alter table public.bookmarks enable row level security;

create policy "bookmarks are owned by their user"
  on public.bookmarks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- drill_progress — "known" flags in the Q&A Drill / AI-ML drill trainers.
-- ---------------------------------------------------------------------------
create table if not exists public.drill_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  track_slug text not null,
  question_id text not null,
  known boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (user_id, track_slug, question_id)
);

alter table public.drill_progress enable row level security;

create policy "drill progress is owned by its user"
  on public.drill_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- kv_store — generic per-user JSON bucket. A low-effort landing spot for the
-- many small localStorage keys the app already has (solved log, streaks,
-- readiness checklists, notebook contents, editor settings, ...) so each one
-- can be migrated with a one-line `kv.set(key, value)` instead of a bespoke
-- table + route. Promote a key to its own typed table once it needs querying.
-- ---------------------------------------------------------------------------
create table if not exists public.kv_store (
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

alter table public.kv_store enable row level security;

create policy "kv rows are owned by their user"
  on public.kv_store for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- submissions — a durable log of FORCE-editor judge runs. user_id is
-- nullable so signed-out visitors can still run code; their rows just have
-- no owner and aren't retrievable later.
-- ---------------------------------------------------------------------------
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  problem_id text,
  language text not null,
  source_code text not null,
  stdin text,
  status text not null, -- 'success' | 'error' | 'timeout'
  stdout text,
  stderr text,
  time_ms integer,
  memory_kb integer,
  created_at timestamptz not null default now()
);

alter table public.submissions enable row level security;

create policy "submissions are readable by their owner"
  on public.submissions for select
  using (auth.uid() = user_id);

create policy "anyone can insert a submission"
  on public.submissions for insert
  with check (true);

-- ---------------------------------------------------------------------------
-- Content / admin layer — interview tracks, topics and coding problems.
-- Public-read (the app works for signed-out visitors); write is restricted
-- to profiles.is_admin. This does NOT migrate the data already hardcoded in
-- lib/*.ts — it gives that data a real home to move into next.
-- ---------------------------------------------------------------------------
create table if not exists public.tracks (
  slug text primary key,
  title text not null,
  short text not null,
  icon text not null,
  accent text not null,
  tagline text not null,
  description text not null,
  tags text[] not null default '{}',
  practice_href text
);

create table if not exists public.topics (
  id text primary key,
  track_slug text not null references public.tracks(slug) on delete cascade,
  title text not null,
  icon text not null,
  tagline text not null,
  definition text not null,
  reading jsonb not null default '[]',
  sort_order integer not null default 0
);

create table if not exists public.questions (
  id text primary key,
  topic_id text not null references public.topics(id) on delete cascade,
  level text not null, -- 'Fresher' | 'SDE II' | 'SDE III'
  q text not null,
  outline text[] not null default '{}',
  follow_up text,
  source jsonb
);

create table if not exists public.problems (
  id text primary key,
  title text not null,
  difficulty text not null, -- 'Easy' | 'Medium' | 'Hard'
  topics text[] not null default '{}',
  patterns text[] not null default '{}',
  companies text[] not null default '{}',
  description text not null,
  examples jsonb not null default '[]',
  constraints text[] not null default '{}',
  test_cases jsonb not null default '[]',
  starter_code jsonb not null default '{}'
);

alter table public.tracks enable row level security;
alter table public.topics enable row level security;
alter table public.questions enable row level security;
alter table public.problems enable row level security;

create policy "tracks are public read" on public.tracks for select using (true);
create policy "topics are public read" on public.topics for select using (true);
create policy "questions are public read" on public.questions for select using (true);
create policy "problems are public read" on public.problems for select using (true);

create policy "admins can write tracks" on public.tracks for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin));
create policy "admins can write topics" on public.topics for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin));
create policy "admins can write questions" on public.questions for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin));
create policy "admins can write problems" on public.problems for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin));

-- ---------------------------------------------------------------------------
-- keep updated_at fresh on write
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_boards on public.boards;
create trigger touch_boards before update on public.boards
  for each row execute procedure public.touch_updated_at();

drop trigger if exists touch_drill_progress on public.drill_progress;
create trigger touch_drill_progress before update on public.drill_progress
  for each row execute procedure public.touch_updated_at();

drop trigger if exists touch_kv_store on public.kv_store;
create trigger touch_kv_store before update on public.kv_store
  for each row execute procedure public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- indexes for the lookups the app actually does
-- ---------------------------------------------------------------------------
create index if not exists idx_boards_user on public.boards(user_id);
create index if not exists idx_bookmarks_user on public.bookmarks(user_id);
create index if not exists idx_drill_progress_user_track on public.drill_progress(user_id, track_slug);
create index if not exists idx_submissions_user on public.submissions(user_id);
create index if not exists idx_topics_track on public.topics(track_slug);
create index if not exists idx_questions_topic on public.questions(topic_id);
