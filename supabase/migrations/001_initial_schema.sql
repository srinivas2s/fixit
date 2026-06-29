-- ============================================================
-- FixIt Database Schema — Supabase SQL Migration
-- ============================================================
-- Run this in Supabase SQL Editor or as a migration

-- Enable required extensions
create extension if not exists postgis;
create extension if not exists vector;

-- ============================================================
-- ENUMS
-- ============================================================

-- User roles
create type user_role as enum ('citizen', 'department_admin', 'super_admin');

-- Issue categories (AI-classified)
create type issue_category as enum (
  'pothole', 'water_leak', 'broken_streetlight',
  'garbage', 'fallen_tree', 'damaged_sign', 'other'
);

-- Issue lifecycle status
create type issue_status as enum (
  'reported', 'verified', 'in_progress', 'resolved', 'rejected'
);

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  role user_role not null default 'citizen',
  department text,                          -- Only for department_admin role
  reputation_score integer default 100,
  total_reports integer default 0,
  confirmed_reports integer default 0,
  badges text[] default '{}',
  created_at timestamptz default now()
);

-- Reports (core issue tracking)
create table reports (
  id uuid primary key default gen_random_uuid(),
  citizen_id uuid references profiles(id) not null,
  title text not null,
  description text,
  category issue_category not null,
  status issue_status not null default 'reported',
  severity integer not null default 5,           -- 1-10 from AI
  urgency_score integer not null default 0,      -- 0-100 computed
  location geography(Point, 4326) not null,      -- PostGIS point
  address text,
  photo_url text not null,
  photo_embedding vector(1536),                  -- pgvector for duplicate detection
  confirmation_count integer default 0,
  assigned_department text,
  resolved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Report confirmations (upvotes from citizens)
create table confirmations (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references reports(id) on delete cascade,
  citizen_id uuid references profiles(id),
  created_at timestamptz default now(),
  unique(report_id, citizen_id)
);

-- Authority reports (auto-compiled structured reports)
create table authority_reports (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references reports(id) on delete cascade unique,
  compiled_at timestamptz default now(),
  department text not null,
  content jsonb not null
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Spatial index for geo queries (nearby reports, map bounds)
create index reports_location_idx on reports using gist(location);

-- pgvector index for similarity search (duplicate detection)
create index reports_embedding_idx on reports using ivfflat (photo_embedding vector_cosine_ops)
  with (lists = 100);

-- Performance indexes
create index reports_status_idx on reports(status);
create index reports_category_idx on reports(category);
create index reports_citizen_idx on reports(citizen_id);
create index reports_department_idx on reports(assigned_department);
create index reports_urgency_idx on reports(urgency_score desc);
create index reports_created_idx on reports(created_at desc);
create index confirmations_report_idx on confirmations(report_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table profiles enable row level security;
alter table reports enable row level security;
alter table confirmations enable row level security;
alter table authority_reports enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Reports policies
create policy "Public reports are viewable by everyone"
  on reports for select using (true);

create policy "Citizens can insert own reports"
  on reports for insert with check (auth.uid() = citizen_id);

create policy "Citizens can update own reports"
  on reports for update using (auth.uid() = citizen_id);

create policy "Dept admin updates own dept"
  on reports for update using (
    exists (
      select 1 from profiles
      where id = auth.uid()
        and role = 'department_admin'
        and department = reports.assigned_department
    )
  );

create policy "Super admin full access"
  on reports for all using (
    exists (
      select 1 from profiles
      where id = auth.uid()
        and role = 'super_admin'
    )
  );

-- Confirmations policies
create policy "Confirmations are viewable by everyone"
  on confirmations for select using (true);

create policy "Authenticated users can insert confirmations"
  on confirmations for insert with check (auth.uid() = citizen_id);

create policy "Users can delete own confirmations"
  on confirmations for delete using (auth.uid() = citizen_id);

-- Authority reports policies
create policy "Authority reports are viewable by everyone"
  on authority_reports for select using (true);

create policy "Only admins can manage authority reports"
  on authority_reports for all using (
    exists (
      select 1 from profiles
      where id = auth.uid()
        and role in ('department_admin', 'super_admin')
    )
  );

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger reports_updated_at
  before update on reports
  for each row
  execute function update_updated_at();

-- Auto-increment confirmation_count on reports
create or replace function increment_confirmation_count()
returns trigger as $$
begin
  update reports
  set confirmation_count = confirmation_count + 1
  where id = new.report_id;
  return new;
end;
$$ language plpgsql;

create trigger confirmations_increment
  after insert on confirmations
  for each row
  execute function increment_confirmation_count();

-- Auto-decrement confirmation_count on delete
create or replace function decrement_confirmation_count()
returns trigger as $$
begin
  update reports
  set confirmation_count = confirmation_count - 1
  where id = old.report_id;
  return old;
end;
$$ language plpgsql;

create trigger confirmations_decrement
  after delete on confirmations
  for each row
  execute function decrement_confirmation_count();

-- Auto-increment total_reports on citizen profile
create or replace function increment_total_reports()
returns trigger as $$
begin
  update profiles
  set total_reports = total_reports + 1
  where id = new.citizen_id;
  return new;
end;
$$ language plpgsql;

create trigger reports_increment_total
  after insert on reports
  for each row
  execute function increment_total_reports();

-- ============================================================
-- REALTIME
-- ============================================================

-- Enable realtime on reports table for live map updates
alter publication supabase_realtime add table reports;
