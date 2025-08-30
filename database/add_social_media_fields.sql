-- Add social media fields to stores table
-- Migration: Add social media URL fields

-- Add social media URL columns to stores table
ALTER TABLE stores 
ADD COLUMN facebook_url TEXT,
ADD COLUMN instagram_url TEXT,
ADD COLUMN twitter_url TEXT,
ADD COLUMN tiktok_url TEXT;

-- Add comments for documentation
COMMENT ON COLUMN stores.facebook_url IS 'Facebook page/profile URL';
COMMENT ON COLUMN stores.instagram_url IS 'Instagram profile URL';
COMMENT ON COLUMN stores.twitter_url IS 'Twitter/X profile URL';
COMMENT ON COLUMN stores.tiktok_url IS 'TikTok profile URL';

-- Update the updated_at trigger to include new columns
-- (The existing trigger should automatically handle these new columns)
