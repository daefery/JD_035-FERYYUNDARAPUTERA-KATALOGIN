-- Test Store Visits Table Structure
-- This script checks the store_visits table for potential issues

-- Step 1: Check table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'store_visits'
ORDER BY ordinal_position;

-- Step 2: Check foreign key constraints
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='store_visits';

-- Step 3: Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'store_visits';

-- Step 4: Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'store_visits'
ORDER BY policyname;

-- Step 5: Test a simple insert with minimal data
-- This will help identify if the issue is with the data or the policy
INSERT INTO store_visits (
  store_id, 
  visitor_id, 
  session_id, 
  visit_date, 
  visit_time,
  page_views,
  is_bounce
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Dummy UUID for testing
  'test-visitor-' || EXTRACT(EPOCH FROM NOW()),
  'test-session-' || EXTRACT(EPOCH FROM NOW()),
  CURRENT_DATE,
  NOW(),
  1,
  true
);

-- Step 6: Check if the insert worked
SELECT COUNT(*) as test_records FROM store_visits WHERE visitor_id LIKE 'test-visitor-%';

-- Step 7: Clean up test data
DELETE FROM store_visits WHERE visitor_id LIKE 'test-visitor-%';
