import { supabase } from "@/lib/supabase";
import {
  Category,
  CreateCategoryData,
  CreateMenuItemData,
  CreateStoreData,
  MenuItem,
  MenuItemWithCategory,
  Store,
  UpdateCategoryData,
  UpdateMenuItemData,
  UpdateStoreData,
} from "@/types/database";

export const storeService = {
  // Get all stores for the current user (dashboard)
  async getStores(): Promise<Store[]> {
    // Get current user for debugging
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("Authentication error:", authError);
      throw new Error(`Authentication error: ${authError.message}`);
    }

    if (!user) {
      console.error("No authenticated user found");
      throw new Error("User not authenticated");
    }

    // Use a more specific query to ensure we only get user's own stores
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("user_id", user.id) // Explicitly filter by user_id
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      throw new Error(`Error fetching stores: ${error.message}`);
    }

    return data || [];
  },

  // Get all stores for the current user (alternative method)
  async getUserStores(): Promise<Store[]> {
    // Get current user for debugging
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("Authentication error:", authError);
      throw new Error(`Authentication error: ${authError.message}`);
    }

    if (!user) {
      console.error("No authenticated user found");
      throw new Error("User not authenticated");
    }

    // Use a more specific query to ensure we only get user's own stores
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("user_id", user.id) // Explicitly filter by user_id
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      throw new Error(`Error fetching user stores: ${error.message}`);
    }

    return data || [];
  },

  // Get a single store by ID
  async getStore(id: string): Promise<Store | null> {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error fetching store: ${error.message}`);
    }

    return data;
  },

  // Get store by slug
  async getStoreBySlug(slug: string): Promise<Store | null> {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error) {
      throw new Error(`Error fetching store: ${error.message}`);
    }

    return data;
  },

  // Create a new store
  async createStore(storeData: CreateStoreData): Promise<Store> {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("stores")
      .insert([
        {
          ...storeData,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating store: ${error.message}`);
    }

    return data;
  },

  // Update a store
  async updateStore(id: string, storeData: UpdateStoreData): Promise<Store> {
    const { data, error } = await supabase
      .from("stores")
      .update(storeData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating store: ${error.message}`);
    }

    return data;
  },

  // Delete a store
  async deleteStore(id: string): Promise<void> {
    const { error } = await supabase.from("stores").delete().eq("id", id);

    if (error) {
      throw new Error(`Error deleting store: ${error.message}`);
    }
  },

  // Generate unique slug
  async generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const { data } = await supabase
        .from("stores")
        .select("id")
        .eq("slug", slug)
        .single();

      if (!data) {
        break; // Slug is unique
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  },
};

export const categoryService = {
  // Get all categories for a store
  async getCategories(storeId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("store_id", storeId)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      throw new Error(`Error fetching categories: ${error.message}`);
    }

    return data || [];
  },

  // Create a new category
  async createCategory(categoryData: CreateCategoryData): Promise<Category> {
    const { data, error } = await supabase
      .from("categories")
      .insert([categoryData])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating category: ${error.message}`);
    }

    return data;
  },

  // Update a category
  async updateCategory(
    id: string,
    categoryData: UpdateCategoryData
  ): Promise<Category> {
    const { data, error } = await supabase
      .from("categories")
      .update(categoryData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating category: ${error.message}`);
    }

    return data;
  },

  // Delete a category
  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      throw new Error(`Error deleting category: ${error.message}`);
    }
  },
};

export const menuItemService = {
  // Get all menu items for a store
  async getMenuItems(storeId: string): Promise<MenuItemWithCategory[]> {
    const { data, error } = await supabase
      .from("menu_items")
      .select(
        `
        *,
        category:categories (
          id,
          name,
          description
        )
      `
      )
      .eq("store_id", storeId)
      .order("sort_order", { ascending: true });

    if (error) {
      throw new Error(`Error fetching menu items: ${error.message}`);
    }

    return data || [];
  },

  // Get menu items by category
  async getMenuItemsByCategory(
    storeId: string,
    categoryId: string
  ): Promise<MenuItemWithCategory[]> {
    const { data, error } = await supabase
      .from("menu_items")
      .select(
        `
        *,
        category:categories (
          id,
          name,
          description
        )
      `
      )
      .eq("store_id", storeId)
      .eq("category_id", categoryId)
      .eq("is_available", true)
      .order("sort_order", { ascending: true });

    if (error) {
      throw new Error(`Error fetching menu items: ${error.message}`);
    }

    return data || [];
  },

  // Create a new menu item
  async createMenuItem(menuItemData: CreateMenuItemData): Promise<MenuItem> {
    const { data, error } = await supabase
      .from("menu_items")
      .insert([menuItemData])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating menu item: ${error.message}`);
    }

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

    if (error) {
      throw new Error(`Error updating menu item: ${error.message}`);
    }

    return data;
  },

  // Delete a menu item
  async deleteMenuItem(id: string): Promise<void> {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);

    if (error) {
      throw new Error(`Error deleting menu item: ${error.message}`);
    }
  },
};
