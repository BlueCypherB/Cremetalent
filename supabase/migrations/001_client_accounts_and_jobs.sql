-- =============================================================
-- Migration 001: Client Accounts + Job Postings
-- Run this in the Supabase SQL Editor AFTER the base schema.sql
-- =============================================================

-- ---------------------------------------------------------------
-- 1. Link client intake submissions to auth accounts
-- ---------------------------------------------------------------
ALTER TABLE public.client_intake_submissions
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS client_intake_user_id_idx
  ON public.client_intake_submissions(user_id);

CREATE POLICY "Clients can read own intake submission"
  ON public.client_intake_submissions FOR SELECT TO authenticated
  USING (user_id = auth.uid());


-- ---------------------------------------------------------------
-- 2. client_accounts table (mirrors admin_users pattern)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.client_accounts (
  id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  full_name    text NOT NULL,
  company_name text,
  email        text NOT NULL,
  phone        text,
  location     text,
  is_active    boolean NOT NULL DEFAULT true
);

CREATE TRIGGER update_client_accounts_updated_at
  BEFORE UPDATE ON public.client_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.client_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can read own account"
  ON public.client_accounts FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Clients can insert own account"
  ON public.client_accounts FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Clients can update own account"
  ON public.client_accounts FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can read all client accounts"
  ON public.client_accounts FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND is_active = true
  ));

CREATE POLICY "Admins can manage client accounts"
  ON public.client_accounts FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND is_active = true
  ));


-- ---------------------------------------------------------------
-- 3. job_postings table
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.job_postings (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),

  client_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  title            text NOT NULL,
  company_name     text NOT NULL,
  location         text NOT NULL,
  is_remote        boolean NOT NULL DEFAULT false,
  category         text NOT NULL,
  employment_type  text NOT NULL
                     CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'freelance')),
  experience_level text NOT NULL
                     CHECK (experience_level IN ('Beginner', 'Intermediate', 'Advanced')),
  description      text NOT NULL,
  requirements     text,
  budget_range     text,
  skills_needed    text[] NOT NULL DEFAULT '{}',
  deadline         date,

  status           text NOT NULL DEFAULT 'draft'
                     CHECK (status IN ('draft', 'active', 'closed', 'archived')),
  is_published     boolean NOT NULL DEFAULT false,
  admin_approved   boolean NOT NULL DEFAULT false,
  admin_notes      text
);

CREATE INDEX IF NOT EXISTS job_postings_client_id_idx
  ON public.job_postings(client_id);
CREATE INDEX IF NOT EXISTS job_postings_category_idx
  ON public.job_postings(category);
CREATE INDEX IF NOT EXISTS job_postings_status_idx
  ON public.job_postings(status);
CREATE INDEX IF NOT EXISTS job_postings_published_idx
  ON public.job_postings(is_published, admin_approved);

CREATE TRIGGER update_job_postings_updated_at
  BEFORE UPDATE ON public.job_postings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

-- Public (anon) can read published+approved jobs
CREATE POLICY "Public can read published jobs"
  ON public.job_postings FOR SELECT TO anon
  USING (is_published = true AND admin_approved = true);

-- Authenticated users can read published+approved jobs
CREATE POLICY "Authenticated can read published jobs"
  ON public.job_postings FOR SELECT TO authenticated
  USING (is_published = true AND admin_approved = true);

-- Client owns their postings (all statuses)
CREATE POLICY "Clients can read own postings"
  ON public.job_postings FOR SELECT TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "Clients can insert own postings"
  ON public.job_postings FOR INSERT TO authenticated
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Clients can update own draft or active postings"
  ON public.job_postings FOR UPDATE TO authenticated
  USING (client_id = auth.uid() AND status IN ('draft', 'active'))
  WITH CHECK (client_id = auth.uid());

-- Admins can do everything
CREATE POLICY "Admins can manage all job postings"
  ON public.job_postings FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND is_active = true
  ));
