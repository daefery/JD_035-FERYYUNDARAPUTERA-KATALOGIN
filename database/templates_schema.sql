-- Templates Schema for Store Catalog Application
-- This schema defines tables for managing store templates

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Templates table - stores different template designs
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL, -- e.g., 'restaurant', 'cafe', 'retail', 'service'
    preview_image_url TEXT,
    thumbnail_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    coming_soon BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Template features table - stores features available in each template
CREATE TABLE IF NOT EXISTS template_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    feature_name VARCHAR(255) NOT NULL,
    feature_description TEXT,
    is_available BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Template configurations table - stores template-specific settings
CREATE TABLE IF NOT EXISTS template_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    config_key VARCHAR(255) NOT NULL,
    config_value TEXT,
    config_type VARCHAR(50) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
    is_required BOOLEAN DEFAULT false,
    default_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(template_id, config_key)
);

-- Store template assignments table - tracks which template each store is using
CREATE TABLE IF NOT EXISTS store_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    applied_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(store_id, template_id)
);

-- Template categories table - for organizing templates
CREATE TABLE IF NOT EXISTS template_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(7), -- hex color code
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default template categories
INSERT INTO template_categories (name, description, icon, color, sort_order) VALUES
('Restaurant', 'Perfect for restaurants, cafes, and food businesses', '🍽️', '#FF6B6B', 1),
('Retail', 'Ideal for retail stores and product catalogs', '🛍️', '#4ECDC4', 2),
('Service', 'Great for service-based businesses', '🔧', '#45B7D1', 3),
('Professional', 'Clean and professional designs', '💼', '#96CEB4', 4),
('Creative', 'Artistic and creative layouts', '🎨', '#FFEAA7', 5),
('Minimal', 'Simple and minimal designs', '⚪', '#DDA0DD', 6)
ON CONFLICT (name) DO NOTHING;

-- Insert sample templates
INSERT INTO templates (name, description, category, preview_image_url, thumbnail_url, is_featured, coming_soon, sort_order) VALUES
('Modern Restaurant', 'A sleek, modern design perfect for contemporary restaurants and cafes. Features a clean layout with emphasis on food photography.', 'Restaurant', 'https://placehold.co/600x400/FF6B6B/FFFFFF?text=Modern+Restaurant', 'https://placehold.co/300x200/FF6B6B/FFFFFF?text=Modern+Restaurant', true, false, 1),
('Classic Cafe', 'A warm, inviting design ideal for cafes and coffee shops. Emphasizes comfort and community.', 'Restaurant', 'https://placehold.co/600x400/4ECDC4/FFFFFF?text=Classic+Cafe', 'https://placehold.co/300x200/4ECDC4/FFFFFF?text=Classic+Cafe', true, false, 2),
('Boutique Retail', 'An elegant design for boutique stores and specialty shops. Perfect for showcasing unique products.', 'Retail', 'https://placehold.co/600x400/45B7D1/FFFFFF?text=Boutique+Retail', 'https://placehold.co/300x200/45B7D1/FFFFFF?text=Boutique+Retail', true, false, 3),
('Professional Service', 'A clean, professional design suitable for service businesses. Focuses on trust and reliability.', 'Service', 'https://placehold.co/600x400/96CEB4/FFFFFF?text=Professional+Service', 'https://placehold.co/300x200/96CEB4/FFFFFF?text=Professional+Service', false, false, 4),
('Creative Studio', 'A vibrant, creative design for artists and creative professionals. Emphasizes creativity and innovation.', 'Creative', 'https://placehold.co/600x400/FFEAA7/000000?text=Creative+Studio', 'https://placehold.co/300x200/FFEAA7/000000?text=Creative+Studio', false, false, 5),
('Minimal Clean', 'A minimal, clean design focusing on content and simplicity. Perfect for any business type.', 'Minimal', 'https://placehold.co/600x400/DDA0DD/FFFFFF?text=Minimal+Clean', 'https://placehold.co/300x200/DDA0DD/FFFFFF?text=Minimal+Clean', true, false, 6),
('Food Truck Pro', 'Advanced mobile-first design for food trucks with real-time location tracking and order management.', 'Restaurant', 'https://placehold.co/600x400/FF8C42/FFFFFF?text=Food+Truck+Pro', 'https://placehold.co/300x200/FF8C42/FFFFFF?text=Food+Truck+Pro', false, true, 7),
('E-commerce Plus', 'Full-featured e-commerce template with shopping cart, payment integration, and inventory management.', 'Retail', 'https://placehold.co/600x400/9B59B6/FFFFFF?text=E-commerce+Plus', 'https://placehold.co/300x200/9B59B6/FFFFFF?text=E-commerce+Plus', false, true, 8),
('Multi-Location', 'Enterprise template for businesses with multiple locations, centralized management, and advanced analytics.', 'Service', 'https://placehold.co/600x400/3498DB/FFFFFF?text=Multi-Location', 'https://placehold.co/300x200/3498DB/FFFFFF?text=Multi-Location', false, true, 9)
ON CONFLICT DO NOTHING;

-- Insert template features
INSERT INTO template_features (template_id, feature_name, feature_description, sort_order) 
SELECT 
    t.id,
    features.feature_name,
    features.feature_description,
    features.sort_order
FROM templates t
CROSS JOIN (
    VALUES 
        ('Responsive Design', 'Mobile-friendly layout that works on all devices', 1),
        ('Menu Management', 'Easy-to-use menu and product management system', 2),
        ('Image Gallery', 'Beautiful image gallery for showcasing products', 3),
        ('Contact Forms', 'Built-in contact forms for customer inquiries', 4),
        ('Social Media Integration', 'Easy integration with social media platforms', 5),
        ('Analytics Dashboard', 'Built-in analytics to track store performance', 6),
        ('Custom Branding', 'Customizable colors, fonts, and branding elements', 7),
        ('SEO Optimization', 'Search engine optimized for better visibility', 8),
        ('Fast Loading', 'Optimized for fast page loading speeds', 9),
        ('Customer Reviews', 'Built-in customer review and rating system', 10)
) AS features(feature_name, feature_description, sort_order)
WHERE t.name IN ('Modern Restaurant', 'Classic Cafe', 'Boutique Retail', 'Professional Service', 'Creative Studio', 'Minimal Clean');

-- Insert template configurations
INSERT INTO template_configs (template_id, config_key, config_value, config_type, is_required, default_value) 
SELECT 
    t.id,
    config_key,
    config_value,
    config_type,
    is_required,
    default_value
FROM templates t
CROSS JOIN (
    VALUES 
        ('primary_color', '#FF6B6B', 'string', true, '#FF6B6B'),
        ('secondary_color', '#4ECDC4', 'string', true, '#4ECDC4'),
        ('font_family', 'Inter', 'string', false, 'Inter'),
        ('show_gallery', 'true', 'boolean', false, 'true'),
        ('show_reviews', 'true', 'boolean', false, 'true'),
        ('max_products_per_page', '12', 'number', false, '12'),
        ('enable_search', 'true', 'boolean', false, 'true'),
        ('show_social_links', 'true', 'boolean', false, 'true'),
        ('enable_online_ordering', 'false', 'boolean', false, 'false'),
        ('custom_css', '', 'string', false, '')
) AS configs(config_key, config_value, config_type, is_required, default_value)
WHERE t.name IN ('Modern Restaurant', 'Classic Cafe', 'Boutique Retail', 'Professional Service', 'Creative Studio', 'Minimal Clean');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_active ON templates(is_active);
CREATE INDEX IF NOT EXISTS idx_templates_featured ON templates(is_featured);
CREATE INDEX IF NOT EXISTS idx_template_features_template_id ON template_features(template_id);
CREATE INDEX IF NOT EXISTS idx_template_configs_template_id ON template_configs(template_id);
CREATE INDEX IF NOT EXISTS idx_store_templates_store_id ON store_templates(store_id);
CREATE INDEX IF NOT EXISTS idx_store_templates_template_id ON store_templates(template_id);
CREATE INDEX IF NOT EXISTS idx_template_categories_active ON template_categories(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for templates
CREATE POLICY "Public can view active templates" ON templates
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage templates" ON templates
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for template_features
CREATE POLICY "Public can view template features" ON template_features
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage template features" ON template_features
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for template_configs
CREATE POLICY "Public can view template configs" ON template_configs
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage template configs" ON template_configs
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for store_templates
CREATE POLICY "Users can view their own store templates" ON store_templates
    FOR SELECT USING (
        store_id IN (
            SELECT id FROM stores WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their own store templates" ON store_templates
    FOR ALL USING (
        store_id IN (
            SELECT id FROM stores WHERE user_id = auth.uid()
        )
    );

-- RLS Policies for template_categories
CREATE POLICY "Public can view active template categories" ON template_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage template categories" ON template_categories
    FOR ALL USING (auth.role() = 'service_role');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_templates_updated_at 
    BEFORE UPDATE ON templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE templates IS 'Stores different template designs available for stores';
COMMENT ON TABLE template_features IS 'Features available in each template';
COMMENT ON TABLE template_configs IS 'Configuration settings for each template';
COMMENT ON TABLE store_templates IS 'Tracks which template each store is using';
COMMENT ON TABLE template_categories IS 'Categories for organizing templates';
