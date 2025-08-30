-- Run this script in your Supabase SQL editor to add social media fields
-- This migration adds social media URL fields to the stores table

-- Check if columns already exist to avoid errors
DO $$
BEGIN
    -- Add facebook_url if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'stores' AND column_name = 'facebook_url') THEN
        ALTER TABLE stores ADD COLUMN facebook_url TEXT;
        RAISE NOTICE 'Added facebook_url column';
    ELSE
        RAISE NOTICE 'facebook_url column already exists';
    END IF;

    -- Add instagram_url if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'stores' AND column_name = 'instagram_url') THEN
        ALTER TABLE stores ADD COLUMN instagram_url TEXT;
        RAISE NOTICE 'Added instagram_url column';
    ELSE
        RAISE NOTICE 'instagram_url column already exists';
    END IF;

    -- Add twitter_url if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'stores' AND column_name = 'twitter_url') THEN
        ALTER TABLE stores ADD COLUMN twitter_url TEXT;
        RAISE NOTICE 'Added twitter_url column';
    ELSE
        RAISE NOTICE 'twitter_url column already exists';
    END IF;

    -- Add tiktok_url if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'stores' AND column_name = 'tiktok_url') THEN
        ALTER TABLE stores ADD COLUMN tiktok_url TEXT;
        RAISE NOTICE 'Added tiktok_url column';
    ELSE
        RAISE NOTICE 'tiktok_url column already exists';
    END IF;
END $$;

-- Add comments for documentation
COMMENT ON COLUMN stores.facebook_url IS 'Facebook page/profile URL';
COMMENT ON COLUMN stores.instagram_url IS 'Instagram profile URL';
COMMENT ON COLUMN stores.twitter_url IS 'Twitter/X profile URL';
COMMENT ON COLUMN stores.tiktok_url IS 'TikTok profile URL';

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'stores' 
AND column_name IN ('facebook_url', 'instagram_url', 'twitter_url', 'tiktok_url')
ORDER BY column_name;
