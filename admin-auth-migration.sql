-- =====================================================
-- ADMIN AUTHENTICATION SYSTEM FOR LEAH FOWLER PERFORMANCE
-- =====================================================
-- This migration creates a comprehensive admin authentication system
-- with proper RLS policies, audit logging, and helper functions

-- =====================================================
-- PART 1: ADMIN USER MANAGEMENT
-- =====================================================

-- Create admin_users table for tracking admin privileges
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    last_login_at TIMESTAMPTZ,
    login_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'
);

-- Create index for faster lookups
CREATE INDEX idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX idx_admin_users_email ON public.admin_users(email);
CREATE INDEX idx_admin_users_active ON public.admin_users(is_active) WHERE is_active = true;

-- =====================================================
-- PART 2: AUDIT LOGGING SYSTEM
-- =====================================================

-- Create comprehensive audit log table for admin actions
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID NOT NULL REFERENCES public.admin_users(id),
    user_email TEXT NOT NULL,
    action_type TEXT NOT NULL CHECK (action_type IN (
        'login', 'logout', 'create', 'read', 'update', 'delete',
        'export', 'bulk_action', 'settings_change', 'permission_change'
    )),
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    resource_details JSONB DEFAULT '{}',
    changes JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    status TEXT CHECK (status IN ('success', 'failure', 'partial')),
    error_message TEXT,
    performed_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Create indexes for audit log queries
CREATE INDEX idx_audit_log_admin_user ON public.admin_audit_log(admin_user_id);
CREATE INDEX idx_audit_log_action ON public.admin_audit_log(action_type);
CREATE INDEX idx_audit_log_resource ON public.admin_audit_log(resource_type, resource_id);
CREATE INDEX idx_audit_log_performed_at ON public.admin_audit_log(performed_at DESC);

-- =====================================================
-- PART 3: HELPER FUNCTIONS FOR ADMIN AUTHORIZATION
-- =====================================================

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE admin_users.user_id = $1
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a user is a super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE admin_users.user_id = $1
        AND role = 'super_admin'
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get admin role
CREATE OR REPLACE FUNCTION public.get_admin_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    admin_role TEXT;
BEGIN
    SELECT role INTO admin_role
    FROM public.admin_users
    WHERE admin_users.user_id = $1
    AND is_active = true
    LIMIT 1;

    RETURN admin_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
    p_action_type TEXT,
    p_resource_type TEXT,
    p_resource_id TEXT DEFAULT NULL,
    p_resource_details JSONB DEFAULT '{}',
    p_changes JSONB DEFAULT '{}',
    p_status TEXT DEFAULT 'success',
    p_error_message TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_admin_user_id UUID;
    v_user_email TEXT;
    v_log_id UUID;
BEGIN
    -- Get admin user details
    SELECT au.id, au.email INTO v_admin_user_id, v_user_email
    FROM public.admin_users au
    WHERE au.user_id = auth.uid()
    AND au.is_active = true
    LIMIT 1;

    -- Insert audit log entry
    INSERT INTO public.admin_audit_log (
        admin_user_id,
        user_email,
        action_type,
        resource_type,
        resource_id,
        resource_details,
        changes,
        status,
        error_message,
        metadata
    ) VALUES (
        v_admin_user_id,
        v_user_email,
        p_action_type,
        p_resource_type,
        p_resource_id,
        p_resource_details,
        p_changes,
        p_status,
        p_error_message,
        jsonb_build_object('auth_uid', auth.uid())
    ) RETURNING id INTO v_log_id;

    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PART 4: RLS POLICIES FOR ADMIN TABLES
-- =====================================================

-- Enable RLS on admin tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Admin users table policies
CREATE POLICY "Super admins can manage all admin users" ON public.admin_users
    FOR ALL USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Admins can view admin users" ON public.admin_users
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their own admin record" ON public.admin_users
    FOR SELECT USING (user_id = auth.uid());

-- Audit log policies
CREATE POLICY "Super admins can view all audit logs" ON public.admin_audit_log
    FOR SELECT USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Admins can view their own audit logs" ON public.admin_audit_log
    FOR SELECT USING (
        admin_user_id IN (
            SELECT id FROM public.admin_users
            WHERE user_id = auth.uid()
        )
    );

-- =====================================================
-- PART 5: UPDATE RLS POLICIES ON EXISTING TABLES
-- =====================================================

-- Assessment submissions - Allow admin access
CREATE POLICY "Admins can view all assessment submissions" ON public.assessment_submissions
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage assessment submissions" ON public.assessment_submissions
    FOR ALL USING (public.is_admin(auth.uid()));

-- Lead magnets - Allow admin access
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'lead_magnets') THEN
        CREATE POLICY "Admins can manage lead magnets" ON public.lead_magnets
            FOR ALL USING (public.is_admin(auth.uid()));
    END IF;
END $$;

-- Blog posts - Allow admin access
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'posts') THEN
        CREATE POLICY "Admins can manage all posts" ON public.posts
            FOR ALL USING (public.is_admin(auth.uid()));
    END IF;
END $$;

-- Categories - Allow admin access
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories') THEN
        CREATE POLICY "Admins can manage categories" ON public.categories
            FOR ALL USING (public.is_admin(auth.uid()));
    END IF;
END $$;

-- Tags - Allow admin access
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tags') THEN
        CREATE POLICY "Admins can manage tags" ON public.tags
            FOR ALL USING (public.is_admin(auth.uid()));
    END IF;
END $$;

-- Profiles - Allow admin access to view all profiles
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
        CREATE POLICY "Admins can view all profiles" ON public.profiles
            FOR SELECT USING (public.is_admin(auth.uid()));

        CREATE POLICY "Admins can update profiles" ON public.profiles
            FOR UPDATE USING (public.is_admin(auth.uid()));
    END IF;
END $$;

-- Performance goals - Admin access
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'performance_goals') THEN
        CREATE POLICY "Admins can view all performance goals" ON public.performance_goals
            FOR SELECT USING (public.is_admin(auth.uid()));
    END IF;
END $$;

-- Assessment results - Admin access
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'assessment_results') THEN
        CREATE POLICY "Admins can view all assessment results" ON public.assessment_results
            FOR SELECT USING (public.is_admin(auth.uid()));
    END IF;
END $$;

-- Programme enrollments - Admin access
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'programme_enrollments') THEN
        CREATE POLICY "Admins can manage programme enrollments" ON public.programme_enrollments
            FOR ALL USING (public.is_admin(auth.uid()));
    END IF;
END $$;

-- =====================================================
-- PART 6: TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to admin_users table
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- PART 7: GDPR COMPLIANCE FUNCTIONS
-- =====================================================

-- Function to anonymize user data for GDPR
CREATE OR REPLACE FUNCTION public.anonymize_user_data(user_email TEXT)
RETURNS VOID AS $$
BEGIN
    -- Log the anonymization action
    PERFORM public.log_admin_action(
        'delete',
        'user_data_anonymization',
        user_email,
        jsonb_build_object('action', 'gdpr_anonymization'),
        '{}',
        'success'
    );

    -- Update audit logs to remove PII
    UPDATE public.admin_audit_log
    SET user_email = 'anonymized_' || substring(md5(user_email), 1, 8) || '@example.com',
        ip_address = NULL,
        user_agent = 'anonymized',
        metadata = jsonb_set(metadata, '{anonymized}', 'true')
    WHERE user_email = $1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PART 8: DATA EXPORT FUNCTION FOR GDPR
-- =====================================================

CREATE OR REPLACE FUNCTION public.export_user_data(user_email TEXT)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    -- Log the export action
    PERFORM public.log_admin_action(
        'export',
        'user_data_export',
        user_email,
        jsonb_build_object('action', 'gdpr_export'),
        '{}',
        'success'
    );

    -- Compile user data
    SELECT jsonb_build_object(
        'audit_logs', (
            SELECT jsonb_agg(row_to_json(al.*))
            FROM public.admin_audit_log al
            WHERE al.user_email = $1
        ),
        'admin_info', (
            SELECT row_to_json(au.*)
            FROM public.admin_users au
            WHERE au.email = $1
        )
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PART 9: SECURE ADMIN USER CREATION
-- =====================================================

-- Function to create admin user (only callable by super admins)
CREATE OR REPLACE FUNCTION public.create_admin_user(
    p_email TEXT,
    p_user_id UUID,
    p_role TEXT DEFAULT 'admin',
    p_permissions JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    v_admin_id UUID;
BEGIN
    -- Check if caller is super admin
    IF NOT public.is_super_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Only super admins can create admin users';
    END IF;

    -- Create admin user
    INSERT INTO public.admin_users (
        user_id,
        email,
        role,
        permissions,
        created_by
    ) VALUES (
        p_user_id,
        p_email,
        p_role,
        p_permissions,
        auth.uid()
    ) RETURNING id INTO v_admin_id;

    -- Log the action
    PERFORM public.log_admin_action(
        'create',
        'admin_user',
        v_admin_id::TEXT,
        jsonb_build_object('email', p_email, 'role', p_role),
        '{}',
        'success'
    );

    RETURN v_admin_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PART 10: SESSION MANAGEMENT
-- =====================================================

-- Admin sessions table for tracking active sessions
CREATE TABLE IF NOT EXISTS public.admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_admin_sessions_token ON public.admin_sessions(session_token) WHERE is_active = true;
CREATE INDEX idx_admin_sessions_admin ON public.admin_sessions(admin_user_id);
CREATE INDEX idx_admin_sessions_expires ON public.admin_sessions(expires_at) WHERE is_active = true;

-- Enable RLS on sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Session policies
CREATE POLICY "Admins can manage their own sessions" ON public.admin_sessions
    FOR ALL USING (
        admin_user_id IN (
            SELECT id FROM public.admin_users
            WHERE user_id = auth.uid()
        )
    );

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_admin_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    UPDATE public.admin_sessions
    SET is_active = false
    WHERE expires_at < NOW() AND is_active = true;

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PART 11: CREATE INITIAL SUPER ADMIN
-- =====================================================

-- This section should be run separately after the user is created in auth.users
-- DO NOT RUN THIS AUTOMATICALLY - Run after creating auth user

/*
-- To create the initial super admin user for Leah, run this after creating the auth user:

INSERT INTO public.admin_users (
    user_id,
    email,
    role,
    permissions,
    is_active,
    metadata
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'leah@strengthpt.co.uk'),
    'leah@strengthpt.co.uk',
    'super_admin',
    jsonb_build_object(
        'all_access', true,
        'can_manage_admins', true,
        'can_view_analytics', true,
        'can_export_data', true,
        'can_delete_data', true
    ),
    true,
    jsonb_build_object(
        'initial_admin', true,
        'created_via', 'migration'
    )
) ON CONFLICT (email) DO NOTHING;
*/

-- =====================================================
-- PART 12: GRANT NECESSARY PERMISSIONS
-- =====================================================

-- Grant usage on schemas
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant permissions on functions to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_role TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_admin_action TO authenticated;

-- Grant permissions on tables (RLS will control actual access)
GRANT SELECT ON public.admin_users TO authenticated;
GRANT SELECT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_sessions TO authenticated;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Use these queries to verify the setup:
/*
-- Check if admin tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('admin_users', 'admin_audit_log', 'admin_sessions');

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('admin_users', 'admin_audit_log', 'admin_sessions');

-- Check admin functions
SELECT proname, prosrc
FROM pg_proc
WHERE proname IN ('is_admin', 'is_super_admin', 'get_admin_role');
*/