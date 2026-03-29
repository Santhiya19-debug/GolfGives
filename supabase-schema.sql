-- =====================================================
-- GOLF CHARITY SUBSCRIPTION PLATFORM — SUPABASE SCHEMA
-- Run this in the Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- CHARITIES TABLE
-- ─────────────────────────────────────────
create table charities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null,
  image_url text,
  featured boolean default false,
  total_raised numeric(10,2) default 0,
  created_at timestamptz default now()
);

-- Seed initial charities
insert into charities (name, description, featured) values
  ('Children''s Golf Foundation', 'Bringing golf to underprivileged youth across the UK.', true),
  ('Green Hearts Cancer Trust', 'Funding research and support for cancer patients through golf events.', false),
  ('Veterans on the Fairway', 'Supporting military veterans through golf therapy programmes.', false),
  ('Girls in Golf Initiative', 'Empowering young women to take up golf and sport.', false),
  ('Community Courses Fund', 'Keeping public golf courses affordable and accessible.', false);

-- ─────────────────────────────────────────
-- USER PROFILES TABLE (extends Supabase auth.users)
-- ─────────────────────────────────────────
create table user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  subscription_status text not null default 'inactive'
    check (subscription_status in ('active', 'inactive', 'cancelled', 'lapsed')),
  plan_type text check (plan_type in ('monthly', 'yearly')),
  renewal_date timestamptz,
  charity_id uuid references charities(id),
  contribution_percentage numeric(5,2) default 10
    check (contribution_percentage >= 10 and contribution_percentage <= 100),
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────
-- SUBSCRIPTIONS TABLE
-- ─────────────────────────────────────────
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references user_profiles(id) on delete cascade,
  plan_type text not null check (plan_type in ('monthly', 'yearly')),
  status text not null default 'active'
    check (status in ('active', 'inactive', 'cancelled', 'lapsed')),
  amount numeric(10,2) not null,
  charity_contribution numeric(10,2) not null,
  prize_pool_contribution numeric(10,2) not null,
  start_date timestamptz default now(),
  renewal_date timestamptz not null,
  cancelled_at timestamptz
);

-- ─────────────────────────────────────────
-- SCORES TABLE
-- ─────────────────────────────────────────
create table scores (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references user_profiles(id) on delete cascade,
  score integer not null check (score >= 1 and score <= 45),
  date date not null,
  created_at timestamptz default now()
);

-- Index for fast score queries per user
create index scores_user_id_idx on scores(user_id);
create index scores_date_idx on scores(user_id, date desc);

-- ─────────────────────────────────────────
-- DRAWS TABLE
-- ─────────────────────────────────────────
create table draws (
  id uuid primary key default uuid_generate_v4(),
  numbers integer[] not null,
  type text not null check (type in ('random', 'algorithm')),
  result_date date not null,
  published boolean default false,
  jackpot_amount numeric(10,2) default 0,
  total_pool numeric(10,2) default 0,
  rollover_amount numeric(10,2) default 0,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────
-- DRAW RESULTS TABLE
-- ─────────────────────────────────────────
create table draw_results (
  id uuid primary key default uuid_generate_v4(),
  draw_id uuid not null references draws(id) on delete cascade,
  user_id uuid not null references user_profiles(id) on delete cascade,
  matches integer not null check (matches in (3, 4, 5)),
  prize_amount numeric(10,2) default 0,
  payment_status text default 'pending'
    check (payment_status in ('pending', 'paid', 'rejected')),
  proof_url text,
  verified boolean default false,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────

alter table user_profiles enable row level security;
alter table subscriptions enable row level security;
alter table scores enable row level security;
alter table draws enable row level security;
alter table draw_results enable row level security;
alter table charities enable row level security;

-- User profiles: users see only their own; admins see all
create policy "Users view own profile"
  on user_profiles for select using (auth.uid() = id);

create policy "Users update own profile"
  on user_profiles for update using (auth.uid() = id);

create policy "Service role full access profiles"
  on user_profiles for all using (auth.role() = 'service_role');

-- Scores: users manage their own
create policy "Users manage own scores"
  on scores for all using (auth.uid() = user_id);

create policy "Service role full access scores"
  on scores for all using (auth.role() = 'service_role');

-- Subscriptions: users view own
create policy "Users view own subscription"
  on subscriptions for select using (auth.uid() = user_id);

create policy "Service role full access subscriptions"
  on subscriptions for all using (auth.role() = 'service_role');

-- Draws: everyone can view published draws
create policy "Anyone view published draws"
  on draws for select using (published = true);

create policy "Service role full access draws"
  on draws for all using (auth.role() = 'service_role');

-- Draw results: users see own results
create policy "Users view own results"
  on draw_results for select using (auth.uid() = user_id);

create policy "Service role full access results"
  on draw_results for all using (auth.role() = 'service_role');

-- Charities: public read
create policy "Public read charities"
  on charities for select using (true);

create policy "Service role full access charities"
  on charities for all using (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- FUNCTION: Auto-create profile on signup
-- ─────────────────────────────────────────
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into user_profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();