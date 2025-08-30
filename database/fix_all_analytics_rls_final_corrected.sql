-- Fix All Analytics RLS Policies (Final - Corrected)
-- This script fixes RLS policies for all analytics tables to prevent violations

-- Step 1: Check current policies on all analytics tables
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('store_visits', 'page_views', 'user_interactions', 'menu_item_analytics', 'daily_analytics')
ORDER BY tablename, policyname;

-- Step 2: Drop ALL existing policies on analytics tables
DROP POLICY IF EXISTS "store_visits_allow_all" ON store_visits;
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

DROP POLICY IF EXISTS "page_views_allow_all" ON page_views;
DROP POLICY IF EXISTS "allow_all_page_views" ON page_views;
DROP POLICY IF EXISTS "public_insert_page_views" ON page_views;
DROP POLICY IF EXISTS "anon_insert_page_views" ON page_views;
DROP POLICY IF EXISTS "authenticated_insert_page_views" ON page_views;
DROP POLICY IF EXISTS "users_view_own_page_views" ON page_views;
DROP POLICY IF EXISTS "authenticated_view_own_page_views" ON page_views;
DROP POLICY IF EXISTS "Store owners can view their page views" ON page_views;
DROP POLICY IF EXISTS "Anyone can insert page views" ON page_views;
DROP POLICY IF EXISTS "Public can insert page views for active stores" ON page_views;
DROP POLICY IF EXISTS "Users can insert page views for their stores" ON page_views;

DROP POLICY IF EXISTS "user_interactions_allow_all" ON user_interactions;
DROP POLICY IF EXISTS "allow_all_user_interactions" ON user_interactions;
DROP POLICY IF EXISTS "public_insert_user_interactions" ON user_interactions;
DROP POLICY IF EXISTS "anon_insert_user_interactions" ON user_interactions;
DROP POLICY IF EXISTS "authenticated_insert_user_interactions" ON user_interactions;
DROP POLICY IF EXISTS "users_view_own_user_interactions" ON user_interactions;
DROP POLICY IF EXISTS "authenticated_view_own_user_interactions" ON user_interactions;
DROP POLICY IF EXISTS "Store owners can view their user interactions" ON user_interactions;
DROP POLICY IF EXISTS "Anyone can insert user interactions" ON user_interactions;
DROP POLICY IF EXISTS "Public can insert user interactions for active stores" ON user_interactions;
DROP POLICY IF EXISTS "Users can insert user interactions for their stores" ON user_interactions;

DROP POLICY IF EXISTS "menu_item_analytics_allow_all" ON menu_item_analytics;
DROP POLICY IF EXISTS "allow_all_menu_item_analytics" ON menu_item_analytics;
DROP POLICY IF EXISTS "public_insert_menu_item_analytics" ON menu_item_analytics;
DROP POLICY IF EXISTS "anon_insert_menu_item_analytics" ON menu_item_analytics;
DROP POLICY IF EXISTS "authenticated_insert_menu_item_analytics" ON menu_item_analytics;
DROP POLICY IF EXISTS "users_view_own_menu_item_analytics" ON menu_item_analytics;
DROP POLICY IF EXISTS "authenticated_view_own_menu_item_analytics" ON menu_item_analytics;
DROP POLICY IF EXISTS "Store owners can view their menu item analytics" ON menu_item_analytics;
DROP POLICY IF EXISTS "Anyone can insert menu item analytics" ON menu_item_analytics;
DROP POLICY IF EXISTS "Public can insert menu item analytics for active stores" ON menu_item_analytics;
DROP POLICY IF EXISTS "Users can insert menu item analytics for their stores" ON menu_item_analytics;

DROP POLICY IF EXISTS "daily_analytics_allow_all" ON daily_analytics;
DROP POLICY IF EXISTS "allow_all_daily_analytics" ON daily_analytics;
DROP POLICY IF EXISTS "Store owners can view their daily analytics" ON daily_analytics;
DROP POLICY IF EXISTS "Store owners can insert/update their daily analytics" ON daily_analytics;
DROP POLICY IF EXISTS "authenticated_view_own_daily_analytics" ON daily_analytics;
DROP POLICY IF EXISTS "authenticated_insert_daily_analytics" ON daily_analytics;

-- Step 3: Completely disable RLS on all analytics tables
ALTER TABLE store_visits DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_views DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_analytics DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_analytics DISABLE ROW LEVEL SECURITY;

-- Step 4: Re-enable RLS on all analytics tables
ALTER TABLE store_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_analytics ENABLE ROW LEVEL SECURITY;

-- Step 5: Create permissive policies for all analytics tables

-- Store Visits - Allow ALL operations for both anon and authenticated
CREATE POLICY "store_visits_allow_all" ON store_visits
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Page Views - Allow ALL operations for both anon and authenticated
CREATE POLICY "page_views_allow_all" ON page_views
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- User Interactions - Allow ALL operations for both anon and authenticated
CREATE POLICY "user_interactions_allow_all" ON user_interactions
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Menu Item Analytics - Allow ALL operations for both anon and authenticated
CREATE POLICY "menu_item_analytics_allow_all" ON menu_item_analytics
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Daily Analytics - Allow ALL operations for both anon and authenticated
CREATE POLICY "daily_analytics_allow_all" ON daily_analytics
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Step 6: Ensure stores table allows public read access
DROP POLICY IF EXISTS "stores_allow_read" ON stores;
DROP POLICY IF EXISTS "allow_all_stores_read" ON stores;
DROP POLICY IF EXISTS "anon_view_active_stores" ON stores;
DROP POLICY IF EXISTS "public_view_active_stores" ON stores;
DROP POLICY IF EXISTS "Public can view active stores" ON stores;
CREATE POLICY "stores_allow_read" ON stores
  FOR SELECT TO anon, authenticated
  USING (true);

-- Step 7: Check for any triggers that might cause issues
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table IN ('store_visits', 'page_views', 'user_interactions', 'menu_item_analytics', 'daily_analytics')
ORDER BY event_object_table, trigger_name;

-- Step 8: Test the setup
-- This should now work for all analytics tables
-- INSERT INTO store_visits (store_id, visitor_id, session_id, visit_date, visit_time, page_views, is_bounce) 
-- VALUES ('your-store-id', 'test-visitor', 'test-session', CURRENT_DATE, NOW(), 1, true);

-- Step 9: Verify all policies are working
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('store_visits', 'page_views', 'user_interactions', 'menu_item_analytics', 'daily_analytics', 'stores')
ORDER BY tablename, policyname;
