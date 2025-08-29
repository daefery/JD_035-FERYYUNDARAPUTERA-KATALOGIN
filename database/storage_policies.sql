-- Storage Policies for Image Upload Functionality
-- Run these commands in your Supabase SQL Editor

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Authenticated users can upload store images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own store images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own store images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view store images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view gallery images" ON storage.objects;

-- 1. Allow authenticated users to upload files to store_data bucket
CREATE POLICY "Authenticated users can upload store images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'store_data' AND 
  auth.role() = 'authenticated'
);

-- 2. Allow authenticated users to update their own files
CREATE POLICY "Users can update their own store images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'store_data' AND 
  auth.role() = 'authenticated'
);

-- 3. Allow authenticated users to delete their own files
CREATE POLICY "Users can delete their own store images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'store_data' AND 
  auth.role() = 'authenticated'
);

-- 4. Allow public read access to store images
CREATE POLICY "Public can view store images" ON storage.objects
FOR SELECT USING (bucket_id = 'store_data');

-- 5. Allow authenticated users to upload files to gallery bucket
CREATE POLICY "Authenticated users can upload gallery images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'gallery' AND 
  auth.role() = 'authenticated'
);

-- 6. Allow authenticated users to update their own gallery files
CREATE POLICY "Users can update their own gallery images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'gallery' AND 
  auth.role() = 'authenticated'
);

-- 7. Allow authenticated users to delete their own gallery files
CREATE POLICY "Users can delete their own gallery images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'gallery' AND 
  auth.role() = 'authenticated'
);

-- 8. Allow public read access to gallery images
CREATE POLICY "Public can view gallery images" ON storage.objects
FOR SELECT USING (bucket_id = 'gallery');

-- Alternative: If you want more restrictive policies based on file ownership
-- You can use this pattern instead (replace the above policies):

/*
-- More restrictive policy example (optional)
CREATE POLICY "Users can manage their own files" ON storage.objects
FOR ALL USING (
  bucket_id = 'store_data' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
*/
