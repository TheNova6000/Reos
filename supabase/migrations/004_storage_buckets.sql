-- Storage buckets for REOS file uploads
-- Run this in the Supabase SQL editor

-- Create buckets via storage API (buckets are managed, not raw SQL)
-- These INSERT statements create the bucket records directly
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('project-images', 'project-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('property-images', 'property-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('documents', 'documents', false, 52428800, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO NOTHING;

-- Public read on image buckets (anyone can view project/property images)
CREATE POLICY "Public read project images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'project-images');

CREATE POLICY "Public read property images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'property-images');

-- Authenticated upload/delete on image buckets
CREATE POLICY "Authenticated upload project images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Authenticated delete project images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated upload property images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Authenticated delete property images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'property-images');

-- Documents bucket: authenticated only (read + write)
CREATE POLICY "Authenticated read documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'documents');

CREATE POLICY "Authenticated upload documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Authenticated delete documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'documents');

-- Dev anon policies (remove before production)
CREATE POLICY "Dev anon upload project images"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Dev anon upload property images"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Dev anon read documents"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'documents');

CREATE POLICY "Dev anon upload documents"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'documents');
