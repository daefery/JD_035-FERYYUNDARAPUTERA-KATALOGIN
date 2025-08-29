-- Add coming_soon column to existing templates table
-- Run this script if you already have a templates table without the coming_soon column

-- Add the coming_soon column
ALTER TABLE templates ADD COLUMN IF NOT EXISTS coming_soon BOOLEAN DEFAULT false;

-- Update existing templates to set coming_soon = false (they are already available)
UPDATE templates SET coming_soon = false WHERE coming_soon IS NULL;

-- Add unique constraint on name column if it doesn't exist
ALTER TABLE templates ADD CONSTRAINT IF NOT EXISTS templates_name_unique UNIQUE (name);

-- Insert some coming soon templates (only if they don't exist)
INSERT INTO templates (name, description, category, preview_image_url, thumbnail_url, is_featured, coming_soon, sort_order) VALUES
('Food Truck Pro', 'Advanced mobile-first design for food trucks with real-time location tracking and order management.', 'Restaurant', 'https://placehold.co/600x400/FF8C42/FFFFFF?text=Food+Truck+Pro', 'https://placehold.co/300x200/FF8C42/FFFFFF?text=Food+Truck+Pro', false, true, 7),
('E-commerce Plus', 'Full-featured e-commerce template with shopping cart, payment integration, and inventory management.', 'Retail', 'https://placehold.co/600x400/9B59B6/FFFFFF?text=E-commerce+Plus', 'https://placehold.co/300x200/9B59B6/FFFFFF?text=E-commerce+Plus', false, true, 8),
('Multi-Location', 'Enterprise template for businesses with multiple locations, centralized management, and advanced analytics.', 'Service', 'https://placehold.co/600x400/3498DB/FFFFFF?text=Multi-Location', 'https://placehold.co/300x200/3498DB/FFFFFF?text=Multi-Location', false, true, 9)
ON CONFLICT (name) DO NOTHING;
