-- Fix public access to categories and menu_items for viewing active store data
-- This allows public users to see categories and menu items of active stores

-- Add public policy for viewing categories of active stores
CREATE POLICY "Public can view categories of active stores" ON categories
    FOR SELECT USING (
        is_active = true AND
        store_id IN (
            SELECT id FROM stores WHERE is_active = true
        )
    );

-- Add public policy for viewing menu items of active stores
CREATE POLICY "Public can view menu items of active stores" ON menu_items
    FOR SELECT USING (
        store_id IN (
            SELECT id FROM stores WHERE is_active = true
        )
    );

-- This allows:
-- 1. Public users (anonymous) to view categories and menu items
-- 2. Only for active categories (is_active = true)
-- 3. Only for active stores (stores.is_active = true)
-- 4. Only SELECT operations (read-only access)
-- 5. Menu items don't need is_active check since they have is_available field
