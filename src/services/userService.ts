/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase";

export const userService = {
  // Check if user has any stores
  async hasStores(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("stores")
      .select("id")
      .eq("user_id", userId)
      .limit(1);

    if (error) {
      console.error("Error checking user stores:", error);
      return false;
    }

    return data && data.length > 0;
  },

  // Get user's first store (for quick access)
  async getFirstStore(userId: string) {
    const { data, error } = await supabase
      .from("stores")
      .select("id, name, slug")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    if (error) {
      console.error("Error getting first store:", error);
      return null;
    }

    return data;
  },

  // Get user's store count
  async getStoreCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from("stores")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (error) {
      console.error("Error getting store count:", error);
      return 0;
    }

    return count || 0;
  },

  // Get user's active store count
  async getActiveStoreCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from("stores")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_active", true);

    if (error) {
      console.error("Error getting active store count:", error);
      return 0;
    }

    return count || 0;
  },

  // Get user profile data
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error getting user profile:", error);
      return null;
    }

    return data;
  },

  // Update user profile
  async updateUserProfile(userId: string, profileData: any) {
    const { data, error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get total views across all user's stores
  async getTotalViews(userId: string): Promise<number> {
    try {
      // First get all store IDs for the user
      const { data: stores, error: storesError } = await supabase
        .from("stores")
        .select("id")
        .eq("user_id", userId);

      if (storesError) {
        console.error("Error getting user stores:", storesError);
        return 0;
      }

      if (!stores || stores.length === 0) {
        return 0;
      }

      const storeIds = stores.map((store) => store.id);

      // Get total page views for all user's stores
      const { count: pageViewsCount, error: pageViewsError } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .in("store_id", storeIds);

      if (pageViewsError) {
        console.error("Error getting page views:", pageViewsError);
        return 0;
      }

      // Get total store visits for all user's stores
      const { count: storeVisitsCount, error: storeVisitsError } =
        await supabase
          .from("store_visits")
          .select("*", { count: "exact", head: true })
          .in("store_id", storeIds);

      if (storeVisitsError) {
        console.error("Error getting store visits:", storeVisitsError);
        return 0;
      }

      return (pageViewsCount || 0) + (storeVisitsCount || 0);
    } catch (error) {
      console.error("Error calculating total views:", error);
      return 0;
    }
  },

  // Get total menu items across all user's stores
  async getTotalMenuItems(userId: string): Promise<number> {
    try {
      // First get all store IDs for the user
      const { data: stores, error: storesError } = await supabase
        .from("stores")
        .select("id")
        .eq("user_id", userId);

      if (storesError) {
        console.error("Error getting user stores:", storesError);
        return 0;
      }

      if (!stores || stores.length === 0) {
        return 0;
      }

      const storeIds = stores.map((store) => store.id);

      // Get total menu items for all user's stores
      const { count, error } = await supabase
        .from("menu_items")
        .select("*", { count: "exact", head: true })
        .in("store_id", storeIds);

      if (error) {
        console.error("Error getting menu items:", error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error("Error calculating total menu items:", error);
      return 0;
    }
  },
};
