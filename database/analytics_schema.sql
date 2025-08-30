-- Analytics Schema for Store Performance Tracking

-- Store visits tracking
CREATE TABLE store_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  visitor_id TEXT, -- Anonymous visitor identifier
  session_id TEXT, -- Session identifier
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  device_type TEXT, -- mobile, desktop, tablet
  browser TEXT,
  os TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  visit_date DATE DEFAULT CURRENT_DATE,
  visit_time TIMESTAMPTZ DEFAULT NOW(),
  session_duration INTEGER, -- in seconds
  page_views INTEGER DEFAULT 1,
  is_bounce BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page views tracking
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  visitor_id TEXT,
  session_id TEXT,
  page_type TEXT, -- 'store', 'menu', 'contact', etc.
  page_url TEXT,
  view_time TIMESTAMPTZ DEFAULT NOW(),
  time_on_page INTEGER, -- in seconds
  scroll_depth INTEGER, -- percentage of page scrolled
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User interactions tracking
CREATE TABLE user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  visitor_id TEXT,
  session_id TEXT,
  interaction_type TEXT, -- 'email_click', 'phone_click', 'whatsapp_click', 'map_click', 'social_click', 'share_click', 'menu_item_click', 'category_click'
  interaction_target TEXT, -- specific item clicked (e.g., menu item name, social platform)
  interaction_data JSONB, -- additional data like coordinates, item details, etc.
  interaction_time TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu item performance tracking
CREATE TABLE menu_item_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  visitor_id TEXT,
  session_id TEXT,
  action_type TEXT, -- 'view', 'click', 'hover', 'share'
  action_time TIMESTAMPTZ DEFAULT NOW(),
  time_spent INTEGER, -- time spent viewing this item
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily analytics summary (for performance optimization)
CREATE TABLE daily_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_visits INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  total_page_views INTEGER DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0, -- in seconds
  bounce_rate DECIMAL(5,2) DEFAULT 0, -- percentage
  email_clicks INTEGER DEFAULT 0,
  phone_clicks INTEGER DEFAULT 0,
  whatsapp_clicks INTEGER DEFAULT 0,
  map_clicks INTEGER DEFAULT 0,
  social_clicks INTEGER DEFAULT 0,
  share_clicks INTEGER DEFAULT 0,
  menu_item_clicks INTEGER DEFAULT 0,
  mobile_visits INTEGER DEFAULT 0,
  desktop_visits INTEGER DEFAULT 0,
  tablet_visits INTEGER DEFAULT 0,
  top_countries JSONB, -- {"US": 150, "CA": 75, ...}
  top_cities JSONB, -- {"New York": 50, "Toronto": 25, ...}
  peak_hours JSONB, -- {"9": 25, "10": 30, "11": 45, ...}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE store_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for store_visits
CREATE POLICY "Store owners can view their store visits" ON store_visits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = store_visits.store_id 
      AND stores.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert store visits" ON store_visits
  FOR INSERT WITH CHECK (true);

-- RLS Policies for page_views
CREATE POLICY "Store owners can view their page views" ON page_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = page_views.store_id 
      AND stores.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert page views" ON page_views
  FOR INSERT WITH CHECK (true);

-- RLS Policies for user_interactions
CREATE POLICY "Store owners can view their user interactions" ON user_interactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = user_interactions.store_id 
      AND stores.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert user interactions" ON user_interactions
  FOR INSERT WITH CHECK (true);

-- RLS Policies for menu_item_analytics
CREATE POLICY "Store owners can view their menu item analytics" ON menu_item_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = menu_item_analytics.store_id 
      AND stores.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert menu item analytics" ON menu_item_analytics
  FOR INSERT WITH CHECK (true);

-- RLS Policies for daily_analytics
CREATE POLICY "Store owners can view their daily analytics" ON daily_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = daily_analytics.store_id 
      AND stores.user_id = auth.uid()
    )
  );

CREATE POLICY "Store owners can insert/update their daily analytics" ON daily_analytics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM stores 
      WHERE stores.id = daily_analytics.store_id 
      AND stores.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_store_visits_store_id ON store_visits(store_id);
CREATE INDEX idx_store_visits_date ON store_visits(visit_date);
CREATE INDEX idx_store_visits_visitor_id ON store_visits(visitor_id);
CREATE INDEX idx_page_views_store_id ON page_views(store_id);
CREATE INDEX idx_page_views_time ON page_views(view_time);
CREATE INDEX idx_user_interactions_store_id ON user_interactions(store_id);
CREATE INDEX idx_user_interactions_type ON user_interactions(interaction_type);
CREATE INDEX idx_menu_item_analytics_store_id ON menu_item_analytics(store_id);
CREATE INDEX idx_menu_item_analytics_item_id ON menu_item_analytics(menu_item_id);
CREATE INDEX idx_daily_analytics_store_id ON daily_analytics(store_id);
CREATE INDEX idx_daily_analytics_date ON daily_analytics(date);
CREATE UNIQUE INDEX idx_daily_analytics_store_date ON daily_analytics(store_id, date);

-- Function to update daily analytics
CREATE OR REPLACE FUNCTION update_daily_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert daily analytics for the store and date
  INSERT INTO daily_analytics (
    store_id, 
    date, 
    total_visits,
    unique_visitors,
    total_page_views,
    avg_session_duration,
    bounce_rate,
    email_clicks,
    phone_clicks,
    whatsapp_clicks,
    map_clicks,
    social_clicks,
    share_clicks,
    menu_item_clicks,
    mobile_visits,
    desktop_visits,
    tablet_visits,
    top_countries,
    top_cities,
    peak_hours
  )
  VALUES (
    NEW.store_id,
    NEW.visit_date,
    1, -- total_visits
    1, -- unique_visitors (will be calculated properly in aggregation)
    1, -- total_page_views
    COALESCE(NEW.session_duration, 0),
    CASE WHEN NEW.is_bounce THEN 100.0 ELSE 0.0 END,
    0, -- email_clicks
    0, -- phone_clicks
    0, -- whatsapp_clicks
    0, -- map_clicks
    0, -- social_clicks
    0, -- share_clicks
    0, -- menu_item_clicks
    CASE WHEN NEW.device_type = 'mobile' THEN 1 ELSE 0 END,
    CASE WHEN NEW.device_type = 'desktop' THEN 1 ELSE 0 END,
    CASE WHEN NEW.device_type = 'tablet' THEN 1 ELSE 0 END,
    '{}', -- top_countries
    '{}', -- top_cities
    '{}'  -- peak_hours
  )
  ON CONFLICT (store_id, date) DO UPDATE SET
    total_visits = daily_analytics.total_visits + 1,
    total_page_views = daily_analytics.total_page_views + COALESCE(NEW.page_views, 1),
    avg_session_duration = (daily_analytics.avg_session_duration + COALESCE(NEW.session_duration, 0)) / 2,
    bounce_rate = CASE 
      WHEN NEW.is_bounce THEN 
        (daily_analytics.bounce_rate * daily_analytics.total_visits + 100.0) / (daily_analytics.total_visits + 1)
      ELSE 
        (daily_analytics.bounce_rate * daily_analytics.total_visits) / (daily_analytics.total_visits + 1)
    END,
    mobile_visits = daily_analytics.mobile_visits + CASE WHEN NEW.device_type = 'mobile' THEN 1 ELSE 0 END,
    desktop_visits = daily_analytics.desktop_visits + CASE WHEN NEW.device_type = 'desktop' THEN 1 ELSE 0 END,
    tablet_visits = daily_analytics.tablet_visits + CASE WHEN NEW.device_type = 'tablet' THEN 1 ELSE 0 END,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update daily analytics
CREATE TRIGGER update_daily_analytics_trigger 
  AFTER INSERT ON store_visits
  FOR EACH ROW EXECUTE FUNCTION update_daily_analytics();

-- Function to update updated_at timestamp for daily_analytics
CREATE OR REPLACE FUNCTION update_daily_analytics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_daily_analytics_updated_at_trigger 
  BEFORE UPDATE ON daily_analytics
  FOR EACH ROW EXECUTE FUNCTION update_daily_analytics_updated_at();
