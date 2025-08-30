-- Complete Fix for Analytics RLS Policies
-- This script fixes all RLS issues for public analytics tracking

-- First, let's check and fix the stores table policies
-- The stores table should allow anonymous users to read active stores (which it already does)

-- Now let's completely replace the analytics table policies

-- 1. Drop ALL existing policies on analytics tables
DROP POLICY IF EXISTS "Store owners can view their store visits" ON store_visits;
DROP POLICY IF EXISTS "Anyone can insert store visits" ON store_visits;
DROP POLICY IF EXISTS "Public can insert store visits for active stores" ON store_visits;
DROP POLICY IF EXISTS "Users can insert store visits for their stores" ON store_visits;

DROP POLICY IF EXISTS "Store owners can view their page views" ON page_views;
DROP POLICY IF EXISTS "Anyone can insert page views" ON page_views;
DROP POLICY IF EXISTS "Public can insert page views for active stores" ON page_views;
DROP POLICY IF EXISTS "Users can insert page views for their stores" ON page_views;

DROP POLICY IF EXISTS "Store owners can view their user interactions" ON user_interactions;
DROP POLICY IF EXISTS "Anyone can insert user interactions" ON user_interactions;
DROP POLICY IF EXISTS "Public can insert user interactions for active stores" ON user_interactions;
DROP POLICY IF EXISTS "Users can insert user interactions for their stores" ON user_interactions;

DROP POLICY IF EXISTS "Store owners can view their menu item analytics" ON menu_item_analytics;
DROP POLICY IF EXISTS "Anyone can insert menu item analytics" ON menu_item_analytics;
DROP POLICY IF EXISTS "Public can insert menu item analytics for active stores" ON menu_item_analytics;
DROP POLICY IF EXISTS "Users can insert menu item analytics for their stores" ON menu_item_analytics;

-- 2. Create new, simplified policies that work with anonymous access

-- Store Visits Policies
CREATE POLICY "Store owners can view their store visits" ON store_visits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = store_visits.store_id 
      AND stores.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can insert store visits" ON store_visits
  FOR INSERT WITH CHECK (true);

-- Page Views Policies
CREATE POLICY "Store owners can view their page views" ON page_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = page_views.store_id 
      AND stores.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can insert page views" ON page_views
  FOR INSERT WITH CHECK (true);

-- User Interactions Policies
CREATE POLICY "Store owners can view their user interactions" ON user_interactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = user_interactions.store_id 
      AND stores.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can insert user interactions" ON user_interactions
  FOR INSERT WITH CHECK (true);

-- Menu Item Analytics Policies
CREATE POLICY "Store owners can view their menu item analytics" ON menu_item_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = menu_item_analytics.store_id 
      AND stores.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can insert menu item analytics" ON menu_item_analytics
  FOR INSERT WITH CHECK (true);

-- 3. Verify the stores table has the correct public read policy
-- This should already exist, but let's make sure
DROP POLICY IF EXISTS "Public can view active stores" ON stores;
CREATE POLICY "Public can view active stores" ON stores
  FOR SELECT USING (is_active = true);

-- 4. Test the setup
-- You can test this by running:
-- INSERT INTO store_visits (store_id, visitor_id, session_id, visit_date, visit_time) 
-- VALUES ('your-store-id', 'test-visitor', 'test-session', CURRENT_DATE, NOW());

-- 5. Additional security note:
-- The application should validate that the store_id exists and is active
-- before inserting analytics data, but the RLS policies will allow the insert
-- for any valid store_id that exists in the stores table
