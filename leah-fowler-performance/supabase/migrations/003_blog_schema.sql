-- Blog Platform Database Schema
-- Version: 1.0.0
-- Description: Comprehensive blog platform with MDX support, revisions, and advanced features

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "unaccent"; -- For accent-insensitive search

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(50),
    meta_title VARCHAR(255),
    meta_description TEXT,
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags table
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Authors table (extends profiles if needed)
CREATE TABLE IF NOT EXISTS public.authors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    slug VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    social_links JSONB DEFAULT '{}',
    expertise JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    content TEXT NOT NULL, -- MDX content
    excerpt TEXT,
    featured_image TEXT,
    featured_image_alt TEXT,
    featured_image_caption TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,

    -- Content type
    content_type VARCHAR(50) DEFAULT 'article' CHECK (content_type IN ('article', 'case_study', 'research_paper', 'video_post')),

    -- Status management
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
    published_at TIMESTAMPTZ,
    scheduled_for TIMESTAMPTZ,

    -- SEO metadata
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT[],
    og_image TEXT,
    og_title VARCHAR(255),
    og_description TEXT,
    canonical_url TEXT,

    -- Content metadata
    reading_time INTEGER, -- in minutes
    word_count INTEGER,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', NULL)),

    -- Engagement metrics
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,

    -- Feature flags
    is_featured BOOLEAN DEFAULT false,
    is_premium BOOLEAN DEFAULT false,
    allow_comments BOOLEAN DEFAULT true,
    show_toc BOOLEAN DEFAULT true, -- Table of contents
    show_related BOOLEAN DEFAULT true,

    -- Additional metadata
    custom_css TEXT,
    custom_js TEXT,
    video_url TEXT, -- For video posts
    research_data JSONB, -- For research papers
    case_study_results JSONB, -- For case studies

    -- Search optimisation
    search_vector tsvector,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ, -- Soft delete

    -- Indexes will be created below
    CONSTRAINT valid_scheduled_for CHECK (
        (status != 'scheduled') OR (scheduled_for IS NOT NULL)
    ),
    CONSTRAINT valid_published_at CHECK (
        (status != 'published') OR (published_at IS NOT NULL)
    )
);

-- Post tags junction table
CREATE TABLE IF NOT EXISTS public.post_tags (
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (post_id, tag_id)
);

-- Post revisions table
CREATE TABLE IF NOT EXISTS public.post_revisions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    meta_data JSONB, -- Store all other fields as JSON
    revision_number INTEGER NOT NULL,
    revision_message TEXT,
    author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(post_id, revision_number)
);

-- Post views tracking
CREATE TABLE IF NOT EXISTS public.post_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    viewer_ip INET,
    viewer_country VARCHAR(2),
    viewer_city VARCHAR(100),
    referrer_url TEXT,
    user_agent TEXT,
    session_id VARCHAR(255),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    time_on_page INTEGER, -- in seconds

    -- Prevent duplicate views in same session
    UNIQUE(post_id, session_id)
);

-- Related posts mapping
CREATE TABLE IF NOT EXISTS public.related_posts (
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    related_post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    relevance_score DECIMAL(3, 2) DEFAULT 0.5 CHECK (relevance_score >= 0 AND relevance_score <= 1),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (post_id, related_post_id),
    CHECK (post_id != related_post_id)
);

-- Blog settings table
CREATE TABLE IF NOT EXISTS public.blog_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_posts_slug ON public.posts(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_status ON public.posts(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_category ON public.posts(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_author ON public.posts(author_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_published_at ON public.posts(published_at DESC) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX idx_posts_scheduled_for ON public.posts(scheduled_for) WHERE status = 'scheduled' AND deleted_at IS NULL;
CREATE INDEX idx_posts_featured ON public.posts(is_featured) WHERE is_featured = true AND deleted_at IS NULL;
CREATE INDEX idx_posts_search_vector ON public.posts USING gin(search_vector);
CREATE INDEX idx_posts_content_type ON public.posts(content_type) WHERE deleted_at IS NULL;

CREATE INDEX idx_categories_slug ON public.categories(slug) WHERE is_active = true;
CREATE INDEX idx_tags_slug ON public.tags(slug);
CREATE INDEX idx_tags_usage ON public.tags(usage_count DESC);

CREATE INDEX idx_post_views_post ON public.post_views(post_id);
CREATE INDEX idx_post_views_date ON public.post_views(viewed_at DESC);
CREATE INDEX idx_post_views_user ON public.post_views(user_id) WHERE user_id IS NOT NULL;

CREATE INDEX idx_post_revisions_post ON public.post_revisions(post_id, revision_number DESC);

-- Create full-text search function
CREATE OR REPLACE FUNCTION public.update_post_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.subtitle, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.excerpt, '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'D');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for search vector
CREATE TRIGGER update_post_search_vector_trigger
BEFORE INSERT OR UPDATE OF title, subtitle, excerpt, content
ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.update_post_search_vector();

-- Create function to update reading time and word count
CREATE OR REPLACE FUNCTION public.calculate_reading_metrics()
RETURNS TRIGGER AS $$
DECLARE
    word_count_val INTEGER;
    reading_time_val INTEGER;
BEGIN
    -- Calculate word count (rough estimation)
    word_count_val := array_length(string_to_array(NEW.content, ' '), 1);

    -- Calculate reading time (assuming 200 words per minute)
    reading_time_val := CEIL(word_count_val::DECIMAL / 200);

    NEW.word_count := word_count_val;
    NEW.reading_time := reading_time_val;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for reading metrics
CREATE TRIGGER calculate_reading_metrics_trigger
BEFORE INSERT OR UPDATE OF content
ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.calculate_reading_metrics();

-- Create function to handle post revisions
CREATE OR REPLACE FUNCTION public.create_post_revision()
RETURNS TRIGGER AS $$
DECLARE
    next_revision_number INTEGER;
BEGIN
    -- Only create revision if content or title changed
    IF OLD.title != NEW.title OR OLD.content != NEW.content THEN
        -- Get next revision number
        SELECT COALESCE(MAX(revision_number), 0) + 1
        INTO next_revision_number
        FROM public.post_revisions
        WHERE post_id = NEW.id;

        -- Insert revision
        INSERT INTO public.post_revisions (
            post_id, title, content, excerpt, meta_data,
            revision_number, author_id
        ) VALUES (
            NEW.id, OLD.title, OLD.content, OLD.excerpt,
            jsonb_build_object(
                'subtitle', OLD.subtitle,
                'featured_image', OLD.featured_image,
                'category_id', OLD.category_id,
                'meta_title', OLD.meta_title,
                'meta_description', OLD.meta_description
            ),
            next_revision_number,
            NEW.author_id
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for post revisions
CREATE TRIGGER create_post_revision_trigger
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.create_post_revision();

-- Create function to update tag usage counts
CREATE OR REPLACE FUNCTION public.update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.tags
        SET usage_count = usage_count + 1
        WHERE id = NEW.tag_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.tags
        SET usage_count = usage_count - 1
        WHERE id = OLD.tag_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for tag usage
CREATE TRIGGER update_tag_usage_count_trigger
AFTER INSERT OR DELETE ON public.post_tags
FOR EACH ROW
EXECUTE FUNCTION public.update_tag_usage_count();

-- Create function to auto-publish scheduled posts
CREATE OR REPLACE FUNCTION public.publish_scheduled_posts()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE public.posts
    SET
        status = 'published',
        published_at = scheduled_for,
        updated_at = NOW()
    WHERE
        status = 'scheduled'
        AND scheduled_for <= NOW()
        AND deleted_at IS NULL;

    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON public.tags
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_authors_updated_at BEFORE UPDATE ON public.authors
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_settings_updated_at BEFORE UPDATE ON public.blog_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.related_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for published posts
CREATE POLICY "Public can view published posts" ON public.posts
    FOR SELECT USING (status = 'published' AND deleted_at IS NULL);

-- Authenticated users can view all their own posts
CREATE POLICY "Authors can view own posts" ON public.posts
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND
        author_id IN (SELECT id FROM public.authors WHERE user_id = auth.uid())
    );

-- Admin write access (you'll need to implement admin role check)
CREATE POLICY "Admins can manage posts" ON public.posts
    FOR ALL USING (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM public.authors
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Public read access for active categories
CREATE POLICY "Public can view categories" ON public.categories
    FOR SELECT USING (is_active = true);

-- Public read access for tags
CREATE POLICY "Public can view tags" ON public.tags
    FOR SELECT USING (true);

-- Public read access for authors
CREATE POLICY "Public can view authors" ON public.authors
    FOR SELECT USING (is_active = true);

-- Public read access for post tags
CREATE POLICY "Public can view post tags" ON public.post_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.posts
            WHERE id = post_tags.post_id
            AND status = 'published'
            AND deleted_at IS NULL
        )
    );

-- Insert for post views (anyone can create a view)
CREATE POLICY "Anyone can create post views" ON public.post_views
    FOR INSERT WITH CHECK (true);

-- Public read for related posts
CREATE POLICY "Public can view related posts" ON public.related_posts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.posts
            WHERE id = related_posts.post_id
            AND status = 'published'
            AND deleted_at IS NULL
        )
    );

-- Admin access for revisions
CREATE POLICY "Admins can view revisions" ON public.post_revisions
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM public.authors
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Admin access for blog settings
CREATE POLICY "Admins can manage blog settings" ON public.blog_settings
    FOR ALL USING (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM public.authors
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Insert default categories matching the UK repositioning
INSERT INTO public.categories (slug, name, description, icon, color, position) VALUES
    ('sleep-recovery', 'Sleep & Recovery', 'Optimise your sleep and recovery for better performance', 'Moon', 'from-blue-500 to-indigo-600', 1),
    ('breaking-barriers', 'Breaking Exercise Barriers', 'Overcome obstacles and build sustainable exercise habits', 'Dumbbell', 'from-purple-500 to-pink-600', 2),
    ('strength-longevity', 'Strength & Longevity', 'Build strength for a longer, healthier life', 'Heart', 'from-red-500 to-orange-600', 3),
    ('nutrition-performance', 'Nutrition for Performance', 'Fuel your body for optimal performance', 'Utensils', 'from-green-500 to-teal-600', 4),
    ('lifestyle-optimisation', 'Lifestyle Optimisation', 'Habits and strategies for peak performance', 'Brain', 'from-amber-500 to-yellow-600', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert default blog settings
INSERT INTO public.blog_settings (key, value) VALUES
    ('posts_per_page', '12'::jsonb),
    ('enable_comments', 'true'::jsonb),
    ('enable_social_sharing', 'true'::jsonb),
    ('default_og_image', '"/og-default.jpg"'::jsonb),
    ('rss_enabled', 'true'::jsonb),
    ('sitemap_enabled', 'true'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Create a sample author for Leah
INSERT INTO public.authors (slug, display_name, bio, expertise) VALUES
    ('leah-fowler', 'Leah Fowler', 'Performance Consultant specialising in strength training, nutrition, and lifestyle optimisation for busy professionals.',
    '["Strength Training", "Nutrition Science", "Sleep Optimisation", "Behaviour Change"]'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Grant necessary permissions to authenticated users for post views
GRANT INSERT ON public.post_views TO authenticated;
GRANT SELECT ON public.posts TO anon, authenticated;
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.tags TO anon, authenticated;
GRANT SELECT ON public.authors TO anon, authenticated;
GRANT SELECT ON public.post_tags TO anon, authenticated;
GRANT SELECT ON public.related_posts TO anon, authenticated;

-- Create function to calculate related posts
CREATE OR REPLACE FUNCTION public.calculate_related_posts(post_uuid UUID, limit_count INTEGER DEFAULT 5)
RETURNS TABLE(
    related_post_id UUID,
    relevance_score DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    WITH post_data AS (
        SELECT
            p.category_id,
            array_agg(pt.tag_id) AS tag_ids
        FROM public.posts p
        LEFT JOIN public.post_tags pt ON p.id = pt.post_id
        WHERE p.id = post_uuid
        GROUP BY p.category_id
    )
    SELECT
        p.id AS related_post_id,
        (
            -- Category match weight: 0.4
            CASE WHEN p.category_id = pd.category_id THEN 0.4 ELSE 0 END +
            -- Tag match weight: 0.6 (divided by number of matching tags)
            (
                SELECT COALESCE(COUNT(*)::DECIMAL * 0.6 / GREATEST(array_length(pd.tag_ids, 1), 1), 0)
                FROM public.post_tags pt2
                WHERE pt2.post_id = p.id
                AND pt2.tag_id = ANY(pd.tag_ids)
            )
        ) AS relevance_score
    FROM public.posts p, post_data pd
    WHERE
        p.id != post_uuid
        AND p.status = 'published'
        AND p.deleted_at IS NULL
    ORDER BY relevance_score DESC, p.published_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON SCHEMA public IS 'Blog Platform Schema - Comprehensive CMS for Leah Fowler Performance';