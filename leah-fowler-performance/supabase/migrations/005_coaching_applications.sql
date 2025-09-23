-- Create coaching applications table
CREATE TABLE IF NOT EXISTS public.coaching_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  marketing_consent BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'archived')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  contacted_at TIMESTAMPTZ,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_coaching_applications_email ON public.coaching_applications(email);
CREATE INDEX IF NOT EXISTS idx_coaching_applications_status ON public.coaching_applications(status);
CREATE INDEX IF NOT EXISTS idx_coaching_applications_submitted_at ON public.coaching_applications(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_coaching_applications_programme ON public.coaching_applications(programme);

-- Enable Row Level Security
ALTER TABLE public.coaching_applications ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth setup)
CREATE POLICY "Admin users can view all applications" ON public.coaching_applications
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Applications can be inserted by anyone" ON public.coaching_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_coaching_applications_updated_at
  BEFORE UPDATE ON public.coaching_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add some comments for documentation
COMMENT ON TABLE public.coaching_applications IS 'Stores coaching application submissions from the website';
COMMENT ON COLUMN public.coaching_applications.programme IS 'Selected programme: pathway, performance, family, inperson, unsure';
COMMENT ON COLUMN public.coaching_applications.experience IS 'Fitness experience level: beginner, intermediate, advanced, athlete';
COMMENT ON COLUMN public.coaching_applications.status IS 'Application status: pending, contacted, converted, archived';
COMMENT ON COLUMN public.coaching_applications.metadata IS 'Additional data like source page, UTM parameters, etc.';