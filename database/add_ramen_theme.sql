-- Add Ramen Restaurant Theme
-- Based on the Larana Ramen menu design with dark chalkboard background and clean white cards

-- Insert the new Ramen Restaurant template
INSERT INTO templates (name, description, category, preview_image_url, thumbnail_url, is_featured, coming_soon, sort_order) VALUES
('Ramen Restaurant', 'A sophisticated dark theme inspired by authentic ramen restaurants. Features a chalkboard-style dark background with clean white cards, perfect for showcasing ramen dishes and beverages with elegant typography and warm accent colors.', 'Restaurant', 'https://placehold.co/600x400/2C3E50/FFFFFF?text=Ramen+Restaurant', 'https://placehold.co/300x200/2C3E50/FFFFFF?text=Ramen+Restaurant', true, false, 10)
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE name = 'Ramen Restaurant');

-- Get the template ID for adding features
DO $$
DECLARE
    template_id UUID;
BEGIN
    -- Get the template ID
    SELECT id INTO template_id FROM templates WHERE name = 'Ramen Restaurant';
    
    -- Insert template features
    INSERT INTO template_features (template_id, feature_name, feature_description, sort_order) VALUES
    (template_id, 'Dark Chalkboard Background', 'Sophisticated dark textured background resembling a chalkboard', 1),
    (template_id, 'Clean White Cards', 'Floating white cards with subtle shadows for menu items', 2),
    (template_id, 'Warm Brown Accents', 'Earthy brown price tags and accent colors', 3),
    (template_id, 'Ramen-Specific Layout', 'Optimized layout for ramen dishes and beverages', 4),
    (template_id, 'Elegant Typography', 'Clean, modern sans-serif fonts with proper hierarchy', 5),
    (template_id, 'High-Quality Food Images', 'Top-down photography style for dishes', 6),
    (template_id, 'Contact Information Section', 'Dedicated bottom section for contact details', 7),
    (template_id, 'Responsive Design', 'Mobile-friendly layout that works on all devices', 8),
    (template_id, 'Category Organization', 'Clear separation between food and beverage sections', 9),
    (template_id, 'Professional Branding', 'Space for logo and brand name at the top', 10);
    
    -- Insert template configurations
    INSERT INTO template_configs (template_id, config_key, config_value, config_type, is_required, default_value) VALUES
    (template_id, 'primary_color', '#2C3E50', 'string', true, '#2C3E50'),
    (template_id, 'secondary_color', '#8B572A', 'string', true, '#8B572A'),
    (template_id, 'background_color', '#1A1A1A', 'string', true, '#1A1A1A'),
    (template_id, 'card_background', '#FFFFFF', 'string', true, '#FFFFFF'),
    (template_id, 'text_color', '#FFFFFF', 'string', true, '#FFFFFF'),
    (template_id, 'accent_color', '#A06A3D', 'string', true, '#A06A3D'),
    (template_id, 'font_family', 'Inter', 'string', false, 'Inter'),
    (template_id, 'show_gallery', 'true', 'boolean', false, 'true'),
    (template_id, 'show_reviews', 'false', 'boolean', false, 'false'),
    (template_id, 'max_products_per_page', '12', 'number', false, '12'),
    (template_id, 'enable_search', 'true', 'boolean', false, 'true'),
    (template_id, 'show_social_links', 'true', 'boolean', false, 'true'),
    (template_id, 'enable_online_ordering', 'false', 'boolean', false, 'false'),
    (template_id, 'custom_css', '', 'string', false, ''),
    (template_id, 'theme_style', 'ramen_restaurant', 'string', true, 'ramen_restaurant'),
    (template_id, 'card_style', 'floating_white', 'string', true, 'floating_white'),
    (template_id, 'background_texture', 'chalkboard', 'string', true, 'chalkboard');
    
END $$;
