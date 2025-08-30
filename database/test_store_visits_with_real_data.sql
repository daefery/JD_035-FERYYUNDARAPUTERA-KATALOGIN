-- Test Store Visits with Real Data
-- This script tests the store_visits table using actual store data

-- Step 1: Get a real store ID to test with
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

-- Step 3: Verify the insert worked
SELECT COUNT(*) as test_records FROM store_visits WHERE visitor_id LIKE 'test-visitor-%';

-- Step 4: Show the inserted record
SELECT * FROM store_visits WHERE visitor_id LIKE 'test-visitor-%' ORDER BY created_at DESC LIMIT 1;

-- Step 5: Clean up test data
DELETE FROM store_visits WHERE visitor_id LIKE 'test-visitor-%';

-- Step 6: Verify cleanup
SELECT COUNT(*) as remaining_test_records FROM store_visits WHERE visitor_id LIKE 'test-visitor-%';
