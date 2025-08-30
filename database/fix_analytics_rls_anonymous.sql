-- Fix Analytics RLS for Anonymous Users
-- This script ensures anonymous users can insert analytics data

-- First, let's check what policies currently exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('store_visits', 'page_views', 'user_interactions', 'menu_item_analytics')
ORDER BY tablename, policyname;

-- Drop any existing public insert policies that might be conflicting
DROP POLICY IF EXISTS "public_insert_store_visits" ON store_visits;
DROP POLICY IF EXISTS "public_insert_page_views" ON page_views;
DROP POLICY IF EXISTS "public_insert_user_interactions" ON user_interactions;
DROP POLICY IF EXISTS "public_insert_menu_item_analytics" ON menu_item_analytics;

DROP POLICY IF EXISTS "Anyone can insert store visits" ON store_visits;
DROP POLICY IF EXISTS "Anyone can insert page views" ON page_views;
DROP POLICY IF EXISTS "Anyone can insert user interactions" ON user_interactions;
DROP POLICY IF EXISTS "Anyone can insert menu item analytics" ON menu_item_analytics;

DROP POLICY IF EXISTS "Public can insert store visits for active stores" ON store_visits;
DROP POLICY IF EXISTS "Public can insert page views for active stores" ON page_views;
DROP POLICY IF EXISTS "Public can insert user interactions for active stores" ON user_interactions;
DROP POLICY IF EXISTS "Public can insert menu item analytics for active stores" ON menu_item_analytics;

-- Create new, simple public insert policies for anonymous users
-- These policies allow anonymous users to insert analytics data for any store

-- Store Visits - Anonymous users can insert
CREATE POLICY "anon_insert_store_visits" ON store_visits
  FOR INSERT TO anon
  WITH CHECK (true);

-- Page Views - Anonymous users can insert
CREATE POLICY "anon_insert_page_views" ON page_views
  FOR INSERT TO anon
  WITH CHECK (true);

-- User Interactions - Anonymous users can insert
CREATE POLICY "anon_insert_user_interactions" ON user_interactions
  FOR INSERT TO anon
  WITH CHECK (true);

-- Menu Item Analytics - Anonymous users can insert
CREATE POLICY "anon_insert_menu_item_analytics" ON menu_item_analytics
  FOR INSERT TO anon
  WITH CHECK (true);

-- Ensure the stores table allows anonymous users to read active stores
-- This is needed for the public analytics service to validate stores
DROP POLICY IF EXISTS "public_view_active_stores" ON stores;
DROP POLICY IF EXISTS "Public can view active stores" ON stores;
CREATE POLICY "anon_view_active_stores" ON stores
  FOR SELECT TO anon
  USING (is_active = true);

-- Test the setup
-- You can test this by running a simple insert as an anonymous user:
-- INSERT INTO store_visits (store_id, visitor_id, session_id, visit_date, visit_time) 
-- VALUES ('your-store-id', 'test-visitor', 'test-session', CURRENT_DATE, NOW());

-- Verify the policies are working
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('store_visits', 'page_views', 'user_interactions', 'menu_item_analytics')
ORDER BY tablename, policyname;
