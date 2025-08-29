-- Alternative approach: Add coming_soon column without unique constraint
-- Run this script if you prefer not to add a unique constraint on the name column

-- Add the coming_soon column
ALTER TABLE templates ADD COLUMN IF NOT EXISTS coming_soon BOOLEAN DEFAULT false;

-- Update existing templates to set coming_soon = false (they are already available)
UPDATE templates SET coming_soon = false WHERE coming_soon IS NULL;

-- Insert coming soon templates only if they don't already exist
INSERT INTO templates (name, description, category, preview_image_url, thumbnail_url, is_featured, coming_soon, sort_order)
SELECT 'Food Truck Pro', 'Advanced mobile-first design for food trucks with real-time location tracking and order management.', 'Restaurant', 'https://placehold.co/600x400/FF8C42/FFFFFF?text=Food+Truck+Pro', 'https://placehold.co/300x200/FF8C42/FFFFFF?text=Food+Truck+Pro', false, true, 7
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE name = 'Food Truck Pro');

INSERT INTO templates (name, description, category, preview_image_url, thumbnail_url, is_featured, coming_soon, sort_order)
SELECT 'E-commerce Plus', 'Full-featured e-commerce template with shopping cart, payment integration, and inventory management.', 'Retail', 'https://placehold.co/600x400/9B59B6/FFFFFF?text=E-commerce+Plus', 'https://placehold.co/300x200/9B59B6/FFFFFF?text=E-commerce+Plus', false, true, 8
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE name = 'E-commerce Plus');

INSERT INTO templates (name, description, category, preview_image_url, thumbnail_url, is_featured, coming_soon, sort_order)
SELECT 'Multi-Location', 'Enterprise template for businesses with multiple locations, centralized management, and advanced analytics.', 'Service', 'https://placehold.co/600x400/3498DB/FFFFFF?text=Multi-Location', 'https://placehold.co/300x200/3498DB/FFFFFF?text=Multi-Location', false, true, 9
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE name = 'Multi-Location');
