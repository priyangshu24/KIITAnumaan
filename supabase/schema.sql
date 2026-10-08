-- =============================================================================
-- KIIT ANUMAAN — Comprehensive Supabase Database Schema & RLS Policies
-- =============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- 1. profiles — Extended student profile tied to Supabase Auth
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  full_name text,
  username text unique,
  avatar_url text,
  college text default 'KIIT',
  course text default 'B.Tech CSE',
  year text default '3rd Year',
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id or auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id or auth.uid() = user_id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id or auth.uid() = user_id);

-- Auto-sync profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, user_id, full_name, avatar_url)
  values (
    new.id,
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    avatar_url = coalesce(excluded.avatar_url, profiles.avatar_url),
    updated_at = now();

  -- Initialize streaks record
  insert into public.streaks (user_id, current_streak, longest_streak)
  values (new.id, 0, 0)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 2. topics — DSA and CS topics/categories
-- ---------------------------------------------------------------------------
create table if not exists public.topics (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text,
  category text default 'DSA',
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.topics enable row level security;

create policy "Topics are readable by everyone"
  on public.topics for select
  using (true);

create policy "Admins can insert/update topics"
  on public.topics for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin));

-- ---------------------------------------------------------------------------
-- 3. questions — Problem bank (Two Sum, etc.)
-- ---------------------------------------------------------------------------
create table if not exists public.questions (
  id text primary key,
  topic_id text references public.topics(id) on delete cascade,
  title text not null,
  slug text not null,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  description text not null,
  examples jsonb not null default '[]'::jsonb,
  constraints text[] not null default '{}',
  starter_code jsonb not null default '{}'::jsonb,
  solution text,
  test_cases jsonb not null default '[]'::jsonb,
  company text[] not null default '{}',
  tags text[] not null default '{}',
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.questions enable row level security;

create policy "Questions are readable by everyone"
  on public.questions for select
  using (true);

create policy "Admins can insert/update questions"
  on public.questions for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin));

-- ---------------------------------------------------------------------------
-- 4. submissions — Code submission logs
-- ---------------------------------------------------------------------------
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  question_id text references public.questions(id) on delete set null,
  code text not null,
  language text not null,
  status text not null, -- 'success' | 'error' | 'timeout'
  runtime integer, -- runtime in ms
  memory integer,  -- memory in KB
  created_at timestamptz not null default now()
);

alter table public.submissions enable row level security;

create policy "Users can read own submissions"
  on public.submissions for select
  using (auth.uid() = user_id);

create policy "Users can insert own submissions"
  on public.submissions for insert
  with check (auth.uid() = user_id or auth.uid() is not null or user_id is null);

-- ---------------------------------------------------------------------------
-- 5. user_progress — Solved and attempted problems per user
-- ---------------------------------------------------------------------------
create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null references public.questions(id) on delete cascade,
  status text not null default 'solved' check (status in ('attempted', 'solved')),
  attempts integer not null default 1,
  best_runtime integer,
  best_memory integer,
  solved_at timestamptz default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, question_id)
);

alter table public.user_progress enable row level security;

create policy "Users can read own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 6. streaks — User daily solving streaks
-- ---------------------------------------------------------------------------
create table if not exists public.streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_active_date date,
  updated_at timestamptz not null default now()
);

alter table public.streaks enable row level security;

create policy "Users can read own streaks"
  on public.streaks for select
  using (auth.uid() = user_id);

create policy "Users can insert/update own streaks"
  on public.streaks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 7. activity — Heatmap contribution calendar
-- ---------------------------------------------------------------------------
create table if not exists public.activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_date date not null default current_date,
  problems_solved integer not null default 0,
  submissions_count integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, activity_date)
);

alter table public.activity enable row level security;

create policy "Users can read own activity"
  on public.activity for select
  using (auth.uid() = user_id);

create policy "Users can insert/update own activity"
  on public.activity for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 8. Supporting tables: boards, bookmarks, drill_progress, kv_store
-- ---------------------------------------------------------------------------
create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  prompt_id text not null,
  nodes jsonb not null default '[]'::jsonb,
  edges jsonb not null default '[]'::jsonb,
  notes text not null default '',
  checked text[] not null default '{}',
  updated_at timestamptz not null default now(),
  unique (user_id, prompt_id)
);

alter table public.boards enable row level security;
create policy "Users own their boards" on public.boards for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.bookmarks (
  user_id uuid not null references auth.users(id) on delete cascade,
  problem_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, problem_id)
);

alter table public.bookmarks enable row level security;
create policy "Users own their bookmarks" on public.bookmarks for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.drill_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  track_slug text not null,
  question_id text not null,
  known boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (user_id, track_slug, question_id)
);

alter table public.drill_progress enable row level security;
create policy "Users own drill progress" on public.drill_progress for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.kv_store (
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

alter table public.kv_store enable row level security;
create policy "Users own kv store" on public.kv_store for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Touch updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_profiles on public.profiles;
create trigger touch_profiles before update on public.profiles
  for each row execute procedure public.touch_updated_at();

drop trigger if exists touch_questions on public.questions;
create trigger touch_questions before update on public.questions
  for each row execute procedure public.touch_updated_at();

drop trigger if exists touch_user_progress on public.user_progress;
create trigger touch_user_progress before update on public.user_progress
  for each row execute procedure public.touch_updated_at();

drop trigger if exists touch_streaks on public.streaks;
create trigger touch_streaks before update on public.streaks
  for each row execute procedure public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Indexes for optimized queries
-- ---------------------------------------------------------------------------
create index if not exists idx_questions_topic_id on public.questions(topic_id);
create index if not exists idx_questions_difficulty on public.questions(difficulty);
create index if not exists idx_submissions_user_id on public.submissions(user_id);
create index if not exists idx_submissions_question_id on public.submissions(question_id);
create index if not exists idx_user_progress_user_id on public.user_progress(user_id);
create index if not exists idx_user_progress_question_id on public.user_progress(question_id);
create index if not exists idx_activity_user_date on public.activity(user_id, activity_date);
create index if not exists idx_streaks_user_id on public.streaks(user_id);
