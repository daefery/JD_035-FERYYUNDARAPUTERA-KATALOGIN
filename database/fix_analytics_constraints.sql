-- Fix Analytics Schema Constraints
-- Run this script to fix the unique constraint issue

-- Drop the problematic unique constraint on date column
ALTER TABLE daily_analytics DROP CONSTRAINT IF EXISTS daily_analytics_date_key;

-- Add the correct unique constraint for store_id and date combination
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_analytics_store_date ON daily_analytics(store_id, date);

-- Drop any existing conflicting indexes
DROP INDEX IF EXISTS daily_analytics_date_key;

-- Ensure the trigger function uses the correct conflict resolution
-- The existing trigger should work correctly now with the proper unique constraint
