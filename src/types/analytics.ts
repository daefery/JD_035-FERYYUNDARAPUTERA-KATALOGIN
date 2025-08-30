// Analytics Types for Store Performance Tracking

export interface StoreVisit {
  id: string;
  store_id: string;
  visitor_id: string;
  session_id: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  device_type?: "mobile" | "desktop" | "tablet";
  browser?: string;
  os?: string;
  country?: string;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  visit_date: string;
  visit_time: string;
  session_duration?: number;
  page_views: number;
  is_bounce: boolean;
  created_at: string;
}

export interface PageView {
  id: string;
  store_id: string;
  visitor_id: string;
  session_id: string;
  page_type: string;
  page_url: string;
  view_time: string;
  time_on_page?: number;
  scroll_depth?: number;
  created_at: string;
}

export interface UserInteraction {
  id: string;
  store_id: string;
  visitor_id: string;
  session_id: string;
  interaction_type:
    | "email_click"
    | "phone_click"
    | "whatsapp_click"
    | "map_click"
    | "social_click"
    | "share_click"
    | "menu_item_click"
    | "category_click";
  interaction_target: string;
  interaction_data?: Record<string, unknown>;
  interaction_time: string;
  created_at: string;
}

export interface MenuItemAnalytics {
  id: string;
  store_id: string;
  menu_item_id: string;
  visitor_id: string;
  session_id: string;
  action_type: "view" | "click" | "hover" | "share";
  action_time: string;
  time_spent?: number;
  created_at: string;
}

export interface DailyAnalytics {
  id: string;
  store_id: string;
  date: string;
  total_visits: number;
  unique_visitors: number;
  total_page_views: number;
  avg_session_duration: number;
  bounce_rate: number;
  email_clicks: number;
  phone_clicks: number;
  whatsapp_clicks: number;
  map_clicks: number;
  social_clicks: number;
  share_clicks: number;
  menu_item_clicks: number;
  mobile_visits: number;
  desktop_visits: number;
  tablet_visits: number;
  top_countries: Record<string, number>;
  top_cities: Record<string, number>;
  peak_hours: Record<string, number>;
  created_at: string;
  updated_at: string;
}

// Analytics Summary Types
export interface AnalyticsSummary {
  total_visits: number;
  unique_visitors: number;
  total_page_views: number;
  avg_session_duration: number;
  bounce_rate: number;
  total_interactions: number;
  top_interactions: Array<{
    type: string;
    count: number;
  }>;
  device_breakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  top_countries: Array<{
    country: string;
    visits: number;
  }>;
  top_cities: Array<{
    city: string;
    visits: number;
  }>;
  peak_hours: Array<{
    hour: number;
    visits: number;
  }>;
  daily_trends: Array<{
    date: string;
    visits: number;
    interactions: number;
  }>;
}

export interface MenuItemPerformance {
  menu_item_id: string;
  menu_item_name: string;
  views: number;
  clicks: number;
  hover_time: number;
  shares: number;
  engagement_rate: number;
}

export interface CategoryPerformance {
  category_id: string;
  category_name: string;
  total_views: number;
  total_clicks: number;
  menu_items_count: number;
  avg_engagement: number;
}

// Analytics Time Periods
export type AnalyticsPeriod =
  | "today"
  | "yesterday"
  | "last_7_days"
  | "last_30_days"
  | "last_90_days"
  | "this_month"
  | "last_month"
  | "custom";

// Analytics Filters
export interface AnalyticsFilters {
  period: AnalyticsPeriod;
  start_date?: string;
  end_date?: string;
  device_type?: "mobile" | "desktop" | "tablet";
  country?: string;
  city?: string;
}

// Analytics Export Options
export interface AnalyticsExportOptions {
  format: "csv" | "json" | "pdf";
  period: AnalyticsPeriod;
  include_details: boolean;
  filters?: AnalyticsFilters;
}
