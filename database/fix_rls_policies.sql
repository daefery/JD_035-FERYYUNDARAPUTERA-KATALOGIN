-- Fix RLS Policies for stores table
-- This script ensures users can only see their own stores in dashboard while allowing public access to individual stores

-- First, drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can view active stores" ON stores;
DROP POLICY IF EXISTS "Public can view active stores by slug" ON stores;
DROP POLICY IF EXISTS "Users can view their own stores" ON stores;
DROP POLICY IF EXISTS "Users can insert their own stores" ON stores;
DROP POLICY IF EXISTS "Users can update their own stores" ON stores;
DROP POLICY IF EXISTS "Users can delete their own stores" ON stores;

-- Create the correct policies
-- 1. Authenticated users can view their own stores (for dashboard)
CREATE POLICY "Users can view their own stores" ON stores
  FOR SELECT USING (auth.uid() = user_id);

-- 2. Public can view individual active stores (for public store pages)
CREATE POLICY "Public can view active stores" ON stores
  FOR SELECT USING (is_active = true);

-- 3. Authenticated users can insert their own stores
CREATE POLICY "Users can insert their own stores" ON stores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Authenticated users can update their own stores
CREATE POLICY "Users can update their own stores" ON stores
  FOR UPDATE USING (auth.uid() = user_id);

-- 5. Authenticated users can delete their own stores
CREATE POLICY "Users can delete their own stores" ON stores
  FOR DELETE USING (auth.uid() = user_id);

-- Verify RLS is enabled
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Show current policies for verification
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'stores';
