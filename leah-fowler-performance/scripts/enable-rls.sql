-- Enable Row Level Security on all tables
-- Execute this in Supabase SQL Editor

-- Enable RLS on tables that need it
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can manage all profiles" ON public.profiles
  FOR ALL USING (auth.role() = 'service_role');

-- Create policies for assessments
CREATE POLICY "Public can view published assessments" ON public.assessments
  FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can manage assessments" ON public.assessments
  FOR ALL USING (auth.role() = 'service_role');

-- Create policies for coaching applications (allow public submissions)
CREATE POLICY "Anyone can submit coaching applications" ON public.coaching_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own applications" ON public.coaching_applications
  FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Service role can manage all applications" ON public.coaching_applications
  FOR ALL USING (auth.role() = 'service_role');

-- Create policies for testimonials
CREATE POLICY "Public can view approved testimonials" ON public.testimonials
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Service role can manage testimonials" ON public.testimonials
  FOR ALL USING (auth.role() = 'service_role');

-- Create policies for newsletter subscribers
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can manage their own subscription" ON public.newsletter_subscribers
  FOR ALL USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Service role can manage all subscriptions" ON public.newsletter_subscribers
  FOR ALL USING (auth.role() = 'service_role');

-- Grant necessary permissions to anon users
GRANT SELECT ON public.testimonials TO anon;
GRANT INSERT ON public.coaching_applications TO anon;
GRANT INSERT ON public.newsletter_subscribers TO anon;
GRANT SELECT ON public.assessments TO anon;