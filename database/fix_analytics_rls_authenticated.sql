-- Fix Analytics RLS for Authenticated Users
-- This script adds policies that allow authenticated users to insert analytics for any store

-- Drop existing policies that might be too restrictive for authenticated users
DROP POLICY IF EXISTS "users_view_own_store_visits" ON store_visits;
DROP POLICY IF EXISTS "users_view_own_page_views" ON page_views;
DROP POLICY IF EXISTS "users_view_own_user_interactions" ON user_interactions;
DROP POLICY IF EXISTS "users_view_own_menu_item_analytics" ON menu_item_analytics;

-- Create new policies that allow authenticated users to insert analytics for any store
-- but only view analytics for stores they own

-- Store Visits - Authenticated users can insert for any store, view only their own
CREATE POLICY "authenticated_insert_store_visits" ON store_visits
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "authenticated_view_own_store_visits" ON store_visits
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = store_visits.store_id 
      AND stores.user_id = auth.uid()
    )
  );

-- Page Views - Authenticated users can insert for any store, view only their own
CREATE POLICY "authenticated_insert_page_views" ON page_views
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "authenticated_view_own_page_views" ON page_views
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = page_views.store_id 
      AND stores.user_id = auth.uid()
    )
  );

-- User Interactions - Authenticated users can insert for any store, view only their own
CREATE POLICY "authenticated_insert_user_interactions" ON user_interactions
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "authenticated_view_own_user_interactions" ON user_interactions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = user_interactions.store_id 
      AND stores.user_id = auth.uid()
    )
  );

-- Menu Item Analytics - Authenticated users can insert for any store, view only their own
CREATE POLICY "authenticated_insert_menu_item_analytics" ON menu_item_analytics
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "authenticated_view_own_menu_item_analytics" ON menu_item_analytics
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = menu_item_analytics.store_id 
      AND stores.user_id = auth.uid()
    )
  );

-- Keep the existing public insert policies for anonymous users
-- These should already exist from the previous fix

-- Test the setup
-- You can test this by running a simple insert as an authenticated user:
-- INSERT INTO store_visits (store_id, visitor_id, session_id, visit_date, visit_time) 
-- VALUES ('your-store-id', 'test-visitor', 'test-session', CURRENT_DATE, NOW());
