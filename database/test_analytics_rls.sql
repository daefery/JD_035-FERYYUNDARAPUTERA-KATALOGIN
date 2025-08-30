-- Test Analytics RLS Policies
-- Run this script to verify that public analytics tracking works

-- First, let's get a valid store ID to test with
-- Replace 'your-store-id' with an actual store ID from your database
-- You can get one by running: SELECT id, name, is_active FROM stores LIMIT 1;

-- Test 1: Insert a store visit (should work with anonymous access)
INSERT INTO store_visits (
  store_id, 
  visitor_id, 
  session_id, 
  visit_date, 
  visit_time,
  page_views,
  is_bounce
) VALUES (
  'your-store-id', -- Replace with actual store ID
  'test-visitor-' || EXTRACT(EPOCH FROM NOW()),
  'test-session-' || EXTRACT(EPOCH FROM NOW()),
  CURRENT_DATE,
  NOW(),
  1,
  true
);

-- Test 2: Insert a page view (should work with anonymous access)
INSERT INTO page_views (
  store_id,
  visitor_id,
  session_id,
  page_type,
  page_url,
  view_time
) VALUES (
  'your-store-id', -- Replace with actual store ID
  'test-visitor-' || EXTRACT(EPOCH FROM NOW()),
  'test-session-' || EXTRACT(EPOCH FROM NOW()),
  'test_page',
  'https://example.com/test',
  NOW()
);

-- Test 3: Insert a user interaction (should work with anonymous access)
INSERT INTO user_interactions (
  store_id,
  visitor_id,
  session_id,
  interaction_type,
  interaction_target,
  interaction_time
) VALUES (
  'your-store-id', -- Replace with actual store ID
  'test-visitor-' || EXTRACT(EPOCH FROM NOW()),
  'test-session-' || EXTRACT(EPOCH FROM NOW()),
  'email_click',
  'contact_email',
  NOW()
);

-- Test 4: Insert menu item analytics (should work with anonymous access)
INSERT INTO menu_item_analytics (
  store_id,
  menu_item_id,
  visitor_id,
  session_id,
  action_type,
  action_time
) VALUES (
  'your-store-id', -- Replace with actual store ID
  'test-menu-item-id', -- Replace with actual menu item ID
  'test-visitor-' || EXTRACT(EPOCH FROM NOW()),
  'test-session-' || EXTRACT(EPOCH FROM NOW()),
  'click',
  NOW()
);

-- If all the above inserts work without errors, the RLS policies are correctly configured
-- You should see success messages for each insert

-- To clean up test data (optional):
-- DELETE FROM store_visits WHERE visitor_id LIKE 'test-visitor-%';
-- DELETE FROM page_views WHERE visitor_id LIKE 'test-visitor-%';
-- DELETE FROM user_interactions WHERE visitor_id LIKE 'test-visitor-%';
-- DELETE FROM menu_item_analytics WHERE visitor_id LIKE 'test-visitor-%';
