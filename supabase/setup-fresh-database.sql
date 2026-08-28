-- ============================================
-- Cisco NetConnect PUP - Manila
-- Fresh Database Setup for Supabase
-- ============================================

-- Enable UUID extension (usually enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE public.users (
  users_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  first_name VARCHAR,
  last_name VARCHAR,
  email VARCHAR,
  role VARCHAR DEFAULT 'authenticated',
  avatar_url TEXT
);

-- Index for email lookups
CREATE INDEX idx_users_email ON public.users(email);

-- ============================================
-- 2. EVENTS TABLE
-- ============================================
CREATE TABLE public.events (
  event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES public.users(users_id) ON DELETE CASCADE,
  event_name VARCHAR NOT NULL,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  location VARCHAR,
  description TEXT,
  price VARCHAR,
  require_approval BOOLEAN DEFAULT false,
  capacity NUMERIC DEFAULT 25,
  form_questions JSONB,
  status VARCHAR,
  created_at TIMESTAMPTZ DEFAULT now(),
  modified_at TIMESTAMPTZ DEFAULT now(),
  registered NUMERIC DEFAULT 0,
  slug TEXT UNIQUE,
  cover_image TEXT,
  post_event_survey JSONB DEFAULT '{"isEnabled": false, "questions": []}',
  certificate_config JSONB,
  registration_open BOOLEAN DEFAULT true,
  theme VARCHAR
);

-- Indexes for events
CREATE INDEX idx_events_organizer_id ON public.events(organizer_id);
CREATE INDEX idx_events_slug ON public.events(slug);
CREATE INDEX idx_events_status ON public.events(status);

-- ============================================
-- 3. REGISTRANTS TABLE
-- ============================================
CREATE TABLE public.registrants (
  registrant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_registered BOOLEAN NOT NULL,
  terms_approval BOOLEAN NOT NULL,
  event_id UUID NOT NULL REFERENCES public.events(event_id) ON DELETE CASCADE,
  form_answers JSONB NOT NULL DEFAULT '{}',
  qr_data TEXT,
  users_id UUID DEFAULT gen_random_uuid() REFERENCES public.users(users_id) ON DELETE SET NULL,
  check_in BOOLEAN NOT NULL DEFAULT false,
  check_in_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT (now() AT TIME ZONE 'utc'),
  is_going BOOLEAN
);

-- Indexes for registrants
CREATE INDEX idx_registrants_event_id ON public.registrants(event_id);
CREATE INDEX idx_registrants_users_id ON public.registrants(users_id);
CREATE INDEX idx_registrants_check_in ON public.registrants(check_in);

-- Unique index on qr_data (only for non-null values)
CREATE UNIQUE INDEX registrants_qr_data_key ON public.registrants(qr_data) WHERE qr_data IS NOT NULL;

-- ============================================
-- 4. SURVEY RESPONSES TABLE
-- ============================================
CREATE TABLE public.survey_responses (
  survey_responses_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(event_id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  users_id UUID REFERENCES public.users(users_id) ON DELETE SET NULL
);

-- Indexes for survey_responses
CREATE INDEX idx_survey_responses_event_id ON public.survey_responses(event_id);
CREATE INDEX idx_survey_responses_users_id ON public.survey_responses(users_id);

-- ============================================
-- 5. AUTO-CREATE USER PROFILE TRIGGER
-- ============================================
-- This trigger automatically creates a users row when a new user signs up via Supabase Auth

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (users_id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users inserts
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 6. AUTO-UPDATE MODIFIED_AT TRIGGER
-- ============================================
-- Updates the modified_at timestamp on events when updated

CREATE OR REPLACE FUNCTION public.update_modified_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.modified_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_modified_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_at();

-- ============================================
-- 7. STORAGE BUCKETS
-- ============================================
-- Run these in Supabase Dashboard > Storage > New Bucket

-- Bucket: event_cover
-- Purpose: Stores event cover images
-- Public: Yes
INSERT INTO storage.buckets (id, name, public)
VALUES ('event_cover', 'event_cover', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket: registration-files
-- Purpose: Stores file uploads from registration forms
-- Public: Yes
INSERT INTO storage.buckets (id, name, public)
VALUES ('registration-files', 'registration-files', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket: certificates
-- Purpose: Stores certificate template images
-- Public: Yes
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 8. STORAGE POLICIES (Public Access)
-- ============================================

-- Policy: Allow public read access to event_cover
CREATE POLICY "Public read access for event_cover"
ON storage.objects
FOR SELECT
USING (bucket_id = 'event_cover');

-- Policy: Allow authenticated users to upload to event_cover
CREATE POLICY "Authenticated users can upload to event_cover"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'event_cover' AND auth.role() = 'authenticated');

-- Policy: Allow public read access to registration-files
CREATE POLICY "Public read access for registration-files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'registration-files');

-- Policy: Allow authenticated users to upload to registration-files
CREATE POLICY "Authenticated users can upload to registration-files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'registration-files' AND auth.role() = 'authenticated');

-- Policy: Allow public read access to certificates
CREATE POLICY "Public read access for certificates"
ON storage.objects
FOR SELECT
USING (bucket_id = 'certificates');

-- Policy: Allow authenticated users to upload to certificates
CREATE POLICY "Authenticated users can upload to certificates"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'certificates' AND auth.role() = 'authenticated');

-- ============================================
-- 9. INITIAL ADMIN USER (Optional)
-- ============================================
-- After signing up through the app, manually promote to admin:
-- UPDATE public.users SET role = 'admin' WHERE email = 'your-admin@email.com';

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- Next steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Configure auth settings in Supabase Dashboard
-- 3. Set environment variables in .env.local:
--    - NEXT_PUBLIC_SUPABASE_URL
--    - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
--    - ARDUINODAYPH_SENDER_EMAIL
--    - ARDUINODAYPH_SENDER_PASSWORD
--    - ARDUINODAYPH_SENDER_NAME
