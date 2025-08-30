-- Test RLS Policies with Real Data
-- This script tests the analytics RLS policies using actual store data

-- Step 1: Get a real store ID to test with
-- This will show you available stores and their IDs
SELECT id, name, is_active, slug FROM stores LIMIT 5;

-- Step 2: Test store visits with a real store ID
-- Replace 'your-actual-store-id' with one of the IDs from the query above
INSERT INTO store_visits (
  store_id, 
  visitor_id, 
  session_id, 
  visit_date, 
  visit_time,
  page_views,
  is_bounce
) VALUES (
  'your-actual-store-id', -- Replace with actual store ID from step 1
  'test-visitor-' || EXTRACT(EPOCH FROM NOW()),
  'test-session-' || EXTRACT(EPOCH FROM NOW()),
  CURRENT_DATE,
  NOW(),
  1,
  true
);

-- Step 3: Test page views with the same real store ID
INSERT INTO page_views (
  store_id,
  visitor_id,
  session_id,
  page_type,
  page_url,
  view_time
) VALUES (
  'your-actual-store-id', -- Replace with actual store ID from step 1
  'test-visitor-' || EXTRACT(EPOCH FROM NOW()),
  'test-session-' || EXTRACT(EPOCH FROM NOW()),
  'test_page',
  'https://example.com/test',
  NOW()
);

-- Step 4: Test user interactions with the same real store ID
INSERT INTO user_interactions (
  store_id,
  visitor_id,
  session_id,
  interaction_type,
  interaction_target,
  interaction_time
) VALUES (
  'your-actual-store-id', -- Replace with actual store ID from step 1
  'test-visitor-' || EXTRACT(EPOCH FROM NOW()),
  'test-session-' || EXTRACT(EPOCH FROM NOW()),
  'email_click',
  'contact_email',
  NOW()
);

-- Step 5: Test menu item analytics (optional - requires a real menu item ID)
-- First, get a menu item ID:
-- SELECT id, name, store_id FROM menu_items WHERE store_id = 'your-actual-store-id' LIMIT 1;

-- Then insert menu item analytics:
-- INSERT INTO menu_item_analytics (
--   store_id,
--   menu_item_id,
--   visitor_id,
--   session_id,
--   action_type,
--   action_time
-- ) VALUES (
--   'your-actual-store-id', -- Replace with actual store ID
--   'your-menu-item-id', -- Replace with actual menu item ID
--   'test-visitor-' || EXTRACT(EPOCH FROM NOW()),
--   'test-session-' || EXTRACT(EPOCH FROM NOW()),
--   'click',
--   NOW()
-- );

-- Step 6: Verify the inserts worked
SELECT 'store_visits' as table_name, COUNT(*) as count FROM store_visits WHERE visitor_id LIKE 'test-visitor-%'
UNION ALL
SELECT 'page_views' as table_name, COUNT(*) as count FROM page_views WHERE visitor_id LIKE 'test-visitor-%'
UNION ALL
SELECT 'user_interactions' as table_name, COUNT(*) as count FROM user_interactions WHERE visitor_id LIKE 'test-visitor-%'
UNION ALL
SELECT 'menu_item_analytics' as table_name, COUNT(*) as count FROM menu_item_analytics WHERE visitor_id LIKE 'test-visitor-%';

-- Step 7: Clean up test data (optional)
-- DELETE FROM store_visits WHERE visitor_id LIKE 'test-visitor-%';
-- DELETE FROM page_views WHERE visitor_id LIKE 'test-visitor-%';
-- DELETE FROM user_interactions WHERE visitor_id LIKE 'test-visitor-%';
-- DELETE FROM menu_item_analytics WHERE visitor_id LIKE 'test-visitor-%';
