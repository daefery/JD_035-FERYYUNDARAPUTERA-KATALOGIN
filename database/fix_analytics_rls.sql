-- Fix Analytics RLS Policies for Public Access
-- Run this script to ensure public analytics tracking works

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Users can insert store visits for their stores" ON store_visits;
DROP POLICY IF EXISTS "Users can insert page views for their stores" ON page_views;
DROP POLICY IF EXISTS "Users can insert user interactions for their stores" ON user_interactions;
DROP POLICY IF EXISTS "Users can insert menu item analytics for their stores" ON menu_item_analytics;

-- Create new policies that allow public inserts for active stores
CREATE POLICY "Public can insert store visits for active stores" ON store_visits
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE id = store_id 
      AND is_active = true
    )
  );

CREATE POLICY "Public can insert page views for active stores" ON page_views
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE id = store_id 
      AND is_active = true
    )
  );

CREATE POLICY "Public can insert user interactions for active stores" ON user_interactions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE id = store_id 
      AND is_active = true
    )
  );

CREATE POLICY "Public can insert menu item analytics for active stores" ON menu_item_analytics
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE id = store_id 
      AND is_active = true
    )
  );

-- Ensure the existing "Anyone can insert" policies are removed if they exist
DROP POLICY IF EXISTS "Anyone can insert store visits" ON store_visits;
DROP POLICY IF EXISTS "Anyone can insert page views" ON page_views;
DROP POLICY IF EXISTS "Anyone can insert user interactions" ON user_interactions;
DROP POLICY IF EXISTS "Anyone can insert menu item analytics" ON menu_item_analytics;

-- Verify the policies are working
-- You can test this by running:
-- INSERT INTO store_visits (store_id, visitor_id, session_id, visit_date, visit_time) 
-- VALUES ('your-store-id', 'test-visitor', 'test-session', CURRENT_DATE, NOW());
