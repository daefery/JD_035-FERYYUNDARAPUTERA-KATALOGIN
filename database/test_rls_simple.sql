-- Simple RLS Test Script
-- Run this to test if the RLS policies are working

-- First, let's see what policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('store_visits', 'page_views', 'user_interactions', 'menu_item_analytics')
ORDER BY tablename, policyname;

-- Test 1: Try to insert a store visit with a dummy store ID
-- This should work if RLS policies are correct
INSERT INTO store_visits (
  store_id, 
  visitor_id, 
  session_id, 
  visit_date, 
  visit_time,
  page_views,
  is_bounce
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Dummy UUID
  'test-visitor-' || EXTRACT(EPOCH FROM NOW()),
  'test-session-' || EXTRACT(EPOCH FROM NOW()),
  CURRENT_DATE,
  NOW(),
  1,
  true
);

-- Test 2: Try to insert a page view with a dummy store ID
INSERT INTO page_views (
  store_id,
  visitor_id,
  session_id,
  page_type,
  page_url,
  view_time
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Dummy UUID
  'test-visitor-' || EXTRACT(EPOCH FROM NOW()),
  'test-session-' || EXTRACT(EPOCH FROM NOW()),
  'test_page',
  'https://example.com/test',
  NOW()
);

-- If both inserts work, the RLS policies are correctly configured
-- If they fail, we need to check the policy definitions

-- Clean up test data
DELETE FROM store_visits WHERE visitor_id LIKE 'test-visitor-%';
DELETE FROM page_views WHERE visitor_id LIKE 'test-visitor-%';
