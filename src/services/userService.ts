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
};
