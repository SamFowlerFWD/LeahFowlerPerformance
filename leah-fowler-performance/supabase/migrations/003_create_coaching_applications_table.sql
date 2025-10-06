-- Create coaching_applications table for storing application form submissions
-- This table stores data from the coaching application form on the website

CREATE TABLE IF NOT EXISTS public.coaching_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  programme TEXT NOT NULL,
  goals TEXT NOT NULL,
  experience TEXT,
  availability TEXT,
  location TEXT,
  message TEXT,
  data_consent BOOLEAN NOT NULL DEFAULT false,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  status TEXT DEFAULT 'pending',
  metadata JSONB DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_coaching_applications_email ON public.coaching_applications(email);
CREATE INDEX IF NOT EXISTS idx_coaching_applications_status ON public.coaching_applications(status);
CREATE INDEX IF NOT EXISTS idx_coaching_applications_submitted_at ON public.coaching_applications(submitted_at DESC);

-- Enable Row Level Security
ALTER TABLE public.coaching_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role can do everything" ON public.coaching_applications;
DROP POLICY IF NOT EXISTS "Admins can read coaching applications" ON public.coaching_applications;

-- Create policy to allow service role to do everything (for API)
CREATE POLICY "Service role can do everything"
  ON public.coaching_applications
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create policy to allow authenticated admins to read
CREATE POLICY "Admins can read coaching applications"
  ON public.coaching_applications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- Add comment
COMMENT ON TABLE public.coaching_applications IS 'Stores coaching application submissions from the website';
