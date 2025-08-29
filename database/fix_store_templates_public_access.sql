-- Fix public access to store_templates for viewing active store templates
-- This allows public users to see which template a store is using

-- Add public policy for viewing store templates
CREATE POLICY "Public can view active store templates" ON store_templates
    FOR SELECT USING (
        is_active = true AND
        store_id IN (
            SELECT id FROM stores WHERE is_active = true
        )
    );

-- This policy allows:
-- 1. Public users (anonymous) to view store templates
-- 2. Only for active store templates (is_active = true)
-- 3. Only for active stores (stores.is_active = true)
-- 4. Only SELECT operations (read-only access)
