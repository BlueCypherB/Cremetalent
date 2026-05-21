-- =============================================================
-- CrémeTalent — Supabase Database Schema
-- Run this in the Supabase SQL Editor (supabase.com → your project → SQL Editor)
-- =============================================================

-- ---------------------------------------------------------------
-- Shared: updated_at trigger function
-- ---------------------------------------------------------------
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;


-- ---------------------------------------------------------------
-- Table: talent_applications
-- ---------------------------------------------------------------
create table public.talent_applications (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- Personal
  first_name        text not null,
  last_name         text not null,
  email             text not null,
  phone             text not null,
  city              text not null,
  country           text not null,

  -- Professional
  specialization    text not null,
  experience_level  text not null,
  availability      text not null,
  bio               text not null,
  skills            text[] not null default '{}',

  -- Files & Links
  portfolio_url     text,
  resume_url        text,
  linkedin          text,
  instagram         text,
  twitter           text,
  heard_from        text,

  -- Admin
  status            text not null default 'pending'
                      check (status in ('pending', 'approved', 'rejected')),
  rejection_reason  text,
  admin_notes       text,
  reviewed_at       timestamptz,
  reviewed_by       uuid references auth.users(id),

  -- Consent
  accepted_terms    boolean not null default false
);

create index talent_applications_status_idx on public.talent_applications(status);
create index talent_applications_email_idx  on public.talent_applications(email);

create trigger update_talent_applications_updated_at
  before update on public.talent_applications
  for each row execute function update_updated_at_column();


-- ---------------------------------------------------------------
-- Table: client_intake_submissions
-- ---------------------------------------------------------------
create table public.client_intake_submissions (
  id                      uuid primary key default gen_random_uuid(),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),

  -- Section 1: Client Details
  full_name               text not null,
  company_name            text not null,
  email                   text not null,
  phone                   text not null,
  website                 text,
  location                text not null,
  social_media            text,
  industry                text not null,

  -- Section 2: Project Overview
  project_title           text not null,
  project_type            text not null,
  project_type_other      text,
  objectives              text[] not null default '{}',
  objective_other         text,
  description             text not null,
  start_date              date not null,
  end_date                date,
  important_dates         text,

  -- Section 3: Creative Talent Needs
  digital_services        text[] not null default '{}',
  visual_services         text[] not null default '{}',
  video_services          text[] not null default '{}',
  content_services        text[] not null default '{}',
  media_services          text[] not null default '{}',
  tech_services           text[] not null default '{}',

  -- Section 4: Brand & Style
  has_brand_guidelines    text not null,
  brand_tone              text,
  color_fonts             text,
  inspirational_brands    text,

  -- Section 5: Audience
  target_audience         text not null,
  audience_location       text[] not null default '{}',
  content_platforms       text[] not null default '{}',
  content_platforms_other text,

  -- Section 6: Budget
  budget_range            text not null,
  custom_budget           text,
  payment_structure       text not null,
  payment_structure_other text,

  -- Section 7: Deliverables
  deliverables            text not null,
  kpis                    text[] not null default '{}',
  kpi_other               text,

  -- Section 8: Communication
  primary_contact_name    text not null,
  primary_contact_info    text not null,
  communication_mode      text[] not null default '{}',
  approval_timeline       text not null,
  additional_notes        text,

  -- Admin
  status                  text not null default 'new'
                            check (status in ('new', 'in_review', 'closed')),
  admin_notes             text
);

create index client_intake_email_idx  on public.client_intake_submissions(email);
create index client_intake_status_idx on public.client_intake_submissions(status);

create trigger update_client_intake_updated_at
  before update on public.client_intake_submissions
  for each row execute function update_updated_at_column();


-- ---------------------------------------------------------------
-- Table: projects
-- ---------------------------------------------------------------
create table public.projects (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  title             text not null,
  category          text not null,
  short_description text not null,
  full_description  text not null,
  goal_amount       numeric(12, 2) not null,
  duration_days     integer not null,
  raised_amount     numeric(12, 2) not null default 0,
  backers_count     integer not null default 0,
  slug              text unique,
  image_url         text,
  creator_name      text not null default 'CrémeTalent',
  is_featured       boolean not null default false,
  is_published      boolean not null default false,
  created_by        uuid references auth.users(id)
);

create index projects_category_idx  on public.projects(category);
create index projects_slug_idx      on public.projects(slug);
create index projects_published_idx on public.projects(is_published);

create trigger update_projects_updated_at
  before update on public.projects
  for each row execute function update_updated_at_column();


-- ---------------------------------------------------------------
-- Table: blog_posts
-- ---------------------------------------------------------------
create table public.blog_posts (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  published_at timestamptz,

  title        text not null,
  slug         text unique not null,
  excerpt      text not null,
  body         text,
  category     text not null,
  author_name  text not null,
  read_time    text,
  image_url    text,
  is_featured  boolean not null default false,
  is_published boolean not null default false,
  created_by   uuid references auth.users(id)
);

create index blog_posts_published_idx on public.blog_posts(is_published);
create index blog_posts_category_idx  on public.blog_posts(category);
create index blog_posts_slug_idx      on public.blog_posts(slug);

create trigger update_blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function update_updated_at_column();


-- ---------------------------------------------------------------
-- Table: admin_users (extends auth.users)
-- ---------------------------------------------------------------
create table public.admin_users (
  id          uuid primary key references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  full_name   text,
  role        text not null default 'admin'
                check (role in ('admin', 'super_admin')),
  is_active   boolean not null default true
);


-- =============================================================
-- Row Level Security
-- =============================================================

alter table public.talent_applications       enable row level security;
alter table public.client_intake_submissions  enable row level security;
alter table public.projects                   enable row level security;
alter table public.blog_posts                 enable row level security;
alter table public.admin_users                enable row level security;

-- talent_applications
create policy "Public can submit applications"
  on public.talent_applications for insert
  to anon
  with check (true);

create policy "Admins can read all applications"
  on public.talent_applications for select
  to authenticated
  using (exists (
    select 1 from public.admin_users
    where id = auth.uid() and is_active = true
  ));

create policy "Admins can update applications"
  on public.talent_applications for update
  to authenticated
  using (exists (
    select 1 from public.admin_users
    where id = auth.uid() and is_active = true
  ));

create policy "Admins can delete applications"
  on public.talent_applications for delete
  to authenticated
  using (exists (
    select 1 from public.admin_users
    where id = auth.uid() and is_active = true
  ));

-- Talent self-service (Phase 1)
-- Add user_id column linking talent to their auth account (created on approval)
alter table public.talent_applications
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists talent_applications_user_id_idx
  on public.talent_applications(user_id);

create policy "Talents can read own application"
  on public.talent_applications for select
  to authenticated
  using (user_id = auth.uid());

create policy "Talents can update own application"
  on public.talent_applications for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Trigger: prevent talents from editing admin-controlled fields
create or replace function public.lock_admin_fields_on_talent_update()
returns trigger as $$
begin
  -- If the user editing is NOT an admin, force admin-controlled fields to keep their old values
  if not exists (
    select 1 from public.admin_users
    where id = auth.uid() and is_active = true
  ) then
    new.status            := old.status;
    new.rejection_reason  := old.rejection_reason;
    new.admin_notes       := old.admin_notes;
    new.reviewed_at       := old.reviewed_at;
    new.reviewed_by       := old.reviewed_by;
    new.user_id           := old.user_id;
    new.accepted_terms    := old.accepted_terms;
    new.email             := old.email;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists lock_admin_fields_trg on public.talent_applications;
create trigger lock_admin_fields_trg
  before update on public.talent_applications
  for each row execute function public.lock_admin_fields_on_talent_update();

-- client_intake_submissions
create policy "Public can submit intake forms"
  on public.client_intake_submissions for insert
  to anon
  with check (true);

create policy "Admins can read intake forms"
  on public.client_intake_submissions for select
  to authenticated
  using (exists (
    select 1 from public.admin_users
    where id = auth.uid() and is_active = true
  ));

create policy "Admins can update intake forms"
  on public.client_intake_submissions for update
  to authenticated
  using (exists (
    select 1 from public.admin_users
    where id = auth.uid() and is_active = true
  ));

-- projects
create policy "Public can read published projects"
  on public.projects for select
  to anon
  using (is_published = true);

create policy "Authenticated users can read all projects"
  on public.projects for select
  to authenticated
  using (exists (
    select 1 from public.admin_users
    where id = auth.uid() and is_active = true
  ));

create policy "Admins can manage projects"
  on public.projects for all
  to authenticated
  using (exists (
    select 1 from public.admin_users
    where id = auth.uid() and is_active = true
  ));

-- blog_posts
create policy "Public can read published blog posts"
  on public.blog_posts for select
  to anon
  using (is_published = true);

create policy "Admins can manage blog posts"
  on public.blog_posts for all
  to authenticated
  using (exists (
    select 1 from public.admin_users
    where id = auth.uid() and is_active = true
  ));

-- admin_users
create policy "Admin users can read own record"
  on public.admin_users for select
  to authenticated
  using (id = auth.uid());


-- =============================================================
-- Training Content: Courses & Webinars
-- =============================================================

create table public.courses (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  title         text not null,
  description   text not null,
  category      text not null,
  duration      text not null,
  instructor    text not null,
  video_url     text not null,
  thumbnail_url text,
  sort_order    integer not null default 0,
  is_published  boolean not null default false
);
create index courses_published_idx on public.courses(is_published, sort_order);

create trigger update_courses_updated_at
  before update on public.courses
  for each row execute function update_updated_at_column();

create table public.webinars (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  title            text not null,
  description      text not null,
  host             text not null,
  event_date       timestamptz not null,
  registration_url text not null,
  is_published     boolean not null default false
);
create index webinars_event_date_idx on public.webinars(event_date);

create trigger update_webinars_updated_at
  before update on public.webinars
  for each row execute function update_updated_at_column();

alter table public.courses  enable row level security;
alter table public.webinars enable row level security;

create policy "Public can read published courses"
  on public.courses for select
  to anon
  using (is_published = true);

create policy "Authenticated can read all courses"
  on public.courses for select
  to authenticated
  using (exists (
    select 1 from public.admin_users
    where id = auth.uid() and is_active = true
  ));

create policy "Admins can manage courses"
  on public.courses for all
  to authenticated
  using (exists (
    select 1 from public.admin_users
    where id = auth.uid() and is_active = true
  ));

create policy "Public can read published webinars"
  on public.webinars for select
  to anon
  using (is_published = true);

create policy "Authenticated can read all webinars"
  on public.webinars for select
  to authenticated
  using (exists (
    select 1 from public.admin_users
    where id = auth.uid() and is_active = true
  ));

create policy "Admins can manage webinars"
  on public.webinars for all
  to authenticated
  using (exists (
    select 1 from public.admin_users
    where id = auth.uid() and is_active = true
  ));


-- =============================================================
-- Storage Policies (run after creating the 'resumes' bucket)
-- =============================================================

-- Allow anonymous applicants to upload their resume during application
create policy "Anon can upload resumes"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'resumes');

create policy "Admins can delete resumes"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'resumes'
    and exists (
      select 1 from public.admin_users
      where id = auth.uid() and is_active = true
    )
  );


-- =============================================================
-- Client Accounts & Job Listings (Phase 2)
-- Run this section after the initial schema above.
-- =============================================================

-- ---------------------------------------------------------------
-- Table: client_accounts
-- Same pattern as admin_users: PK = auth.users.id
-- Created by the invite-client Edge Function on admin invitation.
-- ---------------------------------------------------------------
create table if not exists public.client_accounts (
  id           uuid primary key references auth.users(id) on delete cascade,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  full_name    text not null,
  company_name text not null,
  email        text not null,
  phone        text,
  website      text,
  industry     text,
  is_active    boolean not null default true
);

create trigger update_client_accounts_updated_at
  before update on public.client_accounts
  for each row execute function update_updated_at_column();

-- ---------------------------------------------------------------
-- Table: job_listings
-- Owned by client_accounts (client_id = auth.users.id).
-- ---------------------------------------------------------------
create table if not exists public.job_listings (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  client_id        uuid not null references public.client_accounts(id) on delete cascade,

  title            text not null,
  description      text not null,
  specialization   text not null,
  experience_level text,
  engagement_type  text not null
                     check (engagement_type in ('project', 'part-time', 'full-time', 'retainer')),
  location         text,
  is_remote        boolean not null default false,
  budget_range     text,
  deadline         date,
  status           text not null default 'draft'
                     check (status in ('draft', 'open', 'closed')),
  published_at     timestamptz
);

create index if not exists job_listings_client_id_idx      on public.job_listings(client_id);
create index if not exists job_listings_status_idx         on public.job_listings(status);
create index if not exists job_listings_specialization_idx on public.job_listings(specialization);

create trigger update_job_listings_updated_at
  before update on public.job_listings
  for each row execute function update_updated_at_column();

-- Link intake submissions → client accounts (nullable, set on invite)
alter table public.client_intake_submissions
  add column if not exists client_account_id uuid references public.client_accounts(id) on delete set null;

create index if not exists client_intake_client_account_idx
  on public.client_intake_submissions(client_account_id);

-- ---------------------------------------------------------------
-- RLS: client_accounts
-- ---------------------------------------------------------------
alter table public.client_accounts enable row level security;

create policy "Clients can read own account"
  on public.client_accounts for select
  to authenticated
  using (id = auth.uid());

create policy "Admins can manage client accounts"
  on public.client_accounts for all
  to authenticated
  using (exists (
    select 1 from public.admin_users
    where id = auth.uid() and is_active = true
  ));

-- ---------------------------------------------------------------
-- RLS: job_listings
-- ---------------------------------------------------------------
alter table public.job_listings enable row level security;

create policy "Public can read open job listings"
  on public.job_listings for select
  to anon
  using (status = 'open');

create policy "Authenticated can read open job listings"
  on public.job_listings for select
  to authenticated
  using (status = 'open');

create policy "Clients can manage own listings"
  on public.job_listings for all
  to authenticated
  using (client_id = auth.uid())
  with check (client_id = auth.uid());

create policy "Admins can manage all listings"
  on public.job_listings for all
  to authenticated
  using (exists (
    select 1 from public.admin_users
    where id = auth.uid() and is_active = true
  ));

-- ---------------------------------------------------------------
-- Data migration: canonical specialization values
-- Safe — no enum constraint on the column.
-- Run once after deploying the new taxonomy.
-- ---------------------------------------------------------------
-- update public.talent_applications set specialization = 'UX/UI Design'
--   where specialization = 'UI/UX Design';
-- update public.talent_applications set specialization = 'Social Media'
--   where specialization = 'Social Media Management';

-- =============================================================
-- After running this file:
-- 1. Go to Authentication > Users in Supabase dashboard
-- 2. Create your admin user with email + strong password
-- 3. Copy their UUID and run:
--    INSERT INTO public.admin_users (id, full_name, role)
--    VALUES ('<UUID>', 'Your Name', 'super_admin');
-- 4. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local
-- 5. Deploy Edge Functions: supabase functions deploy send-email invite-talent invite-client
-- =============================================================
