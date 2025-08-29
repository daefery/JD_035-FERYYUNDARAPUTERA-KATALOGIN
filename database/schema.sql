-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Stores table
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,     -- store name for URL
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  address TEXT,
  latitude DECIMAL(10, 8),       -- store latitude coordinate
  longitude DECIMAL(11, 8),      -- store longitude coordinate
  phone TEXT,
  email TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table for menu items
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu items table
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stores
-- Authenticated users can view their own stores (for dashboard)
CREATE POLICY "Users can view their own stores" ON stores
  FOR SELECT USING (auth.uid() = user_id);

-- Public can view individual active stores (for public store pages)
CREATE POLICY "Public can view active stores" ON stores
  FOR SELECT USING (is_active = true);

-- Authenticated users can insert their own stores
CREATE POLICY "Users can insert their own stores" ON stores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Authenticated users can update their own stores
CREATE POLICY "Users can update their own stores" ON stores
  FOR UPDATE USING (auth.uid() = user_id);

-- Authenticated users can delete their own stores
CREATE POLICY "Users can delete their own stores" ON stores
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for categories
CREATE POLICY "Users can view categories of their stores" ON categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = categories.store_id 
      AND stores.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert categories for their stores" ON categories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = categories.store_id 
      AND stores.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update categories of their stores" ON categories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = categories.store_id 
      AND stores.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete categories of their stores" ON categories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = categories.store_id 
      AND stores.user_id = auth.uid()
    )
  );

-- RLS Policies for menu_items
CREATE POLICY "Users can view menu items of their stores" ON menu_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = menu_items.store_id 
      AND stores.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert menu items for their stores" ON menu_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = menu_items.store_id 
      AND stores.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update menu items of their stores" ON menu_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = menu_items.store_id 
      AND stores.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete menu items of their stores" ON menu_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = menu_items.store_id 
      AND stores.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_stores_user_id ON stores(user_id);
CREATE INDEX idx_stores_slug ON stores(slug);
CREATE INDEX idx_categories_store_id ON categories(store_id);
CREATE INDEX idx_menu_items_store_id ON menu_items(store_id);
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
