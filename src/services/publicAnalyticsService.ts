import {
  MenuItemAnalytics,
  PageView,
  StoreVisit,
  UserInteraction,
} from "@/types/analytics";
import { createClient } from "@supabase/supabase-js";

// Create anonymous Supabase client for public analytics
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const publicAnalyticsService = {
  // Validate store exists and is active
  async validateStore(storeId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("stores")
        .select("id, is_active")
        .eq("id", storeId)
        .eq("is_active", true)
        .single();

      if (error || !data) {
        console.error("Store validation failed:", error);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Store validation error:", err);
      return false;
    }
  },

  // Track store visit
  async trackStoreVisit(visitData: Partial<StoreVisit>): Promise<StoreVisit> {
    try {
      const { data, error } = await supabase
        .from("store_visits")
        .insert([visitData])
        .select()
        .single();

      if (error) {
        console.error("Public store visit tracking error:", error);
        console.error("Error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
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
      console.error("Public store visit tracking failed:", err);
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
        console.error("Public page view tracking error:", error);
        console.error("Error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
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
      console.error("Public page view tracking failed:", err);
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
        console.error("Public user interaction tracking error:", error);
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
      console.error("Public user interaction tracking failed:", err);
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
        console.error("Public menu item analytics tracking error:", error);
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
      console.error("Public menu item analytics tracking failed:", err);
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
};
