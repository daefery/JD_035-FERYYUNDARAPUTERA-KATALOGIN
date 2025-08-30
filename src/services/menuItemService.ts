import { supabase } from "@/lib/supabase";
import {
  CreateMenuItemData,
  MenuItem,
  UpdateMenuItemData,
} from "@/types/database";

export const menuItemService = {
  // Get all menu items for a store
  async getMenuItems(storeId: string): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from("menu_items")
      .select(
        `
        *,
        category:categories(name, sort_order)
      `
      )
      .eq("store_id", storeId)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get menu items by category
  async getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("category_id", categoryId)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get a single menu item
  async getMenuItem(id: string): Promise<MenuItem | null> {
    const { data, error } = await supabase
      .from("menu_items")
      .select(
        `
        *,
        category:categories(name)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new menu item
  async createMenuItem(menuItemData: CreateMenuItemData): Promise<MenuItem> {
    const { data, error } = await supabase
      .from("menu_items")
      .insert([menuItemData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a menu item
  async updateMenuItem(
    id: string,
    menuItemData: UpdateMenuItemData
  ): Promise<MenuItem> {
    const { data, error } = await supabase
      .from("menu_items")
      .update(menuItemData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a menu item
  async deleteMenuItem(id: string): Promise<void> {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);

    if (error) throw error;
  },

  // Reorder menu items
  async reorderMenuItems(
    categoryId: string,
    menuItemIds: string[]
  ): Promise<void> {
    const updates = menuItemIds.map((id, index) => ({
      id,
      sort_order: index + 1,
    }));

    const { error } = await supabase
      .from("menu_items")
      .upsert(updates, { onConflict: "id" });

    if (error) throw error;
  },

  // Toggle menu item availability
  async toggleAvailability(
    id: string,
    isAvailable: boolean
  ): Promise<MenuItem> {
    const { data, error } = await supabase
      .from("menu_items")
      .update({ is_available: isAvailable })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Search menu items
  async searchMenuItems(storeId: string, query: string): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from("menu_items")
      .select(
        `
        *,
        category:categories(name)
      `
      )
      .eq("store_id", storeId)
      .ilike("name", `%${query}%`)
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  },
};
