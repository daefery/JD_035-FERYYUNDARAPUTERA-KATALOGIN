-- Final Fix for Analytics RLS Policies
-- This script completely removes and recreates all RLS policies for analytics tables

-- Step 1: Temporarily disable RLS on analytics tables to clear all policies
ALTER TABLE store_visits DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_views DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_analytics DISABLE ROW LEVEL SECURITY;

-- Step 2: Re-enable RLS
ALTER TABLE store_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_analytics ENABLE ROW LEVEL SECURITY;

-- Step 3: Create simple, permissive policies for public analytics

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

-- Step 4: Ensure stores table allows public read access
-- Drop and recreate the public read policy for stores
DROP POLICY IF EXISTS "Public can view active stores" ON stores;
CREATE POLICY "public_view_active_stores" ON stores
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Step 5: Verify the setup
-- You can test this by running a simple insert:
-- INSERT INTO store_visits (store_id, visitor_id, session_id, visit_date, visit_time) 
-- VALUES ('your-store-id', 'test-visitor', 'test-session', CURRENT_DATE, NOW());

-- If you get any errors, check the Supabase logs for more details
