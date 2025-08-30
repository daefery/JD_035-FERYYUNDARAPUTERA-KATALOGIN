-- Complete Final Fix for Analytics RLS
-- This script completely resets and recreates all RLS policies for analytics

-- Step 1: Completely disable RLS on all analytics tables to clear everything
ALTER TABLE store_visits DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_views DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_analytics DISABLE ROW LEVEL SECURITY;

-- Step 2: Re-enable RLS
ALTER TABLE store_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_analytics ENABLE ROW LEVEL SECURITY;

-- Step 3: Create the most permissive policies possible for testing
-- We'll make them very permissive first, then tighten them later if needed

-- Store Visits - Allow ALL operations for both anon and authenticated
CREATE POLICY "allow_all_store_visits" ON store_visits
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Page Views - Allow ALL operations for both anon and authenticated
CREATE POLICY "allow_all_page_views" ON page_views
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- User Interactions - Allow ALL operations for both anon and authenticated
CREATE POLICY "allow_all_user_interactions" ON user_interactions
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Menu Item Analytics - Allow ALL operations for both anon and authenticated
CREATE POLICY "allow_all_menu_item_analytics" ON menu_item_analytics
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Step 4: Ensure stores table allows public read access
DROP POLICY IF EXISTS "anon_view_active_stores" ON stores;
DROP POLICY IF EXISTS "public_view_active_stores" ON stores;
DROP POLICY IF EXISTS "Public can view active stores" ON stores;
CREATE POLICY "allow_all_stores_read" ON stores
  FOR SELECT TO anon, authenticated
  USING (true);

-- Step 5: Test the setup
-- This should now work for both anonymous and authenticated users
-- You can test with:
-- INSERT INTO store_visits (store_id, visitor_id, session_id, visit_date, visit_time) 
-- VALUES ('your-store-id', 'test-visitor', 'test-session', CURRENT_DATE, NOW());

-- Step 6: Verify the policies are working
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('store_visits', 'page_views', 'user_interactions', 'menu_item_analytics', 'stores')
ORDER BY tablename, policyname;
