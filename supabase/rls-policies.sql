-- ==============================================================================
-- GK INDIA ACADEMY - ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Provides enterprise-grade access control:
-- 1. Public candidates have read-only access to published content.
-- 2. Public candidates can submit contact inquiries (INSERT only).
-- 3. Only verified administrators have full CRUD access across all tables.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Administrator Verification Function: public.is_admin()
-- Evaluates both Supabase Auth JWT claims and admin_profiles table
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with elevated privileges to safely inspect admin_profiles
SET search_path = public, auth
AS $$
DECLARE
  v_uid UUID;
  v_jwt JSONB;
  v_app_role TEXT;
  v_user_role TEXT;
  v_profile_exists BOOLEAN;
BEGIN
  -- 1. Ensure user is authenticated
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RETURN FALSE;
  END IF;

  -- 2. Check JWT app_metadata & user_metadata claims
  v_jwt := auth.jwt();
  IF v_jwt IS NOT NULL THEN
    v_app_role := COALESCE(v_jwt -> 'app_metadata' ->> 'role', '');
    IF v_app_role = 'admin' OR v_app_role = 'super_admin' THEN
      RETURN TRUE;
    END IF;

    -- Check if roles array contains 'admin'
    IF (v_jwt -> 'app_metadata' -> 'roles') ? 'admin' THEN
      RETURN TRUE;
    END IF;

    v_user_role := COALESCE(v_jwt -> 'user_metadata' ->> 'role', '');
    IF v_user_role = 'admin' OR (v_jwt -> 'user_metadata' ->> 'is_admin')::BOOLEAN IS TRUE THEN
      RETURN TRUE;
    END IF;
  END IF;

  -- 3. Check public.admin_profiles table
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = v_uid AND is_active = TRUE AND role IN ('admin', 'super_admin')
  ) INTO v_profile_exists;

  RETURN v_profile_exists;
END;
$$;

-- Grant execution permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- ------------------------------------------------------------------------------
-- 2. Enable RLS on all tables
-- ------------------------------------------------------------------------------
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.current_affairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.government_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 3. Policies: admin_profiles
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can view all admin profiles" ON public.admin_profiles;
CREATE POLICY "Admins can view all admin profiles"
  ON public.admin_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can update their own profile" ON public.admin_profiles;
CREATE POLICY "Admins can update their own profile"
  ON public.admin_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Super admins can manage admin profiles" ON public.admin_profiles;
CREATE POLICY "Super admins can manage admin profiles"
  ON public.admin_profiles
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 4. Policies: topics
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published topics" ON public.topics;
CREATE POLICY "Public can view published topics"
  ON public.topics
  FOR SELECT
  TO public
  USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to topics" ON public.topics;
CREATE POLICY "Admins have full access to topics"
  ON public.topics
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 5. Policies: questions (MCQs)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published questions" ON public.questions;
CREATE POLICY "Public can view published questions"
  ON public.questions
  FOR SELECT
  TO public
  USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to questions" ON public.questions;
CREATE POLICY "Admins have full access to questions"
  ON public.questions
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 6. Policies: current_affairs
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published current affairs" ON public.current_affairs;
CREATE POLICY "Public can view published current affairs"
  ON public.current_affairs
  FOR SELECT
  TO public
  USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to current affairs" ON public.current_affairs;
CREATE POLICY "Admins have full access to current affairs"
  ON public.current_affairs
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 7. Policies: government_exams
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published exams" ON public.government_exams;
CREATE POLICY "Public can view published exams"
  ON public.government_exams
  FOR SELECT
  TO public
  USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to exams" ON public.government_exams;
CREATE POLICY "Admins have full access to exams"
  ON public.government_exams
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 8. Policies: study_materials
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published study materials" ON public.study_materials;
CREATE POLICY "Public can view published study materials"
  ON public.study_materials
  FOR SELECT
  TO public
  USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to study materials" ON public.study_materials;
CREATE POLICY "Admins have full access to study materials"
  ON public.study_materials
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 9. Policies: contact_messages
-- ------------------------------------------------------------------------------
-- Allow candidate visitors (anonymous or authenticated) to submit inquiries
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
CREATE POLICY "Public can submit contact messages"
  ON public.contact_messages
  FOR INSERT
  TO public
  WITH CHECK (
    LENGTH(TRIM(name)) >= 2 AND
    LENGTH(TRIM(email)) >= 5 AND
    LENGTH(TRIM(message)) >= 10
  );

-- Only verified administrators can read candidate messages
DROP POLICY IF EXISTS "Only admins can view contact messages" ON public.contact_messages;
CREATE POLICY "Only admins can view contact messages"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Only verified administrators can update status or delete contact messages
DROP POLICY IF EXISTS "Admins can update contact messages" ON public.contact_messages;
CREATE POLICY "Admins can update contact messages"
  ON public.contact_messages
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete contact messages" ON public.contact_messages;
CREATE POLICY "Admins can delete contact messages"
  ON public.contact_messages
  FOR DELETE
  TO authenticated
  USING (public.is_admin());
