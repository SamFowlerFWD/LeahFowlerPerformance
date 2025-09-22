-- Leah Fowler Performance Database Schema
-- PostgreSQL schema for Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    location TEXT,
    occupation TEXT,
    company TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Goals table
CREATE TABLE public.performance_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_date DATE,
    category TEXT CHECK (category IN ('career', 'fitness', 'mindset', 'productivity', 'wellbeing', 'leadership')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'archived')),
    priority INTEGER CHECK (priority >= 1 AND priority <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment Results table
CREATE TABLE public.assessment_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assessment_type TEXT NOT NULL CHECK (assessment_type IN ('initial', 'quarterly', 'annual', 'custom')),
    
    -- Performance Dimensions (1-10 scale)
    physical_energy INTEGER CHECK (physical_energy >= 1 AND physical_energy <= 10),
    mental_clarity INTEGER CHECK (mental_clarity >= 1 AND mental_clarity <= 10),
    emotional_balance INTEGER CHECK (emotional_balance >= 1 AND emotional_balance <= 10),
    purpose_alignment INTEGER CHECK (purpose_alignment >= 1 AND purpose_alignment <= 10),
    productivity_efficiency INTEGER CHECK (productivity_efficiency >= 1 AND productivity_efficiency <= 10),
    stress_management INTEGER CHECK (stress_management >= 1 AND stress_management <= 10),
    work_life_balance INTEGER CHECK (work_life_balance >= 1 AND work_life_balance <= 10),
    leadership_impact INTEGER CHECK (leadership_impact >= 1 AND leadership_impact <= 10),
    
    -- Calculated scores
    overall_score DECIMAL(3,1),
    
    -- Recommendations
    strengths TEXT[],
    improvement_areas TEXT[],
    recommended_programme TEXT,
    
    -- Metadata
    responses JSONB,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Programmes table
CREATE TABLE public.programmes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    overview TEXT,
    duration_weeks INTEGER,
    price_gbp DECIMAL(10,2),
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    category TEXT CHECK (category IN ('executive', 'entrepreneur', 'athlete', 'professional', 'custom')),
    features TEXT[],
    outcomes TEXT[],
    is_active BOOLEAN DEFAULT true,
    max_participants INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Programme Enrollments table
CREATE TABLE public.programme_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    programme_id UUID NOT NULL REFERENCES public.programmes(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'completed', 'cancelled', 'paused')),
    start_date DATE,
    end_date DATE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, programme_id)
);

-- Sessions/Workouts table
CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    programme_id UUID REFERENCES public.programmes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    session_type TEXT CHECK (session_type IN ('workout', 'coaching', 'workshop', 'assessment', 'webinar')),
    duration_minutes INTEGER,
    week_number INTEGER,
    day_number INTEGER,
    content JSONB,
    resources TEXT[],
    video_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session Completions table
CREATE TABLE public.session_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES public.programme_enrollments(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    duration_minutes INTEGER,
    feedback TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    UNIQUE(user_id, session_id)
);

-- Performance Metrics table
CREATE TABLE public.performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    value DECIMAL,
    unit TEXT,
    notes TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    booking_type TEXT CHECK (booking_type IN ('consultation', 'coaching_session', 'assessment', 'workshop')),
    title TEXT NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    location TEXT CHECK (location IN ('online', 'in_person', 'hybrid')),
    meeting_link TEXT,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
    price_gbp DECIMAL(10,2),
    payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content/Resources table
CREATE TABLE public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    resource_type TEXT CHECK (resource_type IN ('article', 'video', 'pdf', 'audio', 'template', 'guide')),
    category TEXT,
    tags TEXT[],
    file_url TEXT,
    thumbnail_url TEXT,
    is_premium BOOLEAN DEFAULT false,
    programme_ids UUID[],
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Progress Tracking table
CREATE TABLE public.user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    mood INTEGER CHECK (mood >= 1 AND mood <= 10),
    productivity INTEGER CHECK (productivity >= 1 AND productivity <= 10),
    sleep_hours DECIMAL(3,1),
    exercise_minutes INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Testimonials table
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    role TEXT,
    company TEXT,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Enquiries table
CREATE TABLE public.enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    enquiry_type TEXT CHECK (enquiry_type IN ('general', 'programme', 'corporate', 'speaking', 'partnership')),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'responded', 'closed')),
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_goals_user_id ON public.performance_goals(user_id);
CREATE INDEX idx_assessments_user_id ON public.assessment_results(user_id);
CREATE INDEX idx_enrollments_user_id ON public.programme_enrollments(user_id);
CREATE INDEX idx_enrollments_programme_id ON public.programme_enrollments(programme_id);
CREATE INDEX idx_completions_user_id ON public.session_completions(user_id);
CREATE INDEX idx_metrics_user_id ON public.performance_metrics(user_id);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_scheduled ON public.bookings(scheduled_at);
CREATE INDEX idx_progress_user_date ON public.user_progress(user_id, date);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programme_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (users can only see their own data)
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own goals" ON public.performance_goals
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own assessments" ON public.assessment_results
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own enrollments" ON public.programme_enrollments
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own metrics" ON public.performance_metrics
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own bookings" ON public.bookings
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own progress" ON public.user_progress
    FOR ALL USING (auth.uid() = user_id);

-- Public access policies
CREATE POLICY "Public can view programmes" ON public.programmes
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view published testimonials" ON public.testimonials
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view published resources" ON public.resources
    FOR SELECT USING (published_at IS NOT NULL);

CREATE POLICY "Public can create enquiries" ON public.enquiries
    FOR INSERT WITH CHECK (true);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.performance_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programmes_updated_at BEFORE UPDATE ON public.programmes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON public.sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON public.resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();