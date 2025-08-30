/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase";
import {
  AnalyticsFilters,
  AnalyticsPeriod,
  AnalyticsSummary,
  CategoryPerformance,
  DailyAnalytics,
  MenuItemAnalytics,
  MenuItemPerformance,
  PageView,
  StoreVisit,
  UserInteraction,
} from "@/types/analytics";

// Analytics Service for tracking and retrieving store performance data
export const analyticsService = {
  // Track store visit
  async trackStoreVisit(visitData: Partial<StoreVisit>): Promise<StoreVisit> {
    try {
      const { data, error } = await supabase
        .from("store_visits")
        .insert([visitData])
        .select()
        .single();

      if (error) {
        console.error("Analytics tracking error:", error);
        console.error("Error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        // Don't throw error to prevent breaking the user experience
        // Return a mock object to prevent crashes
        return {
          id: "error",
          store_id: visitData.store_id || "",
          visitor_id: visitData.visitor_id || "",
          session_id: visitData.session_id || "",
          visit_date: visitData.visit_date || "",
          visit_time: visitData.visit_time || "",
          page_views: visitData.page_views || 1,
          is_bounce: visitData.is_bounce || true,
          created_at: new Date().toISOString(),
        } as StoreVisit;
      }

      return data;
    } catch (err) {
      console.error("Analytics tracking failed:", err);
      // Return a mock object to prevent crashes
      return {
        id: "error",
        store_id: visitData.store_id || "",
        visitor_id: visitData.visitor_id || "",
        session_id: visitData.session_id || "",
        visit_date: visitData.visit_date || "",
        visit_time: visitData.visit_time || "",
        page_views: visitData.page_views || 1,
        is_bounce: visitData.is_bounce || true,
        created_at: new Date().toISOString(),
      } as StoreVisit;
    }
  },

  // Track page view
  async trackPageView(pageViewData: Partial<PageView>): Promise<PageView> {
    try {
      const { data, error } = await supabase
        .from("page_views")
        .insert([pageViewData])
        .select()
        .single();

      if (error) {
        console.error("Page view tracking error:", error);
        return {
          id: "error",
          store_id: pageViewData.store_id || "",
          visitor_id: pageViewData.visitor_id || "",
          session_id: pageViewData.session_id || "",
          page_type: pageViewData.page_type || "",
          page_url: pageViewData.page_url || "",
          view_time: pageViewData.view_time || new Date().toISOString(),
          created_at: new Date().toISOString(),
        } as PageView;
      }

      return data;
    } catch (err) {
      console.error("Page view tracking failed:", err);
      return {
        id: "error",
        store_id: pageViewData.store_id || "",
        visitor_id: pageViewData.visitor_id || "",
        session_id: pageViewData.session_id || "",
        page_type: pageViewData.page_type || "",
        page_url: pageViewData.page_url || "",
        view_time: pageViewData.view_time || new Date().toISOString(),
        created_at: new Date().toISOString(),
      } as PageView;
    }
  },

  // Track user interaction
  async trackUserInteraction(
    interactionData: Partial<UserInteraction>
  ): Promise<UserInteraction> {
    try {
      const { data, error } = await supabase
        .from("user_interactions")
        .insert([interactionData])
        .select()
        .single();

      if (error) {
        console.error("User interaction tracking error:", error);
        return {
          id: "error",
          store_id: interactionData.store_id || "",
          visitor_id: interactionData.visitor_id || "",
          session_id: interactionData.session_id || "",
          interaction_type: interactionData.interaction_type || "unknown",
          interaction_target: interactionData.interaction_target || "",
          interaction_time:
            interactionData.interaction_time || new Date().toISOString(),
          created_at: new Date().toISOString(),
        } as UserInteraction;
      }

      return data;
    } catch (err) {
      console.error("User interaction tracking failed:", err);
      return {
        id: "error",
        store_id: interactionData.store_id || "",
        visitor_id: interactionData.visitor_id || "",
        session_id: interactionData.session_id || "",
        interaction_type: interactionData.interaction_type || "unknown",
        interaction_target: interactionData.interaction_target || "",
        interaction_time:
          interactionData.interaction_time || new Date().toISOString(),
        created_at: new Date().toISOString(),
      } as UserInteraction;
    }
  },

  // Track menu item analytics
  async trackMenuItemAnalytics(
    analyticsData: Partial<MenuItemAnalytics>
  ): Promise<MenuItemAnalytics> {
    try {
      const { data, error } = await supabase
        .from("menu_item_analytics")
        .insert([analyticsData])
        .select()
        .single();

      if (error) {
        console.error("Menu item analytics tracking error:", error);
        return {
          id: "error",
          store_id: analyticsData.store_id || "",
          menu_item_id: analyticsData.menu_item_id || "",
          visitor_id: analyticsData.visitor_id || "",
          session_id: analyticsData.session_id || "",
          action_type: analyticsData.action_type || "view",
          action_time: analyticsData.action_time || new Date().toISOString(),
          created_at: new Date().toISOString(),
        } as MenuItemAnalytics;
      }

      return data;
    } catch (err) {
      console.error("Menu item analytics tracking failed:", err);
      return {
        id: "error",
        store_id: analyticsData.store_id || "",
        menu_item_id: analyticsData.menu_item_id || "",
        visitor_id: analyticsData.visitor_id || "",
        session_id: analyticsData.session_id || "",
        action_type: analyticsData.action_type || "view",
        action_time: analyticsData.action_time || new Date().toISOString(),
        created_at: new Date().toISOString(),
      } as MenuItemAnalytics;
    }
  },

  // Get analytics summary for a store
  async getAnalyticsSummary(
    storeId: string,
    filters: AnalyticsFilters
  ): Promise<AnalyticsSummary> {
    const { start_date, end_date } = this.getDateRange(
      filters.period,
      filters.start_date,
      filters.end_date
    );

    // Get daily analytics for the period
    const { data: dailyAnalytics, error: dailyError } = await supabase
      .from("daily_analytics")
      .select("*")
      .eq("store_id", storeId)
      .gte("date", start_date)
      .lte("date", end_date)
      .order("date", { ascending: true });

    if (dailyError) {
      throw new Error(`Error fetching daily analytics: ${dailyError.message}`);
    }

    // Get user interactions for the period
    const { data: interactions, error: interactionsError } = await supabase
      .from("user_interactions")
      .select("*")
      .eq("store_id", storeId)
      .gte("interaction_time", start_date)
      .lte("interaction_time", end_date);

    if (interactionsError) {
      throw new Error(
        `Error fetching user interactions: ${interactionsError.message}`
      );
    }

    // Calculate summary
    const summary = this.calculateAnalyticsSummary(
      dailyAnalytics || [],
      interactions || []
    );

    return summary;
  },

  // Get menu item performance
  async getMenuItemPerformance(
    storeId: string,
    filters: AnalyticsFilters
  ): Promise<MenuItemPerformance[]> {
    const { start_date, end_date } = this.getDateRange(
      filters.period,
      filters.start_date,
      filters.end_date
    );

    const { data, error } = await supabase
      .from("menu_item_analytics")
      .select(
        `
        *,
        menu_items (
          id,
          name
        )
      `
      )
      .eq("store_id", storeId)
      .gte("action_time", start_date)
      .lte("action_time", end_date);

    if (error) {
      throw new Error(`Error fetching menu item performance: ${error.message}`);
    }

    return this.calculateMenuItemPerformance(data || []);
  },

  // Get category performance
  async getCategoryPerformance(
    storeId: string,
    filters: AnalyticsFilters
  ): Promise<CategoryPerformance[]> {
    const { start_date, end_date } = this.getDateRange(
      filters.period,
      filters.start_date,
      filters.end_date
    );

    const { data, error } = await supabase
      .from("menu_item_analytics")
      .select(
        `
        *,
        menu_items (
          id,
          name,
          category_id,
          categories (
            id,
            name
          )
        )
      `
      )
      .eq("store_id", storeId)
      .gte("action_time", start_date)
      .lte("action_time", end_date);

    if (error) {
      throw new Error(`Error fetching category performance: ${error.message}`);
    }

    return this.calculateCategoryPerformance(data || []);
  },

  // Get real-time analytics (last 24 hours)
  async getRealTimeAnalytics(storeId: string): Promise<{
    current_visitors: number;
    today_visits: number;
    today_interactions: number;
    top_pages: Array<{ page: string; views: number }>;
    recent_interactions: Array<{ type: string; time: string; target: string }>;
  }> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Get current active sessions (last 30 minutes)
    const thirtyMinutesAgo = new Date();
    thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);

    const { data: currentSessions, error: sessionsError } = await supabase
      .from("store_visits")
      .select("session_id")
      .eq("store_id", storeId)
      .gte("visit_time", thirtyMinutesAgo.toISOString());

    if (sessionsError) {
      throw new Error(
        `Error fetching current sessions: ${sessionsError.message}`
      );
    }

    // Get today's data
    const { data: todayData, error: todayError } = await supabase
      .from("daily_analytics")
      .select("*")
      .eq("store_id", storeId)
      .eq("date", new Date().toISOString().split("T")[0])
      .single();

    if (todayError && todayError.code !== "PGRST116") {
      // PGRST116 is "not found"
      throw new Error(
        `Error fetching today's analytics: ${todayError.message}`
      );
    }

    // Get recent interactions
    const { data: recentInteractions, error: interactionsError } =
      await supabase
        .from("user_interactions")
        .select("interaction_type, interaction_target, interaction_time")
        .eq("store_id", storeId)
        .gte("interaction_time", yesterday.toISOString())
        .order("interaction_time", { ascending: false })
        .limit(10);

    if (interactionsError) {
      throw new Error(
        `Error fetching recent interactions: ${interactionsError.message}`
      );
    }

    // Get top pages
    const { data: topPages, error: pagesError } = await supabase
      .from("page_views")
      .select("page_type, count")
      .eq("store_id", storeId)
      .gte("view_time", yesterday.toISOString())
      .order("count", { ascending: false })
      .limit(5);

    if (pagesError) {
      throw new Error(`Error fetching top pages: ${pagesError.message}`);
    }

    return {
      current_visitors: currentSessions?.length || 0,
      today_visits: todayData?.total_visits || 0,
      today_interactions: todayData
        ? todayData.email_clicks +
          todayData.phone_clicks +
          todayData.whatsapp_clicks +
          todayData.map_clicks +
          todayData.social_clicks +
          todayData.share_clicks +
          todayData.menu_item_clicks
        : 0,
      top_pages:
        topPages?.map((p) => ({ page: p.page_type, views: p.count })) || [],
      recent_interactions:
        recentInteractions?.map((i) => ({
          type: i.interaction_type,
          time: i.interaction_time,
          target: i.interaction_target,
        })) || [],
    };
  },

  // Export analytics data
  async exportAnalytics(
    storeId: string,
    options: {
      format: "csv" | "json";
      period: AnalyticsPeriod;
      start_date?: string;
      end_date?: string;
    }
  ): Promise<string> {
    const { start_date, end_date } = this.getDateRange(
      options.period,
      options.start_date,
      options.end_date
    );

    const { data, error } = await supabase
      .from("daily_analytics")
      .select("*")
      .eq("store_id", storeId)
      .gte("date", start_date)
      .lte("date", end_date)
      .order("date", { ascending: true });

    if (error) {
      throw new Error(`Error exporting analytics: ${error.message}`);
    }

    if (options.format === "json") {
      return JSON.stringify(data, null, 2);
    } else {
      // Convert to CSV
      const headers = Object.keys(data[0] || {}).join(",");
      const rows = data?.map((row) => Object.values(row).join(",")) || [];
      return [headers, ...rows].join("\n");
    }
  },

  // Helper methods
  getDateRange(
    period: AnalyticsPeriod,
    start_date?: string,
    end_date?: string
  ): { start_date: string; end_date: string } {
    const now = new Date();
    let start: Date;
    let end: Date = now;

    switch (period) {
      case "today":
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "yesterday":
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "last_7_days":
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "last_30_days":
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "last_90_days":
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "this_month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "last_month":
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "custom":
        start = start_date ? new Date(start_date) : now;
        end = end_date ? new Date(end_date) : now;
        break;
      default:
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return {
      start_date: start.toISOString().split("T")[0],
      end_date: end.toISOString().split("T")[0],
    };
  },

  calculateAnalyticsSummary(
    dailyAnalytics: DailyAnalytics[],
    interactions: UserInteraction[]
  ): AnalyticsSummary {
    const total_visits = dailyAnalytics.reduce(
      (sum, day) => sum + day.total_visits,
      0
    );
    const total_page_views = dailyAnalytics.reduce(
      (sum, day) => sum + day.total_page_views,
      0
    );
    const total_interactions = dailyAnalytics.reduce(
      (sum, day) =>
        sum +
        day.email_clicks +
        day.phone_clicks +
        day.whatsapp_clicks +
        day.map_clicks +
        day.social_clicks +
        day.share_clicks +
        day.menu_item_clicks,
      0
    );

    // Calculate average session duration
    const total_duration = dailyAnalytics.reduce(
      (sum, day) => sum + day.avg_session_duration,
      0
    );
    const avg_session_duration =
      dailyAnalytics.length > 0 ? total_duration / dailyAnalytics.length : 0;

    // Calculate bounce rate
    const total_bounce_visits = dailyAnalytics.reduce(
      (sum, day) =>
        sum + Math.round((day.bounce_rate / 100) * day.total_visits),
      0
    );
    const bounce_rate =
      total_visits > 0 ? (total_bounce_visits / total_visits) * 100 : 0;

    // Calculate device breakdown
    const device_breakdown = {
      mobile: dailyAnalytics.reduce((sum, day) => sum + day.mobile_visits, 0),
      desktop: dailyAnalytics.reduce((sum, day) => sum + day.desktop_visits, 0),
      tablet: dailyAnalytics.reduce((sum, day) => sum + day.tablet_visits, 0),
    };

    // Calculate top interactions
    const interactionCounts: Record<string, number> = {};
    interactions.forEach((interaction) => {
      interactionCounts[interaction.interaction_type] =
        (interactionCounts[interaction.interaction_type] || 0) + 1;
    });

    const top_interactions = Object.entries(interactionCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate daily trends
    const daily_trends = dailyAnalytics.map((day) => ({
      date: day.date,
      visits: day.total_visits,
      interactions:
        day.email_clicks +
        day.phone_clicks +
        day.whatsapp_clicks +
        day.map_clicks +
        day.social_clicks +
        day.share_clicks +
        day.menu_item_clicks,
    }));

    return {
      total_visits,
      unique_visitors: total_visits, // Simplified - in real implementation, calculate unique visitors
      total_page_views,
      avg_session_duration,
      bounce_rate,
      total_interactions,
      top_interactions,
      device_breakdown,
      top_countries: [], // Would need to aggregate from daily analytics
      top_cities: [], // Would need to aggregate from daily analytics
      peak_hours: [], // Would need to aggregate from daily analytics
      daily_trends,
    };
  },

  calculateMenuItemPerformance(data: any[]): MenuItemPerformance[] {
    const performanceMap: Record<string, MenuItemPerformance> = {};

    data.forEach((item) => {
      const menuItemId = item.menu_item_id;
      const menuItemName = item.menu_items?.name || "Unknown";

      if (!performanceMap[menuItemId]) {
        performanceMap[menuItemId] = {
          menu_item_id: menuItemId,
          menu_item_name: menuItemName,
          views: 0,
          clicks: 0,
          hover_time: 0,
          shares: 0,
          engagement_rate: 0,
        };
      }

      const performance = performanceMap[menuItemId];

      switch (item.action_type) {
        case "view":
          performance.views++;
          break;
        case "click":
          performance.clicks++;
          break;
        case "hover":
          performance.hover_time += item.time_spent || 0;
          break;
        case "share":
          performance.shares++;
          break;
      }
    });

    // Calculate engagement rate
    Object.values(performanceMap).forEach((performance) => {
      performance.engagement_rate =
        performance.views > 0
          ? ((performance.clicks + performance.shares) / performance.views) *
            100
          : 0;
    });

    return Object.values(performanceMap).sort(
      (a, b) => b.engagement_rate - a.engagement_rate
    );
  },

  calculateCategoryPerformance(data: any[]): CategoryPerformance[] {
    const categoryMap: Record<string, CategoryPerformance> = {};

    data.forEach((item) => {
      const categoryId = item.menu_items?.categories?.id;
      const categoryName = item.menu_items?.categories?.name || "Uncategorized";

      if (!categoryMap[categoryId]) {
        categoryMap[categoryId] = {
          category_id: categoryId,
          category_name: categoryName,
          total_views: 0,
          total_clicks: 0,
          menu_items_count: 0,
          avg_engagement: 0,
        };
      }

      const category = categoryMap[categoryId];

      if (item.action_type === "view") {
        category.total_views++;
      } else if (item.action_type === "click") {
        category.total_clicks++;
      }
    });

    // Calculate average engagement
    Object.values(categoryMap).forEach((category) => {
      category.avg_engagement =
        category.total_views > 0
          ? (category.total_clicks / category.total_views) * 100
          : 0;
    });

    return Object.values(categoryMap).sort(
      (a, b) => b.avg_engagement - a.avg_engagement
    );
  },
};
