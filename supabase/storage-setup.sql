-- ==============================================================================
-- GK INDIA ACADEMY - SUPABASE FILE & IMAGE STORAGE CONFIGURATION
-- ==============================================================================
-- Creates storage buckets for study materials (PDFs, notes) and media assets,
-- and assigns Row Level Security (RLS) rules to storage.objects.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Create Buckets in storage.buckets
-- ------------------------------------------------------------------------------

-- Bucket 1: study-materials (PDFs, Handbooks, Guides)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'study-materials',
  'study-materials',
  TRUE,
  52428800, -- 50 MB
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg',
    'image/webp'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket 2: media-uploads (Logos, Question diagrams, News covers)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media-uploads',
  'media-uploads',
  TRUE,
  10485760, -- 10 MB
  ARRAY[
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/svg+xml',
    'image/gif'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ------------------------------------------------------------------------------
-- 2. Storage RLS Policies for storage.objects
-- ------------------------------------------------------------------------------

-- Public read access: Anyone can download study materials and view media
DROP POLICY IF EXISTS "Public can view study materials" ON storage.objects;
CREATE POLICY "Public can view study materials"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id IN ('study-materials', 'media-uploads'));

-- Admin upload access: Only authenticated administrators can upload
DROP POLICY IF EXISTS "Admins can upload to storage" ON storage.objects;
CREATE POLICY "Admins can upload to storage"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id IN ('study-materials', 'media-uploads') AND
    public.is_admin()
  );

-- Admin update access: Only administrators can update existing files
DROP POLICY IF EXISTS "Admins can update storage files" ON storage.objects;
CREATE POLICY "Admins can update storage files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id IN ('study-materials', 'media-uploads') AND
    public.is_admin()
  )
  WITH CHECK (
    bucket_id IN ('study-materials', 'media-uploads') AND
    public.is_admin()
  );

-- Admin delete access: Only administrators can delete files
DROP POLICY IF EXISTS "Admins can delete storage files" ON storage.objects;
CREATE POLICY "Admins can delete storage files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id IN ('study-materials', 'media-uploads') AND
    public.is_admin()
  );
