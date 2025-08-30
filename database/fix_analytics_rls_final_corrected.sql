-- Final Fix for Analytics RLS Policies (Corrected)
-- This script completely removes and recreates all RLS policies for analytics tables

-- Step 1: Drop ALL existing policies on analytics tables
DROP POLICY IF EXISTS "public_insert_store_visits" ON store_visits;
DROP POLICY IF EXISTS "users_view_own_store_visits" ON store_visits;
DROP POLICY IF EXISTS "Store owners can view their store visits" ON store_visits;
DROP POLICY IF EXISTS "Anyone can insert store visits" ON store_visits;
DROP POLICY IF EXISTS "Public can insert store visits for active stores" ON store_visits;
DROP POLICY IF EXISTS "Users can insert store visits for their stores" ON store_visits;
DROP POLICY IF EXISTS "public_insert_store_visits" ON store_visits;
DROP POLICY IF EXISTS "users_view_own_store_visits" ON store_visits;

DROP POLICY IF EXISTS "public_insert_page_views" ON page_views;
DROP POLICY IF EXISTS "users_view_own_page_views" ON page_views;
DROP POLICY IF EXISTS "Store owners can view their page views" ON page_views;
DROP POLICY IF EXISTS "Anyone can insert page views" ON page_views;
DROP POLICY IF EXISTS "Public can insert page views for active stores" ON page_views;
DROP POLICY IF EXISTS "Users can insert page views for their stores" ON page_views;

DROP POLICY IF EXISTS "public_insert_user_interactions" ON user_interactions;
DROP POLICY IF EXISTS "users_view_own_user_interactions" ON user_interactions;
DROP POLICY IF EXISTS "Store owners can view their user interactions" ON user_interactions;
DROP POLICY IF EXISTS "Anyone can insert user interactions" ON user_interactions;
DROP POLICY IF EXISTS "Public can insert user interactions for active stores" ON user_interactions;
DROP POLICY IF EXISTS "Users can insert user interactions for their stores" ON user_interactions;

DROP POLICY IF EXISTS "public_insert_menu_item_analytics" ON menu_item_analytics;
DROP POLICY IF EXISTS "users_view_own_menu_item_analytics" ON menu_item_analytics;
DROP POLICY IF EXISTS "Store owners can view their menu item analytics" ON menu_item_analytics;
DROP POLICY IF EXISTS "Anyone can insert menu item analytics" ON menu_item_analytics;
DROP POLICY IF EXISTS "Public can insert menu item analytics for active stores" ON menu_item_analytics;
DROP POLICY IF EXISTS "Users can insert menu item analytics for their stores" ON menu_item_analytics;

-- Step 2: Temporarily disable RLS on analytics tables to ensure clean state
ALTER TABLE store_visits DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_views DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_analytics DISABLE ROW LEVEL SECURITY;

-- Step 3: Re-enable RLS
ALTER TABLE store_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_analytics ENABLE ROW LEVEL SECURITY;

-- Step 4: Create new, simple policies for public analytics

-- Store Visits - Allow public inserts, authenticated users can view their own
CREATE POLICY "public_insert_store_visits" ON store_visits
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "users_view_own_store_visits" ON store_visits
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = store_visits.store_id 
      AND stores.user_id = auth.uid()
    )
  );

-- Page Views - Allow public inserts, authenticated users can view their own
CREATE POLICY "public_insert_page_views" ON page_views
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "users_view_own_page_views" ON page_views
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = page_views.store_id 
      AND stores.user_id = auth.uid()
    )
  );

-- User Interactions - Allow public inserts, authenticated users can view their own
CREATE POLICY "public_insert_user_interactions" ON user_interactions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "users_view_own_user_interactions" ON user_interactions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = user_interactions.store_id 
      AND stores.user_id = auth.uid()
    )
  );

-- Menu Item Analytics - Allow public inserts, authenticated users can view their own
CREATE POLICY "public_insert_menu_item_analytics" ON menu_item_analytics
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "users_view_own_menu_item_analytics" ON menu_item_analytics
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = menu_item_analytics.store_id 
      AND stores.user_id = auth.uid()
    )
  );

-- Step 5: Ensure stores table allows public read access
DROP POLICY IF EXISTS "Public can view active stores" ON stores;
DROP POLICY IF EXISTS "public_view_active_stores" ON stores;
CREATE POLICY "public_view_active_stores" ON stores
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Step 6: Verify the setup
-- You can test this by running a simple insert:
-- INSERT INTO store_visits (store_id, visitor_id, session_id, visit_date, visit_time) 
-- VALUES ('your-store-id', 'test-visitor', 'test-session', CURRENT_DATE, NOW());

-- If you get any errors, check the Supabase logs for more details
