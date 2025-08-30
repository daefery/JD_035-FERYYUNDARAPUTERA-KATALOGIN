-- Fix Store Visits for Anonymous Users
-- This script specifically addresses the store_visits table RLS issues

-- Step 1: Check current policies on store_visits
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'store_visits'
ORDER BY policyname;

-- Step 2: Drop all existing policies on store_visits
DROP POLICY IF EXISTS "allow_all_store_visits" ON store_visits;
DROP POLICY IF EXISTS "public_insert_store_visits" ON store_visits;
DROP POLICY IF EXISTS "anon_insert_store_visits" ON store_visits;
DROP POLICY IF EXISTS "authenticated_insert_store_visits" ON store_visits;
DROP POLICY IF EXISTS "users_view_own_store_visits" ON store_visits;
DROP POLICY IF EXISTS "authenticated_view_own_store_visits" ON store_visits;
DROP POLICY IF EXISTS "Store owners can view their store visits" ON store_visits;
DROP POLICY IF EXISTS "Anyone can insert store visits" ON store_visits;
DROP POLICY IF EXISTS "Public can insert store visits for active stores" ON store_visits;
DROP POLICY IF EXISTS "Users can insert store visits for their stores" ON store_visits;

-- Step 3: Temporarily disable RLS on store_visits
ALTER TABLE store_visits DISABLE ROW LEVEL SECURITY;

-- Step 4: Re-enable RLS on store_visits
ALTER TABLE store_visits ENABLE ROW LEVEL SECURITY;

-- Step 5: Create a very simple, permissive policy for store_visits
CREATE POLICY "store_visits_allow_all" ON store_visits
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Step 6: Test the store_visits table specifically
-- You can test this by running:
-- INSERT INTO store_visits (store_id, visitor_id, session_id, visit_date, visit_time, page_views, is_bounce) 
-- VALUES ('your-store-id', 'test-visitor', 'test-session', CURRENT_DATE, NOW(), 1, true);

-- Step 7: Verify the policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'store_visits'
ORDER BY policyname;
